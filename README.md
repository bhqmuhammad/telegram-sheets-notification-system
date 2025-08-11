# Telegram Sheet Notifications

Automatically send Telegram notifications when Google Sheets data changes.

## Features

- 🔔 Automated Telegram notifications for sheet updates
- ⚙️ **NEW: Multiple message templates** (Minimal, Detailed, Compact, Professional)
- 📝 Support for all sheet columns with smart formatting
- ✨ **Enhanced:** Markdown formatting with special character escaping
- 🔍 **Improved:** Detailed logging and error tracking
- 🛡️ **Enhanced:** Robust error handling with retry mechanism
- 🔄 **NEW:** Automatic retry for failed messages with exponential backoff
- 📱 **NEW:** Chat migration support for group conversations
- ⚡ **NEW:** Rate limiting and API error handling
- 🧪 **NEW:** Built-in testing and validation utilities
- 🎨 **NEW:** Customizable notification rules and templates
- 📊 **NEW:** System health monitoring and diagnostics

## Quick Start

### 1. Get Your Bot Token
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Save the API token provided

### 2. Setup Your Spreadsheet

#### Create Settings Sheet
Create a sheet named **"Telegram Bot Settings"** with:

| Setting | Value | Description |
|---------|-------|-------------|
| Bot Token | [Your Bot Token] | From @BotFather |
| Form Sheet Name | [Your Data Sheet] | Name of your data sheet |
| Custom Title | [Notification Title] | Title for messages |
| Excluded Columns | [Optional] | Comma-separated columns to exclude |
| Trigger Status | COMPLETED | Status that triggers notifications |

#### Setup Data Sheet
Your data sheet **must** include:
- **Status** column (triggers notifications)
- **Telegram ID** column (message destinations)

### 3. Install the Script
1. Open Google Sheets → Extensions → Apps Script
2. Replace the default code with content from `src/Code.gs`
3. Save the project
4. Create trigger: Function `sendTelegramNotification`, Event `On edit`

### 4. Test the System
```javascript
// Run this in Apps Script to test your setup
runSystemHealthCheck();

// Send a test notification
sendTestNotification('YOUR_TELEGRAM_ID', 'Test message');
```

## Advanced Configuration

### Message Templates

Choose from 5 built-in templates by adding to your settings sheet:

| Template | Use Case | Example |
|----------|----------|---------|
| **DEFAULT** | General purpose | Standard formatted messages |
| **MINIMAL** | Quick alerts | Essential fields only |
| **DETAILED** | Complex workflows | Full metadata and formatting |
| **COMPACT** | High frequency | Single line notifications |
| **PROFESSIONAL** | Business use | Formal formatting with branding |

### Extended Settings (Optional)

Add these rows to your settings sheet for advanced features:

| Setting | Default | Description |
|---------|---------|-------------|
| Message Template | DEFAULT | Template type to use |
| Enable Retry | TRUE | Enable automatic retry |
| Max Retries | 3 | Maximum retry attempts |
| Enable Logging | TRUE | Detailed logging |
| Company Name | | For professional template |
| Important Fields | Status,Name,Email | Fields for minimal template |

### Custom Message Templates

Create custom templates using placeholders:

```
🎉 *{{TITLE}}*

Hello! New submission received at {{TIMESTAMP}}.

📋 **Details:**
👤 Name: {{Name}}
📧 Email: {{Email}}
📍 Status: {{Status}}

Thank you!
```

## New Development Features

### System Health Check
```javascript
// Comprehensive system validation
const results = runSystemHealthCheck();
console.log(results);
```

### Performance Testing
```javascript
// Test system performance
performanceTest();
```

### Configuration Validation
```javascript
// Validate current configuration
const validation = validateSystemConfiguration();
```

### Sample Data Generation
```javascript
// Create test data for development
createSampleData();
```

## Project Structure

```
├── src/                          # Google Apps Script files
│   ├── Code.gs                   # Main notification system
│   ├── MessageTemplates.gs       # Message formatting templates
│   ├── ConfigManager.gs          # Configuration management
│   └── DevUtils.gs               # Development utilities
├── docs/                         # Documentation
│   └── setup-guide.md           # Detailed setup instructions
├── examples/                     # Usage examples
│   └── usage-examples.md        # Real-world scenarios
├── templates/                    # Configuration templates
│   └── configuration-template.md # Setup templates
├── scripts/                      # Helper scripts
│   ├── setup.js                 # Interactive setup
│   └── validate-config.js       # Configuration validation
├── .github/workflows/           # CI/CD workflows
└── package.json                # Project configuration
```

## Quick Setup Script

Use the interactive setup script:

```bash
npm install
npm run setup
```

This will guide you through configuration and generate the settings for your Google Sheet.

## API Reference

### Core Functions

#### `sendTelegramNotification(e)`
Main trigger function for sheet edits.

#### `sendTestNotification(chatId, message?)`
Send test notification to validate setup.

#### `runSystemHealthCheck()`
Comprehensive system validation and testing.

#### `validateSystemConfiguration()`
Validate current configuration settings.

### Message Template Functions

#### `generateMessageFromTemplate(templateType, config, headers, rowData, options)`
Generate message using specific template.

#### `generateCustomMessage(template, config, headers, rowData)`
Create message from custom template with placeholders.

### Configuration Functions

#### `getExtendedConfiguration()`
Load advanced configuration with all options.

#### `createAdvancedSettingsTemplate()`
Generate settings template sheet with all options.

## Troubleshooting

### Common Issues

1. **"Bot token invalid"**
   - Verify token format: `123456789:ABCdefGHI...`
   - Get fresh token from @BotFather
   - Check for extra spaces

2. **"Required columns not found"**
   - Ensure exact column names: "Status", "Telegram ID"
   - Check for case sensitivity
   - Verify column headers

3. **"Users not receiving messages"**
   - Users must start your bot first
   - Check Telegram ID format (numbers only)
   - Verify bot is not blocked

4. **"Trigger not working"**
   - Check trigger status matches exactly
   - Verify trigger is set to "On edit"
   - Check Apps Script permissions

### Error Logs

Check detailed logs in Apps Script:
1. Go to Extensions → Apps Script
2. Click "Executions" in sidebar
3. Review error details and stack traces

### System Diagnostics

Run built-in diagnostics:
```javascript
// Complete system check
runSystemHealthCheck();

// Performance analysis
performanceTest();

// Memory usage check
analyzeMemoryUsage();
```

## Development

### Code Quality
- ESLint configuration included
- Comprehensive error handling
- Detailed logging throughout
- Input validation and sanitization

### Testing
- Built-in test utilities
- Sample data generation
- Mock event simulation
- Performance benchmarking

### CI/CD
- GitHub Actions workflow
- Automated linting and validation
- Documentation generation
- Security scanning

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/bhqmuhammad/telegram-sheets-notification-system.git
cd telegram-sheets-notification-system
npm install
npm run validate
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### Version 2.0.0 (Latest)
- 🎉 **Major rewrite with modular architecture**
- 🎨 **5 new message templates**
- 🔄 **Robust retry mechanism**
- 🛡️ **Enhanced error handling**
- 🧪 **Built-in testing utilities**
- 📊 **System health monitoring**
- ⚙️ **Advanced configuration options**
- 🔧 **Development tools and linting**
- 📚 **Comprehensive documentation**

### Version 1.0.0
- ✨ Basic notification functionality
- 📝 Simple message formatting
- ⚙️ Basic configuration options

## Support

- 📖 **Documentation**: Check the `/docs` folder
- 💡 **Examples**: See `/examples` for real-world use cases
- 🐛 **Issues**: [GitHub Issues](https://github.com/bhqmuhammad/telegram-sheets-notification-system/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/bhqmuhammad/telegram-sheets-notification-system/discussions)
