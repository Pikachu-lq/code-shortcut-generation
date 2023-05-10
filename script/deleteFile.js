/*
 * @Author       : liqiao
 * @Date         : 2023-05-09 14:44:48
 * @LastEditors  : liqiao
 * @LastEditTime : 2023-05-09 15:21:27
 * @Description  : Do not edit
 * @FilePath     : /code-shortcut-generation/script/deleteFile.js
 */

const fs = require("fs");
const path = require("path");

/**
 * 删除某一个包下面的需要符合格式的文件。
 * @param  {String} url  文件路径，绝对路径
 * @param  {String} name 需要删除的文件名称
 * @return {Null}
 */

const deleteFile = (url, name) => {
  let files = [];
  //判断给定的路径是否存在
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url); //返回文件和子目录的数组
    // console.log("🚀 ~ file: deleteFile.ts:25 ~ deleteFile ~ files:", files);

    files.forEach((file, index) => {
      // console.log("🚀 ~ file: deleteFile.ts:38 ~ files.forEach ~ file:", file);

      var curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        //同步读取文件夹文件，如果是文件夹，则函数回调
        deleteFile(curPath, name);
      } else {
        if (file.indexOf(name) > -1) {
          fs.unlinkSync(curPath);
          // console.log("删除文件：" + curPath);
        }
      }
    });
  } else {
    console.log("给定的路径不存在！");
  }
};

// 传入script文件夹名称
deleteFile("../", "code-shortcut-generation");
