# Troubleshooting Guide

## Common Issues and Solutions

### Bot Configuration Issues

#### ❌ "Bot token invalid" Error

**Symptoms:**
- API returns "Unauthorized" error
- Bot info request fails
- Messages not sending

**Causes & Solutions:**

1. **Malformed token**
   - ✅ **Check format**: Token should look like `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`
   - ✅ **No extra spaces**: Copy token carefully from BotFather
   - ✅ **Complete token**: Ensure you copied the entire token

2. **Revoked or expired token**
   - ✅ **Generate new token**: Contact @BotFather and use `/revoke` then `/newbot`
   - ✅ **Update settings**: Replace old token in your settings sheet

3. **Character encoding issues**
   - ✅ **Plain text**: Ensure token is pasted as plain text, not rich text
   - ✅ **No hidden characters**: Retype manually if copy-paste fails

**Test bot token:**
```javascript
function testBotToken() {
  const config = getConfiguration();
  const url = `https://api.telegram.org/bot${config.botApiToken}/getMe`;
  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    if (data.ok) {
      console.log("✅ Bot token valid:", data.result.first_name);
    } else {
      console.log("❌ Bot token invalid:", data.description);
    }
  } catch (error) {
    console.log("❌ Network error:", error.toString());
  }
}
```

#### ❌ "Settings sheet not found" Error

**Symptoms:**
- Cannot load configuration
- Script fails immediately
- "Settings sheet not found" in logs

**Solutions:**
1. ✅ **Exact name**: Sheet must be named exactly `Telegram Bot Settings`
2. ✅ **Case sensitive**: Check capitalization
3. ✅ **No extra spaces**: Ensure no leading/trailing spaces
4. ✅ **Same spreadsheet**: Settings sheet must be in the same spreadsheet as the script

### Sheet Structure Issues

#### ❌ "Required columns not found" Error

**Symptoms:**
- "Status column not found" error
- "Telegram ID column not found" error
- Script stops after configuration loading

**Solutions:**
1. ✅ **Exact column names**: Must be exactly `Status` and `Telegram ID`
2. ✅ **Header row**: Ensure columns are in the first row
3. ✅ **No merged cells**: Column headers should be in single cells
4. ✅ **Correct sheet**: Verify you're editing the right data sheet

**Debug column detection:**
```javascript
function debugColumns() {
  const config = getConfiguration();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.formResponsesSheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  console.log("Found columns:", headers);
  console.log("Status column index:", headers.indexOf("Status"));
  console.log("Telegram ID column index:", headers.indexOf("Telegram ID"));
}
```

#### ❌ "Sheet is empty" Error

**Symptoms:**
- "Sheet is empty" in validation
- No columns detected
- getLastColumn() returns 0

**Solutions:**
1. ✅ **Add headers**: Ensure first row has column headers
2. ✅ **Save sheet**: Make sure changes are saved
3. ✅ **Refresh**: Try refreshing the spreadsheet
4. ✅ **Check permissions**: Ensure script has sheet access

### Message Delivery Issues

#### ❌ Users Not Receiving Messages

**Symptoms:**
- No error in logs but user doesn't get message
- "Message sent successfully" but nothing received
- Partial delivery to some users

**Common Causes & Solutions:**

1. **User hasn't started the bot**
   - ❌ Problem: User never initiated conversation with bot
   - ✅ Solution: User must send `/start` to bot first
   - ✅ Test: Send a direct message to bot to initiate

2. **Incorrect Telegram ID**
   - ❌ Problem: Wrong chat ID format or value
   - ✅ Solution: Get correct ID from bot updates
   - ✅ Format: Should be numbers only (e.g., `123456789`)

**Get user's Telegram ID:**
```javascript
function getUserTelegramId() {
  const config = getConfiguration();
  const url = `https://api.telegram.org/bot${config.botApiToken}/getUpdates`;
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  
  console.log("Recent messages:");
  data.result.forEach(update => {
    if (update.message) {
      console.log(`User: ${update.message.from.first_name}, ID: ${update.message.from.id}`);
    }
  });
}
```

3. **Bot blocked by user**
   - ❌ Problem: User blocked the bot
   - ✅ Solution: User must unblock bot in Telegram
   - 🔍 Detection: API returns "Forbidden: bot was blocked by the user"

4. **Privacy settings**
   - ❌ Problem: Bot can't message user due to privacy
   - ✅ Solution: User must initiate conversation or join group with bot

#### ❌ "Rate Limited" Errors

**Symptoms:**
- "Too Many Requests" errors
- Messages delayed or failed
- API returns 429 error code

**Solutions:**
1. ✅ **Reduce frequency**: Space out notifications
2. ✅ **Batch processing**: Group multiple updates
3. ✅ **Respect limits**: 30 messages per second to different users
4. ✅ **Use retry logic**: Built-in retry handles rate limiting

**Monitor rate limits:**
```javascript
function checkRateLimit() {
  // Send multiple test messages to check limits
  const config = getConfiguration();
  const testChatId = "YOUR_TEST_CHAT_ID";
  
  for (let i = 0; i < 5; i++) {
    const result = sendTelegramMessage(config.botApiToken, testChatId, `Test ${i}`);
    console.log(`Message ${i}:`, result);
    Utilities.sleep(1000); // Wait 1 second between messages
  }
}
```

### Trigger Issues

#### ❌ Notifications Not Triggering

**Symptoms:**
- Edit spreadsheet but no notification
- Trigger exists but function doesn't run
- No execution logs

**Debugging Steps:**

1. **Check trigger configuration**
   ```javascript
   function listTriggers() {
     const triggers = ScriptApp.getProjectTriggers();
     triggers.forEach(trigger => {
       console.log("Trigger:", trigger.getHandlerFunction(), 
                   "Event:", trigger.getEventType());
     });
   }
   ```

2. **Verify trigger permissions**
   - ✅ Go to Apps Script → Triggers
   - ✅ Check if trigger is enabled
   - ✅ Verify trigger points to correct function

3. **Test manual execution**
   ```javascript
   function testManualTrigger() {
     // Simulate edit event
     const mockEvent = {
       range: SpreadsheetApp.getActiveSheet().getRange(2, 1) // Row 2, Column 1
     };
     sendTelegramNotification(mockEvent);
   }
   ```

#### ❌ Trigger Firing Too Often

**Symptoms:**
- Multiple notifications for single edit
- Notifications on every cell change
- Performance issues

**Solutions:**
1. ✅ **Check edit location**: Only respond to Status column edits
2. ✅ **Add conditions**: Filter by specific column or row
3. ✅ **Debounce logic**: Prevent multiple rapid triggers

**Improved trigger logic:**
```javascript
function sendTelegramNotification(e) {
  // Only trigger on Status column edits
  const statusColumnIndex = getStatusColumnIndex();
  if (e.range.getColumn() !== statusColumnIndex + 1) {
    Logger.log("Edit not in Status column, skipping");
    return;
  }
  
  // Continue with notification logic...
}
```

### Performance Issues

#### ❌ Script Timeout Errors

**Symptoms:**
- "Maximum execution time exceeded"
- Script stops mid-execution
- Partial processing of data

**Solutions:**
1. ✅ **Batch processing**: Process data in smaller chunks
2. ✅ **Optimize queries**: Reduce API calls
3. ✅ **Cache data**: Store frequently accessed data
4. ✅ **Async processing**: Use time-based triggers for heavy tasks

#### ❌ Slow Execution

**Symptoms:**
- Long delays before notifications
- Poor user experience
- Frequent timeouts

**Optimization techniques:**
```javascript
function optimizedNotification() {
  // Cache configuration
  const config = getConfigurationCached();
  
  // Batch sheet operations
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.formResponsesSheetName);
  const data = sheet.getDataRange().getValues();
  
  // Process multiple rows efficiently
  // ... optimized logic
}
```

### Error Handling Issues

#### ❌ Silent Failures

**Symptoms:**
- No error logs but notifications fail
- Inconsistent behavior
- Hard to debug issues

**Add comprehensive logging:**
```javascript
function enhancedSendNotification(e) {
  try {
    Logger.log("=== NOTIFICATION START ===");
    Logger.log("Event details:", JSON.stringify(e));
    
    // Your notification logic here
    
    Logger.log("=== NOTIFICATION SUCCESS ===");
  } catch (error) {
    Logger.log("=== NOTIFICATION ERROR ===");
    Logger.log("Error:", error.toString());
    Logger.log("Stack:", error.stack);
    
    // Send error notification to admin
    sendErrorAlert(error, e);
  }
}
```

### Security Issues

#### ❌ Token Exposure

**Symptoms:**
- Token visible in logs
- Security warnings
- Unauthorized access

**Solutions:**
1. ✅ **Use Properties Service**: Store tokens securely
2. ✅ **Redact logs**: Don't log sensitive data
3. ✅ **Regular rotation**: Change tokens periodically

**Secure token storage:**
```javascript
function secureTokenStorage() {
  // Store token securely
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('BOT_TOKEN', 'your_token_here');
  
  // Retrieve token securely
  const token = properties.getProperty('BOT_TOKEN');
  return token;
}
```

## Diagnostic Tools

### System Health Check

Run comprehensive diagnostics:
```javascript
function fullSystemDiagnostic() {
  console.log("🔍 Running full system diagnostic...");
  
  // 1. Configuration check
  const configResult = testConfiguration();
  console.log("Configuration:", configResult.status);
  
  // 2. Sheet structure check
  const sheetResult = testSheetStructure();
  console.log("Sheet Structure:", sheetResult.status);
  
  // 3. Bot token check
  const botResult = testBotToken();
  console.log("Bot Token:", botResult.status);
  
  // 4. Message generation check
  const messageResult = testMessageGeneration();
  console.log("Message Generation:", messageResult.status);
  
  // 5. Trigger check
  const triggerResult = testTriggers();
  console.log("Triggers:", triggerResult.status);
  
  console.log("🎯 Diagnostic complete");
}
```

### Debug Mode

Enable detailed debugging:
```javascript
const DEBUG_MODE = true;

function debugLog(message, data) {
  if (DEBUG_MODE) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
}

function sendTelegramNotificationDebug(e) {
  debugLog("Function started", e);
  
  const config = getConfiguration();
  debugLog("Configuration loaded", config);
  
  // ... rest of function with debug statements
}
```

### Performance Monitoring

Track execution performance:
```javascript
function performanceMonitor() {
  const startTime = Date.now();
  
  // Your function logic here
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  console.log(`Execution time: ${duration}ms`);
  
  if (duration > 5000) {
    console.log("⚠️ Slow execution detected");
  }
}
```

## Error Codes Reference

### Telegram API Errors

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check message format and parameters |
| 401 | Unauthorized | Verify bot token |
| 403 | Forbidden | User blocked bot or privacy settings |
| 404 | Not Found | Chat doesn't exist or bot not in group |
| 429 | Too Many Requests | Implement rate limiting |
| 500 | Internal Server Error | Retry after delay |

### Apps Script Errors

| Error | Description | Solution |
|-------|-------------|----------|
| ReferenceError | Variable not defined | Check variable names and scope |
| TypeError | Wrong data type | Validate input data types |
| Maximum execution time | Script timeout | Optimize or split into smaller functions |
| Insufficient permissions | Access denied | Review and update script permissions |

## Getting Help

### Before Seeking Help

1. ✅ **Check execution logs** in Apps Script
2. ✅ **Run system health check** function
3. ✅ **Test individual components** (bot token, sheet access, etc.)
4. ✅ **Review this troubleshooting guide**
5. ✅ **Search existing GitHub issues**

### Creating Effective Bug Reports

Include this information:
- **Error message** (exact text)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Apps Script execution logs**
- **System health check results**
- **Browser and Apps Script version**

### Emergency Recovery

If system is completely broken:

1. **Backup current script**
2. **Revert to last working version**
3. **Test with minimal configuration**
4. **Gradually restore features**
5. **Document what caused the issue**

## Prevention Tips

### Regular Maintenance

1. **Weekly log review**
2. **Monthly health checks**
3. **Quarterly token rotation**
4. **Semi-annual backup**

### Best Practices

1. **Test changes in development environment first**
2. **Monitor execution quotas**
3. **Keep documentation updated**
4. **Train users on proper usage**
5. **Have rollback plan ready**