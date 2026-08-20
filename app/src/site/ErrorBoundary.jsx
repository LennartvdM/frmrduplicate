import React from 'react';

// The route tree renders inside a full-viewport position:fixed layer
// (RouteSlider), so an uncaught render error used to blank the whole
// site with no message and no way out. This boundary keeps the navbar
// alive and gives the visitor a reload button instead.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // No analytics on this site; the console is the only report channel.
    console.error('[neoflix] render error:', error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '96px 24px',
          textAlign: 'center',
          background: '#f4f7f7',
          color: '#14282c',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ margin: 0, maxWidth: '46ch', color: '#55706f' }}>
          The page hit an error while rendering. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: '8px',
            padding: '10px 22px',
            borderRadius: '999px',
            border: 'none',
            background: '#14797d',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Reload the page
        </button>
      </div>
    );
  }
}
