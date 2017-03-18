package main

import "github.com/mrap/combo/functions/simple/router"

func main() {
	r := router.NewRouter()
	r.Run(":9000")
}
