import { Component, type ErrorInfo, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Page rendering failed', error.name, info.componentStack); }
  render() {
    if (this.state.failed) return <main className="mx-auto max-w-xl p-12"><h1 className="text-2xl font-bold">This page could not be displayed</h1><p className="my-4">Your changes may not have been saved. Reload to try again.</p><button onClick={() => location.reload()} className="rounded bg-red-950 px-6 py-3 text-white">Reload page</button></main>;
    return this.props.children;
  }
}
