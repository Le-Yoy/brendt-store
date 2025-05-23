'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './SavoirFaire.module.css';

export default function SavoirFaire() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    intro: useRef(null),
    materials: useRef(null),
    techniques: useRef(null),
    mastersEye: useRef(null),
    heritage: useRef(null),
    environment: useRef(null),
  };

  // Handle scroll events for animations and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;
      
      // Check which section is currently in view
      Object.entries(sectionRefs).forEach(([section, ref]) => {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop;
          const height = ref.current.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
          }
          
          // Check if elements should be visible (for fade-in animations)
          setIsVisible(prev => ({
            ...prev,
            [section]: scrollPosition >= offsetTop - window.innerHeight * 0.2
          }));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.savoirFaire}>
      {/* Navigation */}
      <nav className={styles.craftNavigation}>
        <div className={styles.navWrapper}>
          <span className={`${styles.navItem} ${activeSection === 'intro' ? styles.active : ''}`}>
            Introduction
          </span>
          <span className={`${styles.navItem} ${activeSection === 'materials' ? styles.active : ''}`}>
            Matières Premières
          </span>
          <span className={`${styles.navItem} ${activeSection === 'techniques' ? styles.active : ''}`}>
            Techniques Ancestrales
          </span>
          <span className={`${styles.navItem} ${activeSection === 'mastersEye' ? styles.active : ''}`}>
            L'Oeil du Maître
          </span>
          <span className={`${styles.navItem} ${activeSection === 'heritage' ? styles.active : ''}`}>
            Héritage et Innovation
          </span>
          <span className={`${styles.navItem} ${activeSection === 'environment' ? styles.active : ''}`}>
            Respect de la Nature
          </span>
        </div>
      </nav>
      
      {/* Introduction/Hero Section */}
      <section 
        ref={sectionRefs.intro} 
        className={`${styles.heroSection} ${isVisible.intro ? styles.visible : ''}`}
      >
        <div className={styles.heroImageContainer}>
          <Image 
            src="/assets/images/savoir/82.webp" 
            alt="Atelier & Derby Shoes" 
            fill
            priority 
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>L'Art du Savoir-Faire</h1>
          <p className={styles.heroSubtitle}>Chaque paire raconte l'histoire de nos mains</p>
          <div className={styles.scrollIndicator}>
            <span></span>
          </div>
        </div>
      </section>
      
      {/* Matières Premières (Materials) Section */}
      <section 
        ref={sectionRefs.materials} 
        className={`${styles.materialsSection} ${isVisible.materials ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Matières Premières</h2>
          <p>Le commencement de l'excellence</p>
        </div>
        
        <div className={styles.materialsGallery}>
          <div className={styles.materialCard}>
            <div className={styles.materialImageContainer}>
              <Image 
                src="/assets/images/savoir/85.webp" 
                alt="Traditional Tools" 
                width={400} 
                height={300} 
                className={styles.materialImage}
              />
            </div>
            <div className={styles.materialInfo}>
              <h3>Cuir Pleine Fleur</h3>
              <p>Sélectionné pour sa texture naturelle et sa capacité à développer une patine unique au fil du temps.</p>
              <span className={styles.materialOrigin}>Origine: Tanneries du Puy, France</span>
            </div>
          </div>
          
          <div className={styles.materialCard}>
            <div className={styles.materialImageContainer}>
              <Image 
                src="/assets/images/savoir/85.webp" 
                alt="Traditional Tools Detail" 
                width={400} 
                height={300} 
                className={styles.materialImage}
              />
            </div>
            <div className={styles.materialInfo}>
              <h3>Fil de Lin Ciré</h3>
              <p>Renforcé à la cire d'abeille pour une durabilité exceptionnelle et une résistance à l'humidité.</p>
              <span className={styles.materialOrigin}>Origine: Normandie, France</span>
            </div>
          </div>
          
          <div className={styles.materialCard}>
            <div className={styles.materialImageContainer}>
              <Image 
                src="/assets/images/savoir/86.webp" 
                alt="Leather Tools" 
                width={400} 
                height={300} 
                className={styles.materialImage}
              />
            </div>
            <div className={styles.materialInfo}>
              <h3>Bois de Hêtre</h3>
              <p>Taillé et poli à la main pour créer des formes parfaitement adaptées à l'anatomie du pied.</p>
              <span className={styles.materialOrigin}>Origine: Forêt des Vosges, France</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Techniques Ancestrales (Ancestral Techniques) Section */}
      <section 
        ref={sectionRefs.techniques} 
        className={`${styles.techniquesSection} ${isVisible.techniques ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Techniques Ancestrales</h2>
          <p>Le geste précis transmis de génération en génération</p>
        </div>
        
        <div className={styles.techniqueDisplay}>
          <div className={styles.techniqueImage}>
            <Image 
              src="/assets/images/savoir/83.webp" 
              alt="Craftsman Cleaning Derby" 
              width={600} 
              height={800} 
              className={styles.techniqueMainImage}
            />
          </div>
          
          <div className={styles.techniqueDetails}>
            <div className={styles.techniqueItem}>
              <h3>Couture Goodyear</h3>
              <p>Une technique de montage qui permet à la chaussure d'être resolée plusieurs fois, prolongeant sa durée de vie pour des décennies.</p>
              <div className={styles.techniqueDiagram}></div>
            </div>
            
            <div className={styles.techniqueItem}>
              <h3>Teinture à la Main</h3>
              <p>Chaque paire reçoit plusieurs couches de teinture appliquées à la main, créant une profondeur de couleur inimitable.</p>
            </div>
            
            <div className={styles.techniqueItem}>
              <h3>Polissage à l'Ancienne</h3>
              <p>Le cuir est patiemment poli avec des crèmes naturelles et un os de cerf, révélant la beauté inhérente du matériau.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* L'Oeil du Maître (The Master's Eye) Section */}
      <section 
        ref={sectionRefs.mastersEye} 
        className={`${styles.mastersEyeSection} ${isVisible.mastersEye ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>L'Oeil du Maître</h2>
          <p>La perfection dans chaque détail</p>
        </div>
        
        <div className={styles.mastersEyeContent}>
          <div className={styles.craftingImageContainer}>
            <Image 
              src="/assets/images/savoir/84.webp" 
              alt="Hand Crafting" 
              width={800} 
              height={800} 
              className={styles.craftingImage}
            />
            <div className={styles.craftingHotspots}>
              <span className={styles.hotspot} style={{ top: '25%', left: '40%' }}></span>
              <span className={styles.hotspot} style={{ top: '60%', left: '70%' }}></span>
              <span className={styles.hotspot} style={{ top: '75%', left: '30%' }}></span>
            </div>
          </div>
          
          <div className={styles.craftingJournal}>
            <div className={styles.journalEntry}>
              <h3>Inspection Minutieuse</h3>
              <p>Chaque paire est examinée sous plusieurs angles et sources de lumière pour détecter la moindre imperfection.</p>
            </div>
            
            <div className={styles.journalEntry}>
              <h3>Sélection du Cuir</h3>
              <p>Seules les sections les plus parfaites de chaque peau sont utilisées, garantissant la longévité et la beauté.</p>
            </div>
            
            <div className={styles.journalEntry}>
              <h3>Finition à la Main</h3>
              <p>Les dernières étapes sont toujours réalisées à la main, assurant une finition que nulle machine ne peut égaler.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Héritage et Innovation (Heritage and Innovation) Section */}
      <section 
        ref={sectionRefs.heritage} 
        className={`${styles.heritageSection} ${isVisible.heritage ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Héritage et Innovation</h2>
          <p>Le respect du passé, le regard vers l'avenir</p>
        </div>
        
        <div className={styles.heritageContent}>
          <div className={styles.heritageMachine}>
            <Image 
              src="/assets/images/savoir/86.webp" 
              alt="Tailor Machine" 
              width={500} 
              height={800} 
              className={styles.heritageImage}
            />
          </div>
          
          <div className={styles.heritageText}>
            <div className={styles.heritageCompare}>
              <div className={styles.heritageThen}>
                <h3>Hier</h3>
                <p>Les outils et techniques transmis par des générations de maîtres bottiers, préservant un savoir-faire séculaire.</p>
              </div>
              
              <div className={styles.heritageNow}>
                <h3>Aujourd'hui</h3>
                <p>L'adoption sélective de technologies modernes qui respectent l'intégrité du processus artisanal.</p>
              </div>
            </div>
            
            <div className={styles.heritageQuote}>
              <blockquote>
                "Notre innovation la plus significative est notre fidélité aux méthodes qui ont fait leurs preuves."
              </blockquote>
              <cite>— Maître Artisan</cite>
            </div>
          </div>
        </div>
      </section>
      
      {/* Respect de la Nature (Environmental Respect) Section */}
      <section 
        ref={sectionRefs.environment} 
        className={`${styles.environmentSection} ${isVisible.environment ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Respect de la Nature</h2>
          <p>Une création en harmonie avec notre environnement</p>
        </div>
        
        <div className={styles.environmentContent}>
          <div className={styles.environmentCircle}>
            <div className={styles.circleSegment}>
              <h3>Cuir Végétal</h3>
              <p>Tanné uniquement avec des extraits végétaux, sans produits chimiques nocifs.</p>
            </div>
            
            <div className={styles.circleSegment}>
              <h3>Élevage Éthique</h3>
              <p>Partenariat exclusif avec des éleveurs pratiquant des méthodes durables et respectueuses.</p>
            </div>
            
            <div className={styles.circleSegment}>
              <h3>Zéro Déchet</h3>
              <p>Chaque chute de matière est réutilisée ou transformée en produits complémentaires.</p>
            </div>
            
            <div className={styles.circleSegment}>
              <h3>Artisanat Local</h3>
              <p>Production exclusivement locale, réduisant l'empreinte carbone et soutenant les communautés artisanales.</p>
            </div>
          </div>
          
          <div className={styles.environmentPledge}>
            <h3>Notre Engagement</h3>
            <p>Une chaussure BRENDT n'est pas seulement un investissement dans votre garde-robe, mais aussi dans un avenir plus durable pour notre planète.</p>
          </div>
        </div>
      </section>
    </div>
  );
}