import { execSync } from "child_process";

console.log("Resetting project...");
execSync("rm -rf node_modules .expo", { stdio: "inherit" });
execSync("npm install", { stdio: "inherit" });
console.log("Project reset complete!");
