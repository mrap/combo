package models

import (
	"fmt"
	"math/rand"
	"sort"

	"github.com/mrap/stringutil"
	wordpatterns "github.com/mrap/wordpatterns"
)

const (
	MinCombosCount = 0
	MinMaxComboLen = 2
	MinMinComboLen = 2
)

// TODO: Might provide other languages/wordlists in the future.
//       We would need to store lookups/wordmaps in a db
var (
	_sharedWordmap *wordpatterns.Wordmap
)

func init() {
	StoreWords("wordlists/google-10000-english.txt")
}

func GenerateCombos(chars string, count, minLen, maxLen int) []string {
	// Validate and normalize params
	if len(chars) == 0 {
		return []string{}
	}

	if count < MinCombosCount {
		count = MinCombosCount
	}

	if minLen < MinMinComboLen {
		minLen = MinMinComboLen
	}

	if maxLen < MinMaxComboLen {
		maxLen = MinMaxComboLen
	}

	if maxLen < minLen {
		maxLen = minLen
	}

	combos := RankedCombos(_sharedWordmap, chars, minLen, maxLen)
	return generateComboList(_sharedWordmap, combos, count)
}

// StoreWords stores words from a word list file into
func StoreWords(filename string) {
	wm := NewDefaultWordmap()
	wordpatterns.PopulateFromFile(wm, filename)
	_sharedWordmap = wm
}

func CombosWithChars(lookup *wordpatterns.Wordmap, chars string, minLen int, maxLen int) []string {
	if maxLen < 0 {
		maxLen = 0
	}
	if minLen < 0 {
		minLen = 0
	}

	var combos []string

	for _, combo := range stringutil.Substrs(chars, minLen) {
		if (minLen != 0 && len(combo) < minLen) || (maxLen != 0 && len(combo) > maxLen || len(lookup.WordsContaining(combo)) == 0) {
			continue
		} else {
			combos = append(combos, combo)
		}
	}
	return combos
}

func RankedCombos(lookup *wordpatterns.Wordmap, chars string, minLen, maxLen int) []string {
	combos := CombosWithChars(lookup, chars, minLen, maxLen)
	sort.Sort(ByWordCount(combos))
	return combos
}

// generateComboList returns a slice of combos that are distributed based on rank
// More occurring combos will appear more frequently
func generateComboList(wm *wordpatterns.Wordmap, combos []string, count int) []string {
	total := 0
	for _, c := range combos {
		total += len(wm.WordsContaining(c))
	}

	list := make([]string, count)
	var r, cur int
	for i := 0; i < count; i++ {
		cur = 0
		r = rand.Intn(total) + 1
		for _, c := range combos {
			cur += len(wm.WordsContaining(c))
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
