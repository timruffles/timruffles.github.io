package main

import "fmt"

type addable interface {
	Add(b addable) addable
}

type addableString string

func (a addableString) Add(b addableString) addableString {
	return a + b
}

type addableInt int

func (a addableInt) Add(b addableInt) addableInt {
	return a + b
}

func add[T interface {
	Add(b T) T
}](a, b T) T {
	return a.Add(b)
}

func main() {
	fmt.Println(
		add(addableInt(42), addableInt(1)),
		add(addableString("42"), addableString("1")),
	)
}
