import React from 'react';
import { assetUrl } from '../../../utils/assetUrl';

export default function Figure({ src, alt, caption }) {
  if (!src) return null;
  return (
    <figure className="docs-figure">
      <img src={assetUrl(src)} alt={alt || ''} loading="lazy" />
      {caption && caption.trim() && (
        <figcaption dangerouslySetInnerHTML={{ __html: caption }} />
      )}
    </figure>
  );
}
