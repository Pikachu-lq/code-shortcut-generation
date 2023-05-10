console.log("test");

/**
 * 
 * @param  {String} readerUrl  读取内容文件路径，绝对路径
 * @param  {String} writerUrl  写入文件路径，绝对路径
 * @param  {String} replaceTemplateName  需要替换的模版名称
 */

const fs = require("fs");
const path = require("path");
let readerFilePathData = "";

// 创建一个可以写入的流，写入到指定文件中，
const writerOperate = () => {
  const writerFilePath = path.resolve(__dirname, "../src/test.tsx");
  console.log("🚀 ~ file: copyCode.js:18 ~ writerFilePath:", writerFilePath);


  const writerStream = fs.createWriteStream(writerFilePath);

  // 使用 utf8 编码写入数据
  console.log(
    "🚀 ~ file: copyCode.js:43 ~ readerFilePathData:",
    readerFilePathData
  );

  const readerFilePathDataCurr = readerFilePathData.replace(/TemplateCode/g, "TestTemplateCode");

  writerStream.write(readerFilePathDataCurr, "UTF8");

  // 标记文件末尾
  writerStream.end();

  // 处理流事件 --> data, end, and error
  writerStream.on("finish", function () {
    console.log("写入完成。");
  });

  writerStream.on("error", function (err) {
    console.log(err.stack);
  });

  console.log("写入程序执行完毕");
};

// 获取文件模版内容
const readerOperate = () => {
  const readerFilePath = path.resolve(
    __dirname,
    "../src/codeTemplates/modal.tsx"
  );
  // console.log("🚀 ~ file: copyCode.js:18 ~ readerFilePath:", readerFilePath);
  // 创建可读流
  // const readerStream = fs.createReadStream('input.txt');
  const readerStream = fs.createReadStream(readerFilePath);

  // 设置编码为 utf8。
  readerStream.setEncoding("UTF8");

  // 处理流事件 --> data, end, and error
  readerStream.on("data", function (chunk) {
    readerFilePathData += chunk;
  });

  // 文件读取成功
  readerStream.on("end", function () {
    // console.log("readerFilePathData-----end");
    writerOperate();
  });

  readerStream.on("error", function (err) {
    console.log(err.stack);
  });

  // console.log("读取程序执行完毕");
};

readerOperate();
