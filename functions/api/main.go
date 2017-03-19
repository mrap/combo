package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"

	"github.com/apex/go-apex"
	"github.com/gin-gonic/gin"
	"github.com/mrap/combo/functions/api/router"
)

var r *gin.Engine

func init() {
	r = router.NewRouter()
}

func main() {
	apex.HandleFunc(func(event json.RawMessage, ctx *apex.Context) (interface{}, error) {
		req, err := ParseRequest(event)
		if err != nil {
			return FormatError(http.StatusBadRequest, err), nil
		}

		res := httptest.NewRecorder()
		r.ServeHTTP(res, req)

		return FormatResponse(res), nil
	})
}

type LambdaInput struct {
	Body    string            `json:"body"`
	Path    string            `json:"path"`
	Method  string            `json:"httpMethod"`
	Params  map[string]string `json:"queryStringParameters"`
	Headers map[string]string `json:"headers"`
}

type LambdaOutput struct {
	StatusCode int               `json:"statusCode"`
	Body       string            `json:"body"`
	Headers    map[string]string `json:"headers"`
}

func ParseRequest(event json.RawMessage) (*http.Request, error) {
	var input LambdaInput

	if err := json.Unmarshal(event, &input); err != nil {
		return nil, err
	}

	// gather query parameters and HTTP body
	v := url.Values{}
	for key, value := range input.Params {
		v.Set(key, value)
	}

	req, err := http.NewRequest(input.Method, input.Path+"?"+v.Encode(), bytes.NewBufferString(input.Body))
	if err != nil {
		return nil, err
	}

	// gather HTTP headers
	for key, value := range input.Headers {
		req.Header.Set(key, value)
	}

	return req, nil
}

func FormatResponse(res *httptest.ResponseRecorder) *LambdaOutput {
	output := &LambdaOutput{
		StatusCode: res.Code,
		Body:       res.Body.String(),
		Headers:    map[string]string{},
	}

	for key := range res.HeaderMap {
		output.Headers[key] = res.HeaderMap.Get(key)
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
