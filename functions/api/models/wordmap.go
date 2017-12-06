package models

import wordpatterns "github.com/mrap/wordpatterns"

func DefaultWordmapOptions() wordpatterns.WordmapOptions {
	return wordpatterns.WordmapOptions{
		IgnoreOrder:  true,
		MinSubstrLen: MinMinComboLen,
	}
}

func NewDefaultWordmap() *wordpatterns.Wordmap {
	opts := DefaultWordmapOptions()
	return wordpatterns.NewWordmap(&opts)
}
