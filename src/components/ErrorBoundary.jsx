import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          maxWidth: '600px',
          margin: '2rem auto',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          fontFamily: 'sans-serif',
          color: '#333' // Force text color
        }}>
          <h2 style={{ color: '#ef4444', margin: '0 0 1rem 0' }}>系統發生錯誤</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>很抱歉，應用程式發生了預期外的問題。</p>

          <div style={{ background: '#bee3f8', padding: '10px', borderRadius: '4px', marginBottom: '10px', color: '#2c5282' }}>
            <strong>Error:</strong> {this.state.error?.message || 'Unknown Error'}
          </div>

          <pre style={{
            background: '#f3f4f6',
            padding: '1rem',
            borderRadius: '4px',
            overflowX: 'auto',
            fontSize: '0.85rem',
            color: '#333',
            textAlign: 'left'
          }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#059669',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新整理頁面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
