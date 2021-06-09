#	Development Dependencies
COMMAND_AWK=$(shell which awk)
COMMAND_CAT=$(shell which cat)
COMMAND_ECHO=$(shell which echo)
COMMAND_GIT=$(shell which git)
COMMAND_GREP=$(shell which grep)
COMMAND_JQ=$(shell which jq)
COMMAND_NODE=$(shell which node)
COMMAND_NPM=$(shell which npm)
COMMAND_PRINTF=$(shell which printf)
COMMAND_RM=$(shell which rm)
COMMAND_SED=$(shell which sed)

#	VARIABLES
VARIABLE_COVERAGE?=$(shell $(COMMAND_JQ) --raw-output ".coverage" package.json)
VARIABLE_CURRENT_VERSION:=$(shell $(COMMAND_JQ) --raw-output ".version" package.json)
VARIABLE_GIT_LOG:=$(shell $(COMMAND_GIT) log --max-count=1 --format=%ad)
VARIABLE_GIT_STATUS:=$(shell $(COMMAND_GIT) status --short)
VARIABLE_PROPOSED_VERSION?=$(shell $(COMMAND_CAT) .version)
VARIABLE_REMOTE=$(shell $(COMMAND_JQ) --raw-output ".remote" package.json)

#	Entry, and usage.
help: .usage
usage: .usage

#	Usage Instructions
.usage:
	@$(COMMAND_ECHO) "[INFO: Usage]"
	@$(COMMAND_ECHO) "	List of commands:"
	@$(COMMAND_ECHO) "		make help                 - display this detail."
	@$(COMMAND_ECHO)
	@$(COMMAND_ECHO) "	Development:"
	@$(COMMAND_ECHO) "		make info                 - display lifecycle and tooling information."
	@$(COMMAND_ECHO) "		make install-development  - install all development runtime."
	@$(COMMAND_ECHO) "		make install-production   - install all production runtime."
	@$(COMMAND_ECHO) "		make developer-experience - start the, run serve with watch."
	@$(COMMAND_ECHO) "		make test"
	@$(COMMAND_ECHO) "			test-single-run"
	@$(COMMAND_ECHO) "			tests"
	@$(COMMAND_ECHO) "			tests-single-run        - run tests - once."
	@$(COMMAND_ECHO) "		make test-coverage"
	@$(COMMAND_ECHO) "			tests-coverage          - run tests - and get coverage."
	@$(COMMAND_ECHO) "		make test-watch"
	@$(COMMAND_ECHO) "			tests-watch             - run tests - and watch for changes."
	@$(COMMAND_ECHO) "	Build/Deploy:"
	@$(COMMAND_ECHO) "		make build                - build project artifacts."
	@$(COMMAND_ECHO) "		make deploy               - build and deploy to github pages."
	@$(COMMAND_ECHO)

#	Presents general info detail.
info: .info-development-dependencies .scm-status
.info-development-dependencies:
	@$(COMMAND_ECHO) "[INFO: Development Dependencies]"	
	@$(COMMAND_ECHO) "	jq version  : `$(COMMAND_JQ) --version` '($(COMMAND_JQ))'"
	@$(COMMAND_ECHO) "	git version : `$(COMMAND_GIT) --version` '($(COMMAND_GIT))'"
	@$(COMMAND_ECHO) "	node version: `$(COMMAND_NODE) --version` '($(COMMAND_NODE))'"
	@$(COMMAND_ECHO) "	npm version : `$(COMMAND_NPM) --version` '($(COMMAND_NPM))'"
	@$(COMMAND_ECHO)

.scm-status:
	@$(COMMAND_ECHO) "[INFO: SCM Status]"
	@$(COMMAND_ECHO) "	Project version : $(VARIABLE_CURRENT_VERSION)"
	@$(COMMAND_ECHO) "	Last Commit Date: '$(VARIABLE_GIT_LOG)'"
	@$(COMMAND_ECHO) "	Untracked Files : '$(VARIABLE_GIT_STATUS)'"
	@$(COMMAND_ECHO) 

install: .install-information
.install-information:
	@$(COMMAND_ECHO) "[INFO: Install]"
	@$(COMMAND_ECHO) "	'install' is not a valid target."
	@$(COMMAND_ECHO) "	'install-development' - for developers and development lifecycle"
	@$(COMMAND_ECHO) "	'install-runtime' - for the run and production lifecycle"

install-development: .install-development-dependencies
.install-development-dependencies:
	@$(COMMAND_ECHO) "[INFO: install-development]"
	@$(COMMAND_NPM) install

install-production: .install-production-dependencies
.install-production-dependencies:
	@$(COMMAND_ECHO) "[INFO: install-production]"
	@$(COMMAND_ECHO) "	This project has no runtime requirements."
	@$(COMMAND_ECHO) "	This project runtime is static html."

#	Rules for development
developer-experience: .developer-continuous-development
.developer-continuous-development:
	@$(COMMAND_ECHO) "[INFO: developer-experience]"
	@$(COMMAND_NPM) run start

test: test-single-run
test-single-run: tests-single-run
tests: test-single-run
tests-single-run:
	@$(COMMAND_ECHO) "[INFO: test-single-run]"
	@$(COMMAND_NPM) run test -- --watchAll=false

test-watch: tests-watch
tests-watch:
	@$(COMMAND_ECHO) "[INFO: test-watch]"
	@$(COMMAND_NPM) run test

#	Additional -- to ensure all arguments are parsed.
test-coverage: tests-coverage
tests-coverage:
	@$(COMMAND_ECHO) "[INFO: test-coverage]"
	@$(COMMAND_NPM) run test -- --coverage --watchAll=false

#	.version 
#		Presents current version, and asks for a new.
#		If the new version does not match the old
#		place the user input .version file.
#		else; exit with a version conflict.
.version:
	@$(COMMAND_ECHO) "[INFO: version]"
	@$(COMMAND_ECHO) "	Current Version: $(VARIABLE_CURRENT_VERSION)"
	@$(COMMAND_ECHO) "	Please supply a new version number (major.minor.revision): "
#	Apparently @$(READ) does not work.
#	This will ask for user input, new version, then
#		Check for any conflicts with git tags, then
#		Update the package.json version
#	By starting with @ on this line, and \ for each following, we avoid
#		unnecessary verbosity.
	@read VARIABLE_NEW_VERSION; \
	if [ -z `$(COMMAND_GIT) tag --list | $(COMMAND_GREP) v$$VARIABLE_NEW_VERSION` ]; then \
   		$(COMMAND_ECHO) $$VARIABLE_NEW_VERSION > .version; \
    else \
		$(COMMAND_ECHO) "Version Conflict! Abort!"; \
		exit 1; \
    fi

#	Cleans up our .version files.
.post-version:
	@$(COMMAND_RM) .version

#	Updates the .changelog file, and then the CHANGELOG.md
.changelog: .clean-changelog
	@$(COMMAND_ECHO) "[INFO: changelog]"
#	Note that the $VARIABLE_CURRENT_VERSION variable includes quotes.
	if [ "$(VARIABLE_CURRENT_VERSION)" = "$(VARIABLE_PROPOSED_VERSION)" ]; then\
		$(COMMAND_ECHO) "	Version Conflict! Abort!";\
		$(COMMAND_ECHO) "	It appears you have not incremented your version number.";\
		$(COMMAND_ECHO) "	Consider running make version to do so.";\
		exit 1;\
	fi;
#	Pushing current version, and git log. (Title)
	@$(COMMAND_ECHO) "	Updating CHANGELOG.md $(VARIABLE_CURRENT_VERSION) to $(VARIABLE_PROPOSED_VERSION)"
	@$(COMMAND_ECHO) "v$(VARIABLE_PROPOSED_VERSION) - $(VARIABLE_GIT_LOG)" > .changelog
	@$(COMMAND_ECHO) "--------------------------------------" >> .changelog
#	Generate the the git logs to date 
#	We use printf here to generate consistent changelog identifiers.
#	We use $(COMMAND_AWK) to pull out the abbreviated commit id, and
#		We then generate a markdown suitable link for github usage.
#		We then insert a ' - ' at the start of each line for a list.
	@$(COMMAND_PRINTF) "`git log --format='%h %s' v$(VARIABLE_CURRENT_VERSION)..HEAD`" | $(COMMAND_AWK) '{printf "["$$1"](../../commit/"$$1")"; $$1=""; print $$0}' | $(COMMAND_SED) --expression 's/^/ - /' >> .changelog
#	We then add a new line at the end of this file, to avoid it impacting formatting of previous CHANGELOG.md inforamtion.
	@$(COMMAND_ECHO) "" >> .changelog
#	Cat both out, with the .changelog (latest) at start.
#	Then move into our new CHANGELOG.md
	@$(COMMAND_CAT) .changelog CHANGELOG.md > tmp && mv tmp CHANGELOG.md
	@$(COMMAND_RM) .changelog

.clean-changelog:
	@$(COMMAND_ECHO) "" > .changelog

#	Used to call npm build.
build: .pre-build
	@$(COMMAND_ECHO) "[INFO: pre-build]"
	@$(COMMAND_NPM) run build

#	Check if any modifications are not tracked by git.
#		Will abort the release process.
.check-working-tree:
	@$(COMMAND_ECHO) "[INFO: check-working-tree]"
	if [ ! -z "$(VARIABLE_GIT_STATUS)" ]; then\
		$(COMMAND_ECHO) "Working Tree Conflict (Not Clean)! Abort!";\
		exit 1;\
	fi;

#	Generates the .branch information.
.branch:
	@$(COMMAND_ECHO) "[INFO: branch]"
#	Returns the current selected branch.
	@$(COMMAND_GIT) branch | $(COMMAND_GREP) '^*' | $(COMMAND_AWK) '{ print $$2 }' > .branch
#	Echo to console.
	@$(COMMAND_ECHO) "Current branch: `$(COMMAND_CAT) .branch`"

#	Cleans up the .branch information.
.post-branch:
	@$(COMMAND_RM) .branch

#	Used to commit the release.
.commit:
	@$(COMMAND_ECHO) "[INFO: commit]"
	@$(COMMAND_JQ) ".version = \"$(VARIABLE_PROPOSED_VERSION)\"" "package.json" > up.json;
	@$(COMMAND_CAT) up.json > "package.json";
	@$(COMMAND_RM) up.json;
	@$(COMMAND_GIT) commit --allow-empty --message "Release v`cat .version`."
	@$(COMMAND_GIT) add .
	@$(COMMAND_GIT) commit --amend --message "`$(COMMAND_GIT) log --format=%s --max-count=1`"

#	Used to add the release tag.
.tag:
	@$(COMMAND_ECHO) "[INFO: tag]"
	@$(COMMAND_GIT) tag "v`cat .version`"

#	Used to release a version.
.release: .version .commit .tag
	@$(COMMAND_ECHO) "[INFO: release-version]"
	@$(COMMAND_GIT) push $(VARIABLE_REMOTE) "`cat .branch`" "v`cat .version`"

#	.pre-build
#		Install dependencies,
#		run tests - single.
#		clean
.pre-build: install-dependencies tests-single-run clean

#	pre-release
#		run tests - single.
#		clean
#		.branch - 
.pre-release: tests-single-run clean .branch .version .changelog

release: .check-working-tree .pre-release .release .post-release

#	Rules for clean up
.post-release: clean .post-branch .post-version

.clean-all:
	@$(COMMAND_RM) --force --recursive .version .branch build/*

.clean-build:
	@$(COMMAND_RM) --force --recursive build/*

clean: .clean-all
