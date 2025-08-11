/**
 * Message Templates and Formatting Functions
 * Provides various template options for Telegram notifications
 * @author bhqmuhammad
 * @version 2.0
 */

// ================================
// MESSAGE TEMPLATES
// ================================

/**
 * Available message templates
 */
const MESSAGE_TEMPLATES = {
  DEFAULT: 'default',
  MINIMAL: 'minimal', 
  DETAILED: 'detailed',
  COMPACT: 'compact',
  PROFESSIONAL: 'professional'
};

/**
 * Generates a message using the specified template
 * @param {string} templateType - Template type from MESSAGE_TEMPLATES
 * @param {Object} config - Configuration object
 * @param {Array} headers - Column headers
 * @param {Array} rowData - Row data values
 * @param {Object} options - Additional formatting options
 * @returns {string} Formatted message
 */
function generateMessageFromTemplate(templateType, config, headers, rowData, options = {}) {
  switch (templateType) {
    case MESSAGE_TEMPLATES.MINIMAL:
      return generateMinimalMessage(config, headers, rowData, options);
    case MESSAGE_TEMPLATES.DETAILED:
      return generateDetailedMessage(config, headers, rowData, options);
    case MESSAGE_TEMPLATES.COMPACT:
      return generateCompactMessage(config, headers, rowData, options);
    case MESSAGE_TEMPLATES.PROFESSIONAL:
      return generateProfessionalMessage(config, headers, rowData, options);
    default:
      return generateDefaultMessage(config, headers, rowData, options);
  }
}

/**
 * Default message template (same as original)
 */
function generateDefaultMessage(config, headers, rowData, options) {
  let message = '*' + escapeMarkdown(config.customTitle) + '*\n';
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  message += '*Generated*: ' + timestamp + '\n\n';

  for (let i = 0; i < headers.length; i++) {
    const columnName = headers[i];
    const cellValue = rowData[i];
    
    if (config.excludedColumns.includes(columnName) || !cellValue || cellValue === '') {
      continue;
    }

    if (columnName.toLowerCase().includes('timestamp') && cellValue instanceof Date) {
      const formattedTimestamp = Utilities.formatDate(cellValue, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      message += '*' + escapeMarkdown(columnName) + '*: ' + escapeMarkdown(formattedTimestamp) + '\n';
    } else {
      message += '*' + escapeMarkdown(columnName) + '*: ' + escapeMarkdown(cellValue.toString()) + '\n';
    }
  }

  return message;
}

/**
 * Minimal message template - only essential fields
 */
function generateMinimalMessage(config, headers, rowData, options) {
  let message = '🔔 *' + escapeMarkdown(config.customTitle) + '*\n\n';
  
  // Only include specific important fields
  const importantFields = options.importantFields || ['Status', 'Name', 'Email'];
  
  for (let i = 0; i < headers.length; i++) {
    const columnName = headers[i];
    const cellValue = rowData[i];
    
    if (!importantFields.includes(columnName) || !cellValue || cellValue === '') {
      continue;
    }

    message += '*' + escapeMarkdown(columnName) + '*: ' + escapeMarkdown(cellValue.toString()) + '\n';
  }

  return message;
}

/**
 * Detailed message template - includes metadata and formatting
 */
function generateDetailedMessage(config, headers, rowData, options) {
  let message = '📋 *' + escapeMarkdown(config.customTitle) + '*\n';
  message += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  message += '🕒 *Generated*: ' + timestamp + '\n';
  message += '📊 *Spreadsheet*: ' + SpreadsheetApp.getActiveSpreadsheet().getName() + '\n';
  message += '📄 *Sheet*: ' + config.formResponsesSheetName + '\n\n';

  message += '*📝 Data:*\n';
  for (let i = 0; i < headers.length; i++) {
    const columnName = headers[i];
    const cellValue = rowData[i];
    
    if (config.excludedColumns.includes(columnName) || !cellValue || cellValue === '') {
      continue;
    }

    const icon = getFieldIcon(columnName);
    message += icon + ' *' + escapeMarkdown(columnName) + '*: ' + escapeMarkdown(cellValue.toString()) + '\n';
  }

  return message;
}

/**
 * Compact message template - single line format
 */
function generateCompactMessage(config, headers, rowData, options) {
  const essentialFields = options.essentialFields || ['Status', 'Name'];
  const values = [];
  
  for (let i = 0; i < headers.length; i++) {
    const columnName = headers[i];
    const cellValue = rowData[i];
    
    if (essentialFields.includes(columnName) && cellValue && cellValue !== '') {
      values.push(escapeMarkdown(cellValue.toString()));
    }
  }

  return '🔔 *' + escapeMarkdown(config.customTitle) + '*: ' + values.join(' • ');
}

/**
 * Professional message template - business-style formatting
 */
function generateProfessionalMessage(config, headers, rowData, options) {
  const companyName = options.companyName || 'Your Organization';
  
  let message = `*${escapeMarkdown(companyName)}*\n`;
  message += `*${escapeMarkdown(config.customTitle)}*\n\n`;
  
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMM dd, yyyy - HH:mm');
  message += `*Date & Time:* ${timestamp}\n\n`;

  message += '*Details:*\n';
  for (let i = 0; i < headers.length; i++) {
    const columnName = headers[i];
    const cellValue = rowData[i];
    
    if (config.excludedColumns.includes(columnName) || !cellValue || cellValue === '') {
      continue;
    }

    message += `• *${escapeMarkdown(columnName)}:* ${escapeMarkdown(cellValue.toString())}\n`;
  }

  message += '\n_This is an automated notification._';
  return message;
}

/**
 * Gets an appropriate emoji icon for field names
 * @param {string} fieldName - Name of the field
 * @returns {string} Emoji icon
 */
function getFieldIcon(fieldName) {
  const fieldLower = fieldName.toLowerCase();
  
  if (fieldLower.includes('name')) return '👤';
  if (fieldLower.includes('email')) return '📧';
  if (fieldLower.includes('phone')) return '📞';
  if (fieldLower.includes('status')) return '📍';
  if (fieldLower.includes('timestamp') || fieldLower.includes('date')) return '🕒';
  if (fieldLower.includes('amount') || fieldLower.includes('price')) return '💰';
  if (fieldLower.includes('location') || fieldLower.includes('address')) return '📍';
  if (fieldLower.includes('comment') || fieldLower.includes('note')) return '💬';
  
  return '📄'; // Default icon
}

/**
 * Creates a custom message template
 * @param {string} template - Template string with placeholders like {{FieldName}}
 * @param {Object} config - Configuration object
 * @param {Array} headers - Column headers
 * @param {Array} rowData - Row data values
 * @returns {string} Formatted message
 */
function generateCustomMessage(template, config, headers, rowData) {
  let message = template;
  
  // Replace timestamp placeholder
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  message = message.replace(/\{\{TIMESTAMP\}\}/g, timestamp);
  message = message.replace(/\{\{TITLE\}\}/g, escapeMarkdown(config.customTitle));
  
  // Replace field placeholders
  for (let i = 0; i < headers.length; i++) {
    const fieldName = headers[i];
    const fieldValue = rowData[i] || '';
    const placeholder = new RegExp(`\\{\\{${fieldName}\\}\\}`, 'g');
    message = message.replace(placeholder, escapeMarkdown(fieldValue.toString()));
  }
  
  // Clean up any remaining placeholders
  message = message.replace(/\{\{[^}]*\}\}/g, '[Not Available]');
  
  return message;
}