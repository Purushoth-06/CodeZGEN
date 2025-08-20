#!/usr/bin/env node

const { Command } = require("commander");
const chalk = require("chalk").default;
const ora = require("ora").default; // For professional spinners
const figlet = require("figlet");
const gradient = require("gradient-string");
const chalkAnimation = require("chalk-animation").default;
const { scanProject } = require("../lib/codezgenscanner.js");
const { showFolderStructure } = require("../lib/codezgenstructure.js");
const {
  buildImportGraph,
  detectCircularDeps,
  printGraph,
} = require("../lib/codezgenImportVis.js");

const program = new Command();

async function pause(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function welcomeMessage() {
  console.clear();

  // Generate big ASCII text
  const asciiText = figlet.textSync("CodeZGen", {
    font: "Big", // Try "ANSI Shadow" or "Slant" for cooler effect
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  // Apply gradient to ASCII text
  console.log(gradient.pastel.multiline(asciiText));

  // Subtitle animation
  const anim = chalkAnimation.neon("🚀 Project Onboarding Scanner");
  await pause(2500);
  anim.stop();
  console.log("\n");
}

program
  .name("codezgen")
  .description("🛠 Generate onboarding steps and insights for any project")
  .version("1.0.0");

// ---------------------- SCAN COMMAND ----------------------
program
  .command("scan")
  .description("Scan current project and generate onboarding info")
  .action(async () => {
    await welcomeMessage();
    const spinner = ora({
      text: chalk.cyan("Scanning project and creating onboarding info …"),
      spinner: "dots",
    }).start();

    await pause(1000);
    spinner.succeed(chalk.green("Project scan complete"));

    console.log("\n" + chalk.bold("📂 Project Info:"));
    scanProject();
  });

// ---------------------- STRUCTURE COMMAND ----------------------
program
  .command("proj-struct")
  .description("Generate detailed folder structure of the project")
  .action(async () => {
    await welcomeMessage();
    const spinner = ora(chalk.cyan("Scanning project structure…")).start();
    await pause(1000);

    spinner.succeed(chalk.green("Project structure ready"));

    console.log("\n" + chalk.bold("📂 Project Structure:"));
    showFolderStructure();

    console.log("\n" + chalk.bold.green("✔ Analysis complete"));
  });

// ---------------------- IMPORT GRAPH COMMAND ----------------------
program
  .command("e-file-imports")
  .description("Analyze file imports and detect circular dependencies")
  .action(async () => {
    await welcomeMessage();
    const basePath = process.cwd();

    const spinner1 = ora(chalk.cyan("Building import graph…")).start();
    const graph = await buildImportGraph(basePath);
    await pause(1000);
    spinner1.succeed(chalk.green("Import graph built"));

    const spinner2 = ora(chalk.cyan("Generating dependency tree…")).start();
    await pause(600);
    spinner2.succeed(chalk.green("Dependency tree generated"));

    console.log("\n" + chalk.bold("📦 Import Graph:"));
    printGraph(graph);

    const spinner3 = ora(
      chalk.cyan("Checking for circular dependencies…")
    ).start();
    await pause(600);
    spinner3.stop();
    detectCircularDeps(graph);

    console.log("\n" + chalk.bold.green("✔ Analysis complete"));
  });

program.parse(process.argv);
