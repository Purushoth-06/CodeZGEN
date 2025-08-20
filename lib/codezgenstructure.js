const fs = require("fs");
const path = require("path");
const chalk = require("chalk").default;

function printStructure(dirPath, indent = "") {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    if (item.name === "node_modules") continue;

    const itemPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      console.log(chalk.green(`${indent}├── ${item.name}/`));
      printStructure(itemPath, indent + "│   ");
    } else {
      console.log(chalk.yellow(`${indent}├── ${item.name}`));
    }
  }
}

function showFolderStructure(basePath = process.cwd()) {
  console.log(chalk.cyanBright("\n📂 Detected structure:"));
  printStructure(basePath);
}

module.exports = { showFolderStructure };
