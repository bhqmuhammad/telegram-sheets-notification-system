# Configuration Template for Telegram Sheets Notification System

Copy this configuration to your Google Sheets "Telegram Bot Settings" sheet:

| Setting | Value | Description |
|---------|-------|-------------|
| Bot Token | [YOUR_BOT_TOKEN] | Get from @BotFather on Telegram |
| Form Sheet Name | [YOUR_DATA_SHEET_NAME] | Name of sheet containing your data |
| Custom Title | [YOUR_NOTIFICATION_TITLE] | Title for notification messages |
| Excluded Columns | [COLUMN1,COLUMN2] | Comma-separated columns to exclude |
| Trigger Status | COMPLETED | Status value that triggers notifications |

## Advanced Configuration (Optional)

| Setting | Value | Description |
|---------|-------|-------------|
| Message Template | DEFAULT | Template type: DEFAULT, MINIMAL, DETAILED, COMPACT, PROFESSIONAL |
| Enable Retry | TRUE | Enable automatic retry for failed messages |
| Max Retries | 3 | Maximum number of retry attempts |
| Enable Logging | TRUE | Enable detailed logging |
| Company Name | [YOUR_COMPANY] | Company name for professional template |
| Important Fields | Status,Name,Email | Fields for minimal template |
| Essential Fields | Status,Name | Fields for compact template |

## Required Data Sheet Columns

Your data sheet MUST include these columns:
- **Status** - Used to trigger notifications
- **Telegram ID** - Where to send notifications

## Example Configuration

| Setting | Value |
|---------|-------|
| Bot Token | 123456789:ABCdefGHIjklMNOpqrSTUvwxYZ |
| Form Sheet Name | Form Responses |
| Custom Title | New Form Submission |
| Excluded Columns | Timestamp,Internal Notes |
| Trigger Status | COMPLETED |
| Message Template | PROFESSIONAL |
| Company Name | My Company |

## Message Template Examples

### DEFAULT Template
```
*New Form Submission*
*Generated*: 2024-01-15 10:30:00

*Name*: John Doe
*Email*: john@example.com
*Status*: COMPLETED
```

### MINIMAL Template
```
🔔 *New Form Submission*

*Status*: COMPLETED
*Name*: John Doe
*Email*: john@example.com
```

### PROFESSIONAL Template
```
*My Company*
*New Form Submission*

*Date & Time:* Jan 15, 2024 - 10:30

*Details:*
• *Name:* John Doe
• *Email:* john@example.com
• *Status:* COMPLETED

_This is an automated notification._
```

## Custom Message Template

You can create custom templates using placeholders:

```
🎉 *{{TITLE}}*

Hello! We received your submission at {{TIMESTAMP}}.

📋 **Details:**
👤 Name: {{Name}}
📧 Email: {{Email}}
📍 Status: {{Status}}

Thank you for your submission!
```

## Troubleshooting Configuration

1. **Bot Token Issues**
   - Ensure token starts with numbers followed by colon
   - Get fresh token from @BotFather if needed
   - Check for extra spaces or characters

2. **Sheet Name Issues**
   - Use exact sheet name (case-sensitive)
   - Avoid special characters
   - Ensure sheet exists in same spreadsheet

3. **Column Issues**
   - Required columns: "Status" and "Telegram ID"
   - Column names are case-sensitive
   - Check for extra spaces in column headers

4. **Notification Issues**
   - Users must start your bot first
   - Check Telegram ID format (numbers only)
   - Verify trigger status matches exactly