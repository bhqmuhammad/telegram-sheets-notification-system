/**
 * Development and Testing Utilities
 * Helper functions for development, testing, and debugging
 * @author bhqmuhammad  
 * @version 2.0
 */

// ================================
// TESTING UTILITIES
// ================================

/**
 * Comprehensive system health check
 * Tests all aspects of the notification system
 */
function runSystemHealthCheck() {
  Logger.log("=== SYSTEM HEALTH CHECK ===");
  
  const results = {
    timestamp: new Date(),
    tests: [],
    overallStatus: 'PASS',
    summary: {}
  };

  // Test 1: Configuration validation
  Logger.log("1. Testing configuration...");
  const configTest = testConfiguration();
  results.tests.push(configTest);
  
  // Test 2: Sheet structure validation
  Logger.log("2. Testing sheet structure...");
  const sheetTest = testSheetStructure();
  results.tests.push(sheetTest);
  
  // Test 3: Bot token validation (without sending message)
  Logger.log("3. Testing bot token...");
  const botTest = testBotToken();
  results.tests.push(botTest);
  
  // Test 4: Message generation
  Logger.log("4. Testing message generation...");
  const messageTest = testMessageGeneration();
  results.tests.push(messageTest);
  
  // Calculate summary
  results.summary = calculateTestSummary(results.tests);
  results.overallStatus = results.summary.failures > 0 ? 'FAIL' : 'PASS';
  
  // Log results
  logHealthCheckResults(results);
  
  return results;
}

/**
 * Tests configuration loading and validation
 */
function testConfiguration() {
  const test = { name: 'Configuration Test', status: 'PASS', details: [], errors: [] };
  
  try {
    const config = getConfiguration();
    if (!config) {
      test.status = 'FAIL';
      test.errors.push('Failed to load configuration');
      return test;
    }
    
    test.details.push('✓ Configuration loaded successfully');
    
    const validation = validateConfiguration(config);
    if (validation.length > 0) {
      test.status = 'FAIL';
      test.errors.push(...validation);
    } else {
      test.details.push('✓ Configuration validation passed');
    }
    
    // Test extended configuration if available
    const extendedConfig = getExtendedConfiguration();
    if (extendedConfig) {
      test.details.push('✓ Extended configuration available');
    }
    
  } catch (error) {
    test.status = 'FAIL';
    test.errors.push('Configuration test failed: ' + error.toString());
  }
  
  return test;
}

/**
 * Tests sheet structure and column mapping
 */
function testSheetStructure() {
  const test = { name: 'Sheet Structure Test', status: 'PASS', details: [], errors: [] };
  
  try {
    const config = getConfiguration();
    if (!config) {
      test.status = 'FAIL';
      test.errors.push('Cannot test sheets without configuration');
      return test;
    }
    
    // Test settings sheet
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET_NAME);
    if (!settingsSheet) {
      test.status = 'FAIL';
      test.errors.push('Settings sheet not found: ' + SETTINGS_SHEET_NAME);
    } else {
      test.details.push('✓ Settings sheet found');
    }
    
    // Test data sheet
    const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.formResponsesSheetName);
    if (!dataSheet) {
      test.status = 'FAIL';
      test.errors.push('Data sheet not found: ' + config.formResponsesSheetName);
      return test;
    }
    
    test.details.push('✓ Data sheet found');
    
    // Test sheet structure
    const sheetInfo = getSheetInfo(dataSheet);
    if (!sheetInfo.isValid) {
      test.status = 'FAIL';
      test.errors.push(sheetInfo.error);
    } else {
      test.details.push('✓ Required columns found: ' + STATUS_COLUMN_NAME + ', ' + TELEGRAM_ID_COLUMN_NAME);
      test.details.push('✓ Total columns: ' + sheetInfo.headers.length);
    }
    
  } catch (error) {
    test.status = 'FAIL';
    test.errors.push('Sheet structure test failed: ' + error.toString());
  }
  
  return test;
}

/**
 * Tests bot token validity (without sending messages)
 */
function testBotToken() {
  const test = { name: 'Bot Token Test', status: 'PASS', details: [], errors: [] };
  
  try {
    const config = getConfiguration();
    if (!config || !config.botApiToken) {
      test.status = 'FAIL';
      test.errors.push('Bot token not configured');
      return test;
    }
    
    // Test bot token format
    if (!config.botApiToken.match(/^\d+:[A-Za-z0-9_-]{35}$/)) {
      test.status = 'FAIL';
      test.errors.push('Bot token format appears invalid');
      return test;
    }
    
    test.details.push('✓ Bot token format is valid');
    
    // Test bot info API call
    const url = TELEGRAM_API_BASE_URL + config.botApiToken + '/getMe';
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const data = JSON.parse(response.getContentText());
    
    if (data.ok) {
      test.details.push('✓ Bot token is valid');
      test.details.push('✓ Bot name: ' + data.result.first_name);
      test.details.push('✓ Bot username: @' + data.result.username);
    } else {
      test.status = 'FAIL';
      test.errors.push('Bot token is invalid: ' + data.description);
    }
    
  } catch (error) {
    test.status = 'FAIL';
    test.errors.push('Bot token test failed: ' + error.toString());
  }
  
  return test;
}

/**
 * Tests message generation with sample data
 */
function testMessageGeneration() {
  const test = { name: 'Message Generation Test', status: 'PASS', details: [], errors: [] };
  
  try {
    const config = getConfiguration();
    if (!config) {
      test.status = 'FAIL';
      test.errors.push('Cannot test message generation without configuration');
      return test;
    }
    
    // Sample data for testing
    const sampleHeaders = ['Name', 'Email', 'Status', 'Telegram ID', 'Timestamp'];
    const sampleData = ['John Doe', 'john@example.com', 'COMPLETED', '123456789', new Date()];
    
    // Test default message generation
    const message = generateMessage(config, { getRange: () => ({ getValues: () => [sampleData] }) }, 1, sampleHeaders);
    if (message && message.length > 0) {
      test.details.push('✓ Default message generated successfully');
      test.details.push('✓ Message length: ' + message.length + ' characters');
    } else {
      test.status = 'FAIL';
      test.errors.push('Failed to generate default message');
    }
    
    // Test template-based generation if available
    if (typeof generateMessageFromTemplate === 'function') {
      const templates = ['MINIMAL', 'DETAILED', 'COMPACT', 'PROFESSIONAL'];
      for (const template of templates) {
        try {
          const templateMessage = generateMessageFromTemplate(template, config, sampleHeaders, sampleData);
          if (templateMessage && templateMessage.length > 0) {
            test.details.push('✓ ' + template + ' template works');
          }
        } catch (templateError) {
          test.errors.push(template + ' template failed: ' + templateError.toString());
        }
      }
    }
    
  } catch (error) {
    test.status = 'FAIL';
    test.errors.push('Message generation test failed: ' + error.toString());
  }
  
  return test;
}

/**
 * Calculates test summary statistics
 */
function calculateTestSummary(tests) {
  const summary = {
    total: tests.length,
    passed: 0,
    failures: 0,
    details: []
  };
  
  tests.forEach(test => {
    if (test.status === 'PASS') {
      summary.passed++;
    } else {
      summary.failures++;
    }
    summary.details.push(test.name + ': ' + test.status);
  });
  
  return summary;
}

/**
 * Logs health check results in a formatted way
 */
function logHealthCheckResults(results) {
  Logger.log("=== HEALTH CHECK RESULTS ===");
  Logger.log("Timestamp: " + results.timestamp);
  Logger.log("Overall Status: " + results.overallStatus);
  Logger.log("Tests Passed: " + results.summary.passed + "/" + results.summary.total);
  
  if (results.summary.failures > 0) {
    Logger.log("⚠️ FAILURES DETECTED:");
    results.tests.forEach(test => {
      if (test.status === 'FAIL') {
        Logger.log("❌ " + test.name);
        test.errors.forEach(error => Logger.log("   - " + error));
      }
    });
  }
  
  Logger.log("📋 DETAILED RESULTS:");
  results.tests.forEach(test => {
    Logger.log("▶️ " + test.name + ": " + test.status);
    test.details.forEach(detail => Logger.log("   " + detail));
    if (test.errors.length > 0) {
      test.errors.forEach(error => Logger.log("   ❌ " + error));
    }
  });
  
  Logger.log("=== END HEALTH CHECK ===");
}

// ================================
// DEVELOPMENT UTILITIES
// ================================

/**
 * Creates sample data for testing
 */
function createSampleData() {
  Logger.log("Creating sample data for testing...");
  
  try {
    const config = getConfiguration();
    if (!config) {
      Logger.log("ERROR: Cannot create sample data without configuration");
      return;
    }
    
    const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.formResponsesSheetName);
    if (!dataSheet) {
      Logger.log("ERROR: Data sheet not found");
      return;
    }
    
    // Sample data rows
    const sampleRows = [
      ['Alice Johnson', 'alice@example.com', 'PENDING', '123456789', new Date(), 'High'],
      ['Bob Smith', 'bob@example.com', 'COMPLETED', '987654321', new Date(), 'Medium'],
      ['Carol Wilson', 'carol@example.com', 'IN_PROGRESS', '456789123', new Date(), 'Low']
    ];
    
    const lastRow = dataSheet.getLastRow();
    const lastColumn = dataSheet.getLastColumn();
    
    for (let i = 0; i < sampleRows.length; i++) {
      const row = lastRow + 1 + i;
      for (let j = 0; j < Math.min(sampleRows[i].length, lastColumn); j++) {
        dataSheet.getRange(row, j + 1).setValue(sampleRows[i][j]);
      }
    }
    
    Logger.log("Sample data created successfully");
    
  } catch (error) {
    Logger.log("ERROR: Failed to create sample data: " + error.toString());
  }
}

/**
 * Simulates a notification trigger for testing
 */
function simulateNotificationTrigger(rowNumber) {
  Logger.log("=== SIMULATING NOTIFICATION TRIGGER ===");
  
  if (!rowNumber) {
    rowNumber = 2; // Default to first data row
  }
  
  try {
    const config = getConfiguration();
    if (!config) {
      Logger.log("ERROR: Cannot simulate without configuration");
      return;
    }
    
    const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(config.formResponsesSheetName);
    if (!dataSheet) {
      Logger.log("ERROR: Data sheet not found");
      return;
    }
    
    // Create mock event object
    const mockEvent = {
      range: {
        getRow: () => rowNumber
      }
    };
    
    Logger.log("Simulating edit to row: " + rowNumber);
    
    // Call the main function
    sendTelegramNotification(mockEvent);
    
  } catch (error) {
    Logger.log("ERROR: Simulation failed: " + error.toString());
  }
}

/**
 * Performance testing function
 */
function performanceTest() {
  Logger.log("=== PERFORMANCE TEST ===");
  
  const startTime = Date.now();
  
  try {
    // Test configuration loading performance
    const configStart = Date.now();
    const config = getConfiguration();
    const configTime = Date.now() - configStart;
    Logger.log("Configuration loading: " + configTime + "ms");
    
    if (!config) {
      Logger.log("Cannot continue performance test without configuration");
      return;
    }
    
    // Test message generation performance
    const messageStart = Date.now();
    const sampleHeaders = ['Name', 'Email', 'Status', 'Telegram ID', 'Timestamp'];
    const sampleData = ['Test User', 'test@example.com', 'COMPLETED', '123456789', new Date()];
    
    for (let i = 0; i < 10; i++) {
      generateMessage(config, { getRange: () => ({ getValues: () => [sampleData] }) }, 1, sampleHeaders);
    }
    
    const messageTime = Date.now() - messageStart;
    Logger.log("10 message generations: " + messageTime + "ms (avg: " + (messageTime/10) + "ms)");
    
    const totalTime = Date.now() - startTime;
    Logger.log("Total performance test time: " + totalTime + "ms");
    
  } catch (error) {
    Logger.log("ERROR: Performance test failed: " + error.toString());
  }
}

/**
 * Memory usage analysis
 */
function analyzeMemoryUsage() {
  Logger.log("=== MEMORY USAGE ANALYSIS ===");
  
  try {
    // Get current memory info (Apps Script doesn't provide direct memory access)
    // This is a placeholder for potential memory tracking
    
    const before = Date.now();
    
    // Simulate memory-intensive operations
    const config = getConfiguration();
    const data = [];
    
    for (let i = 0; i < 1000; i++) {
      data.push({
        id: i,
        message: 'Test message ' + i,
        timestamp: new Date()
      });
    }
    
    const after = Date.now();
    
    Logger.log("Created 1000 objects in: " + (after - before) + "ms");
    Logger.log("Memory analysis completed (limited data available in Apps Script)");
    
  } catch (error) {
    Logger.log("ERROR: Memory analysis failed: " + error.toString());
  }
}

/**
 * Export system configuration for backup
 */
function exportConfiguration() {
  Logger.log("=== EXPORTING CONFIGURATION ===");
  
  try {
    const config = getExtendedConfiguration() || getConfiguration();
    if (!config) {
      Logger.log("ERROR: No configuration to export");
      return;
    }
    
    // Create exportable configuration (without sensitive data)
    const exportConfig = {
      formResponsesSheetName: config.formResponsesSheetName,
      customTitle: config.customTitle,
      excludedColumns: config.excludedColumns,
      triggerStatus: config.triggerStatus,
      messageTemplate: config.messageTemplate || 'DEFAULT',
      enableRetry: config.enableRetry !== false,
      maxRetries: config.maxRetries || MAX_RETRY_ATTEMPTS,
      templateOptions: config.templateOptions || {},
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    
    const exportJson = JSON.stringify(exportConfig, null, 2);
    Logger.log("Configuration export:");
    Logger.log(exportJson);
    
    return exportConfig;
    
  } catch (error) {
    Logger.log("ERROR: Configuration export failed: " + error.toString());
  }
}