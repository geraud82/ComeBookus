"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/isows";
exports.ids = ["vendor-chunks/isows"];
exports.modules = {

/***/ "(rsc)/../node_modules/isows/_esm/index.js":
/*!*******************************************!*\
  !*** ../node_modules/isows/_esm/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WebSocket: () => (/* binding */ WebSocket)\n/* harmony export */ });\n/* harmony import */ var ws__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ws */ \"(rsc)/../node_modules/ws/wrapper.mjs\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ \"(rsc)/../node_modules/isows/_esm/utils.js\");\n\n\nconst WebSocket = (()=>{\n    try {\n        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getNativeWebSocket)();\n    } catch  {\n        if (ws__WEBPACK_IMPORTED_MODULE_0__.WebSocket) return ws__WEBPACK_IMPORTED_MODULE_0__.WebSocket;\n        return ws__WEBPACK_IMPORTED_MODULE_0__;\n    }\n})(); //# sourceMappingURL=index.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL2lzb3dzL19lc20vaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWlDO0FBQ2U7QUFDekMsTUFBTUUsWUFBWSxDQUFDO0lBQ3RCLElBQUk7UUFDQSxPQUFPRCw2REFBa0JBO0lBQzdCLEVBQ0EsT0FBTTtRQUNGLElBQUlELHlDQUFvQixFQUNwQixPQUFPQSx5Q0FBb0I7UUFDL0IsT0FBT0EsK0JBQVVBO0lBQ3JCO0FBQ0osS0FBSyxDQUNMLGlDQUFpQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NvbWVib29rdXMtYmFja2VuZC8uLi9ub2RlX21vZHVsZXMvaXNvd3MvX2VzbS9pbmRleC5qcz9kNWNmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFdlYlNvY2tldF8gZnJvbSBcIndzXCI7XG5pbXBvcnQgeyBnZXROYXRpdmVXZWJTb2NrZXQgfSBmcm9tIFwiLi91dGlscy5qc1wiO1xuZXhwb3J0IGNvbnN0IFdlYlNvY2tldCA9ICgoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGdldE5hdGl2ZVdlYlNvY2tldCgpO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIGlmIChXZWJTb2NrZXRfLldlYlNvY2tldClcbiAgICAgICAgICAgIHJldHVybiBXZWJTb2NrZXRfLldlYlNvY2tldDtcbiAgICAgICAgcmV0dXJuIFdlYlNvY2tldF87XG4gICAgfVxufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdLCJuYW1lcyI6WyJXZWJTb2NrZXRfIiwiZ2V0TmF0aXZlV2ViU29ja2V0IiwiV2ViU29ja2V0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/isows/_esm/index.js\n");

/***/ }),

/***/ "(rsc)/../node_modules/isows/_esm/utils.js":
/*!*******************************************!*\
  !*** ../node_modules/isows/_esm/utils.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getNativeWebSocket: () => (/* binding */ getNativeWebSocket)\n/* harmony export */ });\nfunction getNativeWebSocket() {\n    if (typeof WebSocket !== \"undefined\") return WebSocket;\n    if (typeof global.WebSocket !== \"undefined\") return global.WebSocket;\n    if (typeof window.WebSocket !== \"undefined\") return window.WebSocket;\n    if (typeof self.WebSocket !== \"undefined\") return self.WebSocket;\n    throw new Error(\"`WebSocket` is not supported in this environment\");\n} //# sourceMappingURL=utils.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzL2lzb3dzL19lc20vdXRpbHMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPLFNBQVNBO0lBQ1osSUFBSSxPQUFPQyxjQUFjLGFBQ3JCLE9BQU9BO0lBQ1gsSUFBSSxPQUFPQyxPQUFPRCxTQUFTLEtBQUssYUFDNUIsT0FBT0MsT0FBT0QsU0FBUztJQUMzQixJQUFJLE9BQU9FLE9BQU9GLFNBQVMsS0FBSyxhQUM1QixPQUFPRSxPQUFPRixTQUFTO0lBQzNCLElBQUksT0FBT0csS0FBS0gsU0FBUyxLQUFLLGFBQzFCLE9BQU9HLEtBQUtILFNBQVM7SUFDekIsTUFBTSxJQUFJSSxNQUFNO0FBQ3BCLEVBQ0EsaUNBQWlDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29tZWJvb2t1cy1iYWNrZW5kLy4uL25vZGVfbW9kdWxlcy9pc293cy9fZXNtL3V0aWxzLmpzP2JhNDIiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdldE5hdGl2ZVdlYlNvY2tldCgpIHtcbiAgICBpZiAodHlwZW9mIFdlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIFdlYlNvY2tldDtcbiAgICBpZiAodHlwZW9mIGdsb2JhbC5XZWJTb2NrZXQgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHJldHVybiBnbG9iYWwuV2ViU29ja2V0O1xuICAgIGlmICh0eXBlb2Ygd2luZG93LldlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5XZWJTb2NrZXQ7XG4gICAgaWYgKHR5cGVvZiBzZWxmLldlYlNvY2tldCAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgcmV0dXJuIHNlbGYuV2ViU29ja2V0O1xuICAgIHRocm93IG5ldyBFcnJvcihcImBXZWJTb2NrZXRgIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudFwiKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCJdLCJuYW1lcyI6WyJnZXROYXRpdmVXZWJTb2NrZXQiLCJXZWJTb2NrZXQiLCJnbG9iYWwiLCJ3aW5kb3ciLCJzZWxmIiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/isows/_esm/utils.js\n");

/***/ })

};
;