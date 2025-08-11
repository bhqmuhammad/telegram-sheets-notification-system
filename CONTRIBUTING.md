# Contributing to Telegram Sheets Notification System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug reports** - Help us identify and fix issues
- 💡 **Feature requests** - Suggest new functionality
- 📝 **Documentation improvements** - Help others understand the project
- 🔧 **Code contributions** - Fix bugs or add features
- 🧪 **Testing** - Help improve reliability and coverage
- 🎨 **UX/UI improvements** - Enhance user experience

### Before You Start

1. **Check existing issues** to avoid duplication
2. **Read the documentation** to understand the project
3. **Test the current version** to understand functionality
4. **Join discussions** in GitHub Discussions if you have questions

## 🐛 Reporting Bugs

### Before Reporting

1. **Update to latest version** and test again
2. **Search existing issues** for similar problems
3. **Run system health check** to isolate the issue
4. **Prepare detailed information** about the problem

### Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Google Apps Script version:
- Browser:
- Operating System:

## Additional Information
- Error logs from Apps Script
- System health check results
- Screenshots if applicable
- Spreadsheet configuration (remove sensitive data)
```

### Critical Bugs

For security issues or critical bugs:
1. **Don't create public issues** for security vulnerabilities
2. **Email maintainers directly** with details
3. **Include "SECURITY" in subject line**

## 💡 Feature Requests

### Before Requesting

1. **Check if feature already exists** in latest version
2. **Search existing feature requests**
3. **Consider if feature fits project scope**
4. **Think about implementation complexity**

### Feature Request Template

```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why is this feature needed? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
What other approaches did you consider?

## Additional Context
Any additional information, mockups, or examples
```

## 🔧 Code Contributions

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/telegram-sheets-notification-system.git
   cd telegram-sheets-notification-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Validate setup**
   ```bash
   npm run validate
   npm run lint
   ```

4. **Create development branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Code Standards

#### Google Apps Script Guidelines

1. **File naming**: Use PascalCase for .gs files (e.g., `MessageTemplates.gs`)
2. **Function naming**: Use camelCase (e.g., `sendTelegramNotification`)
3. **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)
4. **Documentation**: Include JSDoc comments for all functions

#### Code Style

We use ESLint for code quality. Key rules:

```javascript
// ✅ Good
const config = getConfiguration();
if (config.isValid) {
  processNotification(config);
}

// ❌ Bad
var config = getConfiguration()
if(config.isValid){
  processNotification(config)
}
```

#### Error Handling

Always include proper error handling:

```javascript
// ✅ Good
function exampleFunction() {
  try {
    const result = riskyOperation();
    Logger.log("Success: " + result);
    return { success: true, data: result };
  } catch (error) {
    Logger.log("ERROR: " + error.toString());
    return { success: false, error: error.toString() };
  }
}

// ❌ Bad
function exampleFunction() {
  const result = riskyOperation(); // No error handling
  return result;
}
```

#### Logging Standards

Use consistent logging patterns:

```javascript
// ✅ Good
Logger.log("=== Function Name Started ===");
Logger.log("Processing data for user: " + userId);
Logger.log("SUCCESS: Operation completed");

// ❌ Bad
console.log("starting");
Logger.log("done");
```

### Testing Your Changes

#### Manual Testing

1. **Create test spreadsheet** with sample data
2. **Test all affected features** thoroughly
3. **Verify error handling** with invalid inputs
4. **Check edge cases** and boundary conditions

#### Automated Testing

Run built-in test utilities:

```javascript
// Test system health
runSystemHealthCheck();

// Test specific features
sendTestNotification('TEST_CHAT_ID');
performanceTest();
validateSystemConfiguration();
```

#### Regression Testing

Before submitting:

1. **Test existing functionality** to ensure no breaking changes
2. **Run full system validation**
3. **Check all message templates** work correctly
4. **Verify error handling** still functions

### Submitting Changes

#### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run linting and validation**
   ```bash
   npm run lint
   npm run validate
   ```

4. **Create descriptive commit messages**
   ```bash
   git commit -m "Add retry mechanism for failed notifications

   - Implements exponential backoff for API failures
   - Adds configurable max retry attempts
   - Includes comprehensive error logging
   - Fixes #123"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create pull request** with detailed description

#### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
- [ ] Manual testing completed
- [ ] System health check passes
- [ ] No regressions identified
- [ ] Error handling tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No sensitive data exposed
```

### Code Review Process

#### What Reviewers Look For

1. **Functionality**: Does the code work as intended?
2. **Quality**: Is the code clean, readable, and maintainable?
3. **Security**: Are there any security vulnerabilities?
4. **Performance**: Are there performance implications?
5. **Documentation**: Is the code properly documented?

#### Addressing Review Feedback

1. **Be responsive** to reviewer comments
2. **Ask questions** if feedback is unclear
3. **Make requested changes** promptly
4. **Update tests and documentation** as needed
5. **Be open to suggestions** and learning opportunities

## 📝 Documentation Contributions

### Documentation Types

1. **Code documentation** (JSDoc comments)
2. **User guides** (setup, configuration, usage)
3. **Developer documentation** (architecture, API reference)
4. **Examples** (real-world use cases)

### Documentation Standards

#### Writing Style

1. **Clear and concise** language
2. **Step-by-step instructions** for procedures
3. **Code examples** for technical concepts
4. **Screenshots** for visual elements
5. **Consistent formatting** throughout

#### Markdown Guidelines

```markdown
# Main Heading

## Section Heading

### Subsection Heading

**Bold for emphasis**
*Italic for terms*
`Code for inline code`

```javascript
// Code blocks for examples
function example() {
  return "formatted code";
}
```

- Bullet points for lists
1. Numbered lists for sequences

> Blockquotes for important notes

| Table | Headers |
|-------|---------|
| Table | Data    |
```

### Documentation Testing

1. **Follow your own instructions** to ensure accuracy
2. **Test code examples** to verify they work
3. **Check links** to ensure they're valid
4. **Review for typos** and grammar errors

## 🧪 Testing Contributions

### Test Types Needed

1. **Unit tests** for individual functions
2. **Integration tests** for complete workflows
3. **Performance tests** for scalability
4. **Security tests** for vulnerabilities
5. **User acceptance tests** for real-world scenarios

### Testing Framework

While Google Apps Script has limited testing frameworks, we use:

1. **Built-in test functions** for validation
2. **Manual test procedures** for user workflows
3. **Automated health checks** for system validation
4. **Performance monitoring** for optimization

### Creating Test Cases

```javascript
// Example test function
function testMessageTemplateGeneration() {
  const testData = {
    config: { customTitle: "Test Title", excludedColumns: [] },
    headers: ["Name", "Email", "Status"],
    rowData: ["John Doe", "john@example.com", "COMPLETED"]
  };
  
  const templates = ["DEFAULT", "MINIMAL", "DETAILED", "COMPACT", "PROFESSIONAL"];
  
  templates.forEach(template => {
    try {
      const message = generateMessageFromTemplate(template, testData.config, testData.headers, testData.rowData);
      if (message && message.length > 0) {
        Logger.log(`✅ ${template} template test passed`);
      } else {
        Logger.log(`❌ ${template} template test failed: empty message`);
      }
    } catch (error) {
      Logger.log(`❌ ${template} template test failed: ${error.toString()}`);
    }
  });
}
```

## 🚀 Release Process

### Version Numbering

We follow Semantic Versioning (SemVer):

- **Major version** (e.g., 2.0.0): Breaking changes
- **Minor version** (e.g., 2.1.0): New features, backwards compatible
- **Patch version** (e.g., 2.1.1): Bug fixes, backwards compatible

### Release Checklist

1. **Update version numbers** in relevant files
2. **Update CHANGELOG.md** with new features and fixes
3. **Update documentation** to reflect changes
4. **Run comprehensive tests** on all features
5. **Create release notes** with migration instructions if needed

## 🏆 Recognition

### Contributors

All contributors are recognized in:
1. **README.md** contributors section
2. **Release notes** for significant contributions
3. **CONTRIBUTORS.md** file (if created)

### Types of Recognition

- 🐛 Bug fixes and reports
- 💡 Feature suggestions and implementations
- 📝 Documentation improvements
- 🧪 Testing and quality assurance
- 🎨 UX/UI improvements
- 📢 Community building

## 📞 Getting Help

### Communication Channels

1. **GitHub Issues** - For bugs and feature requests
2. **GitHub Discussions** - For questions and ideas
3. **Pull Request Comments** - For code review discussions

### Response Times

- **Acknowledgment**: Within 48 hours
- **Initial response**: Within 1 week
- **Code review**: Within 2 weeks
- **Release cycle**: Monthly for minor updates

### Community Guidelines

1. **Be respectful** and inclusive
2. **Provide constructive feedback**
3. **Help others learn and grow**
4. **Follow the code of conduct**
5. **Focus on the problem, not the person**

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to the Telegram Sheets Notification System! Your contributions help make this project better for everyone.

---

**Questions?** Open an issue or start a discussion. We're here to help! 🚀