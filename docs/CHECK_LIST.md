Pre release
- [ ] pull and rebase changes from remote `git pull --rebase origin master`
- [ ] npm audit and yarn audit is done
- [ ] change in local package installation
- [ ] update pem.d.ts when there is any change path-expression-matcher package
- [ ] Change log has been updated
- [ ] Added/updated documentation for new properties/features
- [ ] `package-lock.json` reflects the right version : `npm install`
- [ ] Browser bundle are generated `npm run bundle`
- [ ] TS and CJS typings are updated
  - fxp.d.cts
  - fxp.d.ts

  check here
  - https://www.typescriptlang.org/play/
  - https://github.com/NaturalIntelligence/fxp-type-testing
- [ ] ReadMe file or docs are updated for any change, user list, performance report, links etc.
- [ ] Single test is not running `fit`

Release: ensure not uncommited changes
- Version: `npm version patch|minor|major`
  It runs `preversion` -> `version` -> `postversion` scripts if setup
  - It Computes the new version
  - update version in package.json and lock file. Commits the changed files. Default commit message is just the version string itself (e.g. 4.5.2)
  - Creates an annotated git tag on that commit, named v4.5.2
  - Then will run postversion script. that does nothing
- run `git push origin master --tags`
    This'll trigger github publish action when new tag is found.
    github action will release to npm and github

In general
- [ ] tests are added/updated

Post release
- [ ] Notified to the users
- [ ] Sync master and dev branches

To remove tag
git tag -d <tag_name>

---

v4 legacy maintenance branch v4-maintenance

- `npm publish --tag legacy`
- `git push origin v4-maintenance --tags`
- update relevant CVE if applicable