# Agent Webhook Notify

Send a webhook request when a Herdr agent reaches `done` or `blocked` status.

Requires Node.js 18+. Zero npm dependencies.

## Setup

Install from GitHub:

```
herdr plugin install happyeric77/agent-webhook-notify
```

Or link a local checkout while developing:

```
herdr plugin link /path/to/agent-webhook-notify
```

Create the plugin config:

```
CONFIG_DIR="$(herdr plugin config-dir herdr.agent-webhook-notify)"
mkdir -p "$CONFIG_DIR"
cp .env.example "$CONFIG_DIR/.env"
```

Set `WEBHOOK_URL` in `$CONFIG_DIR/.env`:

```
WEBHOOK_URL=https://example.com/hooks/agent-events
```

Optional extra headers (e.g. bearer auth):

```
WEBHOOK_HEADERS_JSON={"Authorization":"Bearer xxxx"}
```

Confirm the actions are visible:

```
herdr plugin action list --plugin herdr.agent-webhook-notify
```

## Usage

Once installed and configured, the plugin runs automatically: whenever an agent
reaches `done` or `blocked`, Herdr fires `pane.agent_status_changed` and the
plugin POSTs the event to `WEBHOOK_URL`.

Enable / disable notifications (toggle):

```
herdr plugin action invoke herdr.agent-webhook-notify.toggle
```

Check the current state:

```
cat ~/.local/state/herdr/plugins/herdr.agent-webhook-notify/enabled
```

View recent plugin runs (stdout/stderr, exit codes):

```
herdr plugin log list --plugin herdr.agent-webhook-notify
```

## Payload

When an agent enters `done` or `blocked`, Herdr fires the
`pane.agent_status_changed` event and the plugin POSTs JSON:

```json
{
  "status": "done",
  "event": { ... },
  "context": { ... }
}
```

`status` is the resolved agent status (`done` or `blocked`). `event` is the raw
`HERDR_PLUGIN_EVENT_JSON` and `context` is the raw `HERDR_PLUGIN_CONTEXT_JSON`
(agent, workspace, tab, pane ids, etc.) for whatever your webhook needs.

## Keybinding

Bind the toggle action from `~/.config/herdr/config.toml`:

```
[[keys.command]]
key = "prefix+a"
type = "plugin_action"
command = "herdr.agent-webhook-notify.toggle"
description = "Toggle webhook notify"
```

In-app toasts are shown only when toast delivery is enabled:

```
[ui.toast]
delivery = "herdr"
```

Reload Herdr after changing the config:

```
herdr server reload-config
```

## License

MIT
