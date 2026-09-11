const { execSync } = require('child_process')
const { existsSync } = require('fs')
const { resolve } = require('path')

const pkg = require('./package.json')

Object.keys(pkg.dependencies).forEach(k => {
    const WorkPath = resolve(__dirname, 'node_modules', k)
    if (existsSync(resolve(WorkPath, 'binding.gyp'))) {
        const CMDStr = `node-gyp rebuild --arch=x64 --target=${pkg.devDependencies.electron} --dist-url=https://npm.taobao.org/mirrors/atom-shell`
        execSync(CMDStr, { cwd: WorkPath, stdio: [0, 1, 2] })
    }
})
