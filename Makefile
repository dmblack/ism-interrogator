# Development Dependencies
CAT=$(shell which cat)
ECHO=$(shell which echo)
GIT=$(shell which git)
JQ=$(shell which jq)
NODE=$(shell which node)
NPM=$(shell which npm)
PRINTF=$(shell which printf)
PYTHON3=$(shell which python3)
READ=$(shell which read)
RM=$(shell which rm)
SH=$(shell which sh)

# VARIABLES
COVERAGE?=true
CURRENT_VERSION:=$(shell $(JQ) ".version" package.json)
PROPOSED_VERSION:=$(shell $(CAT) .version)
GIT_STATUS:=$(shell $(GIT) status -s)
GIT_LOG:=$(shell $(GIT) log -1 --format=%ad)
REMOTE="git@github.com:dmblack/ism-interrogator"

help: .usage
usage: .usage

.usage:
	@$(ECHO) "[INFO: Usage]"
	@$(ECHO) "  List of commands:"
	@$(ECHO) "    make help                 - display this detail."
	@$(ECHO)
	@$(ECHO) "  Development:"
	@$(ECHO) "    make info                 - display lifecycle and tooling information."
	@$(ECHO) "    make install-development  - install all development runtime."
	@$(ECHO) "    make install-production   - install all production runtime."
	@$(ECHO) "    make developer-experience - start the, run serve with watch."
	@$(ECHO) "    make test"
	@$(ECHO) "      test-single-run"
	@$(ECHO) "      tests"
	@$(ECHO) "      tests-single-run        - run tests - once."
	@$(ECHO) "    make test-coverage"
	@$(ECHO) "      tests-coverage          - run tests - and get coverage."
	@$(ECHO) "    make test-watch"
	@$(ECHO) "      tests-watch             - run tests - and watch for changes."
	@$(ECHO) "  Build/Deploy:"
	@$(ECHO) "    make build                - build project artifacts."
	@$(ECHO) "    make deploy               - build and deploy to github pages."
	@$(ECHO)

info: .info-development-dependencies .info-scm-status
.info-development-dependencies:
	@$(ECHO) "[INFO: Development Dependencies]"	
	@$(ECHO) "  jq version  : `$(JQ) --version` '($(JQ))'"
	@$(ECHO) "  git version : `$(GIT) --version` '($(GIT))'"
	@$(ECHO) "  node version: `$(NODE) --version` '($(NODE))'"
	@$(ECHO) "  npm version : `$(NPM) --version` '($(NPM))'"
	@$(ECHO)

.info-scm-status:
	@$(ECHO) "[INFO: SCM Status]"
	@$(ECHO) "  Project version : $(CURRENT_VERSION)"
	@$(ECHO) "  Last Commit Date: '$(GIT_LOG)'"
	@$(ECHO) "  Untracked Files : '$(GIT_STATUS)'"
	@$(ECHO) 

install: .install-information
.install-information:
	@$(ECHO) "[INFO: Install]"
	@$(ECHO) "  'install' is not a valid target."
	@$(ECHO) "  'install-development' - for developers and development lifecycle"
	@$(ECHO) "  'install-runtime' - for the run and production lifecycle"

install-development: .install-development-dependencies
.install-development-dependencies:
	@$(ECHO) "[INFO: install-development]"
	@$(NPM) install

install-production: .install-production-dependencies
.install-production-dependencies:
	@$(ECHO) "[INFO: install-production]"
	@$(ECHO) "  This project has no runtime requirements."
	@$(ECHO) "  This project runtime is static html."

# Rules for development
developer-experience: .developer-continuous-development
.developer-continuous-development:
	@$(ECHO) "[INFO: developer-experience]"
	@$(NPM) run start

test: test-single-run
test-single-run: tests-single-run
tests: test-single-run
tests-single-run:
	@$(ECHO) "[INFO: test-single-run]"
	@$(NPM) run test -- --watchAll=false

test-watch: tests-watch
tests-watch:
	@$(ECHO) "[INFO: test-watch]"
	@$(NPM) run test

# Additional -- to ensure all arguments are parsed.
test-coverage: tests-coverage
tests-coverage:
	@$(ECHO) "[INFO: test-coverage]"
	@$(NPM) run test -- --coverage --watchAll=false

.version:
	@$(ECHO) "[INFO: version]"
	@$(ECHO) "  Current Version: $(CURRENT_VERSION)"
	@$(ECHO) "  Please supply a new version number (major.minor.revision): "
  # Apparently @$(READ) does not work.
  # This will ask for user input, new version, then
  #   Check for any conflicts with git tags, then
  #   Update the package.json version
  # By starting with @ on this line, and \ for each following, we avoid
  #		unnecessary verbosity.
	@read NEW_VERSION; \
	if [ -z "$(GIT) tag -l | grep v$$NEW_VERSION" ]; then \
    $(ECHO) "Version Conflict! Abort!"; \
    exit 1; \
    else \
    $(ECHO) $$NEW_VERSION > .version; \
    fi

# # Generates the .version information.
# .version:
# 	@$(ECHO) "[INFO: version]"
#   # Dumps current version into .version.
# 	@$(JQ) '.version' package.json | cut -d\" -f2 > .version
#   # Echo to console
# 	@$(ECHO) "Current version: `$(CAT) .version`"

# Updates the .changelog file, and then the CHANGELOG.md
.changelog: .clean-changelog
	@$(ECHO) "[INFO: changelog]"
  # Note that the $CURRENT_VERSION variable includes quotes.
	if [ $(CURRENT_VERSION) = "$(PROPOSED_VERSION)" ];\
		then $(ECHO) "  Version Conflict! Abort!";\
		$(ECHO) "  It appears you have not incremented your version number.";\
		$(ECHO) "  Consider running make version to do so.";\
		exit 1;\
		fi;
  # Pushing current version, and git log. (Title)
	@$(ECHO) "  Updating CHANGELOG.md $(CURRENT_VERSION) to $(PROPOSED_VERSION)"
	@$(ECHO) "v$(PROPOSED_VERSION) - $(GIT_LOG)" > .changelog
	@$(ECHO) "--------------------------------------" >> .changelog
  # Generate the the git logs to date 
  # We use printf here to generate consistent changelog identifiers.
  # We use awk to pull out the abbreviated commit id, and
  #		We then generate a markdown suitable link for github usage.
  #	  We then insert a ' - ' at the start of each line for a list.
	@$(PRINTF) "`git log --format='%h %s'`" | awk '{printf "["$$1"](../../"$$1")"; $$1=""; print $$0}' | sed -e 's/^/ - /' >> .changelog
  # Cat both out, with the .changelog (latest) at start.
  # Then move into our new CHANGELOG.md
	@$(CAT) .changelog CHANGELOG.md > tmp && mv tmp CHANGELOG.md
	@$(RM) .changelog

.clean-changelog:
	@$(ECHO) "" > .changelog

# Used to call npm build.
build: .pre-build
	@$(ECHO) "[INFO: pre-build]"
	@$(NPM) run build

# Check if any modifications are not tracked by git.
#		Will abort the release process.
.check-working-tree:
	@$(ECHO) "[INFO: check-working-tree]"
	if [ ! -z "$(GIT_STATUS)" ];\
	  then $(ECHO) "Working Tree Conflict (Not Clean)! Abort!";\
		exit 1;\
		fi;

# Generates the .branch information.
.branch:
	@$(ECHO) "[INFO: branch]"
  # Returns the current selected branch.
	@$(GIT) branch | grep '^*' | awk '{ print $$2 }' > .branch
  # Echo to console.
	@$(ECHO) "Current branch: `$(CAT) .branch`"

# Used to commit the release.
.commit:
	@$(ECHO) "[INFO: commit]"
	@$(JQ) ".version = \"$$PROPOSED_VERSION\"" "package.json" > up.json;
	@$(CAT) up.json > "package.json";
	@$(RM) up.json;
	@$(GIT) commit --allow-empty -m "Release v`cat .version`."
	@$(GIT) add .
	@$(GIT) commit --amend -m "`$(GIT) log -1 --format=%s`"

# Used to add the release tag.
.tag:
	@$(ECHO) "[INFO: tag]"
	@$(GIT) tag "v`cat .version`"

# Used to release a version.
.release: .version .commit .tag
	@$(ECHO) "[INFO: release-version]"
	@$(GIT) push $(REMOTE) "`cat .branch`" "v`cat .version`"

# .pre-build
#		Install dependencies,
#		run tests - single.
#		clean
.pre-build: install-dependencies tests-single-run clean

# pre-release
#		run tests - single.
#		clean
#		.branch - 
.pre-release: tests-single-run clean .branch .version .changelog

release: .check-working-tree .pre-release .release .post-release

# Rules for clean up
.post-release: clean

.clean-all:
	@$(RM) -rf .version .branch build/*

.clean-build:
	@$(RM) -rf build/*

clean: .clean-all
