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
exports.activate = void 0;
const vscode = __importStar(__webpack_require__(1));
let outputChannel;
let markedFiles = {};
let lastUsedGroup = null;
class MarkedFilesDecorationProvider {
    _onDidChangeFileDecorations = new vscode.EventEmitter();
    onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;
    async toggleMark(fileUri) {
        const uriToMark = fileUri || vscode.window.activeTextEditor?.document.uri;
        if (!uriToMark) {
            vscode.window.showErrorMessage('No file selected.');
            return;
        }
        const groupName = await this.getGroupName(uriToMark.toString());
        if (!groupName) {
            let inputGroupName;
            if (lastUsedGroup === null) {
                inputGroupName = await vscode.window.showInputBox({
                    prompt: 'Enter a group name',
                    placeHolder: 'Group Name'
                });
            }
            else {
                inputGroupName = await vscode.window.showInputBox({
                    prompt: 'Enter a group name (leave blank for last used)',
                    placeHolder: 'Group Name',
                    value: lastUsedGroup
                });
            }
            if (!inputGroupName) {
                vscode.window.showErrorMessage('Group name is required for marking files.');
                return;
            }
            const group = inputGroupName;
            if (!markedFiles[group]) {
                markedFiles[group] = new Set();
            }
            markedFiles[group].add(uriToMark.toString());
            lastUsedGroup = group;
            this._onDidChangeFileDecorations.fire(uriToMark);
            // vscode.window.showInformationMessage(`Toggled mark for: ${uriToMark.fsPath} (Group: ${group})`);
        }
        else {
            markedFiles[groupName].delete(uriToMark.toString());
            this._onDidChangeFileDecorations.fire(uriToMark);
            // vscode.window.showInformationMessage(`Unmarked: ${uriToMark.fsPath} (Group: ${groupName})`);
        }
        outputChannel.clear();
        for (const groupName in markedFiles) {
            if (markedFiles[groupName].size > 0) {
                outputChannel.appendLine(groupName);
                markedFiles[groupName].forEach((file) => {
                    let filePath = file.replace('file://', '');
                    outputChannel.appendLine(`  |-${filePath}`);
                });
            }
        }
        outputChannel.show(true);
    }
    provideFileDecoration(uri) {
        outputChannel = vscode.window.createOutputChannel('Marked Files');
        for (const group in markedFiles) {
            if (markedFiles[group].has(uri.toString())) {
                return {
                    badge: '⚑',
                    color: new vscode.ThemeColor('markedFileDecoration.background'),
                    tooltip: `Marked File (Group: ${group})`
                };
            }
        }
    }
    getGroupName(fileUri) {
        for (const group in markedFiles) {
            if (markedFiles[group].has(fileUri)) {
                return group;
            }
        }
        return undefined;
    }
}
function activate(context) {
    const decorationProvider = new MarkedFilesDecorationProvider();
    context.subscriptions.push(vscode.window.registerFileDecorationProvider(decorationProvider));
    let disposable = vscode.commands.registerCommand('extension.markFile', (fileUri) => {
        decorationProvider.toggleMark(fileUri);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

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