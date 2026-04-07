"""Templates email pour les sequences automatisees.

Reutilise le pattern _branded_email() de email_service.py.
Chaque template est une fonction qui recoit un contexte et retourne du HTML.
"""

from html import escape as h

SITE_URL = "https://www.aissabelkoussa.fr"
CALENDLY_URL = "https://calendly.com/aissabelkoussa/30min"
WHATSAPP_URL = "https://wa.me/33782721406"


# ─── Wrapper brande ─────────────────────────────────────────────────────────

def _branded_email(subject: str, body_html: str, unsubscribe_url: str | None = None) -> str:
    unsub_block = ""
    if unsubscribe_url:
        unsub_block = f'''
    <p style="margin:12px 0 0;font-size:11px;">
      <a href="{h(unsubscribe_url)}" style="color:#666;text-decoration:underline;">Se desinscrire de ces emails</a>
    </p>'''

    return f'''<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>{h(subject)}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #222;">
    <a href="{SITE_URL}" style="text-decoration:none;">
      <h1 style="color:#fff;font-size:14px;letter-spacing:0.3em;margin:0;font-weight:700;">A\u00cfSSA BELKOUSSA</h1>
    </a>
  </div>
  <div style="padding:32px 0;color:#e0e0e0;font-size:15px;line-height:1.7;">
    {body_html}
  </div>
  <div style="border-top:1px solid #222;padding-top:24px;text-align:center;color:#666;font-size:12px;">
    <p style="margin:0 0 8px;">
      <a href="https://linkedin.com/in/aissabelkoussa" style="color:#888;text-decoration:none;">LinkedIn</a>
      &nbsp;&middot;&nbsp;
      <a href="https://github.com/aissablk1" style="color:#888;text-decoration:none;">GitHub</a>
      &nbsp;&middot;&nbsp;
      <a href="{SITE_URL}" style="color:#888;text-decoration:none;">Portfolio</a>
    </p>
    <p style="margin:0;color:#444;">&copy; 2026 A\u00efssa Belkoussa</p>
    {unsub_block}
  </div>
</div>
</body></html>'''


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _cta_button(text: str, url: str, color: str = "#fff", bg: str = "#18181b") -> str:
    return f'''<p style="text-align:center;margin:32px 0;">
  <a href="{h(url)}" style="background:{bg};color:{color};padding:14px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:600;font-size:14px;letter-spacing:0.05em;">{h(text)}</a>
</p>'''


def _section(title: str, content: str) -> str:
    return f'''<div style="background:#161616;padding:20px;border-radius:8px;margin:0 0 24px;border:1px solid #222;">
  <p style="color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">{h(title)}</p>
  {content}
</div>'''


# ─── SEQUENCES POST-DIAGNOSTIC ──────────────────────────────────────────────

def post_diagnostic_j0(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+0 : Resultats detailles + faiblesse principale."""
    name = h(ctx.get("name", ""))
    score = ctx.get("score", 0)
    max_score = ctx.get("max_score", 15)
    pct = round(score / max_score * 100) if max_score else 0
    weakest = h(ctx.get("weakest_question", ""))
    weakest_area = h(ctx.get("weakest_area", ""))
    plan = ctx.get("recommended_plan", "accelerateur")

    subject = f"{name}, votre score digital : {score}/{max_score}"

    # Score color
    if pct >= 80:
        color, label = "#22c55e", "Avance"
    elif pct >= 47:
        color, label = "#f59e0b", "Intermediaire"
    else:
        color, label = "#ef4444", "Debutant"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Merci d'avoir complete votre diagnostic digital. Voici vos resultats detailles.</p>

<div style="text-align:center;margin:32px 0;">
  <span style="font-size:56px;font-weight:700;color:#fff;">{score}</span>
  <span style="font-size:24px;color:#666;">/ {max_score}</span>
  <br>
  <span style="display:inline-block;margin-top:8px;padding:4px 16px;border-radius:20px;font-size:13px;font-weight:600;color:{color};border:1px solid {color};">{label}</span>
</div>

{_section("Votre point faible principal", f'''
  <p style="color:#fff;font-weight:600;margin:0 0 8px;">{weakest}</p>
  <p style="color:#e0e0e0;margin:0;">{weakest_area}</p>
''')}

<p>Demain, je vous enverrai une analyse detaillee de ce point faible et comment le corriger concretement.</p>

{_cta_button("Voir les solutions adaptees", f"{SITE_URL}/go?plan={plan}")}

<p style="color:#999;font-size:13px;">Si vous voulez en discuter directement, <a href="{CALENDLY_URL}" style="color:#8b5cf6;text-decoration:none;">reservez un appel de 30 min</a> (gratuit).</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_diagnostic_j1(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+1 : Deep dive sur la faiblesse."""
    name = h(ctx.get("name", ""))
    weakest = h(ctx.get("weakest_question", ""))

    # Map weakness ID to detailed advice
    weakness_id = ctx.get("weakest_id", "site")
    advice_map = {
        "site": ("Votre site ne genere pas de clients", "Un site vitrine n'est pas un site qui vend. La difference ? Un site qui convertit a : un message clair en 5 secondes, un CTA visible sans scroller, des preuves sociales, et un formulaire de contact ou prise de RDV en ligne. 73% des visiteurs quittent un site en moins de 5 secondes s'ils ne comprennent pas ce que vous faites."),
        "rdv": ("Vos clients ne peuvent pas reserver en ligne", "Chaque appel telephonique pour prendre RDV vous coute 15-20 minutes. Multiplie par 10 prospects par semaine, c'est 3h perdues. Un systeme de reservation en ligne (Calendly, Cal.com) se met en place en 2 heures et reduit les no-shows de 40%."),
        "devis": ("Vos devis prennent trop de temps", "Un devis envoye en 5 minutes a 3x plus de chances d'etre accepte qu'un devis envoye le lendemain. L'automatisation du devis (template pre-rempli, calcul automatique, signature electronique) transforme une tache de 2 heures en 5 minutes."),
        "relance": ("Vous ne relancez pas vos prospects", "80% des ventes se font entre la 5eme et la 12eme relance. Mais 44% des commerciaux abandonnent apres 1 seul suivi. Une sequence de relance automatique (3 emails sur 14 jours) peut doubler votre taux de conversion sans effort."),
        "temps": ("Vous perdez trop de temps sur l'administratif", "Si vous passez plus de 5h par semaine sur des taches repetitives (facturation, relances, planification), vous perdez l'equivalent d'un mois de travail par an. L'automatisation des workflows repetitifs libere ce temps pour la production et la prospection."),
    }
    title, detail = advice_map.get(weakness_id, ("Votre plus grand point faible", "Chaque jour sans correction, c'est du chiffre d'affaires perdu."))

    subject = f"{name}, pourquoi « {weakest} » vous coute cher"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Hier, votre diagnostic a revele un point faible majeur. Aujourd'hui, on creuse.</p>

{_section(h(title), f'<p style="color:#e0e0e0;margin:0;line-height:1.8;">{h(detail)}</p>')}

<h3 style="color:#fff;font-size:16px;margin:24px 0 12px;">Concretement, que faire ?</h3>
<ol style="padding-left:20px;color:#e0e0e0;">
  <li style="margin:8px 0;"><strong style="color:#fff;">Semaine 1</strong> : Identifier les 3 taches qui vous prennent le plus de temps</li>
  <li style="margin:8px 0;"><strong style="color:#fff;">Semaine 2</strong> : Automatiser la plus couteuse (celle qui vous fait perdre le plus de CA)</li>
  <li style="margin:8px 0;"><strong style="color:#fff;">Semaine 3</strong> : Mesurer les resultats et iterer</li>
</ol>

<p>Apres-demain, je vous enverrai une etude de cas concret d'un professionnel qui a corrige exactement ce probleme.</p>

{_cta_button("Discuter de votre situation", CALENDLY_URL)}
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_diagnostic_j3(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+3 : Etude de cas pertinente."""
    name = h(ctx.get("name", ""))
    plan = ctx.get("recommended_plan", "accelerateur")

    subject = f"{name}, comment un artisan a triple ses demandes de devis"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Comme promis, voici une etude de cas concret.</p>

{_section("Le probleme", '''
  <p style="color:#e0e0e0;margin:0;">Un artisan plombier a Toulouse. 15 ans d'experience, excellent bouche-a-oreille, mais zero presence en ligne. Son site datait de 2018, pas responsive, pas de formulaire de contact. Il perdait 3-4 demandes de devis par semaine au profit de concurrents mieux positionnes sur Google.</p>
''')}

{_section("La solution (10 jours)", '''
  <ul style="padding-left:20px;margin:0;color:#e0e0e0;">
    <li style="margin:4px 0;">Site optimise SEO local avec formulaire de devis instantane</li>
    <li style="margin:4px 0;">Reservation en ligne des interventions</li>
    <li style="margin:4px 0;">Relance automatique des devis non signes (J+2, J+5, J+10)</li>
    <li style="margin:4px 0;">Dashboard de suivi des demandes</li>
  </ul>
''')}

{_section("Les resultats (3 mois)", '''
  <p style="color:#e0e0e0;margin:0;">
    <strong style="color:#22c55e;">+187%</strong> de demandes de devis en ligne<br>
    <strong style="color:#22c55e;">12 nouveaux clients</strong> le premier mois<br>
    <strong style="color:#22c55e;">2h/semaine</strong> economisees sur l'administratif<br>
    <strong style="color:#22c55e;">ROI positif</strong> des le 2eme mois
  </p>
''')}

<p>Votre situation est similaire ? Dans 2 jours, je vous enverrai une offre personnalisee basee sur votre diagnostic.</p>

{_cta_button("Voir comment ca marche", f"{SITE_URL}/go?plan={plan}")}
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_diagnostic_j5(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+5 : Offre personnalisee."""
    name = h(ctx.get("name", ""))
    score = ctx.get("score", 0)
    max_score = ctx.get("max_score", 15)
    plan = ctx.get("recommended_plan", "accelerateur")

    plan_details = {
        "accelerateur": ("Accelerateur", "2 900", "Votre systeme livre et maintenu. 3 mois de maintenance offerts."),
        "partenaire": ("Partenaire", "6 900", "Infrastructure complete avec partenaire technique dedie."),
    }
    plan_name, plan_price, plan_desc = plan_details.get(plan, plan_details["accelerateur"])

    subject = f"{name}, votre plan d'action personnalise"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Votre diagnostic a revele un score de <strong style="color:#fff;">{score}/{max_score}</strong>. Voici ce que je recommande pour votre situation.</p>

{_section(f"Offre recommandee : {plan_name}", f'''
  <p style="color:#fff;font-size:20px;font-weight:700;margin:0 0 8px;">{plan_price} &euro;</p>
  <p style="color:#e0e0e0;margin:0 0 16px;">{plan_desc}</p>
  <ul style="padding-left:20px;margin:0;color:#e0e0e0;">
    <li style="margin:4px 0;">Livraison en 5 a 10 jours ouvres</li>
    <li style="margin:4px 0;">Prix fixe garanti — aucun depassement</li>
    <li style="margin:4px 0;">Satisfait ou retravaille</li>
    <li style="margin:4px 0;">Licence d'usage complete</li>
  </ul>
''')}

<p>Cette offre est basee sur vos reponses au diagnostic. Elle cible specifiquement les points faibles identifies.</p>

{_cta_button(f"Demarrer avec l'offre {plan_name}", f"{SITE_URL}/contact?plan={plan}")}

<p style="color:#999;font-size:13px;">Vous preferez en discuter d'abord ? <a href="{CALENDLY_URL}" style="color:#8b5cf6;text-decoration:none;">Reservez un appel gratuit de 30 min.</a></p>
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_diagnostic_j7(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+7 : Derniere chance + Calendly."""
    name = h(ctx.get("name", ""))
    plan = ctx.get("recommended_plan", "accelerateur")

    subject = f"{name}, derniere etape avant de passer a l'action"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Il y a une semaine, vous avez identifie que votre systeme digital a des failles. Chaque jour qui passe sans les corriger, c'est du chiffre d'affaires qui s'evapore.</p>

<p>Je ne vais pas vous resolliciter apres cet email. Mais si votre situation n'a pas change depuis votre diagnostic, voici deux options :</p>

{_section("Option 1 : Un appel de 30 min (gratuit)", '''
  <p style="color:#e0e0e0;margin:0;">On fait le point ensemble, sans engagement. Je vous dis concretement ce qui est faisable, dans quel delai, et a quel prix.</p>
''')}

{_cta_button("Reserver mon appel", CALENDLY_URL)}

{_section("Option 2 : Demarrer directement", '''
  <p style="color:#e0e0e0;margin:0;">Si vous savez deja ce dont vous avez besoin, passez directement a l'action.</p>
''')}

{_cta_button("Voir les offres", f"{SITE_URL}/go?plan={plan}")}

<p style="color:#999;font-size:13px;">C'est le dernier email de cette sequence. Vous ne recevrez plus de messages automatiques de ma part. Si vous avez des questions, repondez simplement a cet email.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


# ─── SEQUENCES POST-PURCHASE ────────────────────────────────────────────────

def post_purchase_j0(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+0 : Bienvenue + prochaines etapes."""
    name = h(ctx.get("name", ""))
    plan = h(ctx.get("plan", ""))

    subject = f"Bienvenue {name} — votre projet demarre"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bienvenue {name} !</h2>
<p>Merci pour votre confiance. Votre commande pour l'offre <strong style="color:#fff;">{plan}</strong> est confirmee.</p>

{_section("Prochaines etapes", '''
  <ol style="padding-left:20px;margin:0;color:#e0e0e0;">
    <li style="margin:8px 0;"><strong style="color:#fff;">Sous 24h</strong> : Je vous contacte pour le brief initial</li>
    <li style="margin:8px 0;"><strong style="color:#fff;">J+2</strong> : Maquette et proposition technique</li>
    <li style="margin:8px 0;"><strong style="color:#fff;">J+3</strong> : Validation du brief, debut du developpement</li>
    <li style="margin:8px 0;"><strong style="color:#fff;">J+5-10</strong> : Livraison et mise en production</li>
  </ol>
''')}

{_cta_button("Planifier le kick-off", CALENDLY_URL)}

<p style="color:#999;font-size:13px;">Un doute ? Une question ? Repondez directement a cet email ou contactez-moi sur <a href="{WHATSAPP_URL}" style="color:#25d366;text-decoration:none;">WhatsApp</a>.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_purchase_j3(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+3 : Check-in + conseil."""
    name = h(ctx.get("name", ""))

    subject = f"{name}, un conseil pour maximiser votre investissement"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Votre projet est en cours de realisation. Pendant que je travaille dessus, voici un conseil pour maximiser le retour sur investissement de votre systeme.</p>

{_section("Conseil du jour", '''
  <p style="color:#e0e0e0;margin:0;"><strong style="color:#fff;">Preparez votre contenu.</strong> Le systeme le plus performant du monde ne convertira pas si le message n'est pas clair. Profitez de cette periode pour :</p>
  <ul style="padding-left:20px;margin:12px 0 0;color:#e0e0e0;">
    <li style="margin:4px 0;">Lister vos 3 arguments de vente les plus forts</li>
    <li style="margin:4px 0;">Rassembler des temoignages clients (meme informels)</li>
    <li style="margin:4px 0;">Preparer des photos de vos realisations</li>
  </ul>
''')}

<p>Je les integrerai directement dans votre systeme pour un impact maximal des le lancement.</p>

<p style="color:#999;font-size:13px;">Des questions sur l'avancement ? Repondez a cet email.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_purchase_j7(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+7 : Demande avis/referral."""
    name = h(ctx.get("name", ""))

    subject = f"{name}, votre avis compte"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Votre projet avance bien. J'ai une petite demande.</p>

<p>Si vous etes satisfait de la collaboration jusqu'ici, un <strong style="color:#fff;">temoignage de 2-3 phrases</strong> m'aiderait enormement. Pas besoin d'un roman — juste votre impression honnete.</p>

{_section("Comment faire ?", '''
  <p style="color:#e0e0e0;margin:0;">Repondez simplement a cet email avec quelques mots sur :</p>
  <ul style="padding-left:20px;margin:12px 0 0;color:#e0e0e0;">
    <li style="margin:4px 0;">Pourquoi vous avez choisi de travailler avec moi</li>
    <li style="margin:4px 0;">Ce qui vous a marque dans la collaboration</li>
    <li style="margin:4px 0;">Si vous recommanderiez a un collegue</li>
  </ul>
''')}

<p>Et si vous connaissez un artisan ou un prestataire B2B qui gagnerait a digitaliser son activite, n'hesitez pas a partager mon site :</p>

{_cta_button("Partager aissabelkoussa.fr", SITE_URL)}

<p style="color:#999;font-size:13px;">Merci pour votre confiance. C'est le dernier email automatique — la suite, c'est du sur-mesure.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


# ─── SEQUENCES POST-TRIPWIRE ────────────────────────────────────────────────

def post_tripwire_j0(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+0 : Livraison rapport audit automatise."""
    name = h(ctx.get("name", ""))
    score = ctx.get("score", 0)
    max_score = ctx.get("max_score", 15)
    pct = round(score / max_score * 100) if max_score else 0
    answers = ctx.get("answers", {})

    # Generate audit sections from answers
    audit_sections = ""
    question_map = {
        "site": ("Presence web", "Votre site internet"),
        "rdv": ("Prise de rendez-vous", "Votre systeme de reservation"),
        "devis": ("Gestion des devis", "Votre processus de devis"),
        "relance": ("Relance commerciale", "Votre suivi des prospects"),
        "temps": ("Productivite", "Votre gestion du temps"),
    }
    for qid, (section_title, desc) in question_map.items():
        qscore = answers.get(qid, 0)
        if qscore >= 2:
            status, status_color = "Correct", "#22c55e"
            reco = "Continuez ainsi. Des optimisations mineures peuvent encore ameliorer les resultats."
        elif qscore == 1:
            status, status_color = "A ameliorer", "#f59e0b"
            reco = "Ce point merite votre attention. Des gains rapides sont possibles avec les bons outils."
        else:
            status, status_color = "Critique", "#ef4444"
            reco = "Priorite haute. Chaque jour sans correction represente une perte directe de chiffre d'affaires."

        audit_sections += f'''
<div style="background:#161616;padding:16px;border-radius:8px;margin:0 0 12px;border-left:3px solid {status_color};">
  <p style="margin:0 0 4px;"><strong style="color:#fff;">{h(section_title)}</strong> <span style="color:{status_color};font-size:13px;font-weight:600;">— {status}</span></p>
  <p style="margin:0;color:#bbb;font-size:14px;">{reco}</p>
</div>'''

    subject = f"{name}, votre rapport d'audit digital"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Merci pour votre achat. Voici votre rapport d'audit digital personnalise.</p>

<div style="text-align:center;margin:24px 0;">
  <span style="font-size:48px;font-weight:700;color:#fff;">{score}</span>
  <span style="font-size:20px;color:#666;">/ {max_score}</span>
  <p style="color:#999;margin:8px 0 0;font-size:14px;">Score global de maturite digitale : <strong style="color:#fff;">{pct}%</strong></p>
</div>

<h3 style="color:#fff;font-size:16px;margin:24px 0 16px;">Analyse detaillee par domaine</h3>
{audit_sections}

{_section("Recommandation principale", '''
  <p style="color:#e0e0e0;margin:0;">Concentrez-vous sur les points <span style="color:#ef4444;font-weight:600;">critiques</span> en priorite. Un seul point corrige peut debloquer une cascade d'ameliorations sur l'ensemble de votre systeme digital.</p>
''')}

<p>Demain, je vous enverrai des ressources supplementaires pour aller plus loin.</p>

{_cta_button("Voir les solutions adaptees", f"{SITE_URL}/go")}
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_tripwire_j1(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+1 : Valeur supplementaire du rapport."""
    name = h(ctx.get("name", ""))

    subject = f"{name}, 3 actions immediates pour ameliorer votre score"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Hier, vous avez recu votre rapport d'audit. Aujourd'hui, voici 3 actions concretes que vous pouvez faire vous-meme cette semaine :</p>

{_section("Action 1 : Verifiez votre Google Business Profile", '''
  <p style="color:#e0e0e0;margin:0;">Assurez-vous que vos horaires, adresse, et numero de telephone sont a jour. Ajoutez au moins 5 photos recentes. 84% des recherches locales consultent Google Maps en premier.</p>
''')}

{_section("Action 2 : Installez un outil de reservation en ligne", '''
  <p style="color:#e0e0e0;margin:0;">Calendly ou Cal.com (gratuit). Collez le lien dans votre signature email et votre bio LinkedIn. En 30 minutes, vous eliminez 80% des allers-retours pour planifier un RDV.</p>
''')}

{_section("Action 3 : Configurez une reponse automatique", '''
  <p style="color:#e0e0e0;margin:0;">Sur votre boite email, creez une reponse automatique pour les nouveaux messages : "Merci pour votre message, je vous recontacte sous 24h." Simple, mais ca rassure le prospect et reduit les relances.</p>
''')}

<p>Ces 3 actions prennent moins de 2 heures et ont un impact immediat.</p>

<p style="color:#999;font-size:13px;">Pour aller plus loin et automatiser tout ca, je vous enverrai une proposition dans 2 jours.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


def post_tripwire_j3(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+3 : Upsell vers offre complete."""
    name = h(ctx.get("name", ""))

    subject = f"{name}, passez de l'audit a l'action"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Vous avez votre audit. Vous connaissez vos points faibles. Maintenant, deux options :</p>

{_section("Option A : Le faire vous-meme", '''
  <p style="color:#e0e0e0;margin:0;">C'est faisable. Comptez 2-3 mois pour un systeme complet si vous avez les competences techniques. Les actions de mon email precedent sont un bon debut.</p>
''')}

{_section("Option B : C'est fait en 10 jours", f'''
  <p style="color:#e0e0e0;margin:0;">Je construis votre systeme digital complet — site, automations, dashboard — et je le livre en 5 a 10 jours ouvres. Vous n'avez rien a faire. Et les <strong style="color:#fff;">47 &euro; de votre audit sont deduits</strong> du prix final.</p>
''')}

{_cta_button("Decouvrir l'offre Accelerateur — 2 900 EUR", f"{SITE_URL}/go?plan=accelerateur")}

<p style="color:#999;font-size:13px;">C'est le dernier email de cette sequence. Si vous avez des questions, repondez directement ou <a href="{CALENDLY_URL}" style="color:#8b5cf6;text-decoration:none;">reservez un appel</a>.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


# ─── SEQUENCES LEAD MAGNET ──────────────────────────────────────────────────

def lead_magnet_j0(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+0 : Livraison du PDF."""
    name = h(ctx.get("name", ""))
    resource_title = h(ctx.get("resource_title", "votre ressource"))
    download_url = ctx.get("download_url", f"{SITE_URL}/resources/checklist-presence-digitale.html")

    subject = f"{name}, votre {resource_title} est prete"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Merci pour votre interet. Voici votre ressource :</p>

{_cta_button(f"Telecharger : {resource_title}", download_url, "#000", "#fff")}

<p>Prenez 10 minutes pour la parcourir. Demain, je vous enverrai un complement pratique pour aller plus loin.</p>

<p style="color:#999;font-size:13px;">Si vous avez des questions, repondez simplement a cet email.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


def lead_magnet_j1(ctx: dict, unsub_url: str) -> tuple[str, str]:
    """J+1 : Follow-up contenu lie."""
    name = h(ctx.get("name", ""))

    subject = f"{name}, et si vous testiez votre score digital ?"

    body = f'''
<h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Bonjour {name},</h2>
<p>Vous avez telecharge la checklist hier. Maintenant, passez a l'action avec un diagnostic personnalise de votre situation.</p>

<p>En 2 minutes et 5 questions, vous saurez exactement ou vous en etes — et quels points corriger en priorite.</p>

{_cta_button("Faire mon diagnostic gratuit", f"{SITE_URL}/diagnostic")}

<p style="color:#999;font-size:13px;">C'est gratuit, sans engagement, et le resultat est immediat.</p>
'''
    return subject, _branded_email(subject, body, unsub_url)


# ─── Registre des templates ─────────────────────────────────────────────────

TEMPLATE_REGISTRY: dict[str, callable] = {
    "post_diagnostic_j0": post_diagnostic_j0,
    "post_diagnostic_j1": post_diagnostic_j1,
    "post_diagnostic_j3": post_diagnostic_j3,
    "post_diagnostic_j5": post_diagnostic_j5,
    "post_diagnostic_j7": post_diagnostic_j7,
    "post_purchase_j0": post_purchase_j0,
    "post_purchase_j3": post_purchase_j3,
    "post_purchase_j7": post_purchase_j7,
    "post_tripwire_j0": post_tripwire_j0,
    "post_tripwire_j1": post_tripwire_j1,
    "post_tripwire_j3": post_tripwire_j3,
    "lead_magnet_j0": lead_magnet_j0,
    "lead_magnet_j1": lead_magnet_j1,
}


def render_sequence_email(template_key: str, context: dict, unsubscribe_url: str) -> tuple[str, str]:
    """Render un template de sequence. Retourne (subject, html)."""
    fn = TEMPLATE_REGISTRY.get(template_key)
    if not fn:
        raise ValueError(f"Template inconnu : {template_key}")
    return fn(context, unsubscribe_url)
