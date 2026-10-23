#!/usr/bin/env bash
# Run on the disposable Ubuntu CI runner, never as a root desktop session.
set -euo pipefail

deb="${1:-build/VR管理平台.deb}"
depends=$(dpkg-deb --field "$deb" Depends)
printf 'Deb dependencies: %s\n' "$depends"
# electron-builder 20 adds this obsolete tray dependency by default. The app
# does not use Tray; retain the remaining dependencies in build.deb.depends.
if [[ "$depends" == *libappindicator1* ]]; then
  echo 'Unexpected mandatory libappindicator1 dependency' >&2
  exit 1
fi
test "$(dpkg-deb --field "$deb" Architecture)" = amd64
sudo apt-get install -y "$(realpath "$deb")"

package=$(dpkg-deb --field "$deb" Package)
executable=$(dpkg-query -L "$package" | grep '/vr-manage$' | head -n 1)
test -x "$executable"
ldd_output=$(ldd "$executable")
printf '%s\n' "$ldd_output"
if [[ "$ldd_output" == *'not found'* ]]; then
  echo 'Installed executable has missing shared libraries' >&2
  exit 1
fi
desktop=$(dpkg-query -L "$package" | grep '/applications/.*\.desktop$' | head -n 1)
grep -Fx 'Name=VR管理平台' "$desktop"
grep '^Exec=' "$desktop"

# Check the real packaged app in a virtual display as the unprivileged runner.
# A GUI app should remain alive until timeout AND finish loading its page.
log_file=$(mktemp)
trap 'rm -f -- "$log_file"' EXIT
set +e
timeout --kill-after=5s 30s xvfb-run -a "$executable" >"$log_file" 2>&1
status=$?
set -e
cat "$log_file"
if [[ "$status" -ne 124 ]]; then
  echo "Application exited before the smoke-test timeout (status $status)" >&2
  exit 1
fi
grep -F '页面加载完成' "$log_file"
if grep -E 'Caught exception:|Bus error|Segmentation fault' "$log_file"; then
  echo 'Startup smoke test reported a crash' >&2
  exit 1
fi
echo 'Deb installation, Chinese desktop name and startup smoke test passed.'
