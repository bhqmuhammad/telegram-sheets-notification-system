# Example Usage Scenarios

This document provides real-world examples of how to use the Telegram Sheets Notification System.

## Example 1: Customer Support Tickets

### Scenario
You have a customer support form that creates tickets in Google Sheets. You want to notify support agents when tickets are assigned.

### Configuration
```
Bot Token: [Your Bot Token]
Form Sheet Name: Support Tickets
Custom Title: New Support Ticket Assigned
Excluded Columns: Internal Notes,Created By
Trigger Status: ASSIGNED
Message Template: PROFESSIONAL
Company Name: Support Team
```

### Data Sheet Structure
| Ticket ID | Customer Name | Email | Issue | Priority | Status | Assigned To | Telegram ID |
|-----------|---------------|-------|-------|----------|--------|-------------|-------------|
| 001 | John Doe | john@email.com | Login Issue | High | ASSIGNED | Agent A | 123456789 |

### Notification Result
```
*Support Team*
*New Support Ticket Assigned*

*Date & Time:* Jan 15, 2024 - 14:30

*Details:*
• *Ticket ID:* 001
• *Customer Name:* John Doe
• *Email:* john@email.com
• *Issue:* Login Issue
• *Priority:* High
• *Status:* ASSIGNED
• *Assigned To:* Agent A

_This is an automated notification._
```

## Example 2: Event Registration System

### Scenario
Event registration form that notifies organizers when someone registers.

### Configuration
```
Bot Token: [Your Bot Token]
Form Sheet Name: Event Registrations
Custom Title: New Event Registration
Excluded Columns: Payment Status,Internal ID
Trigger Status: CONFIRMED
Message Template: DETAILED
```

### Data Sheet Structure
| Name | Email | Phone | Event | Attendance Type | Status | Organizer ID |
|------|-------|-------|-------|-----------------|--------|--------------|
| Alice Johnson | alice@email.com | +1234567890 | Tech Conference | Virtual | CONFIRMED | 987654321 |

### Notification Result
```
📋 *New Event Registration*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕒 *Generated*: 2024-01-15 16:45:00
📊 *Spreadsheet*: Event Management
📄 *Sheet*: Event Registrations

*📝 Data:*
👤 *Name*: Alice Johnson
📧 *Email*: alice@email.com
📞 *Phone*: +1234567890
📄 *Event*: Tech Conference
📄 *Attendance Type*: Virtual
📍 *Status*: CONFIRMED
```

## Example 3: Sales Lead Qualification

### Scenario
Marketing qualified leads (MQLs) need immediate notification to sales team.

### Configuration
```
Bot Token: [Your Bot Token]
Form Sheet Name: Sales Leads
Custom Title: Hot Lead Alert
Excluded Columns: Source,Campaign ID
Trigger Status: HOT
Message Template: MINIMAL
Important Fields: Company,Contact Name,Phone,Lead Score
```

### Data Sheet Structure
| Contact Name | Company | Phone | Email | Lead Score | Status | Sales Rep ID |
|--------------|---------|-------|-------|------------|--------|--------------|
| Bob Smith | TechCorp | +1987654321 | bob@techcorp.com | 95 | HOT | 456789123 |

### Notification Result
```
🔔 *Hot Lead Alert*

*Status*: HOT
*Company*: TechCorp
*Contact Name*: Bob Smith
*Phone*: +1987654321
*Lead Score*: 95
```

## Example 4: Order Processing Workflow

### Scenario
E-commerce order processing with different notifications for different stages.

### Configuration with Rules
```javascript
// Custom notification rules
const ORDER_RULES = [
  {
    condition: 'Order Value',
    operator: 'greater_than',
    value: '1000',
    template: 'DETAILED',
    templateOptions: { companyName: 'VIP Orders' }
  },
  {
    condition: 'Status',
    operator: 'equals',
    value: 'SHIPPED',
    template: 'COMPACT'
  }
];
```

### Data Sheet Structure
| Order ID | Customer | Order Value | Status | Fulfillment Manager ID |
|----------|----------|-------------|--------|------------------------|
| ORD-001 | Jane Doe | $1500 | PROCESSING | 789123456 |
| ORD-002 | Mike Wilson | $50 | SHIPPED | 789123456 |

### High-Value Order Notification
```
📋 *VIP Orders*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕒 *Generated*: 2024-01-15 11:20:00
📊 *Spreadsheet*: Order Management
📄 *Sheet*: Orders

*📝 Data:*
📄 *Order ID*: ORD-001
👤 *Customer*: Jane Doe
💰 *Order Value*: $1500
📍 *Status*: PROCESSING
```

### Shipped Order Notification
```
🔔 *Order Processing*: ORD-002 • Mike Wilson • SHIPPED
```

## Example 5: HR Interview Scheduling

### Scenario
Interview scheduling system that notifies interviewers.

### Configuration
```
Bot Token: [Your Bot Token]
Form Sheet Name: Interview Schedule
Custom Title: Interview Scheduled
Excluded Columns: Recruiter Notes,Internal Rating
Trigger Status: SCHEDULED
Message Template: PROFESSIONAL
Company Name: HR Department
```

### Custom Message Template
```
🎯 *{{TITLE}}*

📅 **Interview Details:**
👤 Candidate: {{Candidate Name}}
💼 Position: {{Position}}
🕒 Date & Time: {{Interview Date}}
📍 Location: {{Location}}
👨‍💼 Interviewer: {{Interviewer}}

Please confirm your availability.

Best regards,
HR Team
```

## Example 6: Inventory Management Alerts

### Scenario
Low stock alerts for warehouse managers.

### Configuration
```
Bot Token: [Your Bot Token]
Form Sheet Name: Inventory Levels
Custom Title: Low Stock Alert
Excluded Columns: Vendor Info,Cost Price
Trigger Status: LOW_STOCK
Message Template: MINIMAL
Important Fields: Product Name,Current Stock,Minimum Level,Location
```

### Notification Result
```
🔔 *Low Stock Alert*

*Status*: LOW_STOCK
*Product Name*: Wireless Headphones
*Current Stock*: 5
*Minimum Level*: 10
*Location*: Warehouse A
```

## Best Practices

### 1. Message Template Selection
- **MINIMAL**: Quick alerts, mobile-friendly
- **DEFAULT**: Balanced information display
- **DETAILED**: Complex workflows, comprehensive data
- **COMPACT**: High-frequency notifications
- **PROFESSIONAL**: Client-facing or formal communications

### 2. Column Exclusion Strategy
- Exclude sensitive information (passwords, internal IDs)
- Remove redundant data (duplicate timestamps)
- Hide workflow-specific columns

### 3. Notification Timing
- Use appropriate trigger statuses
- Consider business hours for non-urgent notifications
- Set up different bots for different urgency levels

### 4. Error Handling
- Always test with sample data first
- Monitor logs for failed notifications
- Have fallback communication methods

### 5. Security Considerations
- Regularly rotate bot tokens
- Use private groups for sensitive notifications
- Implement proper access controls on sheets