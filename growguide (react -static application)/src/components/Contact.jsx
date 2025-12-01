import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="contact-content p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h1 className="display-4 mb-4 text-center text-dark">Contact Us</h1>
            <p className="lead text-center text-muted">Have questions or feedback? We'd love to hear from you!</p>
            <p className="text-muted text-center">We're here to assist you with any inquiries you may have about plant care, gardening tips, or using our website. Feel free to reach out to us via the contact form below or through our email address.</p>
            <p className="text-muted text-center mb-4">Please allow us some time to respond to your message, as we strive to provide thorough and helpful assistance to each inquiry we receive.</p>
            <h2 className="text-dark text-center mb-3">Email Addresses:</h2>
            <ul className="list-unstyled text-center">
              <li className="mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                <a href="mailto:2211CS010264@mallareddyuniversity.ac.in" className="text-muted">2211CS010264@mallareddyuniversity.ac.in</a>
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                <a href="mailto:2211CS010192@mallareddyuniversity.ac.in" className="text-muted">2211CS010192@mallareddyuniversity.ac.in</a>
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                <a href="mailto:2211CS010244@mallareddyuniversity.ac.in" className="text-muted">2211CS010244@mallareddyuniversity.ac.in</a>
              </li>
              <li className="mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                <a href="mailto:2211CS010715@mallareddyuniversity.ac.in" className="text-muted">2211CS010715@mallareddyuniversity.ac.in</a>
              </li>
              {/* Add more email addresses if needed */}
            </ul>
          </div>
        </div>
      </div>
      {/* Add your contact form component or additional contact information here */}
      <div className="row justify-content-center mt-4">
        <div className="col-lg-8">
          {/* Placeholder for a contact form */}
          <div className="contact-form-placeholder p-4" style={{ backgroundColor: '#e9ecef', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3 className="text-center text-dark">Contact Form Coming Soon</h3>
            <p className="text-muted text-center">We're working on adding a contact form to make it even easier for you to reach out to us. Stay tuned!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
