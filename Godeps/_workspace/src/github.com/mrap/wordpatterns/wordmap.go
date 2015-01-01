package main

import (
	"bufio"
	"log"
	"os"

	"github.com/mrap/stringutil"
)

type Wordmap map[string][]string

func CreateWordmap(filename string) Wordmap {
	file, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	wm := make(Wordmap)
	for scanner.Scan() {
		wm.AddWord(scanner.Text())
	}
	if err = scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return wm
}

func (wm *Wordmap) AddWord(word string) {
	substrs := stringutil.Substrs(word, 2)
	for _, s := range substrs {
		(*wm)[s] = append((*wm)[s], word)
	}
}

func (wm Wordmap) WordsContaining(substr string) []string {
	return wm[substr]
}
