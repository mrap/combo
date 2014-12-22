package main

import (
	"html/template"
	"log"
	"net/http"

	"github.com/GeertJohan/go.rice"
)

var (
	HomeTpl = template.Must(template.ParseFiles("client/dist/index.html"))
)

func main() {
	box := rice.MustFindBox("client/dist/assets")
	assetsFileServer := http.StripPrefix("/assets/", http.FileServer(box.HTTPBox()))
	http.Handle("/assets/", assetsFileServer)
	http.HandleFunc("/", homeHandler)
	http.ListenAndServe(":8000", nil)
}

func homeHandler(w http.ResponseWriter, req *http.Request) {
	if err := HomeTpl.Execute(w, nil); err != nil {
		log.Fatal(err)
		return
	}
}
