import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Code, 
  Key, 
  Book, 
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Copy,
  CheckCircle,
  ExternalLink,
  Download
} from 'lucide-react';
import Link from 'next/link';

// Mock API endpoints data
const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/v1/businesses",
    description: "Récupérer la liste des établissements",
    parameters: ["lat", "lng", "radius", "type", "limit"],
    response: "Liste des établissements avec leurs informations"
  },
  {
    method: "POST",
    endpoint: "/api/v1/bookings",
    description: "Créer une nouvelle réservation",
    parameters: ["business_id", "service_id", "date", "time", "customer"],
    response: "Détails de la réservation créée"
  },
  {
    method: "GET",
    endpoint: "/api/v1/bookings/{id}",
    description: "Récupérer les détails d'une réservation",
    parameters: ["id"],
    response: "Informations complètes de la réservation"
  },
  {
    method: "PUT",
    endpoint: "/api/v1/bookings/{id}",
    description: "Modifier une réservation existante",
    parameters: ["id", "date", "time", "status"],
    response: "Réservation mise à jour"
  },
  {
    method: "GET",
    endpoint: "/api/v1/services",
    description: "Lister les services disponibles",
    parameters: ["business_id", "category", "price_min", "price_max"],
    response: "Liste des services avec tarifs et durées"
  },
  {
    method: "POST",
    endpoint: "/api/v1/webhooks",
    description: "Configurer des webhooks pour les événements",
    parameters: ["url", "events", "secret"],
    response: "Configuration du webhook"
  }
];

const sdks = [
  {
    name: "JavaScript/Node.js",
    description: "SDK officiel pour applications JavaScript et Node.js",
    icon: "🟨",
    install: "npm install @comebookus/sdk",
    github: "https://github.com/comebookus/sdk-js"
  },
  {
    name: "Python",
    description: "SDK Python pour intégrations backend",
    icon: "🐍",
    install: "pip install comebookus-sdk",
    github: "https://github.com/comebookus/sdk-python"
  },
  {
    name: "PHP",
    description: "SDK PHP pour applications web",
    icon: "🐘",
    install: "composer require comebookus/sdk",
    github: "https://github.com/comebookus/sdk-php"
  },
  {
    name: "React Native",
    description: "SDK pour applications mobiles React Native",
    icon: "📱",
    install: "npm install @comebookus/react-native-sdk",
    github: "https://github.com/comebookus/sdk-react-native"
  }
];

const codeExample = `// Exemple d'utilisation de l'API ComeBookUs
import { ComeBookUs } from '@comebookus/sdk';

const client = new ComeBookUs({
  apiKey: 'votre_clé_api',
  environment: 'production'
});

// Rechercher des établissements
const businesses = await client.businesses.search({
  lat: 48.8566,
  lng: 2.3522,
  radius: 10,
  type: 'SALON'
});

// Créer une réservation
const booking = await client.bookings.create({
  businessId: 'business_123',
  serviceId: 'service_456',
  date: '2024-02-15',
  time: '14:30',
  customer: {
    name: 'Marie Dupont',
    email: 'marie@example.com'
  }
});

console.log('Réservation créée:', booking.id);`;

export default function APIPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              API 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> ComeBookUs</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Intégrez facilement nos fonctionnalités de réservation dans vos applications 
              avec notre API REST moderne et nos SDKs officiels
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Commencer maintenant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                <Book className="w-4 h-4 mr-2" />
                Documentation complète
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Une API puissante et simple
            </h2>
            <p className="text-lg text-gray-600">
              Tout ce dont vous avez besoin pour intégrer la réservation en ligne
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rapide et fiable
              </h3>
              <p className="text-gray-600">
                API REST avec des temps de réponse < 100ms et une disponibilité de 99.9%
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Sécurisée
              </h3>
              <p className="text-gray-600">
                Authentification par clé API, chiffrement HTTPS et conformité RGPD
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Évolutive
              </h3>
              <p className="text-gray-600">
                Gère des milliers de requêtes par seconde avec une architecture moderne
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Commencez en quelques minutes
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Notre API est conçue pour être intuitive et facile à utiliser. 
                Quelques lignes de code suffisent pour intégrer la réservation 
                dans votre application.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Documentation interactive</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">SDKs officiels disponibles</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Support technique dédié</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Environnement de test gratuit</span>
                </div>
              </div>
            </div>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Code className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-medium text-gray-900">Exemple d'intégration</span>
                </div>
                <Button size="sm" variant="ghost">
                  <Copy className="w-4 h-4 mr-1" />
                  Copier
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Endpoints principaux
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez les fonctionnalités clés de notre API
            </p>
          </div>

          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium mr-3 ${
                        endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                        endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-lg font-mono text-gray-900">
                        {endpoint.endpoint}
                      </code>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      {endpoint.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <span key={paramIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                          {param}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:ml-6 lg:flex-shrink-0 mt-4 lg:mt-0">
                    <Button size="sm" variant="outline">
                      Tester
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              SDKs officiels
            </h2>
            <p className="text-lg text-gray-600">
              Utilisez nos SDKs pour une intégration encore plus rapide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sdks.map((sdk, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{sdk.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {sdk.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {sdk.description}
                    </p>
                    
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                      <code className="text-sm text-gray-800">
                        {sdk.install}
                      </code>
                      <Button size="sm" variant="ghost" className="ml-2">
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Télécharger
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment commencer
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Créer un compte</h3>
              <p className="text-gray-600 text-sm">
                Inscrivez-vous gratuitement pour accéder à votre tableau de bord développeur
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Obtenir vos clés API</h3>
              <p className="text-gray-600 text-sm">
                Générez vos clés d'authentification pour l'environnement de test
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Intégrer l'API</h3>
              <p className="text-gray-600 text-sm">
                Utilisez nos SDKs ou appelez directement notre API REST
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Passer en production</h3>
              <p className="text-gray-600 text-sm">
                Testez votre intégration puis activez l'environnement de production
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Créez votre compte développeur et commencez à intégrer notre API dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Créer un compte développeur
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                Contacter l'équipe technique
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
