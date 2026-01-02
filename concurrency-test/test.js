import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();

const xml = `
<root>
  ${Array.from({ length: 1000 })
    .map((_, i) => `<item><id>${i}</id><value>test</value></item>`)
    .join("")}
</root>
`;

function syncParse() {
  parser.parse(xml);
}

function asyncParse() {
  return Promise.resolve().then(() => parser.parse(xml));
}

async function runTest() {
  console.time("sync");
  for (let i = 0; i < 1000; i++) syncParse();
  console.timeEnd("sync");

  console.time("promiseAll");
  await Promise.all(
    Array.from({ length: 1000 }, () => asyncParse())
  );
  console.timeEnd("promiseAll");
}

runTest();
