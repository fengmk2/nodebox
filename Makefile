TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
PROJECT_DIR = $(shell pwd)
APPNAME = nodebox

test:
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

cov:
	@rm -rf ../$(APPNAME)-cov
	@jscoverage --encoding=utf-8 --exclude=node_modules --exclude=test \
		./ ../$(APPNAME)-cov
	@cp -rf ./node_modules ./test ../$(APPNAME)-cov

test-cov: cov
	@$(MAKE) -C $(PROJECT_DIR)/../$(APPNAME)-cov test REPORTER=dot
	@$(MAKE) -C $(PROJECT_DIR)/../$(APPNAME)-cov test REPORTER=html-cov > $(PROJECT_DIR)/coverage.html

.PHONY: test-cov test cov
