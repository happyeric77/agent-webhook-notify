# Agent Webhook Notify

Send a webhook request when a Herdr agent reaches `done` or `blocked` status.

Requires Node.js 18+. Zero npm dependencies.

## Setup

Install from GitHub:

```
herdr plugin install <owner>/agent-webhook-notify
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

Toggle notifications:

```
herdr plugin action invoke toggle --plugin herdr.agent-webhook-notify
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
key = "prefix+s"
type = "plugin_action"
command = "herdr.agent-webhook-notify.toggle"
description = "toggle webhook notify"
```

Reload Herdr after changing the config:

```
herdr server reload-config
```

## License

MIT
