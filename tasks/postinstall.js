//Display message after instalation
const NC = `\x1B[0m`; // No Color
const bold=`\x1B[1m`;
const stars = `${bold}***${NC}`;
const yellow = `\x1B[1;33m`;
const light_green = `\x1B[1;32m`;
const light_blue = `\x1B[1;34m`;

console.log(`\
${yellow}              Donating to an open source project is more affordable${NC}
                  ${stars} Thank you for using ${light_green}fast-xml-parser${NC}! ${stars}

                 Please consider donating to our open collective
                      to help us maintain this package.

${light_blue}                https://opencollective.com/fast-xml-parser/donate${NC}
                                      or
${light_blue}                   https://www.patreon.com/bePatron?u=9531404${NC}
                                      or
${light_blue}   https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQJAX48SPUKNC${NC}

                                     ${stars}


`);

