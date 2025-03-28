import React from "react";
import "../styles/Footer.css";

const Footer = ({ isDarkMode }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-section">
            <h3 className="footer-heading">Wetter App</h3>
            <p className="footer-text">
              Alle Wetterdaten werden von OpenWeatherMap bereitgestellt. Die App
              verwendet das aktuelle Design im iOS-Stil.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Datenschutz</h3>
            <p className="footer-text">
              Diese App speichert nur Ihre Standortinformationen lokal in Ihrem
              Browser, um die Wettervorhersage für Ihren Standort anzuzeigen.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Wetter App. Alle Rechte vorbehalten.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Datenschutz
            </a>
            <a href="#" className="footer-link">
              Impressum
            </a>
            <a href="#" className="footer-link">
              Kontakt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
