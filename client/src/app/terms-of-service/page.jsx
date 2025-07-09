// client/src/app/terms-of-service/page.jsx
import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente</h1>
      
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
          <p className="mb-4">
            En accédant et en utilisant le site web et les services de BRENDT SHOES, vous acceptez 
            et convenez d'être lié par les termes et dispositions de cet accord. Si vous n'acceptez 
            pas de respecter ces conditions, veuillez ne pas utiliser ce service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Produits et services</h2>
          <p className="mb-4">
            BRENDT SHOES propose des chaussures et accessoires de haute qualité. Tous les produits 
            sont soumis à disponibilité. Nous nous réservons le droit d'arrêter tout produit à tout moment.
          </p>
          <p className="mb-4">
            Les descriptions, images et prix des produits sont fournis à titre informatif et peuvent 
            contenir des inexactitudes. Nous nous réservons le droit de corriger les erreurs et de 
            mettre à jour les informations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Commande et paiement</h2>
          <p className="mb-4">
            Lorsque vous passez une commande, vous acceptez de fournir des informations exactes et complètes. 
            Toutes les commandes sont soumises à acceptation et disponibilité.
          </p>
          <p className="mb-4">
            Le paiement est traité de manière sécurisée via Stripe. Nous acceptons les principales cartes 
            de crédit et autres modes de paiement affichés lors du checkout. Le paiement doit être reçu 
            avant l'exécution de la commande.
          </p>
          <p className="mb-4">
            Les prix sont affichés en EUR, USD ou MAD selon votre région et incluent les taxes applicables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Expédition et livraison</h2>
          <p className="mb-4">
            <strong>Zones de livraison :</strong>
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Maroc :</strong> Livraison gratuite (3-5 jours ouvrables)</li>
            <li><strong>Europe :</strong> 15€ (5-7 jours ouvrables) - Gratuit à partir de 75€</li>
            <li><strong>Amérique du Nord :</strong> 20€ (7-10 jours ouvrables)</li>
            <li><strong>Autres pays :</strong> 25€ (10-15 jours ouvrables)</li>
          </ul>
          <p className="mb-4">
            <strong>Expédition express :</strong> Disponible pour +10€ (délais réduits de moitié)
          </p>
          <p className="mb-4">
            Les délais de livraison sont des estimations et peuvent varier selon la localisation et 
            la disponibilité des produits. Le risque de perte et le titre des produits vous sont 
            transférés lors de la livraison à l'adresse que vous fournissez.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Retours et échanges</h2>
          <p className="mb-4">
            <strong>Politique de retour 30 jours :</strong>
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Retours acceptés dans les 30 jours suivant la livraison</li>
            <li>Articles non portés en condition originale avec emballage et étiquettes</li>
            <li>Frais de retour à la charge du client (sauf erreur de notre part)</li>
            <li>Remboursement traité sous 5-10 jours ouvrables après réception</li>
          </ul>
          <p className="mb-4">
            Pour initier un retour, contactez notre service client à support@brendtshoes.com. 
            Les échanges et avoirs en magasin sont également proposés comme alternatives.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Garantie qualité</h2>
          <p className="mb-4">
            <strong>Garantie de 90 jours contre les défauts de fabrication :</strong>
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Remplacement gratuit en cas de défaut de fabrication</li>
            <li>Garantie de qualité - remplacement si défectueux à l'arrivée</li>
            <li>Usure normale non couverte par la garantie</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Comptes utilisateur</h2>
          <p className="mb-4">
            Vous êtes responsable du maintien de la confidentialité de vos informations de compte 
            et mot de passe. Vous acceptez de nous notifier immédiatement de toute utilisation 
            non autorisée de votre compte.
          </p>
          <p className="mb-4">
            <strong>Restrictions d'âge :</strong> 13+ avec consentement parental, 18+ pour achats indépendants.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Utilisations interdites</h2>
          <p className="mb-4">Vous acceptez de ne pas utiliser notre service :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>À des fins illégales</li>
            <li>Pour violer des réglementations internationales, fédérales ou locales</li>
            <li>Pour transmettre du matériel publicitaire ou promotionnel non sollicité</li>
            <li>Pour usurper l'identité de l'entreprise, des employés ou d'autres utilisateurs</li>
            <li>Pour restreindre ou inhiber l'utilisation du site web par autrui</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Propriété intellectuelle</h2>
          <p className="mb-4">
            Le contenu, l'organisation, les graphiques, le design, la compilation et autres éléments 
            liés au site sont protégés par les droits d'auteur, marques déposées et autres droits 
            de propriété applicables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Limitation de responsabilité</h2>
          <p className="mb-4">
            BRENDT SHOES ne sera pas responsable des dommages indirects, accessoires, spéciaux, 
            consécutifs ou punitifs, y compris sans limitation, la perte de profits, données, 
            utilisation, clientèle ou autres pertes intangibles.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Modifications des conditions</h2>
          <p className="mb-4">
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les changements 
            prendront effet immédiatement après publication sur le site web. Votre utilisation 
            continue constitue une acceptation des conditions modifiées.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Informations de contact</h2>
          <p className="mb-4">
            Les questions concernant les conditions de service doivent nous être envoyées à :
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>BRENDT SHOES</strong></p>
            <p><strong>Société :</strong> BOUTALEB LLC</p>
            <p><strong>Adresse :</strong> 30 N GOULD ST STE N, SHERIDAN, WY 82801, USA</p>
            <p><strong>Email :</strong> support@brendtshoes.com</p>
            <p><strong>Manager :</strong> manager@genuisagency.com</p>
            <p><strong>Téléphone :</strong> +1 929 243 9936</p>
            <p><strong>Horaires :</strong> Lun-Ven 9h00-17h00 EST</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;