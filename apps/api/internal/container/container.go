package container

import (
	"github.com/gin-gonic/gin"

	"streamix/apps/api/internal/routes"
)

type Container struct {
}

func New() *Container {
	return &Container{}
}

func (c *Container) RegisterRoutes(router *gin.Engine) {
	routes.Register(router)
}