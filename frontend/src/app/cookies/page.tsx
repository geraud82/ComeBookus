import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique des Cookies
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        <Card className="p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p className="text-gray-600 mb-6">
              Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous 
              visitez un site web. Les cookies nous permettent de reconnaître votre navigateur 
              et d'améliorer votre expérience sur notre plateforme.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Types de cookies utilisés</h2>
            
            <div className="text-gray-600 mb-6">
              <h3 className="text-lg font-semibold mb-2">Cookies essentiels :</h3>
              <p className="mb-2">Ces cookies sont nécessaires au fonctionnement du site :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Cookies de session pour maintenir votre connexion</li>
                <li>Cookies de sécurité pour protéger vos données</li>
                <li>Cookies de préférences pour mémoriser vos choix</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Cookies de performance :</h3>
              <p className="mb-2">Ces cookies nous aident à améliorer notre site :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Google Analytics pour analyser l'utilisation du site</li>
                <li>Cookies de mesure d'audience</li>
                <li>Cookies de test A/B pour optimiser l'expérience</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Cookies fonctionnels :</h3>
              <p className="mb-2">Ces cookies améliorent votre expérience :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Mémorisation de vos préférences de recherche</li>
                <li>Sauvegarde de votre localisation</li>
                <li>Personnalisation de l'interface</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Cookies publicitaires :</h3>
              <p className="mb-2">Ces cookies permettent la personnalisation publicitaire :</p>
              <ul className="list-disc pl-6">
                <li>Cookies de ciblage publicitaire</li>
                <li>Cookies de réseaux sociaux</li>
                <li>Cookies de partenaires marketing</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Durée de conservation</h2>
            <div className="text-gray-600 mb-6">
              <ul className="list-disc pl-6">
                <li><strong>Cookies de session :</strong> Supprimés à la fermeture du navigateur</li>
                <li><strong>Cookies persistants :</strong> Conservés de 1 mois à 2 ans selon leur fonction</li>
                <li><strong>Cookies analytiques :</strong> Conservés 26 mois maximum</li>
                <li><strong>Cookies publicitaires :</strong> Conservés 13 mois maximum</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Gestion de vos cookies</h2>
            <div className="text-gray-600 mb-6">
              <h3 className="text-lg font-semibold mb-2">Via notre plateforme :</h3>
              <p className="mb-4">
                Vous pouvez gérer vos préférences de cookies via le bandeau qui apparaît 
                lors de votre première visite ou en accédant aux paramètres de cookies 
                dans le pied de page.
              </p>

              <h3 className="text-lg font-semibold mb-2">Via votre navigateur :</h3>
              <p className="mb-2">Vous pouvez également configurer votre navigateur pour :</p>
              <ul className="list-disc pl-6">
                <li>Accepter ou refuser tous les cookies</li>
                <li>Être averti avant l'installation d'un cookie</li>
                <li>Supprimer les cookies existants</li>
                <li>Bloquer les cookies tiers</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Instructions par navigateur</h2>
            <div className="text-gray-600 mb-6">
              <ul className="list-disc pl-6">
                <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
                <li><strong>Firefox :</strong> Paramètres → Vie privée et sécurité → Cookies</li>
                <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
                <li><strong>Edge :</strong> Paramètres → Cookies et autorisations de site</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies tiers</h2>
            <div className="text-gray-600 mb-6">
              <p className="mb-2">Notre site utilise des services tiers qui peuvent déposer leurs propres cookies :</p>
              <ul className="list-disc pl-6">
                <li><strong>Google Analytics :</strong> Analyse d'audience</li>
                <li><strong>Stripe :</strong> Traitement des paiements</li>
                <li><strong>Réseaux sociaux :</strong> Boutons de partage</li>
                <li><strong>Cartes :</strong> Géolocalisation et cartes interactives</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Conséquences du refus</h2>
            <p className="text-gray-600 mb-6">
              Le refus de certains cookies peut limiter votre expérience sur notre site. 
              Les cookies essentiels ne peuvent pas être désactivés car ils sont nécessaires 
              au fonctionnement de base de la plateforme.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Mise à jour de cette politique</h2>
            <p className="text-gray-600 mb-6">
              Cette politique peut être mise à jour pour refléter les changements dans 
              notre utilisation des cookies. Nous vous encourageons à la consulter 
              régulièrement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant notre utilisation des cookies, 
              contactez-nous à : cookies@comebookus.com
            </p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
