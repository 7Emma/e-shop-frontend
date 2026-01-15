import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message envoyé:", formData);
    alert("Merci ! Votre message a été envoyé avec succès.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="w-full bg-white">
      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Nous Contacter</h1>
          <p className="text-xl text-red-100">
            Une question ? Nous sommes ici pour vous aider
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info */}
          {[
            {
              icon: Phone,
              title: "Téléphone",
              content: "+33 1 23 45 67 89",
              subtext: "Lun-Ven: 9h-18h"
            },
            {
              icon: Mail,
              title: "Email",
              content: "contact@eliteshop.fr",
              subtext: "Réponse en moins de 24h"
            },
            {
              icon: MapPin,
              title: "Adresse",
              content: "Paris, France",
              subtext: "Zone de livraison: Europe"
            }
          ].map((contact, i) => {
            const Icon = contact.icon;
            return (
              <div key={i} className="p-6 bg-gray-50 rounded-lg text-center">
                <Icon className="mx-auto mb-4 text-red-600" size={40} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
                <p className="text-gray-900 font-semibold mb-1">{contact.content}</p>
                <p className="text-gray-600 text-sm">{contact.subtext}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-600 resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* FAQ & Hours */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Horaires d'ouverture</h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                {[
                  { day: "Lundi - Vendredi", hours: "9h00 - 18h00" },
                  { day: "Samedi", hours: "10h00 - 16h00" },
                  { day: "Dimanche", hours: "Fermé" }
                ].map((schedule, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">FAQ</h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Quel est votre délai de livraison ?",
                    a: "Nous livrons généralement en 2-3 jours ouvrés pour les commandes passées avant 14h."
                  },
                  {
                    q: "Puis-je retourner un article ?",
                    a: "Oui, vous avez 30 jours pour retourner vos articles sans frais."
                  },
                  {
                    q: "Proposez-vous du paiement en plusieurs fois ?",
                    a: "Oui, avec notre partenaire de paiement flexible à partir de 100€."
                  }
                ].map((faq, i) => (
                  <div key={i} className="border-l-4 border-red-600 pl-4">
                    <p className="font-semibold text-gray-900 mb-1">{faq.q}</p>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
