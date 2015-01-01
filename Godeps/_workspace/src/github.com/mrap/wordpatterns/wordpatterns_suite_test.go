package main

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"testing"
)

func TestWordpatterns(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Wordpatterns Suite")
}
