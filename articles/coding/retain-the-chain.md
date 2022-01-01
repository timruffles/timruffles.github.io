Go's error-handling became more sophisticated thanks to error-wrapping arriving in Go 1.13. Wrapping allows us to
add useful information without losing the original error. A classic example is stack-traces, e.g the `pkg/errors` helper
`WithStack(error)` which wraps the error with a stack-trace:

```go
return pkgerrors.WithStack(err) 

// if the error isn't descriptive enough, also add a prefix to the message
return pkgerrors.Wrap(err, "some extra detail")
```

Error-chaining is why we should always use `errors.Is` rather than `==` to compare errors for equality, and `errors.As`
rather than a type-assertion to extract a specific error from the chain. 

But we'll lose all of this vital functionality if we don't remember the cardinal rule of Go error-handling throughout our code: *retain the chain*.

## Example: add a code, break the chain

If you need to wrap the error in a protocol level error, e.g specify a gRPC code, common approaches throw away the
original error and its useful stack-trace:

```go
// bad: we've lost the stacktrace from err
return status.FromError(err)

// bad: we've lost the stacktrace from err
return status.New(codes.Internal, fmt.Sprintf("bad thing %s", err))
```

The Go gRPC module was written before Go 1.13 so `status.FromError` and the status type are not error-wrapping compatible. Even
 using the wrapping format verb - `%w` -  wouldn't help us: the second argument to status is a `string`. Many
other popular modules are similar. So you'll often need to write your own error-chain aware helpers. I've written `grpcerrwrap` to
retain the chain while wrapping an error with a gRPC code:

```
// returns an error which can still unwrap to `err` via errors.Is` and `errors.As`, while also returning a `InvalidArgument`
// status in gRPC
return grpcerrwrap.Code(fmt.Sprintf("bad thing", err), codes.InvalidArgument)
```

Gophers: retain the chain! 
