package main

import (
	"log"

	"github.com/shivamx64/streamix/apps/api/internal/bootstrap"
)

func main() {
	app, err := bootstrap.New()
	if err != nil {
		log.Fatal(err)
	}

	if err := app.Router.Run(app.Container.Config.HTTP.Address()); err != nil {
		log.Fatal(err)
	}
}
