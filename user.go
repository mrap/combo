package main

import (
	"encoding/gob"
	"encoding/json"
	"log"
	"net/http"
)

type LevelProgress map[string]int

func init() {
	gob.Register(&LevelProgress{})
}

func updateUserLevelProgress(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)
	var levelProgress LevelProgress
	if err := decoder.Decode(&levelProgress); err != nil {
		log.Println("Error decoding json", err)
	}

	session := GetReqSession(req)
	session.Values["level_progress"] = levelProgress
	if err := session.Save(req, w); err != nil {
		log.Println("Error saving session at key:", "level_progress", err)
	}
}
