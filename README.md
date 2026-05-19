# whatsapp-dispatcher

Configurable WhatsApp bot for scheduled message and poll dispatching. Define what to send, when, and where — the bot handles the rest.

## Features

- Send **polls** and **text messages** on a cron schedule
- Multiple dispatches in a single config file
- Connects via [Baileys](https://github.com/WhiskeySockets/Baileys) (no official API needed)
- Fully configurable — no code changes needed to add/edit dispatches

## Requirements

- Node.js 18+
- A dedicated phone number for the bot (separate from your personal WhatsApp)

## Setup

```bash
git clone https://github.com/saraopenclawn/whatsapp-dispatcher.git
cd whatsapp-dispatcher
npm install
cp .env.example .env
```

## Configuration

Edit `config/dispatches.json` to define your dispatches:

```json
{
  "dispatches": [
    {
      "id": "weekly-poll",
      "type": "poll",
      "schedule": "0 10 * * 1",
      "target": "GROUP_ID@g.us",
      "content": {
        "question": "Ako sa cítiš tento týždeň?",
        "options": ["Výborne", "Dobre", "Ujde", "Zle"],
        "selectableCount": 1
      }
    },
    {
      "id": "reminder",
      "type": "message",
      "schedule": "0 9 * * 5",
      "target": "GROUP_ID@g.us",
      "content": {
        "text": "Nezabudnite na meeting o 10:00!"
      }
    }
  ]
}
```

### Dispatch fields

| Field | Description |
|---|---|
| `id` | Unique identifier |
| `type` | `poll` or `message` |
| `schedule` | Cron expression (e.g. `"0 10 * * 1"` = Monday at 10:00) |
| `target` | WhatsApp group or contact ID |
| `content` | Type-specific content (see below) |

### Poll content

| Field | Description |
|---|---|
| `question` | Poll question text |
| `options` | Array of answer options (min 2) |
| `selectableCount` | How many options can be selected (default: 1) |

### Message content

| Field | Description |
|---|---|
| `text` | Message text |

### Finding your group ID

Run the bot once, send a message to the group, and the group ID will appear in the logs. It looks like `120363XXXXXXXXXX@g.us`.

## Running

```bash
npm start
```

On first run, a QR code will appear in the terminal. Scan it with the bot's WhatsApp account. Credentials are saved to `auth/` — subsequent runs connect automatically.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `CONFIG_PATH` | `./config/dispatches.json` | Path to dispatch config |
| `AUTH_DIR` | `./auth` | Directory for WhatsApp session |
| `LOG_LEVEL` | `info` | Log level (`debug`, `info`, `warn`, `error`) |

## Tests

```bash
npm test
```

## Cron expression examples

| Expression | Meaning |
|---|---|
| `0 10 * * 1` | Every Monday at 10:00 |
| `0 10 * * 4` | Every Thursday at 10:00 |
| `0 9 * * 1,4` | Monday and Thursday at 09:00 |
| `0 8 * * 1-5` | Weekdays at 08:00 |
