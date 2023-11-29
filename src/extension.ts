import * as vscode from "vscode";

let outputChannel: vscode.OutputChannel;
let markedFiles: { [group: string]: Set<string> } = {};
let lastUsedGroup: string | null = null;

class MarkedFilesDecorationProvider {
  public _onDidChangeFileDecorations: vscode.EventEmitter<
    vscode.Uri | vscode.Uri[]
  > = new vscode.EventEmitter<vscode.Uri | vscode.Uri[]>();
  public readonly onDidChangeFileDecorations: vscode.Event<
    vscode.Uri | vscode.Uri[]
  > = this._onDidChangeFileDecorations.event;

  public checkFiles(markedFiles: { [group: string]: Set<string> }) {
    for (const groupName in markedFiles) {
      if (markedFiles[groupName].size > 0) {
        outputChannel.appendLine(groupName);
        markedFiles[groupName].forEach((file: string) => {
          let filePath = file.replace("file://", "");
          outputChannel.appendLine(`  ${filePath}`);
        });
      }
    }
  }

  public async toggleMark(fileUri?: vscode.Uri): Promise<void> {
    const uriToMark = fileUri || vscode.window.activeTextEditor?.document.uri;

    if (!uriToMark) {
      vscode.window.showErrorMessage("No file selected.");
      return;
    }

    const groupName = await this.getGroupName(uriToMark.toString());

    if (!groupName) {
      let inputGroupName: string | undefined;
      if (lastUsedGroup === null) {
        inputGroupName = await vscode.window.showInputBox({
          prompt: "Enter a group name",
          placeHolder: "Group Name",
        });
      } else {
        inputGroupName = await vscode.window.showInputBox({
          prompt: "Enter a group name (leave blank for last used)",
          placeHolder: "Group Name",
          value: lastUsedGroup,
        });
      }

      let lineNum = await vscode.window.showInputBox({
        prompt: "Ender a line number (leave blank if not needed)",
        placeHolder: "",
      });

      if (!lineNum) {
        lineNum = "";
      } else {
        let num = parseInt(lineNum);
        lineNum = Number.isNaN(num) ? "" : ":" + num;
      }

      if (!inputGroupName) {
        vscode.window.showErrorMessage(
          'No group name provied, "Group" will be used.'
        );
      }

      let group = inputGroupName ? inputGroupName : "Group";

      if (!markedFiles[group]) {
        markedFiles[group] = new Set();
      }

      markedFiles[group].add(uriToMark.toString() + lineNum);
      lastUsedGroup = group;
      this._onDidChangeFileDecorations.fire(uriToMark);

      // vscode.window.showInformationMessage(`Toggled mark for: ${uriToMark.fsPath} (Group: ${group})`);
    } else {
      markedFiles[groupName].delete(uriToMark.toString());
      this._onDidChangeFileDecorations.fire(uriToMark);

      // vscode.window.showInformationMessage(`Unmarked: ${uriToMark.fsPath} (Group: ${groupName})`);
    }

    outputChannel.clear();

    // Updates changes to marked files
    this.checkFiles(markedFiles);

    outputChannel.show(true);
  }

  public provideFileDecoration(
    uri: vscode.Uri
  ): vscode.ProviderResult<vscode.FileDecoration> {
    for (const group in markedFiles) {
      if (markedFiles[group].has(uri.toString())) {
        return {
          badge: "⚑",
          color: new vscode.ThemeColor("markedFileDecoration.background"),
          tooltip: `Marked File (Group: ${group})`,
        };
      }
    }
  }

  private getGroupName(fileUri: string): string | undefined {
    for (const group in markedFiles) {
      if (markedFiles[group].has(fileUri)) {
        return group;
      }
    }
    return undefined;
  }
}

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("Marked Files");

  const decorationProvider = new MarkedFilesDecorationProvider();
  context.subscriptions.push(
    vscode.window.registerFileDecorationProvider(decorationProvider)
  );

  let markDisposable = vscode.commands.registerCommand(
    "extension.markFile",
    (fileUri?: vscode.Uri) => {
      decorationProvider.toggleMark(fileUri);
    }
  );
  context.subscriptions.push(markDisposable);

  let clearMarksDisposable = vscode.commands.registerCommand(
    "extension.clearTerminalMarks",
    () => {

      const urisToClear: vscode.Uri[] = [];
      for (const group in markedFiles) {
        for (const fileString of markedFiles[group]) {
          urisToClear.push(vscode.Uri.parse(fileString));
        }
      }

      vscode.window.showInformationMessage("Cleared Marks");
  
      markedFiles = {};
      urisToClear.forEach(uri => decorationProvider._onDidChangeFileDecorations.fire(uri));
      outputChannel.clear();
    }
  );  
  context.subscriptions.push(clearMarksDisposable);
}
