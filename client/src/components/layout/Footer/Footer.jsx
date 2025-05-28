import './Footer.css';
// src/components/layout/Footer/Footer.jsx
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email) {
      setError('Veuillez entrer votre adresse e-mail.');
      return;
    }
    
    if (!isChecked) {
      setError('Veuillez accepter la politique de confidentialité.');
      return;
    }
    
    // For now, just simulate success
    setSubscribed(true);
    setEmail('');
    setIsChecked(false);
    
    // Reset the success message after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <>
      {/* Pre-Footer */}
      <section className="pre-footer">
        <div className="container">
          <div className="pre-footer__content">
            <div className="pre-footer__newsletter">
              <h3 className="pre-footer__heading">Inscrivez-vous à notre newsletter</h3>
              <p className="pre-footer__text">
                Recevez notre newsletter et découvrez notre univers, nos collections et notre actualité.
              </p>
              
              <form className="pre-footer__form" onSubmit={handleSubmit}>
                <div className="pre-footer__input-group">
                  <input 
                    type="email" 
                    className="pre-footer__input" 
                    placeholder="Votre adresse e-mail" 
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                
                <div className="pre-footer__checkbox-group">
                  <input 
                    type="checkbox" 
                    id="privacy-consent" 
                    className="pre-footer__checkbox" 
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="privacy-consent" className="pre-footer__checkbox-label">
                    Je prends acte que mon adresse de courriel sera traitée par BRENDT conformément à la Politique de Confidentialité.
                  </label>
                </div>
                
                {error && <p className="pre-footer__error">{error}</p>}
                {subscribed && <p className="pre-footer__success">Merci de votre inscription à notre newsletter !</p>}
                
                <button type="submit" className="pre-footer__submit">S'inscrire</button>
              </form>
            </div>
            
            <div className="pre-footer__links">
  <div className="pre-footer__links-column">
    <h4 className="pre-footer__links-heading">Nous contacter</h4>
    <ul className="pre-footer__links-list">
      <li className="pre-footer__links-item">
        <Link href="/contact" className="pre-footer__link">Nous contacter</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/faq?category=garantie" className="pre-footer__link">Garantie</Link>
      </li>
    </ul>
    
    <h4 className="pre-footer__links-heading">La Maison</h4>
    <ul className="pre-footer__links-list">
      <li className="pre-footer__links-item">
        <Link href="/savoir-faire" className="pre-footer__link">Notre Savoir Faire</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/cadeaux-pour-lui" className="pre-footer__link">Gift Guide</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/textile-universe" className="pre-footer__link">BRENDT Textile</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/interieurs" className="pre-footer__link">Intérieurs BRENDT</Link>
      </li>
    </ul>
  </div>
  
  <div className="pre-footer__links-column">
    <h4 className="pre-footer__links-heading">Services</h4>
    <ul className="pre-footer__links-list">
      <li className="pre-footer__links-item">
        <Link href="/faq?category=achat-produits" className="pre-footer__link">Achat de Nos Produits</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/faq?category=gift-card" className="pre-footer__link">Gift Cards</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/faq?category=retours-echanges" className="pre-footer__link">Retours et échanges</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/faq?category=achat-cadeaux" className="pre-footer__link">Achat De Cadeaux</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/faq?category=emballage-expedition" className="pre-footer__link">Livraisons</Link>
      </li>
    </ul>
    
    <h4 className="pre-footer__links-heading">Mentions légales & Cookies</h4>
    <ul className="pre-footer__links-list">
      <li className="pre-footer__links-item">
        <Link href="/compliance" className="pre-footer__link">Compliance</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/privacy" className="pre-footer__link">Privacy & Cookie</Link>
      </li>
      <li className="pre-footer__links-item">
        <Link href="/accessibilite" className="pre-footer__link">Accessibilité</Link>
      </li>
    </ul>
  </div>
</div>
          </div>
        </div>
      </section>
      
      {/* Main Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__content">
            <div className="footer__language">
              <select className="footer__language-select">
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
              </select>
            </div>
            
            <div className="footer__brand">
              <div className="footer__logo">
                <Image 
                  src="/assets/images/logos/brendt-complet-logo.svg" 
                  alt="BRENDT" 
                  width={120} 
                  height={40}
                />
              </div>
              <p className="footer__copyright">
                © 2025 BRENDT. Tous droits réservés.
              </p>
            </div>
            
            <div className="footer__social">
              <ul className="footer__social-list">
                <li className="footer__social-item">
                  <a 
                    href="https://www.instagram.com/brendt.store/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer__social-link"
                  >
                    Instagram
                  </a>
                </li>
                <li className="footer__social-item">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100076832192980" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer__social-link"
                  >
                    Facebook
                  </a>
                </li>
                <li className="footer__social-item">
                  <a 
                    href="https://wa.me/33773436514" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer__social-link"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;