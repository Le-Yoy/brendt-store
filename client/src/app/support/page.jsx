// client/src/app/support/page.jsx
import React from 'react';

const Support = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Service Client</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Nous contacter</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Support par Email</h3>
              <p className="text-gray-600 mb-2">Pour toutes demandes générales et support commandes :</p>
              <a href="mailto:support@brendtshoes.com" className="text-blue-600 hover:underline">
                support@brendtshoes.com
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Support Téléphone</h3>
              <p className="text-gray-600 mb-2">Lundi - Vendredi, 9h00 - 17h00 EST</p>
              <a href="tel:+19292439936" className="text-blue-600 hover:underline">
                +1 929 243 9936
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Management</h3>
              <p className="text-gray-600 mb-2">Pour les demandes spéciales :</p>
              <a href="mailto:manager@genuisagency.com" className="text-blue-600 hover:underline">
                manager@genuisagency.com
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Chat en Direct</h3>
              <p className="text-gray-600 mb-2">Disponible pendant les heures d'ouverture</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Démarrer le Chat
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Questions Fréquemment Posées</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Comment suivre ma commande ?</h3>
              <p className="text-gray-600">
                Une fois votre commande expédiée, vous recevrez un numéro de suivi par email. 
                Vous pouvez également vérifier le statut de votre commande en vous connectant à votre compte.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Quelle est votre politique de retour ?</h3>
              <p className="text-gray-600">
                Nous acceptons les retours dans les 30 jours suivant la livraison. Les articles doivent 
                être non portés et dans leur état original avec les étiquettes attachées.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Combien de temps prend la livraison ?</h3>
              <p className="text-gray-600">
                Livraison gratuite au Maroc (3-5 jours). Europe : 5-7 jours (15€, gratuit à partir de 75€). 
                Expédition express disponible pour +10€.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Livrez-vous à l'international ?</h3>
              <p className="text-gray-600">
                Oui, nous livrons dans le monde entier. Maroc (gratuit), Europe, Amérique du Nord, 
                et autres pays. Les coûts et délais varient selon la destination.
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">Quels modes de paiement acceptez-vous ?</h3>
              <p className="text-gray-600">
                Nous acceptons les principales cartes de crédit, PayPal, et paiements en EUR, USD, et MAD 
                via notre plateforme sécurisée Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="mt-12 bg-white border rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Envoyez-nous un Message</h2>
        <form className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prénom</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Nom de famille</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Numéro de commande (si applicable)</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="ex. CMD-001"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Sujet</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
              <option>Demande de commande</option>
              <option>Retour/Échange</option>
              <option>Question produit</option>
              <option>Problème de livraison</option>
              <option>Réclamation</option>
              <option>Autre</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea 
              rows="5" 
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Veuillez décrire votre question ou préoccupation en détail..."
              required
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Envoyer le Message
            </button>
          </div>
        </form>
      </div>

      {/* Company Information */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">BRENDT SHOES</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Informations Société</h4>
            <p className="text-gray-600 mb-1"><strong>Société :</strong> BOUTALEB LLC</p>
            <p className="text-gray-600 mb-1"><strong>Adresse :</strong> 30 N GOULD ST STE N</p>
            <p className="text-gray-600 mb-1">SHERIDAN, WY 82801, USA</p>
            <p className="text-gray-600"><strong>Email :</strong> support@brendtshoes.com</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Horaires d'ouverture</h4>
            <div className="text-gray-600">
              <p>Lundi - Vendredi : 9h00 - 17h00 EST</p>
              <p>Samedi : Sur rendez-vous</p>
              <p>Dimanche : Fermé</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Times */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Temps de Traitement</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-1">Traitement Commande</h4>
            <p className="text-gray-600">1-3 jours ouvrables</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Réponse Email</h4>
            <p className="text-gray-600">24-48 heures</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Traitement Retour</h4>
            <p className="text-gray-600">5-10 jours ouvrables</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;