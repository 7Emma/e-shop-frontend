import { Users, Award, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  return (
    <main className="w-full bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">À Propos d'EliteShop</h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Depuis 2010, nous vous proposons les plus belles collections de mode, beauté et accessoires
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Notre Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Chez EliteShop, nous croyons que la qualité et le style sont accessibles à tous. 
                Notre mission est de proposer des produits premium à des prix justes, en mettant l'accent 
                sur la satisfaction client et la durabilité.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous sélectionnons chaque article avec soin auprès de nos partenaires, garantissant 
                une qualité irréprochable et des designs tendance.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Votre satisfaction est notre priorité. C'est pourquoi nous offrons des retours gratuits, 
                une livraison rapide et un service client 24/7.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554995207-c18231b6ce15?w=600&h=600&q=85&fit=crop"
                alt="Notre équipe"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: "Qualité",
                description: "Nous garantissons les meilleurs produits avec les meilleures matières premières"
              },
              {
                icon: Users,
                title: "Service Client",
                description: "Notre équipe est disponible 24/7 pour répondre à vos questions"
              },
              {
                icon: Globe,
                title: "Durabilité",
                description: "Nous nous engageons pour l'environnement et les pratiques responsables"
              },
              {
                icon: Award,
                title: "Innovation",
                description: "Nous restons à la pointe des tendances et innovations"
              }
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition">
                  <Icon className="mx-auto mb-4 text-red-600" size={40} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20 bg-gray-50 rounded-lg p-12">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Nos Chiffres</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500K+", label: "Clients satisfaits" },
              { number: "14+", label: "Années d'expérience" },
              { number: "10K+", label: "Produits disponibles" },
              { number: "99.8%", label: "Satisfaction client" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold text-red-600 mb-2">{stat.number}</p>
                <p className="text-gray-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophie Martin",
                role: "PDG & Fondatrice",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=85&fit=crop"
              },
              {
                name: "Jean Dupont",
                role: "Directeur Opérationnel",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=85&fit=crop"
              },
              {
                name: "Marie Beaumont",
                role: "Responsable Produits",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&q=85&fit=crop"
              }
            ].map((member, i) => (
              <div key={i} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir notre collection ?</h2>
          <p className="text-red-100 mb-6 text-lg max-w-2xl mx-auto">
            Explorez nos milliers de produits de qualité supérieure et trouvez votre style unique
          </p>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition"
          >
            Commencer maintenant
          </Link>
        </section>
      </div>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Questions Fréquentes</h2>
          <div className="space-y-6">
            {[
              {
                q: "Qui sommes-nous ?",
                a: "EliteShop est une boutique en ligne spécialisée dans la mode, beauté et accessoires premium depuis 2010."
              },
              {
                q: "Livrez-vous à l'international ?",
                a: "Oui, nous livrons dans plus de 150 pays à travers le monde avec des frais d'expédition compétitifs."
              },
              {
                q: "Quelle est votre politique de retour ?",
                a: "Vous avez 30 jours pour retourner vos articles sans frais si vous changez d'avis."
              },
              {
                q: "Proposez-vous un service client ?",
                a: "Bien sûr ! Notre équipe est disponible 24/7 pour répondre à vos questions via chat, email ou téléphone."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
