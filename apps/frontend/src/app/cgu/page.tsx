"use client";

import LegalPage from "@/components/LegalPage";

export default function CGUPage() {
  return (
    <LegalPage
      badge="CGU"
      title="Conditions generales d'utilisation"
      lastUpdated="28 mars 2026"
      sections={[
        {
          title: "Objet",
          content: (
            <p>
              Les presentes conditions generales d'utilisation (CGU) ont pour
              objet de definir les modalites d'acces et d'utilisation du site
              internet{" "}
              <strong>aissabelkoussa.fr</strong> (ci-apres « le Site »), edite
              par Aïssa Belkoussa. L'acces et l'utilisation du Site impliquent
              l'acceptation pleine et entiere des presentes CGU.
            </p>
          ),
        },
        {
          title: "Acces au site",
          content: (
            <>
              <p>
                Le Site est accessible gratuitement a tout utilisateur disposant
                d'un acces a Internet. L'editeur met en oeuvre les moyens
                raisonnables pour assurer un acces continu au Site, mais ne
                saurait garantir une disponibilite permanente.
              </p>
              <p>
                L'acces au Site peut etre interrompu a tout moment, sans preavis
                ni indemnite, notamment pour des raisons de maintenance, de mise
                a jour, de securite ou en cas de force majeure.
              </p>
            </>
          ),
        },
        {
          title: "Propriete intellectuelle",
          content: (
            <>
              <p>
                L'ensemble des elements composant le Site (textes, images,
                videos, code source, maquettes, logos, animations, architecture,
                design) sont proteges par le droit de la propriete
                intellectuelle et restent la propriete exclusive d'Aïssa
                Belkoussa, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, representation, modification, distribution
                ou exploitation de tout ou partie du contenu du Site, par
                quelque procede que ce soit, sans l'autorisation ecrite
                prealable de l'editeur, est strictement interdite et constitue
                un delit de contrefacon sanctionne par les articles L.335-2 et
                suivants du Code de la Propriete Intellectuelle.
              </p>
            </>
          ),
        },
        {
          title: "Utilisation du formulaire de contact",
          content: (
            <>
              <p>
                Le Site met a disposition un formulaire de contact permettant
                aux utilisateurs d'adresser des demandes de renseignement ou de
                devis. En utilisant ce formulaire, l'utilisateur s'engage a :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Fournir des informations exactes, completes et a jour
                </li>
                <li>
                  Ne pas utiliser le formulaire a des fins abusives, frauduleuses
                  ou illicites
                </li>
                <li>
                  Ne pas transmettre de contenu injurieux, diffamatoire,
                  discriminatoire ou contraire a l'ordre public
                </li>
                <li>
                  Ne pas tenter de perturber le fonctionnement du Site
                  (spam, injection, scraping, etc.)
                </li>
              </ul>
              <p className="mt-3">
                L'editeur se reserve le droit de ne pas donner suite a toute
                demande qu'il estimerait abusive ou contraire aux presentes CGU.
              </p>
            </>
          ),
        },
        {
          title: "Donnees personnelles",
          content: (
            <p>
              Les donnees personnelles collectees sur le Site sont traitees
              conformement au Reglement General sur la Protection des Donnees
              (RGPD). Pour plus d'informations, consultez la{" "}
              <a
                href="/confidentialite"
                className="text-site-accent hover:underline"
              >
                politique de confidentialite
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
              GitHub, Telegram, etc.). Ces liens sont fournis a titre
              informatif. L'editeur n'exerce aucun controle sur ces sites et
              decline toute responsabilite quant a leur contenu, leur
              disponibilite ou les dommages pouvant resulter de leur
              utilisation.
            </p>
          ),
        },
        {
          title: "Limitation de responsabilite",
          content: (
            <>
              <p>
                L'editeur s'efforce de fournir des informations fiables et a
                jour sur le Site, mais ne garantit pas l'exactitude, la
                completude ou l'exhaustivite des informations publiees.
              </p>
              <p>
                L'editeur ne pourra en aucun cas etre tenu responsable :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Des dommages directs ou indirects resultant de l'utilisation
                  ou de l'impossibilite d'utiliser le Site
                </li>
                <li>
                  Des interruptions ou dysfonctionnements du Site, quelle qu'en
                  soit la cause
                </li>
                <li>
                  De l'utilisation faite par des tiers des informations
                  presentes sur le Site
                </li>
                <li>
                  Des virus ou elements nuisibles qui pourraient infecter
                  l'equipement informatique de l'utilisateur
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Modification des CGU",
          content: (
            <p>
              L'editeur se reserve le droit de modifier les presentes CGU a
              tout moment. Les modifications prennent effet des leur
              publication sur cette page. L'utilisateur est invite a consulter
              regulierement cette page. La date de derniere mise a jour est
              indiquee en haut de ce document.
            </p>
          ),
        },
        {
          title: "Droit applicable et juridiction",
          content: (
            <p>
              Les presentes CGU sont regies par le droit francais. En cas de
              litige relatif a l'interpretation ou a l'execution des presentes,
              et a defaut de resolution amiable, les tribunaux francais seront
              seuls competents.
            </p>
          ),
        },
      ]}
    />
  );
}
