#/bin/bash

TESTS = $(shell find test -name "*_spec.js")

test:
	@./node_modules/.bin/mocha $(TESTS)

.PHONY: test
