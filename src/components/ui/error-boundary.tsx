import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <pre style={{ color: "red", whiteSpace: "pre-wrap", maxWidth: 600, margin: "20px auto", textAlign: "left" }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "8px 16px" }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
