// Display message after instalation

const stars = '\x1B[1m***\x1B[0m';
const yellow = '\033[1;33m';
// const light_green = "\033[1;32m";
const light_blue = '\033[1;34m';
const NC = '\033[0m'; // No Color

console.log('' + stars + ' Thank you for using fast-xml-parser! ' + stars);
console.log('');
console.log(yellow + 'Donating to an open source project is more affordable' + NC);
console.log(light_blue + '  https://opencollective.com/fast-xml-parser/donate' + NC);
console.log(light_blue + '  https://www.patreon.com/bePatron?u=9531404' + NC);
console.log(light_blue + '  https://www.paypal.me/amitkumarguptagwl' + NC);
console.log('');
console.log('');
process.exit(0);
