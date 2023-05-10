/*
 * @Author       : liqiao
 * @Date         : 2023-05-05 17:51:29
 * @LastEditors  : liqiao
 * @LastEditTime : 2023-05-06 17:30:02
 * @Description  : Do not edit
 * @FilePath     : /code-shortcut-generation/src/extension.ts
 */

import * as vscode from "vscode";

const WRAPPING_TRIGGER_CHARACTERS = [
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "'",
  '"',
] as const;
const TRIGGER_CHARACTERS = [
  ...WRAPPING_TRIGGER_CHARACTERS,
  "/",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

const useStateCommandId = "vscode-pikaChu-useState";

function genValue(text: string) {
  console.log("🚀 ~ file: extension.ts:37 ~ genValue ~ text:", text);
  const [startChar, endChar] =
    text.length === 1 ? [text[0], null] : [text[0], text[text.length - 1]];
  console.log(
    "🚀 ~ file: extension.ts:39 ~ genValue ~ startChar, endChar:",
    startChar,
    endChar
  );

  if (
    !(WRAPPING_TRIGGER_CHARACTERS as readonly string[]).includes(startChar) ||
    startChar === endChar
  ) {
    return text;
  }

  switch (startChar) {
    case '"':
    case "'":
      return text + startChar;
    case "{":
      return text + "}";
    case "[":
      return text + "]";
    case "(":
      return text + ")";

    default:
      return text;
  }
}

class MyCompletionItemProvider implements vscode.CompletionItemProvider {
  private position?: vscode.Position;
  private str = "";

  constructor() {}

  // provideCompletionItems 接受 vscode 传入的当前 文档(document) 和 当前光标位置(position) 两个参数，
  // 通过这两个参数得到当前行输入的文本，对文本进一步解析，生成我们想要的代码片段，
  // 然后通过 new vscode.CompletionItem 生成一个代码提示实例，return 出去
  public provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<
    vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>
  > {
    this.position = position;

    // 返回由行号表示的文本行
    const linePrefix = document
      .lineAt(position)
      .text.slice(0, position.character);

    // 如果文本前缀不为 const ，则不做提示
    if (!linePrefix?.startsWith("const ") || !linePrefix.split("const ")[1]) {
      this.str = "";
      return [];
    }

    const [name, type, value] = linePrefix.split("const ")[1].split("/");

    this.str =
      "const [" +
      name +
      ", set" +
      name.replace(name[0], name[0].toUpperCase()) +
      "] = useState";

    // ts类型
    if (type) {
      if (!value) {
        this.str += `(${genValue(type)})`;
      } else {
        if (type === "<" || type === "<>") {
          this.str += "<>";
        } else {
          this.str += `<${type}>`;
        }
      }
    }

    if (value) {
      this.str += `(${genValue(value)})`;
    } else if (!type) {
      this.str += "()";
    }

    const snippetCompletion = new vscode.CompletionItem(
      linePrefix,
      // vscode.CompletionItemKind.Snippet
      vscode.CompletionItemKind.Color
    );

    snippetCompletion.documentation = this.str; // 一个人类可读的字符串，表示文档注释。
    snippetCompletion.detail = "enter / split code"; // 一个人类可读的字符串，包含关于该项的附加信息，如类型或符号信息。
    snippetCompletion.range = new vscode.Range(
      new vscode.Position(position.line, position.character),
      new vscode.Position(position.line, position.character)
    );

    snippetCompletion.filterText = "";

    return [snippetCompletion];
  }

  // 光标选中当前自动补全item时触发动作
  public resolveCompletionItem(
    item: vscode.CompletionItem,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CompletionItem> {
    const label = item.label;
    if (this.position && typeof label === "string") {
      item.command = {
        command: useStateCommandId,
        title: "refactor",
        arguments: [this.position.translate(0, label.length + 1), this.str], // 这里可以传递参数给该命令
      };
    }

    return item;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "code-shortcut-generation" is now active!'
  );

  const commandHandler = (
    editor: vscode.TextEditor,
    edit: vscode.TextEditorEdit,
    position: vscode.Position,
    str: string
  ) => {
    const lineText = editor.document.lineAt(position.line).text;
    const startSpaces = lineText.length - lineText.trimStart().length;

    edit.delete(
      new vscode.Range(
        position.with(undefined, startSpaces),
        position.with(undefined, lineText.length)
      )
    );

    edit.insert(position.with(undefined, startSpaces), str);

    return Promise.resolve([]);
  };

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(useStateCommandId, commandHandler)
  );

  const disposable = vscode.languages.registerCompletionItemProvider(
    [
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact",
      "vue",
      "html",
    ],
    new MyCompletionItemProvider(),
    ...TRIGGER_CHARACTERS
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
