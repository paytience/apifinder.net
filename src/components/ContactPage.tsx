import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
  };

  return (
    <div className="static-page">
      <div className="static-page-container">
        <div className="static-page-header">
          <h1>Contact Us</h1>
          <p>Get in touch with the API Finder team</p>
        </div>

        <div className="static-page-content">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Have a question, suggestion, or need help? We'd love to hear from you. 
                Send us a message and we'll get back to you as soon as possible.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <h3>📧 Email Support</h3>
                  <p>For general inquiries and support</p>
                  <a href="mailto:support@apifinder.net">support@apifinder.net</a>
                </div>
                
                <div className="contact-method">
                  <h3>💼 Business Inquiries</h3>
                  <p>For partnerships and business opportunities</p>
                  <a href="mailto:business@apifinder.net">business@apifinder.net</a>
                </div>
                
                <div className="contact-method">
                  <h3>🐛 Bug Reports</h3>
                  <p>Found a bug? Let us know!</p>
                  <a href="mailto:bugs@apifinder.net">bugs@apifinder.net</a>
                </div>
              </div>
            </div>

            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="business">Business Inquiry</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-textarea"
                    rows={6}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="static-page-footer">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
