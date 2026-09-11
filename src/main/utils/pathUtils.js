const fs = require('fs');
const os = require('os');
const path = require('path');
const electron = require('electron');

const app = electron.app || (electron.remote && electron.remote.app);
const STORAGE_DIR_NAME = 'StorageReport';

function getElectronPath(name) {
    try {
        if (app && app.getPath) {
            return app.getPath(name);
        }
    } catch (e) {
    }
    return '';
}

function ensureDirSync(dirname) {
    if (!dirname || fs.existsSync(dirname)) {
        return;
    }
    ensureDirSync(path.dirname(dirname));
    fs.mkdirSync(dirname);
}

function getStorageRoot() {
    if (process.platform === 'win32') {
        return path.join(os.homedir(), 'AppData', 'Local', STORAGE_DIR_NAME);
    }
    return getElectronPath('userData') || path.join(os.homedir(), '.config', STORAGE_DIR_NAME);
}

function isWindowsOnlyPath(value) {
    if (!value || typeof value !== 'string') {
        return false;
    }
    return /^[a-zA-Z]:[\\/]/.test(value) || /AppData[\\/]Local[\\/]StorageReport/i.test(value);
}

function getLibraryRoot() {
    if (process.platform === 'win32') {
        return 'd://VRlib';
    }
    return path.join(getStorageRoot(), 'VRlib');
}

function normalizeLibraryRoot(value) {
    if (process.platform !== 'win32' && (!value || isWindowsOnlyPath(value))) {
        return getLibraryRoot();
    }
    return value || getLibraryRoot();
}

function getConfigFilePath(fileName) {
    return path.join(getStorageRoot(), fileName || 'app.json');
}

function getInstallRoot() {
    if (process.env.NODE_ENV === 'development') {
        return process.cwd();
    }
    if (process.resourcesPath) {
        return path.resolve(process.resourcesPath, '..');
    }
    const exePath = getElectronPath('exe');
    return exePath ? path.dirname(exePath) : process.cwd();
}

function resolveInstallFile() {
    const segments = Array.prototype.slice.call(arguments);
    return path.join.apply(path, [getInstallRoot()].concat(segments));
}

function getDbPath(fileName) {
    return path.join(getStorageRoot(), fileName);
}

function getTrainDbPath(fileName) {
    return path.join(getStorageRoot(), 'train', fileName);
}

function getLogFilePath(fileName) {
    return path.join(getStorageRoot(), 'logs', fileName || 'vr-manager.log');
}

function resolveInside(root) {
    const segments = Array.prototype.slice.call(arguments, 1);
    const resolvedRoot = path.resolve(root);
    const resolvedPath = path.resolve.apply(path, [resolvedRoot].concat(segments));
    if (resolvedPath !== resolvedRoot && resolvedPath.indexOf(resolvedRoot + path.sep) !== 0) {
        throw new Error('Illegal path outside root: ' + resolvedPath);
    }
    return resolvedPath;
}

module.exports = {
    ensureDirSync: ensureDirSync,
    getConfigFilePath: getConfigFilePath,
    getDbPath: getDbPath,
    getInstallRoot: getInstallRoot,
    getLibraryRoot: getLibraryRoot,
    getLogFilePath: getLogFilePath,
    getStorageRoot: getStorageRoot,
    getTrainDbPath: getTrainDbPath,
    isWindowsOnlyPath: isWindowsOnlyPath,
    normalizeLibraryRoot: normalizeLibraryRoot,
    resolveInstallFile: resolveInstallFile,
    resolveInside: resolveInside
};
