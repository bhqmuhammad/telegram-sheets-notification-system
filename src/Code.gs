// ================================
// CONFIGURATION CONSTANTS
// ================================

/** Name of the settings sheet containing bot configuration */
const SETTINGS_SHEET_NAME = 'Telegram Bot Settings';

/** Name of the required status column in data sheet */
const STATUS_COLUMN_NAME = 'Status';

/** Name of the required Telegram ID column in data sheet */
const TELEGRAM_ID_COLUMN_NAME = 'Telegram ID';

/** Default status value that triggers notifications */
const DEFAULT_TRIGGER_STATUS = 'COMPLETED';

/** Base URL for Telegram Bot API */
const TELEGRAM_API_BASE_URL = 'https://api.telegram.org/bot';

/** Maximum number of retry attempts for failed API calls */
const MAX_RETRY_ATTEMPTS = 3;

/** Delay between retry attempts in milliseconds */
const RETRY_DELAY_MS = 2000;

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Validates the system configuration and returns status information
 * @returns {Object} Validation result with status and details
 */
function validateSystemConfiguration() {
  const results = {
    isValid: true,
    errors: [],
    warnings: [],
    info: []
  };

  try {
    // Check if settings sheet exists
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      results.errors.push("Settings sheet '" + SETTINGS_SHEET_NAME + "' not found");
      results.isValid = false;
      return results;
    }

    // Check configuration values
    const config = getConfiguration();
    if (!config) {
      results.errors.push("Failed to load configuration");
      results.isValid = false;
      return results;
    }

    // Check if data sheet exists
    const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.formResponsesSheetName);
    if (!dataSheet) {
      results.errors.push("Data sheet '" + config.formResponsesSheetName + "' not found");
      results.isValid = false;
    } else {
      // Check sheet structure
      const sheetInfo = getSheetInfo(dataSheet);
      if (!sheetInfo.isValid) {
        results.errors.push(sheetInfo.error);
        results.isValid = false;
      } else {
        results.info.push("Found required columns: " + STATUS_COLUMN_NAME + ", " + TELEGRAM_ID_COLUMN_NAME);
      }
    }

    results.info.push("Configuration loaded successfully");
    
  } catch (error) {
    results.errors.push("System validation failed: " + error.toString());
    results.isValid = false;
  }

  return results;
}

/**
 * Test function to send a sample notification (for development/testing)
 * @param {string} testChatId - Telegram chat ID for testing
 * @param {string} testMessage - Optional custom test message
 */
function sendTestNotification(testChatId, testMessage) {
  Logger.log("=== Test Notification Function ===");
  
  if (!testChatId) {
    Logger.log("ERROR: Test chat ID is required");
    return;
  }

  const config = getConfiguration();
  if (!config) {
    Logger.log("ERROR: Failed to load configuration for test");
    return;
  }

  const message = testMessage || '*Test Notification*\n' +
    '*Generated*: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss') + '\n\n' +
    'This is a test message from your Telegram Sheets Notification System.\n' +
    'If you receive this, your bot is configured correctly!';

  const result = sendTelegramMessage(config.botApiToken, testChatId, message);
  
  if (result.success) {
    Logger.log("SUCCESS: Test notification sent successfully");
  } else {
    Logger.log("ERROR: Test notification failed: " + result.message);
  }
}

// ================================
// MAIN NOTIFICATION SYSTEM
// ================================

/**
 * Main entry point: Sends a notification to Telegram when a form response is updated
 * Configuration is stored in a settings sheet
 * @param {Object} e - The event object from the trigger
 * @author bhqmuhammad
 * @version 2.0
 */
function sendTelegramNotification(e) {
  Logger.log("=== Telegram Notification System Started ===");
  
  try {
    // Validate trigger event
    if (!e || !e.range) {
      Logger.log("ERROR: Invalid trigger event or missing range information");
      return;
    }

    // Get and validate configuration
    const config = getConfiguration();
    if (!config) {
      Logger.log("ERROR: Failed to load configuration");
      return;
    }

    // Get the edited row information
    const editedRow = e.range.getRow();
    Logger.log("Processing edit in row: " + editedRow);

    // Process the notification
    const result = processNotification(config, editedRow);
    if (result.success) {
      Logger.log("SUCCESS: Notification sent successfully");
    } else {
      Logger.log("INFO: " + result.message);
    }

  } catch (error) {
    Logger.log("ERROR: Unexpected error in sendTelegramNotification: " + error.toString());
    Logger.log("Stack trace: " + error.stack);
  }
  
  Logger.log("=== Telegram Notification System Completed ===");
}

/**
 * Retrieves and validates configuration from the settings sheet
 * @returns {Object|null} Configuration object or null if invalid
 */
function getConfiguration() {
  try {
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      Logger.log("ERROR: Settings sheet '" + SETTINGS_SHEET_NAME + "' not found");
      return null;
    }

    const config = {
      botApiToken: settingsSheet.getRange('B1').getValue(),
      formResponsesSheetName: settingsSheet.getRange('B2').getValue(), 
      customTitle: settingsSheet.getRange('B3').getValue(),
      excludedColumns: settingsSheet.getRange('B4').getValue().toString().split(',').map(item => item.trim()),
      triggerStatus: settingsSheet.getRange('B5').getValue() || DEFAULT_TRIGGER_STATUS
    };

    Logger.log("Configuration loaded:");
    Logger.log("- Form Sheet Name: " + config.formResponsesSheetName);
    Logger.log("- Custom Title: " + config.customTitle);
    Logger.log("- Excluded Columns: " + config.excludedColumns.join(', '));
    Logger.log("- Trigger Status: " + config.triggerStatus);
    Logger.log("- Bot Token: " + (config.botApiToken ? "[CONFIGURED]" : "[MISSING]"));

    // Validate required settings
    const validationErrors = validateConfiguration(config);
    if (validationErrors.length > 0) {
      Logger.log("ERROR: Configuration validation failed:");
      validationErrors.forEach(error => Logger.log("- " + error));
      return null;
    }

    return config;
  } catch (error) {
    Logger.log("ERROR: Failed to retrieve configuration: " + error.toString());
    return null;
  }

}

/**
 * Validates the configuration object
 * @param {Object} config - Configuration object
 * @returns {Array} Array of validation error messages
 */
function validateConfiguration(config) {
  const errors = [];
  
  if (!config.botApiToken || typeof config.botApiToken !== 'string' || config.botApiToken.trim() === '') {
    errors.push("Bot API Token is required and must be a non-empty string");
  }
  
  if (!config.formResponsesSheetName || typeof config.formResponsesSheetName !== 'string' || config.formResponsesSheetName.trim() === '') {
    errors.push("Form Responses Sheet Name is required and must be a non-empty string");
  }
  
  if (!config.customTitle || typeof config.customTitle !== 'string' || config.customTitle.trim() === '') {
    errors.push("Custom Title is required and must be a non-empty string");
  }
  
  if (!Array.isArray(config.excludedColumns)) {
    errors.push("Excluded Columns must be an array");
  }
  
  return errors;
}

/**
 * Processes the notification for a specific row edit
 * @param {Object} config - Configuration object
 * @param {number} editedRow - Row number that was edited
 * @returns {Object} Result object with success status and message
 */
function processNotification(config, editedRow) {
  try {
    // Get form responses sheet
    const responsesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.formResponsesSheetName);
    if (!responsesSheet) {
      return { success: false, message: "Form responses sheet '" + config.formResponsesSheetName + "' not found" };
    }

    // Get and validate sheet structure
    const sheetInfo = getSheetInfo(responsesSheet);
    if (!sheetInfo.isValid) {
      return { success: false, message: sheetInfo.error };
    }

    // Skip header row
    if (editedRow === 1) {
      return { success: false, message: "Header row edited - no notification needed" };
    }

    // Get status value from edited row
    const statusValue = responsesSheet.getRange(editedRow, sheetInfo.statusColumnIndex + 1).getValue();
    if (!statusValue) {
      return { success: false, message: "Status value is empty" };
    }

    const statusString = statusValue.toString().trim();
    Logger.log("Status value: " + statusString);

    // Check if status matches trigger condition
    if (statusString !== config.triggerStatus) {
      return { success: false, message: "Status '" + statusString + "' does not match trigger condition '" + config.triggerStatus + "'" };
    }

    // Get Telegram ID for notification
    const telegramId = responsesSheet.getRange(editedRow, sheetInfo.telegramIdColumnIndex + 1).getValue();
    if (!telegramId) {
      return { success: false, message: "Telegram ID is empty for row " + editedRow };
    }

    // Generate message
    const message = generateMessage(config, responsesSheet, editedRow, sheetInfo.headers);
    
    // Send notification
    const sendResult = sendTelegramMessage(config.botApiToken, telegramId, message);
    return sendResult;

  } catch (error) {
    Logger.log("ERROR: Failed to process notification: " + error.toString());
    return { success: false, message: "Failed to process notification: " + error.toString() };
  }
}

/**
 * Gets and validates sheet information including headers and column indices
 * @param {Sheet} sheet - Google Sheets object
 * @returns {Object} Sheet information object
 */
function getSheetInfo(sheet) {
  try {
    const lastColumn = sheet.getLastColumn();
    if (lastColumn === 0) {
      return { isValid: false, error: "Sheet is empty" };
    }

    const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    Logger.log("Headers found: " + headers.join(', '));

    const statusColumnIndex = headers.indexOf(STATUS_COLUMN_NAME);
    const telegramIdColumnIndex = headers.indexOf(TELEGRAM_ID_COLUMN_NAME);
    
    Logger.log("Status Column Index: " + statusColumnIndex);
    Logger.log("Telegram ID Column Index: " + telegramIdColumnIndex);

    if (statusColumnIndex === -1) {
      return { isValid: false, error: "Required column '" + STATUS_COLUMN_NAME + "' not found" };
    }
    
    if (telegramIdColumnIndex === -1) {
      return { isValid: false, error: "Required column '" + TELEGRAM_ID_COLUMN_NAME + "' not found" };
    }

    return {
      isValid: true,
      headers: headers,
      statusColumnIndex: statusColumnIndex,
      telegramIdColumnIndex: telegramIdColumnIndex
    };
  } catch (error) {
    return { isValid: false, error: "Failed to read sheet structure: " + error.toString() };
  }
}

/**
 * Generates a formatted message for Telegram notification
 * @param {Object} config - Configuration object  
 * @param {Sheet} sheet - Google Sheets object
 * @param {number} rowNumber - Row number to generate message for
 * @param {Array} headers - Array of column headers
 * @returns {string} Formatted message string
 */
function generateMessage(config, sheet, rowNumber, headers) {
  try {
    let message = '*' + escapeMarkdown(config.customTitle) + '*\n';
    const scriptTimestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    message += '*Generated*: ' + scriptTimestamp + '\n\n';

    // Get row data
    const rowData = sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Add form response data
    for (let i = 0; i < headers.length; i++) {
      const columnName = headers[i];
      const cellValue = rowData[i];
      
      // Skip excluded columns and empty values
      if (config.excludedColumns.includes(columnName) || !cellValue || cellValue === '') {
        continue;
      }

      // Format timestamp columns specially
      if (columnName.toLowerCase().includes('timestamp') && cellValue instanceof Date) {
        const formattedTimestamp = Utilities.formatDate(cellValue, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
        message += '*' + escapeMarkdown(columnName) + '*: ' + escapeMarkdown(formattedTimestamp) + '\n';
      } else {
        message += '*' + escapeMarkdown(columnName) + '*: ' + escapeMarkdown(cellValue.toString()) + '\n';
      }
    }

    Logger.log("Generated message preview: " + message.substring(0, 200) + "...");
    return message;
  } catch (error) {
    Logger.log("ERROR: Failed to generate message: " + error.toString());
    return "Error generating notification message";
  }
}

/**
 * Escapes special characters for Telegram Markdown formatting
 * @param {*} text - Text to escape
 * @returns {string} Escaped text safe for Markdown
 */
function escapeMarkdown(text) {
  if (text === null || text === undefined) {
    return '';
  }
  if (typeof text !== 'string') {
    text = String(text);
  }
  return text.replace(/([_*[\]()~`>#+=|{}.!-])/g, '\\$1');
}

/**
 * Sends a message to Telegram with error handling and retry logic
 * @param {string} botToken - Telegram bot API token
 * @param {string} chatId - Telegram chat ID
 * @param {string} message - Message to send
 * @returns {Object} Result object with success status and message
 */
function sendTelegramMessage(botToken, chatId, message) {
  const url = TELEGRAM_API_BASE_URL + botToken + '/sendMessage';
  const payload = {
    'chat_id': chatId,
    'text': message,
    'parse_mode': 'Markdown'
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };

  let attempts = 0;
  const maxAttempts = MAX_RETRY_ATTEMPTS;

  while (attempts < maxAttempts) {
    attempts++;
    Logger.log("Sending message attempt " + attempts + " to chat ID: " + chatId);

    try {
      const response = UrlFetchApp.fetch(url, options);
      const responseData = JSON.parse(response.getContentText());
      
      Logger.log("Telegram API response: " + JSON.stringify(responseData));

      if (responseData.ok) {
        return { success: true, message: "Message sent successfully" };
      }

      // Handle specific error cases
      if (responseData.error_code) {
        const result = handleTelegramError(responseData, payload, options, url);
        if (result.handled) {
          if (result.success) {
            return { success: true, message: "Message sent after handling error" };
          } else {
            return { success: false, message: result.message };
          }
        }
      }

      // If not a specific handled error, log and potentially retry
      Logger.log("ERROR: Telegram API error (attempt " + attempts + "): " + responseData.description);
      
      if (attempts >= maxAttempts) {
        return { success: false, message: "Failed after " + maxAttempts + " attempts: " + responseData.description };
      }

      // Wait before retry
      Utilities.sleep(RETRY_DELAY_MS);

    } catch (error) {
      Logger.log("ERROR: Network error sending message (attempt " + attempts + "): " + error.toString());
      
      if (attempts >= maxAttempts) {
        return { success: false, message: "Network error after " + maxAttempts + " attempts: " + error.toString() };
      }

      // Wait before retry
      Utilities.sleep(RETRY_DELAY_MS);
    }
  }

  return { success: false, message: "Unexpected error in retry loop" };
}

/**
 * Handles specific Telegram API errors
 * @param {Object} responseData - Telegram API response data
 * @param {Object} payload - Original message payload
 * @param {Object} options - Fetch options
 * @param {string} url - Telegram API URL
 * @returns {Object} Result object indicating if error was handled
 */
function handleTelegramError(responseData, payload, options, url) {
  // Handle chat migration
  if (responseData.error_code === 400 && responseData.parameters && responseData.parameters.migrate_to_chat_id) {
    Logger.log("Handling chat migration to: " + responseData.parameters.migrate_to_chat_id);
    
    try {
      payload.chat_id = responseData.parameters.migrate_to_chat_id;
      options.payload = JSON.stringify(payload);
      
      const migratedResponse = UrlFetchApp.fetch(url, options);
      const migratedData = JSON.parse(migratedResponse.getContentText());
      
      if (migratedData.ok) {
        Logger.log("Message sent successfully after chat migration");
        return { handled: true, success: true };
      } else {
        Logger.log("Failed to send message after migration: " + migratedData.description);
        return { handled: true, success: false, message: "Failed after migration: " + migratedData.description };
      }
    } catch (error) {
      Logger.log("ERROR: Failed to handle chat migration: " + error.toString());
      return { handled: true, success: false, message: "Migration failed: " + error.toString() };
    }
  }

  // Handle rate limiting
  if (responseData.error_code === 429) {
    const retryAfter = responseData.parameters?.retry_after || RETRY_DELAY_MS / 1000;
    Logger.log("Rate limited. Suggested retry after: " + retryAfter + " seconds");
    return { handled: true, success: false, message: "Rate limited. Retry after " + retryAfter + " seconds" };
  }

  // Handle blocked bot
  if (responseData.error_code === 403) {
    Logger.log("Bot was blocked by user or chat not found");
    return { handled: true, success: false, message: "Bot blocked by user or chat not accessible" };
  }

  return { handled: false };
}
