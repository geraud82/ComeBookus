import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <Card className="p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-6">
              ComeBookUs s'engage à protéger votre vie privée. Cette politique de confidentialité 
              explique comment nous collectons, utilisons et protégeons vos informations personnelles 
              lorsque vous utilisez notre plateforme.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informations que nous collectons</h2>
            <div className="text-gray-600 mb-6">
              <h3 className="text-lg font-semibold mb-2">Informations personnelles :</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Nom, prénom, adresse e-mail</li>
                <li>Numéro de téléphone</li>
                <li>Adresse postale</li>
                <li>Informations de paiement</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Données d'utilisation :</h3>
              <ul className="list-disc pl-6">
                <li>Historique de navigation</li>
                <li>Préférences de réservation</li>
                <li>Géolocalisation (avec votre consentement)</li>
                <li>Données techniques (adresse IP, type de navigateur)</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation de vos données</h2>
            <div className="text-gray-600 mb-6">
              <p className="mb-2">Nous utilisons vos données pour :</p>
              <ul className="list-disc pl-6">
                <li>Traiter vos réservations</li>
                <li>Améliorer nos services</li>
                <li>Vous envoyer des notifications importantes</li>
                <li>Personnaliser votre expérience</li>
                <li>Assurer la sécurité de la plateforme</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des données</h2>
            <p className="text-gray-600 mb-6">
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations 
              uniquement avec les professionnels que vous réservez et nos partenaires de confiance 
              nécessaires au fonctionnement du service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sécurité</h2>
            <p className="text-gray-600 mb-6">
              Nous mettons en place des mesures de sécurité techniques et organisationnelles 
              appropriées pour protéger vos données contre tout accès non autorisé, 
              altération, divulgation ou destruction.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos droits</h2>
            <div className="text-gray-600 mb-6">
              <p className="mb-2">Conformément au RGPD, vous avez le droit de :</p>
              <ul className="list-disc pl-6">
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier vos données</li>
                <li>Supprimer vos données</li>
                <li>Limiter le traitement</li>
                <li>Portabilité des données</li>
                <li>Vous opposer au traitement</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant cette politique de confidentialité, 
              contactez-nous à : privacy@comebookus.com
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
