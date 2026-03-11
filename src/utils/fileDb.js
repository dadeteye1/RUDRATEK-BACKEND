const fs = require("fs/promises");
const path = require("path");

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "store.json");
const initialData = {
  users: [],
  projects: [],
};

let storeQueue = Promise.resolve();

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, `${JSON.stringify(initialData, null, 2)}\n`);
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(dataFile, "utf8");
  return JSON.parse(raw);
}

function writeStore(nextState) {
  storeQueue = storeQueue.then(async () => {
    await ensureStore();
    await fs.writeFile(dataFile, `${JSON.stringify(nextState, null, 2)}\n`);
  });

  return storeQueue;
}

async function updateStore(mutator) {
  const operation = storeQueue.then(async () => {
    const currentState = await readStore();
    const nextState = await mutator(structuredClone(currentState));

    if (!nextState) {
      throw new Error("Mutator must return the next state");
    }

    await fs.writeFile(dataFile, `${JSON.stringify(nextState, null, 2)}\n`);
    return nextState;
  });

  storeQueue = operation.catch(() => {});
  return operation;
}

module.exports = {
  readStore,
  updateStore,
};
