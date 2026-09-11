// 记录程序开启与关闭到浏览器缓存（localStorage）

function getRecords() {
  try {
    const raw = localStorage.getItem('programRecords');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setRecords(records) {
  try {
    localStorage.setItem('programRecords', JSON.stringify(records));
    console.log('记录已保存',JSON.parse(localStorage.getItem('programRecords')))
  } catch (e) {
    // 忽略写入异常
  }
}

function pad2(n) {
  return n < 10 ? '0' + n : '' + n;
}

// yyyy-mm-dd hh:mm:ss 本地时间
function formatDate(date = new Date()) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const mm = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

function normalizeId(par) {
  return par && (par._id || par.onlyId || par.id || null);
}

function normalizeName(par) {
  // 软件名称只取字段 name
  return par && (par.name || '未知软件');
}

export function addStartRecord(par) {
  const records = getRecords();
  const record = {
    id: normalizeId(par),
    name: normalizeName(par),
    startTime: formatDate(new Date()),
    endTime: null,
  };
  records.push(record);
  setRecords(records);
}

export function updateEndRecord(par) {
  const records = getRecords();
  const id = normalizeId(par);
  const name = normalizeName(par);
  // 使用当前本地时间并格式化为 yyyy-mm-dd hh:mm:ss
  const closedTime = formatDate(new Date());

  let idx = -1;
  if (id) {
    idx = records.findIndex((r) => r.id === id && !r.endTime);
  }
  if (idx === -1 && name) {
    idx = records.findIndex((r) => r.name === name && !r.endTime);
  }

  if (idx !== -1) {
    records[idx].endTime = closedTime;
  } else {
    // 未找到匹配的开始记录时，补充一条闭合记录
    records.push({
      id,
      name,
      startTime: (par && par.startTime) || null,
      endTime: closedTime,
    });
  }

  setRecords(records);
}

export function getProgramRecords() {
  return getRecords();
}
