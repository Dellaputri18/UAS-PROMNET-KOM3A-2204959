import React from 'react';
import './style.css'

function FooterComponent() {
  return (
    <footer className="footer mt-auto py-3 text-white">
      <div className="container text-center">
        <span className="footer-text">
          Inventory made by {' '}
          <a
            href="https://instagram.com/dellaputrw"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            @dellaputrw
          </a>{' '}
          | Pendidikan Ilmu Komputer UPI
        </span>
      </div>
    </footer>
  );
}

export default FooterComponent;
