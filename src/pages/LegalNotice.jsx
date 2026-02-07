import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function LegalNotice() {
  return (
    <>
      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Mentions Légales
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Informations sur l'entreprise
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Nom du site :</strong> E-Shop
                </p>
                <p>
                  <strong>Type :</strong> Site de commerce électronique
                </p>
                <p>
                  <strong>Responsable de la publication :</strong> Emmanuel
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Hébergement
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>Hébergeur :</strong> [À remplir avec votre hébergeur]
                </p>
                <p>
                  <strong>Adresse :</strong> [À remplir]
                </p>
                <p>
                  <strong>Téléphone :</strong> [À remplir]
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Directeur de la publication
              </h2>
              <p>
                Le directeur de la publication est Emmanuel, responsable du contenu du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Propriété intellectuelle
              </h2>
              <p>
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est la
                propriété exclusive d'E-Shop ou de ses fournisseurs de contenu. Toute
                reproduction, distribution ou transmission, sous quelque forme ou par quelque
                moyen que ce soit, est interdite sans l'autorisation préalable écrite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Responsabilité
              </h2>
              <p>
                E-Shop s'efforce d'assurer l'exactitude des informations présentes sur le site.
                Cependant, E-Shop n'assume aucune responsabilité pour les erreurs, omissions ou
                les dommages directs ou indirects résultant de l'utilisation du site ou de ses
                contenus.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Liens externes
              </h2>
              <p>
                Le site peut contenir des liens vers des sites externes. E-Shop n'est pas
                responsable du contenu de ces sites externes et ne peut garantir leur conformité
                avec la législation applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Droit applicable
              </h2>
              <p>
                Ces mentions légales et conditions générales d'utilisation sont régies par la
                loi française. Tout litige sera soumis à la juridiction exclusive des tribunaux
                français.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Données personnelles
              </h2>
              <p>
                Pour plus d'informations sur le traitement de vos données personnelles, veuillez
                consulter notre <a href="/politique-confidentialite" className="text-red-600 hover:text-red-700 underline">
                  politique de confidentialité
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Contact
              </h2>
              <p>
                Pour toute question ou demande concernant ce site, veuillez nous contacter :
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Via notre formulaire de contact</li>
                <li>Par courrier électronique : [À remplir]</li>
                <li>Par téléphone : [À remplir]</li>
              </ul>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default LegalNotice;
