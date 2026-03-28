"use client";

import LegalPage from "@/components/LegalPage";

export default function ConfidentialitePage() {
  return (
    <LegalPage
      badge="Confidentialité"
      title="Politique de confidentialité"
      lastUpdated="28 mars 2026"
      sections={[
        {
          title: "Responsable du traitement",
          content: (
            <>
              <p>Le responsable du traitement des données personnelles est :</p>
              <p>
                <strong>Aïssa Belkoussa</strong>
                <br />
                Entrepreneur individuel (micro-entreprise)
                <br />
                SIRET : 937 690 592 00012
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
            </>
          ),
        },
        {
          title: "Données collectées",
          content: (
            <>
              <p>
                Dans le cadre de l'utilisation du site, les données suivantes
                peuvent être collectées via le formulaire de contact :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nom complet</li>
                <li>Adresse email</li>
                <li>Nom d'entreprise ou de projet (optionnel)</li>
                <li>Type de besoin sélectionné</li>
                <li>Message libre</li>
                <li>Fourchette de budget sélectionnée</li>
                <li>Langue de navigation (français ou anglais)</li>
              </ul>
              <p className="mt-3">
                Aucune donnée de navigation, aucun cookie de tracking et aucun
                outil d'analyse tiers ne sont utilisés sur le site.
              </p>
            </>
          ),
        },
        {
          title: "Finalités du traitement",
          content: (
            <>
              <p>
                Les données collectées sont utilisées exclusivement pour les
                finalités suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Répondre aux demandes de contact et de devis (base légale :
                  mesures précontractuelles, art. 6.1.b RGPD)
                </li>
                <li>
                  Envoyer un email de confirmation automatique au demandeur
                  (base légale : intérêt légitime, art. 6.1.f RGPD)
                </li>
              </ul>
              <p className="mt-3">
                Les données ne sont jamais utilisées à des fins de prospection
                commerciale, de profilage ou de revente à des tiers.
              </p>
            </>
          ),
        },
        {
          title: "Sous-traitants et destinataires",
          content: (
            <>
              <p>
                Les données sont transmises uniquement aux sous-traitants
                techniques suivants, dans le strict cadre de leur mission :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Resend</strong> (envoi d'emails transactionnels) —
                  serveurs en Union Européenne (Irlande). Les données transitent
                  par Resend pour l'envoi des emails de notification et de
                  confirmation, sans stockage durable.
                </li>
                <li>
                  <strong>Vercel Inc.</strong> (hébergement du site) — conforme
                  aux clauses contractuelles types UE-US (Data Privacy
                  Framework).
                </li>
              </ul>
              <p className="mt-3">
                Aucune donnée n'est vendue, louée ou cédée à un tiers à des
                fins commerciales.
              </p>
            </>
          ),
        },
        {
          title: "Durée de conservation",
          content: (
            <p>
              Les données collectées via le formulaire de contact sont
              conservées dans la boîte email du responsable du traitement pour
              la durée nécessaire au traitement de la demande, puis archivées
              pendant une durée maximale de 3 ans à compter du dernier contact,
              conformément aux recommandations de la CNIL. Passé ce délai, les
              données sont supprimées.
            </p>
          ),
        },
        {
          title: "Sécurité des données",
          content: (
            <>
              <p>
                Des mesures techniques et organisationnelles appropriées sont
                mises en œuvre pour protéger les données personnelles :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Chiffrement des communications via HTTPS (certificat SSL/TLS)
                </li>
                <li>
                  Clé API Resend stockée exclusivement côté serveur (jamais
                  exposée côté client)
                </li>
                <li>
                  Rate limiting sur le formulaire de contact (3 requêtes par
                  IP toutes les 15 minutes)
                </li>
                <li>Protection anti-spam par champ honeypot</li>
                <li>
                  Validation et échappement (escaping) de toutes les données
                  avant traitement
                </li>
                <li>
                  En-têtes de sécurité HTTP : X-Content-Type-Options,
                  X-Frame-Options, Referrer-Policy, Permissions-Policy,
                  Content-Security-Policy
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Vos droits",
          content: (
            <>
              <p>
                Conformément au RGPD (articles 15 à 22) et à la loi
                Informatique et Libertés, vous disposez des droits suivants
                concernant vos données personnelles :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Droit d'accès</strong> : obtenir la confirmation que
                  vos données sont traitées et en obtenir une copie
                </li>
                <li>
                  <strong>Droit de rectification</strong> : faire corriger des
                  données inexactes ou incomplètes
                </li>
                <li>
                  <strong>Droit à l'effacement</strong> : demander la
                  suppression de vos données
                </li>
                <li>
                  <strong>Droit à la limitation</strong> : demander la
                  suspension du traitement
                </li>
                <li>
                  <strong>Droit à la portabilité</strong> : recevoir vos
                  données dans un format structuré et lisible
                </li>
                <li>
                  <strong>Droit d'opposition</strong> : vous opposer au
                  traitement de vos données
                </li>
              </ul>
              <p className="mt-3">
                Pour exercer ces droits, contactez :{" "}
                <a
                  href="mailto:contact@aissabelkoussa.fr"
                  className="text-site-accent hover:underline"
                >
                  contact@aissabelkoussa.fr
                </a>
                . Une réponse vous sera apportée dans un délai d'un mois
                conformément à l'article 12 du RGPD.
              </p>
            </>
          ),
        },
        {
          title: "Réclamation",
          content: (
            <p>
              Si vous estimez que le traitement de vos données personnelles
              constitue une violation du RGPD, vous avez le droit d'introduire
              une réclamation auprès de la CNIL (Commission Nationale de
              l'Informatique et des Libertés) :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-site-accent hover:underline"
              >
                www.cnil.fr
              </a>
              .
            </p>
          ),
        },
        {
          title: "Stockage local",
          content: (
            <p>
              Le site utilise le localStorage du navigateur uniquement pour
              enregistrer la préférence de langue de l'utilisateur (français ou
              anglais). Ce stockage est strictement nécessaire au
              fonctionnement du site (exemption au consentement selon la
              directive ePrivacy, art. 5.3). Aucun cookie n'est déposé.
            </p>
          ),
        },
        {
          title: "Modifications",
          content: (
            <p>
              La présente politique de confidentialité peut être modifiée à tout
              moment. Les modifications prennent effet dès leur publication sur
              cette page. La date de dernière mise à jour est indiquée en haut
              de ce document.
            </p>
          ),
        },
      ]}
    />
  );
}
