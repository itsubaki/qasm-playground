SHELL := /bin/bash

run:
	pnpm dev

install:
	npm install -g pnpm
	pnpm install

test:
	pnpm run test
