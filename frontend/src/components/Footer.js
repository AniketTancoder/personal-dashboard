import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          🚀 Built by Aniket Patil | 
          deployed via CI/CD to AWS EKS | 
          {new Date().getFullYear()}
        </p>
        <div className="footer-links">
            <span className="footer-status">Status: Operational</span>
            <span className="footer-version">Version: 1.0.1</span> {/* Changed from 1.0.0 to 1.0.1 */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;