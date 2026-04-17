import React from 'react';

export default function Figure({ src, alt, caption }) {
  if (!src) return null;
  return (
    <figure className="docs-figure">
      <img src={src} alt={alt || ''} loading="lazy" />
      {caption && caption.trim() && (
        <figcaption dangerouslySetInnerHTML={{ __html: caption }} />
      )}
    </figure>
  );
}
