const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const chalk = require("chalk").default;

async function buildImportGraph(basePath) {
  const files = await globby(["**/*.{js,jsx,ts,tsx}"], {
    cwd: basePath,
    ignore: ["node_modules/**"],
  });

  const graph = {};

  for (const file of files) {
    const fullPath = path.resolve(basePath, file);
    const code = fs.readFileSync(fullPath, "utf8");

    try {
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"],
      });

      const relFile = path.relative(basePath, fullPath); // 🔹 relative path
      graph[relFile] = [];

      traverse(ast, {
        ImportDeclaration({ node }) {
          let importPath = node.source.value;
          if (importPath.startsWith(".")) {
            const resolvedPath = path.resolve(
              path.dirname(fullPath),
              importPath
            );

            let fileWithExt = resolvedPath;
            if (
              !fs.existsSync(fileWithExt) &&
              fs.existsSync(fileWithExt + ".js")
            )
              fileWithExt += ".js";
            else if (
              !fs.existsSync(fileWithExt) &&
              fs.existsSync(fileWithExt + ".jsx")
            )
              fileWithExt += ".jsx";

            const relDep = path.relative(basePath, fileWithExt); // 🔹 relative
            graph[relFile].push(relDep);
          }
        },
      });
    } catch (err) {
      console.log(chalk.red(`Failed to parse ${file}: ${err.message}`));
    }
  }
  return graph;
}

function detectCircularDeps(graph) {
  const visited = new Set();
  const stack = new Set();

  function dfs(node) {
    if (stack.has(node)) {
      console.log(chalk.red(`⚠ Circular dependency detected: ${node}`));
      return;
    }
    if (visited.has(node)) return;

    visited.add(node);
    stack.add(node);

    (graph[node] || []).forEach((dep) => dfs(dep));

    stack.delete(node);
  }

  Object.keys(graph).forEach((node) => dfs(node));
}

function printGraph(graph) {
  console.log(chalk.cyan("\n📦 Component Import Tree\n"));
  for (const file in graph) {
    console.log(chalk.green(file));
    graph[file].forEach((dep) => {
      console.log(`   └── ${chalk.yellow(dep)}`);
    });
  }
}

module.exports = {
  buildImportGraph,
  detectCircularDeps,
  printGraph,
};
