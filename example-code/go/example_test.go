package test

import (
	"os"
	"io"
	"testing"
)

func TestName(t *testing.T) {
	files := []*os.File{&os.File{}}
	readers := []io.ReadCloser{&os.File{}}

	// // cannot use files (variable of type []*os.File) as type []any in argument to reverseOld
	// _ = reverseOld(files)
	// // works fine
	// _ = reverseGeneric(files)
	// _ = reverseGeneric(readers)

}
