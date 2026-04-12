/**
 * JsonLd — Composant réutilisable pour injecter des données structurées Schema.org
 *
 * Sécurité : le contenu est exclusivement généré côté serveur à partir de
 * constantes statiques définies dans @/lib/schemas. Aucune donnée utilisateur
 * n'est interpolée — pas de risque XSS.
 *
 * Usage :
 *   <JsonLd data={personSchema} />
 *   <JsonLd data={[schema1, schema2]} />
 */

import React from "react";

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

interface JsonLdProps {
  data: JsonLdData;
}

export default function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
