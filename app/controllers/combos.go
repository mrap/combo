package controllers

import (
	"combo/app/models"

	"github.com/revel/revel"
)

type Combos struct {
	*revel.Controller
}

type CombosRes struct {
	Combos []string `json:"combos"`
}

func (c Combos) Index(chars string, count, min_len, max_len int) revel.Result {
	comboList := models.GenerateCombos(chars, count, min_len, max_len)
	return c.RenderJson(CombosRes{comboList})
}
