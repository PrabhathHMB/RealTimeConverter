const fs = require("fs").promises;
const path = require("path");

const historyFile = path.join(__dirname, "../history.json");

async function readHistoryFile() {
  try {
    const content = await fs.readFile(historyFile, "utf8");
    return JSON.parse(content || "[]");
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeHistoryFile(history) {
  await fs.writeFile(historyFile, JSON.stringify(history, null, 2), "utf8");
}

exports.getHistory = async () => {
  return await readHistoryFile();
};

exports.addRecord = async (record) => {
  const history = await readHistoryFile();
  const entry = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    createdAt: new Date().toISOString(),
    ...record,
  };
  history.unshift(entry);
  await writeHistoryFile(history);
  return entry;
};
