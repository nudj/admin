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
		-p 0.0.0.0:72:82 \
		-v $(CWD)/.zshrc:/root/.zshrc \
		-v $(CWD)/src/app:/usr/src/app \
		-v $(CWD)/src/test:/usr/src/test \
		-v $(CWD)/src/.npmrc:/usr/src/.npmrc \
		-v $(CWD)/src/nodemon.json:/usr/src/nodemon.json \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		-v $(CWD)/src/.flowconfig:/usr/src/.flowconfig \
		-v $(CWD)/src/flow-typed:/usr/src/flow-typed \
		-v $(CWD)/src/webpack.config.js:/usr/src/webpack.config.js \
		-v $(CWD)/src/webpack.dll.js:/usr/src/webpack.dll.js \
		-v $(CWD)/../framework/src:/usr/src/@nudj/framework \
		-v $(CWD)/../library/src:/usr/src/@nudj/library \
		-v $(CWD)/../components/src:/usr/src/@nudj/components \
		-v $(CWD)/../api/src:/usr/src/@nudj/api \
		$(IMAGEDEV) \
		/bin/zsh

test:
	-@docker rm -f admin-test 2> /dev/null || true
	@docker run --rm -it \
		--name admin-test \
		-v $(CWD)/src/app:/usr/src/app \
		-v $(CWD)/src/test:/usr/src/test \
		-v $(CWD)/src/.flowconfig:/usr/src/.flowconfig \
		-v $(CWD)/src/flow-typed:/usr/src/flow-typed \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		$(IMAGEDEV) \
		/bin/sh -c './node_modules/.bin/standard --parser babel-eslint --plugin flowtype \
		  && ./node_modules/.bin/flow --quiet \
		  && ./node_modules/.bin/mocha --compilers js:babel-core/register --recursive test'
