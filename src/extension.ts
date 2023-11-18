import * as vscode from 'vscode';

class MarkedFilesDecorationProvider {
  private _onDidChangeFileDecorations: vscode.EventEmitter<vscode.Uri | vscode.Uri[]> = new vscode.EventEmitter<vscode.Uri | vscode.Uri[]>();
  public readonly onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[]> = this._onDidChangeFileDecorations.event;
  private markedFiles: Set<string> = new Set();

  public toggleMark(fileUri?: vscode.Uri): void {
    const uriToMark = fileUri || vscode.window.activeTextEditor?.document.uri;

    if (!uriToMark) {
      vscode.window.showErrorMessage('No file selected.');
      return;
    }

    if (this.markedFiles.has(uriToMark.toString())) {
      this.markedFiles.delete(uriToMark.toString());
    } else {
      this.markedFiles.add(uriToMark.toString());
    }

    this._onDidChangeFileDecorations.fire(uriToMark);
    vscode.window.showInformationMessage(`Toggled mark for: ${uriToMark.fsPath}`);
  }

  public provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration> {
    if (this.markedFiles.has(uri.toString())) {
      return {
        badge: '⚑',
        color: new vscode.ThemeColor('markedFileDecoration.background'),
        tooltip: 'Marked File'
      };
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  const decorationProvider = new MarkedFilesDecorationProvider();
  context.subscriptions.push(vscode.window.registerFileDecorationProvider(decorationProvider));
  let disposable = vscode.commands.registerCommand('extension.markFile', (fileUri?: vscode.Uri) => {
    decorationProvider.toggleMark(fileUri);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
