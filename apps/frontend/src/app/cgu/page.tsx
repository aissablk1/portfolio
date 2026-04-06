"use client";

import LegalPage from "@/components/LegalPage";

export default function CGUPage() {
  return (
    <LegalPage
      badge="CGU"
      title="Conditions générales d'utilisation"
      lastUpdated="3 avril 2026"
      sections={[
        {
          title: "Objet",
          content: (
            <p>
              Les présentes conditions générales d&apos;utilisation (CGU) ont
              pour objet de définir les modalités d&apos;accès et
              d&apos;utilisation du site internet{" "}
              <strong>aissabelkoussa.fr</strong> (ci-après « le Site »), édité
              par Aïssa BELKOUSSA. L&apos;accès et l&apos;utilisation du Site
              impliquent l&apos;acceptation pleine et entière des présentes CGU.
            </p>
          ),
        },
        {
          title: "Accès au site",
          content: (
            <>
              <p>
                Le Site est accessible gratuitement à tout utilisateur disposant
                d&apos;un accès à Internet. L&apos;éditeur met en œuvre les
                moyens raisonnables pour assurer un accès continu au Site, mais
                ne saurait garantir une disponibilité permanente.
              </p>
              <p>
                L&apos;accès au Site peut être interrompu à tout moment, sans
                préavis ni indemnité, notamment pour des raisons de maintenance,
                de mise à jour, de sécurité ou en cas de force majeure.
              </p>
            </>
          ),
        },
        {
          title: "Cookies, traceurs et services tiers",
          content: (
            <>
              <p>
                En accédant au Site et en poursuivant votre navigation, vous
                acceptez les conditions suivantes relatives aux cookies et
                services tiers :
              </p>

              <p className="mt-3 font-medium">Services intégrés au Site :</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Vercel Analytics &amp; Web Vitals</strong> — mesure
                  d&apos;audience anonymisée et métriques de performance. Ces
                  traceurs sont activés par défaut car ils ne collectent aucune
                  donnée personnelle identifiable et répondent à un intérêt
                  légitime d&apos;amélioration du site (art. 6.1.f RGPD).
                </li>
                <li>
                  <strong>Système de tracking interne</strong> — enregistrement
                  anonymisé des pages visitées pour analyse statistique. Ce
                  système respecte le signal Do Not Track du navigateur.
                </li>
                <li>
                  <strong>Google Fonts</strong> — chargement des polices de
                  caractères (Inter, Outfit) depuis les serveurs de Google.
                  L&apos;adresse IP du visiteur peut être collectée par Google
                  lors du chargement.
                </li>
                <li>
                  <strong>Stockage local</strong> (localStorage) — enregistrement
                  de la préférence de langue. Strictement nécessaire au
                  fonctionnement (art. 5.3 directive ePrivacy).
                </li>
              </ul>

              <p className="mt-3 font-medium">
                Services tiers accessibles via des liens externes :
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  <strong>Calendly</strong> — en cliquant sur le lien de prise
                  de rendez-vous, vous êtes redirigé vers calendly.com. Vous
                  acceptez alors les conditions d&apos;utilisation et la
                  politique de confidentialité de Calendly, qui dépose ses
                  propres cookies (session, fonctionnement, préférences).
                </li>
                <li>
                  <strong>WhatsApp</strong> — en cliquant sur le lien de contact
                  WhatsApp, vous êtes redirigé vers wa.me / web.whatsapp.com.
                  Vous acceptez alors la politique de confidentialité de Meta
                  Platforms.
                </li>
                <li>
                  <strong>LinkedIn, GitHub, Telegram</strong> — les liens vers
                  ces plateformes sont fournis à titre informatif. Chaque
                  plateforme applique ses propres conditions d&apos;utilisation
                  et politique de cookies.
                </li>
              </ul>

              <div className="mt-4 p-4 bg-site-accent/5 border border-site-accent/10 rounded-xl">
                <p className="text-sm font-medium mb-2">
                  Acceptation automatique
                </p>
                <p className="text-sm">
                  Les cookies et traceurs décrits ci-dessus sont activés par
                  défaut conformément aux exemptions prévues par la directive
                  ePrivacy (cookies strictement nécessaires) et sur la base de
                  l&apos;intérêt légitime (cookies d&apos;analyse anonymisée
                  sans données personnelles). En poursuivant votre navigation,
                  vous reconnaissez avoir pris connaissance de ces technologies
                  et acceptez leur utilisation. Pour les services tiers
                  (Calendly, WhatsApp, etc.), l&apos;acceptation de leurs
                  cookies est effective au moment où vous cliquez sur le lien de
                  redirection.
                </p>
              </div>

              <p className="mt-4">
                Le Site n&apos;utilise aucun cookie publicitaire, aucun pixel de
                suivi (Facebook Pixel, Google Ads, etc.), aucun outil de
                retargeting et aucun cookie de profilage.
              </p>
              <p className="mt-2">
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
          title: "Propriété intellectuelle",
          content: (
            <>
              <p>
                L&apos;ensemble des éléments composant le Site (textes, images,
                vidéos, code source, maquettes, logos, animations, architecture,
                design) sont protégés par le droit de la propriété
                intellectuelle et restent la propriété exclusive d&apos;Aïssa
                BELKOUSSA, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, représentation, modification, distribution
                ou exploitation de tout ou partie du contenu du Site, par
                quelque procédé que ce soit, sans l&apos;autorisation écrite
                préalable de l&apos;éditeur, est strictement interdite et
                constitue un délit de contrefaçon sanctionné par les articles
                L.335-2 et suivants du Code de la Propriété Intellectuelle.
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
                aux utilisateurs d&apos;adresser des demandes de renseignement
                ou de devis. En utilisant ce formulaire, l&apos;utilisateur
                s&apos;engage à :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Fournir des informations exactes, complètes et à jour
                </li>
                <li>
                  Ne pas utiliser le formulaire à des fins abusives,
                  frauduleuses ou illicites
                </li>
                <li>
                  Ne pas transmettre de contenu injurieux, diffamatoire,
                  discriminatoire ou contraire à l&apos;ordre public
                </li>
                <li>
                  Ne pas tenter de perturber le fonctionnement du Site (spam,
                  injection, scraping, etc.)
                </li>
              </ul>
              <p className="mt-3">
                L&apos;éditeur se réserve le droit de ne pas donner suite à
                toute demande qu&apos;il estimerait abusive ou contraire aux
                présentes CGU.
              </p>
            </>
          ),
        },
        {
          title: "Utilisation du service de prise de rendez-vous",
          content: (
            <>
              <p>
                Le Site propose un lien vers la plateforme Calendly permettant
                de prendre rendez-vous pour un appel de découverte gratuit de 30
                minutes. En utilisant ce service :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Vous êtes redirigé vers le site calendly.com, service tiers
                  non contrôlé par l&apos;éditeur
                </li>
                <li>
                  Les données saisies sur Calendly (nom, email, créneau choisi)
                  sont soumises aux conditions d&apos;utilisation et à la
                  politique de confidentialité de Calendly Inc.
                </li>
                <li>
                  L&apos;éditeur reçoit uniquement les informations de
                  réservation (nom, email, date/heure du créneau) pour organiser
                  le rendez-vous
                </li>
                <li>Le rendez-vous est gratuit et sans engagement</li>
              </ul>
            </>
          ),
        },
        {
          title: "Données personnelles",
          content: (
            <>
              <p>
                Les données personnelles collectées sur le Site sont traitées
                conformément au Règlement Général sur la Protection des Données
                (RGPD). Pour plus d&apos;informations, consultez la{" "}
                <a
                  href="/confidentialite"
                  className="text-site-accent hover:underline"
                >
                  politique de confidentialité
                </a>
                .
              </p>
              <p className="mt-3">
                Dans le cadre des prestations de services, le prestataire peut
                être amené à manipuler des données sensibles du client
                (coordonnées bancaires, identifiants, données métier). Le
                traitement de ces données est encadré par les{" "}
                <a
                  href="/cgv"
                  className="text-site-accent hover:underline"
                >
                  conditions générales de vente
                </a>
                , qui précisent les engagements de chaque partie et les
                limitations de responsabilité en matière de protection des
                données.
              </p>
            </>
          ),
        },
        {
          title: "Liens hypertextes",
          content: (
            <>
              <p>
                Le Site contient des liens vers des sites et services tiers,
                notamment :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>LinkedIn (profil professionnel)</li>
                <li>GitHub (projets open source)</li>
                <li>Telegram (communauté)</li>
                <li>Calendly (prise de rendez-vous)</li>
                <li>WhatsApp (messagerie)</li>
              </ul>
              <p className="mt-3">
                Ces liens sont fournis à titre informatif. L&apos;éditeur
                n&apos;exerce aucun contrôle sur ces sites et décline toute
                responsabilité quant à leur contenu, leur disponibilité, leurs
                conditions d&apos;utilisation, leurs politiques de cookies ou
                les dommages pouvant résulter de leur utilisation.
              </p>
            </>
          ),
        },
        {
          title: "Limitation de responsabilité",
          content: (
            <>
              <p>
                L&apos;éditeur s&apos;efforce de fournir des informations
                fiables et à jour sur le Site, mais ne garantit pas
                l&apos;exactitude, la complétude ou l&apos;exhaustivité des
                informations publiées.
              </p>
              <p>
                L&apos;éditeur ne pourra en aucun cas être tenu responsable :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Des dommages directs ou indirects résultant de
                  l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser
                  le Site
                </li>
                <li>
                  Des interruptions ou dysfonctionnements du Site, quelle
                  qu&apos;en soit la cause
                </li>
                <li>
                  De l&apos;utilisation faite par des tiers des informations
                  présentes sur le Site
                </li>
                <li>
                  Des virus ou éléments nuisibles qui pourraient infecter
                  l&apos;équipement informatique de l&apos;utilisateur
                </li>
                <li>
                  Du contenu, de la disponibilité ou du fonctionnement des
                  services tiers accessibles via les liens du Site (Calendly,
                  WhatsApp, LinkedIn, etc.)
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Modification des CGU",
          content: (
            <p>
              L&apos;éditeur se réserve le droit de modifier les présentes CGU
              à tout moment. Les modifications prennent effet dès leur
              publication sur cette page. L&apos;utilisateur est invité à
              consulter régulièrement cette page. La date de dernière mise à
              jour est indiquée en haut de ce document.
            </p>
          ),
        },
        {
          title: "Droit applicable et juridiction",
          content: (
            <p>
              Les présentes CGU sont régies par le droit français. En cas de
              litige relatif à l&apos;interprétation ou à l&apos;exécution des
              présentes, et à défaut de résolution amiable, les tribunaux
              français seront seuls compétents.
            </p>
          ),
        },
      ]}
    />
  );
}
