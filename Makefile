TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
PROJECT_DIR = $(shell pwd)
JSCOVERAGE = ./node_modules/jscover/bin/jscover

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

cov:
	@rm -rf .cov
	@$(JSCOVERAGE) --exclude=test \
		./ .cov
	@cp -rf node_modules test .cov

test-cov: cov
	@$(MAKE) -C .cov test REPORTER=dot
	@$(MAKE) -C .cov test REPORTER=html-cov > coverage.html

.PHONY: test-cov test cov
