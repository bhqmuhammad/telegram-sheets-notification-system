# Detailed Setup Guide

## 1. Google Sheets Configuration

### Settings Sheet Structure
Create a sheet named 'Telegram Bot Settings':

| A | B |
|---|---|
| Bot Token | [Your Bot Token] |
| Form Sheet Name | [Sheet Name] |
| Custom Title | [Message Title] |
| Excluded Columns | [Columns to Exclude] |
| Trigger Status | [Status to Trigger] |

### Data Sheet Requirements
Your data sheet must include:
- Status column (for trigger)
- Telegram ID column (for message delivery)

## 2. Telegram Bot Setup

1. Message [@BotFather](https://t.me/botfather)
2. Create new bot with `/newbot`
3. Save the API token
4. Add token to settings sheet

## 3. Script Installation

1. Open Google Sheets
2. Go to Extensions > Apps Script
3. Copy code from `src/Code.gs`
4. Save project
5. Create trigger for `sendTelegramNotification`

## 4. Testing

1. Add test data
2. Update Status column
3. Check Telegram for notification
4. Review Apps Script logs

## Customization

### Message Format
Modify the message format in the code:
- Change markdown formatting
- Add/remove fields
- Customize layout

### Trigger Conditions
Adjust when notifications are sent:
- Change trigger status
- Modify column names
- Add additional conditions
