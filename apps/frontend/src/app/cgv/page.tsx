"use client";

import LegalPage from "@/components/LegalPage";

export default function CGVPage() {
  return (
    <LegalPage
      badge="CGV"
      title="Conditions générales de vente"
      lastUpdated="28 mars 2026"
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
              les tarifs et conditions pourront être révisés.
            </p>
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
                d'utilisation personnel, non exclusif et non transférable, dans
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
                présentation, etc.).
              </p>
            </>
          ),
        },
        {
          title: "Responsabilité et périmètre de la prestation",
          content: (
            <>
              <p>
                Les délais sont donnés à titre indicatif et peuvent varier en
                fonction de la réactivité du client (remise des contenus,
                validations, etc.), de la complexité du chantier/projet et de
                tout aléa technique ou organisationnel raisonnable.
              </p>
              <p>
                À compter de la mise à disposition du projet (recette), le
                client dispose d'un délai de 10 jours calendaires pour formuler
                ses réserves par écrit. Passé ce délai, les livrables seront
                réputés conformes et acceptés.
              </p>
              <p>
                Ces variations de délai ne sauraient, sauf faute grave du
                prestataire, constituer un motif de résiliation ni ouvrir droit
                à indemnisation. En cas de survenance d'un événement de force
                majeure au sens du droit français, l'exécution des obligations
                du prestataire pourra être suspendue sans que sa responsabilité
                ne puisse être engagée.
              </p>
              <p>
                La responsabilité du prestataire, toutes causes confondues, est
                strictement limitée au montant HT effectivement payé par le
                client au titre de la prestation concernée. En aucun cas le prestataire ne
                pourra être tenu responsable des préjudices indirects (perte de
                chiffre d'affaires, perte de données, atteinte à l'image, etc.).
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
