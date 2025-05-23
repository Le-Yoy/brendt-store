const faqData = [
    {
      id: 'achat-produits',
      title: 'Achat produits',
      questions: [
        {
          id: 'ap-1',
          question: 'Que dois-je faire pour acheter un produit ?',
          answer: 'Pour acheter un produit BRENDT, naviguez simplement vers la section désirée dans notre catalogue, sélectionnez votre taille et ajoutez l\'article à votre panier. Vous pouvez ensuite procéder au paiement en utilisant l\'une de nos méthodes de paiement sécurisées. Si vous avez besoin d\'assistance supplémentaire, n\'hésitez pas à contacter notre service client.'
        },
        {
          id: 'ap-2',
          question: 'Que dois-je faire pour trouver un produit ?',
          answer: 'Vous pouvez trouver nos produits en utilisant la navigation principale pour explorer les différentes catégories, ou en utilisant la fonction de recherche en haut de la page. Vous pouvez également filtrer les produits par catégorie, couleur, taille et prix pour affiner vos résultats.'
        },
        {
          id: 'ap-3',
          question: 'Comment puis-je savoir si un article est disponible ?',
          answer: 'La disponibilité d\'un article est indiquée directement sur la page du produit. Si une taille spécifique n\'est pas disponible, elle apparaîtra grisée dans le sélecteur de taille. Pour les articles en rupture de stock, vous pouvez vous inscrire pour recevoir une notification lorsqu\'ils seront de nouveau disponibles.'
        },
        {
          id: 'ap-4',
          question: 'Quelle taille dois-je choisir ?',
          answer: 'Nous recommandons de consulter notre guide des tailles disponible sur chaque page produit. Pour les chaussures, nous suivons les standards européens. Si vous êtes entre deux tailles, nous recommandons généralement de prendre la taille supérieure. Pour toute question spécifique sur les tailles, n\'hésitez pas à contacter notre service client.'
        },
        {
          id: 'ap-5',
          question: 'Comment puis-je savoir si les produits que vous vendez sont authentiques ?',
          answer: 'Tous les produits vendus sur notre site officiel BRENDT sont 100% authentiques. Nous sommes fiers de notre artisanat et de la qualité de nos produits. Chaque article est fabriqué avec le plus grand soin dans nos ateliers et passe par des contrôles de qualité rigoureux avant d\'être expédié.'
        }
      ]
    },
    {
      id: 'creation-compte',
      title: 'Création d\'un compte et détails de paiement',
      questions: [
        {
          id: 'cc-1',
          question: 'Comment créer un compte sur votre site ?',
          answer: 'Pour créer un compte, cliquez sur l\'icône "Mon Compte" dans le coin supérieur droit de notre site. Sélectionnez "Créer un compte" et remplissez le formulaire avec vos informations personnelles. Une fois le formulaire soumis, vous recevrez un email de confirmation pour activer votre compte.'
        },
        {
          id: 'cc-2',
          question: 'Quels modes de paiement acceptez-vous ?',
          answer: 'Nous acceptons plusieurs méthodes de paiement, notamment les cartes de crédit (Visa, MasterCard, American Express), PayPal, Apple Pay et les virements bancaires pour certaines régions. Toutes les transactions sont sécurisées et cryptées pour protéger vos informations.'
        },
        {
          id: 'cc-3',
          question: 'Mes informations de paiement sont-elles sécurisées ?',
          answer: 'Absolument. Nous utilisons des protocoles de cryptage de pointe et des systèmes de sécurité robustes pour protéger vos informations personnelles et financières. Nous ne stockons jamais vos informations de carte complètes sur nos serveurs.'
        },
        {
          id: 'cc-4',
          question: 'Comment puis-je modifier mes informations personnelles ?',
          answer: 'Vous pouvez modifier vos informations personnelles en vous connectant à votre compte, puis en naviguant vers la section "Informations personnelles" ou "Paramètres du compte". Là, vous pourrez mettre à jour votre adresse, vos coordonnées et vos préférences.'
        }
      ]
    },
    {
      id: 'achat-cadeaux',
      title: 'Achat cadeaux',
      questions: [
        {
          id: 'ac-1',
          question: 'Proposez-vous des emballages cadeaux ?',
          answer: 'Oui, tous nos produits peuvent être livrés dans notre élégant emballage cadeau BRENDT. Cette option peut être sélectionnée lors du processus de paiement. L\'emballage comprend une boîte signature, du papier de soie et un ruban assorti sans frais supplémentaires.'
        },
        {
          id: 'ac-2',
          question: 'Puis-je ajouter un message personnalisé à mon cadeau ?',
          answer: 'Absolument. Lors du processus de paiement, vous aurez la possibilité d\'ajouter un message personnel qui sera imprimé sur une carte élégante et inclus avec votre cadeau. Ce service est offert gratuitement.'
        },
        {
          id: 'ac-3',
          question: 'Est-il possible d\'envoyer un cadeau directement à son destinataire ?',
          answer: 'Oui, vous pouvez envoyer votre cadeau directement au destinataire. Il vous suffit d\'entrer l\'adresse de livraison du destinataire lors du processus de paiement et de sélectionner l\'option "Emballage cadeau". Le reçu de paiement ne sera pas inclus dans le colis.'
        }
      ]
    },
    {
      id: 'emballage-expedition',
      title: 'Emballage et expédition',
      questions: [
        {
          id: 'ee-1',
          question: 'Quels sont vos délais de livraison ?',
          answer: 'Nos délais de livraison varient selon votre localisation. En général, la livraison standard prend 2-4 jours ouvrables pour la France métropolitaine. Pour les livraisons internationales, comptez 5-7 jours ouvrables. Pour des délais plus précis, veuillez consulter la page dédiée à l\'expédition ou vérifier lors du processus de paiement.'
        },
        {
          id: 'ee-2',
          question: 'Comment suivre ma commande ?',
          answer: 'Une fois votre commande expédiée, vous recevrez un email de confirmation contenant un numéro de suivi et un lien pour suivre votre colis. Vous pouvez également suivre votre commande en vous connectant à votre compte BRENDT et en consultant la section "Mes commandes".'
        },
        {
          id: 'ee-3',
          question: 'Livrez-vous à l\'international ?',
          answer: 'Oui, nous livrons dans la plupart des pays du monde. Les frais d\'expédition et les délais de livraison varient selon la destination. Veuillez noter que des frais de douane peuvent s\'appliquer pour les livraisons internationales, selon la réglementation locale.'
        },
        {
          id: 'ee-4',
          question: 'Comment sont emballés vos produits ?',
          answer: 'Tous nos produits sont soigneusement emballés dans nos boîtes emblématiques BRENDT avec du papier de soie pour protéger les articles pendant le transport. Pour les chaussures, nous incluons également des sacs à chaussures assortis et, si nécessaire, des embauchoirs pour maintenir la forme.'
        }
      ]
    },
    {
      id: 'retours-echanges',
      title: 'Retours et échanges',
      questions: [
        {
          id: 're-1',
          question: 'Quelle est votre politique de retour ?',
          answer: 'Nous offrons des retours gratuits dans les 30 jours suivant la réception de votre commande. Les articles doivent être dans leur état d\'origine, non portés et avec toutes les étiquettes attachées. Pour initier un retour, connectez-vous à votre compte et suivez les instructions dans la section "Mes commandes".'
        },
        {
          id: 're-2',
          question: 'Comment échanger un article ?',
          answer: 'Pour échanger un article contre une taille ou une couleur différente, veuillez d\'abord effectuer un retour standard puis passer une nouvelle commande pour l\'article souhaité. Si l\'article que vous souhaitez est en rupture de stock, vous pouvez contacter notre service client pour vérifier sa disponibilité future.'
        },
        {
          id: 're-3',
          question: 'Les frais de retour sont-ils gratuits ?',
          answer: 'Oui, les retours sont gratuits pour tous les clients. Une étiquette de retour prépayée est incluse dans votre colis original. Si vous l\'avez perdue, vous pouvez en générer une nouvelle depuis votre compte client ou contacter notre service client.'
        },
        {
          id: 're-4',
          question: 'Combien de temps faut-il pour traiter un remboursement ?',
          answer: 'Une fois que nous avons reçu et inspecté votre retour (généralement 1-2 jours ouvrables après réception), nous traitons votre remboursement. Celui-ci apparaîtra sur votre compte bancaire ou carte de crédit dans un délai de 5 à 10 jours ouvrables, selon votre institution financière.'
        }
      ]
    },
    {
      id: 'garantie',
      title: 'Garantie',
      questions: [
        {
          id: 'g-1',
          question: 'Quelle garantie offrez-vous sur vos produits ?',
          answer: 'Tous nos produits sont couverts par une garantie de 2 ans contre les défauts de fabrication. Cette garantie ne couvre pas l\'usure normale, les dommages résultant d\'une mauvaise utilisation, ou les altérations par des tiers. Pour les chaussures de notre collection Artisan, nous offrons un service de réparation étendu.'
        },
        {
          id: 'g-2',
          question: 'Comment faire une réclamation sous garantie ?',
          answer: 'Pour faire une réclamation sous garantie, veuillez contacter notre service client en fournissant votre numéro de commande, des photos détaillées du problème, et une description de la situation. Notre équipe évaluera votre demande et vous guidera à travers le processus de retour si nécessaire.'
        },
        {
          id: 'g-3',
          question: 'Offrez-vous un service de réparation pour vos chaussures ?',
          answer: 'Oui, nous proposons un service de réparation pour nos chaussures. Pour les modèles premium, nous offrons également un service de ressemelage et de restauration. Ces services sont disponibles à des tarifs préférentiels pour nos clients. Veuillez contacter notre service client pour plus d\'informations ou pour demander une réparation.'
        }
      ]
    },
    {
      id: 'gift-card',
      title: 'Gift Card',
      questions: [
        {
          id: 'gc-1',
          question: 'Comment puis-je acheter une Gift Card ?',
          answer: 'Vous pouvez acheter une Gift Card BRENDT directement sur notre site web dans la section "Gift Cards". Vous pourrez choisir le montant (entre 50€ et 1000€), personnaliser votre message, et décider si vous souhaitez l\'envoyer par email ou par courrier avec notre packaging premium.'
        },
        {
          id: 'gc-2',
          question: 'Quelle est la durée de validité d\'une Gift Card ?',
          answer: 'Les Gift Cards BRENDT sont valables pendant 12 mois à compter de la date d\'achat. La date d\'expiration est clairement indiquée sur la carte ou dans l\'email de la Gift Card numérique.'
        },
        {
          id: 'gc-3',
          question: 'Comment utiliser une Gift Card ?',
          answer: 'Pour utiliser une Gift Card, il suffit d\'entrer le code unique à 16 chiffres pendant le processus de paiement dans le champ "Code promo ou Gift Card". Le montant sera automatiquement déduit de votre total. Si la valeur de votre achat est inférieure au montant de la Gift Card, le solde restera disponible pour un usage ultérieur.'
        },
        {
          id: 'gc-4',
          question: 'Puis-je vérifier le solde de ma Gift Card ?',
          answer: 'Oui, vous pouvez vérifier le solde de votre Gift Card à tout moment en vous rendant dans la section "Gift Cards" de notre site et en entrant votre code. Vous pouvez également contacter notre service client pour obtenir cette information.'
        }
      ]
    }
  ];
  
  export default faqData;