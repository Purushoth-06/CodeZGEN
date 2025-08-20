const fs = require("fs");
const path = require("path");
const chalk = require("chalk").default;

function scanProject() {
  const cwd = process.cwd();
  const files = fs.readdirSync(cwd);

  // Check for package.json
  const isNodeProject = files.includes("package.json");
  let packageJson = {};

  if (isNodeProject) {
    packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
    console.log(chalk.green("📦 Node.js project detected!"));
  }

  // Detect Framework
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const frameworkSteps = [];

  if (dependencies.react) {
    console.log(chalk.magenta("⚛️ React project detected!"));
    frameworkSteps.push("npm install");
    frameworkSteps.push("npm start or npm run dev");
  } else if (dependencies.vue) {
    console.log(chalk.green("🟩 Vue.js project detected!"));
    frameworkSteps.push("npm install");
    frameworkSteps.push("npm run serve or npm run dev");
  } else if (dependencies.angular) {
    console.log(chalk.red("🅰️ Angular project detected!"));
    frameworkSteps.push("npm install");
    frameworkSteps.push("ng serve");
  } else if (dependencies.svelte) {
    console.log(chalk.yellow("🔥 Svelte project detected!"));
    frameworkSteps.push("npm install");
    frameworkSteps.push("npm run dev");
  } else if (isNodeProject) {
    console.log(chalk.blue("🛠 General Node.js project detected!"));
    frameworkSteps.push("npm install");
  } else {
    console.log(chalk.gray("📁 Not a Node.js based frontend project."));
  }

  // Check folders
  if (files.includes("src")) {
    console.log(chalk.cyan("📁 Source code is in ./src"));
  }
  if (files.includes("public")) {
    console.log(chalk.cyan("🌐 Public assets in ./public"));
  }
  if (files.includes("dist")) {
    console.log(chalk.cyan("📦 Build output in ./dist"));
  }

  // Show onboarding instructions
  if (frameworkSteps.length > 0) {
    console.log(chalk.greenBright("\n👉 Onboarding steps:"));
    frameworkSteps.forEach((step) => console.log(`   - ${step}`));
  }

  console.log(
    chalk.greenBright("\n✅ Onboarding steps generated successfully!")
  );
}

module.exports = { scanProject };
