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

1. `one` has the type parameter `[S []E, E any]`
2. by substitution, `S = []E` = `[]any`, surely?
3. therefore `S` can be passed from `one` to `two` for its `[]any` parameter

But we know from the error that we're missing something. But what? It's not a `~` (tilde) btw: we'll
come back to that but believe me that it's not important yet.

## Type parameters share a syntax but not behaviour

If we had a look at the spec updates when generics were added, we'd notice that we can't do some things
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

If we refer to the [spec](https://go.dev/ref/spec#Type_assertions), we'd see that the compile error might be expected: the spec explicitly bans type assertions on
type parameters.

> For an expression x of interface type, but not a type parameter, and a type T, the primary expression

But while this tells us that what trying to do is against the rules, it doesn't explain why that rule exists. Why can't we
use a value of an interface type (`frobber`) like other an interface values? Why is `f` in `generic[F frobber](f F)` so different
to `normal(f frobber)`?

## How do generics work?

Go's generics can be thought of as working by copy-pasting ('instantiating') for you. If you have a function that you want to work
on a set of types, it'll copy-paste one function for each type, specialised for that type. Critically, the type of
the parameter in each of those function will be a different type, for example:

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
types that fulfil `addable`, giving us something like this:

```go
// compiler generates
func compiled_addInt(a,b int) int { return a.Add(b) }
func compiled_addString(a,b string) int { return a.Add(b) }
```

The critical point is: in neither of these functions is the type of parameter an interface type. And we [know](/go-interfaces-the-tricky-parts/) that
interface values are a completely different _kind_ of value in Go to concrete values. Type assertions
in Go only work on interface values. There's no interface
value to contain a dynamic type because it's unnecessary here: the types have been made concrete already, there's
no dynamic type to determine at runtime. So there's both no need for type assertions in the generated functions - the type is set - and no mechanism for it - Go's type assertions work on interface _values_.

## Back to our example

Does this explain `S` from `[S []E, E any]` not being `[]any`?

1. first - [recall (or grok)](/go-interfaces-the-tricky-parts/) that interface are containers that hold concrete values in Go
2. therefore `[]any` is "a slice of interface containers holding any concrete values", not "a slice of any concrete value"
3. next recall that `[E any]` in a generic function will end up as a number of 'copy-pasted' functions, one for each concrete type in E's type-set
4. combine these understandings: `S` is the set of all slice types (e.g. `[]int`, `[]*os.File`), and not all of them are interface types (`[]io.Reader`)

Point 4 is worth digging into: _one_ of the types in `S`'s type-set is `[]any`. And equally that set includes many other concrete slice-types where the element type is an interface, e.g. `[]io.Reader`. _All_ slices of interface types
in S would be fine to pass as `[]any` - as all (basic) interfaces as assignable to `any`.
_However_, since the type-set can include slices of non-interfaces (`[]int`), it would not be correct for the compile to allow us to pass `S` into a non-generic function accepting `[]any`.

## Type parameters overload the meaning of `interface`

This has taught us something surprising, and perhaps unfortunate. Interface types from type parameters are not the same as those from normal parameters. And values whose type is defined by a type
parameter are not always interface values, and thus can't be used like interface values, even if they look the same.

Therefore generics have overloaded the meaning of `any` (a shorthand for `intreface{}`). Whereas before, you could be sure a `any`/`interface{}`
meant an interface value, this is no longer true, specifically whenever you're inside a function or method with a type
parameter. This makes the trickiest, IMO, part of Go even trickier. The behaviour of a value of type
parameter constrained by `interface { frob() }` behaves totally differently to a value of a normal parameter
constrained by the same interface. But they share a keyword.

We now have three big 'flavours' of types in Go:

1. concrete types: `int`, structs, etc
2. 'basic' interface types: `error`, `interface{}`, `any`.
3. generic type parameters

2 and 3 are different and behave differently. So it's a bit of a WAT that we use the same keywords - `interface{}`
and `any` - to express both in Go's syntax.


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
