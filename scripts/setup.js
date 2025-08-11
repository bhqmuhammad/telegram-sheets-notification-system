#!/usr/bin/env node
/**
 * Setup script for the Telegram Sheets Notification System
 * Helps users configure the system and validate their setup
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Telegram Sheets Notification System Setup');
console.log('===========================================\n');

const config = {
  botToken: '',
  sheetName: '',
  customTitle: '',
  excludedColumns: [],
  triggerStatus: 'COMPLETED'
};

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function setupBot() {
  console.log('📱 Bot Configuration');
  console.log('--------------------');
  
  config.botToken = await askQuestion('Enter your Telegram Bot Token (from @BotFather): ');
  
  if (!config.botToken.match(/^\d+:[A-Za-z0-9_-]{35}$/)) {
    console.log('⚠️  Warning: Bot token format appears invalid');
  }
  
  console.log('✅ Bot token configured\n');
}

async function setupSheet() {
  console.log('📊 Sheet Configuration');
  console.log('----------------------');
  
  config.sheetName = await askQuestion('Enter your data sheet name: ');
  config.customTitle = await askQuestion('Enter custom notification title: ');
  
  const excludedInput = await askQuestion('Enter columns to exclude (comma-separated, or press Enter to skip): ');
  if (excludedInput) {
    config.excludedColumns = excludedInput.split(',').map(col => col.trim());
  }
  
  const triggerInput = await askQuestion('Enter trigger status (default: COMPLETED): ');
  if (triggerInput) {
    config.triggerStatus = triggerInput;
  }
  
  console.log('✅ Sheet configuration completed\n');
}

async function generateConfig() {
  console.log('📄 Generating Configuration');
  console.log('---------------------------');
  
  const configTemplate = `
# Telegram Sheets Notification Configuration
# Copy these values to your Google Sheets settings

Bot Token: ${config.botToken}
Form Sheet Name: ${config.sheetName}
Custom Title: ${config.customTitle}
Excluded Columns: ${config.excludedColumns.join(', ')}
Trigger Status: ${config.triggerStatus}

# Advanced Settings (Optional)
Message Template: DEFAULT
Enable Retry: TRUE
Max Retries: 3
Enable Logging: TRUE
`;

  const configPath = path.join(__dirname, '..', 'generated-config.txt');
  fs.writeFileSync(configPath, configTemplate);
  
  console.log('✅ Configuration saved to generated-config.txt');
  console.log('📋 Copy these values to your "Telegram Bot Settings" sheet in Google Sheets\n');
}

async function showInstructions() {
  console.log('📚 Next Steps');
  console.log('=============');
  console.log('1. Open your Google Spreadsheet');
  console.log('2. Create a sheet named "Telegram Bot Settings"');
  console.log('3. Copy the configuration values from generated-config.txt');
  console.log('4. Ensure your data sheet has "Status" and "Telegram ID" columns');
  console.log('5. Go to Extensions > Apps Script');
  console.log('6. Copy the code from src/Code.gs');
  console.log('7. Create a trigger for sendTelegramNotification function');
  console.log('8. Test by updating a row\'s Status to "' + config.triggerStatus + '"');
  console.log('\n🎉 Setup complete! Check the docs folder for detailed guides.');
}

async function main() {
  try {
    await setupBot();
    await setupSheet();
    await generateConfig();
    await showInstructions();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}