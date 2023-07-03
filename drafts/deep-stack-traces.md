Stack-traces are most useful when they cover the whole call stack at the instant the error was originated.

As example, what will we see in the stack-trace generated within `HandleGetThing` below if `RunQuery` returns an error?

```go
func HandleGetThing(r http.Request) {
    /* lots of branches and potential errors omitted ... */
    u, err := Retriever(ctx, id)
    if err != nil {
        trackErr(pkgerrors.WithStack(err))
    }   
    /* lots of other potential errors omited ... */
}
func Retriever(ctx context.Context, id int) (Thing, error) {
    /* other branches and potential errors omitted ... */
    if useCache {
        return GetThingFromDB(id)
    } else if useDB {
        return GetThingFromCache(id)
    } 
    /* other branches and potential errors omitted ... */
}
func GetThingFromCache(ctx context.Context, id int) (Thing, error) {}
func GetThingFromDB(ctx context.Context, id int) (Thing, error) {}

// example of a function outside of our application's code
func RunQuery(ctx context.Context, q Query) (Result, error) {
    // ...
    return errors.New("bang")
}
```

We'd only see `HandleGetThing` in our stack. At the point at which control has returned to `HandleGetThing` the stack has
unwound. Go's `errors` package does not capture stack-traces, the only data it contains is the error message. A stack trace
with only `HandleGetThing` is not very helpful. If it was a `context deadline exceeded` it could have come from any point call-stack reachable from `Retriever`. For instance we would have no idea if `GetThingFromDB` or `GetThingFromCache` was called. 

If instead we wrapped the error as soon as we received it from outside our application, we'd have the whole stack captured. For instance
if an error occured in `GetThingFromDB` and we wrapped it there, we'd see the full `HandleGetThing`, `Retriever` and `GetThingFromDB` call stack.

```go
func GetThingFromDB(ctx context.Context, id int) (Thing, error) {
    /* other branches and potential errors omitted ... */
    r, err := db.RunQuery(db.Query{/* ... */})
    if err == nil { /* happy path */ }
    
    // generates the stack while we still have the deepest possible stack trace
    return Thing{}, pkgerrors.WithStack(err)
}
````

Therefore we should try to ensure all errors are wrapped with a stack-trace at point of origin. If that's in application
code we can wrap them as we create them, e.g via `pkgerrors.New`. If it's a standard-library or third-party error we can
wrap them once they're returned to our application code. 

This is true even for signal errors, often implemented as package constants. Wrap them with a stack-trace at the point
at which you return them:

```go
const ErrSomething = errrors.New("some-err")

func Foo() error {
    // will generate the deepest possible stack-trace: that covering all frames on the stack at the instant
    // the error was originated
    return pkgerrors.WithStack(ErrSomething)
}

// calling code
func bar() {
    err := f.Foo()
    if errors.Is(err, f.ErrSomething) {
        // we'll still end up here correctly - pkgerrors retains the chain
    }
}
```
