package models

import (
	"fmt"
	"math/rand"
	"sort"

	"golang.org/x/tools/container/intsets"

	"github.com/mrap/stringutil"
	"github.com/mrap/wordpatterns"
)

const (
	MinCombosCount = 0
	MinMaxComboLen = 2
	MinMinComboLen = 2
)

// TODO: Might provide other languages/wordlists in the future.
//       We would need to store lookups/wordmaps in a db
var (
	_sharedLookup = make(wordpatterns.Wordmap)
)

func init() {
	StoreWords("wordlists/google-10000-english.txt")
}

type Combo struct {
	S     string
	Count int
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

	combos := SortedCombos(_sharedLookup, chars, minLen, maxLen)
	return generateComboList(combos, count)
}

// StoreWords stores words from a word list file into
func StoreWords(filename string) {
	wm := wordpatterns.CreateWordmap(filename)
	_sharedLookup = CreateCharWordLookup(wm)
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

func CombosWithChars(lookup wordpatterns.Wordmap, chars string, minLen int, maxLen int) []Combo {
	if maxLen < 0 {
		maxLen = intsets.MaxInt
	}
	if minLen < 0 {
		minLen = 0
	}

	var combos []Combo
	for _, sub := range sortedSubstrs(chars, minLen) {
		if (len(sub) >= minLen) && (len(sub) <= maxLen) {
			combos = append(combos, Combo{sub, len(lookup[sub])})
		}
	}
	return combos
}

func sortedSubstrs(chars string, minLen int) []string {
	sortedChars := stringutil.SortString(chars)
	return stringutil.Substrs(sortedChars, minLen)
}

// SortedCombos returns combos ranked by most occuring in the wordmap to least.
// i.e. a combo is more occurant if it is a substring of more words in the wordmap.
func SortedCombos(lookup wordpatterns.Wordmap, chars string, minLen, maxLen int) []Combo {
	combos := CombosWithChars(lookup, chars, minLen, maxLen)
	sort.Sort(ByCount(combos))
	return combos
}

// generateComboList returns a slice of combos that are distributed based on rank
// More occurring combos will appear more frequently
func generateComboList(combos []Combo, count int) []string {
	matchCount := sumCount(combos)
	list := make([]string, count)
	for i := 0; i < count; i++ {
		list[i] = probableCombo(combos, matchCount).S
	}
	return list
}

func sumCount(combos []Combo) int {
	total := 0
	for _, c := range combos {
		total += c.Count
	}
	return total
}

// probableCombo returns probable combo based on occurances.
// i.e. the higher the combo count, the more likely to chose it.
func probableCombo(sortedCombos []Combo, totalMatches int) Combo {
	i := 0
	for rem := rand.Intn(totalMatches) + 1; rem > 0; i++ {
		rem -= sortedCombos[i].Count
	}
	return sortedCombos[i]
}

type ByCount []Combo

func (a ByCount) Len() int      { return len(a) }
func (a ByCount) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByCount) Less(i, j int) bool {
	// sort most to least
	return a[i].Count > a[j].Count
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
