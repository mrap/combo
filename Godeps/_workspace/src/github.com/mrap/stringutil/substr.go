package stringutil

import (
	"sort"
)

func Substrs(str string, minLen int) []string {
	// Convert to a rune to safely handle unicode
	r_str := []rune(str)
	totLen := len(r_str)
	var subsCount, length int

	if minLen <= 1 {
		minLen = 1
		length = totLen
		subsCount = factorial(length)
	} else {
		length = totLen - minLen + 1
		subsCount = factorial(length)
	}

	subs := make([]string, subsCount)

	next := 0
	for i := 0; i < length; i++ {
		for j := i; j < totLen; j++ {
			lenbtw := j - i + 1
			if lenbtw >= minLen {
				subs[next] = Substr(str, i, lenbtw)
				next++
			}
		}
	}
	return subs
}

//Source: https://gist.github.com/yuchan/2857491
func Substr(s string, pos, length int) string {
	runes := []rune(s)
	l := pos + length
	if l > len(runes) {
		l = len(runes)
	}
	return string(runes[pos:l])
}

func RuneSlices(r []rune, minLen int) [][]rune {
	totLen := len(r)
	var subsCount, length int

	if minLen <= 1 {
		minLen = 1
		length = totLen
		subsCount = factorial(length)
	} else {
		length = totLen - minLen + 1
		subsCount = factorial(length)
	}

	subs := make([][]rune, subsCount)

	next := 0
	for i := 0; i < length; i++ {
		for j := i; j < totLen; j++ {
			if j-i+1 >= minLen {
				subs[next] = r[i : j+1]
				next++
			}
		}
	}
	return subs
}

// SortString
// Source: http://stackoverflow.com/a/22698017/2078664

type sortRunes []rune

func (s sortRunes) Less(i, j int) bool {
	return s[i] < s[j]
}

// Swap the runes at indexes i and j
func (s sortRunes) Swap(i, j int) {
	s[i], s[j] = s[j], s[i]
}

func (s sortRunes) Len() int {
	return len(s)
}

func SortString(str string) string {
	r := []rune(str)
	sort.Sort(sortRunes(r))
	return string(r)
}

// Cache factorials
var factorials = make(map[int]int)

func factorial(n int) int {
	if fac, ok := factorials[n]; ok {
		return fac
	}

	fac := n
	for m := fac - 1; m > 0; m-- {
		fac += m
	}
	factorials[n] = fac
	return fac
}
