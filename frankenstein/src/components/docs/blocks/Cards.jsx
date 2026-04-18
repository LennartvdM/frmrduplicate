import React from 'react';
import useTransitionNavigate from '../../../hooks/useTransitionNavigate';
import { assetUrl } from '../../../utils/assetUrl';

// GitBook cards view. Each card has a link target + HTML body (title + desc).
export default function Cards({ cards }) {
  if (!cards || !cards.length) return null;
  return (
    <div className="docs-cards">
      {cards.map((card, i) => (
        <Card key={i} card={card} />
      ))}
    </div>
  );
}

function Card({ card }) {
  const transitionNavigate = useTransitionNavigate();
  const isInternal = (card.href || '').startsWith('/toolbox/');
  const onClick = (e) => {
    if (!isInternal) return;
    e.preventDefault();
    transitionNavigate(card.href);
  };
  return (
    <a
      href={card.href || '#'}
      onClick={onClick}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className="docs-card"
    >
      {card.src && <img src={assetUrl(card.src)} alt={card.alt || ''} className="docs-card-img" />}
      <div className="docs-card-body" dangerouslySetInnerHTML={{ __html: card.body }} />
    </a>
  );
}
