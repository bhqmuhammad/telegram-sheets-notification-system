#!/usr/bin/env node
/**
 * Configuration validation script
 * Validates Google Apps Script files and configuration templates
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const templatesDir = path.join(__dirname, '..', 'templates');

console.log('🔍 Validating Telegram Sheets Notification System');
console.log('================================================\n');

let totalErrors = 0;
let totalWarnings = 0;

function logError(message) {
  console.log('❌ ERROR:', message);
  totalErrors++;
}

function logWarning(message) {
  console.log('⚠️  WARNING:', message);
  totalWarnings++;
}

function logSuccess(message) {
  console.log('✅', message);
}

function validateFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    logSuccess(`${description} found`);
    return true;
  } else {
    logError(`${description} not found: ${filePath}`);
    return false;
  }
}

function validateGoogleAppsScriptFiles() {
  console.log('📄 Validating Google Apps Script Files');
  console.log('--------------------------------------');
  
  const requiredFiles = [
    { file: 'Code.gs', description: 'Main notification script' },
    { file: 'MessageTemplates.gs', description: 'Message template functions' },
    { file: 'ConfigManager.gs', description: 'Configuration management' },
    { file: 'DevUtils.gs', description: 'Development utilities' }
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(({ file, description }) => {
    const filePath = path.join(srcDir, file);
    if (!validateFileExists(filePath, description)) {
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    logSuccess('All required Google Apps Script files present');
  }
  
  console.log('');
}

function validateCodeSyntax() {
  console.log('🔧 Validating Code Syntax');
  console.log('-------------------------');
  
  const gsFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.gs'));
  
  gsFiles.forEach(file => {
    const filePath = path.join(srcDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    const issues = [];
    
    // Check for unclosed braces
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push('Mismatched braces');
    }
    
    // Check for unclosed parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push('Mismatched parentheses');
    }
    
    // Check for proper function declarations
    const functions = content.match(/function\s+\w+\s*\(/g);
    if (functions) {
      logSuccess(`${file}: ${functions.length} functions found`);
    }
    
    if (issues.length > 0) {
      logError(`${file}: ${issues.join(', ')}`);
    } else {
      logSuccess(`${file}: Basic syntax check passed`);
    }
  });
  
  console.log('');
}

function validateConstants() {
  console.log('🔧 Validating Constants and Configuration');
  console.log('-----------------------------------------');
  
  const codeFile = path.join(srcDir, 'Code.gs');
  if (!fs.existsSync(codeFile)) {
    logError('Code.gs not found for constants validation');
    return;
  }
  
  const content = fs.readFileSync(codeFile, 'utf8');
  
  const requiredConstants = [
    'SETTINGS_SHEET_NAME',
    'STATUS_COLUMN_NAME', 
    'TELEGRAM_ID_COLUMN_NAME',
    'DEFAULT_TRIGGER_STATUS',
    'TELEGRAM_API_BASE_URL',
    'MAX_RETRY_ATTEMPTS',
    'RETRY_DELAY_MS'
  ];
  
  requiredConstants.forEach(constant => {
    if (content.includes(constant)) {
      logSuccess(`Constant ${constant} defined`);
    } else {
      logWarning(`Constant ${constant} not found`);
    }
  });
  
  console.log('');
}

function validateDocumentation() {
  console.log('📚 Validating Documentation');
  console.log('---------------------------');
  
  const docFiles = [
    { file: 'README.md', description: 'Main documentation' },
    { file: 'docs/setup-guide.md', description: 'Setup guide' }
  ];
  
  docFiles.forEach(({ file, description }) => {
    const filePath = path.join(__dirname, '..', file);
    validateFileExists(filePath, description);
  });
  
  // Check README content
  const readmePath = path.join(__dirname, '..', 'README.md');
  if (fs.existsSync(readmePath)) {
    const content = fs.readFileSync(readmePath, 'utf8');
    
    const requiredSections = ['Features', 'Setup', 'Configuration', 'Usage'];
    requiredSections.forEach(section => {
      if (content.includes(section)) {
        logSuccess(`README contains ${section} section`);
      } else {
        logWarning(`README missing ${section} section`);
      }
    });
  }
  
  console.log('');
}

function validateProjectStructure() {
  console.log('📁 Validating Project Structure');
  console.log('-------------------------------');
  
  const requiredDirs = [
    { dir: 'src', description: 'Source code directory' },
    { dir: 'docs', description: 'Documentation directory' },
    { dir: 'scripts', description: 'Helper scripts directory' },
    { dir: 'examples', description: 'Examples directory' },
    { dir: 'templates', description: 'Templates directory' }
  ];
  
  requiredDirs.forEach(({ dir, description }) => {
    const dirPath = path.join(__dirname, '..', dir);
    validateFileExists(dirPath, description);
  });
  
  // Check for configuration files
  const configFiles = [
    { file: 'package.json', description: 'Package configuration' },
    { file: '.eslintrc.json', description: 'ESLint configuration' },
    { file: '.gitignore', description: 'Git ignore file' },
    { file: 'LICENSE', description: 'License file' }
  ];
  
  configFiles.forEach(({ file, description }) => {
    const filePath = path.join(__dirname, '..', file);
    validateFileExists(filePath, description);
  });
  
  console.log('');
}

function generateValidationReport() {
  console.log('📊 Validation Summary');
  console.log('====================');
  console.log(`Total Errors: ${totalErrors}`);
  console.log(`Total Warnings: ${totalWarnings}`);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('🎉 All validations passed successfully!');
    process.exit(0);
  } else if (totalErrors === 0) {
    console.log('✅ No critical errors found (warnings can be addressed)');
    process.exit(0);
  } else {
    console.log('❌ Critical errors found - please fix before deployment');
    process.exit(1);
  }
}

function main() {
  validateProjectStructure();
  validateGoogleAppsScriptFiles();
  validateCodeSyntax();
  validateConstants();
  validateDocumentation();
  generateValidationReport();
}

if (require.main === module) {
  main();
}