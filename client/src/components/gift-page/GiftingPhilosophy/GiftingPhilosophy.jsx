import React, { forwardRef, useEffect, useRef, useState } from 'react';
import styles from './GiftingPhilosophy.module.css';

const GiftingPhilosophy = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <section ref={ref} className={styles.philosophySection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>Notre Philosophie du Cadeau</h2>
          <p>L'art d'offrir une expression durable de considération</p>
        </div>
        
        <div 
          ref={contentRef} 
          className={`${styles.philosophyContent} ${isVisible ? styles.visible : ''}`}
        >
          <div className={styles.philosophyColumns}>
            <div className={styles.textColumn}>
              <p className={styles.leadParagraph}>
                Dans notre vision, un cadeau transcende sa matérialité pour devenir porteur de sens et d'émotion. C'est pourquoi chaque création BRENDT est conçue non seulement comme un produit d'exception, mais comme un vecteur d'attention qui traversera le temps.
              </p>
              
              <div className={styles.philosophyPoint}>
                <h3>L'Excellence comme Fondement</h3>
                <p>
                  Un véritable cadeau se distingue par son excellence intrinsèque. Nos créations sont le fruit d'un savoir-faire raffiné et de matières sélectionnées avec la plus grande exigence. Cette excellence constitue le socle de l'émotion que génère un présent digne de ce nom.
                </p>
              </div>
              
              <div className={styles.philosophyPoint}>
                <h3>La Pérennité comme Promesse</h3>
                <p>
                  L'authenticité d'un cadeau réside dans sa capacité à traverser les années. Nos pièces sont conçues pour développer une patine unique et s'embellir au fil du temps, devenant ainsi les témoins précieux d'une attention offerte un jour particulier.
                </p>
              </div>
            </div>
            
            <div className={styles.textColumn}>
              <div className={styles.philosophyPoint}>
                <h3>L'Intention comme Essence</h3>
                <p>
                  L'acte d'offrir révèle une intention, une considération particulière pour son destinataire. Nos créations sont pensées pour exprimer cette intention avec justesse, qu'il s'agisse de célébrer une réussite, de manifester une gratitude ou de marquer un moment significatif.
                </p>
              </div>
              
              <div className={styles.philosophyPoint}>
                <h3>L'Individualité comme Signature</h3>
                <p>
                  Un cadeau véritable résonne avec la personnalité unique de celui qui le reçoit. Notre diversité de styles et notre attention aux détails permettent cette rencontre subtile entre une création d'exception et la singularité de son destinataire.
                </p>
              </div>
              
              <blockquote className={styles.philosophyQuote}>
                "Offrir n'est pas seulement un geste, c'est un art qui s'exprime à travers le choix d'un objet capable de traverser le temps tout en portant une émotion éternelle."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

GiftingPhilosophy.displayName = 'GiftingPhilosophy';

export default GiftingPhilosophy;