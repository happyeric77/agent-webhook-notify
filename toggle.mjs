import { spawnSync } from "node:child_process";
import {
  loadDotEnv,
  modeEnabled,
  modePath,
  setMode,
} from "./lib.mjs";

loadDotEnv();

const requested = process.argv[2]?.trim().toLowerCase();
const enabled =
  requested === "on" || requested === "enable" || requested === "enabled"
    ? true
    : requested === "off" || requested === "disable" || requested === "disabled"
      ? false
      : !modeEnabled();

setMode(enabled);
const label = enabled ? "enabled" : "disabled";
console.log(`Webhook notifications ${label}.`);
console.log(`State: ${modePath()}`);

const herdrBin = process.env.HERDR_BIN_PATH ?? "herdr";
const notice = spawnSync(
  herdrBin,
  ["notification", "show", "Webhook notify", "--body", `Notifications ${label}`],
  { encoding: "utf8" },
);
if (notice.status !== 0) {
  console.error(
    `notification show failed (${notice.status}): ${notice.stderr ?? notice.stdout ?? "unknown error"}`.trim(),
  );
}
