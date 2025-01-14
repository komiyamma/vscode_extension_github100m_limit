import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "github100mbyteslimithook" is now active!');

    let disposable = vscode.commands.registerCommand('github100mbyteslimithook.initializeCommand', () => {
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
git diff --cached --name-only | while IFS= read -r file; do
    file_size=$(stat -c %s "$file" 2>/dev/null)
    if [ -n "$file_size" ]; then
        if [ "$file_size" -gt "$limit" ]; then
            echo "Error: Cannot commit a file larger than 100 MB. Abort commit."
            exit 1
        fi
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
