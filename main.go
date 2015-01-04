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
	box := rice.MustFindBox("client/dist/assets")
	assetsFileServer := http.StripPrefix("/assets/", http.FileServer(box.HTTPBox()))

	// Routes
	router := mux.NewRouter()
	router.Handle("/assets/", assetsFileServer)
	router.HandleFunc("/combos", combosHandler)
	router.HandleFunc("/", homeHandler)
	http.Handle("/", router)

	http.ListenAndServe(":8000", nil)
}

func homeHandler(w http.ResponseWriter, req *http.Request) {
	session, err := store.Get(req, "session-key")
	if err != nil {
		log.Println(err.Error())
	}

	if err = session.Save(req, w); err != nil {
		log.Println("Error saving session", err.Error())
	}

	if err := HomeTpl.Execute(w, nil); err != nil {
		log.Fatal(err)
		return
	}
}
