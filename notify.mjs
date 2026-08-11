import { loadDotEnv, modeEnabled } from "./lib.mjs";

loadDotEnv();

if (!modeEnabled()) {
  process.exit(0);
}

const webhookUrl = process.env.WEBHOOK_URL?.trim();
if (!webhookUrl) {
  console.error("missing WEBHOOK_URL");
  process.exit(0);
}

const context = readJsonEnv("HERDR_PLUGIN_CONTEXT_JSON");
const event = readJsonEnv("HERDR_PLUGIN_EVENT_JSON");
const status = statusFromEvent(event) ?? statusFromContext(context);

if (!["done", "blocked"].includes(status)) {
  process.exit(0);
}

const payload = {
  status,
  event,
  context,
};

await sendWebhook(webhookUrl, payload);

function readJsonEnv(name) {
  const raw = process.env[name];
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error(`invalid ${name}: ${error.message}`);
    return {};
  }
}

function statusFromEvent(event) {
  const status = event?.data?.agent_status;
  return typeof status === "string" ? status.toLowerCase() : undefined;
}

function statusFromContext(context) {
  const direct = context.focused_pane_status ?? context.agent_status ?? context.status;
  if (typeof direct === "string") {
    return direct.toLowerCase();
  }
  const eventStatus =
    context.event?.status ??
    context.event?.agent_status ??
    context.event?.pane?.agent_status ??
    context.event?.pane?.agent?.status;
  if (typeof eventStatus === "string") {
    return eventStatus.toLowerCase();
  }
  return undefined;
}

async function sendWebhook(webhookUrl, payload) {
  const headers = { "content-type": "application/json" };
  const extra = process.env.WEBHOOK_HEADERS_JSON?.trim();
  if (extra) {
    try {
      Object.assign(headers, JSON.parse(extra));
    } catch (error) {
      console.error(`invalid WEBHOOK_HEADERS_JSON: ${error.message}`);
    }
  }
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`webhook failed: ${response.status} ${body}`);
  }
}
