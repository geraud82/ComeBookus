import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  MapPin, 
  Clock, 
  Users, 
  Heart,
  Zap,
  Target,
  Coffee,
  Laptop,
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// Mock job data
const jobOpenings = [
  {
    id: 1,
    title: "Développeur Full-Stack Senior",
    department: "Technique",
    location: "Paris, France",
    type: "CDI",
    experience: "5+ ans",
    description: "Rejoignez notre équipe technique pour développer la prochaine génération de notre plateforme de réservation.",
    requirements: [
      "Maîtrise de React, Node.js et TypeScript",
      "Expérience avec les bases de données (PostgreSQL)",
      "Connaissance des API REST et GraphQL",
      "Expérience en développement agile"
    ]
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Produit",
    location: "Paris, France / Remote",
    type: "CDI",
    experience: "3+ ans",
    description: "Définissez la stratégie produit et pilotez le développement de nouvelles fonctionnalités.",
    requirements: [
      "Expérience en gestion de produit digital",
      "Compréhension des enjeux UX/UI",
      "Capacité d'analyse et de synthèse",
      "Anglais courant"
    ]
  },
  {
    id: 3,
    title: "Business Developer",
    department: "Commercial",
    location: "Lyon, France",
    type: "CDI",
    experience: "2+ ans",
    description: "Développez notre réseau de partenaires salons et centres de beauté dans la région Rhône-Alpes.",
    requirements: [
      "Expérience en développement commercial B2B",
      "Connaissance du secteur beauté/bien-être",
      "Excellent relationnel",
      "Mobilité régionale"
    ]
  },
  {
    id: 4,
    title: "UX/UI Designer",
    department: "Design",
    location: "Paris, France",
    type: "CDI",
    experience: "3+ ans",
    description: "Concevez des expériences utilisateur exceptionnelles pour nos clients et partenaires.",
    requirements: [
      "Maîtrise de Figma et des outils de design",
      "Expérience en design d'interfaces mobiles",
      "Connaissance des principes d'accessibilité",
      "Portfolio démontrant votre expertise"
    ]
  }
];

const benefits = [
  {
    icon: Heart,
    title: "Bien-être au travail",
    description: "Horaires flexibles, télétravail partiel, et espaces de détente"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Environnement stimulant avec les dernières technologies"
  },
  {
    icon: Users,
    title: "Équipe passionnée",
    description: "Collaborez avec des experts motivés par l'excellence"
  },
  {
    icon: Target,
    title: "Impact réel",
    description: "Contribuez à révolutionner l'industrie de la beauté"
  },
  {
    icon: Coffee,
    title: "Avantages",
    description: "Mutuelle, tickets restaurant, et événements d'équipe"
  },
  {
    icon: Laptop,
    title: "Équipement",
    description: "Matériel de qualité et budget formation continue"
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Rejoignez 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> l'aventure</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Construisons ensemble l'avenir de la beauté et du bien-être en France
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Voir les offres
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Candidature spontanée
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous rejoindre ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez ce qui fait de ComeBookUs un environnement de travail exceptionnel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Offres d'emploi
            </h2>
            <p className="text-lg text-gray-600">
              Découvrez nos opportunités actuelles et trouvez votre prochain défi
            </p>
          </div>

          <div className="space-y-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                        {job.department}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {job.experience}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {job.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Profil recherché :</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="lg:ml-6 lg:flex-shrink-0">
                    <Button>
                      Postuler
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre culture d'entreprise
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Innovation continue
                  </h3>
                  <p className="text-gray-600">
                    Nous encourageons la créativité et l'expérimentation. Chaque idée compte 
                    et peut contribuer à améliorer notre plateforme.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Collaboration
                  </h3>
                  <p className="text-gray-600">
                    Nos équipes travaillent en synergie, partageant leurs connaissances 
                    et s'entraidant pour atteindre nos objectifs communs.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Développement personnel
                  </h3>
                  <p className="text-gray-600">
                    Nous investissons dans la formation continue de nos équipes et 
                    encourageons l'évolution de carrière interne.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Collaborateurs</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">5</div>
                <div className="text-gray-600">Bureaux en France</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Satisfaction employés</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                <div className="text-gray-600">Ans d'âge moyen</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre processus de recrutement
            </h2>
            <p className="text-lg text-gray-600">
              Un processus transparent et bienveillant pour mieux nous connaître
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Candidature</h3>
              <p className="text-gray-600 text-sm">
                Envoyez-nous votre CV et lettre de motivation via notre formulaire
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">2</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Premier contact</h3>
              <p className="text-gray-600 text-sm">
                Entretien téléphonique avec notre équipe RH (30 minutes)
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Entretien technique</h3>
              <p className="text-gray-600 text-sm">
                Rencontre avec l'équipe et test pratique selon le poste
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Décision</h3>
              <p className="text-gray-600 text-sm">
                Retour sous 48h et intégration dans l'équipe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à nous rejoindre ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Envoyez-nous votre candidature ou contactez-nous pour en savoir plus sur nos opportunités.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Postuler maintenant
            </Button>
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
