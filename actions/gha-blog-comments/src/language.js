"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attempt = exports.attemptOk = exports.attemptFailed = exports.assertExhaustive = exports.do_ = void 0;
const do_ = (fn) => fn();
exports.do_ = do_;
const assertExhaustive = (v) => {
    throw Error(`runtime value ${v} fell through compile-time exhaustive switch`);
};
exports.assertExhaustive = assertExhaustive;
class FailedAttempt {
    constructor(error) {
        this.error = error;
        this.isFailedAttempt = true;
    }
}
const attemptFailed = (t) => t?.isFailedAttempt === true;
exports.attemptFailed = attemptFailed;
const attemptOk = (t) => t?.isFailedAttempt == null;
exports.attemptOk = attemptOk;
// Runs a promise-returning function, and returns result value or Error
// useful for avoiding the nesting and let required in awaits
const attempt = async (fn) => {
    try {
        return await fn();
    }
    catch (e) {
        return new FailedAttempt(e);
    }
};
exports.attempt = attempt;
