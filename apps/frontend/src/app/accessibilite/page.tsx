"use client";

import LegalPage from "@/components/LegalPage";

export default function AccessibilitePage() {
  return (
    <LegalPage
      badge="Accessibilité"
      title="Déclaration d'accessibilité"
      lastUpdated="10 avril 2026"
      sections={[
        {
          title: "Engagement",
          content: (
            <>
              <p>
                <strong>Aïssa BELKOUSSA</strong> s'engage à rendre le site{" "}
                <strong>aissabelkoussa.fr</strong> accessible conformément à
                l'article 47 de la loi n°2005-102 du 11 février 2005.
              </p>
              <p>
                La présente déclaration d'accessibilité s'applique au site{" "}
                <strong>www.aissabelkoussa.fr</strong>.
              </p>
            </>
          ),
        },
        {
          title: "Norme visée et état de conformité",
          content: (
            <>
              <p>
                <strong>Norme visée :</strong> WCAG 2.1 niveau AA (Web Content
                Accessibility Guidelines).
              </p>
              <p>
                <strong>État de conformité :</strong> partiellement conforme. Le
                site n'a pas encore fait l'objet d'un audit complet de
                conformité. Les mesures décrites ci-dessous sont mises en place
                de bonne foi pour améliorer l'accessibilité.
              </p>
            </>
          ),
        },
        {
          title: "Contenus non accessibles",
          content: (
            <>
              <p>
                Les contenus suivants ne sont pas encore pleinement
                accessibles :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Animations Framer Motion :</strong> certaines
                  animations de transition et d'entrée peuvent poser des
                  difficultés aux utilisateurs sensibles aux mouvements, malgré
                  le respect de <code>prefers-reduced-motion</code> dans les
                  animations GSAP.
                </li>
                <li>
                  <strong>Preloader :</strong> l'écran de chargement initial ne
                  dispose pas d'alternative textuelle pour les lecteurs d'écran.
                  Les utilisateurs de technologies d'assistance peuvent ne pas
                  être informés de l'état de chargement.
                </li>
                <li>
                  <strong>Contrastes de couleur :</strong> certains textes
                  utilisant la classe <code>text-site-text-light</code> peuvent
                  ne pas atteindre le ratio de contraste minimum de 4.5:1 exigé
                  par le niveau AA, notamment sur les fonds clairs.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Mesures prises",
          content: (
            <>
              <p>
                Les mesures suivantes sont mises en place pour améliorer
                l'accessibilité du site :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Lien d'évitement :</strong> un lien « Skip to
                  content » permet d'accéder directement au contenu principal
                  sans parcourir la navigation.
                </li>
                <li>
                  <strong>HTML sémantique :</strong> utilisation systématique
                  des balises <code>&lt;header&gt;</code>,{" "}
                  <code>&lt;main&gt;</code>, <code>&lt;footer&gt;</code>,{" "}
                  <code>&lt;nav&gt;</code> et des niveaux de titre hiérarchisés.
                </li>
                <li>
                  <strong>Texte alternatif :</strong> les images disposent d'un
                  attribut <code>alt</code> descriptif. Les éléments
                  décoratifs sont marqués <code>aria-hidden="true"</code>.
                </li>
                <li>
                  <strong>Focus visible :</strong> les éléments interactifs
                  (liens, boutons, champs de formulaire) disposent d'un
                  indicateur de focus visible.
                </li>
                <li>
                  <strong>Réduction de mouvement :</strong> les animations GSAP
                  respectent la préférence utilisateur{" "}
                  <code>prefers-reduced-motion</code> et sont désactivées ou
                  simplifiées lorsque cette option est activée.
                </li>
                <li>
                  <strong>Navigation au clavier :</strong> l'ensemble du site
                  est navigable au clavier.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Technologies utilisées",
          content: (
            <ul className="list-disc pl-5 space-y-2">
              <li>HTML5</li>
              <li>CSS3 (Tailwind CSS)</li>
              <li>JavaScript / TypeScript</li>
              <li>React (Next.js)</li>
              <li>GSAP (animations)</li>
              <li>Framer Motion (transitions)</li>
            </ul>
          ),
        },
        {
          title: "Retour d'information et contact",
          content: (
            <>
              <p>
                Si vous rencontrez un défaut d'accessibilité qui vous empêche
                d'accéder à un contenu ou une fonctionnalité du site, vous
                pouvez nous contacter :
              </p>
              <p>
                <strong>Email :</strong>{" "}
                <a
                  href="mailto:contact@aissabelkoussa.fr"
                  className="text-site-accent hover:underline"
                >
                  contact@aissabelkoussa.fr
                </a>
              </p>
              <p>
                Nous nous engageons à vous répondre dans un délai de 7 jours
                ouvrés et à trouver une solution dans un délai raisonnable.
              </p>
            </>
          ),
        },
        {
          title: "Voies de recours",
          content: (
            <>
              <p>
                Si vous constatez un défaut d'accessibilité et que vous n'obtenez
                pas de réponse satisfaisante, vous pouvez :
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Écrire un message au{" "}
                  <a
                    href="https://formulaire.defenseurdesdroits.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-site-accent hover:underline"
                  >
                    Défenseur des droits
                  </a>
                </li>
                <li>
                  Contacter le délégué du Défenseur des droits dans votre
                  région
                </li>
                <li>
                  Envoyer un courrier par voie postale (gratuit) : Défenseur des
                  droits, Libre réponse 71120, 75342 Paris CEDEX 07
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Date de la déclaration",
          content: (
            <p>
              Cette déclaration a été établie le <strong>10 avril 2026</strong>.
            </p>
          ),
        },
      ]}
    />
  );
}
