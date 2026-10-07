import React, { useState } from 'react';
import { Search, ChevronDown, Phone, Mail, MessageSquare } from 'lucide-react';

const HelpSupport = () => {
  const [search, setSearch] = useState('');

  const faqs = [
    { category: 'Account', q: 'How do I reset my password?', a: 'If you have forgotten your password, go to the Login page and select "Forgot Password".\n\nEnter your registered email address or username and follow the password reset instructions.\n\nFor security, never share your password or verification code with anyone.\n\nPassword recovery is currently available through the account settings/support workflow.' },
    { category: 'Account', q: 'How do I update my email address?', a: 'Go to:\n\nProfile → Edit Profile\n\nUpdate your email address and select Save Changes.\n\nIf the system requires email verification, complete the verification process before the new email address becomes active.\n\nYour email address should be updated only for your own authenticated account.' },
    { category: 'Account', q: 'How do I create a MahaSeva account?', a: 'Select Register on the login page and provide the required account information. After successful registration, sign in using your registered credentials.' },
    { category: 'Services', q: 'What documents are required for an Income Certificate?', a: 'The required documents depend on the specific service configuration and applicant circumstances.\n\nFor the prototype, users should open:\n\nServices → Income Certificate → View Details\n\nThe Service Details page should display the current required documents configured for that service.\n\nUse the Service Details page as the authoritative source.' },
    { category: 'Services', q: 'How do I find a government service?', a: 'Open Services and use the search bar or department filters. You can search by service name, keyword, or department.' },
    { category: 'Services', q: 'Can I see the required documents before applying?', a: 'Yes. Open the service and select View Details. The Service Details page displays the available eligibility information, required documents, processing information and application process.' },
    { category: 'Applications', q: 'How long does an application take to process?', a: 'Processing time depends on the selected service and the responsible department.\n\nYou can view the expected processing time on:\n\nServices → Select Service → View Details\n\nAfter submitting an application, its current status can be monitored through:\n\nMy Applications\nor\nTrack Application' },
    { category: 'Applications', q: 'Can I edit my application after submission?', a: 'After an application has been submitted, editing availability depends on its current status and the workflow configured for that service.\n\nIf the application is still in an editable state, available editing options will be shown in My Applications.\n\nIf the application has already entered verification or officer processing, changes may not be permitted.\n\nUsers should check the application\'s current status and available actions.' },
    { category: 'Applications', q: 'Where can I see my submitted applications?', a: 'Open My Applications from the citizen sidebar. Only applications belonging to the authenticated citizen should be displayed.' },
    { category: 'Applications', q: 'What do the application statuses mean?', a: 'Draft:\nThe application has not yet been submitted.\n\nSubmitted:\nThe application has been successfully submitted.\n\nUnder Verification:\nDocuments or information are being verified.\n\nOfficer Review:\nThe application is being reviewed by the responsible officer.\n\nApproved:\nThe application has been approved.\n\nRejected:\nThe application has been rejected according to the department workflow.\n\nCompleted:\nThe application process has been completed.' },
    { category: 'Tracking', q: 'How do I track my application?', a: 'Go to:\n\nTrack Application\n\nEnter your Application ID to view the current application status.\n\nThe tracking timeline can show stages such as:\n\nApplication Submitted\n        ↓\nDocument Verification\n        ↓\nOfficer Review\n        ↓\nDepartment Decision\n        ↓\nCompleted\n\nThe timeline must reflect the application\'s actual status from the backend.' },
    { category: 'Notifications', q: 'Where can I see application updates?', a: 'Open Notifications from the sidebar. Application status changes and other relevant system notifications should appear there.' }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(search.toLowerCase()) || 
    faq.category.toLowerCase().includes(search.toLowerCase())
  );

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold gradient-text">Help & Support</h2>
        <p className="text-muted">Find answers to common questions or reach out to our support team.</p>
      </div>

      <div className="row g-5">
        <div className="col-lg-8">
          <div className="mb-4 position-relative">
            <Search className="position-absolute text-muted" style={{ left: '15px', top: '15px' }} size={20} />
            <input 
              type="text" 
              className="form-control form-control-lg ps-5 rounded-pill shadow-sm border-0" 
              placeholder="Search for answers..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <h4 className="fw-bold mb-4">Frequently Asked Questions</h4>
          
          <div className="accordion glass-card p-2" id="faqAccordion">
            {filteredFaqs.length === 0 ? (
              <div className="p-4 text-center text-muted">No matching FAQs found.</div>
            ) : (
              filteredFaqs.map((faq, idx) => (
                <div className="accordion-item bg-transparent border-0 mb-2" key={idx}>
                  <h2 className="accordion-header">
                    <button 
                      className={`accordion-button ${openIndex === idx ? '' : 'collapsed'} bg-white rounded shadow-sm`} 
                      type="button" 
                      onClick={() => toggleAccordion(idx)}
                    >
                      <span className="badge bg-primary bg-opacity-10 text-primary me-3">{faq.category}</span>
                      <span className="fw-medium text-dark">{faq.q}</span>
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse ${openIndex === idx ? 'show' : ''}`}>
                    <div className="accordion-body text-muted bg-light bg-opacity-50 rounded-bottom" style={{ whiteSpace: 'pre-wrap' }}>
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-card p-4 text-center mb-4 text-white bg-primary">
            <h5 className="fw-bold mb-3">Need more help?</h5>
            <p className="small mb-4 text-white-50">Our support team is available Monday to Friday, 9 AM - 6 PM.</p>
            <button className="btn btn-light rounded-pill w-100 text-primary fw-bold mb-2">
              <MessageSquare size={16} className="me-2" /> Report an Issue
            </button>
          </div>

          <div className="glass-card p-4">
            <h6 className="fw-bold mb-3 text-muted text-uppercase small">Contact Information</h6>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                <Phone size={18} />
              </div>
              <div>
                <div className="small text-muted">Toll-Free Helpline</div>
                <div className="fw-bold">1800-123-4567</div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                <Mail size={18} />
              </div>
              <div>
                <div className="small text-muted">Email Support</div>
                <div className="fw-bold">support@mahaseva.gov.in</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
