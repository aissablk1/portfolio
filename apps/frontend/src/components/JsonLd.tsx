/**
 * JsonLd — Composant reutilisable pour injecter des donnees structurees Schema.org
 *
 * Securite : le contenu est exclusivement genere cote serveur a partir de
 * constantes statiques definies dans @/lib/schemas. Aucune donnee utilisateur
 * n'est interpolee — pas de risque XSS.
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
