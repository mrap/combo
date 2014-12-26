package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sort"

	"github.com/mrap/stringutil"
	wordpatterns "github.com/mrap/wordpatterns"
)

type CombosReq struct {
	Chars json.RawMessage
	Count int
}

type CombosRes struct {
	Combos []string `json:"combos"`
}

// TODO: store results in a db
var (
	_sharedLookup  = make(wordpatterns.Wordmap)
	_sharedWordmap = make(wordpatterns.Wordmap)
)

func combosHandler(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var pl CombosReq
	if err := decoder.Decode(&pl); err != nil {
		log.Fatal(err)
	}

	// strip outer quotes
	noquotes := pl.Chars[1 : len(pl.Chars)-1]
	combos := RankedCombos(_sharedLookup, string(noquotes), 2)
	comboList := GenerateComboList(_sharedWordmap, combos, pl.Count)

	data, err := json.Marshal(CombosRes{comboList})
	if err != nil {
		log.Fatal(err)
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(data)
}

// StoreWords stores words from a word list file into
func StoreWords(filename string) {
	wm := wordpatterns.CreateWordmap(filename)
	_sharedWordmap = wm
	_sharedLookup = CreateCharWordLookup(_sharedWordmap)
}

// CreateCharWordLookup creates a lookup structure that makes it efficient
// to query for sub-words that only contain specific characters
func CreateCharWordLookup(wm wordpatterns.Wordmap) wordpatterns.Wordmap {
	var (
		lookup = make(wordpatterns.Wordmap)
		sorted string
	)

	for subword, _ := range wm {
		sorted = stringutil.SortString(subword)
		lookup[sorted] = append(lookup[sorted], subword)
	}
	return lookup
}

func CombosWithChars(lookup wordpatterns.Wordmap, chars string, maxLen int) []string {
	if maxLen < 0 {
		maxLen = 0
	}
	var combos []string
	sortedChars := stringutil.SortString(chars)

	for _, subsorted := range stringutil.Substrs(sortedChars, 2) {
		if maxLen > 0 && len(subsorted) <= maxLen {
			combos = append(combos, lookup[subsorted]...)
		}
	}
	return combos
}

func RankedCombos(lookup wordpatterns.Wordmap, chars string, maxLen int) []string {
	combos := CombosWithChars(lookup, chars, maxLen)
	sort.Sort(ByWordCount(combos))
	return combos
}

// GenerateComboList returns a slice of combos that are distributed based on rank
// More occurring combos will appear more frequently
func GenerateComboList(wm wordpatterns.Wordmap, combos []string, count int) []string {
	total := 0
	for _, c := range combos {
		total += len(wm[c])
	}

	list := make([]string, count)
	var r, cur int
	for i := 0; i < count; i++ {
		cur = 0
		r = rand.Intn(total) + 1
		for _, c := range combos {
			cur += len(wm[c])
			if r <= cur {
				list[i] = c
				break
			}
		}
	}
	return list
}

type ByWordCount []string

func (a ByWordCount) Len() int      { return len(a) }
func (a ByWordCount) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByWordCount) Less(i, j int) bool {
	return _sharedWordmap.Compare(a[i], a[j]) >= 0
}

func printComboListCounts(combos []string) {
	counts := make(map[string]int)
	for _, c := range combos {
		counts[c]++
	}
	for key, count := range counts {
		fmt.Printf("%s -> %d\n", key, count)
	}
	fmt.Println()
}
