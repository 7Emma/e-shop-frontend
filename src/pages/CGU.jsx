import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function CGU() {
  return (
    <>
      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Conditions Générales d'Utilisation
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Objet
              </h2>
              <p>
                Les présentes conditions générales d'utilisation régissent l'accès et l'utilisation
                du site e-commerce E-Shop. En accédant à ce site, vous acceptez de vous conformer à
                ces conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Utilisation du site
              </h2>
              <p>
                Vous vous engagez à utiliser ce site de manière légale et conforme à ses conditions.
                Vous ne pouvez pas :
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Transmettre du contenu offensant, abusif ou illégal</li>
                <li>Tenter de hacker ou d'accéder non autorisé au site</li>
                <li>Copier ou reproduire le contenu sans autorisation</li>
                <li>Utiliser le site à des fins commerciales non autorisées</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Produits et tarifs
              </h2>
              <p>
                Tous les produits et tarifs sont présentés à titre informatif. E-Shop se réserve
                le droit de modifier les tarifs et la disponibilité des produits à tout moment.
                Les prix sont en euros TTC sauf mention contraire.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Commandes et livraison
              </h2>
              <p>
                Les commandes sont acceptées sous réserve de disponibilité des produits.
                Les délais de livraison indiqués sont donnés à titre informatif et non contractuel.
                E-Shop ne pourra être tenu responsable des retards de livraison dus aux
                transporteurs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Paiement
              </h2>
              <p>
                Le paiement doit être effectué selon les modalités proposées lors de la commande.
                Tous les paiements sont sécurisés et traités par notre système de paiement agréé.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Droit de rétractation
              </h2>
              <p>
                Conformément à la législation française, vous disposez d'un délai de 14 jours pour
                vous rétracter après l'achat, sauf pour les produits personnalisés ou périssables.
                Pour exercer ce droit, contactez-nous via le formulaire de contact.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Limitation de responsabilité
              </h2>
              <p>
                E-Shop ne peut être tenu responsable des dommages directs ou indirects résultant
                de l'utilisation ou de l'impossibilité d'utiliser le site ou ses services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Propriété intellectuelle
              </h2>
              <p>
                Tous les contenus du site (textes, images, logos, etc.) sont protégés par les droits
                d'auteur et la propriété intellectuelle. Leur reproduction est interdite sans
                autorisation écrite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Modifications
              </h2>
              <p>
                E-Shop se réserve le droit de modifier ces conditions générales à tout moment.
                Les modifications entrent en vigueur dès leur publication sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Contact
              </h2>
              <p>
                Pour toute question concernant ces conditions, veuillez nous contacter via la
                page de contact de notre site.
              </p>
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

export default CGU;
