import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Zap, 
  CreditCard, 
  Calendar, 
  Mail,
  MessageSquare,
  BarChart3,
  Users,
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Mock integrations data
const integrations = [
  {
    id: 1,
    name: "Stripe",
    category: "Paiement",
    description: "Acceptez les paiements en ligne de manière sécurisée avec Stripe. Cartes bancaires, virements, et plus encore.",
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
    features: ["Paiements sécurisés", "Gestion des abonnements", "Remboursements automatiques", "Reporting détaillé"],
    popular: true
  },
  {
    id: 2,
    name: "Google Calendar",
    category: "Calendrier",
    description: "Synchronisez automatiquement vos rendez-vous avec Google Calendar pour une gestion optimale.",
    icon: Calendar,
    color: "from-green-500 to-green-600",
    features: ["Synchronisation bidirectionnelle", "Notifications automatiques", "Partage de calendrier", "Gestion des conflits"],
    popular: true
  },
  {
    id: 3,
    name: "Mailchimp",
    category: "Marketing",
    description: "Créez et envoyez des campagnes email personnalisées à vos clients pour fidéliser votre clientèle.",
    icon: Mail,
    color: "from-yellow-500 to-orange-500",
    features: ["Campagnes automatisées", "Segmentation client", "Templates personnalisés", "Analytics avancés"],
    popular: false
  },
  {
    id: 4,
    name: "WhatsApp Business",
    category: "Communication",
    description: "Communiquez directement avec vos clients via WhatsApp pour confirmations et rappels.",
    icon: MessageSquare,
    color: "from-green-400 to-green-500",
    features: ["Messages automatiques", "Confirmations de RDV", "Support client", "Notifications push"],
    popular: true
  },
  {
    id: 5,
    name: "Google Analytics",
    category: "Analytics",
    description: "Analysez le comportement de vos clients et optimisez votre activité avec des données précises.",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
    features: ["Suivi des conversions", "Analyse d'audience", "Rapports personnalisés", "ROI marketing"],
    popular: false
  },
  {
    id: 6,
    name: "Facebook & Instagram",
    category: "Réseaux sociaux",
    description: "Connectez vos réseaux sociaux pour permettre la réservation directement depuis vos pages.",
    icon: Users,
    color: "from-pink-500 to-rose-500",
    features: ["Réservation sociale", "Partage automatique", "Publicités ciblées", "Gestion des avis"],
    popular: false
  },
  {
    id: 7,
    name: "Zapier",
    category: "Automatisation",
    description: "Connectez ComeBookUs à plus de 5000 applications pour automatiser vos workflows.",
    icon: Zap,
    color: "from-orange-500 to-red-500",
    features: ["Workflows personnalisés", "Déclencheurs automatiques", "Intégrations multiples", "Pas de code requis"],
    popular: false
  },
  {
    id: 8,
    name: "API Mobile",
    category: "Mobile",
    description: "Intégrez nos fonctionnalités dans votre application mobile existante via notre API.",
    icon: Smartphone,
    color: "from-indigo-500 to-blue-500",
    features: ["SDK natif", "Documentation complète", "Support technique", "Personnalisation avancée"],
    popular: false
  }
];

const categories = [
  { name: "Tous", count: integrations.length },
  { name: "Paiement", count: integrations.filter(i => i.category === "Paiement").length },
  { name: "Calendrier", count: integrations.filter(i => i.category === "Calendrier").length },
  { name: "Marketing", count: integrations.filter(i => i.category === "Marketing").length },
  { name: "Communication", count: integrations.filter(i => i.category === "Communication").length },
  { name: "Analytics", count: integrations.filter(i => i.category === "Analytics").length }
];

export default function IntegrationsPage() {
  const popularIntegrations = integrations.filter(integration => integration.popular);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Intégrations 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> puissantes</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connectez ComeBookUs à vos outils préférés pour automatiser votre activité 
              et offrir une expérience client exceptionnelle
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Voir toutes les intégrations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Demander une intégration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Integrations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Intégrations populaires
            </h2>
            <p className="text-lg text-gray-600">
              Les outils les plus utilisés par nos clients pour optimiser leur activité
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularIntegrations.map((integration) => {
              const IconComponent = integration.icon;
              return (
                <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow duration-300 relative">
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Populaire
                    </span>
                  </div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${integration.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {integration.name}
                  </h3>
                  
                  <span className="text-sm text-purple-600 font-medium mb-3 block">
                    {integration.category}
                  </span>
                  
                  <p className="text-gray-600 mb-4">
                    {integration.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Fonctionnalités :</h4>
                    <ul className="space-y-1">
                      {integration.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full">
                    Configurer
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Integrations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Toutes nos intégrations
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez l'ensemble de nos partenaires technologiques
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.name}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-colors"
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {integrations.map((integration) => {
              const IconComponent = integration.icon;
              return (
                <Card key={integration.id} className="p-6 hover:shadow-lg transition-shadow duration-300 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-br ${integration.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {integration.name}
                  </h3>
                  
                  <span className="text-sm text-purple-600 font-medium mb-3 block">
                    {integration.category}
                  </span>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {integration.description}
                  </p>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    En savoir plus
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi utiliser nos intégrations ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Automatisation
              </h3>
              <p className="text-gray-600">
                Automatisez vos tâches répétitives et concentrez-vous sur ce qui compte vraiment : 
                vos clients et votre expertise.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Écosystème unifié
              </h3>
              <p className="text-gray-600">
                Centralisez tous vos outils dans une seule plateforme pour une gestion 
                simplifiée de votre activité.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Données centralisées
              </h3>
              <p className="text-gray-600">
                Obtenez une vision complète de votre activité avec des données 
                synchronisées en temps réel.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom Integration */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Besoin d'une intégration personnalisée ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Notre équipe technique peut développer des intégrations sur mesure 
            pour répondre à vos besoins spécifiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api">
              <Button size="lg" variant="secondary">
                Découvrir notre API
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
