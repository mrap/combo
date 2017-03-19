package main

import "github.com/mrap/combo/functions/api/router"

func main() {
	r := router.NewRouter()
	r.Run(":9000")
}
