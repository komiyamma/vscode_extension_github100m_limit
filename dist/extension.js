/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
const fs = __importStar(__webpack_require__(2));
function activate(context) {
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
exports.activate = activate;
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
            }
            else {
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
git diff --cached --name-only -z | while IFS= read -r -d $'\0' file; do
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
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("fs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map