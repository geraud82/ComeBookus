import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <Card className="p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptation des conditions</h2>
            <p className="text-gray-600 mb-6">
              En utilisant la plateforme ComeBookUs, vous acceptez d'être lié par ces conditions 
              générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas 
              utiliser notre service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description du service</h2>
            <p className="text-gray-600 mb-6">
              ComeBookUs est une plateforme en ligne qui permet aux utilisateurs de découvrir 
              et réserver des services de beauté et bien-être auprès de professionnels partenaires. 
              Nous facilitons la mise en relation entre clients et prestataires.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et compte utilisateur</h2>
            <div className="text-gray-600 mb-6">
              <p className="mb-2">Pour utiliser certaines fonctionnalités, vous devez :</p>
              <ul className="list-disc pl-6">
                <li>Créer un compte avec des informations exactes</li>
                <li>Maintenir la confidentialité de vos identifiants</li>
                <li>Être responsable de toutes les activités sur votre compte</li>
                <li>Nous notifier immédiatement de tout usage non autorisé</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Réservations et paiements</h2>
            <div className="text-gray-600 mb-6">
              <h3 className="text-lg font-semibold mb-2">Réservations :</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Les réservations sont confirmées sous réserve de disponibilité</li>
                <li>Vous vous engagez à respecter vos rendez-vous</li>
                <li>Les annulations doivent respecter les conditions du prestataire</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Paiements :</h3>
              <ul className="list-disc pl-6">
                <li>Les paiements sont sécurisés via nos partenaires de confiance</li>
                <li>Les prix affichés incluent toutes les taxes applicables</li>
                <li>Les remboursements suivent notre politique de remboursement</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Obligations des utilisateurs</h2>
            <div className="text-gray-600 mb-6">
              <p className="mb-2">Vous vous engagez à :</p>
              <ul className="list-disc pl-6">
                <li>Utiliser le service de manière légale et respectueuse</li>
                <li>Ne pas perturber le fonctionnement de la plateforme</li>
                <li>Respecter les droits des autres utilisateurs</li>
                <li>Ne pas publier de contenu inapproprié ou illégal</li>
                <li>Respecter les professionnels et leurs établissements</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Responsabilités</h2>
            <p className="text-gray-600 mb-6">
              ComeBookUs agit en tant qu'intermédiaire. Nous ne sommes pas responsables 
              de la qualité des services fournis par les professionnels partenaires. 
              Les litiges concernant les prestations doivent être résolus directement 
              avec le prestataire concerné.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriété intellectuelle</h2>
            <p className="text-gray-600 mb-6">
              Tous les contenus de la plateforme (textes, images, logos, etc.) sont 
              protégés par les droits de propriété intellectuelle. Toute reproduction 
              non autorisée est interdite.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modification des conditions</h2>
            <p className="text-gray-600 mb-6">
              Nous nous réservons le droit de modifier ces conditions à tout moment. 
              Les modifications seront communiquées via la plateforme et prendront 
              effet immédiatement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Résiliation</h2>
            <p className="text-gray-600 mb-6">
              Nous pouvons suspendre ou résilier votre compte en cas de violation 
              de ces conditions. Vous pouvez également fermer votre compte à tout moment.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Droit applicable</h2>
            <p className="text-gray-600 mb-6">
              Ces conditions sont régies par le droit français. Tout litige sera 
              soumis aux tribunaux compétents de Paris.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant ces conditions, contactez-nous à : 
              legal@comebookus.com
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
