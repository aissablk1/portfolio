# Secret Rotation Process

## Principe

Tous les secrets sensibles du système email doivent être rotés :
- Annuellement en prévention
- Immédiatement en cas de suspicion de fuite

## `RESEND_API_KEY`

1. Créer une nouvelle clé dans Resend Dashboard → API Keys
2. Mettre à jour la var d'env sur Vercel (`vercel env rm RESEND_API_KEY production` puis `vercel env add`)
3. Redéployer (`vercel --prod` ou push commit)
4. Vérifier dans les logs qu'un email passe
5. Supprimer l'ancienne clé dans Resend Dashboard

**Downtime :** quelques secondes (redeploy).

## `NEWSLETTER_UNSUBSCRIBE_SECRET`

Attention — **casse les liens de désinscription déjà envoyés.** Les anciens tokens HMAC ne valideront plus.

Procédure sans downtime (nécessite refactor préalable — voir `email-system-deferred.md`) :
1. Ajouter `NEWSLETTER_UNSUBSCRIBE_SECRET_NEXT` avec nouveau secret
2. Modifier `verifyUnsubscribeToken` pour accepter les 2 clés
3. Déployer
4. Attendre 72h (durée de vie des emails envoyés avec l'ancien token)
5. Promouvoir `_NEXT` en `NEWSLETTER_UNSUBSCRIBE_SECRET`, supprimer `_NEXT`
6. Redéployer

Procédure rapide (accepte le break) :
1. Remplacer la var d'env Vercel
2. Redéployer
3. Les users qui cliquent sur un vieux lien voient « lien invalide », doivent refaire `mailto:contact@aissabelkoussa.fr?subject=Unsubscribe`

## `RESEND_WEBHOOK_SECRET`

1. Regénérer dans Resend Dashboard → Webhooks → (Edit)
2. Copier le nouveau `whsec_...`
3. Mettre à jour la var d'env Vercel
4. Redéployer

**Downtime :** pendant le deploy, les webhooks Resend échoueront (401 invalid signature). Resend retry automatiquement.

## `TELEGRAM_BOT_TOKEN`

1. `/revoke` dans BotFather
2. Nouveau token
3. Mettre à jour la var d'env
4. Redéployer

## Checklist rotation annuelle

- [ ] `RESEND_API_KEY` : dernière rotation le ____
- [ ] `NEWSLETTER_UNSUBSCRIBE_SECRET` : dernière rotation le ____
- [ ] `RESEND_WEBHOOK_SECRET` : dernière rotation le ____
- [ ] `TELEGRAM_BOT_TOKEN` : dernière rotation le ____

Prochaine rotation prévue : 2027-04-11.
