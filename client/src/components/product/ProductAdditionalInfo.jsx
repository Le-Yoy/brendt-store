// src/components/product/ProductAdditionalInfo.jsx
'use client';

import { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import styles from './ProductAdditionalInfo.module.css';

export default function ProductAdditionalInfo({ product }) {
  const [activeInfoPanel, setActiveInfoPanel] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  const infoPanels = [
    {
      id: 'shipping',
      title: 'Livraison & Retours',
      content: (
        <>
          <h3>Livraison</h3>
          <p>Livraison gratuite dans tout le Maroc sous 2-3 jours ouvrables.</p>
          <p>Livraison internationale disponible vers select pays dans un délai de 5-10 jours ouvrables.</p>
          
          <h3>Retours</h3>
          <p>Retours acceptés sous 14 jours à condition que les articles soient dans leur état d'origine, propres et non utilisés.</p>
          <p>Les frais de retour sont à la charge du client pour les retours standard.</p>
        </>
      )
    },
    {
      id: 'payment',
      title: 'Paiement sécurisé',
      content: (
        <>
          <h3>Options de paiement</h3>
          <p>Profitez d'une remise de 20% pour tout paiement en ligne.</p>
          <p>Au Maroc, vous pouvez payer à la livraison ou par carte bancaire en ligne.</p>
          <p>Pour les commandes internationales, seul le paiement par carte est accepté.</p>
          
          <h3>Sécurité</h3>
          <p>Toutes les transactions sont sécurisées avec un cryptage SSL 256-bit.</p>
          <p>Nous ne stockons jamais vos informations de paiement.</p>
        </>
      )
    },
    {
      id: 'contact',
      title: 'Nous contacter',
      content: (
        <>
          <h3>Service Client</h3>
          <p>WhatsApp: +212 600 000 000</p>
          <p>Email: service@brendt-project.com</p>
          <p>Disponible du lundi au samedi de 9h à 18h</p>
          
          <h3>Demandes Spéciales</h3>
          <p>Pour toute demande spéciale ou personnalisation, n'hésitez pas à nous contacter directement.</p>
          <a href="/contactez-nous" className={styles.contactLink}>Contactez-nous &rarr;</a>
        </>
      )
    }
  ];
  
  const accordions = [
    {
      id: 'features',
      title: 'Caractéristiques',
      content: (
        <ul className={styles.featuresList}>
          {product.details && product.details.map((detail, index) => (
            <li key={`detail-${index}`}>{detail}</li>
          ))}
        </ul>
      )
    },
    {
      id: 'care',
      title: 'Entretien',
      content: (
        <div className={styles.careInstructions}>
          {product.care ? (
            <p>{product.care}</p>
          ) : (
            <>
              <p>Pour maintenir la qualité et prolonger la durée de vie de votre article:</p>
              <ul>
                <li>Nettoyez avec un chiffon doux et sec</li>
                <li>Évitez l'exposition prolongée à la lumière directe du soleil</li>
                <li>Stockez dans un endroit sec et à l'abri de l'humidité</li>
                <li>Utilisez des embauchoirs en cèdre pour conserver la forme des chaussures</li>
              </ul>
            </>
          )}
        </div>
      )
    },
    {
      id: 'help',
      title: 'Besoin daide',
      content: (
        <div className={styles.helpContent}>
          <p>Notre équipe de service client est disponible pour répondre à toutes vos questions.</p>
          <p>Vous pouvez nous contacter par:</p>
          <ul>
            <li>WhatsApp: +212 600 000 000</li>
            <li>Email: service@brendt-project.com</li>
          </ul>
          <p>Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      )
    },
    {
      id: 'sizing',
      title: 'Guide des tailles',
      content: (
        <div className={styles.sizingGuide}>
          <p>Pour choisir la taille qui vous convient le mieux:</p>
          <table className={styles.sizeTable}>
            <thead>
              <tr>
                <th>Taille EU</th>
                <th>Taille UK</th>
                <th>Taille US</th>
                <th>Longueur (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>39</td><td>5</td><td>6</td><td>24.5</td></tr>
              <tr><td>40</td><td>6</td><td>7</td><td>25.1</td></tr>
              <tr><td>41</td><td>7</td><td>8</td><td>25.7</td></tr>
              <tr><td>42</td><td>8</td><td>9</td><td>26.3</td></tr>
              <tr><td>43</td><td>9</td><td>10</td><td>26.9</td></tr>
              <tr><td>44</td><td>10</td><td>11</td><td>27.5</td></tr>
              <tr><td>45</td><td>11</td><td>12</td><td>28.1</td></tr>
              <tr><td>46</td><td>12</td><td>13</td><td>28.7</td></tr>
            </tbody>
          </table>
          <p>En cas de doute, nous recommandons de prendre la taille supérieure.</p>
        </div>
      )
    }
  ];
  
  const toggleInfoPanel = (panelId) => {
    if (activeInfoPanel === panelId) {
      setActiveInfoPanel(null);
    } else {
      setActiveInfoPanel(panelId);
    }
  };
  
  const toggleAccordion = (accordionId) => {
    if (activeAccordion === accordionId) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(accordionId);
    }
  };
  
  return (
    <div className={styles.additionalInfoContainer}>
      {/* Description */}
      <div className={styles.productDescription}>
        <p>{product.description}</p>
        {/* Can add show more/less toggle here if description is long */}
      </div>
      
      <div className={styles.divider}></div>
      
      {/* Info Panels */}
      <div className={styles.infoPanels}>
        {infoPanels.map((panel) => (
          <div key={panel.id} className={styles.infoPanel}>
            <button 
              className={styles.infoPanelButton}
              onClick={() => toggleInfoPanel(panel.id)}
            >
              <span>{panel.title}</span>
              <IoIosArrowForward className={activeInfoPanel === panel.id ? styles.arrowRotated : ''} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Info Panel Content - Slides in from right */}
      {activeInfoPanel && (
        <div className={styles.infoPanelOverlay} onClick={() => setActiveInfoPanel(null)}>
          <div 
            className={styles.infoPanelContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.closePanel} 
              onClick={() => setActiveInfoPanel(null)}
            >
              &times;
            </button>
            <h2>{infoPanels.find(p => p.id === activeInfoPanel)?.title}</h2>
            <div className={styles.panelContentBody}>
              {infoPanels.find(p => p.id === activeInfoPanel)?.content}
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.divider}></div>
      
      {/* Accordions */}
      <div className={styles.accordionContainer}>
        {accordions.map((accordion) => (
          <div 
            key={accordion.id} 
            className={`${styles.accordion} ${activeAccordion === accordion.id ? styles.activeAccordion : ''}`}
          >
            <button 
              className={styles.accordionHeader}
              onClick={() => toggleAccordion(accordion.id)}
            >
              <span>{accordion.title}</span>
              <span className={styles.accordionIcon}>
                {activeAccordion === accordion.id ? '−' : '+'}
              </span>
            </button>
            
            <div className={`${styles.accordionContent} ${activeAccordion === accordion.id ? styles.accordionExpanded : ''}`}>
              {accordion.content}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.centerDivider}>
        <div className={styles.dividerTop}></div>
        <div className={styles.dividerMiddle}></div>
        <div className={styles.dividerBottom}></div>
      </div>
    </div>
  );
}