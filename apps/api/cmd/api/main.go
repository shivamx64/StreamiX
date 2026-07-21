package main

import (
	"log"

	"/streamix/apps/api/internal/bootstrap"
)

func main() {
	app, err := bootstrap.NewApplication()
	if err != nil {
		log.Fatal(err)
	}

	app.Run()
}