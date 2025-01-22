/**
 * Sends a notification to Telegram when a form response is updated
 * Configuration is stored in a settings sheet
 * @param {Object} e - The event object from the trigger
 */
function sendTelegramNotification(e) {
  Logger.log("sendTelegramNotification triggered");

  // Get configuration from settings sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Telegram Bot Settings');
  var botApiToken = sheet.getRange('B1').getValue();
  var formResponsesSheetName = sheet.getRange('B2').getValue();
  var customTitle = sheet.getRange('B3').getValue();
  var excludedColumns = sheet.getRange('B4').getValue().split(',').map(item => item.trim());

  Logger.log("Bot API Token: " + botApiToken);
  Logger.log("Form Responses Sheet Name: " + formResponsesSheetName);
  Logger.log("Custom Title: " + customTitle);
  Logger.log("Excluded Columns: " + excludedColumns);

  // Validate settings
  if (!botApiToken || !formResponsesSheetName || !customTitle) {
    Logger.log("One or more required settings are missing.");
    return;
  }

  // Get form responses sheet
  var responsesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(formResponsesSheetName);
  if (!responsesSheet) {
    Logger.log("Form responses sheet not found.");
    return;
  }

  // Get headers and find required columns
  var headers = responsesSheet.getRange(1, 1, 1, responsesSheet.getLastColumn()).getValues()[0];
  Logger.log("Headers: " + headers);

  var statusColumnIndex = headers.indexOf("Status");
  var telegramIdColumnIndex = headers.indexOf("Telegram ID");
  
  Logger.log("Status Column Index: " + statusColumnIndex);
  Logger.log("Telegram ID Column Index: " + telegramIdColumnIndex);

  if (statusColumnIndex === -1 || telegramIdColumnIndex === -1) {
    Logger.log("Required columns not found.");
    return;
  }

  // Get edited row
  var editedRow = e.range.getRow();
  Logger.log("Edited Row: " + editedRow);

  // Get status value from edited row
  var statusValue = responsesSheet.getRange(editedRow, statusColumnIndex + 1).getValue().toString().trim();
  Logger.log("Status value: " + statusValue);

  // Check if status matches trigger condition (configurable)
  var triggerStatus = sheet.getRange('B5').getValue() || "COMPLETED"; // Default trigger status
  if (statusValue !== triggerStatus) {
    Logger.log("Status does not match trigger condition. No notification will be sent.");
    return;
  }

  // Escape special characters for Markdown
  function escapeMarkdown(text) {
    if (typeof text !== 'string') {
      text = String(text);
    }
    return text.replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
  }

  // Construct message
  var message = '*' + customTitle + '*\n';
  var scriptTimestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  message += '*Timestamp*: ' + scriptTimestamp + '\n\n';

  // Add form response data
  var latestResponse = responsesSheet.getRange(editedRow, 1, 1, responsesSheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (!excludedColumns.includes(headers[i])) {
      if (latestResponse[i] && latestResponse[i] !== '') {
        if (headers[i] === 'Timestamp') {
          var formattedTimestamp = Utilities.formatDate(new Date(latestResponse[i]), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
          message += '*' + escapeMarkdown(headers[i]) + '*: ' + formattedTimestamp + '\n';
        } else {
          message += '*' + escapeMarkdown(headers[i]) + '*: ' + escapeMarkdown(latestResponse[i].toString()) + '\n';
        }
      }
    }
  }

  Logger.log("Message to send: " + message);

  // Send Telegram message
  var chatId = latestResponse[telegramIdColumnIndex];
  var url = 'https://api.telegram.org/bot' + botApiToken + '/sendMessage';
  var payload = {
    'chat_id': chatId,
    'text': message,
    'parse_mode': 'Markdown'
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseData = JSON.parse(response.getContentText());
    Logger.log("Response data: " + JSON.stringify(responseData));

    // Handle chat migration
    if (responseData.error_code === 400 && responseData.parameters && responseData.parameters.migrate_to_chat_id) {
      chatId = responseData.parameters.migrate_to_chat_id;
      payload.chat_id = chatId;
      options.payload = JSON.stringify(payload);
      
      response = UrlFetchApp.fetch(url, options);
      responseData = JSON.parse(response.getContentText());
      Logger.log("Response data after migration: " + JSON.stringify(responseData));
    }
  } catch (error) {
    Logger.log("Error: " + error.toString());
  }
}
