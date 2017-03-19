package router

import (
	"net/http"
	"strconv"

	"github.com/mrap/combo/functions/api/models"

	"github.com/gin-gonic/gin"
	eztemplate "github.com/michelloworld/ez-gin-template"
)

func NewRouter() *gin.Engine {
	router := gin.New()

	render := eztemplate.New()
	render.TemplatesDir = "templates/"
	render.Ext = ".tmpl"
	router.HTMLRender = render.Init()
	router.Static("/public", "build/client/assets")

	router.GET("/", getIndex)
	router.GET("/combos", getCombos)
	return router
}

func getIndex(c *gin.Context) {
	c.HTML(http.StatusOK, "app/index", gin.H{
		"title": "Home",
	})
}

type CombosRes struct {
	Combos []string `json:"combos"`
}

func getCombos(c *gin.Context) {
	// TODO: handle bad params
	chars := c.Query("chars")
	count, _ := strconv.Atoi(c.Query("count"))
	minLen, _ := strconv.Atoi(c.Query("min_len"))
	maxLen, _ := strconv.Atoi(c.Query("max_len"))

	comboList := models.GenerateCombos(chars, count, minLen, maxLen)
	c.JSON(http.StatusOK, CombosRes{comboList})
}
