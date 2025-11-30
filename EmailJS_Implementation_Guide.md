# EmailJS Implementation Documentation

**Date:** November 30, 2025  
**Project:** Ploxi Consult Website  
**Email Service:** Gmail via EmailJS Free Tier

---

## 1. Overview

EmailJS is used to handle form submissions across the Ploxi Consult website, converting HTML forms into functional email submissions. The service enables direct email delivery from frontend forms to a designated Gmail inbox.

**Service Tier:** Free (2 templates allowed)

---

## 2. EmailJS Account Configuration

### 2.1 Service Setup
- **Service Type:** Gmail
- **Service ID:** `service_c2w4xmf`
- **Email Provider:** Gmail (configured for receiving emails)
- **Status:** Active and verified

### 2.2 Authentication Credentials
- **Public Key:** `xmHwfc1UG7CgjE5vV`
- **API Endpoint:** `https://api.emailjs.com/api/v1.0/email/send-form`

---

## 3. Templates Created (Free Tier: 2/2 Used)


### 3.1 Template 1: Contact Us & Book a Demo Form
- **Template ID:** `template_e9smoic`
- **Purpose:** Handle:
  - General contact inquiries
  - Book a Demo requests
- **Email Recipient:** Your designated email address (configured in EmailJS)
- **Variables Used:**
  - `{{user_name}}` - Sender's name
  - `{{user_email}}` - Sender's email address
  - `{{subject}}` - Email subject line (mainly for Contact Us)
  - `{{message}}` - Email message body

**Form Fields (Contact Us):**
```
✓ Your Name (required)
✓ Your Email (required)
✓ Subject (required)
✓ Message (required)
```

**Form Fields (Book a Demo):**
```
✓ Your Name (required)
✓ Your Email (required)
✓ Subject (required)
✓ Message (required)
```

**Template HTML:** Professional card layout showing sender details, subject (if provided), selected service (if provided), and full message content.

***

### 3.2 Template 2: Quote / Consultation Form
- **Template ID:** `template_j8hh8wg`
- **Purpose:** Handle Free Consultation / Quote requests
- **Email Recipient:** Your designated email address
- **Variables Used:**
  - `{{user_name}}` - Requester's name
  - `{{user_email}}` - Requester's email address
  - `{{service}}` - Selected service from dropdown
  - `{{message}}` - Additional comments

**Form Fields (Quote / Consultation Form):**
```
✓ Your Name (required)
✓ Your Email (required)
✓ Select A Service (dropdown with 7 options)
  - Business Growth & Strategy
  - Transaction Advisory
  - Sustainability Strategy
  - Audit & Compliance
  - Decarbonization Support
  - Climate Finance Structuring
  - Operational Improvement
✓ Comments (required)
```

## 4. Forms Implemented

### 4.1 Contact Us Form
- **Location:** Contact page (container-xxl py-6)
- **HTML Form ID:** `contact-form`
- **Submit Button ID:** `contact-submit`
- **Submission Behavior:**
  - Button shows "Sending..." during submission
  - Success: Alert message + form reset
  - Error: Alert message with retry option
  - Button text restores after completion

**Form HTML Structure:**
```html
<form id="contact-form">
  <input name="user_name" required>
  <input name="user_email" required>
  <input name="subject" required>
  <textarea name="message" required></textarea>
  <button type="submit" id="contact-submit">Send Message</button>
</form>
```

---

### 4.2 Quote/Consultation Form
- **Location:** Services/Quote section
- **HTML Form ID:** `contact-form` (shared)
- **Submit Button ID:** `contact-submit` (shared)
- **Unique Field:** Service dropdown (`name="service"`)
- **Hidden Field:** `name="form_type"` with value "Quote Request"

**Form HTML Structure:**
```html
<form id="contact-form">
  <input name="user_name" required>
  <input name="user_email" required>
  <select name="service" required>
    <!-- 7 service options -->
  </select>
  <input type="hidden" name="form_type" value="Quote Request">
  <textarea name="message" required></textarea>
  <button type="submit" id="contact-submit">Request Quote</button>
</form>
```

---

### 4.3 Book a Demo Form
- **Location:** Hero/CTA section (to be implemented)
- **HTML Form ID:** `contact-form` (shared)
- **Submit Button ID:** `contact-submit` (shared)
- **Hidden Field:** `name="form_type"` with value "Book a Demo"
- **Unique Field:** Service selection dropdown

**Form HTML Structure:**
```html
<form id="contact-form">
  <input name="user_name" required>
  <input name="user_email" required>
  <select name="service" required>
    <!-- Service options -->
  </select>
  <input type="hidden" name="form_type" value="Book a Demo">
  <textarea name="message" required></textarea>
  <button type="submit" id="contact-submit">Book Demo</button>
</form>
```

---

## 5. JavaScript Implementation

### 5.1 SDK Inclusion
```html
<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
```

### 5.2 Initialization Script
```javascript
// Initialize EmailJS with public key
(function() {
  emailjs.init("xmHwfc1UG7CgjE5vV");
})();

// Handle all form submissions with id="contact-form"
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const btn = document.getElementById("contact-submit");
  btn.disabled = true;
  btn.innerText = "Sending...";

  // Send form using the Gmail service and template
  emailjs.sendForm("service_c2w4xmf", "template_e9smoic", this)
    .then(function() {
      alert("Your message has been sent successfully!");
      btn.disabled = false;
      btn.innerText = "Send Message"; // or "Request Quote" / "Book Demo"
      document.getElementById("contact-form").reset();
    }, function(error) {
      console.error("FAILED...", error);
      alert("Sorry, there was an error sending your message. Please try again.");
      btn.disabled = false;
      btn.innerText = "Send Message"; // or "Request Quote" / "Book Demo"
    });
});
```

### 5.3 Execution Flow
1. User fills form with required fields
2. User clicks submit button
3. JavaScript intercepts form submission
4. Button text changes to "Sending..." and becomes disabled
5. EmailJS sends form data to Gmail service
6. Email is delivered to configured Gmail address
7. User receives success/error alert
8. Form fields are cleared
9. Button returns to normal state

---

## 6. Email Delivery Details

### 6.1 Email Template Display
**Subject Line:** Based on form submission

**Email Body Format:**
```
[Form Type] - New Contact Request from [User Name]

📋 DETAILS:
- From: [user_name]
- Email: [user_email] (clickable mailto link)
- Service: [selected_service] (if applicable)
- Time: [timestamp]

MESSAGE:
[Full message body]

---
Sent via: EmailJS | Ploxi Consult
```

### 6.2 Recipient Email
- **Primary Inbox:** Your configured Gmail account (set in EmailJS template)
- **CC/BCC:** None configured (can be added via EmailJS template settings)
- **Reply-To:** User's email address (via `{{user_email}}`)

---

## 7. Form Variable Mapping

| Form Field | HTML Name Attribute | Email Template Variable | Required |
|-----------|--------------------|-----------------------|----------|
| Name | user_name | {{user_name}} | Yes |
| Email | user_email | {{user_email}} | Yes |
| Subject | subject | {{subject}} | Yes* |
| Service | service | {{service}} | Yes** |
| Message | message | {{message}} | Yes |
| Form Type | form_type | {{form_type}} | No |
| Timestamp | time | {{time}} | No |

*Only in Contact Us form  
**Only in Quote/Demo forms

---

## 8. Current Limitations (Free Tier)

✗ Maximum 2 email templates (fully used)  
✗ No template creation for additional forms  
✗ Limited API calls per month  
✗ No advanced features (CC, BCC, attachments)  
✗ Single email service (Gmail only)

**Solution for More Forms:**
- Reuse existing templates with `form_type` hidden field
- Upgrade to paid plan for additional templates

---

## 9. Browser Compatibility

✓ Chrome/Edge (v90+)  
✓ Firefox (v88+)  
✓ Safari (v14+)  
✓ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 10. Security Considerations

### 10.1 Public Key Protection
- Public key `xmHwfc1UG7CgjE5vV` is intentionally public (frontend use)
- Service ID `service_c2w4xmf` is not sensitive
- Template ID `template_e9smoic` is not sensitive

### 10.2 Recommendations
- Validate form inputs on frontend (already done with `required` attribute)
- Consider rate limiting on production
- Monitor suspicious submission patterns in Gmail
- Keep EmailJS SDK updated

---

## 11. Maintenance & Monitoring

### 11.1 Testing
- Test forms after deployment changes
- Verify email delivery to Gmail inbox
- Check spam folder for missed emails
- Test form reset after successful submission

### 11.2 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Form not submitting | Missing `id="contact-form"` | Verify HTML form ID |
| No email received | Wrong template ID | Check `template_e9smoic` in code |
| Button stays disabled | JS error | Check browser console |
| Emails in spam | Gmail filters | Add sender email to contacts |
| Variables not filling | Name attribute mismatch | Match form `name` to `{{variable}}` |

---

## 12. Future Enhancements

### 12.1 With Paid Plan
- Create separate templates for different forms
- Add CC/BCC functionality
- Implement email attachments
- Advanced scheduling

### 12.2 Recommended Upgrades
- Upgrade to Pro plan ($14.99/month) for:
  - Unlimited templates
  - Unlimited monthly emails
  - Email forwarding
  - Advanced support

---

## 13. Contact & Support

- **EmailJS Dashboard:** https://dashboard.emailjs.com
- **Documentation:** https://www.emailjs.com/docs/
- **Support Email:** support@emailjs.com

---

**Document Version:** 1.0  
**Last Updated:** November 30, 2025  
**Next Review:** When upgrading to paid plan or adding new forms