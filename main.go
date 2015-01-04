package main

import (
	"html/template"
	"log"
	"net/http"

	"github.com/GeertJohan/go.rice"
	"github.com/gorilla/mux"
	"gopkg.in/boj/redistore.v1"
)

var (
	HomeTpl = template.Must(template.ParseFiles("client/dist/index.html"))
	store   *redistore.RediStore
)

func main() {
	StoreWords("wordlists/google-10000-english.txt")

	// Connect to session store
	var err error
	store, err = redistore.NewRediStore(10, "tcp", ":6379", "", []byte("ecc914db3ea5566a75ef3e54a07a548a"))
	if err != nil {
		log.Fatal(err)
		return
	}

	defer store.Close()

	// Server setup

	// Setup assets route
	box := rice.MustFindBox("client/dist/assets")
	assetsFileServer := http.StripPrefix("/assets/", http.FileServer(box.HTTPBox()))
	http.Handle("/assets/", assetsFileServer)

	// Routes
	router := mux.NewRouter()
	router.HandleFunc("/combos", combosHandler)
	router.HandleFunc("/users/{id}/level_progress", updateUserLevelProgress).
		Methods("PUT")
	router.HandleFunc("/", homeHandler)

	// Attach middleware
	http.Handle("/", sessionMiddleware(analyticsUUIDMiddleware(router)))

	http.ListenAndServe(":8000", nil)
}

func homeHandler(w http.ResponseWriter, req *http.Request) {
	if err := HomeTpl.Execute(w, nil); err != nil {
		log.Fatal(err)
		return
	}
}
