package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"

	"github.com/apex/go-apex"
	"github.com/gin-gonic/gin"
)

var router *gin.Engine

func init() {
	router = router.NewRouter()
}

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		req, err := ParseRequest(event)
		if err != nil {
			return FormatError(http.StatusBadRequest, err), nil
		}

		res := httptest.NewRecorder()
		router.ServeHTTP(res, req)

		return FormatResponse(res), nil
	})
}

type LambdaInput struct {
	Body   string `json:"body"`
	Path   string `json:"path"`
	Method string `json:"httpMethod"`
}

type LambdaOutput struct {
	StatusCode int    `json:"statusCode"`
	Body       string `json:"body"`
}

func ParseRequest(event json.RawMessage) (*http.Request, error) {
	var input LambdaInput

	if err := json.Unmarshal(event, &input); err != nil {
		return nil, err
	}

	return http.NewRequest(input.Method, input.Path, bytes.NewBufferString(input.Body))
}

func FormatResponse(res *httptest.ResponseRecorder) *LambdaOutput {
	output := &LambdaOutput{
		StatusCode: res.Code,
		Body:       res.Body.String(),
	}
	return output
}

func FormatError(status int, err error) *LambdaOutput {
	errData, _ := json.Marshal(err)
	output := &LambdaOutput{
		StatusCode: status,
		Body:       string(errData),
	}
	return output
}
