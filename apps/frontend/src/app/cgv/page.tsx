"use client";

import LegalPage from "@/components/LegalPage";

export default function CGVPage() {
  return (
    <LegalPage
      badge="CGV"
      title="Conditions générales de vente"
      lastUpdated="3 avril 2026"
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
          title: "Propriété intellectuelle et licence d'utilisation",
          content: (
            <>
              <p>
                <strong>Titularité.</strong> Les droits de propriété
                intellectuelle sur l'ensemble des livrables (code source,
                maquettes, algorithmes, configurations, visuels, contenus
                originaux) demeurent la propriété exclusive du prestataire.
              </p>
              <p>
                <strong>Licence d'utilisation.</strong> Après paiement intégral
                du prix du projet, le client bénéficie d'une licence
                d'utilisation :
              </p>
              <ul>
                <li>
                  <strong>Non exclusive</strong> : le prestataire conserve le
                  droit de réutiliser librement tout ou partie des livrables
                  (code, design, composants, méthodes, architecture) pour tout
                  autre projet ou client, sans restriction ;
                </li>
                <li>Illimitée dans le temps ;</li>
                <li>
                  Couvrant l'exploitation du projet tel que défini au devis ;
                </li>
                <li>
                  Transférable dans le cadre d'une cession ou transmission
                  d'entreprise.
                </li>
              </ul>
              <p>
                La licence ne couvre pas : la revente, la sous‑licence à des
                tiers, la modification du code source en dehors du périmètre
                défini au devis, ni l'extraction des briques logicielles pour
                un usage indépendant du projet livré.
              </p>
              <p>
                <strong>Effet de l'arrêt de la maintenance.</strong> En cas de
                résiliation de l'abonnement de maintenance : (a) le
                site/système reste en ligne et fonctionnel ; (b) la licence
                d'utilisation reste valide sans limitation de durée ; (c) le
                client conserve l'accès au code source livré ; (d) le
                prestataire n'est plus tenu aux mises à jour, corrections de
                bugs, monitoring ni support ; (e) l'hébergement sur
                l'infrastructure du prestataire est maintenu 90 jours après la
                fin de l'abonnement (cf. article Hébergement).
              </p>
              <p>
                <strong>Remise du code.</strong> Sur demande écrite, le
                prestataire s'engage à remettre au client l'intégralité du code
                source, de la documentation technique et des accès nécessaires
                à la migration dans un délai de 15 jours ouvrés.
              </p>
              <p>
                Avant complet règlement, le prestataire reste plein et entier
                propriétaire des créations et se réserve le droit de suspendre
                le service en cas d'impayé.
              </p>
              <p>
                Le prestataire se réserve la possibilité d'apporter des
                ajustements techniques ou esthétiques mineurs au projet, sans
                accord préalable du client, lorsque ces ajustements sont
                nécessaires pour des raisons de sécurité, de performance, de
                compatibilité ou d'amélioration continue du service.
              </p>
              <p>
                Sauf opposition expresse du client, le prestataire est autorisé
                à mentionner le nom et le logo du client ainsi qu'à présenter
                le projet réalisé au titre de ses références commerciales
                (portfolio, site internet, réseaux sociaux, documents de
                présentation). Le prestataire est également autorisé à
                communiquer, à des fins commerciales, sur les résultats obtenus
                et les métriques de performance du projet, sous forme
                anonymisée ou nominative sauf opposition du client, dans le
                respect de la confidentialité des données sensibles.
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
          title: "Période de lancement incluse",
          content: (
            <>
              <p>
                Le prix du projet comprend une période de lancement de trois (3)
                mois à compter de la date du procès‑verbal de recette ou, à
                défaut de réserves formulées dans le délai de 10 jours, à
                compter de la date de mise à disposition du projet.
              </p>
              <p>
                Durant cette période, le client bénéficie des services de
                maintenance correspondant à la formule souscrite (Essentiel ou
                Premium), sans facturation supplémentaire. Cette période de
                lancement fait partie intégrante de la prestation projet. Elle
                n'est ni une période d'essai, ni un engagement de souscription
                à l'abonnement de maintenance.
              </p>
              <p>
                À l'issue de la période de lancement, le client peut :
                (a) poursuivre l'abonnement de maintenance au tarif en vigueur,
                sans engagement de durée — la facturation démarre
                automatiquement sauf notification contraire du client ;
                (b) ne pas poursuivre, auquel cas les services de maintenance
                cessent automatiquement sans formalité. Le prestataire informe
                le client par e‑mail quinze (15) jours avant la fin de la
                période de lancement.
              </p>
              <p>
                La période de lancement n'est applicable qu'aux plans
                Accélérateur et Partenaire. Le plan Autonome ne comprend aucune
                période de lancement ni service de maintenance.
              </p>
            </>
          ),
        },
        {
          title: "Responsabilité",
          content: (
            <>
              <p>
                La responsabilité du prestataire, toutes causes confondues, est
                strictement limitée au montant HT effectivement payé par le
                client au titre de la prestation concernée.
              </p>
              <p>
                En aucun cas le prestataire ne pourra être tenu responsable des
                préjudices indirects, notamment : perte de chiffre d'affaires,
                perte de données, perte de clientèle, atteinte à l'image ou à
                la réputation, manque à gagner, préjudice commercial ou
                financier de toute nature, y compris ceux résultant d'une fuite,
                d'une perte ou d'un accès non autorisé aux données du client
                (cf. article « Confidentialité et données sensibles du
                client »).
              </p>
              <p>
                Le prestataire est tenu à une obligation de moyens. Il met en
                œuvre les mesures de sécurité raisonnables conformes aux bonnes
                pratiques de l'industrie, mais ne garantit pas l'inviolabilité
                des systèmes, réseaux ou services du client ou de tiers.
              </p>
            </>
          ),
        },
        {
          title: "Résiliation du contrat",
          content: (
            <>
              <p>
                <strong>Résiliation pour manquement.</strong> Chacune des
                parties peut résilier le contrat en cas de manquement grave de
                l'autre partie à ses obligations, après mise en demeure restée
                sans effet pendant 15 jours calendaires adressée par lettre
                recommandée avec accusé de réception ou par e‑mail avec
                confirmation de lecture.
              </p>
              <p>
                <strong>Résiliation du projet à l'initiative du
                client.</strong> En cas de résiliation à l'initiative du client
                en dehors d'un manquement du prestataire, les sommes versées
                restent acquises au prestataire au prorata du travail réalisé.
                Le prestataire fournira un état d'avancement détaillé et
                remettra les livrables produits jusqu'à la date de résiliation.
              </p>
              <p>
                <strong>Résiliation du projet à l'initiative du
                prestataire.</strong> En cas de résiliation à l'initiative du
                prestataire en dehors d'un manquement du client, le prestataire
                remboursera les sommes correspondant aux prestations non encore
                réalisées.
              </p>
              <p>
                <strong>Résiliation de l'abonnement de maintenance.</strong> Les
                conditions de résiliation spécifiques à l'abonnement de
                maintenance sont détaillées à l'article « Abonnements de
                maintenance et évolution ».
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
                <strong>Souscription et durée.</strong> L'abonnement de
                maintenance prend effet automatiquement à l'issue de la période
                de lancement de trois (3) mois, soit le 91e jour suivant la
                date de recette du projet. Le prestataire adresse une facture
                mensuelle au client, payable par virement bancaire ou
                prélèvement SEPA dans un délai de quinze (15) jours suivant la
                date d'émission. L'abonnement est reconductible tacitement
                chaque mois.
              </p>
              <p>
                <strong>Niveaux de service (SLA).</strong>
              </p>
              <p>
                <em>Formule Essentiel (490 €/mois) :</em> monitoring 24/7
                (disponibilité cible : 99,5 %) ; corrections bugs critiques :
                48 h ouvrées ; corrections bugs mineurs : 10 jours ouvrés ;
                mises à jour sécurité : appliquées sous 72 h ; 1 h de support
                mensuel inclus ; rapport mensuel de performance.
              </p>
              <p>
                <em>Formule Premium (1 900 €/mois) :</em> monitoring 24/7
                (disponibilité cible : 99,9 %) ; corrections bugs critiques :
                24 h ouvrées ; corrections bugs mineurs : 5 jours ouvrés ;
                mises à jour sécurité : appliquées sous 24 h ; évolutions
                jusqu'à 10 h/mois (non reportables) ; support prioritaire
                24 h ; réunion de suivi stratégique mensuelle ; rapport mensuel
                de performance.
              </p>
              <p>
                Les niveaux de service s'appliquent aux jours ouvrés
                (lundi‑vendredi, hors jours fériés français), sauf pour le
                monitoring automatisé qui fonctionne en continu. Toute
                prestation excédant le périmètre de l'abonnement fera l'objet
                d'un devis complémentaire.
              </p>
              <p>
                <strong>Résiliation par le client.</strong> Le client peut
                résilier son abonnement à tout moment, par e‑mail avec accusé
                de réception ou lettre recommandée, moyennant un préavis de
                trente (30) jours avant la prochaine échéance mensuelle. La
                résiliation prend effet à la fin du mois civil suivant la
                réception de la notification.
              </p>
              <p>
                <strong>Résiliation par le prestataire.</strong> Le prestataire
                peut résilier l'abonnement avec un préavis de soixante (60)
                jours, notamment en cas de cessation d'activité ou
                d'impossibilité technique de maintenir le service.
              </p>
              <p>
                <strong>Résiliation pour impayé.</strong> En cas de
                non‑paiement d'une échéance malgré une relance restée sans
                effet pendant quinze (15) jours, le prestataire peut suspendre
                les services de maintenance et résilier l'abonnement de plein
                droit.
              </p>
              <p>
                <strong>Travaux en cours.</strong> En cas de résiliation, les
                travaux de maintenance en cours d'exécution au moment de la
                notification sont menés à terme. Aucune prestation nouvelle ne
                sera engagée.
              </p>
              <p>
                <strong>Clause de réversibilité.</strong> Dans les trente (30)
                jours suivant la date d'effet de la résiliation, le prestataire
                s'engage à : (a) remettre au client l'intégralité du code
                source à jour ; (b) fournir la documentation technique et les
                accès nécessaires (hébergement, DNS, comptes tiers, base de
                données) ; (c) assurer un transfert de compétences raisonnable
                (1 heure de visioconférence) pour faciliter la reprise par un
                autre prestataire ; (d) supprimer les données du client de ses
                systèmes dans un délai de 60 jours, sauf obligation légale de
                conservation.
              </p>
              <p>
                <strong>Engagement annuel.</strong> Le client peut opter pour un
                engagement annuel bénéficiant d'une remise de 25 % (soit
                l'équivalent de 3 mois offerts sur 12). L'engagement annuel est
                facturé en une seule fois à la date de souscription. En cas de
                résiliation anticipée d'un engagement annuel, les mensualités
                restantes ne sont pas remboursées.
              </p>
              <p>
                <strong>Révision tarifaire.</strong> Les tarifs des abonnements
                sont révisables une fois par an, à la date anniversaire du
                contrat, dans la limite de l'indice Syntec ou de 5 %
                (le plus bas des deux). Le prestataire notifie toute révision
                tarifaire soixante (60) jours avant son entrée en vigueur. En
                cas de refus, le client peut résilier sans pénalité dans les 30
                jours suivant la notification.
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
          title: "Confidentialité et données sensibles du client",
          content: (
            <>
              <p>
                Dans le cadre de l'exécution des prestations (création de site,
                automatisation, intégration de systèmes, maintenance), le
                prestataire peut être amené à accéder, manipuler ou traiter des
                données sensibles appartenant au client ou à ses propres
                clients, notamment :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Coordonnées bancaires et informations financières (IBAN, RIB,
                  numéros de compte)
                </li>
                <li>
                  Identifiants et accès techniques (mots de passe, clés API,
                  accès serveurs, panneaux d'administration)
                </li>
                <li>
                  Données clients du client (fichiers clients, contacts,
                  historiques de commandes, factures)
                </li>
                <li>
                  Données métier confidentielles (chiffre d'affaires, marges,
                  stratégie commerciale, tarification)
                </li>
                <li>
                  Tout autre document ou information communiqué par le client
                  dans le cadre de la mission
                </li>
              </ul>

              <p className="mt-4 font-medium">
                Engagements du prestataire (obligation de moyens) :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Mettre en œuvre les mesures de sécurité raisonnables et
                  conformes aux bonnes pratiques de l'industrie (chiffrement,
                  accès restreints, authentification forte)
                </li>
                <li>
                  Accéder aux données du client uniquement dans la mesure
                  strictement nécessaire à l'exécution de la prestation
                </li>
                <li>
                  Ne divulguer aucune donnée confidentielle à des tiers, sauf
                  obligation légale ou autorisation écrite du client
                </li>
                <li>
                  Supprimer ou restituer l'ensemble des données, accès et
                  identifiants du client à l'issue de la mission ou sur demande
                </li>
                <li>
                  Signaler au client toute faille de sécurité ou tout incident
                  détecté dans les meilleurs délais
                </li>
              </ul>

              <p className="mt-4 font-medium">
                Limitation de responsabilité en matière de données :
              </p>
              <p className="mt-2">
                Le prestataire s'engage à une{" "}
                <strong>obligation de moyens</strong> en matière de protection
                des données, et non à une obligation de résultat. En aucun cas
                le prestataire ne pourra être tenu responsable :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Des fuites, pertes, altérations ou accès non autorisés aux
                  données résultant d'une défaillance de l'infrastructure, des
                  systèmes ou des services du client ou de prestataires tiers
                  choisis par le client
                </li>
                <li>
                  Des incidents de sécurité causés par des attaques
                  informatiques (hacking, phishing, ransomware, ingénierie
                  sociale) visant les systèmes du client, les services tiers ou
                  l'environnement technique hors du contrôle direct du
                  prestataire
                </li>
                <li>
                  De la perte de données liée à l'absence de sauvegardes
                  effectuées par le client sur ses propres systèmes
                </li>
                <li>
                  De l'utilisation par le client de mots de passe faibles, du
                  partage d'identifiants par des canaux non sécurisés, ou du
                  non-respect des recommandations de sécurité formulées par le
                  prestataire
                </li>
                <li>
                  Des conséquences liées à la transmission volontaire par le
                  client de données sensibles (coordonnées bancaires,
                  identifiants, etc.) via des canaux non chiffrés ou non
                  sécurisés (email non chiffré, messagerie instantanée grand
                  public, etc.)
                </li>
                <li>
                  Des dommages indirects ou consécutifs tels que perte de
                  clientèle, atteinte à la réputation, manque à gagner ou
                  préjudice commercial résultant d'une fuite de données
                </li>
              </ul>

              <p className="mt-4 font-medium">
                Obligations du client :
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                  Effectuer une sauvegarde complète de ses données et systèmes
                  avant de communiquer tout accès au prestataire
                </li>
                <li>
                  Transmettre les identifiants et données sensibles
                  exclusivement par des canaux sécurisés (gestionnaire de mots
                  de passe partagé, transfert chiffré, espace sécurisé dédié)
                </li>
                <li>
                  Informer le prestataire de la nature sensible des données
                  auxquelles il accorde l'accès, et de toute réglementation
                  spécifique applicable (PCI-DSS, données de santé, etc.)
                </li>
                <li>
                  Révoquer les accès accordés au prestataire à l'issue de la
                  mission ou dès qu'ils ne sont plus nécessaires
                </li>
                <li>
                  S'assurer de la conformité réglementaire (RGPD, CNIL) du
                  traitement des données personnelles de ses propres clients
                </li>
              </ul>

              <p className="mt-4">
                La présente clause de confidentialité survit à la fin du contrat
                pour une durée de deux (2) ans.
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
          title: "Droit de rétractation",
          content: (
            <>
              <p>
                Conformément à l'article L221‑28 du Code de la consommation, le
                droit de rétractation ne peut être exercé pour les contrats de
                fourniture de contenu numérique non fourni sur support matériel
                dont l'exécution a commencé avec l'accord préalable exprès du
                consommateur et renoncement exprès à son droit de rétractation.
              </p>
              <p>
                Le client reconnaît et accepte que l'exécution de la prestation
                commence dès la signature du devis et le versement de l'acompte,
                et renonce expressément à son droit de rétractation à compter de
                ce moment.
              </p>
            </>
          ),
        },
        {
          title: "Non‑sollicitation",
          content: (
            <p>
              Pendant la durée du contrat et les douze (12) mois suivant son
              terme, le client s'engage à ne pas solliciter directement ou
              indirectement les sous‑traitants, prestataires ou collaborateurs
              mis en relation par le prestataire dans le cadre de la mission,
              sauf accord écrit préalable. Cette clause ne fait pas obstacle au
              droit du client de contracter librement avec tout prestataire de
              son choix pour des besoins sans rapport avec la mission.
            </p>
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
