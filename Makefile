IMAGE:=nudj/admin
IMAGEDEV:=nudj/admin-dev
CWD=$(shell pwd)

.PHONY: build ssh test

build:
	@docker build \
		-t $(IMAGEDEV) \
		--build-arg NPM_TOKEN=${NPM_TOKEN} \
		-f $(CWD)/Dockerfile.dev \
		.

buildLocal:
	@docker build \
		-t $(IMAGE):local \
		--build-arg NPM_TOKEN=${NPM_TOKEN} \
		-f $(CWD)/Dockerfile \
		.

ssh:
	-@docker rm -f admin-dev 2> /dev/null || true
	@docker run --rm -it \
		--add-host api:127.0.0.1 \
		--env-file $(CWD)/.env \
		--name admin-dev \
		-e NPM_TOKEN=${NPM_TOKEN} \
		-p 0.0.0.0:70:80 \
		-p 0.0.0.0:71:81 \
		-v $(CWD)/.zshrc:/root/.zshrc \
		-v $(CWD)/src/app:/usr/src/app \
		-v $(CWD)/src/mocks:/usr/src/mocks \
		-v $(CWD)/src/test:/usr/src/test \
		-v $(CWD)/src/.npmrc:/usr/src/.npmrc \
		-v $(CWD)/src/nodemon.json:/usr/src/nodemon.json \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		-v $(CWD)/src/webpack.config.js:/usr/src/webpack.config.js \
		-v $(CWD)/src/webpack.dll.js:/usr/src/webpack.dll.js \
		$(IMAGEDEV) \
		/bin/zsh

inject:
	-@docker rm -f admin-dev 2> /dev/null || true
	@docker run --rm -it \
		--add-host api:127.0.0.1 \
		--env-file $(CWD)/.env \
		--name admin-dev \
		-e NPM_TOKEN=${NPM_TOKEN} \
		-p 0.0.0.0:70:80 \
		-p 0.0.0.0:71:81 \
		-v $(CWD)/.zshrc:/root/.zshrc \
		-v $(CWD)/src/app:/usr/src/app \
		-v $(CWD)/src/mocks:/usr/src/mocks \
		-v $(CWD)/src/test:/usr/src/test \
		-v $(CWD)/src/.npmrc:/usr/src/.npmrc \
		-v $(CWD)/src/nodemon.json:/usr/src/nodemon.json \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		-v $(CWD)/src/webpack.config.js:/usr/src/webpack.config.js \
		-v $(CWD)/src/webpack.dll.js:/usr/src/webpack.dll.js \
		-v $(HOME)/dev/nudj/library/src:/usr/src/apprary \
		$(IMAGEDEV) \
		/bin/zsh

test:
	-@docker rm -f admin-test 2> /dev/null || true
	@docker run --rm -it \
		--name admin-test \
		-v $(CWD)/src/app:/usr/src/app \
		-v $(CWD)/src/mocks:/usr/src/mocks \
		-v $(CWD)/src/test:/usr/src/test \
		$(IMAGEDEV) \
		/bin/sh -c './node_modules/.bin/standard && ./node_modules/.bin/mocha --recursive test'
