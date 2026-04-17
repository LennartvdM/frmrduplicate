import React from 'react';
import useViewTransition from '../../hooks/useViewTransition';

export default function DocsLink({ href, internal, external, children }) {
  const transitionNavigate = useViewTransition();
  if (internal) {
    return (
      <a
        href={href}
        data-internal="true"
        onClick={(e) => {
          e.preventDefault();
          transitionNavigate(href);
        }}
      >
        {children}
      </a>
    );
  }
  if (external || /^https?:/i.test(href || '')) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <a href={href}>{children}</a>;
}
