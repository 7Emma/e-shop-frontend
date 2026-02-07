import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

function PrivacyPolicy() {
  return (
    <>
      <main className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Politique de Confidentialité
          </h1>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p>
                E-Shop accorde une grande importance à la protection de vos données personnelles.
                Cette politique de confidentialité explique comment nous collectons, utilisons,
                protégeons et partageons vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Données collectées
              </h2>
              <p className="mb-3">Nous collectons les types de données suivants :</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Données d'identification :</strong> Nom, prénom, adresse email, numéro
                  de téléphone
                </li>
                <li>
                  <strong>Données de livraison :</strong> Adresse de livraison, ville, code postal
                </li>
                <li>
                  <strong>Données de paiement :</strong> Informations bancaires (traitées de manière
                  sécurisée)
                </li>
                <li>
                  <strong>Données de navigation :</strong> Adresse IP, cookies, historique de
                  consultation
                </li>
                <li>
                  <strong>Données d'interaction :</strong> Commentaires, avis, messages de contact
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Utilisation des données
              </h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Traiter et livrer vos commandes</li>
                <li>Gérer votre compte client</li>
                <li>Vous envoyer des confirmations de commande et de livraison</li>
                <li>Communiquer avec vous concernant vos demandes</li>
                <li>Améliorer nos services et l'expérience utilisateur</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Protection des données
              </h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos
                données personnelles contre l'accès non autorisé, l'altération, la divulgation
                ou la destruction. Nos serveurs sont sécurisés avec un chiffrement SSL/TLS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Partage des données
              </h2>
              <p>
                Nous ne partageons pas vos données personnelles avec des tiers, sauf :
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Aux prestataires de livraison pour l'expédition de vos commandes</li>
                <li>Aux sociétés de paiement pour le traitement des transactions</li>
                <li>Si requis par la loi ou par une autorité compétente</li>
                <li>Avec votre consentement explicite</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Cookies
              </h2>
              <p>
                Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez
                contrôler l'utilisation des cookies via les paramètres de votre navigateur.
                Certains cookies sont nécessaires au fonctionnement du site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Vos droits
              </h2>
              <p>
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification de vos données</li>
                <li>Droit à l'oubli</li>
                <li>Droit de limitation du traitement</li>
                <li>Droit à la portabilité des données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Durée de conservation
              </h2>
              <p>
                Vos données sont conservées aussi longtemps que nécessaire pour accomplir les
                finalités pour lesquelles elles ont été collectées, ou pour respecter les
                obligations légales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Modifications de cette politique
              </h2>
              <p>
                Nous pouvons modifier cette politique de confidentialité à tout moment.
                Les modifications entrent en vigueur dès leur publication sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Contact
              </h2>
              <p>
                Pour toute question ou demande concernant vos données personnelles, veuillez
                nous contacter via le formulaire de contact de notre site.
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

export default PrivacyPolicy;
