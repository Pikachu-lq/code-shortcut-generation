<!--
 * @Author       : liqiao
 * @Date         : 2023-05-05 14:33:46
 * @LastEditors  : liqiao
 * @LastEditTime : 2023-05-10 15:40:28
 * @Description  : Do not edit
 * @FilePath     : /code-shortcut-generation/README.md
-->

## 特征

项目中往往会有一些使用频率很高的公共组件，比如管理后台的表格、表单等等，每次都需要粘贴复制，此插件的作用是用于快速生成公共代码，不再手动处理；

## 使用说明

原理是复制需要的模版代码，生成到当前文件中； 

以code开头，共有三个参数，第一个参数为需要读取的文件绝对路径，第二个参数为原始组件名称，第三个参数为当前生成的组件名称；

代码提示：
```
code 读取文件绝对路径>读取文件组件名称>当前组件名称>
```

<!-- \!\[feature X\]\(images/pikachu.png\) -->

> Tip: 可以整理出需要自动生成的多个代码文件，放在同一个文件夹下进行管理；
