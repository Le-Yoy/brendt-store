// client/src/app/privacy-policy/page.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
      
      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">
          <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Informations que nous collectons</h2>
          <p className="mb-4">
            Chez BRENDT SHOES, nous collectons les informations que vous nous fournissez directement, notamment lorsque vous :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Créez un compte</li>
            <li>Effectuez un achat</li>
            <li>Contactez notre service client</li>
            <li>Vous abonnez à notre newsletter</li>
          </ul>
          <p className="mb-4">
            Ces informations peuvent inclure votre nom, adresse e-mail, numéro de téléphone, adresse de livraison, 
            adresse de facturation et informations de paiement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Comment nous utilisons vos informations</h2>
          <p className="mb-4">Nous utilisons les informations que nous collectons pour :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Traiter et exécuter vos commandes</li>
            <li>Communiquer avec vous concernant vos commandes</li>
            <li>Fournir un support client</li>
            <li>Vous envoyer des communications promotionnelles (avec votre consentement)</li>
            <li>Améliorer nos produits et services</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Partage d'informations</h2>
          <p className="mb-4">
            Nous ne vendons, n'échangeons ou ne transférons pas vos informations personnelles à des tiers, 
            sauf dans les cas décrits dans cette politique de confidentialité. Nous pouvons partager vos informations avec :
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Les processeurs de paiement (Stripe) pour traiter vos paiements</li>
            <li>Les entreprises de transport pour livrer vos commandes</li>
            <li>Les prestataires de services qui nous aident à exploiter notre site web</li>
            <li>Les autorités judiciaires lorsque requis par la loi</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Sécurité des données</h2>
          <p className="mb-4">
            Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles 
            contre l'accès non autorisé, la modification, la divulgation ou la destruction. Vos informations de paiement 
            sont traitées de manière sécurisée via Stripe et nous ne stockons pas les détails de votre carte de paiement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
          <p className="mb-4">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site web, notamment pour mémoriser 
            vos préférences et suivre le contenu de votre panier d'achat.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
          <p className="mb-4">Vous avez le droit de :</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Accéder à vos informations personnelles</li>
            <li>Corriger les informations inexactes</li>
            <li>Demander la suppression de vos informations</li>
            <li>Vous désabonner des communications marketing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modifications de cette politique</h2>
          <p className="mb-4">
            Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons 
            de tout changement en publiant la nouvelle politique de confidentialité sur cette page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Nous contacter</h2>
          <p className="mb-4">
            Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à :
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p><strong>BRENDT SHOES</strong></p>
            <p><strong>Société :</strong> BOUTALEB LLC</p>
            <p><strong>Adresse :</strong> 30 N GOULD ST STE N, SHERIDAN, WY 82801, USA</p>
            <p><strong>Email :</strong> support@brendtshoes.com</p>
            <p><strong>Téléphone :</strong> +1 929 243 9936</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;