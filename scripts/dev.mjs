import { spawn } from "node:child_process";
const processes = [
  spawn(
    "node_modules/.bin/tailwindcss",
    ["-i", "src/input.css", "-o", "src/output.css", "--watch=always"],
    { stdio: "inherit" },
  ),
  spawn("node_modules/.bin/vite", ["--host", "127.0.0.1"], {
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
