import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    // console.log('Congratulations, your extension "github100mbyteslimithook" is now active!');

    // Run when any text document opens (keeps existing trigger behavior)
    const openListener = vscode.workspace.onDidOpenTextDocument(() => {
        void createPreCommit(context);
    });
    context.subscriptions.push(openListener);
}

async function createPreCommit(context: vscode.ExtensionContext) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return false;
    }

    const activeFolder = workspaceFolders[0];
    if (!activeFolder) {
        return false;
    }

    const activeFolderUri = activeFolder.uri;
    const configFilePath = activeFolderUri.fsPath + '/.git/config';
    if (!fs.existsSync(configFilePath)) {
        return false;
    }

    const postCheckoutFilePath = activeFolderUri.fsPath + '/.git/hooks/post-checkout';
    const postCommitFilePath = activeFolderUri.fsPath + '/.git/hooks/post-commit';
    const postMergeFilePath = activeFolderUri.fsPath + '/.git/hooks/post-merge';
    const prePushFilePath = activeFolderUri.fsPath + '/.git/hooks/pre-push';
    // If LFS hooks exist, skip
    if (fs.existsSync(postCheckoutFilePath) && fs.existsSync(postCommitFilePath) && fs.existsSync(postMergeFilePath) && fs.existsSync(prePushFilePath)) {
        return false;
    }

    const hooksDirPath = activeFolderUri.fsPath + '/.git/hooks';
    const preCommitFilePath = hooksDirPath + '/pre-commit';
    if (fs.existsSync(preCommitFilePath)) {
        return false;
    }

    try {
        if (!fs.existsSync(hooksDirPath)) {
            fs.mkdirSync(hooksDirPath, { recursive: true });
        }

        const hookUri = vscode.Uri.joinPath(context.extensionUri, 'resources', 'pre-commit-hook.sh');
        const scriptContent = await vscode.workspace.fs.readFile(hookUri);
        fs.writeFileSync(preCommitFilePath, scriptContent);

        const lang = (vscode.env.language || '').toLowerCase();
        const isJa = (lang === 'ja' || lang.startsWith('ja-'));
        const infoMsg = isJa
            ? 'Github 100MB リミットフックを有効化しました (.git/hooks/pre-commit)'
            : 'Github 100MB Limit Hook enabled (.git/hooks/pre-commit)';
        vscode.window.showInformationMessage(infoMsg);
        return true;
    } catch (err: any) {
        const code = (err && err.code) ? String(err.code) : 'UNKNOWN';
        const lang = (vscode.env.language || '').toLowerCase();
        const isJa = (lang === 'ja' || lang.startsWith('ja-'));
        const errorMsg = isJa
            ? `フックの作成に失敗しました: ${preCommitFilePath} (${code})`
            : `Failed to create hook: ${preCommitFilePath} (${code})`;
        vscode.window.showErrorMessage(errorMsg);
        return false;
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
