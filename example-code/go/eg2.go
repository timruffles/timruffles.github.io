package test

import ("fmt"; "io"; "os")

func normal(f io.Reader) {
	if iv, ok := f.(*os.File); ok {
		fmt.Println("unwrapped you!", iv)
	}
}

func generic[F io.Reader](f F) {
	if iv, ok := f.(*os.File); ok {
		fmt.Println("unwrapped you!", iv)
	}
}