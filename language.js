"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attempt = void 0;
function attempt(fn) {
    try {
        return fn();
    }
    catch (e) {
        return e;
    }
}
exports.attempt = attempt;
