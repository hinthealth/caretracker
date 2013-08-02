REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
    --reporter $(REPORTER) \
		--require should \
    --recursive \

test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha \
    --reporter $(REPORTER) \
		--require should \
		--recursive \
    --watch

.PHONY: test test-w
