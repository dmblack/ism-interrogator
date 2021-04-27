# Development Dependencies
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

# VARIABLES
COVERAGE?=true
CURRENT_VERSION:=$(shell $(JQ) ".version" package.json)
GIT_STATUS:=$(shell $(GIT) status -s)
GIT_LOG:=$(shell $(GIT) log -1 --format=%ad)
REMOTE="git@github.com:dmblack/ism-interrogator"

help: .usage
usage: .usage

.usage:
	@$(ECHO) " Current version: $(CURRENT_VERSION)"
	@$(ECHO)
	@$(ECHO) "  List of commands:"
	@$(ECHO)
	@$(ECHO) "Development:"
	@$(ECHO) "  make help                    - display this detail."
	@$(ECHO) "  make info                    - display lifecycle tooling information."
	@$(ECHO) "  make install"
	@$(ECHO) "       install-dependencies    - install all dependencies."
	@$(ECHO) "  make developer-experience    - start the, run serve with watch."
	@$(ECHO) "  make test"
	@$(ECHO) "       test-single-run"
	@$(ECHO) "       tests"
	@$(ECHO) "       tests-single-run        - run tests - once."
	@$(ECHO) "  make test-coverage"
	@$(ECHO) "       tests-coverage          - run tests - and get coverage."
	@$(ECHO) "  make test-watch"
	@$(ECHO) "       tests-watch             - run tests - and watch for changes."
	@$(ECHO) "Build/Deploy:"
	@$(ECHO) "  make build                   - build project artifacts."
	@$(ECHO) "  make deploy                  - build and deploy to github pages."
	@$(ECHO)

info: .info-development-dependencies .info-scm-status
.info-development-dependencies:
	@$(ECHO) "[Development Dependencies]"	
	@$(ECHO) jq version: `$(JQ) --version` "($(JQ))"
	@$(ECHO) git version: `$(GIT) --version` "($(GIT))"
	@$(ECHO) node version: `$(NODE) --version` "($(NODE))"
	@$(ECHO) npm version: `$(NPM) --version` "($(NPM))"
	@$(ECHO)

.info-scm-status:
	@$(ECHO) "[SCM Status]"
	@$(ECHO) Last Commit Date: "$(GIT_LOG)"
	@$(ECHO) Untracked Files: "$(GIT_STATUS)"
	@$(ECHO) 

install: install-dependencies
install-dependencies:
	@$(NPM) install

# Rules for development
developer-experience: serve
serve:
	@$(NPM) run start

test: test-single-run
test-single-run: tests-single-run
tests: test-single-run
tests-single-run:
	@$(NPM) run test -- --watchAll=false

test-watch: tests-watch
tests-watch:
	@$(NPM) run test

# Additional -- to ensure all arguments are parsed.
test-coverage: tests-coverage
tests-coverage:
	@$(NPM) run test -- --coverage --watchAll=false

version:
	@$(ECHO) "New version:"
  # Apparently @$(READ) does not work.
  # This will ask for user input, new version, then
  #   Check for any conflicts with git tags, then
  #   Update the package.json version
	@read NEW_VERSION;\
    if [ -z "$(GIT) tag -l | grep v$$NEW_VERSION" ];\
    then $(ECHO) "Version Conflict! Abort!";\
    exit 1;\
    else $(JQ) ".version = \"$$NEW_VERSION\"" "package.json" > up.json;\
    $(CAT) up.json > "package.json";\
    $(RM) up.json;\
    fi; 

# Generates the .version information.
.version:
	@$(ECHO) "[Updating ism-interrogator version]"
  # Dumps current version into .version.
	@$(JQ) '.version' package.json | cut -d\" -f2 > .version
  # Echo to console
	@$(ECHO) "Current version: `$(CAT) .version`"

# Generates the .branch information.
.branch:
	@$(ECHO) "[Release from branch]"
  # Returns the current selected branch.
	@$(GIT) branch | grep '^*' | awk '{ print $$2 }' > .branch
  # Echo to console.
	@$(ECHO) "Current branch: `$(CAT) .branch`"

# Updates the .changelog file
.changelog:
  # Add a new .
	@$(ECHO) "[Updating CHANGELOG.md $(CURRENT_VERSION) > `cat .version`]"
  # Echo to console.
	@$(GIT) log -1 --format=%ad
  # Echo to console.
	@$(PYTHON) ./scripts/changelog.py v$(CURRENT_VERSION) v`cat .version` > .changelog_update
  # Echo to console.
	@$(CAT) .changelog_update CHANGELOG.md > tmp && mv tmp CHANGELOG.md

# Used to call npm build.
build: pre-build
	@$(NPM) run build

# Check if any modifications are not tracked by git.
#		Will abort the release process.
.release-check-working-tree:
	if [ ! -z "$(GIT_STATUS)" ];\
	  then $(ECHO) "Working Tree Conflict (Not Clean)! Abort!";\
		exit 1;\
		fi;

# Used to commit the release.
.release-commit:
	@$(GIT) commit --allow-empty -m "Release v`cat .version`."
	@$(GIT) add .
	@$(GIT) commit --amend -m "`$(GIT) log -1 --format=%s`"

# Used to add the release tag.
.release-tag:
	@$(GIT) tag "v`cat .version`"

# Used to publish a built artefact.
publish-version: release-commit release-tag
	@$(ECHO) "[Publishing]"
	@$(GIT) push $(REMOTE) "`cat .branch`" "v`cat .version`"
	@$(NPM) publish

# pre-build
#		Install dependencies,
#		run tests - single.
#		clean
pre-build: install-dependencies tests-single-run clean

# pre-release
#		Install dependencies
#		run tests - single.
#		clean
#		.branch - 
pre-release: install-dependencies tests-single-run clean .branch .version changelog

release: check-working-tree pre-publish pre-build publish-version publish-finished

# Rules for clean up
publish-finished: clean

clean-all:
	@$(RM) -rf .version .branch build/*

clean-build:
	@$(RM) -rf build/*

clean: clean-all
