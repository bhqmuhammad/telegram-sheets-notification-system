/**
 * Configuration Management and Validation Utilities
 * Handles advanced configuration options and validation
 * @author bhqmuhammad
 * @version 2.0
 */

// ================================
// ADVANCED CONFIGURATION
// ================================

/**
 * Extended configuration object with advanced options
 * @typedef {Object} ExtendedConfig
 * @property {string} botApiToken - Telegram bot token
 * @property {string} formResponsesSheetName - Name of data sheet
 * @property {string} customTitle - Message title
 * @property {Array} excludedColumns - Columns to exclude
 * @property {string} triggerStatus - Status that triggers notification
 * @property {string} messageTemplate - Template type to use
 * @property {Object} templateOptions - Options for message templates
 * @property {boolean} enableRetry - Enable retry mechanism
 * @property {number} maxRetries - Maximum retry attempts
 * @property {boolean} enableLogging - Enable detailed logging
 * @property {Array} notificationRules - Custom notification rules
 */

/**
 * Gets extended configuration with advanced options
 * @returns {ExtendedConfig|null} Extended configuration object
 */
function getExtendedConfiguration() {
  try {
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      Logger.log("ERROR: Settings sheet not found");
      return null;
    }

    // Basic configuration
    const config = {
      botApiToken: settingsSheet.getRange('B1').getValue(),
      formResponsesSheetName: settingsSheet.getRange('B2').getValue(),
      customTitle: settingsSheet.getRange('B3').getValue(),
      excludedColumns: settingsSheet.getRange('B4').getValue().toString().split(',').map(item => item.trim()),
      triggerStatus: settingsSheet.getRange('B5').getValue() || DEFAULT_TRIGGER_STATUS
    };

    // Advanced options (optional)
    config.messageTemplate = getOptionalSetting(settingsSheet, 'B6', 'DEFAULT');
    config.enableRetry = getOptionalSetting(settingsSheet, 'B7', true);
    config.maxRetries = getOptionalSetting(settingsSheet, 'B8', MAX_RETRY_ATTEMPTS);
    config.enableLogging = getOptionalSetting(settingsSheet, 'B9', true);
    
    // Template options
    config.templateOptions = {
      companyName: getOptionalSetting(settingsSheet, 'B10', ''),
      importantFields: getOptionalSetting(settingsSheet, 'B11', 'Status,Name,Email').split(',').map(f => f.trim()),
      essentialFields: getOptionalSetting(settingsSheet, 'B12', 'Status,Name').split(',').map(f => f.trim())
    };

    return config;
  } catch (error) {
    Logger.log("ERROR: Failed to get extended configuration: " + error.toString());
    return null;
  }
}

/**
 * Gets an optional setting value with fallback
 * @param {Sheet} sheet - Settings sheet
 * @param {string} range - Cell range to read
 * @param {*} defaultValue - Default value if setting is empty
 * @returns {*} Setting value or default
 */
function getOptionalSetting(sheet, range, defaultValue) {
  try {
    const value = sheet.getRange(range).getValue();
    return (value !== null && value !== undefined && value !== '') ? value : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Creates a settings template sheet with all available options
 */
function createAdvancedSettingsTemplate() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Check if template sheet already exists
    let templateSheet = spreadsheet.getSheetByName('Settings Template');
    if (templateSheet) {
      Logger.log("Settings template sheet already exists");
      return;
    }

    // Create new template sheet
    templateSheet = spreadsheet.insertSheet('Settings Template');
    
    // Headers
    templateSheet.getRange('A1').setValue('Setting');
    templateSheet.getRange('B1').setValue('Value');
    templateSheet.getRange('C1').setValue('Description');
    
    // Basic settings
    const settings = [
      ['Bot Token', '', 'Your Telegram bot API token from @BotFather'],
      ['Form Sheet Name', '', 'Name of the sheet containing your data'],
      ['Custom Title', '', 'Title for notification messages'],
      ['Excluded Columns', '', 'Comma-separated list of columns to exclude'],
      ['Trigger Status', 'COMPLETED', 'Status value that triggers notifications'],
      
      // Advanced settings
      ['Message Template', 'DEFAULT', 'Template type: DEFAULT, MINIMAL, DETAILED, COMPACT, PROFESSIONAL'],
      ['Enable Retry', 'TRUE', 'Enable automatic retry for failed messages'],
      ['Max Retries', '3', 'Maximum number of retry attempts'],
      ['Enable Logging', 'TRUE', 'Enable detailed logging'],
      ['Company Name', '', 'Company name for professional template'],
      ['Important Fields', 'Status,Name,Email', 'Fields to include in minimal template'],
      ['Essential Fields', 'Status,Name', 'Fields to include in compact template']
    ];

    // Add settings to sheet
    for (let i = 0; i < settings.length; i++) {
      const row = i + 2;
      templateSheet.getRange('A' + row).setValue(settings[i][0]);
      templateSheet.getRange('B' + row).setValue(settings[i][1]);
      templateSheet.getRange('C' + row).setValue(settings[i][2]);
    }

    // Format the sheet
    templateSheet.getRange('A1:C1').setFontWeight('bold');
    templateSheet.getRange('A1:C' + (settings.length + 1)).setBorder(true, true, true, true, true, true);
    templateSheet.autoResizeColumns(1, 3);

    Logger.log("Advanced settings template created successfully");
    
  } catch (error) {
    Logger.log("ERROR: Failed to create settings template: " + error.toString());
  }
}

/**
 * Validates extended configuration
 * @param {ExtendedConfig} config - Configuration to validate
 * @returns {Object} Validation result
 */
function validateExtendedConfiguration(config) {
  const result = { isValid: true, errors: [], warnings: [] };
  
  // Basic validation
  const basicErrors = validateConfiguration(config);
  result.errors.push(...basicErrors);
  
  // Advanced validation
  if (config.messageTemplate && !Object.values(MESSAGE_TEMPLATES).includes(config.messageTemplate)) {
    result.warnings.push("Unknown message template: " + config.messageTemplate + ". Using DEFAULT.");
  }
  
  if (config.maxRetries && (config.maxRetries < 1 || config.maxRetries > 10)) {
    result.warnings.push("Max retries should be between 1 and 10. Current value: " + config.maxRetries);
  }
  
  if (config.templateOptions.importantFields.length === 0) {
    result.warnings.push("No important fields specified for minimal template");
  }
  
  if (result.errors.length > 0) {
    result.isValid = false;
  }
  
  return result;
}

/**
 * Creates notification rules for conditional messaging
 * @typedef {Object} NotificationRule
 * @property {string} condition - Condition to check (field name)
 * @property {string} operator - Comparison operator (equals, contains, etc.)
 * @property {string} value - Value to compare against
 * @property {string} template - Template to use if condition matches
 * @property {Object} templateOptions - Options for the template
 */

/**
 * Evaluates notification rules and returns appropriate template
 * @param {Array} rules - Array of notification rules
 * @param {Array} headers - Column headers
 * @param {Array} rowData - Row data
 * @returns {Object} Template information
 */
function evaluateNotificationRules(rules, headers, rowData) {
  for (const rule of rules) {
    const fieldIndex = headers.indexOf(rule.condition);
    if (fieldIndex === -1) continue;
    
    const fieldValue = rowData[fieldIndex]?.toString() || '';
    let matches = false;
    
    switch (rule.operator) {
      case 'equals':
        matches = fieldValue === rule.value;
        break;
      case 'contains':
        matches = fieldValue.includes(rule.value);
        break;
      case 'starts_with':
        matches = fieldValue.startsWith(rule.value);
        break;
      case 'not_equals':
        matches = fieldValue !== rule.value;
        break;
      default:
        matches = false;
    }
    
    if (matches) {
      return {
        template: rule.template,
        options: rule.templateOptions || {}
      };
    }
  }
  
  // Return default if no rules match
  return { template: 'DEFAULT', options: {} };
}

/**
 * Example notification rules configuration
 */
const EXAMPLE_NOTIFICATION_RULES = [
  {
    condition: 'Priority',
    operator: 'equals',
    value: 'High',
    template: 'DETAILED',
    templateOptions: { companyName: 'Urgent Notifications' }
  },
  {
    condition: 'Status',
    operator: 'equals', 
    value: 'Approved',
    template: 'PROFESSIONAL',
    templateOptions: { companyName: 'Approval System' }
  },
  {
    condition: 'Type',
    operator: 'contains',
    value: 'Internal',
    template: 'MINIMAL',
    templateOptions: { importantFields: ['Status', 'Assignee'] }
  }
];

/**
 * Migrates old configuration to new extended format
 */
function migrateToExtendedConfiguration() {
  try {
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      Logger.log("ERROR: Settings sheet not found for migration");
      return;
    }

    // Check if migration is needed (if advanced settings don't exist)
    const templateSetting = getOptionalSetting(settingsSheet, 'B6', null);
    if (templateSetting !== null) {
      Logger.log("Configuration already migrated");
      return;
    }

    // Add headers for new settings
    settingsSheet.getRange('A6').setValue('Message Template');
    settingsSheet.getRange('B6').setValue('DEFAULT');
    
    settingsSheet.getRange('A7').setValue('Enable Retry');
    settingsSheet.getRange('B7').setValue('TRUE');
    
    settingsSheet.getRange('A8').setValue('Max Retries');
    settingsSheet.getRange('B8').setValue('3');
    
    settingsSheet.getRange('A9').setValue('Enable Logging');
    settingsSheet.getRange('B9').setValue('TRUE');

    Logger.log("Configuration migrated to extended format");
    
  } catch (error) {
    Logger.log("ERROR: Failed to migrate configuration: " + error.toString());
  }
}