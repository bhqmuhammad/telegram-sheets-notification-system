# Telegram Sheet Notifications

Automatically send Telegram notifications when Google Sheets data changes.

## Features

- 🔔 Automated Telegram notifications for sheet updates
- ⚙️ Configurable message format and trigger conditions
- 📝 Support for all sheet columns
- ✨ Markdown formatting for messages
- 🔍 Detailed logging for troubleshooting
- 🛡️ Error handling and chat migration support

## Prerequisites

- Google Account
- Telegram Bot Token (get from [@BotFather](https://t.me/botfather))
- Google Sheets access

## Setup Guide

### 1. Sheet Setup

Create two sheets in your Google Spreadsheet:

#### Telegram Bot Settings Sheet
| Setting | Value |
|---------|-------|
| Bot Token | Your bot token |
| Form Sheet Name | Name of your data sheet |
| Custom Title | Message title |
| Excluded Columns | comma,separated,columns |
| Trigger Status | COMPLETED |

#### Data Sheet
Must include these columns:
- Status
- Telegram ID

### 2. Script Setup

1. Open Script Editor (Extensions > Apps Script)
2. Copy the code from `src/Code.gs`
3. Save and create a trigger:
   - Function: `sendTelegramNotification`
   - Event: From spreadsheet
   - Event type: On edit

### 3. Usage

1. Users must start your Telegram bot
2. Update the 'Status' column to trigger notifications
3. Bot sends formatted message to specified Telegram ID

## Configuration

### Required Settings
- Bot Token: Your Telegram bot API token
- Form Sheet Name: Name of sheet containing form responses
- Custom Title: Title for notification messages
- Excluded Columns: Columns to exclude from notifications
- Trigger Status: Status value that triggers notification

### Message Format
Notifications include:
- Custom title
- Timestamp
- All non-excluded column values

## Troubleshooting

Check the Apps Script logs for detailed error messages and execution tracking.

Common issues:
1. Invalid bot token
2. Missing required columns
3. Incorrect sheet names
4. Users haven't started the bot

## Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## License

MIT License - See [LICENSE](LICENSE) file
