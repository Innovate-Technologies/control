## Initial setup

After cloning the repository, run `npm install` to install all dependencies.

## Working on the code

The source is located in src/. File names are in lowercase and
are separated by hyphens. They all have a suffix attached when applicable;
for instance, controllers have a -ctrl suffix, services have -service, and so on.

When adding new code or fixing bugs, consider also improving and/or adding tests.
Unit test files have a .tests.js suffix.

Use `npm start` to start a dev server on localhost:8900.
The port can be overridden by setting the PORT environment variable.
The server will serve Control and automatically reload on changes.

## Committing

A fork workflow is used for Control, so most of the time,
you won't directly work in Control's repo. You'll work on your fork of the repository,
except for quick fixes and small changes that really don't need a pull request.

**IMPORTANT**: Before committing, check out a new branch and give it a descriptive name,
such as `now-playing-feature`, `config-loading-fix`, or `code-cleanup`.

Commit regularily and avoid making huge, monolithic commits. And please,
write good and descriptive commit messages.
A good commit message should describe what the commit does.

Before committing, test your code with `npm test` and also by using the app.
*Make sure it works before continuing.*

When you're done with your commits, push them to your repo.

When you think that your changes are ready to be merged into master,
open a pull request to get your changes reviewed and merged.

## Releasing to production

When a branch gets merged or a commit is made on master, a build server
will automatically build the app, run tests, and deploy it in production
if nothing went wrong.
