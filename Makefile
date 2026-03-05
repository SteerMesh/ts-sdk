.PHONY: install build type-check clean

install:
	npm install

build:
	npm run build

type-check:
	npx tsc --noEmit

clean:
	rm -rf dist
