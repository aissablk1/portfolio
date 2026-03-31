"use client";

import LegalPage from "@/components/LegalPage";

export default function CGVPage() {
  return (
    <LegalPage
      badge="CGV"
      title="Conditions générales de vente"
      lastUpdated="31 mars 2026"
      sections={[
        {
          title: "Conditions de règlement",
          content: (
            <p>
              Règlement à réception de facture, par chèque ou virement bancaire.
              Lorsque le devis prévoit un acompte, celui‑ci est exigible à la
              commande. La commande n'est considérée comme ferme et définitive
              qu'après encaissement de l'acompte. Le solde est dû à la mise en
              ligne du site ou à la livraison des livrables convenus. En cas
              d'annulation de la commande à l'initiative du client après
              versement de l'acompte, celui‑ci reste acquis au prestataire à
              titre d'indemnisation forfaitaire, sauf accord contraire écrit des
              parties.
            </p>
          ),
        },
        {
          title: "Pénalités de retard",
          content: (
            <p>
              En cas de retard de paiement, des pénalités seront appliquées de
              plein droit, sans mise en demeure préalable, au taux de 3 fois le
              taux d'intérêt légal en vigueur, ainsi qu'une indemnité
              forfaitaire pour frais de recouvrement de 40 € (art. L441‑10 du
              Code de commerce).
            </p>
          ),
        },
        {
          title: "TVA",
          content: (
            <p>
              TVA non applicable, article 293 B du CGI. Total HT = Total TTC.
            </p>
          ),
        },
        {
          title: "Validité des propositions",
          content: (
            <p>
              Sauf mention contraire, tout devis ou proposition commerciale est
              valable 30 jours à compter de sa date d'émission. Passé ce délai,
              les tarifs et conditions pourront être révisés. Lorsque le devis
              prévoit un paiement échelonné (en 2 ou 3 fois), les échéances et
              montants sont précisés au devis et font partie intégrante des
              conditions contractuelles.
            </p>
          ),
        },
        {
          title: "Obligations du client",
          content: (
            <>
              <p>
                Le client s'engage à fournir au prestataire l'ensemble des
                éléments nécessaires à la réalisation du projet (contenus,
                textes, visuels, accès techniques, brief, charte graphique,
                etc.) dans un délai raisonnable et au plus tard dans les 10
                jours ouvrés suivant la demande du prestataire.
              </p>
              <p>
                Le client s'engage à valider les étapes intermédiaires
                (maquettes, prototypes, livrables partiels) dans un délai de 5
                jours ouvrés à compter de leur mise à disposition. Passé ce
                délai et sans retour du client, les livrables soumis sont
                réputés validés.
              </p>
              <p>
                Tout retard ou défaut de fourniture des éléments par le client
                entraîne un décalage équivalent du planning prévisionnel, sans
                que la responsabilité du prestataire puisse être engagée. En cas
                d'inactivité prolongée du client (absence de réponse supérieure
                à 30 jours calendaires malgré deux relances écrites), le
                prestataire se réserve le droit de considérer le projet comme
                abandonné. Les sommes versées restent acquises et le solde
                éventuellement dû devient immédiatement exigible.
              </p>
            </>
          ),
        },
        {
          title: "Propriété intellectuelle",
          content: (
            <>
              <p>
                Les droits de propriété intellectuelle sur l'ensemble des
                livrables (maquettes, code, algorithmes, visuels, contenus,
                etc.) demeurent la propriété exclusive du prestataire. Le client
                bénéficie, après paiement intégral des sommes dues, d'un droit
                d'utilisation non exclusif, pour l'ensemble de son organisation
                et ses collaborateurs, transférable dans le cadre d'une cession
                ou transmission d'entreprise, sans limitation de durée, dans
                les limites strictement nécessaires à l'exploitation du projet
                tel que défini au devis.
              </p>
              <p>
                Avant complet règlement, le prestataire reste plein et entier
                propriétaire des créations et se réserve le droit de suspendre
                le service en cas d'impayé. Cette titularité des droits du
                prestataire est valable sans limitation de durée, conformément
                au droit de la propriété intellectuelle.
              </p>
              <p>
                Le client ne peut en aucun cas céder, concéder ou sous‑licencier
                ces droits à un tiers sans l'accord écrit préalable du
                prestataire. Toute reproduction, modification, adaptation ou
                réutilisation du projet, en tout ou partie, sans l'accord écrit
                préalable du prestataire, constitue une atteinte aux droits de
                propriété intellectuelle et est susceptible de caractériser un
                délit de contrefaçon.
              </p>
              <p>
                Le prestataire se réserve la possibilité d'apporter des
                ajustements techniques ou esthétiques mineurs au projet, sans
                accord préalable du client, lorsque ces ajustements sont
                nécessaires pour des raisons de sécurité, de performance, de
                compatibilité ou d'amélioration continue du service. Ces
                ajustements ne remettent pas en cause l'économie générale de la
                prestation.
              </p>
              <p>
                Sauf opposition expresse du client, le prestataire est autorisé
                à mentionner le nom et le logo du client ainsi qu'à présenter le
                projet réalisé au titre de ses références commerciales
                (portfolio, site internet, réseaux sociaux, documents de
                présentation, etc.). Le prestataire est également autorisé à
                communiquer, à des fins commerciales, sur les résultats obtenus
                et les métriques de performance du projet, sous forme anonymisée
                ou nominative sauf opposition du client, dans le respect de la
                confidentialité des données sensibles du client.
              </p>
            </>
          ),
        },
        {
          title: "Délais de livraison",
          content: (
            <>
              <p>
                Les délais de livraison sont estimés au devis et constituent un
                engagement du prestataire, sous réserve du respect par le client
                de ses propres obligations (fourniture des contenus, validations
                dans les délais, accès techniques). Tout retard imputable au
                client décale le planning d'autant.
              </p>
              <p>
                En cas de retard imputable exclusivement au prestataire
                excédant 10 jours ouvrés par rapport au planning convenu, une
                remise de 5 % du montant total de la prestation sera appliquée
                par tranche de 10 jours ouvrés de retard supplémentaire, dans
                la limite de 20 % du montant total.
              </p>
              <p>
                En cas de survenance d'un événement de force majeure au sens du
                droit français, l'exécution des obligations du prestataire
                pourra être suspendue sans que sa responsabilité ne puisse être
                engagée.
              </p>
            </>
          ),
        },
        {
          title: "Recette et acceptation",
          content: (
            <p>
              À compter de la mise à disposition du projet (recette), le client
              dispose d'un délai de 10 jours calendaires pour formuler ses
              réserves par écrit. Passé ce délai, les livrables seront réputés
              conformes et acceptés. En cas de réserves fondées et conformes au
              brief validé, le prestataire s'engage à effectuer les corrections
              nécessaires sans frais supplémentaires dans un délai raisonnable.
            </p>
          ),
        },
        {
          title: "Responsabilité",
          content: (
            <>
              <p>
                La responsabilité du prestataire, toutes causes confondues, est
                strictement limitée au montant HT effectivement payé par le
                client au titre de la prestation concernée. En aucun cas le
                prestataire ne pourra être tenu responsable des préjudices
                indirects (perte de chiffre d'affaires, perte de données,
                atteinte à l'image, etc.).
              </p>
            </>
          ),
        },
        {
          title: "Résiliation",
          content: (
            <>
              <p>
                Chacune des parties peut résilier le contrat en cas de
                manquement grave de l'autre partie à ses obligations, après
                mise en demeure restée sans effet pendant 15 jours calendaires
                adressée par lettre recommandée avec accusé de réception ou par
                e‑mail avec confirmation de lecture.
              </p>
              <p>
                En cas de résiliation à l'initiative du client en dehors d'un
                manquement du prestataire, les sommes versées restent acquises
                au prestataire au prorata du travail réalisé. Le prestataire
                fournira un état d'avancement détaillé et remettra les
                livrables produits jusqu'à la date de résiliation.
              </p>
              <p>
                En cas de résiliation à l'initiative du prestataire en dehors
                d'un manquement du client, le prestataire remboursera les
                sommes correspondant aux prestations non encore réalisées.
              </p>
            </>
          ),
        },
        {
          title: "Hébergement et infrastructure",
          content: (
            <>
              <p>
                Sauf mention contraire au devis, le projet est hébergé sur
                l'infrastructure technique gérée par le prestataire (serveurs,
                plateformes cloud, noms de domaine). Les frais d'hébergement
                sont inclus dans l'abonnement de maintenance le cas échéant, ou
                facturés séparément selon les modalités précisées au devis.
              </p>
              <p>
                En l'absence d'abonnement actif et lorsque le projet est
                hébergé sur l'infrastructure du prestataire, ce dernier
                s'engage à maintenir l'hébergement pendant une durée de 90
                jours suivant la fin de l'abonnement ou la livraison du projet.
                Passé ce délai, le prestataire pourra suspendre l'hébergement
                après notification préalable de 30 jours adressée au client. Le
                prestataire s'engage à fournir au client, sur demande, une
                copie des données et fichiers nécessaires à la migration du
                projet vers un autre hébergeur.
              </p>
              <p>
                Lorsque le projet est hébergé sur l'infrastructure du client,
                le prestataire n'est pas responsable de la disponibilité, de la
                sécurité ni de la performance de l'hébergement.
              </p>
            </>
          ),
        },
        {
          title: "Abonnements de maintenance et évolution",
          content: (
            <>
              <p>
                Les abonnements de maintenance (Essentiel, Pro, Entreprise)
                sont souscrits pour une durée mensuelle reconductible
                tacitement. Le client peut résilier son abonnement à tout
                moment avec un préavis de 30 jours avant la prochaine
                échéance. La résiliation prend effet à la fin du mois en cours.
              </p>
              <p>
                Le périmètre de chaque formule d'abonnement (volume d'heures,
                temps de réponse, services inclus) est défini dans la
                proposition commerciale acceptée par le client. Toute
                prestation excédant le périmètre de l'abonnement fera l'objet
                d'un devis complémentaire.
              </p>
              <p>
                Le prestataire se réserve le droit de réviser les tarifs des
                abonnements une fois par an, avec un préavis de 60 jours. En
                cas de refus du nouveau tarif, le client pourra résilier son
                abonnement sans pénalité.
              </p>
            </>
          ),
        },
        {
          title: "Données personnelles (RGPD)",
          content: (
            <>
              <p>
                Dans le cadre de la mission, des données personnelles (nom,
                téléphone, e‑mail, informations relatives au projet, etc.)
                peuvent être collectées via le site, les formulaires en ligne,
                les demandes de devis, ainsi que par tout autre moyen de
                communication utilisé avec le prestataire (e‑mail, téléphone,
                messagerie, etc.) pour le compte du client.
              </p>
              <p>
                Le client est responsable du respect de la réglementation
                applicable (notamment le RGPD) vis‑à‑vis de ses propres
                clients. Le prestataire agit en qualité de sous‑traitant
                technique et s'engage à mettre en œuvre des mesures de sécurité
                adaptées pour la gestion de ces données.
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
          title: "Médiation et litiges",
          content: (
            <>
              <p>
                En cas de différend relatif à l'exécution ou à
                l'interprétation des présentes conditions, les parties
                s'engagent à rechercher une solution amiable avant toute
                action judiciaire. À défaut d'accord amiable dans un délai de
                30 jours, le litige pourra être soumis à un médiateur de la
                consommation conformément aux articles L611‑1 et suivants du
                Code de la consommation.
              </p>
              <p>
                À défaut de résolution par voie de médiation, le litige sera
                porté devant les tribunaux compétents du ressort du siège du
                prestataire (Tribunal judiciaire d'Albi), nonobstant pluralité
                de défendeurs ou appel en garantie.
              </p>
              <p>
                Les présentes conditions sont régies par le droit français.
              </p>
            </>
          ),
        },
        {
          title: "Acceptation des conditions",
          content: (
            <p>
              Tout document contractuel (devis, contrat, bon de commande,
              proposition commerciale, avenant, lettre de mission, et tout
              autre document émis par le prestataire) signé avec la mention « Bon pour
              accord » ou « Lu et approuvé » vaut engagement ferme et emporte
              acceptation pleine et entière des présentes conditions générales
              de vente.
            </p>
          ),
        },
      ]}
    />
  );
}
