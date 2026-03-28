"use client";

import LegalPage from "@/components/LegalPage";

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      badge="Mentions legales"
      title="Mentions legales"
      lastUpdated="28 mars 2026"
      sections={[
        {
          title: "Editeur du site",
          content: (
            <>
              <p>
                Le site <strong>aissabelkoussa.fr</strong> est edite par :
              </p>
              <p>
                <strong>Aïssa Belkoussa</strong>
                <br />
                Entrepreneur individuel (micro-entreprise)
                <br />
                SIREN : 937 690 592
                <br />
                SIRET : 937 690 592 00012
                <br />
                Code NAF : 5911B
                <br />
                Adresse : Albi, 81000 — Occitanie, France
                <br />
                Email :{" "}
                <a
                  href="mailto:contact@aissabelkoussa.fr"
                  className="text-site-accent hover:underline"
                >
                  contact@aissabelkoussa.fr
                </a>
              </p>
              <p>TVA non applicable — article 293 B du CGI.</p>
            </>
          ),
        },
        {
          title: "Directeur de la publication",
          content: (
            <p>
              Le directeur de la publication est <strong>Aïssa Belkoussa</strong>
              , en sa qualite d'editeur du site.
            </p>
          ),
        },
        {
          title: "Hebergement",
          content: (
            <>
              <p>Le site est heberge par :</p>
              <p>
                <strong>Vercel Inc.</strong>
                <br />
                440 N Barranca Ave #4133
                <br />
                Covina, CA 91723, Etats-Unis
                <br />
                Site :{" "}
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-site-accent hover:underline"
                >
                  vercel.com
                </a>
              </p>
            </>
          ),
        },
        {
          title: "Nom de domaine",
          content: (
            <>
              <p>
                Le nom de domaine <strong>aissabelkoussa.fr</strong> est
                enregistre aupres de :
              </p>
              <p>
                <strong>OVHcloud</strong>
                <br />
                2 rue Kellermann, 59100 Roubaix, France
                <br />
                RCS Lille Metropole 424 761 419
                <br />
                Site :{" "}
                <a
                  href="https://www.ovhcloud.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-site-accent hover:underline"
                >
                  ovhcloud.com
                </a>
              </p>
            </>
          ),
        },
        {
          title: "Propriete intellectuelle",
          content: (
            <>
              <p>
                L'ensemble du contenu du site (textes, images, code source,
                maquettes, logos, animations, videos, architecture) est protege
                par le droit de la propriete intellectuelle et demeure la
                propriete exclusive d'Aïssa Belkoussa, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, representation, modification, publication,
                adaptation de tout ou partie des elements du site, quel que soit
                le moyen ou le procede utilise, est interdite sans
                l'autorisation ecrite prealable d'Aïssa Belkoussa.
              </p>
              <p>
                Toute exploitation non autorisee du site ou de l'un quelconque
                des elements qu'il contient sera consideree comme constitutive
                d'une contrefacon et poursuivie conformement aux articles
                L.335-2 et suivants du Code de la Propriete Intellectuelle.
              </p>
            </>
          ),
        },
        {
          title: "Donnees personnelles",
          content: (
            <p>
              Les donnees personnelles collectees via le formulaire de contact
              sont traitees conformement au Reglement General sur la Protection
              des Donnees (RGPD). Pour en savoir plus, consultez la{" "}
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
          title: "Cookies",
          content: (
            <>
              <p>
                Le site n'utilise aucun cookie de tracking, de publicite ni
                d'analyse. Aucun outil de mesure d'audience tiers n'est integre.
              </p>
              <p>
                Seul un stockage local (localStorage) est utilise pour
                memoriser la preference de langue de l'utilisateur (francais ou
                anglais). Ce stockage est strictement necessaire au
                fonctionnement du site et ne constitue pas un cookie au sens de
                la directive ePrivacy.
              </p>
            </>
          ),
        },
        {
          title: "Responsabilite",
          content: (
            <>
              <p>
                L'editeur s'efforce de fournir des informations aussi precises
                que possible sur le site. Toutefois, il ne pourra etre tenu
                responsable des omissions, des inexactitudes et des carences
                dans la mise a jour, qu'elles soient de son fait ou du fait des
                tiers partenaires qui lui fournissent ces informations.
              </p>
              <p>
                L'editeur ne pourra etre tenu responsable des dommages directs
                et indirects causes au materiel de l'utilisateur lors de l'acces
                au site, resultant soit de l'utilisation d'un materiel ne
                repondant pas aux specifications techniques requises, soit de
                l'apparition d'un bug ou d'une incompatibilite.
              </p>
            </>
          ),
        },
        {
          title: "Liens hypertextes",
          content: (
            <p>
              Le site peut contenir des liens hypertextes vers d'autres sites.
              L'editeur n'exerce aucun controle sur le contenu de ces sites
              tiers et decline toute responsabilite quant a leur contenu ou aux
              eventuels dommages pouvant resulter de leur utilisation.
            </p>
          ),
        },
        {
          title: "Droit applicable",
          content: (
            <p>
              Les presentes mentions legales sont regies par le droit francais.
              En cas de litige, les tribunaux francais seront seuls competents.
            </p>
          ),
        },
      ]}
    />
  );
}
