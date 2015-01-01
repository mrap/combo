package main

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Ranker", func() {

	const testFilename = "test/ranking_test_words.txt"

	Describe("Ranking trie", func() {
		var (
			_ranks Ranks
			_trie  *Node
		)

		BeforeEach(func() {
			_trie = CreateTrie(testFilename)
			_ranks = RankByOccurences(_trie)
		})

		It("should pair strings with number of occurences", func() {
			Ω(_ranks["th"]).Should(Equal(3))
			Ω(_ranks["he"]).Should(Equal(3))
			Ω(_ranks["the"]).Should(Equal(2))
		})
	})

	Describe("Ranking a wordmap", func() {
		var (
			_ranked []string
			_wm     Wordmap
		)

		BeforeEach(func() {
			_wm = CreateWordmap(testFilename)
			_ranked = _wm.Ranked()
		})

		It("should rank", func() {
			Ω(_ranked[0]).Should(Equal("he"))
			Ω(_ranked[1]).Should(Equal("th"))
			Ω(_ranked[2]).Should(Equal("the"))
		})
	})
})
