import { spawn } from "node:child_process";
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const processes = [
  spawn(npm, ["run", "css", "--", "--watch=always"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"], {
    stdio: "inherit",
  }),
];
let closing = false;
function stop(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of processes) child.kill();
  process.exitCode = code;
}
for (const child of processes) {
  child.on("error", (error) => {
    console.error(error);
    stop(1);
  });
  child.on("exit", (code) => {
    if (!closing) stop(code ?? 0);
  });
}
process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
