// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "github100mbyteslimithook" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('github100mbyteslimithook.initializeCommand', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World from Github100MBytesLimiterHook!');
    });

    // ワークスペース内のテキストドキュメントが開かれたときに呼び出されるコールバック
    vscode.workspace.onDidOpenTextDocument((event) => {
        // 開かれたファイルのパスを取得
        const fileName = event.fileName;

        // vscode.window.showInformationMessage('ディレクトリが開かれました: ' + fileName);
        
        // gitリポジトリのディレクトリかどうかを判定
        // ここでfileNameに対する判定ロジックを実装

        createPreCommit();
        
    });
    context.subscriptions.push(disposable);
}

function createPreCommit() {
    let workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        let activeFolder = vscode.workspace.workspaceFolders?.[0];
        
        if (activeFolder) {
            let activeFolderUri = activeFolder.uri;
            let configFilePath = activeFolderUri.fsPath + '/.git/config';
            if (!fs.existsSync(configFilePath)) {
                // vscode.window.showInformationMessage("Configが無い");
                return false;
            }
            let postCheckoutFilePath = activeFolderUri.fsPath + '/.git/hooks/post-checkout';
            let postCommitFilePath = activeFolderUri.fsPath + '/.git/hooks/post-commit';
            let postMergeFilePath = activeFolderUri.fsPath + '/.git/hooks/post-merge';
            let prePushFilePath = activeFolderUri.fsPath + '/.git/hooks/pre-push';
            // これはLFSで初期化されている
            if (fs.existsSync(postCheckoutFilePath) && fs.existsSync(postCommitFilePath) && fs.existsSync(postMergeFilePath) && fs.existsSync(prePushFilePath)) {
                return false;
            }

            let preCommitFilePath = activeFolderUri.fsPath + '/.git/hooks/pre-commit';
            if (fs.existsSync(preCommitFilePath)) {
                // vscode.window.showInformationMessage('pre-commitファイル発見!!: ' + preCommitFilePath);
                return false;
            } else {
                // vscode.window.showErrorMessage('pre-commitファイルなし!! 作成できる!!: ' + preCommitFilePath);

                const scriptContent = `#!/bin/sh

toplevel=$(git rev-parse --show-toplevel)
if [ -z "$toplevel" ]; then
    exit 0
fi

if [ -f "$toplevel/.git/hooks/post-checkout" ] && 
    [ -f "$toplevel/.git/hooks/post-commit" ] &&
    [ -f "$toplevel/.git/hooks/post-merge" ] &&
    [ -f "$toplevel/.git/hooks/pre-push" ]; then
    exit 0
fi

limit=104857600 # 100MB in bytes
for file in $(git diff --cached --name-only); do
    file_size=$(stat -c %s "$file")
    if [ $file_size -gt $limit ]; then
        echo "Error: Cannot commit a file larger than 100 MB. Abort commit."
        exit 1
    fi
done
`;
                fs.writeFileSync(preCommitFilePath, scriptContent);
                return true;
            }
        }
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
