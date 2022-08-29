# When is a slice of any not a slice of any?

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
2. by substitution, `S = []E`, `E = any`, so `S = []any`, surely?
3. therefore we should be able to pass `S` into a function accepting `[]any`?

But we know from the error that we're missing something. But what? It's not a `~` (tilde), we'll
come back to tilde but it's not important here and we have enough to cover.

## How do generics work?

Go's generics can be thought of as working by copy-pasting - 'instantiating' in the spec - for you. If you have a function that you want to work
on a set of types, it'll copy-paste one function for each type, replacing the type parameters with that spec specifically. Taking the signature of our `one` function from above:

```go
package main

func one[S []E, E any](s S) {}

func main() {
    one([]int{})
    one([]string{})
    one([]any{})
}
```

the compiler will generate us implementations of the `one` function for all the
types in our type-set (in theory: in reality the subset that we actually use in our program).
The compiled functions will look a bit like this (use the [compiler explorer](https://godbolt.org/z/e63579sqM) to see the real output), and you can
see the type parameter has been replaced with the specific types we used:

```go
// compiler generates
func compiled_one(s []int) { }
func compiled_one(s []string) { }
func compiled_one(s []interface{}) { }
```

Can you see why `S` isn't `[]any` yet? Hint: `type any = interface{}`.

Well, observe that two of the 'copy-pasted' functions accept slices of a specific concrete type. Therefore we have proved something important: `S` is sometimes
a slice of concrete, not interface, values. This has to be the case - otherwise we couldn't write functions like `func [S []E, E any] First(s S) E`.

Hang on, you might say, doesn't `any`/`interface{}` mean "any value", and therefore, `[]any` mean "any type of slice"?

## Doesn't `any` mean anything?

Well here's where things will get a bit (more) confusing.




It's vital here, as with Go generally, to understand that in Go, interface values are _containers_ for
concrete values, rather than _attributes of_ concrete values. You can do things to interface values
that contain concrete values that you cannot do to concrete values - like type assertions, and reflection.

This is a tricky concept, and I have written a whole post to explain it. If you don't already
understand that interface values behave totally differently to how they do in other languages, e.g.
Java, TypeScript etc - [read that first](/go-interfaces-the-tricky-parts/).

Okay: so interface values are different. That means that `[]any` is not "any slice", it's
"any slice of interface values". Any slice of interface values is _assignable_ to a (non type-parameter) value of `[]any`
because every interface is contained within the type-set of `any`.

## Back to our example

So: we've learned about instantiation of generics ('copy-pasting'). We've recalled or learned that interface values
contain concrete values, rather than being merely an attribute of concrete values (as they are in some other languages), so a slice of concrete values is completely different from a slice of interface values.

Together, does this explain `S` from `[S []E, E any]` not being `[]any`?

1. we know that only slices of interface values can be assigned to `[]any` (so not slices of concrete values, like `[]int`)
2. we know that `[S []E, E any]` in a generic function will end up as a number of 'copy-pasted' type, one for each concrete type in `S`'s type-set
3. since `[S []E, E any]` is the set of all slice types (e.g. `[]int`, `[]*os.File`), and not all of them are slices of concrete, e.g. `[]io.Reader`, `[]interface{frob()}`, `S` type-set includes types not in the type-set of `[]any`

That's (hopefully) solved the mystery. But it does reveal something pretty awkward.

Go's syntax now overloads the meaning of `interface`/`any` for two completely different things, that behave in different values. But they're used in similar places (function arguments), and look extremely similar.

## Type-parameters use interface but aren't interfaces

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

You can see than in both `normal` and `generic` we have constrained a parameter with the interface
type `frobber`. But in `generic` we've done that via a type-parameter.

If you run this you'll see `normal` compiles, but `generic` has a compile error:

```
generics/frob.go:15:15: invalid operation: cannot use type assertion on type parameter value f (variable of type F constrained by interface{frob()})
```

On the face of it, this is surprising, `normal` and `generic` appear to have almost exactly the
same type-signature, and use exactly the same type for the parameter.

If we refer to the [spec](https://go.dev/ref/spec#Type_assertions), we'd see that the compile error might be expected: the spec explicitly bans type assertions on
type parameters.

> For an expression x of interface type, but not a type parameter, and a type T, the primary expression

But while this tells us that what trying to do is against the rules, it doesn't explain why that rule exists. But
hopefully after reading the above you can explain this yourself. Why can't we
use a value of an interface type (`frobber`) when it's a generic type-parameter in the same was as when it's a non-generic parameter type?

Because not all of the values in `[F frobber]`'s type-set are interface values. Type-assertions are specifically
designed to look into a "box" (an interface value) and determine its dynamic (runtime) type. Generics are another
approach to have one function handle multiple types (AKA polymorphism): the compiler copy-pasting ('instantiating')
a function per concrete type. Not all of those concrete types are interface values, so we can't write code that
assumes they are.

## Type parameters overload the meaning of `interface`

All this has taught us something surprising, and perhaps unfortunate. Interface types from type parameters are not the same as those from normal parameters. And values whose type is defined by a type
parameter are not always interface values, and thus can't be used like interface values, even if they look the same.

Therefore generics have overloaded the meaning of `interface`/`any`. Whereas before, you could be sure a `any`/`interface{}`
meant an interface value, this is no longer true, specifically whenever you're inside a function or method with a type
parameter.  The behaviour of a value of type
parameter constrained by `interface { frob() }` behaves totally differently to a value of a normal parameter
constrained by the same interface. But they share a keyword.

This makes the trickiest part of Go - interfaces - even trickier. We now have three big 'flavours' of types in Go:

1. concrete types: `int`, structs, etc
2. 'basic' interface types: `interface { frob() }`, `interface{}`, `any`.
3. non-basic interfaces, containing types rather than just methods: `interface { int | string }`
4. generic type parameters

2 and 3 are different and behave differently. Another example: you can't non-basic interface types can't be the type of variables. And generic and normal functions accepting 2 - basic interfaces - behave differently. So it's, IMHO, a WAT that we use the same keywords - `interface`
and `any` - to express both.

## What is a WAT?

WAT ("WHAT?!") is from from Gary Bernhardt's talk on JavaScript, which documents some of the bizarre and seemingly
contradictory behaviour of JS. I think WAT is a good phrase for the parts of any language that appear to self-contradict;
places where the language needs you to think about a language feature in a way that appears to contradict how it's thought of elsewhere, especially if there's little
to no visual difference between the usages:

```javascript
> {} + []
> 0
> [] + {}
> '[object Object]'
> [] + []
> ''
```

Human languages have WATs too, of course. The pronunciation of British placenames:
Leicester (Less-ta), Southwark (Suth-uck, not South-wark). Illogical idioms: "I could care less"
in American English has come to mean you don't care at all.

But there's a little less justification for it in programming languages are they're
designed rather than evolved. Of course all decisions in language design have tradeoffs and sometimes a little WAT
is worth it you get lots of convenience for a low cost. But here I can't help but think a little extra syntax would have been worth it: interfaces are already surpirsing enough.

## Notes

The spec pretty much admits there are two types of interface

> Interfaces that are not basic may only be used as type constraints, or as elements of other interfaces used as constraints. They cannot be the types of values or variables, or components of other, non-interface types.

Also there was [debate](https://github.com/golang/go/issues/43651#issuecomment-758854504) within the maintainer community about this:

> I remain concerned that this proposal overloads words (and keywords!) that formerly had very clear meanings — specifically the words type and interface and their corresponding keywords — such that they each now refer to two mostly-distinct concepts that really ought to instead have their own names

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
