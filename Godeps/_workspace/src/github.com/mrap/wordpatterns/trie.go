package main

import (
	"bufio"
	"log"
	"os"

	"github.com/mrap/stringutil"
)

type Node struct {
	Children map[rune]*Node
	Str      string
	Words    map[string]struct{}
}

func (n *Node) Count() int {
	var count int = 1
	for _, c := range n.Children {
		count += c.Count()
	}
	return count
}

func (n *Node) Child(c rune) *Node {
	var _child *Node
	_child, ok := n.Children[c]
	if !ok {
		_child = NewNode()
		n.Children[c] = _child
	}
	return _child
}

func (n *Node) addWord(orig string, substr string, curr int) {
	n.Words[orig] = struct{}{}
	n.Str = substr[:curr+1]

	curr++
	if curr < len(substr) {
		n.Child(rune(substr[curr])).addWord(orig, substr, curr)
	}
}

func (n *Node) ChildAt(path string) *Node {
	var (
		_char rune
		_len  = len(path)
		_node = n
	)

	for i := 0; i < _len; i++ {
		_char = rune(path[i])
		_node = _node.Child(_char)
	}
	return _node
}

func (n *Node) AddWord(word string) {
	substrs := stringutil.Substrs(word, 2)
	var (
		_curr string
		_char rune
	)
	for i := 0; i < len(substrs); i++ {
		_curr = substrs[i]
		_char = rune(_curr[0])

		n.Child(_char).addWord(word, _curr, 0)
	}
}

func (n *Node) WordsContaining(substr string) []string {
	m := n.ChildAt(substr).Words
	words := make([]string, len(m))
	i := 0
	for w := range m {
		words[i] = w
		i++
	}
	return words
}

func CreateTrie(filename string) *Node {
	top := NewNode()

	file, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var word string
	for scanner.Scan() {
		word = scanner.Text()
		top.AddWord(word)
	}
	if err = scanner.Err(); err != nil {
		log.Fatal(err)
	}

	return top
}

func NewNode() *Node {
	return &Node{
		Children: make(map[rune]*Node),
		Words:    make(map[string]struct{}),
	}
}
