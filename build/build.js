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
                    textNode.characters = "XXX";
                }
                else {
                    debugger;
                    const segments = textNode.getStyledTextSegments(['fontName', 'indentation']);
                    console.log(segments);
                    for (let i = segments.length - 1; i >= 0; i--) {
                        const segment = segments[i];
                        console.log(segment.characters);
                        const oldCharsCount = segment.end - segment.start;
                        const oldsegmentStart = segment.start;
                        const newText = "XXX";
                        textNode.insertCharacters(segment.end, newText, "BEFORE");
                        textNode.deleteCharacters(oldsegmentStart, oldsegmentStart + oldCharsCount);
                    }
                    console.log(textNode.getStyledTextSegments(['fontName', 'indentation']));
                }
            }
        }
    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsNkJBQTZCLG1CQUFPLENBQUMseURBQXNCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQzVCWTtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsdUJBQXVCO0FBQ3ZCLGtCQUFrQixtQkFBTyxDQUFDLG1DQUFXO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsdUJBQXVCOzs7Ozs7Ozs7OztBQ3RCVjtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxRQUFRO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7OztVQ3ZGQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vTWFueSBGYWtlci8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL01hbnkgRmFrZXIvLi9zcmMvbWVzc2FnZS1kaXNwYXRjaGVyLnRzIiwid2VicGFjazovL01hbnkgRmFrZXIvLi9zcmMvcmVwbGFjZS50cyIsIndlYnBhY2s6Ly9NYW55IEZha2VyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01hbnkgRmFrZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9NYW55IEZha2VyL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9NYW55IEZha2VyL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbi8vIFRoaXMgcGx1Z2luIHdpbGwgb3BlbiBhIHdpbmRvdyB0byBwcm9tcHQgdGhlIHVzZXIgdG8gZW50ZXIgYSBudW1iZXIsIGFuZFxuLy8gaXQgd2lsbCB0aGVuIGNyZWF0ZSB0aGF0IG1hbnkgcmVjdGFuZ2xlcyBvbiB0aGUgc2NyZWVuLlxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBtZXNzYWdlX2Rpc3BhdGNoZXJfMSA9IHJlcXVpcmUoXCIuL21lc3NhZ2UtZGlzcGF0Y2hlclwiKTtcbi8vIFRoaXMgZmlsZSBob2xkcyB0aGUgbWFpbiBjb2RlIGZvciBwbHVnaW5zLiBDb2RlIGluIHRoaXMgZmlsZSBoYXMgYWNjZXNzIHRvXG4vLyB0aGUgKmZpZ21hIGRvY3VtZW50KiB2aWEgdGhlIGZpZ21hIGdsb2JhbCBvYmplY3QuXG4vLyBZb3UgY2FuIGFjY2VzcyBicm93c2VyIEFQSXMgaW4gdGhlIDxzY3JpcHQ+IHRhZyBpbnNpZGUgXCJ1aS5odG1sXCIgd2hpY2ggaGFzIGFcbi8vIGZ1bGwgYnJvd3NlciBlbnZpcm9ubWVudCAoU2VlIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9wbHVnaW4tZG9jcy9ob3ctcGx1Z2lucy1ydW4pLlxuLy8gVGhpcyBzaG93cyB0aGUgSFRNTCBwYWdlIGluIFwidWkuaHRtbFwiLlxuZmlnbWEuc2hvd1VJKF9faHRtbF9fKTtcbi8vIENhbGxzIHRvIFwicGFyZW50LnBvc3RNZXNzYWdlXCIgZnJvbSB3aXRoaW4gdGhlIEhUTUwgcGFnZSB3aWxsIHRyaWdnZXIgdGhpc1xuLy8gY2FsbGJhY2suIFRoZSBjYWxsYmFjayB3aWxsIGJlIHBhc3NlZCB0aGUgXCJwbHVnaW5NZXNzYWdlXCIgcHJvcGVydHkgb2YgdGhlXG4vLyBwb3N0ZWQgbWVzc2FnZS5cbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIHlpZWxkICgwLCBtZXNzYWdlX2Rpc3BhdGNoZXJfMS5tZXNzYWdlRGlzcGF0Y2gpKG1zZyk7XG4gICAgLy8gTWFrZSBzdXJlIHRvIGNsb3NlIHRoZSBwbHVnaW4gd2hlbiB5b3UncmUgZG9uZS4gT3RoZXJ3aXNlIHRoZSBwbHVnaW4gd2lsbFxuICAgIC8vIGtlZXAgcnVubmluZywgd2hpY2ggc2hvd3MgdGhlIGNhbmNlbCBidXR0b24gYXQgdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuLlxuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1lc3NhZ2VEaXNwYXRjaCA9IHZvaWQgMDtcbmNvbnN0IHJlcGxhY2VfMSA9IHJlcXVpcmUoXCIuL3JlcGxhY2VcIik7XG5mdW5jdGlvbiBtZXNzYWdlRGlzcGF0Y2gobXNnKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKG1zZy50eXBlID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGVzID0geWllbGQgKDAsIHJlcGxhY2VfMS5yZXBsYWNlKShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gbm9kZXM7XG4gICAgICAgICAgICAvLyAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhub2Rlcyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMubWVzc2FnZURpc3BhdGNoID0gbWVzc2FnZURpc3BhdGNoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVwbGFjZSA9IHZvaWQgMDtcbmZ1bmN0aW9uIHJlcGxhY2Uoc2VsZWN0aW9uKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0ZWROb2RlIG9mIHNlbGVjdGlvbikge1xuICAgICAgICAgICAgY29uc3QgZm91bmROb2RlcyA9IHRyYXZlcnNlKHNlbGVjdGVkTm9kZSk7XG4gICAgICAgICAgICBpZiAoZm91bmROb2Rlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIG5vZGVzID0gbm9kZXMuY29uY2F0KGZvdW5kTm9kZXMpO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkIHJlcGxhY2VUZXh0c09uTm9kZXMobm9kZXMpO1xuICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgfSk7XG59XG5leHBvcnRzLnJlcGxhY2UgPSByZXBsYWNlO1xuZnVuY3Rpb24gdHJhdmVyc2UocGFyZW50Tm9kZSkge1xuICAgIGxldCBub2RlcyA9IFtdO1xuICAgIGlmIChwYXJlbnROb2RlLnR5cGUgPT09IFwiVEVYVFwiKSB7XG4gICAgICAgIG5vZGVzLnB1c2gocGFyZW50Tm9kZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKFwiY2hpbGRyZW5cIiBpbiBwYXJlbnROb2RlKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgcGFyZW50Tm9kZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09IFwiR1JPVVBcIiB8fFxuICAgICAgICAgICAgICAgIGNoaWxkLnR5cGUgPT09IFwiRlJBTUVcIiB8fFxuICAgICAgICAgICAgICAgIGNoaWxkLnR5cGUgPT09IFwiSU5TVEFOQ0VcIiB8fFxuICAgICAgICAgICAgICAgIGNoaWxkLnR5cGUgPT09IFwiQ09NUE9ORU5UXCIgfHxcbiAgICAgICAgICAgICAgICBjaGlsZC50eXBlID09PSBcIlRFWFRcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvdW5kTm9kZXMgPSB0cmF2ZXJzZShjaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlcyA9IG5vZGVzLmNvbmNhdChmb3VuZE5vZGVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGVzO1xufVxuZnVuY3Rpb24gcmVwbGFjZVRleHRzT25Ob2Rlcyh0ZXh0Tm9kZXMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0ZXh0Tm9kZXMubGVuZ3RoKTtcbiAgICAgICAgZm9yIChjb25zdCB0ZXh0Tm9kZSBvZiB0ZXh0Tm9kZXMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRleHROb2RlLnR5cGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGV4dE5vZGUuZm9udE5hbWUpO1xuICAgICAgICAgICAgaWYgKHRleHROb2RlLmZvbnROYW1lICE9PSBmaWdtYS5taXhlZCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmModGV4dE5vZGUuZm9udE5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgeWllbGQgUHJvbWlzZVxuICAgICAgICAgICAgICAgICAgICAuYWxsKHRleHROb2RlLmdldFJhbmdlQWxsRm9udE5hbWVzKDAsIHRleHROb2RlLmNoYXJhY3RlcnMubGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGZpZ21hLmxvYWRGb250QXN5bmMpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0ZXh0Tm9kZS5oYXNNaXNzaW5nRm9udCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybigndW5hYmxlZCB0byBlZGl0IHRleHQgbm9kZSBkdWUgdG8gbWlzc2luZyBmb250Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGV4dE5vZGUuZm9udE5hbWUgIT09IGZpZ21hLm1peGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlLmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGV4dE5vZGUuY2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlLmNoYXJhY3RlcnMgPSBcIlhYWFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRzID0gdGV4dE5vZGUuZ2V0U3R5bGVkVGV4dFNlZ21lbnRzKFsnZm9udE5hbWUnLCAnaW5kZW50YXRpb24nXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlZ21lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IHNlZ21lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50ID0gc2VnbWVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWdtZW50LmNoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkQ2hhcnNDb3VudCA9IHNlZ21lbnQuZW5kIC0gc2VnbWVudC5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZHNlZ21lbnRTdGFydCA9IHNlZ21lbnQuc3RhcnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gXCJYWFhcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHROb2RlLmluc2VydENoYXJhY3RlcnMoc2VnbWVudC5lbmQsIG5ld1RleHQsIFwiQkVGT1JFXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dE5vZGUuZGVsZXRlQ2hhcmFjdGVycyhvbGRzZWdtZW50U3RhcnQsIG9sZHNlZ21lbnRTdGFydCArIG9sZENoYXJzQ291bnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRleHROb2RlLmdldFN0eWxlZFRleHRTZWdtZW50cyhbJ2ZvbnROYW1lJywgJ2luZGVudGF0aW9uJ10pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9