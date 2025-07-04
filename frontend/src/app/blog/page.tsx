import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Calendar, 
  User, 
  ArrowRight,
  Clock,
  Tag,
  TrendingUp,
  Sparkles,
  Heart,
  Scissors
} from 'lucide-react';
import Link from 'next/link';

// Mock blog data - in a real app, this would come from a CMS or API
const blogPosts = [
  {
    id: 1,
    title: "Les tendances coiffure 2024 : Ce qui vous attend cette année",
    excerpt: "Découvrez les coupes et couleurs qui feront sensation cette année. Des looks audacieux aux styles plus naturels, voici ce qui vous attend.",
    author: "Marie Dubois",
    date: "2024-01-15",
    readTime: "5 min",
    category: "Tendances",
    image: "/api/placeholder/400/250",
    featured: true
  },
  {
    id: 2,
    title: "Comment préparer sa peau avant un soin du visage",
    excerpt: "Les étapes essentielles pour optimiser les bienfaits de votre soin du visage et obtenir des résultats durables.",
    author: "Sophie Martin",
    date: "2024-01-12",
    readTime: "3 min",
    category: "Soins",
    image: "/api/placeholder/400/250",
    featured: false
  },
  {
    id: 3,
    title: "Massage : Les bienfaits insoupçonnés pour votre santé",
    excerpt: "Au-delà de la relaxation, découvrez comment le massage peut améliorer votre bien-être physique et mental.",
    author: "Thomas Leroy",
    date: "2024-01-10",
    readTime: "4 min",
    category: "Bien-être",
    image: "/api/placeholder/400/250",
    featured: false
  },
  {
    id: 4,
    title: "Manucure parfaite : Guide étape par étape",
    excerpt: "Tous nos conseils pour réussir votre manucure à la maison ou savoir quoi demander en salon.",
    author: "Emma Rousseau",
    date: "2024-01-08",
    readTime: "6 min",
    category: "Beauté",
    image: "/api/placeholder/400/250",
    featured: false
  },
  {
    id: 5,
    title: "Choisir son salon de coiffure : Les critères essentiels",
    excerpt: "Comment s'assurer de faire le bon choix pour ses cheveux ? Nos experts vous donnent leurs conseils.",
    author: "Pierre Moreau",
    date: "2024-01-05",
    readTime: "4 min",
    category: "Conseils",
    image: "/api/placeholder/400/250",
    featured: false
  },
  {
    id: 6,
    title: "Épilation : Tout savoir sur les différentes techniques",
    excerpt: "Cire, laser, épilateur électrique... Découvrez quelle méthode convient le mieux à votre peau.",
    author: "Julie Blanc",
    date: "2024-01-03",
    readTime: "5 min",
    category: "Soins",
    image: "/api/placeholder/400/250",
    featured: false
  }
];

const categories = [
  { name: "Tendances", icon: TrendingUp, count: 12 },
  { name: "Soins", icon: Sparkles, count: 8 },
  { name: "Bien-être", icon: Heart, count: 6 },
  { name: "Beauté", icon: Sparkles, count: 10 },
  { name: "Conseils", icon: Scissors, count: 15 }
];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Blog 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Beauté</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conseils d'experts, tendances et astuces pour sublimer votre beauté au quotidien
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Article à la une</h2>
            </div>
            
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="text-gray-500 text-sm ml-4 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(featuredPost.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">{featuredPost.author}</span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    
                    <Button>
                      Lire l'article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Derniers articles</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-gray-500 text-sm ml-3 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          <span className="mr-3">{post.author}</span>
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                        
                        <Button size="sm" variant="ghost">
                          Lire plus
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Categories */}
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Catégories</h3>
                <div className="space-y-3">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <div key={category.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <IconComponent className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="text-gray-700">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Newsletter */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Newsletter</h3>
                <p className="text-gray-600 mb-4">
                  Recevez nos derniers conseils beauté et bien-être directement dans votre boîte mail.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Votre adresse e-mail"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button className="w-full">
                    S'abonner
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à prendre soin de vous ?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Découvrez les meilleurs professionnels près de chez vous et réservez votre prochain rendez-vous.
          </p>
          <Link href="/">
            <Button size="lg" variant="secondary">
              Trouver un salon
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
