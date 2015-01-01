package main

import (
	"flag"
	"fmt"
	"log"
)

var (
	rank      = flag.Bool("rank", false, "Display ranked substrings after digesting words from file.")
	ranklimit = flag.Int("ranklimit", 0, "Max substrings to print when using -rank. If none, prints all.")
	filename  = flag.String("filename", "", "Filename of word list.")
)

func main() {
	flag.Parse()

	if *filename == "" {
		log.Fatal("Requires -filename")
		return
	}

	fmt.Printf("Digesting words from %s...\n", *filename)
	t := CreateWordmap(*filename)
	fmt.Printf("Found and indexed %d sub-words (substrings).\n", len(t))

	if *rank {
		fmt.Println("Ranking words... This could take a while depending on the word list size.")
		t.PrintRanks(*ranklimit)
	} else {
		var (
			query   string
			results []string
		)

		for true {
			fmt.Print("\nEnter a string to search for: ")
			fmt.Scanf("%s", &query)
			results = t.WordsContaining(query)
			fmt.Printf("===== %d Words Containing '%s' =====\n\n", len(results), query)
			fmt.Println(results)
		}
	}

}
