CAT=$(shell which cat)
ECHO=$(shell which echo)
GIT=$(shell which git)
JQ=$(shell which jq)
NODE=$(shell which node)
NPM=$(shell which npm)
PYTHON3=$(shell which python3)
READ=$(shell which read)
RM=$(shell which rm)
SH=$(shell which sh)


REMOTE="git@$(GIT)hub.com:dmblack/ism-interrogator"
CURRENT_VERSION:=$(shell jq ".version" package.json)
COVERAGE?=true

help: info
	@$(ECHO)
	@$(ECHO) " Current version: $(CURRENT_VERSION)"
	@$(ECHO)
	@$(ECHO) "  List of commands:"
	@$(ECHO)
	@$(ECHO) "Development:"
	@$(ECHO) "  make help                    - display info and this help detail."
	@$(ECHO) "  make info                    - display node, npm, and jq information."
	@$(ECHO) "  make install-dependencies    - install all dependencies."
	@$(ECHO) "  make development-experience  - start the development-experience."
	@$(ECHO) "  make test"
	@$(ECHO) "       tests"
	@$(ECHO) "       test-single-run"
	@$(ECHO) "       tests-single-run        - run tests (once)."
	@$(ECHO) "  make test-watch"
	@$(ECHO) "       tests-watch             - run tests - and watch for changes."
	@$(ECHO) "  make test-coverage"
	@$(ECHO) "       tests-coverage          - run tests - and get coverage."
	@$(ECHO) "Build/Deploy:"
	@$(ECHO) "  make build                   - build project artifacts."
	@$(ECHO) "  make deploy                  - build and deploy to github pages."

info:
	@$(ECHO) jq version: `$(JQ) --version` "($(JQ))"
	@$(ECHO) git version: `$(GIT) --version` "($(GIT))"
	@$(ECHO) node version: `$(NODE) --version` "($(NODE))"
	@$(ECHO) npm version: `$(NPM) --version` "($(NPM))"

deps: install-dependencies

install-dependencies:
	@$(NPM) install

# Rules for development
serve:
	@$(NPM) run start

test-watch: tests-watch
tests-watch:
	@$(NPM) run test

test: test-single-run
tests: test-single-run
test-single-run: tests-single-run
tests-single-run:
	@$(NPM) run test -- --watchAll=false

# Additional -- to ensure all arguments are parsed.
test-coverage:
	@$(NPM) run test -- --coverage --watchAll=false

version:
	@$(ECHO) "New version:"
  # Apparently @$(READ) does not work.
  # This will ask for user input, new version, then
  #   Check for any conflicts with git tags, then
  #   Update the package.json version
	@read NEW_VERSION; \
    if [ -z "$(GIT) tag -l | grep v$$NEW_VERSION" ];\
    then $(ECHO) "Version Conflict! Abort!";\
    exit 1;\
    else $(JQ) ".version = \"$$NEW_VERSION\"" "package.json" > up.json;\
    $(CAT) up.json > "package.json";\
    $(RM) up.json;\
    fi; 

.version:
	@$(ECHO) "[Updating ism-interrogator version]"
  # Dumps current version into .version.
	@$(JQ) '.version' package.json | cut -d\" -f2 > .version
  # Echo to console
	@$(ECHO) "Current version: `$(CAT) .version`"

.branch:
	@$(ECHO) "[Release from branch]"
  # Returns the current selected branch.
	@$(GIT) branch | grep '^*' | awk '{ print $$2 }' > .branch
  # Echo to console.
	@$(ECHO) "Current branch: `$(CAT) .branch`"

.changelog:
	@$(ECHO) "[Updating CHANGELOG.md $(CURRENT_VERSION) > `cat .version`]"
	@$(GIT) log -1 --format=%ad
	@$(PYTHON) ./scripts/changelog.py v$(CURRENT_VERSION) v`cat .version` > .changelog_update
	@$(CAT) .changelog_update CHANGELOG.md > tmp && mv tmp CHANGELOG.md

build: clean-build pre-build
	@$(NPM) run build

.release-commit:
	@$(GIT) commit --allow-empty -m "Release v`cat .version`."
	@$(GIT) add .
	@$(GIT) commit --amend -m "`$(GIT) log -1 --format=%s`"

.release-tag:
	@$(GIT) tag "v`cat .version`"

publish-version: release-commit release-tag
	@$(ECHO) "[Publishing]"
	@$(GIT) push $(REMOTE) "`cat .branch`" "v`cat .version`"
	@$(NPM) publish

pre-publish: clean .branch .version changelog
pre-build: install-dependencies tests-single-run build

publish: check-working-tree pre-publish pre-build publish-version publish-finished

# Rules for clean up

publish-finished: clean

clean-all:
	@$(RM) -rf .version .branch build/*

clean-build:
	@$(RM) -rf build/*

clean: clean-all
