Pre release
* [ ] npm audit and yarn audit is done
* [ ] update pem.d.ts when there is any change path-expression-matcher package
* [ ] Change log has been updated
* [ ] Added/updated documentation for new properties/features
* [ ] `package-lock.json` reflects the right version : `npm install`
* [ ] Browser bundle are generated `npm run bundle`
* [ ] TS and CJS typings are updated
  - fxp.d.cts
  - fxp.d.ts

  check here
  - https://www.typescriptlang.org/play/
  - https://github.com/NaturalIntelligence/fxp-type-testing
* [ ] ReadMe file or docs are updated for any change, user list, performance report, links etc.
* [ ] Single test is not running `fit`
* [ ] `npm run checkReadiness` is used to check the files being published
* [ ] tags are assigned to latest commit `git tag -a v3.20.0 -m "summary msg"`

In general
* [ ] tests are added/updated

Post release
* [ ] Tagged and Released on github `git push origin --tags`
* [ ] `git push origin master --tags`
* [ ] Notified to the users
* [ ] Sync master and dev branches

To remove tag
git tag -d <tag_name>

---

v4 legacy maintenance branch v4-maintenance

- `npm publish --tag legacy`
- `git push origin v4-maintenance --tags`
- update relevant CVE if applicable