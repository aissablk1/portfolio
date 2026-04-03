"use client";

import LegalPage from "@/components/LegalPage";

export default function ConfidentialitePage() {
  return (
    <LegalPage
      badge="Confidentialité"
      title="Politique de confidentialité"
      lastUpdated="3 avril 2026"
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
                Dans le cadre de l&apos;utilisation du site, les données
                suivantes peuvent être collectées :
              </p>
              <p className="mt-3 font-medium">
                Via le formulaire de contact :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nom complet</li>
                <li>Adresse email</li>
                <li>Type de besoin sélectionné</li>
                <li>Message libre (optionnel)</li>
                <li>Plan sélectionné le cas échéant</li>
                <li>Langue de navigation (français ou anglais)</li>
              </ul>
              <p className="mt-3 font-medium">
                Via la navigation sur le site (données anonymisées) :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Pages visitées et parcours de navigation</li>
                <li>Referrer (page d&apos;origine)</li>
                <li>Largeur d&apos;écran (résolution)</li>
                <li>Langue du navigateur</li>
                <li>
                  Métriques de performance web (Core Web Vitals) via Vercel
                  Analytics
                </li>
              </ul>
              <p className="mt-3">
                Ces données de navigation sont collectées de manière anonymisée,
                sans identification personnelle, et servent exclusivement à
                améliorer l&apos;expérience utilisateur et les performances du
                site.
              </p>
            </>
          ),
        },
        {
          title: "Finalités du traitement",
          content: (
            <>
              <p>
                Les données collectées sont utilisées pour les finalités
                suivantes :
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
                <li>
                  Mesurer l&apos;audience et les performances du site de manière
                  anonymisée (base légale : intérêt légitime, art. 6.1.f RGPD)
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
          title: "Cookies et traceurs",
          content: (
            <>
              <p>
                Le site utilise un nombre limité de cookies et technologies de
                stockage local, strictement nécessaires à son fonctionnement et
                à l&apos;amélioration de l&apos;expérience utilisateur.
              </p>

              <p className="mt-4 font-medium">
                Cookies strictement nécessaires (exemptés de consentement — art.
                5.3 directive ePrivacy) :
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Préférence de langue</strong> (localStorage) — stocke
                  le choix de langue (français/anglais) pour assurer la
                  continuité de navigation. Aucune donnée personnelle n&apos;est
                  concernée.
                </li>
              </ul>

              <p className="mt-4 font-medium">
                Cookies d&apos;analyse anonymisée (intérêt légitime — art. 6.1.f
                RGPD) :
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Vercel Analytics</strong> — mesure d&apos;audience
                  anonymisée et métriques de performance (Core Web Vitals).
                  Vercel Analytics ne collecte aucune donnée personnelle
                  identifiable (pas d&apos;adresse IP stockée, pas de
                  fingerprinting, pas de cookie de suivi inter-sites). Ces
                  données servent exclusivement à optimiser les performances du
                  site. Fournisseur : Vercel Inc., conforme au EU-US Data
                  Privacy Framework.
                </li>
                <li>
                  <strong>Beacon de navigation</strong> — système de mesure
                  interne enregistrant les pages visitées, le referrer, la
                  largeur d&apos;écran et la langue du navigateur. Aucune donnée
                  personnelle identifiable n&apos;est collectée. Ce beacon
                  respecte le signal Do Not Track du navigateur : si activé,
                  aucune donnée n&apos;est envoyée.
                </li>
              </ul>

              <p className="mt-4 font-medium">
                Cookies déposés par les services tiers lors de l&apos;utilisation
                de liens externes :
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Calendly</strong> — lorsque vous cliquez sur le lien
                  de prise de rendez-vous, vous êtes redirigé vers calendly.com
                  qui dépose ses propres cookies (fonctionnement, session,
                  préférences). La politique de cookies de Calendly s&apos;applique
                  sur leur domaine :{" "}
                  <a
                    href="https://calendly.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-site-accent hover:underline"
                  >
                    calendly.com/privacy
                  </a>
                  .
                </li>
                <li>
                  <strong>WhatsApp</strong> — le lien de contact WhatsApp
                  redirige vers wa.me / web.whatsapp.com, soumis à la politique
                  de confidentialité de Meta :{" "}
                  <a
                    href="https://www.whatsapp.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-site-accent hover:underline"
                  >
                    whatsapp.com/legal/privacy-policy
                  </a>
                  .
                </li>
              </ul>

              <p className="mt-4 font-medium">Polices de caractères :</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Google Fonts</strong> — les polices Inter et Outfit
                  sont chargées depuis les serveurs de Google
                  (fonts.googleapis.com / fonts.gstatic.com). Google peut
                  collecter l&apos;adresse IP du visiteur lors du chargement des
                  polices. Aucune autre donnée n&apos;est transmise. Politique
                  de confidentialité :{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-site-accent hover:underline"
                  >
                    policies.google.com/privacy
                  </a>
                  .
                </li>
              </ul>

              <div className="mt-6 p-4 bg-site-accent/5 border border-site-accent/10 rounded-xl">
                <p className="text-sm font-medium mb-2">
                  Acceptation automatique
                </p>
                <p className="text-sm">
                  Conformément à l&apos;article 5.3 de la directive ePrivacy et
                  aux lignes directrices de la CNIL, les cookies strictement
                  nécessaires et les traceurs anonymisés ne nécessitant aucune
                  identification personnelle sont activés par défaut, sans
                  bandeau de consentement. En poursuivant votre navigation sur
                  ce site, vous acceptez l&apos;utilisation de ces technologies
                  telles que décrites ci-dessus. De même, en cliquant sur les
                  liens vers des services tiers (Calendly, WhatsApp, LinkedIn,
                  GitHub, Telegram), vous acceptez les politiques de cookies et
                  de confidentialité respectives de ces services.
                </p>
              </div>

              <p className="mt-4">
                Le site n&apos;utilise aucun cookie publicitaire, aucun outil de
                retargeting, aucun pixel de suivi (Facebook Pixel, Google Ads,
                etc.) et aucun cookie de profilage.
              </p>
            </>
          ),
        },
        {
          title: "Données clients traitées dans le cadre des prestations",
          content: (
            <>
              <p>
                En dehors des données collectées via le site internet (décrites
                ci-dessus), le prestataire peut être amené à accéder et traiter
                des données sensibles appartenant au client dans le cadre de
                l&apos;exécution des prestations (création de site,
                automatisation, intégration, maintenance). Ces données peuvent
                inclure :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Coordonnées bancaires et informations financières (IBAN, RIB,
                  numéros de compte)
                </li>
                <li>
                  Identifiants et accès techniques (mots de passe, clés API,
                  accès serveurs)
                </li>
                <li>
                  Données clients du client (fichiers clients, contacts,
                  historiques)
                </li>
                <li>
                  Données métier confidentielles (chiffre d&apos;affaires,
                  tarification, stratégie)
                </li>
              </ul>
              <p className="mt-3">
                Le traitement de ces données est encadré par le contrat de
                prestation et les conditions générales de vente. Le prestataire
                s&apos;engage à :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  N&apos;accéder aux données que dans la mesure strictement
                  nécessaire à la mission
                </li>
                <li>
                  Appliquer les mesures de sécurité appropriées (chiffrement,
                  accès restreints, authentification forte)
                </li>
                <li>
                  Ne jamais divulguer de données confidentielles à des tiers
                </li>
                <li>
                  Supprimer ou restituer toutes les données et accès à
                  l&apos;issue de la mission
                </li>
              </ul>
              <p className="mt-3">
                <strong>Le prestataire est tenu à une obligation de moyens en
                matière de protection des données et ne saurait être tenu
                responsable des fuites, pertes ou accès non autorisés résultant
                de défaillances des systèmes du client, de services tiers, ou
                d&apos;attaques informatiques hors de son contrôle direct.</strong>
              </p>
              <p className="mt-2">
                Pour le détail complet des responsabilités et obligations de
                chaque partie, consultez les{" "}
                <a
                  href="/cgv"
                  className="text-site-accent hover:underline"
                >
                  conditions générales de vente
                </a>
                , article « Confidentialité et données sensibles du client ».
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
              <ul className="list-disc pl-5 space-y-3 mt-2">
                <li>
                  <strong>Vercel Inc.</strong> (hébergement du site et analytics)
                  — conforme au EU-US Data Privacy Framework (clauses
                  contractuelles types). Siège : Covina, CA 91723, États-Unis.
                </li>
                <li>
                  <strong>Resend</strong> (envoi d&apos;emails transactionnels)
                  — serveurs en Union Européenne (Irlande). Les données
                  transitent par Resend pour l&apos;envoi des emails de
                  notification et de confirmation, sans stockage durable.
                </li>
                <li>
                  <strong>Render</strong> (hébergement de l&apos;API backend) —
                  hébergeur du système de tracking interne et de l&apos;API de
                  contact. Les données anonymisées de navigation sont stockées
                  dans une base MongoDB hébergée.
                </li>
                <li>
                  <strong>Google LLC</strong> (polices de caractères) — les
                  polices Inter et Outfit sont servies via Google Fonts. Seule
                  l&apos;adresse IP du visiteur peut être collectée lors du
                  chargement.
                </li>
                <li>
                  <strong>OVHcloud</strong> (registrar du nom de domaine) — 2
                  rue Kellermann, 59100 Roubaix, France.
                </li>
              </ul>
              <p className="mt-3">
                Aucune donnée n&apos;est vendue, louée ou cédée à un tiers à des
                fins commerciales.
              </p>
            </>
          ),
        },
        {
          title: "Transferts hors Union Européenne",
          content: (
            <>
              <p>
                Certains sous-traitants sont situés aux États-Unis. Les
                transferts de données vers ces prestataires sont encadrés par :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Le <strong>EU-US Data Privacy Framework</strong> (décision
                  d&apos;adéquation de la Commission européenne du 10 juillet
                  2023) pour Vercel Inc. et Google LLC
                </li>
                <li>
                  Les <strong>clauses contractuelles types</strong> (CCT)
                  adoptées par la Commission européenne, le cas échéant
                </li>
              </ul>
              <p className="mt-3">
                Ces mécanismes garantissent un niveau de protection des données
                équivalent à celui du RGPD.
              </p>
            </>
          ),
        },
        {
          title: "Durée de conservation",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Données du formulaire de contact</strong> : conservées
                dans la boîte email du responsable du traitement pour la durée
                nécessaire au traitement de la demande, puis archivées pendant
                une durée maximale de 3 ans à compter du dernier contact,
                conformément aux recommandations de la CNIL.
              </li>
              <li>
                <strong>Données de navigation anonymisées</strong> : conservées
                pendant une durée maximale de 25 mois conformément aux
                recommandations de la CNIL.
              </li>
              <li>
                <strong>Préférence de langue</strong> (localStorage) : conservée
                indéfiniment dans le navigateur de l&apos;utilisateur.
                L&apos;utilisateur peut la supprimer à tout moment via les
                paramètres de son navigateur.
              </li>
            </ul>
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
                  Rate limiting sur le formulaire de contact (3 requêtes par IP
                  toutes les 15 minutes)
                </li>
                <li>Protection anti-spam par champ honeypot</li>
                <li>
                  Validation et échappement (escaping) de toutes les données
                  avant traitement
                </li>
                <li>
                  En-têtes de sécurité HTTP : Strict-Transport-Security,
                  X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
                  Permissions-Policy, Content-Security-Policy
                </li>
                <li>
                  Respect du signal Do Not Track pour le système de tracking
                  interne
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
                  <strong>Droit d&apos;accès</strong> : obtenir la confirmation
                  que vos données sont traitées et en obtenir une copie
                </li>
                <li>
                  <strong>Droit de rectification</strong> : faire corriger des
                  données inexactes ou incomplètes
                </li>
                <li>
                  <strong>Droit à l&apos;effacement</strong> : demander la
                  suppression de vos données
                </li>
                <li>
                  <strong>Droit à la limitation</strong> : demander la suspension
                  du traitement
                </li>
                <li>
                  <strong>Droit à la portabilité</strong> : recevoir vos données
                  dans un format structuré et lisible
                </li>
                <li>
                  <strong>Droit d&apos;opposition</strong> : vous opposer au
                  traitement de vos données, y compris au tracking analytique
                  (vous pouvez activer le signal Do Not Track dans votre
                  navigateur)
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
                . Une réponse vous sera apportée dans un délai d&apos;un mois
                conformément à l&apos;article 12 du RGPD.
              </p>
            </>
          ),
        },
        {
          title: "Réclamation",
          content: (
            <p>
              Si vous estimez que le traitement de vos données personnelles
              constitue une violation du RGPD, vous avez le droit
              d&apos;introduire une réclamation auprès de la CNIL (Commission
              Nationale de l&apos;Informatique et des Libertés) :{" "}
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
          title: "Modifications",
          content: (
            <p>
              La présente politique de confidentialité peut être modifiée à tout
              moment. Les modifications prennent effet dès leur publication sur
              cette page. La date de dernière mise à jour est indiquée en haut
              de ce document. En cas de modification substantielle, une mention
              visible sera affichée sur le site.
            </p>
          ),
        },
      ]}
    />
  );
}
