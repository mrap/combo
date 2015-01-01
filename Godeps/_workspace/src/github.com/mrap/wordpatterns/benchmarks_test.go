package main

import "testing"

const (
	list100         = "test/100_test_words.txt"
	list1000        = "test/1000_test_words.txt"
	list10000       = "test/10000_test_words.txt"
	listGoogle10000 = "test/google-10000-english.txt"
)

func buildTrie(filename string, b *testing.B) {
	for i := 0; i < b.N; i++ {
		CreateTrie(filename)
	}
}

func buildWordmap(filename string, b *testing.B) {
	for i := 0; i < b.N; i++ {
		CreateWordmap(filename)
	}
}

func BenchmarkBuildTrie100(b *testing.B)            { buildTrie(list100, b) }
func BenchmarkBuildTrie1000(b *testing.B)           { buildTrie(list1000, b) }
func BenchmarkBuildTrie10000(b *testing.B)          { buildTrie(list10000, b) }
func BenchmarkBuildTrieGoogle10000(b *testing.B)    { buildTrie(listGoogle10000, b) }
func BenchmarkBuildWordmap100(b *testing.B)         { buildWordmap(list100, b) }
func BenchmarkBuildWordmap1000(b *testing.B)        { buildWordmap(list1000, b) }
func BenchmarkBuildWordmap10000(b *testing.B)       { buildWordmap(list10000, b) }
func BenchmarkBuildWordmapGoogle10000(b *testing.B) { buildWordmap(listGoogle10000, b) }

func trieQuery(query string, b *testing.B) {
	trie := CreateTrie(list1000)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		trie.WordsContaining(query)
	}
}

func wordmapQuery(query string, b *testing.B) {
	wm := CreateWordmap(list1000)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		wm.WordsContaining(query)
	}
}

func BenchmarkTrieQueryEr(b *testing.B)    { trieQuery("er", b) }
func BenchmarkWordmapQueryEr(b *testing.B) { wordmapQuery("er", b) }
