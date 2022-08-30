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

But we know from the error that this reasoning is missing something. But what? It's not `~`[1].

[1] it's not a `~` (tilde), we'll come back to tilde but it's not important here and we have enough to cover.

Figuring this out is worth it. If you follow me on this journey I'm certain you'll be way above the 
average Go developer in your grasp of how generics, and interfaces, really work.

## Why did Go add generics?

First up, let's remind ourselves why Go added generics. Without generics we couldn't write certain types of
functions in a type-safe way, for example: "reverse a slice". 

Quick note: `any` is a just an alternative way to write `interface{}`. `any` landed with generics in Go 1.18, but `any` is `interface{}`. I'll mostly write `any`, but it's valuable to remind yourself that I could have used `interface{}` instead.

Pre-generics, we'd have to have written something that sacrificed compile-time type-safety in some way. Either
writing a function accepting `[]any` for a little compile-time help (ensuring we're at least working with a slice), 
or just `any` (which would require reflection). I'll discuss just the first approach, `reverseOld`, here:

```go
// technically it would have been []interface{} pre-Go 1.18
func reverseOld(s []any) bool) []any { /* ... */ }
```

with generics we can use type-parameters:

```go
func reverseGeneric[S []E, E any](s S) bool) []E { /* ... */ }
```

The `reverseGeneric` version is better for two reasons. First, the `reverseOld` approach loses type information: even when we pass in a slice with a non-any type like `[]io.Reader` we get back `[]any`:

```go
readers := []io.Reader{}

// won't compile - we get back []any
var rev []io.Reader = reverseOld(readers)
// works fine - we keep the type
var revGen []io.Reader = reverseGeneric(readers)
```

Secondly, the `reverseOld` function can't work with all slices, but `reverseGeneric` can. `reverseOld` can only accept slices whose element type is an interface type:

```go
files := []*os.File{}
readers := []io.ReadCloser{}

// cannot use files (variable of type []*os.File) as type []any in argument to reverseOld
_ = reverseOld(files)
// works fine
_ = reverseGeneric(files)
_ = reverseGeneric(readers)
```

If it's completely baffling to you that `reverseOld` can't accept `[]*os.File`, that's probably because you're thinking 'Huh? But doesn't `[]any` mean "any slice"?'. If so - you are not alone. Read the next section. If that behaviour already makes total sense to you, [skip ahead](/TODO).

## `[]any` has never meant any slice

Even before generics, `[]interface{}` (exactly equivalent to `[]any`) did not mean "any slice".

Values with an interface type in Go are _containers for_ concrete types, not the concrete types themselves. They're boxed types. Go does a lot to hide this from you for convenience,
and that 'magic' also makes it really easy to write a lot of Go without being aware of this distinction. This is very different from how
other languages handle this - e.g. TypeScript. 

So `[]any` in Go, before and after generics landed, means "a slice of interface boxes". Since the empty interface - `any` - has no methods, every
type fulfils it. But, as said, we need those boxes: a slice of concrete values like `[]int` or `[]string` looks totally different in memory and
therefore can't be used with code that accepts `[]any`.

This took me ages to get my head around. If this quick explanation hasn't clicked with you, I've written [another post](/go-interfaces-the-tricky-parts/) that explains why interfaces work like this in Go (even pre generics). 

## How do generics work?

We've learned type-parameters let us write a much broader set of generic functions that interfaces alone did. Now let's have a look
into how Go compiles generic code. After that, we'll have enough to solve our puzzle.

Go's generics can be thought of as working by doing some copy-pasting - called 'instantiating' in the spec - for you.
If you have a function that you want to work on a set of types, it'll copy-paste one specialised function for each type, replacing the type parameters with specific types. Taking a function with the signature of our `one` function from the puzzle:

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
types assignable to `E`/`S` (the spec calls this the "type set"). In theory for `any` that's every type we include, a huge amount to compile! But in reality Go does this only for the subset of types that we actually pass into `one` in our program).
The compiled functions will look a bit like this (use the [compiler explorer](https://godbolt.org/z/e63579sqM) to see the real output), and you can
see the type parameter has been replaced with the specific types we used:

```go
// compiler generates
func compiled_one(s []int) { }
func compiled_one(s []string) { }
func compiled_one(s []interface{}) { }
```

This should make it clear why `S` can't be considered `[]any`. Two of the compiled function implementations accept slices of a specific concrete type.

So to correct our reasoning from the start of the post:

1. `one` has the type parameter `[S []E, E any]`
2. we know `any` here has a type-set that covers non-interface types
3. therefore we can't pass `S` into a non-generic function accepting `[]any`. `S` is a superset of `[]any`: `[]any` only covers slices of interface types

This makes sense! As said, a major motivation for generics was exactly that, writing functions that can work with all slices. 

## The two flavours of interface

Solving this myster has taught us something important: `any`/`interface{}` means something different in generic and non-generic code:

* in generic code, e.g. `[S []E, E any]`, `any` really means "any type"
* in non-generic code, e.g. `[]any`, `any` means "any interface type", which is a subset of "any type"

This was fact missing from our reasoning at the top of the post. In Go, the meaning of `any`/`interface{}` is different based
on whether it appears in generic or non-generic code. In generic code, strangely enough, a value with an interface type, e.g.
`interface{}`, `any` or `io.Reader`, _can't_ be used as an interface. 


## Type parameters overload the meaning of `interface`

All this has taught us something surprising, and perhaps unfortunate. Interface types from type parameters are not the same as those from normal parameters. And values whose type is defined by a type
parameter are not always interface values, and thus can't be used like interface values, even if they look the same.

Therefore generics have overloaded the meaning of `interface`/`any`. Whereas before, you could be sure a `any`/`interface{}`
meant an interface value, this is no longer true, specifically whenever you're inside a function or method with a type
parameter.  The behaviour of a value of type
parameter constrained by `interface { frob() }` behaves totally differently to a value of a normal parameter
constrained by the same interface. But they share a keyword.

This makes the trickiest part of Go - interfaces - even trickier. We now have multiple 'flavours' of types in Go,
and three of them share the same keyword, `interface`:

1. concrete types: `int`, structs, etc
2. 'basic' interface types: `interface { frob() }`, `interface{}`, `any`.
3. non-basic interfaces, containing types rather than just methods: `interface { int | string }`
4. generic type parameters

2 and 3 are different and behave differently. Another example: you can't non-basic interface types can't be the type of variables. And generic and normal functions accepting 2 - basic interfaces - behave differently.


## Type-assertions and generics

In Go, we can use type-assertions to determine the concrete type of an interface value. Or, at least, you can outside
of generic code. Let's see an example:

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

You can see than in both `normal` and `generic` we have constrained a parameter with the interface
type `frobber`. But in `generic` we've done that via a type-parameter. One the syntax level, this is surprising: 
`normal` and `generic` appear to have almost exactly the same type-signature, and use exactly the same type for the parameter.

But this shouldn't surprise us, because we now know that interface means something different in generic and non-generic code.
In generic code it's a type-constraint, but the value may be concrete. In non-generic code, the value is always boxed in an interface value.

If we refer to the [spec](https://go.dev/ref/spec#Type_assertions), we'd see that the compile error might be expected: the spec explicitly bans type assertions on
type parameters.

> For an expression x of interface type, but not a type parameter, and a type T, the primary expression

But while this tells us that what trying to do is against the rules, it doesn't explain why that rule exists. But
hopefully after reading the above you can explain this yourself. Why can't we
use a value of an interface type (`frobber`) when it's a generic type-parameter in the same was as when it's a non-generic parameter type?

Can you explain why with what you've learned above?

As you'll recall, not all of the values in `[F frobber]`'s type-set are interface values. Type-assertions are specifically
designed to look into a "box" (an interface value) and determine its dynamic (runtime) type. Generics are another
approach to have one function handle multiple types: the compiler copy-pasting ('instantiating')
a function per concrete type. Not all of those concrete types are interface values, so we can't write code that
assumes they are.

## Back to our example

So: we've learned about instantiation of generics ('copy-pasting'). We've recalled or learned that interface values
contain concrete values, rather than being merely an attribute of concrete values (as they are in some other languages), so a slice of concrete values is completely different from a slice of interface values.

Together, does this explain `S` from `[S []E, E any]` not being `[]any`? Yes:

1. we know that only slices of interface values can be assigned to `[]any` (so not slices of concrete values, like `[]int`)
2. we know that `[S []E, E any]` in a generic function will end up as a number of 'copy-pasted' type, one for each concrete type in `S`'s type-set
3. since `[S []E, E any]` is the set of all slice types (e.g. `[]int`, `[]*os.File`), and not all of them are slices of concrete, e.g. `[]io.Reader`, `[]interface{frob()}`, `S` type-set includes types not in the type-set of `[]any`

That's solved the mystery. 

## Notes

The spec does tell us there are now two types of interface

> Interfaces that are not basic may only be used as type constraints, or as elements of other interfaces used as constraints. They cannot be the types of values or variables, or components of other, non-interface types.

The way generics have overloaded the concept and syntax of interfaces was [mentioned](https://github.com/golang/go/issues/43651#issuecomment-758854504) by maintainers during the design discussions:

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


## Slicesd



You don't have to fully understand why to continue, but it's certainly
important to keep in mind that in Go, `[]any`, or `[]SomeInterface` _cannot_ be assigned a slice of concrete values, even if those values
fulfil the interface (and all values fulfil the empty interface, `interface{}`, for which `any` is a synonym).

But in contrast to `reverseAny`, `reverseGeneric` can really work on all slices:

```go
files := []*os.File{}
readers := []io.ReadCloser{}

// won't compile - we get back []any
var reverseed []*os.File = reverseAny(files, reverseFile)

// cannot use files (variable of type []*os.File) as type []any in argument to reverseAny
_ = reverseGeneric(files, reverseFile)
_ = reverseGeneric(readers, reverseReader)
```


To recap, Go added generics mainly to allow us to work on collections of any value, e.g. `[]int`, `[]any`, `[]interface{ id() }`, in the same
way.

## The two flavours of `any`

If you recall, `any` arrived in Go along with generics. It's a synonym for `interface{}`: they're interchangable
so anything you say about `any` applies to `interface{}`.
