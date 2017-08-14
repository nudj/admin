IMAGE:=nudj/admin
IMAGEDEV:=nudj/admin-dev

CWD=$(shell pwd)
BIN:=./node_modules/.bin

.PHONY: build dev pack test tdd dll stats cache

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
		.

cache:
	-@docker rm -f admin-dev-cache 2> /dev/null || true
	@docker run --rm -it \
		--name admin-dev-cache \
		-v $(CWD)/.cache:/usr/src/.cache \
		$(IMAGEDEV) \
		/bin/sh -c 'rm -rf .cache/* && cp -R /tmp/node_modules/. .cache/'

run:
	-@docker rm -f admin-dev-container 2> /dev/null || true
	@echo 'App=http://localhost:70/, Api=http://localhost:71/'
	@docker run --rm -it \
		--name admin-dev-container \
		-p 0.0.0.0:70:80 \
		-p 0.0.0.0:71:81 \
		--add-host api:127.0.0.1 \
		--env-file $(CWD)/.env \
		$(IMAGE):local

dev:
	-@docker rm -f admin-dev-container 2> /dev/null || true
	@echo 'App=http://localhost:70/, Api=http://localhost:71/'
	@docker run --rm -it \
		--name admin-dev-container \
		-p 0.0.0.0:70:80 \
		-p 0.0.0.0:71:81 \
		--add-host api:127.0.0.1 \
		-v $(CWD)/src/lib:/usr/src/lib \
		-v $(CWD)/src/mocks:/usr/src/mocks \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		-v $(CWD)/src/webpack.config.js:/usr/src/webpack.config.js \
		--env-file $(CWD)/.env \
		$(IMAGEDEV) \
		/bin/sh -c './node_modules/.bin/webpack --config ./webpack.dll.js --bail --hide-modules && $(BIN)/nodemon \
			--config ./nodemon.json \
			-e js,html,css \
			--quiet \
			--watch ./ \
			--delay 250ms \
			-x "printf \"\n\nBuilding...\n\" && ./node_modules/.bin/webpack --config ./webpack.config.js --bail --hide-modules && torus run -o nudj -p admin -e local -- node ."'

stats:
	-@docker rm -f stats-container 2> /dev/null || true
	@docker run --rm -it \
		--name stats-container \
		-v $(CWD)/src/lib:/usr/src/lib \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		-v $(CWD)/src/webpack.config.js:/usr/src/webpack.config.js \
		-v $(CWD)/src/stats.json:/usr/src/stats.json \
		$(IMAGEDEV) \
		/bin/sh -c './node_modules/.bin/webpack --config ./webpack.config.js --profile --json > stats.json'

dll:
	-@docker rm -f dll-container 2> /dev/null || true
	@docker run --rm -it \
		--name dll-container \
		-v $(CWD)/src/lib:/usr/src/lib \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		-v $(CWD)/src/webpack.dll.js:/usr/src/webpack.dll.js \
		$(IMAGEDEV) \
		/bin/sh -c './node_modules/.bin/webpack --config ./webpack.dll.js --bail --hide-modules'

pack:
	@docker exec -i admin-dev-container \
		$(BIN)/webpack --config ./webpack.config.js --bail --hide-modules

test:
	-@docker rm -f test-container 2> /dev/null || true
	@docker run --rm -it \
		--name test-container \
		-v $(CWD)/src/lib:/usr/src/lib \
		-v $(CWD)/src/test:/usr/src/test \
		-v $(CWD)/src/mocks:/usr/src/mocks \
		$(IMAGEDEV)

tdd:
	-@docker rm -f test-container 2> /dev/null || true
	@docker run --rm -it \
		--name test-container \
		-v $(CWD)/src/lib:/usr/src/lib \
		-v $(CWD)/src/test:/usr/src/test \
		$(IMAGEDEV) \
		/bin/sh -c '$(BIN)/nodemon \
			--quiet \
			--watch ./ \
			--delay 250ms \
			-x "$(BIN)/mocha test/*.js || exit 1"'
