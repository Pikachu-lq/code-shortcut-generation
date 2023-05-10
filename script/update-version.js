/*
 * @Author       : liqiao
 * @Date         : 2023-05-09 15:40:30
 * @LastEditors  : liqiao
 * @LastEditTime : 2023-05-09 15:49:01
 * @Description  : Do not edit
 * @FilePath     : /code-shortcut-generation/script/update-version.js
 */
const path = require('path');
const fs = require('fs');
const packageJson = require('../package.json');

const filePath = path.resolve(__dirname, '../package.json');

function getJsonData() {
    return packageJson;
}

function getNewVersion(version) {
    const [major = 1, minor = 0, patch = 0] = version.split('.');
    let newPatch = +patch + 1;
    let newMinor = +minor;
    let newMajor = +major;
    if (newPatch > 99) {
        newPatch = 0;
        newMinor += 1;
    }
    if (newMinor > 99) {
        newMinor = 0;
        newMajor += 1;
    }
    return `${newMajor}.${newMinor}.${newPatch}`;
}

function updateVersion(data) {
    console.log("🚀 ~ file: update-version.js:37 ~ updateVersion ~ filePath, data:", filePath, data);

    fs.writeFileSync(filePath, data);
}
function exec() {
    const jsonData = getJsonData();
    console.log("🚀 ~ file: update-version.js:40 ~ exec ~ jsonData:", jsonData.version);
    const newVersion = getNewVersion(jsonData.version);
    console.log("🚀 ~ file: update-version.js:42 ~ exec ~ newVersion:", newVersion);
    jsonData.version = newVersion;
    console.log("🚀 ~ file: update-version.js:43 ~ exec ~ jsonData:", jsonData.version);
    updateVersion(JSON.stringify(jsonData, null, 4));
}

exec();