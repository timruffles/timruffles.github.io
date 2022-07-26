package main

import "fmt"

type addable[T any] interface {
	Add(a, b T) T
}

type addableString string
type addableInt int

func add[T addable](a, b T) T {
	return a.Add(b)
}

func main() {
	fmt.Println(add(42, 1), add("42", "1"))
}
