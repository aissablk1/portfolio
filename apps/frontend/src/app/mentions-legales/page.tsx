"use client";

import LegalPage from "@/components/LegalPage";

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      badge="Mentions légales"
      title="Mentions légales"
      lastUpdated="3 avril 2026"
      sections={[
        {
          title: "Éditeur du site",
          content: (
            <>
              <p>
                Le site <strong>aissabelkoussa.fr</strong> est édité par :
              </p>
              <p>
                <strong>Aïssa BELKOUSSA</strong>
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
              Le directeur de la publication est <strong>Aïssa BELKOUSSA</strong>
              , en sa qualité d'éditeur du site.
            </p>
          ),
        },
        {
          title: "Hébergement",
          content: (
            <>
              <p>Le site est hébergé par :</p>
              <p>
                <strong>Vercel Inc.</strong>
                <br />
                440 N Barranca Ave #4133
                <br />
                Covina, CA 91723, États-Unis
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
                enregistré auprès de :
              </p>
              <p>
                <strong>OVHcloud</strong>
                <br />
                2 rue Kellermann, 59100 Roubaix, France
                <br />
                RCS Lille Métropole 424 761 419
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
          title: "Propriété intellectuelle",
          content: (
            <>
              <p>
                L'ensemble du contenu du site (textes, images, code source,
                maquettes, logos, animations, vidéos, architecture) est protégé
                par le droit de la propriété intellectuelle et demeure la
                propriété exclusive d'Aïssa BELKOUSSA, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication,
                adaptation de tout ou partie des éléments du site, quel que soit
                le moyen ou le procédé utilisé, est interdite sans
                l'autorisation écrite préalable d'Aïssa BELKOUSSA.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque
                des éléments qu'il contient sera considérée comme constitutive
                d'une contrefaçon et poursuivie conformément aux articles
                L.335-2 et suivants du Code de la Propriété Intellectuelle.
              </p>
            </>
          ),
        },
        {
          title: "Données personnelles",
          content: (
            <p>
              Les données personnelles collectées via le formulaire de contact
              sont traitées conformément au Règlement Général sur la Protection
              des Données (RGPD). Pour en savoir plus, consultez la{" "}
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
          title: "Cookies et traceurs",
          content: (
            <>
              <p>
                Le site utilise des cookies et traceurs strictement nécessaires
                à son fonctionnement ainsi que des traceurs d&apos;analyse
                anonymisée (Vercel Analytics, beacon interne). Aucun cookie
                publicitaire, de retargeting ou de profilage n&apos;est utilisé.
              </p>
              <p>
                Un stockage local (localStorage) est utilisé pour mémoriser la
                préférence de langue de l&apos;utilisateur (français ou anglais),
                strictement nécessaire au fonctionnement du site (art. 5.3
                directive ePrivacy).
              </p>
              <p>
                Les polices de caractères sont chargées depuis Google Fonts.
                Les liens vers des services tiers (Calendly, WhatsApp, LinkedIn,
                GitHub, Telegram) sont soumis aux politiques de cookies de leurs
                éditeurs respectifs.
              </p>
              <p>
                Pour plus de détails, consultez la{" "}
                <a
                  href="/confidentialite"
                  className="text-site-accent hover:underline"
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "Responsabilité",
          content: (
            <>
              <p>
                L'éditeur s'efforce de fournir des informations aussi précises
                que possible sur le site. Toutefois, il ne pourra être tenu
                responsable des omissions, des inexactitudes et des carences
                dans la mise à jour, qu'elles soient de son fait ou du fait des
                tiers partenaires qui lui fournissent ces informations.
              </p>
              <p>
                L'éditeur ne pourra être tenu responsable des dommages directs
                et indirects causés au matériel de l'utilisateur lors de l'accès
                au site, résultant soit de l'utilisation d'un matériel ne
                répondant pas aux spécifications techniques requises, soit de
                l'apparition d'un bug ou d'une incompatibilité.
              </p>
            </>
          ),
        },
        {
          title: "Liens hypertextes",
          content: (
            <p>
              Le site peut contenir des liens hypertextes vers d'autres sites.
              L'éditeur n'exerce aucun contrôle sur le contenu de ces sites
              tiers et décline toute responsabilité quant à leur contenu ou aux
              éventuels dommages pouvant résulter de leur utilisation.
            </p>
          ),
        },
        {
          title: "Droit applicable",
          content: (
            <p>
              Les présentes mentions légales sont régies par le droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          ),
        },
      ]}
    />
  );
}
