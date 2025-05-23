'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './TextileUniverse.module.css';

export default function TextileUniverse() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isVisible, setIsVisible] = useState({});
  const [activeLeatherIndex, setActiveLeatherIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const leatherTypes = [
    { color: 'Noir Intense', properties: 'Cuir de veau pleine fleur avec finition semi-brillante. Résistant aux éraflures et développe une patine profonde.' },
    { color: 'Cognac', properties: 'Cuir de veau teinté à la main. Chaleureux et polyvalent, vieillit avec élégance.' },
    { color: 'Bordeaux', properties: 'Cuir de veau avec teinture végétale. Profondeur de couleur exceptionnelle et texture riche.' },
    { color: 'Brun Châtaigne', properties: 'Cuir pleine fleur avec finition cirée. Doux au toucher avec un caractère rustique raffiné.' },
    { color: 'Marine', properties: 'Cuir de veau italien avec tannage végétal. Élégant et polyvalent pour toutes occasions.' },
    { color: 'Taupe', properties: 'Cuir de veau avec finition aniline. Teinte subtile et neutre qui se marie avec tout.' }
  ];

  const sectionRefs = {
    intro: useRef(null),
    leather: useRef(null),
    crocodile: useRef(null),
    varieties: useRef(null),
    wool: useRef(null),
    suede: useRef(null),
    heritage: useRef(null),
    properties: useRef(null),
    sustainability: useRef(null),
    care: useRef(null),
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

  // Auto-rotate through leather colors
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLeatherIndex(prev => (prev + 1) % leatherTypes.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [leatherTypes.length]);

  // Handle magnification position for crocodile leather
  const handleMouseMove = (e) => {
    if (!sectionRefs.crocodile.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleTouchMove = (e) => {
    if (!sectionRefs.crocodile.current || !e.touches[0]) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  // Handle navigation clicks
  const scrollToSection = (sectionId) => {
    const section = sectionRefs[sectionId].current;
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Adjust for the sticky header
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.textileUniverse}>
      {/* Navigation */}
      <nav className={styles.materialNavigation}>
        <div className={styles.navWrapper}>
          <span 
            className={`${styles.navItem} ${activeSection === 'intro' ? styles.active : ''}`}
            onClick={() => scrollToSection('intro')}
          >
            Introduction
          </span>
          <span 
            className={`${styles.navItem} ${activeSection === 'leather' ? styles.active : ''}`}
            onClick={() => scrollToSection('leather')}
          >
            Cuir
          </span>
          <span 
            className={`${styles.navItem} ${activeSection === 'crocodile' ? styles.active : ''}`}
            onClick={() => scrollToSection('crocodile')}
          >
            Cuir de Crocodile
          </span>
          <span 
            className={`${styles.navItem} ${activeSection === 'varieties' ? styles.active : ''}`}
            onClick={() => scrollToSection('varieties')}
          >
            Variétés de Cuir
          </span>
          <span 
            className={`${styles.navItem} ${activeSection === 'wool' ? styles.active : ''}`}
            onClick={() => scrollToSection('wool')}
          >
            Laine
          </span>
          <span 
            className={`${styles.navItem} ${activeSection === 'suede' ? styles.active : ''}`}
            onClick={() => scrollToSection('suede')}
          >
            Artisanat du Daim
          </span>
          <span 
            className={`${styles.navItem} ${activeSection === 'heritage' || activeSection === 'properties' || activeSection === 'sustainability' || activeSection === 'care' ? styles.active : ''}`}
            onClick={() => scrollToSection('heritage')}
          >
            Plus
          </span>
        </div>
      </nav>
      
      {/* Introduction Section */}
      <section 
        ref={sectionRefs.intro} 
        className={`${styles.introSection} ${isVisible.intro ? styles.visible : ''}`}
      >
        <div className={styles.introContent}>
          <h1 className={styles.introTitle}>Notre Univers Textile</h1>
          <p className={styles.introText}>
            La fondation de notre savoir-faire commence par la sélection méticuleuse de matières d'exception
          </p>
          <div className={styles.materialSwatches}>
            <div className={styles.materialSwatch} data-material="cuir" onClick={() => scrollToSection('leather')}></div>
            <div className={styles.materialSwatch} data-material="crocodile" onClick={() => scrollToSection('crocodile')}></div>
            <div className={styles.materialSwatch} data-material="daim" onClick={() => scrollToSection('suede')}></div>
            <div className={styles.materialSwatch} data-material="laine" onClick={() => scrollToSection('wool')}></div>
          </div>
          <div className={styles.scrollPrompt}>
            <span>Explorez nos matières</span>
            <div className={styles.scrollIndicator}><span></span></div>
          </div>
        </div>
      </section>
      
      {/* Cuir (Leather) Section */}
      <section 
        ref={sectionRefs.leather} 
        className={`${styles.leatherSection} ${isVisible.leather ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Cuir</h2>
          <p>La quintessence de l'élégance et de la durabilité</p>
        </div>
        
        <div className={styles.leatherShowcase}>
          <div className={styles.leatherVisual}>
            <Image 
              src="/assets/images/savoir/sixcolorsofleather.webp" 
              alt="Six varieties of premium leather" 
              width={1000} 
              height={600} 
              className={styles.leatherImage}
            />
            <div className={styles.leatherColorPoints}>
              {leatherTypes.map((leather, index) => (
                <button 
                  key={index}
                  className={`${styles.colorPoint} ${index === activeLeatherIndex ? styles.active : ''}`}
                  style={{ left: `${(index * 16) + 10}%` }}
                  onClick={() => setActiveLeatherIndex(index)}
                  aria-label={`View ${leather.color} leather`}
                ></button>
              ))}
            </div>
          </div>
          
          <div className={styles.leatherInfo}>
            <div className={styles.leatherColorPreview} data-color={activeLeatherIndex}>
              <div className={styles.colorName}>{leatherTypes[activeLeatherIndex].color}</div>
            </div>
            <div className={styles.leatherProperties}>
              <p>{leatherTypes[activeLeatherIndex].properties}</p>
            </div>
            <div className={styles.leatherFeatures}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}></span>
                <span className={styles.featureText}>Tannage végétal</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}></span>
                <span className={styles.featureText}>Teinture à la main</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}></span>
                <span className={styles.featureText}>Finition naturelle</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Cuir de Crocodile Section */}
      <section 
        ref={sectionRefs.crocodile} 
        className={`${styles.crocodileSection} ${isVisible.crocodile ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Cuir de Crocodile</h2>
          <p>Une rareté exceptionnelle, sourcée éthiquement</p>
        </div>
        
        <div 
          className={styles.crocodileShowcase}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          <div className={styles.crocodileImageContainer}>
            <Image 
              src="/assets/images/savoir/crocoleather.webp" 
              alt="Crocodile leather texture" 
              width={1000} 
              height={600} 
              className={styles.crocodileImage}
            />
            <div 
              className={styles.zoomLens} 
              style={{ 
                top: `${zoomPosition.y}%`, 
                left: `${zoomPosition.x}%`,
                backgroundPosition: `${-zoomPosition.x * 1.5}% ${-zoomPosition.y * 1.5}%`
              }}
            ></div>
          </div>
          
          <div className={styles.crocodileInfo}>
            <div className={styles.infoCard}>
              <h3>Origine & Éthique</h3>
              <p>Nos cuirs exotiques proviennent exclusivement d'élevages certifiés respectant les plus hautes normes éthiques et environnementales. Chaque peau est accompagnée d'un certificat CITES attestant sa traçabilité complète.</p>
            </div>
            
            <div className={styles.infoCard}>
              <h3>Caractéristiques Distinctives</h3>
              <p>La structure unique des écailles confère au cuir de crocodile une résistance exceptionnelle et un caractère inimitable. Chaque peau présente un motif naturel différent, rendant chaque création véritablement unique.</p>
            </div>
            
            <div className={styles.infoCard}>
              <h3>Application</h3>
              <p>Utilisé avec parcimonie pour des détails sophistiqués ou des créations exclusives en série limitée. Le travail du cuir de crocodile fait appel à des techniques spécialisées transmises par générations.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Variétés de Cuir Section */}
      <section 
        ref={sectionRefs.varieties} 
        className={`${styles.varietiesSection} ${isVisible.varieties ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Variétés de Cuir</h2>
          <p>Chaque type possède son caractère unique</p>
        </div>
        
        <div className={styles.leatherVarieties}>
          <div className={styles.varietiesImage}>
            <Image 
              src="/assets/images/savoir/handwiththreetypeofleathers.webp" 
              alt="Hand with three types of leather" 
              width={800} 
              height={600} 
              className={styles.varietiesMainImage}
            />
          </div>
          
          <div className={styles.varietiesCompare}>
            <div className={styles.varietyCard}>
              <div className={styles.varietySwatch} data-type="boxcalf"></div>
              <h3>Box Calf</h3>
              <p>Cuir de veau au grain fin et à la finition brillante. Exceptionnel pour sa résistance à l'eau et sa capacité à développer un beau lustre.</p>
              <div className={styles.propertyRatings}>
                <div className={styles.propertyRating}>
                  <span>Souplesse</span>
                  <div className={styles.ratingBar} data-rating="3"></div>
                </div>
                <div className={styles.propertyRating}>
                  <span>Résistance</span>
                  <div className={styles.ratingBar} data-rating="5"></div>
                </div>
                <div className={styles.propertyRating}>
                  <span>Patine</span>
                  <div className={styles.ratingBar} data-rating="4"></div>
                </div>
              </div>
            </div>
            
            <div className={styles.varietyCard}>
              <div className={styles.varietySwatch} data-type="nubuck"></div>
              <h3>Nubuck</h3>
              <p>Cuir de veau poncé sur sa face externe pour créer une surface veloutée ultra-douce. Texture tactile incomparable et aspect raffiné.</p>
              <div className={styles.propertyRatings}>
                <div className={styles.propertyRating}>
                  <span>Souplesse</span>
                  <div className={styles.ratingBar} data-rating="5"></div>
                </div>
                <div className={styles.propertyRating}>
                  <span>Résistance</span>
                  <div className={styles.ratingBar} data-rating="3"></div>
                </div>
                <div className={styles.propertyRating}>
                  <span>Patine</span>
                  <div className={styles.ratingBar} data-rating="4"></div>
                </div>
              </div>
            </div>
            
            <div className={styles.varietyCard}>
              <div className={styles.varietySwatch} data-type="cordovan"></div>
              <h3>Cordovan</h3>
              <p>Cuir rare et précieux issu du cheval. Sa densité exceptionnelle lui confère une brillance naturelle et une longévité remarquable.</p>
              <div className={styles.propertyRatings}>
                <div className={styles.propertyRating}>
                  <span>Souplesse</span>
                  <div className={styles.ratingBar} data-rating="2"></div>
                </div>
                <div className={styles.propertyRating}>
                  <span>Résistance</span>
                  <div className={styles.ratingBar} data-rating="5"></div>
                </div>
                <div className={styles.propertyRating}>
                  <span>Patine</span>
                  <div className={styles.ratingBar} data-rating="5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Laine (Wool) Section */}
      <section 
        ref={sectionRefs.wool} 
        className={`${styles.woolSection} ${isVisible.wool ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Laine</h2>
          <p>Chaleur naturelle et confort incomparable</p>
        </div>
        
        <div className={styles.woolShowcase}>
          <div className={styles.woolImageContainer}>
            <Image 
              src="/assets/images/savoir/laine.webp" 
              alt="Premium wool texture" 
              width={1000} 
              height={600} 
              className={styles.woolImage}
            />
          </div>
          
          <div className={styles.woolInfo}>
            <div className={styles.woolJourney}>
              <div className={styles.journeyStep}>
                <div className={styles.stepIcon} data-step="1"></div>
                <div className={styles.stepContent}>
                  <h3>Origine</h3>
                  <p>Nos laines proviennent de moutons mérinos d'Australie et de Nouvelle-Zélande, élevés dans des conditions optimales garantissant une fibre d'une finesse exceptionnelle.</p>
                </div>
              </div>
              
              <div className={styles.journeyStep}>
                <div className={styles.stepIcon} data-step="2"></div>
                <div className={styles.stepContent}>
                  <h3>Sélection</h3>
                  <p>Seules les fibres les plus fines (moins de 18,5 microns) sont sélectionnées pour nos doublures, assurant un confort optimal sans irritation.</p>
                </div>
              </div>
              
              <div className={styles.journeyStep}>
                <div className={styles.stepIcon} data-step="3"></div>
                <div className={styles.stepContent}>
                  <h3>Application</h3>
                  <p>Utilisée principalement pour les doublures de nos modèles hivernaux, la laine offre une thermorégulation naturelle et des propriétés antibactériennes.</p>
                </div>
              </div>
            </div>
            
            <div className={styles.woolBenefits}>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}></span>
                <span className={styles.benefitText}>Respirabilité naturelle</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}></span>
                <span className={styles.benefitText}>Thermorégulation</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}></span>
                <span className={styles.benefitText}>Biodégradable</span>
              </div>
              <div className={styles.benefitItem}>
                <span className={styles.benefitIcon}></span>
                <span className={styles.benefitText}>Résistance naturelle aux odeurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Artisanat du Daim (Suede Crafting) Section */}
      <section 
        ref={sectionRefs.suede} 
        className={`${styles.suedeSection} ${isVisible.suede ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Artisanat du Daim</h2>
          <p>La maîtrise d'une matière délicate</p>
        </div>
        
        <div className={styles.suedeShowcase}>
          <div className={styles.suedeVisual}>
            <Image 
              src="/assets/images/savoir/mencuttingleatherdaim.webp" 
              alt="Craftsman working with suede" 
              width={1000} 
              height={600} 
              className={styles.suedeImage}
            />
            <div className={styles.craftTools}>
              <div className={styles.toolIndicator} style={{ top: '30%', left: '20%' }} data-tool="knife"></div>
              <div className={styles.toolIndicator} style={{ top: '45%', left: '60%' }} data-tool="suede"></div>
              <div className={styles.toolIndicator} style={{ top: '70%', left: '40%' }} data-tool="hands"></div>
            </div>
          </div>
          
          <div className={styles.suedeProcess}>
            <div className={styles.processStep}>
              <h3>Préparation</h3>
              <p>Le daim, obtenu en travaillant la face interne du cuir, nécessite une préparation méticuleuse. Chaque peau est inspectée pour garantir une structure uniforme.</p>
            </div>
            
            <div className={styles.processStep}>
              <h3>Découpe</h3>
              <p>Le découpage du daim requiert des outils spécialement aiguisés pour préserver la texture veloutée. La moindre imprécision peut compromettre la qualité.</p>
            </div>
            
            <div className={styles.processStep}>
              <h3>Finition</h3>
              <p>La finition du daim comprend un brossage délicat pour uniformiser le nap (sens du poil) et créer cette surface caractéristique qui joue avec la lumière.</p>
            </div>
            
            <div className={styles.suedeCare}>
              <h3>Entretien Spécifique</h3>
              <p>Le daim nécessite un entretien particulier. Nous fournissons à chaque client un kit de soin spécifique et des instructions détaillées pour préserver la beauté de cette matière délicate.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Heritage des Matières (Material Heritage) Section */}
      <section 
        ref={sectionRefs.heritage} 
        className={`${styles.heritageSection} ${isVisible.heritage ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Héritage des Matières</h2>
          <p>Une tradition d'excellence transmise à travers les générations</p>
        </div>
        
        <div className={styles.heritageContent}>
          <div className={styles.heritageTimeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>1897</div>
              <div className={styles.timelineContent}>
                <h3>Les Origines</h3>
                <p>Établissement de notre première relation avec les tanneries du Puy-en-Velay, partenariat qui perdure encore aujourd'hui.</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>1924</div>
              <div className={styles.timelineContent}>
                <h3>Innovation Textile</h3>
                <p>Introduction des premières doublures en laine mérinos pour un confort optimal, une révolution à l'époque.</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>1953</div>
              <div className={styles.timelineContent}>
                <h3>Techniques Exclusives</h3>
                <p>Développement d'une méthode propriétaire de tannage végétal qui confère à nos cuirs leur souplesse et longévité signature.</p>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineYear}>2008</div>
              <div className={styles.timelineContent}>
                <h3>Engagement Durable</h3>
                <p>Transition vers des pratiques 100% écoresponsables avec certification des sources et processus de production.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.heritageQuote}>
            <blockquote>
              "Le choix d'une matière n'est jamais anodin - il détermine non seulement l'esthétique d'une création, mais aussi son âme et sa durée de vie."
            </blockquote>
            <cite>— Archives Maison, 1937</cite>
          </div>
        </div>
      </section>
      
      {/* Propriétés et Caractéristiques (Properties and Characteristics) Section */}
      <section 
        ref={sectionRefs.properties} 
        className={`${styles.propertiesSection} ${isVisible.properties ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Propriétés et Caractéristiques</h2>
          <p>Comprendre ce qui définit l'excellence</p>
        </div>
        
        <div className={styles.propertiesMatrix}>
          <div className={styles.propertyColumn}>
            <div className={styles.propertyHeader}>Caractéristique</div>
            <div className={styles.propertyItem}>Qualité Supérieure</div>
            <div className={styles.propertyItem}>Patine Naturelle</div>
            <div className={styles.propertyItem}>Respirabilité</div>
            <div className={styles.propertyItem}>Résistance</div>
            <div className={styles.propertyItem}>Confort</div>
          </div>
          
          <div className={styles.materialColumn}>
            <div className={styles.materialHeader}>Box Calf</div>
            <div className={styles.materialRating} data-rating="5"></div>
            <div className={styles.materialRating} data-rating="4"></div>
            <div className={styles.materialRating} data-rating="3"></div>
            <div className={styles.materialRating} data-rating="5"></div>
            <div className={styles.materialRating} data-rating="4"></div>
          </div>
          
          <div className={styles.materialColumn}>
            <div className={styles.materialHeader}>Cuir de Veau</div>
            <div className={styles.materialRating} data-rating="4"></div>
            <div className={styles.materialRating} data-rating="5"></div>
            <div className={styles.materialRating} data-rating="4"></div>
            <div className={styles.materialRating} data-rating="3"></div>
            <div className={styles.materialRating} data-rating="5"></div>
          </div>
          
          <div className={styles.materialColumn}>
            <div className={styles.materialHeader}>Daim</div>
            <div className={styles.materialRating} data-rating="4"></div>
            <div className={styles.materialRating} data-rating="3"></div>
            <div className={styles.materialRating} data-rating="5"></div>
            <div className={styles.materialRating} data-rating="2"></div>
            <div className={styles.materialRating} data-rating="5"></div>
          </div>
          
          <div className={styles.materialColumn}>
            <div className={styles.materialHeader}>Crocodile</div>
            <div className={styles.materialRating} data-rating="5"></div>
            <div className={styles.materialRating} data-rating="5"></div>
            <div className={styles.materialRating} data-rating="2"></div>
            <div className={styles.materialRating} data-rating="5"></div>
            <div className={styles.materialRating} data-rating="3"></div>
          </div>
        </div>
        
        <div className={styles.propertyGuide}>
          <h3>Guide des Propriétés</h3>
          <p>Chaque matière présente un profil unique de caractéristiques qui influencent son utilisation optimale dans nos créations. Nous sélectionnons méticuleusement les matériaux en fonction de l'usage prévu et des exigences spécifiques de chaque modèle.</p>
        </div>
      </section>
      
      {/* Provenance et Durabilité (Origin and Sustainability) Section */}
      <section 
        ref={sectionRefs.sustainability} 
        className={`${styles.sustainabilitySection} ${isVisible.sustainability ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Provenance et Durabilité</h2>
          <p>Notre engagement envers la planète et l'excellence</p>
        </div>
        
        <div className={styles.sustainabilityContent}>
          <div className={styles.originMap}>
            <div className={styles.mapMarker} style={{ top: '35%', left: '48%' }} data-origin="france">
              <div className={styles.markerTooltip}>
                <h4>France</h4>
                <p>Cuir de veau, Box Calf</p>
              </div>
            </div>
            <div className={styles.mapMarker} style={{ top: '48%', left: '25%' }} data-origin="usa">
              <div className={styles.markerTooltip}>
                <h4>États-Unis</h4>
                <p>Cordovan</p>
              </div>
            </div>
            <div className={styles.mapMarker} style={{ top: '65%', left: '80%' }} data-origin="australia">
              <div className={styles.markerTooltip}>
                <h4>Australie</h4>
                <p>Laine Mérinos</p>
              </div>
            </div>
            <div className={styles.mapMarker} style={{ top: '55%', left: '55%' }} data-origin="italy">
              <div className={styles.markerTooltip}>
                <h4>Italie</h4>
                <p>Daim, Cuir de veau</p>
              </div>
            </div>
          </div>
          
          <div className={styles.sustainabilityCommitments}>
            <div className={styles.commitmentItem}>
              <div className={styles.commitmentIcon} data-icon="certification"></div>
              <div className={styles.commitmentContent}>
                <h3>Certifications</h3>
                <p>Tous nos cuirs sont certifiés LWG Gold, garantissant des pratiques environnementales exceptionnelles dans le processus de tannage.</p>
              </div>
            </div>
            
            <div className={styles.commitmentItem}>
              <div className={styles.commitmentIcon} data-icon="traceability"></div>
              <div className={styles.commitmentContent}>
                <h3>Traçabilité</h3>
                <p>Chaque matière première est traçable jusqu'à sa source avec documentation complète sur l'origine, les conditions d'élevage et les méthodes de production.</p>
              </div>
            </div>
            
            <div className={styles.commitmentItem}>
              <div className={styles.commitmentIcon} data-icon="zerowaste"></div>
              <div className={styles.commitmentContent}>
                <h3>Zéro Déchet</h3>
                <p>Notre programme de valorisation transforme chaque chute en accessoires ou éléments décoratifs, éliminant virtuellement les déchets de production.</p>
              </div>
            </div>
            
            <div className={styles.commitmentItem}>
              <div className={styles.commitmentIcon} data-icon="community"></div>
              <div className={styles.commitmentContent}>
                <h3>Communautés</h3>
                <p>Nous soutenons activement les communautés artisanales à travers des partenariats à long terme et des programmes de formation pour préserver les savoir-faire traditionnels.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Entretien et Vieillissement (Care and Aging) Section */}
      <section 
        ref={sectionRefs.care} 
        className={`${styles.careSection} ${isVisible.care ? styles.visible : ''}`}
      >
        <div className={styles.sectionHeader}>
          <h2>Entretien et Vieillissement</h2>
          <p>La beauté qui s'améliore avec le temps</p>
        </div>
        
        <div className={styles.careContent}>
          <div className={styles.agingGallery}>
            <div className={styles.agingExample}>
              <div className={styles.agingImages}>
                <div className={styles.agingImageNew}>
                  <Image 
                    src="/assets/images/savoir/83.webp" 
                    alt="New leather shoe" 
                    width={400} 
                    height={300} 
                    className={styles.agingImage}
                  />
                  <div className={styles.agingLabel}>Neuf</div>
                </div>
                <div className={styles.agingImageAged}>
                  <Image 
                    src="/assets/images/savoir/83.webp" 
                    alt="Aged leather shoe" 
                    width={400} 
                    height={300} 
                    className={`${styles.agingImage} ${styles.aged}`}
                  />
                  <div className={styles.agingLabel}>Après 5 ans</div>
                </div>
              </div>
              <div className={styles.agingDescription}>
                <h3>Patine Naturelle</h3>
                <p>Nos cuirs sont sélectionnés pour leur capacité à développer une patine unique au fil du temps, reflétant l'histoire personnelle de chaque paire.</p>
              </div>
            </div>
          </div>
          
          <div className={styles.careGuide}>
            <h3>Guide d'Entretien</h3>
            <p>Chaque création BRENDT est accompagnée d'un guide d'entretien spécifique et des produits essentiels pour maintenir la beauté et prolonger la durée de vie de votre acquisition.</p>
            
            <div className={styles.careTips}>
              <div className={styles.careTip}>
                <div className={styles.tipIcon} data-icon="regular"></div>
                <div className={styles.tipContent}>
                  <h4>Entretien Régulier</h4>
                  <p>Utiliser une brosse douce pour éliminer la poussière et appliquer une crème nourrissante adaptée au type de cuir tous les mois.</p>
                </div>
              </div>
              
              <div className={styles.careTip}>
                <div className={styles.tipIcon} data-icon="protection"></div>
                <div className={styles.tipContent}>
                  <h4>Protection</h4>
                  <p>Appliquer un spray protecteur avant la première utilisation et après chaque nettoyage. Pour le daim, utiliser un spray spécifique qui n'altère pas la texture.</p>
                </div>
              </div>
              
              <div className={styles.careTip}>
                <div className={styles.tipIcon} data-icon="storage"></div>
                <div className={styles.tipContent}>
                  <h4>Conservation</h4>
                  <p>Entreposer vos chaussures avec des embauchoirs en bois de cèdre dans un environnement sec et ventilé, à l'abri de la lumière directe du soleil.</p>
                </div>
              </div>
              
              <div className={styles.careTip}>
                <div className={styles.tipIcon} data-icon="restoration"></div>
                <div className={styles.tipContent}>
                  <h4>Restauration</h4>
                  <p>Notre service de restauration peut redonner une seconde vie à vos chaussures BRENDT bien-aimées, même après des années d'utilisation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}