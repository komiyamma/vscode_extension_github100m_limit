import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    // Prefer Git extension callbacks over document-open scanning
    void wireWithGitExtension(context);
}

// Ensure pre-commit hook exists for a given repository root
async function ensurePreCommitForRoot(context: vscode.ExtensionContext, rootUri: vscode.Uri) {
    const configFilePath = rootUri.fsPath + '/.git/config';
    if (!fs.existsSync(configFilePath)) {
        return false;
    }

    const postCheckoutFilePath = rootUri.fsPath + '/.git/hooks/post-checkout';
    const postCommitFilePath = rootUri.fsPath + '/.git/hooks/post-commit';
    const postMergeFilePath = rootUri.fsPath + '/.git/hooks/post-merge';
    const prePushFilePath = rootUri.fsPath + '/.git/hooks/pre-push';
    // If LFS hooks exist, skip
    if (fs.existsSync(postCheckoutFilePath) && fs.existsSync(postCommitFilePath) && fs.existsSync(postMergeFilePath) && fs.existsSync(prePushFilePath)) {
        return false;
    }

    const hooksDirPath = rootUri.fsPath + '/.git/hooks';
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

        const lang2 = (vscode.env.language || '').toLowerCase();
        const isJa2 = (lang2 === 'ja' || lang2.startsWith('ja-'));
        const msg = isJa2
            ? 'Github 100MB 制限フックを有効化しました'
            : 'Github 100MB Limit Hook enabled';
        vscode.window.setStatusBarMessage(msg, 3000);

        const lang = (vscode.env.language || '').toLowerCase();
        const isJa = (lang === 'ja' || lang.startsWith('ja-'));
        const infoMsg = isJa
            ? 'Github 100MB 制限フックを有効化しました (.git/hooks/pre-commit)'
            : 'Github 100MB Limit Hook enabled (.git/hooks/pre-commit)';
        // vscode.window.showInformationMessage(infoMsg);
        return true;
    } catch (err: any) {
        const code = (err && err.code) ? String(err.code) : 'UNKNOWN';
        const lang = (vscode.env.language || '').toLowerCase();
        const isJa = (lang === 'ja' || lang.startsWith('ja-'));
        const errorMsg = isJa
            ? `フックの作成に失敗しました: ${preCommitFilePath} (${code})`
            : `Failed to create hook: ${preCommitFilePath} (${code})`;
        // vscode.window.showErrorMessage(errorMsg);
        return false;
    }
}

async function wireWithGitExtension(context: vscode.ExtensionContext) {
    try {
        const gitExt = vscode.extensions.getExtension<any>('vscode.git');
        const api = gitExt?.exports?.getAPI?.(1);
        if (!api) {
            return;
        }

        // Ensure for already-open repositories
        for (const repo of api.repositories as Array<{ rootUri: vscode.Uri }>) {
            void ensurePreCommitForRoot(context, repo.rootUri);
        }

        // When a new repository is opened
        const openSub = api.onDidOpenRepository?.((repo: { rootUri: vscode.Uri }) => {
            void ensurePreCommitForRoot(context, repo.rootUri);
        });
        if (openSub) {
            context.subscriptions.push(openSub);
        }

        // Also respond to added workspace folders only (no full scan)
        const wsSub = vscode.workspace.onDidChangeWorkspaceFolders((e) => {
            for (const f of e.added) {
                void ensurePreCommitForRoot(context, f.uri);
            }
        });
        context.subscriptions.push(wsSub);
    } catch {
        // ignore if Git extension is unavailable
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
