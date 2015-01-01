package stringutil

import (
	"testing"
)

func TestSubstrs(t *testing.T) {
	str := "may"
	expected := []string{"m", "ma", "may", "a", "ay", "y"}
	actual := Substrs(str, 0)
	if !sameStrings(expected, actual) {
		t.Errorf("Should have same strings", expected, actual)
	}
}

func TestSubstrsUnicode(t *testing.T) {
	str := "≈ay"
	actual := Substrs(str, 0)
	expected := []string{"≈", "≈a", "≈ay", "a", "ay", "y"}
	if !sameStrings(expected, actual) {
		t.Errorf("Should have same strings", expected, actual)
	}
}

func TestSubstrsLimited(t *testing.T) {
	str := "may"
	expected := []string{"ma", "may", "ay"}
	actual := Substrs(str, 2)
	if !sameStrings(expected, actual) {
		t.Errorf("Should have same strings", expected, actual)
	}
}

func TestRuneSlices(t *testing.T) {
	r := []rune("may")
	actual := RuneSlices(r, 2)
	expected := [][]rune{
		[]rune("ma"),
		[]rune("may"),
		[]rune("ay"),
	}
	if !sameRunes(expected, actual) {
		t.Errorf("Should have same rune slices", expected, actual)
	}
}

func TestSortString(t *testing.T) {
	str := "hello"
	actual := SortString(str)
	expected := "ehllo"
	if actual != expected {
		t.Error("Should have returned a sorted string", expected, actual)
	}
}

func sameStrings(a []string, b []string) bool {
	if len(a) != len(b) {
		return false
	}

	m := make(map[string]bool)
	for i, _a := range a {
		m[_a] = true
		_b := b[i]
		m[_b] = true
	}
	if len(m) != len(a) {
		return false
	}

	return true
}

func sameRunes(a [][]rune, b [][]rune) bool {
	if len(a) != len(b) {
		return false
	}

	m := make(map[string]bool)
	for i, _a := range a {
		_aS := string(_a)
		m[_aS] = true

		_b := b[i]
		_bS := string(_b)
		m[_bS] = true
	}
	if len(m) != len(a) {
		return false
	}

	return true
}
