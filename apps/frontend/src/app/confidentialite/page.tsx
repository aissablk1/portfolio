"use client";

import LegalPage from "@/components/LegalPage";

export default function ConfidentialitePage() {
  return (
    <LegalPage
      badge="Confidentialite"
      title="Politique de confidentialite"
      lastUpdated="28 mars 2026"
      sections={[
        {
          title: "Responsable du traitement",
          content: (
            <>
              <p>Le responsable du traitement des donnees personnelles est :</p>
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
          title: "Donnees collectees",
          content: (
            <>
              <p>
                Dans le cadre de l'utilisation du site, les donnees suivantes
                peuvent etre collectees via le formulaire de contact :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Nom complet</li>
                <li>Adresse email</li>
                <li>Nom d'entreprise ou de projet (optionnel)</li>
                <li>Type de besoin selectionne</li>
                <li>Message libre</li>
                <li>Fourchette de budget selectionnee</li>
                <li>Langue de navigation (francais ou anglais)</li>
              </ul>
              <p className="mt-3">
                Aucune donnee de navigation, aucun cookie de tracking et aucun
                outil d'analyse tiers ne sont utilises sur le site.
              </p>
            </>
          ),
        },
        {
          title: "Finalites du traitement",
          content: (
            <>
              <p>
                Les donnees collectees sont utilisees exclusivement pour les
                finalites suivantes :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Repondre aux demandes de contact et de devis (base legale :
                  mesures precontractuelles, art. 6.1.b RGPD)
                </li>
                <li>
                  Envoyer un email de confirmation automatique au demandeur
                  (base legale : interet legitime, art. 6.1.f RGPD)
                </li>
              </ul>
              <p className="mt-3">
                Les donnees ne sont jamais utilisees a des fins de prospection
                commerciale, de profilage ou de revente a des tiers.
              </p>
            </>
          ),
        },
        {
          title: "Sous-traitants et destinataires",
          content: (
            <>
              <p>
                Les donnees sont transmises uniquement aux sous-traitants
                techniques suivants, dans le strict cadre de leur mission :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Resend</strong> (envoi d'emails transactionnels) —
                  serveurs en Union Europeenne (Irlande). Les donnees transitent
                  par Resend pour l'envoi des emails de notification et de
                  confirmation, sans stockage durable.
                </li>
                <li>
                  <strong>Vercel Inc.</strong> (hebergement du site) — conforme
                  aux clauses contractuelles types UE-US (Data Privacy
                  Framework).
                </li>
              </ul>
              <p className="mt-3">
                Aucune donnee n'est vendue, louee ou cedee a un tiers a des
                fins commerciales.
              </p>
            </>
          ),
        },
        {
          title: "Duree de conservation",
          content: (
            <p>
              Les donnees collectees via le formulaire de contact sont
              conservees dans la boite email du responsable du traitement pour
              la duree necessaire au traitement de la demande, puis archivees
              pendant une duree maximale de 3 ans a compter du dernier contact,
              conformement aux recommandations de la CNIL. Passe ce delai, les
              donnees sont supprimees.
            </p>
          ),
        },
        {
          title: "Securite des donnees",
          content: (
            <>
              <p>
                Des mesures techniques et organisationnelles appropriees sont
                mises en oeuvre pour proteger les donnees personnelles :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Chiffrement des communications via HTTPS (certificat SSL/TLS)
                </li>
                <li>
                  Cle API Resend stockee exclusivement cote serveur (jamais
                  exposee cote client)
                </li>
                <li>
                  Rate limiting sur le formulaire de contact (3 requetes par
                  IP toutes les 15 minutes)
                </li>
                <li>Protection anti-spam par champ honeypot</li>
                <li>
                  Validation et echappement (escaping) de toutes les donnees
                  avant traitement
                </li>
                <li>
                  En-tetes de securite HTTP : X-Content-Type-Options,
                  X-Frame-Options, Referrer-Policy, Permissions-Policy
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
                Conformement au RGPD (articles 15 a 22) et a la loi
                Informatique et Libertes, vous disposez des droits suivants
                concernant vos donnees personnelles :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Droit d'acces</strong> : obtenir la confirmation que
                  vos donnees sont traitees et en obtenir une copie
                </li>
                <li>
                  <strong>Droit de rectification</strong> : faire corriger des
                  donnees inexactes ou incompletes
                </li>
                <li>
                  <strong>Droit a l'effacement</strong> : demander la
                  suppression de vos donnees
                </li>
                <li>
                  <strong>Droit a la limitation</strong> : demander la
                  suspension du traitement
                </li>
                <li>
                  <strong>Droit a la portabilite</strong> : recevoir vos
                  donnees dans un format structure et lisible
                </li>
                <li>
                  <strong>Droit d'opposition</strong> : vous opposer au
                  traitement de vos donnees
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
                . Une reponse vous sera apportee dans un delai d'un mois
                conformement a l'article 12 du RGPD.
              </p>
            </>
          ),
        },
        {
          title: "Reclamation",
          content: (
            <p>
              Si vous estimez que le traitement de vos donnees personnelles
              constitue une violation du RGPD, vous avez le droit d'introduire
              une reclamation aupres de la CNIL (Commission Nationale de
              l'Informatique et des Libertes) :{" "}
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
              enregistrer la preference de langue de l'utilisateur (francais ou
              anglais). Ce stockage est strictement necessaire au
              fonctionnement du site (exemption au consentement selon la
              directive ePrivacy, art. 5.3). Aucun cookie n'est depose.
            </p>
          ),
        },
        {
          title: "Modifications",
          content: (
            <p>
              La presente politique de confidentialite peut etre modifiee a tout
              moment. Les modifications prennent effet des leur publication sur
              cette page. La date de derniere mise a jour est indiquee en haut
              de ce document.
            </p>
          ),
        },
      ]}
    />
  );
}
