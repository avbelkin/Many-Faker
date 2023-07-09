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
exports.replace = exports.pattern = void 0;
const text_transform_1 = __webpack_require__(/*! ./text-transform */ "./src/text-transform.ts");
exports.pattern = /\{.*?\}/g;
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
                    if (!exports.pattern.test(textNode.characters))
                        continue;
                    textNode.characters = (0, text_transform_1.textTransform)(textNode.characters);
                }
                else {
                    debugger;
                    const segments = textNode.getStyledTextSegments(['fontName', 'indentation']);
                    console.log(segments);
                    for (let i = segments.length - 1; i >= 0; i--) {
                        const segment = segments[i];
                        console.log(segment.characters);
                        if (!exports.pattern.test(segment.characters))
                            continue;
                        const oldCharsCount = segment.end - segment.start;
                        const oldsegmentStart = segment.start;
                        const newText = (0, text_transform_1.textTransform)(segment.characters);
                        textNode.insertCharacters(segment.end, newText, "BEFORE");
                        textNode.deleteCharacters(oldsegmentStart, oldsegmentStart + oldCharsCount);
                    }
                    console.log(textNode.getStyledTextSegments(['fontName', 'indentation']));
                }
            }
        }
    });
}


/***/ }),

/***/ "./src/text-transform.ts":
/*!*******************************!*\
  !*** ./src/text-transform.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.textTransform = void 0;
const replace_1 = __webpack_require__(/*! ./replace */ "./src/replace.ts");
function textTransform(oldText) {
    return oldText.replace(replace_1.pattern, replacer);
}
exports.textTransform = textTransform;
function replacer(match, start, originalString) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsNkJBQTZCLG1CQUFPLENBQUMseURBQXNCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQzVCWTtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsdUJBQXVCO0FBQ3ZCLGtCQUFrQixtQkFBTyxDQUFDLG1DQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsdUJBQXVCOzs7Ozs7Ozs7OztBQ3RCVjtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZUFBZSxHQUFHLGVBQWU7QUFDakMseUJBQXlCLG1CQUFPLENBQUMsaURBQWtCO0FBQ25ELGVBQWUsTUFBTSxLQUFLO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0QsUUFBUTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7OztBQzdGYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxxQkFBcUI7QUFDckIsa0JBQWtCLG1CQUFPLENBQUMsbUNBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTs7Ozs7OztVQ1ZBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9NYW55IEZha2VyLy4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci8uL3NyYy9tZXNzYWdlLWRpc3BhdGNoZXIudHMiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci8uL3NyYy9yZXBsYWNlLnRzIiwid2VicGFjazovL01hbnkgRmFrZXIvLi9zcmMvdGV4dC10cmFuc2Zvcm0udHMiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9NYW55IEZha2VyL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vTWFueSBGYWtlci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBUaGlzIHBsdWdpbiB3aWxsIG9wZW4gYSB3aW5kb3cgdG8gcHJvbXB0IHRoZSB1c2VyIHRvIGVudGVyIGEgbnVtYmVyLCBhbmRcbi8vIGl0IHdpbGwgdGhlbiBjcmVhdGUgdGhhdCBtYW55IHJlY3RhbmdsZXMgb24gdGhlIHNjcmVlbi5cbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgbWVzc2FnZV9kaXNwYXRjaGVyXzEgPSByZXF1aXJlKFwiLi9tZXNzYWdlLWRpc3BhdGNoZXJcIik7XG4vLyBUaGlzIGZpbGUgaG9sZHMgdGhlIG1haW4gY29kZSBmb3IgcGx1Z2lucy4gQ29kZSBpbiB0aGlzIGZpbGUgaGFzIGFjY2VzcyB0b1xuLy8gdGhlICpmaWdtYSBkb2N1bWVudCogdmlhIHRoZSBmaWdtYSBnbG9iYWwgb2JqZWN0LlxuLy8gWW91IGNhbiBhY2Nlc3MgYnJvd3NlciBBUElzIGluIHRoZSA8c2NyaXB0PiB0YWcgaW5zaWRlIFwidWkuaHRtbFwiIHdoaWNoIGhhcyBhXG4vLyBmdWxsIGJyb3dzZXIgZW52aXJvbm1lbnQgKFNlZSBodHRwczovL3d3dy5maWdtYS5jb20vcGx1Z2luLWRvY3MvaG93LXBsdWdpbnMtcnVuKS5cbi8vIFRoaXMgc2hvd3MgdGhlIEhUTUwgcGFnZSBpbiBcInVpLmh0bWxcIi5cbmZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG4vLyBDYWxscyB0byBcInBhcmVudC5wb3N0TWVzc2FnZVwiIGZyb20gd2l0aGluIHRoZSBIVE1MIHBhZ2Ugd2lsbCB0cmlnZ2VyIHRoaXNcbi8vIGNhbGxiYWNrLiBUaGUgY2FsbGJhY2sgd2lsbCBiZSBwYXNzZWQgdGhlIFwicGx1Z2luTWVzc2FnZVwiIHByb3BlcnR5IG9mIHRoZVxuLy8gcG9zdGVkIG1lc3NhZ2UuXG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICB5aWVsZCAoMCwgbWVzc2FnZV9kaXNwYXRjaGVyXzEubWVzc2FnZURpc3BhdGNoKShtc2cpO1xuICAgIC8vIE1ha2Ugc3VyZSB0byBjbG9zZSB0aGUgcGx1Z2luIHdoZW4geW91J3JlIGRvbmUuIE90aGVyd2lzZSB0aGUgcGx1Z2luIHdpbGxcbiAgICAvLyBrZWVwIHJ1bm5pbmcsIHdoaWNoIHNob3dzIHRoZSBjYW5jZWwgYnV0dG9uIGF0IHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbi5cbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5tZXNzYWdlRGlzcGF0Y2ggPSB2b2lkIDA7XG5jb25zdCByZXBsYWNlXzEgPSByZXF1aXJlKFwiLi9yZXBsYWNlXCIpO1xuZnVuY3Rpb24gbWVzc2FnZURpc3BhdGNoKG1zZykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmIChtc2cudHlwZSA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlcyA9IHlpZWxkICgwLCByZXBsYWNlXzEucmVwbGFjZSkoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5vZGVzO1xuICAgICAgICAgICAgLy8gICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcobm9kZXMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnRzLm1lc3NhZ2VEaXNwYXRjaCA9IG1lc3NhZ2VEaXNwYXRjaDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlcGxhY2UgPSBleHBvcnRzLnBhdHRlcm4gPSB2b2lkIDA7XG5jb25zdCB0ZXh0X3RyYW5zZm9ybV8xID0gcmVxdWlyZShcIi4vdGV4dC10cmFuc2Zvcm1cIik7XG5leHBvcnRzLnBhdHRlcm4gPSAvXFx7Lio/XFx9L2c7XG5mdW5jdGlvbiByZXBsYWNlKHNlbGVjdGlvbikge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdGVkTm9kZSBvZiBzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbnN0IGZvdW5kTm9kZXMgPSB0cmF2ZXJzZShzZWxlY3RlZE5vZGUpO1xuICAgICAgICAgICAgaWYgKGZvdW5kTm9kZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICBub2RlcyA9IG5vZGVzLmNvbmNhdChmb3VuZE5vZGVzKTtcbiAgICAgICAgfVxuICAgICAgICB5aWVsZCByZXBsYWNlVGV4dHNPbk5vZGVzKG5vZGVzKTtcbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH0pO1xufVxuZXhwb3J0cy5yZXBsYWNlID0gcmVwbGFjZTtcbmZ1bmN0aW9uIHRyYXZlcnNlKHBhcmVudE5vZGUpIHtcbiAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICBpZiAocGFyZW50Tm9kZS50eXBlID09PSBcIlRFWFRcIikge1xuICAgICAgICBub2Rlcy5wdXNoKHBhcmVudE5vZGUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChcImNoaWxkcmVuXCIgaW4gcGFyZW50Tm9kZSkge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHBhcmVudE5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChjaGlsZC50eXBlID09PSBcIkdST1VQXCIgfHxcbiAgICAgICAgICAgICAgICBjaGlsZC50eXBlID09PSBcIkZSQU1FXCIgfHxcbiAgICAgICAgICAgICAgICBjaGlsZC50eXBlID09PSBcIklOU1RBTkNFXCIgfHxcbiAgICAgICAgICAgICAgICBjaGlsZC50eXBlID09PSBcIkNPTVBPTkVOVFwiIHx8XG4gICAgICAgICAgICAgICAgY2hpbGQudHlwZSA9PT0gXCJURVhUXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZE5vZGVzID0gdHJhdmVyc2UoY2hpbGQpO1xuICAgICAgICAgICAgICAgIGlmIChmb3VuZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZXMgPSBub2Rlcy5jb25jYXQoZm91bmROb2Rlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBub2Rlcztcbn1cbmZ1bmN0aW9uIHJlcGxhY2VUZXh0c09uTm9kZXModGV4dE5vZGVzKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2codGV4dE5vZGVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAoY29uc3QgdGV4dE5vZGUgb2YgdGV4dE5vZGVzKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXh0Tm9kZS50eXBlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRleHROb2RlLmZvbnROYW1lKTtcbiAgICAgICAgICAgIGlmICh0ZXh0Tm9kZS5mb250TmFtZSAhPT0gZmlnbWEubWl4ZWQpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKHRleHROb2RlLmZvbnROYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHlpZWxkIFByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgLmFsbCh0ZXh0Tm9kZS5nZXRSYW5nZUFsbEZvbnROYW1lcygwLCB0ZXh0Tm9kZS5jaGFyYWN0ZXJzLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgLm1hcChmaWdtYS5sb2FkRm9udEFzeW5jKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGV4dE5vZGUuaGFzTWlzc2luZ0ZvbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ3VuYWJsZWQgdG8gZWRpdCB0ZXh0IG5vZGUgZHVlIHRvIG1pc3NpbmcgZm9udCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRleHROb2RlLmZvbnROYW1lICE9PSBmaWdtYS5taXhlZCkge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRleHROb2RlLmNoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWV4cG9ydHMucGF0dGVybi50ZXN0KHRleHROb2RlLmNoYXJhY3RlcnMpKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlLmNoYXJhY3RlcnMgPSAoMCwgdGV4dF90cmFuc2Zvcm1fMS50ZXh0VHJhbnNmb3JtKSh0ZXh0Tm9kZS5jaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50cyA9IHRleHROb2RlLmdldFN0eWxlZFRleHRTZWdtZW50cyhbJ2ZvbnROYW1lJywgJ2luZGVudGF0aW9uJ10pO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWdtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBzZWdtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VnbWVudCA9IHNlZ21lbnRzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VnbWVudC5jaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZXhwb3J0cy5wYXR0ZXJuLnRlc3Qoc2VnbWVudC5jaGFyYWN0ZXJzKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZENoYXJzQ291bnQgPSBzZWdtZW50LmVuZCAtIHNlZ21lbnQuc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRzZWdtZW50U3RhcnQgPSBzZWdtZW50LnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VGV4dCA9ICgwLCB0ZXh0X3RyYW5zZm9ybV8xLnRleHRUcmFuc2Zvcm0pKHNlZ21lbnQuY2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5pbnNlcnRDaGFyYWN0ZXJzKHNlZ21lbnQuZW5kLCBuZXdUZXh0LCBcIkJFRk9SRVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHROb2RlLmRlbGV0ZUNoYXJhY3RlcnMob2xkc2VnbWVudFN0YXJ0LCBvbGRzZWdtZW50U3RhcnQgKyBvbGRDaGFyc0NvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXh0Tm9kZS5nZXRTdHlsZWRUZXh0U2VnbWVudHMoWydmb250TmFtZScsICdpbmRlbnRhdGlvbiddKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudGV4dFRyYW5zZm9ybSA9IHZvaWQgMDtcbmNvbnN0IHJlcGxhY2VfMSA9IHJlcXVpcmUoXCIuL3JlcGxhY2VcIik7XG5mdW5jdGlvbiB0ZXh0VHJhbnNmb3JtKG9sZFRleHQpIHtcbiAgICByZXR1cm4gb2xkVGV4dC5yZXBsYWNlKHJlcGxhY2VfMS5wYXR0ZXJuLCByZXBsYWNlcik7XG59XG5leHBvcnRzLnRleHRUcmFuc2Zvcm0gPSB0ZXh0VHJhbnNmb3JtO1xuZnVuY3Rpb24gcmVwbGFjZXIobWF0Y2gsIHN0YXJ0LCBvcmlnaW5hbFN0cmluZykge1xuICAgIHJldHVybiBcIlhYWFwiO1xufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2NvZGUudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=