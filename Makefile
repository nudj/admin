APP:=admin
IMAGE:=nudj/$(APP)
IMAGEDEV:=nudj/$(APP)-dev
CWD=$(shell pwd)
COREAPPS:=server api redis db
DOCKERCOMPOSE:=docker-compose -f $(CWD)/../server/local/docker-compose-dev.yml -f $(CWD)/core-override.yml

.PHONY: build buildLocal coreUp coreDown coreLogs up ssh down test

build:
	@./build.sh $(IMAGEDEV)

buildLocal:
	@docker build \
		-t $(IMAGE):local \
		--build-arg NODE_ENV=production \
		--build-arg NPM_TOKEN=${NPM_TOKEN} \
		-f $(CWD)/Dockerfile \
		.

coreUp:
	@$(DOCKERCOMPOSE) up -d --force-recreate --no-deps $(COREAPPS)

coreDown:
	@$(DOCKERCOMPOSE) rm -f -s $(COREAPPS)

coreLogs:
	@$(DOCKERCOMPOSE) logs -f

up:
	@$(DOCKERCOMPOSE) up -d --force-recreate --no-deps $(APP)

ssh:
	@$(DOCKERCOMPOSE) exec $(APP) /bin/zsh

down:
	@$(DOCKERCOMPOSE) rm -f -s $(APP)

test:
	-@docker rm -f $(APP)-test 2> /dev/null || true
	@docker run --rm -it \
		--name $(APP)-test \
		-v $(CWD)/src/app:/usr/src/app \
		-v $(CWD)/src/test:/usr/src/test \
		-v $(CWD)/src/.flowconfig:/usr/src/.flowconfig \
		-v $(CWD)/src/.babelrc:/usr/src/.babelrc \
		-v $(CWD)/src/flow-typed:/usr/src/flow-typed \
		-v $(CWD)/src/package.json:/usr/src/package.json \
		$(IMAGEDEV) \
		/bin/sh -c './node_modules/.bin/standard --parser babel-eslint --plugin flowtype \
		  && ./node_modules/.bin/flow --quiet \
		  && ./node_modules/.bin/mocha --compilers js:babel-core/register --recursive test'
