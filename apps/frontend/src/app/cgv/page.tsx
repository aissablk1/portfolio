"use client";

import LegalPage from "@/components/LegalPage";

export default function CGVPage() {
  return (
    <LegalPage
      badge="CGV"
      title="Conditions generales de vente"
      lastUpdated="28 mars 2026"
      sections={[
        {
          title: "Conditions de reglement",
          content: (
            <p>
              Reglement a reception de facture, par cheque ou virement bancaire.
              Lorsque le devis prevoit un acompte, celui-ci est exigible a la
              commande. La commande n'est consideree comme ferme et definitive
              qu'apres encaissement de l'acompte. Le solde est du a la mise en
              ligne du site ou a la livraison des livrables convenus. En cas
              d'annulation de la commande a l'initiative du client apres
              versement de l'acompte, celui-ci reste acquis au prestataire a
              titre d'indemnisation forfaitaire, sauf accord contraire ecrit des
              parties.
            </p>
          ),
        },
        {
          title: "Penalites de retard",
          content: (
            <p>
              En cas de retard de paiement, des penalites seront appliquees de
              plein droit, sans mise en demeure prealable, au taux de 3 fois le
              taux d'interet legal en vigueur, ainsi qu'une indemnite
              forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du
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
          title: "Validite du devis",
          content: (
            <p>
              Le devis est valable 30 jours a compter de sa date d'emission.
              Passe ce delai, les tarifs et conditions pourront etre revises.
            </p>
          ),
        },
        {
          title: "Propriete intellectuelle",
          content: (
            <>
              <p>
                Les droits de propriete intellectuelle sur l'ensemble des
                livrables (maquettes, code, algorithmes, visuels, contenus,
                etc.) demeurent la propriete exclusive du prestataire. Le client
                beneficie, apres paiement integral des sommes dues, d'un droit
                d'utilisation personnel, non exclusif et non transferable, dans
                les limites strictement necessaires a l'exploitation du projet
                tel que defini au devis.
              </p>
              <p>
                Avant complet reglement, le prestataire reste plein et entier
                proprietaire des creations et se reserve le droit de suspendre
                le service en cas d'impaye. Cette titularite des droits du
                prestataire est valable sans limitation de duree, conformement
                au droit de la propriete intellectuelle.
              </p>
              <p>
                Le client ne peut en aucun cas ceder, conceder ou sous-licencier
                ces droits a un tiers sans l'accord ecrit prealable du
                prestataire. Toute reproduction, modification, adaptation ou
                reutilisation du projet, en tout ou partie, sans l'accord ecrit
                prealable du prestataire, constitue une atteinte aux droits de
                propriete intellectuelle et est susceptible de caracteriser un
                delit de contrefacon.
              </p>
              <p>
                Le prestataire se reserve la possibilite d'apporter des
                ajustements techniques ou esthetiques mineurs au projet, sans
                accord prealable du client, lorsque ces ajustements sont
                necessaires pour des raisons de securite, de performance, de
                compatibilite ou d'amelioration continue du service. Ces
                ajustements ne remettent pas en cause l'economie generale de la
                prestation.
              </p>
              <p>
                Sauf opposition expresse du client, le prestataire est autorise
                a mentionner le nom et le logo du client ainsi qu'a presenter le
                projet realise au titre de ses references commerciales
                (portfolio, site internet, reseaux sociaux, documents de
                presentation, etc.).
              </p>
            </>
          ),
        },
        {
          title: "Responsabilite et perimetre de la prestation",
          content: (
            <>
              <p>
                Les delais sont donnes a titre indicatif et peuvent varier en
                fonction de la reactivite du client (remise des contenus,
                validations, etc.), de la complexite du chantier/projet et de
                tout alea technique ou organisationnel raisonnable.
              </p>
              <p>
                A compter de la mise a disposition du projet (recette), le
                client dispose d'un delai de 10 jours calendaires pour formuler
                ses reserves par ecrit. Passe ce delai, les livrables seront
                reputes conformes et acceptes.
              </p>
              <p>
                Ces variations de delai ne sauraient, sauf faute grave du
                prestataire, constituer un motif de resiliation ni ouvrir droit
                a indemnisation. En cas de survenance d'un evenement de force
                majeure au sens du droit francais, l'execution des obligations
                du prestataire pourra etre suspendue sans que sa responsabilite
                ne puisse etre engagee.
              </p>
              <p>
                La responsabilite du prestataire, toutes causes confondues, est
                strictement limitee au montant HT effectivement paye par le
                client au titre du devis. En aucun cas le prestataire ne pourra
                etre tenu responsable des prejudices indirects (perte de chiffre
                d'affaires, perte de donnees, atteinte a l'image, etc.).
              </p>
            </>
          ),
        },
        {
          title: "Donnees personnelles (RGPD)",
          content: (
            <>
              <p>
                Dans le cadre de la mission, des donnees personnelles (nom,
                telephone, e-mail, informations relatives au projet, etc.)
                peuvent etre collectees via le site, les formulaires en ligne,
                les demandes de devis, ainsi que par tout autre moyen de
                communication utilise avec le prestataire (e-mail, telephone,
                messagerie, etc.) pour le compte du client.
              </p>
              <p>
                Le client est responsable du respect de la reglementation
                applicable (notamment le RGPD) vis-a-vis de ses propres
                clients. Le prestataire agit en qualite de sous-traitant
                technique et s'engage a mettre en oeuvre des mesures de securite
                adaptees pour la gestion de ces donnees.
              </p>
              <p>
                Pour plus de details, consultez la{" "}
                <a
                  href="/confidentialite"
                  className="text-site-accent hover:underline"
                >
                  politique de confidentialite
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "Acceptation du devis",
          content: (
            <p>
              Le devis signe avec la mention « Bon pour accord » ou « Lu et
              approuve » vaut bon de commande et emporte acceptation pleine et
              entiere des presentes conditions.
            </p>
          ),
        },
      ]}
    />
  );
}
