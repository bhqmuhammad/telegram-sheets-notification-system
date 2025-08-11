# Detailed Setup Guide

## Prerequisites

Before starting, ensure you have:
- Google Account with Google Sheets access
- Telegram account
- Basic understanding of Google Apps Script (helpful but not required)

## Step 1: Create Your Telegram Bot

### 1.1 Contact BotFather
1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a conversation with `/start`
3. Create a new bot with `/newbot`
4. Choose a name for your bot (e.g., "My Notification Bot")
5. Choose a username (must end with "bot", e.g., "mynotification_bot")
6. **Save the API token** provided (looks like: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`)

### 1.2 Configure Bot Settings (Optional)
```
/setdescription - Set bot description
/setcommands - Set bot commands
/setprivacy - Enable/disable privacy mode
```

## Step 2: Prepare Your Google Spreadsheet

### 2.1 Create Settings Sheet
1. Open your Google Spreadsheet
2. Create a new sheet named **exactly**: `Telegram Bot Settings`
3. Set up the configuration table:

| A | B |
|---|---|
| Bot Token | [Paste your bot token here] |
| Form Sheet Name | [Name of your data sheet] |
| Custom Title | [Your notification title] |
| Excluded Columns | [Columns to exclude, comma-separated] |
| Trigger Status | COMPLETED |

**Example:**
| A | B |
|---|---|
| Bot Token | 123456789:ABCdefGHIjklMNOpqrSTUvwxYZ |
| Form Sheet Name | Form Responses |
| Custom Title | New Customer Inquiry |
| Excluded Columns | Timestamp,Internal Notes |
| Trigger Status | SUBMITTED |

### 2.2 Setup Data Sheet Structure
Your data sheet **must** include these columns:
- **Status** - Used to trigger notifications (exact name required)
- **Telegram ID** - Where to send notifications (exact name required)

**Example data sheet:**
| Name | Email | Phone | Status | Telegram ID | Comments |
|------|-------|-------|--------|-------------|----------|
| John Doe | john@email.com | +1234567890 | PENDING | 123456789 | Initial inquiry |

### 2.3 Advanced Configuration (Optional)
Add these rows to your settings sheet for enhanced features:

| A | B | Description |
|---|---|-------------|
| Message Template | DEFAULT | Template type (DEFAULT, MINIMAL, DETAILED, COMPACT, PROFESSIONAL) |
| Enable Retry | TRUE | Enable automatic retry for failed messages |
| Max Retries | 3 | Maximum retry attempts |
| Enable Logging | TRUE | Enable detailed logging |
| Company Name | Your Company | Company name for professional template |
| Important Fields | Status,Name,Email | Fields to include in minimal template |
| Essential Fields | Status,Name | Fields to include in compact template |

## Step 3: Install Google Apps Script

### 3.1 Open Apps Script Editor
1. In your Google Spreadsheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire content from `src/Code.gs` in this repository
4. Paste it into the Apps Script editor
5. Save the project (Ctrl+S or Cmd+S)

### 3.2 Add Additional Script Files (For Enhanced Features)
For the full feature set, add these additional files:

1. **Create new file**: Click the **+** next to "Files"
2. **Name it**: `MessageTemplates.gs`
3. **Copy content** from `src/MessageTemplates.gs`
4. **Repeat** for:
   - `ConfigManager.gs`
   - `DevUtils.gs`

### 3.3 Set Project Properties
1. Click on **Project Settings** (gear icon)
2. Check **"Show appsscript.json manifest file in editor"**
3. You can customize the project name and description

## Step 4: Create Spreadsheet Trigger

### 4.1 Create Edit Trigger
1. In Apps Script, click **Triggers** (clock icon) in the sidebar
2. Click **+ Add Trigger**
3. Configure:
   - **Function**: `sendTelegramNotification`
   - **Event source**: From spreadsheet
   - **Event type**: On edit
   - **Failure notification**: Daily (recommended)
4. Click **Save**

### 4.2 Authorize the Script
1. You'll be prompted to authorize the script
2. Click **Review permissions**
3. Choose your Google account
4. Click **Advanced** → **Go to [Your Project Name] (unsafe)**
5. Click **Allow**

## Step 5: Test Your Setup

### 5.1 Test Bot Token
Run this function in Apps Script:
```javascript
function testBotToken() {
  const results = runSystemHealthCheck();
  console.log(results);
}
```

### 5.2 Send Test Notification
1. Get your Telegram chat ID:
   - Start your bot on Telegram
   - Send `/start` to your bot
   - Visit: `https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates`
   - Find your chat ID in the response

2. Run test in Apps Script:
```javascript
function testNotification() {
  sendTestNotification('YOUR_CHAT_ID', 'Test message from setup');
}
```

### 5.3 Test Complete Workflow
1. Add a test row to your data sheet
2. Set the Status column to your trigger value (e.g., "COMPLETED")
3. Include a valid Telegram ID
4. Check Telegram for the notification

## Step 6: Production Setup

### 6.1 User Onboarding
For users to receive notifications:
1. Users must start your bot on Telegram
2. They need to provide their Telegram ID (visible when they message the bot)
3. Add their Telegram ID to the appropriate row in your sheet

### 6.2 Get User Telegram IDs
Create a simple bot command to help users get their ID:
```javascript
// Add this function for user ID lookup
function getUserTelegramId() {
  // Users can send any message to the bot
  // Check bot updates: https://api.telegram.org/bot[TOKEN]/getUpdates
  // Their user ID will be in the 'from' field
}
```

### 6.3 Configure Logging
1. In Apps Script, go to **Executions** to view logs
2. Set up email notifications for failures
3. Monitor the execution frequency

## Troubleshooting

### Common Setup Issues

#### 1. "TypeError: Cannot read property 'range' of undefined"
**Cause**: Trigger event object is missing
**Solution**: Ensure trigger is set to "On edit" from spreadsheet

#### 2. "Settings sheet not found"
**Cause**: Sheet name doesn't match exactly
**Solution**: Verify sheet is named exactly "Telegram Bot Settings"

#### 3. "Bot token invalid"
**Cause**: Incorrect or malformed bot token
**Solutions**:
- Copy token carefully from BotFather
- Check for extra spaces or characters
- Generate new token from BotFather if needed

#### 4. "Required columns not found"
**Cause**: Missing or incorrectly named columns
**Solution**: Ensure columns are named exactly "Status" and "Telegram ID"

#### 5. "User not receiving messages"
**Causes & Solutions**:
- User hasn't started the bot → User must send `/start` to bot
- Wrong Telegram ID → Verify ID is correct numbers only
- Bot blocked by user → User must unblock bot
- Privacy settings → Check bot privacy mode

### Advanced Troubleshooting

#### Enable Debug Logging
Add this to your Apps Script for detailed debugging:
```javascript
function enableDebugLogging() {
  // This will log every step of execution
  console.log("Debug mode enabled");
  
  // Test configuration
  const config = getConfiguration();
  console.log("Configuration:", JSON.stringify(config, null, 2));
  
  // Test sheet access
  const validation = validateSystemConfiguration();
  console.log("Validation results:", validation);
}
```

#### Monitor API Calls
Track Telegram API responses:
```javascript
function monitorTelegramAPI() {
  // Check bot info
  const config = getConfiguration();
  const url = `https://api.telegram.org/bot${config.botApiToken}/getMe`;
  const response = UrlFetchApp.fetch(url);
  console.log("Bot info:", response.getContentText());
}
```

#### Performance Optimization
For high-volume usage:
1. **Batch processing**: Group multiple notifications
2. **Rate limiting**: Respect Telegram's API limits
3. **Error handling**: Implement proper retry logic
4. **Caching**: Cache configuration data

## Security Best Practices

### 1. Protect Your Bot Token
- Never share your bot token publicly
- Use Google Apps Script's PropertiesService for sensitive data:
```javascript
// Store token securely
PropertiesService.getScriptProperties().setProperty('BOT_TOKEN', 'your_token_here');

// Retrieve token securely
const token = PropertiesService.getScriptProperties().getProperty('BOT_TOKEN');
```

### 2. Validate Input Data
- Sanitize all user inputs
- Validate Telegram IDs format
- Check for malicious content

### 3. Monitor Usage
- Regular audit of notifications sent
- Monitor for unusual patterns
- Set up alerts for failures

### 4. Access Control
- Limit spreadsheet access to authorized users
- Use Google Workspace permissions effectively
- Regular review of user access

## Scaling for Production

### Multiple Bots
For different notification types:
```javascript
// Configuration for multiple bots
const BOT_CONFIGS = {
  'urgent': '123456789:ABCdef...',
  'general': '987654321:XYZabc...',
  'marketing': '456789123:LMNopq...'
};
```

### High Volume Processing
For frequent notifications:
1. **Implement queuing system**
2. **Use batch processing**
3. **Add rate limiting**
4. **Monitor API quotas**

### Error Recovery
Robust error handling:
```javascript
function handleNotificationErrors(error, rowData) {
  // Log error details
  console.error("Notification failed:", error);
  
  // Store failed notifications for retry
  const failedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Failed Notifications');
  failedSheet.appendRow([new Date(), JSON.stringify(rowData), error.toString()]);
  
  // Send admin alert if needed
  if (error.toString().includes('rate limit')) {
    // Handle rate limiting
  }
}
```

## Maintenance

### Regular Tasks
1. **Monitor execution logs weekly**
2. **Update bot token if compromised**
3. **Review and clean up old data**
4. **Test notification delivery monthly**

### Updates and Versioning
1. **Test changes in development spreadsheet first**
2. **Backup current script before updates**
3. **Document changes in Apps Script comments**
4. **Gradual rollout for major changes**

## Support and Resources

### Getting Help
1. **Check execution logs first**
2. **Review this documentation**
3. **Search GitHub issues**
4. **Create detailed issue report**

### Useful Resources
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API Reference](https://developers.google.com/sheets/api)

### Community
- GitHub Discussions for questions
- GitHub Issues for bug reports
- Contribution guidelines for improvements
