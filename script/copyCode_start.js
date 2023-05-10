console.log("test");

var fs = require("fs");
const path = require("path");

const readerFilePath = path.resolve(
  __dirname,
  "../src/codeTemplates/modal.tsx"
);
// console.log("🚀 ~ file: copyCode.js:18 ~ readerFilePath:", readerFilePath);
let readerFilePathData = "";
// 创建可读流
// var readerStream = fs.createReadStream('input.txt');
var readerStream = fs.createReadStream(readerFilePath);

// 设置编码为 utf8。
readerStream.setEncoding("UTF8");

// 处理流事件 --> data, end, and error
readerStream.on("data", function (chunk) {
  readerFilePathData += chunk;
});

readerStream.on("end", function () {
  console.log("readerFilePathData-----end");
  // 创建一个可以写入的流，写入到指定文件中

  const writerFilePath = path.resolve(__dirname, "../src/test.tsx");
  console.log("🚀 ~ file: copyCode.js:18 ~ writerFilePath:", writerFilePath);
  var writerStream = fs.createWriteStream(writerFilePath);

  // 使用 utf8 编码写入数据
  console.log(
    "🚀 ~ file: copyCode.js:43 ~ readerFilePathData:",
    readerFilePathData
  );

  writerStream.write(readerFilePathData, "UTF8");

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
});

readerStream.on("error", function (err) {
  console.log(err.stack);
});

console.log("读取程序执行完毕");
