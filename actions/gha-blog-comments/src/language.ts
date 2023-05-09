export const do_ = <T>(fn: () => T): T => fn()

export const assertExhaustive = (v: never): never => {
    throw Error(`runtime value ${v} fell through compile-time exhaustive switch`)
}

class FailedAttempt {
    readonly isFailedAttempt = true;
    constructor(readonly error: Error) {
    }
}

type ErrorOr<T> =
    FailedAttempt
    | T

export const attemptFailed = <T,E>(t: ErrorOr<T>): t is FailedAttempt =>
    (t as FailedAttempt)?.isFailedAttempt === true;

export const attemptOk = <T,E>(t: ErrorOr<T>): t is T =>
    (t as FailedAttempt)?.isFailedAttempt == null;

// Runs a promise-returning function, and returns result value or Error
// useful for avoiding the nesting and let required in awaits
export const attempt = async <T>(fn: () => Promise<T>): Promise<ErrorOr<T>> => {
    try {
        return await fn()
    } catch(e) {
        return new FailedAttempt(e as Error)
    }
}