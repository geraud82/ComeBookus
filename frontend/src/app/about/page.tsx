import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  MapPin,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              À propos de 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> ComeBookUs</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Nous connectons les clients avec les meilleurs professionnels de la beauté et du bien-être, 
              en simplifiant la réservation en ligne.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Chez ComeBookUs, nous croyons que prendre soin de soi devrait être simple et accessible. 
                Notre plateforme révolutionne la façon dont vous découvrez et réservez vos services de beauté préférés.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Nous aidons les professionnels à développer leur activité tout en offrant aux clients 
                une expérience de réservation fluide et personnalisée.
              </p>
              <Link href="/contact">
                <Button size="lg">
                  Contactez-nous
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">10K+</h3>
                <p className="text-gray-600">Clients satisfaits</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                <p className="text-gray-600">Établissements partenaires</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
                <p className="text-gray-600">Réservation en ligne</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h3>
                <p className="text-gray-600">Note moyenne</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident notre mission et notre vision pour l'avenir
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Excellence
              </h3>
              <p className="text-gray-600">
                Nous nous engageons à offrir la meilleure expérience possible, 
                tant pour nos clients que pour nos partenaires professionnels.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Bienveillance
              </h3>
              <p className="text-gray-600">
                Nous plaçons l'humain au cœur de notre démarche, en créant des liens 
                authentiques entre clients et professionnels.
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Innovation
              </h3>
              <p className="text-gray-600">
                Nous innovons constamment pour simplifier et améliorer l'expérience 
                de réservation en ligne.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Engagement
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nous nous engageons à révolutionner l'industrie de la beauté et du bien-être 
              en France, une réservation à la fois.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Pour les Clients
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Découverte facile des meilleurs établissements</li>
                    <li>• Réservation en ligne 24h/24</li>
                    <li>• Avis et évaluations authentiques</li>
                    <li>• Géolocalisation précise</li>
                    <li>• Notifications et rappels automatiques</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Pour les Professionnels
                  </h3>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Visibilité accrue en ligne</li>
                    <li>• Gestion simplifiée des rendez-vous</li>
                    <li>• Outils de marketing intégrés</li>
                    <li>• Paiements sécurisés</li>
                    <li>• Analytics et rapports détaillés</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Rejoignez la révolution beauté
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Que vous soyez client ou professionnel, découvrez comment ComeBookUs 
            peut transformer votre expérience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="secondary">
                Trouver un salon
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                Devenir partenaire
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
