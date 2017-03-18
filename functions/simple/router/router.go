package router

import (
	"net/http"

	"github.com/gin-gonic/gin"
	eztemplate "github.com/michelloworld/ez-gin-template"
)

func NewRouter() *gin.Engine {
	router := gin.New()

	render := eztemplate.New()
	render.TemplatesDir = "../templates/"
	render.Ext = ".tmpl"
	router.HTMLRender = render.Init()

	router.GET("/", getIndex)
	router.Static("/public", "../../../client/dist/assets")
	return router
}

func getIndex(c *gin.Context) {
	c.HTML(http.StatusOK, "app/index", gin.H{
		"title": "Home",
	})
}
