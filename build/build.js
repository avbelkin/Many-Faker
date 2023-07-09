/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const message_dispatcher_1 = __webpack_require__(/*! ./message-dispatcher */ "./src/message-dispatcher.ts");
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, message_dispatcher_1.messageDispatch)(msg);
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
});


/***/ }),

/***/ "./src/message-dispatcher.ts":
/*!***********************************!*\
  !*** ./src/message-dispatcher.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.messageDispatch = void 0;
const replace_1 = __webpack_require__(/*! ./replace */ "./src/replace.ts");
function messageDispatch(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (msg.type === 'replace') {
            const nodes = yield (0, replace_1.replace)(figma.currentPage.selection);
            figma.currentPage.selection = nodes;
            //   figma.viewport.scrollAndZoomIntoView(nodes);
        }
    });
}
exports.messageDispatch = messageDispatch;


/***/ }),

/***/ "./src/replace.ts":
/*!************************!*\
  !*** ./src/replace.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replace = void 0;
function replace(selection) {
    return __awaiter(this, void 0, void 0, function* () {
        let nodes = [];
        for (const selectedNode of selection) {
            const foundNodes = traverse(selectedNode);
            if (foundNodes.length > 0)
                nodes = nodes.concat(foundNodes);
        }
        yield replaceTextsOnNodes(nodes);
        return nodes;
    });
}
exports.replace = replace;
function traverse(parentNode) {
    let nodes = [];
    if (parentNode.type === "TEXT") {
        nodes.push(parentNode);
    }
    else if ("children" in parentNode) {
        for (const child of parentNode.children) {
            if (child.type === "GROUP" ||
                child.type === "FRAME" ||
                child.type === "INSTANCE" ||
                child.type === "COMPONENT" ||
                child.type === "TEXT") {
                const foundNodes = traverse(child);
                if (foundNodes.length > 0) {
                    nodes = nodes.concat(foundNodes);
                }
            }
        }
    }
    return nodes;
}
const pattern = /\{.*?\}/;
function replaceTextsOnNodes(textNodes) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(textNodes.length);
        for (const textNode of textNodes) {
            console.log(textNode.type);
            console.log(textNode.fontName);
            if (textNode.fontName !== figma.mixed) {
                yield figma.loadFontAsync(textNode.fontName);
            }
            else {
                yield Promise
                    .all(textNode.getRangeAllFontNames(0, textNode.characters.length)
                    .map(figma.loadFontAsync));
            }
            if (textNode.hasMissingFont) {
                console.warn('unabled to edit text node due to missing font');
            }
            else {
                if (textNode.fontName !== figma.mixed) {
                    textNode.autoRename = false;
                    console.log(textNode.characters);
                    if (!pattern.test(textNode.characters))
                        continue;
                    textNode.characters = textTransform(textNode.characters);
                }
                else {
                    debugger;
                    const segments = textNode.getStyledTextSegments(['fontName', 'indentation']);
                    console.log(segments);
                    for (let i = segments.length - 1; i >= 0; i--) {
                        const segment = segments[i];
                        console.log(segment.characters);
                        if (!pattern.test(segment.characters))
                            continue;
                        const oldCharsCount = segment.end - segment.start;
                        const oldsegmentStart = segment.start;
                        const newText = textTransform(segment.characters);
                        textNode.insertCharacters(segment.end, newText, "BEFORE");
                        textNode.deleteCharacters(oldsegmentStart, oldsegmentStart + oldCharsCount);
                    }
                    console.log(textNode.getStyledTextSegments(['fontName', 'indentation']));
                }
            }
        }
    });
}
function textTransform(oldText) {
    return "XXX";
}


/***/ })

/******/ 	});
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/code.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsNkJBQTZCLG1CQUFPLENBQUMseURBQXNCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQzVCWTtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsdUJBQXVCO0FBQ3ZCLGtCQUFrQixtQkFBTyxDQUFDLG1DQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsdUJBQXVCOzs7Ozs7Ozs7OztBQ3RCVjtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixLQUFLO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDL0ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NYW55IEZha2VyLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci8uL3NyYy9tZXNzYWdlLWRpc3BhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci8uL3NyYy9yZXBsYWNlLnRzIiwid2VicGFjazovL01hbnkgRmFrZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL01hbnkgRmFrZXIvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL01hbnkgRmFrZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gVGhpcyBwbHVnaW4gd2lsbCBvcGVuIGEgd2luZG93IHRvIHByb21wdCB0aGUgdXNlciB0byBlbnRlciBhIG51bWJlciwgYW5kXG4vLyBpdCB3aWxsIHRoZW4gY3JlYXRlIHRoYXQgbWFueSByZWN0YW5nbGVzIG9uIHRoZSBzY3JlZW4uXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IG1lc3NhZ2VfZGlzcGF0Y2hlcl8xID0gcmVxdWlyZShcIi4vbWVzc2FnZS1kaXNwYXRjaGVyXCIpO1xuLy8gVGhpcyBmaWxlIGhvbGRzIHRoZSBtYWluIGNvZGUgZm9yIHBsdWdpbnMuIENvZGUgaW4gdGhpcyBmaWxlIGhhcyBhY2Nlc3MgdG9cbi8vIHRoZSAqZmlnbWEgZG9jdW1lbnQqIHZpYSB0aGUgZmlnbWEgZ2xvYmFsIG9iamVjdC5cbi8vIFlvdSBjYW4gYWNjZXNzIGJyb3dzZXIgQVBJcyBpbiB0aGUgPHNjcmlwdD4gdGFnIGluc2lkZSBcInVpLmh0bWxcIiB3aGljaCBoYXMgYVxuLy8gZnVsbCBicm93c2VyIGVudmlyb25tZW50IChTZWUgaHR0cHM6Ly93d3cuZmlnbWEuY29tL3BsdWdpbi1kb2NzL2hvdy1wbHVnaW5zLXJ1bikuXG4vLyBUaGlzIHNob3dzIHRoZSBIVE1MIHBhZ2UgaW4gXCJ1aS5odG1sXCIuXG5maWdtYS5zaG93VUkoX19odG1sX18pO1xuLy8gQ2FsbHMgdG8gXCJwYXJlbnQucG9zdE1lc3NhZ2VcIiBmcm9tIHdpdGhpbiB0aGUgSFRNTCBwYWdlIHdpbGwgdHJpZ2dlciB0aGlzXG4vLyBjYWxsYmFjay4gVGhlIGNhbGxiYWNrIHdpbGwgYmUgcGFzc2VkIHRoZSBcInBsdWdpbk1lc3NhZ2VcIiBwcm9wZXJ0eSBvZiB0aGVcbi8vIHBvc3RlZCBtZXNzYWdlLlxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgeWllbGQgKDAsIG1lc3NhZ2VfZGlzcGF0Y2hlcl8xLm1lc3NhZ2VEaXNwYXRjaCkobXNnKTtcbiAgICAvLyBNYWtlIHN1cmUgdG8gY2xvc2UgdGhlIHBsdWdpbiB3aGVuIHlvdSdyZSBkb25lLiBPdGhlcndpc2UgdGhlIHBsdWdpbiB3aWxsXG4gICAgLy8ga2VlcCBydW5uaW5nLCB3aGljaCBzaG93cyB0aGUgY2FuY2VsIGJ1dHRvbiBhdCB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4uXG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubWVzc2FnZURpc3BhdGNoID0gdm9pZCAwO1xuY29uc3QgcmVwbGFjZV8xID0gcmVxdWlyZShcIi4vcmVwbGFjZVwiKTtcbmZ1bmN0aW9uIG1lc3NhZ2VEaXNwYXRjaChtc2cpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAobXNnLnR5cGUgPT09ICdyZXBsYWNlJykge1xuICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSB5aWVsZCAoMCwgcmVwbGFjZV8xLnJlcGxhY2UpKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBub2RlcztcbiAgICAgICAgICAgIC8vICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KG5vZGVzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZXhwb3J0cy5tZXNzYWdlRGlzcGF0Y2ggPSBtZXNzYWdlRGlzcGF0Y2g7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5yZXBsYWNlID0gdm9pZCAwO1xuZnVuY3Rpb24gcmVwbGFjZShzZWxlY3Rpb24pIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBzZWxlY3RlZE5vZGUgb2Ygc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBjb25zdCBmb3VuZE5vZGVzID0gdHJhdmVyc2Uoc2VsZWN0ZWROb2RlKTtcbiAgICAgICAgICAgIGlmIChmb3VuZE5vZGVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgbm9kZXMgPSBub2Rlcy5jb25jYXQoZm91bmROb2Rlcyk7XG4gICAgICAgIH1cbiAgICAgICAgeWllbGQgcmVwbGFjZVRleHRzT25Ob2Rlcyhub2Rlcyk7XG4gICAgICAgIHJldHVybiBub2RlcztcbiAgICB9KTtcbn1cbmV4cG9ydHMucmVwbGFjZSA9IHJlcGxhY2U7XG5mdW5jdGlvbiB0cmF2ZXJzZShwYXJlbnROb2RlKSB7XG4gICAgbGV0IG5vZGVzID0gW107XG4gICAgaWYgKHBhcmVudE5vZGUudHlwZSA9PT0gXCJURVhUXCIpIHtcbiAgICAgICAgbm9kZXMucHVzaChwYXJlbnROb2RlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoXCJjaGlsZHJlblwiIGluIHBhcmVudE5vZGUpIHtcbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBwYXJlbnROb2RlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gXCJHUk9VUFwiIHx8XG4gICAgICAgICAgICAgICAgY2hpbGQudHlwZSA9PT0gXCJGUkFNRVwiIHx8XG4gICAgICAgICAgICAgICAgY2hpbGQudHlwZSA9PT0gXCJJTlNUQU5DRVwiIHx8XG4gICAgICAgICAgICAgICAgY2hpbGQudHlwZSA9PT0gXCJDT01QT05FTlRcIiB8fFxuICAgICAgICAgICAgICAgIGNoaWxkLnR5cGUgPT09IFwiVEVYVFwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZm91bmROb2RlcyA9IHRyYXZlcnNlKGNoaWxkKTtcbiAgICAgICAgICAgICAgICBpZiAoZm91bmROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVzID0gbm9kZXMuY29uY2F0KGZvdW5kTm9kZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZXM7XG59XG5jb25zdCBwYXR0ZXJuID0gL1xcey4qP1xcfS87XG5mdW5jdGlvbiByZXBsYWNlVGV4dHNPbk5vZGVzKHRleHROb2Rlcykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRleHROb2Rlcy5sZW5ndGgpO1xuICAgICAgICBmb3IgKGNvbnN0IHRleHROb2RlIG9mIHRleHROb2Rlcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGV4dE5vZGUudHlwZSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXh0Tm9kZS5mb250TmFtZSk7XG4gICAgICAgICAgICBpZiAodGV4dE5vZGUuZm9udE5hbWUgIT09IGZpZ21hLm1peGVkKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyh0ZXh0Tm9kZS5mb250TmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBQcm9taXNlXG4gICAgICAgICAgICAgICAgICAgIC5hbGwodGV4dE5vZGUuZ2V0UmFuZ2VBbGxGb250TmFtZXMoMCwgdGV4dE5vZGUuY2hhcmFjdGVycy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZmlnbWEubG9hZEZvbnRBc3luYykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRleHROb2RlLmhhc01pc3NpbmdGb250KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCd1bmFibGVkIHRvIGVkaXQgdGV4dCBub2RlIGR1ZSB0byBtaXNzaW5nIGZvbnQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0Tm9kZS5mb250TmFtZSAhPT0gZmlnbWEubWl4ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dE5vZGUuYXV0b1JlbmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXh0Tm9kZS5jaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXR0ZXJuLnRlc3QodGV4dE5vZGUuY2hhcmFjdGVycykpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dE5vZGUuY2hhcmFjdGVycyA9IHRleHRUcmFuc2Zvcm0odGV4dE5vZGUuY2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudHMgPSB0ZXh0Tm9kZS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoWydmb250TmFtZScsICdpbmRlbnRhdGlvbiddKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VnbWVudHMpO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gc2VnbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlZ21lbnQuY2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhdHRlcm4udGVzdChzZWdtZW50LmNoYXJhY3RlcnMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkQ2hhcnNDb3VudCA9IHNlZ21lbnQuZW5kIC0gc2VnbWVudC5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZHNlZ21lbnRTdGFydCA9IHNlZ21lbnQuc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gdGV4dFRyYW5zZm9ybShzZWdtZW50LmNoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dE5vZGUuaW5zZXJ0Q2hhcmFjdGVycyhzZWdtZW50LmVuZCwgbmV3VGV4dCwgXCJCRUZPUkVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5kZWxldGVDaGFyYWN0ZXJzKG9sZHNlZ21lbnRTdGFydCwgb2xkc2VnbWVudFN0YXJ0ICsgb2xkQ2hhcnNDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGV4dE5vZGUuZ2V0U3R5bGVkVGV4dFNlZ21lbnRzKFsnZm9udE5hbWUnLCAnaW5kZW50YXRpb24nXSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gdGV4dFRyYW5zZm9ybShvbGRUZXh0KSB7XG4gICAgcmV0dXJuIFwiWFhYXCI7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvY29kZS50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==