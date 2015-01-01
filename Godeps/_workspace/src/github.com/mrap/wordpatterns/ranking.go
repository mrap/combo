package main

import (
	"fmt"
	"sync"
)

type Ranks map[string]int

func RankByOccurences(trie *Node) Ranks {
	_ranks := make(Ranks)

	_wg := &sync.WaitGroup{}
	for _, c := range trie.Children {
		rankByOccurences(_ranks, c, _wg)
	}
	_wg.Wait()
	return _ranks
}

func rankByOccurences(_ranks Ranks, _n *Node, _wg *sync.WaitGroup) {
	_wg.Add(1)

	for _, c := range _n.Children {
		rankByOccurences(_ranks, c, _wg)
	}
	_ranks[_n.Str] = len(_n.Words)

	_wg.Done()
}

func (_wm Wordmap) Ranked() []string {
	sorted := make([]string, len(_wm))
	i := 0
	for w, _ := range _wm {
		sorted[i] = w
		i++
	}
	quicksort(&_wm, &sorted, 0, len(sorted)-1)

	return sorted
}

func quicksort(wm *Wordmap, words *[]string, min int, max int) {
	if min >= max {
		return
	}
	p := qsPartition(wm, words, min, max)
	quicksort(wm, words, min, p-1)
	quicksort(wm, words, p+1, max)
}

// Sort for greatest to least
func qsPartition(wm *Wordmap, words *[]string, min int, max int) int {
	p := min
	l := min + 1
	r := max
	for l < r {
		// Move left until we find something less or equal to piv
		for l < r && wm.Compare((*words)[l], (*words)[p]) >= 0 {
			l++
		}
		// Move right until we find something greater than piv
		for wm.Compare((*words)[r], (*words)[p]) < 0 {
			r--
		}
		if r < l {
			break
		}
		swap(words, l, r)
	}
	swap(words, p, r)

	return r
}

// -1 Less than: less words or (if equal words) greater alphabetically
// 0  Equal: same word count and same letter count
// 1  More than: more words or (if equal words) less than alphabetically
func (_wm Wordmap) Compare(a, b string) int {
	if len(_wm[a]) < len(_wm[b]) {
		return -1
	} else if len(_wm[a]) > len(_wm[b]) {
		return 1
	} else {
		// Compare by character length
		if len(a) > len(b) {
			return -1
		} else if len(a) < len(b) {
			return 1
		} else {
			// Lastly compare alphabetically
			if a > b {
				return -1
			} else if a < b {
				return 1
			} else {
				return 0
			}
		}
	}
}

func swap(words *[]string, a, b int) {
	tmp := (*words)[a]
	(*words)[a] = (*words)[b]
	(*words)[b] = tmp
}

func (_wm Wordmap) PrintRanks(limit int) {
	ranked := _wm.Ranked()
	PrintWordmapArr(_wm, ranked, limit)
}

func PrintWordmapArr(wm Wordmap, arr []string, limit int) {
	if limit <= 0 {
		limit = len(arr)
	}
	var str string
	for i := 0; i < limit; i++ {
		str = arr[i]
		fmt.Println(str, ":", len(wm[str]))
	}
}
