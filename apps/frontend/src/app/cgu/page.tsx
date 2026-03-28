"use client";

import LegalPage from "@/components/LegalPage";

export default function CGUPage() {
  return (
    <LegalPage
      badge="CGU"
      title="Conditions générales d'utilisation"
      lastUpdated="28 mars 2026"
      sections={[
        {
          title: "Objet",
          content: (
            <p>
              Les présentes conditions générales d'utilisation (CGU) ont pour
              objet de définir les modalités d'accès et d'utilisation du site
              internet{" "}
              <strong>aissabelkoussa.fr</strong> (ci-après « le Site »), édité
              par Aïssa Belkoussa. L'accès et l'utilisation du Site impliquent
              l'acceptation pleine et entière des présentes CGU.
            </p>
          ),
        },
        {
          title: "Accès au site",
          content: (
            <>
              <p>
                Le Site est accessible gratuitement à tout utilisateur disposant
                d'un accès à Internet. L'éditeur met en œuvre les moyens
                raisonnables pour assurer un accès continu au Site, mais ne
                saurait garantir une disponibilité permanente.
              </p>
              <p>
                L'accès au Site peut être interrompu à tout moment, sans préavis
                ni indemnité, notamment pour des raisons de maintenance, de mise
                à jour, de sécurité ou en cas de force majeure.
              </p>
            </>
          ),
        },
        {
          title: "Propriété intellectuelle",
          content: (
            <>
              <p>
                L'ensemble des éléments composant le Site (textes, images,
                vidéos, code source, maquettes, logos, animations, architecture,
                design) sont protégés par le droit de la propriété
                intellectuelle et restent la propriété exclusive d'Aïssa
                Belkoussa, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, distribution
                ou exploitation de tout ou partie du contenu du Site, par
                quelque procédé que ce soit, sans l'autorisation écrite
                préalable de l'éditeur, est strictement interdite et constitue
                un délit de contrefaçon sanctionné par les articles L.335-2 et
                suivants du Code de la Propriété Intellectuelle.
              </p>
            </>
          ),
        },
        {
          title: "Utilisation du formulaire de contact",
          content: (
            <>
              <p>
                Le Site met à disposition un formulaire de contact permettant
                aux utilisateurs d'adresser des demandes de renseignement ou de
                devis. En utilisant ce formulaire, l'utilisateur s'engage à :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Fournir des informations exactes, complètes et à jour
                </li>
                <li>
                  Ne pas utiliser le formulaire à des fins abusives, frauduleuses
                  ou illicites
                </li>
                <li>
                  Ne pas transmettre de contenu injurieux, diffamatoire,
                  discriminatoire ou contraire à l'ordre public
                </li>
                <li>
                  Ne pas tenter de perturber le fonctionnement du Site
                  (spam, injection, scraping, etc.)
                </li>
              </ul>
              <p className="mt-3">
                L'éditeur se réserve le droit de ne pas donner suite à toute
                demande qu'il estimerait abusive ou contraire aux présentes CGU.
              </p>
            </>
          ),
        },
        {
          title: "Données personnelles",
          content: (
            <p>
              Les données personnelles collectées sur le Site sont traitées
              conformément au Règlement Général sur la Protection des Données
              (RGPD). Pour plus d'informations, consultez la{" "}
              <a
                href="/confidentialite"
                className="text-site-accent hover:underline"
              >
                politique de confidentialité
              </a>
              .
            </p>
          ),
        },
        {
          title: "Liens hypertextes",
          content: (
            <p>
              Le Site peut contenir des liens vers des sites tiers (LinkedIn,
              GitHub, Telegram, etc.). Ces liens sont fournis à titre
              informatif. L'éditeur n'exerce aucun contrôle sur ces sites et
              décline toute responsabilité quant à leur contenu, leur
              disponibilité ou les dommages pouvant résulter de leur
              utilisation.
            </p>
          ),
        },
        {
          title: "Limitation de responsabilité",
          content: (
            <>
              <p>
                L'éditeur s'efforce de fournir des informations fiables et à
                jour sur le Site, mais ne garantit pas l'exactitude, la
                complétude ou l'exhaustivité des informations publiées.
              </p>
              <p>
                L'éditeur ne pourra en aucun cas être tenu responsable :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Des dommages directs ou indirects résultant de l'utilisation
                  ou de l'impossibilité d'utiliser le Site
                </li>
                <li>
                  Des interruptions ou dysfonctionnements du Site, quelle qu'en
                  soit la cause
                </li>
                <li>
                  De l'utilisation faite par des tiers des informations
                  présentes sur le Site
                </li>
                <li>
                  Des virus ou éléments nuisibles qui pourraient infecter
                  l'équipement informatique de l'utilisateur
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Modification des CGU",
          content: (
            <p>
              L'éditeur se réserve le droit de modifier les présentes CGU à
              tout moment. Les modifications prennent effet dès leur
              publication sur cette page. L'utilisateur est invité à consulter
              régulièrement cette page. La date de dernière mise à jour est
              indiquée en haut de ce document.
            </p>
          ),
        },
        {
          title: "Droit applicable et juridiction",
          content: (
            <p>
              Les présentes CGU sont régies par le droit français. En cas de
              litige relatif à l'interprétation ou à l'exécution des présentes,
              et à défaut de résolution amiable, les tribunaux français seront
              seuls compétents.
            </p>
          ),
        },
      ]}
    />
  );
}
