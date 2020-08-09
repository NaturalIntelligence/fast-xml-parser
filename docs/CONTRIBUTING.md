# Thanks
I would like to thank you for your valuable time and effort and apologies if this PR is rejected due to any reason.

This repository is written with the aim of providing high performance not in terms of speed only but comfortability of the user as well.

If your change is not a bug fix please check **nexttodo.md** before implementing any new feature.

## No rights are reserved

Your contribution is valuable. We mention your name on README with the avatar and link to your profile. Currently it is auto-generated. So the sequence of contributors can't be promised. By contributing to this repository you agree that your code can be modified, or removed without any notification. You don't reserve any rights on the code once it is merged to the main codebase. Maintainers are free to use the code in other repositories, or tutorials, or any publication. If we get any financial benefit from this repository from the donation, subscription or any other way, we're not liable to pay the contributors. Maintainers are free to take any decision related to code management and payment.

## DoD
Here is the check list to publish any change

* Changes are not half-implemented due to the library limitation or any other reason.
* Changes are well discussed by raising Github issue. So they are well known by other contributers and users
* Echoing the above point. The purpose / goal for the PR should be mentioned in the description.
* Multiple unrelated changes should not be clubbed in single PR.
* Please run perf tests `node benchmark\perfTest3.js` before and after the changes. And mention it in PR description.
* If you are adding any dependency (specially if it is not the dev dependency) please check that 
  * it is not dependent on other language packages like c/c++
  * the package is not very old, very new, discontinued, or has any vulnerability etc.
  * please check the performance and size of the package
  * please check alternate available options
* Please write tests for the new changes
* Don't forget to write tests for negative cases
* Don't comment existing test cases.

Changes need to do be done by a maintainer
* Increase the version number
* Update the change log & README if required
* Generate the browser bundle
* npm audit
* [Release](https://github.com/NaturalIntelligence/fast-xml-parser/releases) in Github and publish to npm

Note that publishing changes or accepting any PR may take time. So please keep patience.

## Guidelines for first-time contributors

* https://github.com/Roshanjossey/first-contributions
* **Don't stretch**. If you complete an issue in long time, there is a possibility that other developers finish their part and you face code conflicts which may increase code complexity for you. So it is always good to complete an issue ASAP. 
* Please refrain to work on multiple issues marked with "first-timers-only" in the same repo. Ask and help your friends and colleagues to attempt rest issues.
* Please claim the issue and clear your doubts before raising PR. So other users will not start working on the same issue.
* Mention the issue number either in PR detail or in a commit message.
* Keep increasing the level of challenge.
* Don't hesitate to question on Github issue or on twitter.

