/**
 * Web Interface for Telegram Sheets Notification System
 * Future enhancement: HTML service for configuration and monitoring
 * @author bhqmuhammad
 * @version 2.0
 */

// ================================
// WEB INTERFACE FUNCTIONS
// ================================

/**
 * Creates a web-based configuration interface
 * @returns {HtmlOutput} HTML interface for configuration
 */
function createConfigurationInterface() {
  const htmlTemplate = HtmlService.createTemplateFromFile('web-interface/html/config');
  
  // Pass current configuration to template
  const config = getExtendedConfiguration() || getConfiguration();
  htmlTemplate.config = config;
  htmlTemplate.validation = validateSystemConfiguration();
  
  const htmlOutput = htmlTemplate.evaluate()
    .setTitle('Telegram Notification Configuration')
    .setWidth(800)
    .setHeight(600);
    
  return htmlOutput;
}

/**
 * Creates a system monitoring dashboard
 * @returns {HtmlOutput} HTML dashboard for monitoring
 */
function createMonitoringDashboard() {
  const htmlTemplate = HtmlService.createTemplateFromFile('web-interface/html/dashboard');
  
  // Get system statistics
  const stats = getSystemStatistics();
  htmlTemplate.stats = stats;
  
  const htmlOutput = htmlTemplate.evaluate()
    .setTitle('System Monitoring Dashboard')
    .setWidth(1000)
    .setHeight(700);
    
  return htmlOutput;
}

/**
 * Processes configuration updates from web interface
 * @param {Object} formData - Configuration data from form
 * @returns {Object} Update result
 */
function updateConfigurationFromWeb(formData) {
  try {
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      return { success: false, error: 'Settings sheet not found' };
    }

    // Update basic settings
    settingsSheet.getRange('B1').setValue(formData.botToken);
    settingsSheet.getRange('B2').setValue(formData.formSheetName);
    settingsSheet.getRange('B3').setValue(formData.customTitle);
    settingsSheet.getRange('B4').setValue(formData.excludedColumns);
    settingsSheet.getRange('B5').setValue(formData.triggerStatus);

    // Update advanced settings
    if (formData.messageTemplate) {
      settingsSheet.getRange('B6').setValue(formData.messageTemplate);
    }
    if (formData.enableRetry !== undefined) {
      settingsSheet.getRange('B7').setValue(formData.enableRetry);
    }
    if (formData.maxRetries) {
      settingsSheet.getRange('B8').setValue(formData.maxRetries);
    }

    return { success: true, message: 'Configuration updated successfully' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Gets system statistics for dashboard
 * @returns {Object} System statistics
 */
function getSystemStatistics() {
  try {
    const stats = {
      timestamp: new Date(),
      configuration: {
        isValid: false,
        errors: [],
        warnings: []
      },
      execution: {
        recentExecutions: [],
        errorCount: 0,
        successCount: 0
      },
      performance: {
        averageExecutionTime: 0,
        lastExecutionTime: 0
      },
      telegram: {
        botStatus: 'unknown',
        botInfo: null
      }
    };

    // Get configuration status
    const configValidation = validateSystemConfiguration();
    stats.configuration = configValidation;

    // Get recent executions (mock data for now)
    stats.execution.recentExecutions = getRecentExecutions();
    
    // Calculate performance metrics
    stats.performance = calculatePerformanceMetrics();

    // Test bot status
    const botTest = testBotToken();
    stats.telegram.botStatus = botTest.status === 'PASS' ? 'active' : 'error';

    return stats;
  } catch (error) {
    Logger.log('Error getting system statistics: ' + error.toString());
    return {
      timestamp: new Date(),
      error: error.toString()
    };
  }
}

/**
 * Gets recent execution data
 * @returns {Array} Recent execution information
 */
function getRecentExecutions() {
  // In a real implementation, this would query Apps Script execution logs
  // For now, return mock data
  return [
    { timestamp: new Date(Date.now() - 300000), status: 'success', duration: 1200 },
    { timestamp: new Date(Date.now() - 600000), status: 'success', duration: 980 },
    { timestamp: new Date(Date.now() - 900000), status: 'error', duration: 2300, error: 'Rate limited' },
    { timestamp: new Date(Date.now() - 1200000), status: 'success', duration: 1100 },
    { timestamp: new Date(Date.now() - 1500000), status: 'success', duration: 890 }
  ];
}

/**
 * Calculates performance metrics
 * @returns {Object} Performance data
 */
function calculatePerformanceMetrics() {
  const executions = getRecentExecutions();
  const successfulExecutions = executions.filter(exec => exec.status === 'success');
  
  if (successfulExecutions.length === 0) {
    return {
      averageExecutionTime: 0,
      lastExecutionTime: 0,
      successRate: 0
    };
  }

  const totalTime = successfulExecutions.reduce((sum, exec) => sum + exec.duration, 0);
  const averageTime = totalTime / successfulExecutions.length;
  const lastExecution = executions[0];
  const successRate = (successfulExecutions.length / executions.length) * 100;

  return {
    averageExecutionTime: Math.round(averageTime),
    lastExecutionTime: lastExecution ? lastExecution.duration : 0,
    successRate: Math.round(successRate)
  };
}

/**
 * Handles AJAX requests from web interface
 * @param {string} action - Action to perform
 * @param {Object} data - Request data
 * @returns {Object} Response data
 */
function handleWebRequest(action, data) {
  switch (action) {
    case 'testBot':
      return testBotToken();
    
    case 'sendTestNotification':
      if (!data.chatId) {
        return { success: false, error: 'Chat ID required' };
      }
      return sendTestNotification(data.chatId, data.message);
    
    case 'runHealthCheck':
      return runSystemHealthCheck();
    
    case 'validateConfiguration':
      return validateSystemConfiguration();
    
    case 'getSystemStats':
      return getSystemStatistics();
    
    default:
      return { success: false, error: 'Unknown action: ' + action };
  }
}

/**
 * Includes external files for HTML templates
 * @param {string} filename - File to include
 * @returns {string} File content
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Opens the configuration interface in a new window
 */
function openConfigurationInterface() {
  const html = createConfigurationInterface();
  SpreadsheetApp.getUi().showModalDialog(html, 'Telegram Notification Configuration');
}

/**
 * Opens the monitoring dashboard in a new window
 */
function openMonitoringDashboard() {
  const html = createMonitoringDashboard();
  SpreadsheetApp.getUi().showModalDialog(html, 'System Monitoring Dashboard');
}

/**
 * Creates menu items in Google Sheets for easy access
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Telegram Notifications')
    .addItem('Open Configuration', 'openConfigurationInterface')
    .addItem('Monitoring Dashboard', 'openMonitoringDashboard')
    .addSeparator()
    .addItem('Run Health Check', 'runSystemHealthCheck')
    .addItem('Send Test Notification', 'promptForTestNotification')
    .addSeparator()
    .addItem('Create Settings Template', 'createAdvancedSettingsTemplate')
    .addToUi();
}

/**
 * Prompts user for test notification details
 */
function promptForTestNotification() {
  const ui = SpreadsheetApp.getUi();
  
  const chatIdResponse = ui.prompt(
    'Test Notification',
    'Enter your Telegram Chat ID:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (chatIdResponse.getSelectedButton() === ui.Button.OK) {
    const chatId = chatIdResponse.getResponseText();
    if (chatId) {
      const result = sendTestNotification(chatId);
      if (result.success) {
        ui.alert('Success', 'Test notification sent successfully!', ui.ButtonSet.OK);
      } else {
        ui.alert('Error', 'Failed to send test notification: ' + result.message, ui.ButtonSet.OK);
      }
    }
  }
}