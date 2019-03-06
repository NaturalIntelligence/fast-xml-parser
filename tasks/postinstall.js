#!/usr/bin/env node

function main() {
  if (process.env.SUPPRESS_SUPPORT) {
    return;
  }

  const msg = '\u001b[32mLove fast-xml-parser? You can now support the project on following:\u001b[22m\u001b[39m\n > \u001b[96m\u001b[1mhttps://opencollective.com/fast-xml-parser/donate\u001b[0m\n > \u001b[96m\u001b[1mhttps://www.patreon.com/bePatron?u=9531404\u001b[0m\n';
  try {
    const Configstore = require('configstore');
    const pkg = require(__dirname + '/../package.json');
    const now = Date.now();

    var week = 1000 * 60 * 60 * 24 * 7;

    // create a Configstore instance with an unique ID e.g.
    // Package name and optionally some default values
    const conf = new Configstore(pkg.name);
    const last = conf.get('lastCheck');
    
    if (!last || now - week > last) {
      console.log(msg);
      conf.set('lastCheck', now);
    }
  } catch (e) {
    console.log(msg);
  }
}

main();