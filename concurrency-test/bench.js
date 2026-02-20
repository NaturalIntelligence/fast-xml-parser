import { XMLParser } from "fast-xml-parser";
import { performance } from "node:perf_hooks";

// Generate a bigger XML payload (tune SIZE if needed)
const ITEMS = 50000; // try 5k, 20k, 50k if needed
const xml =
  `<root>` +
  Array.from({ length: ITEMS }, (_, i) => `<item><id>${i}</id><value>test</value></item>`).join("") +
  `</root>`;

function parseWithNewParser() {
  const parser = new XMLParser();
  return parser.parse(xml);
}

const sharedParser = new XMLParser();
function parseWithSharedParser() {
  return sharedParser.parse(xml);
}

async function runScenario({ label, iterations, concurrency, shared }) {
  // Create tasks to run in batches of `concurrency`
  const parseFn = shared ? parseWithSharedParser : parseWithNewParser;

  const t0 = performance.now();

  for (let i = 0; i < iterations; i += concurrency) {
    const batchSize = Math.min(concurrency, iterations - i);
    await Promise.all(
      Array.from({ length: batchSize }, () =>
        Promise.resolve().then(() => parseFn())
      )
    );
  }

  const t1 = performance.now();
  return { label, ms: t1 - t0 };
}

function fmt(ms) {
  return `${(ms / 1000).toFixed(3)}s`;
}

async function main() {
  const rounds = 3; // average a few runs
  const iterations = 50; // increase if results are too noisy
  const concurrencies = [1, 2, 5, 10, 25, 50];

  console.log(`Node: ${process.version}`);
  console.log(`ITEMS: ${ITEMS}, iterations: ${iterations}, rounds: ${rounds}\n`);

  for (const shared of [true, false]) {
    console.log(shared ? "=== Shared parser instance ===" : "=== New parser per task ===");

    for (const c of concurrencies) {
      const results = [];
      for (let r = 0; r < rounds; r++) {
        const out = await runScenario({
          label: `c=${c}`,
          iterations,
          concurrency: c,
          shared,
        });
        results.push(out.ms);
      }
      const avg = results.reduce((a, b) => a + b, 0) / results.length;
      console.log(`concurrency ${String(c).padStart(2)} avg: ${fmt(avg)}  (runs: ${results.map(fmt).join(", ")})`);
    }
    console.log("");
  }
}

main();
