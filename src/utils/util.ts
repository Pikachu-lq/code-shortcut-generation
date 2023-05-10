/*
 * @Author       : liqiao
 * @Date         : 2023-05-10 14:01:08
 * @LastEditors  : liqiao
 * @LastEditTime : 2023-05-10 14:06:39
 * @Description  : Do not edit
 * @FilePath     : /code-shortcut-generation/src/utils/util.ts
 */
import * as vscode from "vscode";
const fs = require("fs");
const path = require("path");

/**
 * 获取当前所在工程根目录，有3种使用方法：<br>
 * getProjectPath(uri) uri 表示工程内某个文件的路径<br>
 * getProjectPath(document) document 表示当前被打开的文件document对象<br>
 * getProjectPath() 会自动从 activeTextEditor 拿document对象，如果没有拿到则报错
 * @param {*} document
 */
export const getProjectPath = (document?: any) => {
  if (!document) {
    document = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.document
      : null;
  }
  if (!document) {
    // this.showError('当前激活的编辑器不是文件或者没有文件被打开！');
    return "";
  }
  const currentFile = (document.uri ? document.uri : document).fsPath;
  let projectPath = null;

  let workspaceFolders = vscode.workspace?.workspaceFolders?.map(
    (item) => item.uri.path
  );
  // 由于存在Multi-root工作区，暂时没有特别好的判断方法，先这样粗暴判断
  // 如果发现只有一个根文件夹，读取其子文件夹作为 workspaceFolders
  if (
    workspaceFolders?.length === 1 &&
    workspaceFolders[0] === vscode.workspace.rootPath
  ) {
    const rootPath = workspaceFolders[0];
    const files = fs.readdirSync(rootPath);

    console.log("🚀 ~ file: util.ts:44 ~ getProjectPath ~ files:", files);

    workspaceFolders = files
      .filter((name: any) => !/^\./g.test(name))
      .map((name: any) => path.resolve(rootPath, name));
  }

  console.log(
    "🚀 ~ file: util.ts:47 ~ getProjectPath ~ workspaceFolders:",
    workspaceFolders
  );

  workspaceFolders?.forEach((folder) => {
    if (currentFile.indexOf(folder) === 0) {
      projectPath = folder;
    }
  });

  console.log(
    "🚀 ~ file: util.ts:45 ~ getProjectPath ~ projectPath:",
    projectPath
  );

  if (!projectPath) {
    // this.showError('获取工程根路径异常！');
    return "";
  }
  return projectPath;
};
