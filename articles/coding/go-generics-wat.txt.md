# A WAT on Go

When is an `[]any` not an `[]any`? When generics get involved!

Will the following compile? If not, why?

```go
package main

func main() {
	one([]any{})
}

func one[S []E, E any](s S) {
	two(s)
}

func two(s []any) []any { return s }
```

<summary>
 <detail>See answer 👀</detail>

It doesn't compile, with this error:

 ```generics/main.go:9:13: cannot use s (variable of type S constrained by []E) as type []any in argument to two:
	cannot assign []E (in S) to []any
 ```

</summary>

It'd be quite reasonable to think it should compile, because:

1. in `one`, we read `[S []E, E any]`
2. by substitution, `S = []E` = `[]any`, surely?
3. therefore `S` can be passed from `one` to `two` for its `[]any` parameter

But we know from the error that we're missing something. But what?

## What's different about generics

Since `func one[S []E, E any](s S)` is using generics, what about them is causing this? If we had
a look at the spec updates when generics were added, we'd notice that we can't do some things
to values of an interface type, when that type is in a type parameter, that we could do with other
interface values. Like type assertions:

```go
package main

import "fmt"

type frobber interface{ frob() }

type mytype int

func (_ mytype) frob() {}

var _ frobber = mytype(0)

func normal(f frobber) {
	if iv, ok := f.(mytype); ok {
		fmt.Println("unwrapped you!", iv)
	}
}

func generic[F frobber](f F) {
	if iv, ok := f.(mytype); ok {
		fmt.Println("unwrapped you!", iv)
	}
}
```

If you run this you'll see `normal` compiles, but `generic` has a compile error:

```
generics/frob.go:15:15: invalid operation: cannot use type assertion on type parameter value f (variable of type F constrained by interface{frob()})
```

This is again quite surprising, `normal` and `generic` appear to have almost exactly the
same type-signature.

If we refer to the [spec](https://go.dev/ref/spec#Type_assertions), we'd see that explicitly bans type assertions on
type parameters.

> For an expression x of interface type, but not a type parameter, and a type T, the primary expression

But while it tells us that what we're doing is against the rules, it doesn't explain why that rule exists. Why can't we
use a value of an interface type (`frobber`) like other an interface values? Why is `f` in `generic[F frobber](f F)` so different
to `normal(f frobber)`?

## How do generics work?

Go's generics can be thought of as working by copy-pasting for you. If you have a function that you want to work
on a set of types, it'll copy-paste one function for each type with the type replaced. Critically, the type of
the parameter in each of the concrete function will be a concrete type, for example:

```go
package main

import "fmt"

type intOrString interface{ int | string }

func add[T intOrString](a, b T) T {
	return a + b
}

func main() {
	fmt.Println(add(42, 1), add("42", "1"))
}
```

the compiler will generate us implementations of the `add` function for all the
types that fulfil `addable`, giving us soemthing like this:

```go
// compiler generates
func compiled_addInt(a,b int) int { return a.Add(b) }
func compiled_addString(a,b string) int { return a.Add(b) }
```


## Type parameters overload the meaning of `interface`

Interface types in type parameters are not the same as in normal parameters. And values whose type is defined by a type
parameter are not interface values, even if they look the same.

Generics overloaded the meaning of `interface{}` (shorthand: `any`). Whereas before, you could be sure a `interface{}`
meant an interface value, this is no longer true, specifically whenever you're inside a function or method with a type
parameter. This is a big change, and makes the, IMO, trickiest part of Go even trickier. The explanation in the Go blog
is good - that now `interface{}` defines type sets - but it doesn't change that the behaviour of a value of type
parameter constrained by a `interface { frob()}` behaves totally differently to a value of a normal parameter
constrained by the same interface.

With generics, we now have four big 'flavours' of types in Go:

1. concrete types: `int`, structs, etc
2. interface types: `error`, `interface{}`, `any`.
3. generic type parameters

2 and 3 are different and behave differently. So it's a bit of a WAT that we use the same keywords - `interface{}`
and `any` to express both in Go's syntax.

How can we figure this out so it's no longer going to trip us up? A good intuition for Go's generics is that they're
like automatic-copy paste, where a version of the function is pasted for every type that fulfils the interface with the
type parameter replaced with that concrete type. A good intuition for interface values for non-type parameters is that
they're little boxes that hold a pair: a value of a concrete type, and its type. So you can probably see why we firstly
can't use `[S []E, E any]` as a `[]any`: `S` is a slice of a specific concrete type, but it's absolutely not a slice of
an interface types. And `[T any]`
in a parameter will take a different concrete type in each of the automatically 'pasted' implementations, but, again,
not an interface type:


You can see that neither of the compiled functions has any parameters of interface value. So that's why you can't
type-assert on them: type-assertions are something that can only operate on a interface _value_, by checking if the
dynamic value contained within is a specific concrete type. Values with types from a type-parameter will always have one
specific concrete type per generated function, so there's no 'box' to look within.

To really understand errors of this kind you first need to understand what interface values are in Go, vs values with a
concrete type, and then understand what generic types are. I've written
a [previous post](/go-interfaces-the-tricky-parts/) about interface values, but I'll reprise it here faster.

## Second example


TODO - challenge

## What is a WAT?

WAT of course came from Gary Bernhardt's talk on JavaScript, which documents some of the bizarre and seemingly
contradictory behaviour of JS. I think it's a good phrase for the parts of a language that appear to self-contradict;
that some of the language needs you to think about X in one way, and and others in another, especially if there's little
to no visual difference between the usages:

```javascript
>
{
}
+[]
> 0
> [] + []
> ''
```

Human languages have this too, of course. The pronunciation of British placenames:
Reading (Red-ing, not read-ing), Leicester (Less-ta). Illogical idioms ("I could care less"
in American English means you don't care, which contradicts a dictionary-based reading of the phrase; elsewhere it's "I
couldn't care less" which does). There's a little less justification for it in programming languages are they're
designed rather than evolved, but of course all decisions in language design have tradeoffs and sometimes a little WAT
is worth it.

## Notes

The spec pretty much admits there are two types of interface

> Interfaces that are not basic may only be used as type constraints, or as elements of other interfaces used as constraints. They cannot be the types of values or variables, or components of other, non-interface types.

Also there was [debate](https://github.com/golang/go/issues/43651) within the maintainer community about this:

> > A variable of interface type can store a value of any type with a method set that is any superset of the interface.

> Under this proposal, a variable of interface type can store a value of any type with a method set that is any superset of the interface, unless that interface type refers to a set of sets of values, in which case no such variable can be declared.

Can't declare variables of non-basic interfaces:

```go
package demo

type nonbasic interface{ ~int }

// error: interface contains type constraints
var t nonbasic
```

The 'laws of reflection' blog post
got [updated](https://cs.opensource.google/go/x/website/+/cf8a562e10cf09f2c1033a953cc55ee709daad1d) with a note that "
When discussing reflection, we can ignore the use of interface definitions as constraints within polymorphic code".
