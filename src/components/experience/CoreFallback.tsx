import { Component, type ReactNode } from "react";
export function CoreFallback() {
  return (
    <div className="rq-core-fallback" aria-hidden="true">
      <div className="rq-fallback-orbit" />
      <div className="rq-fallback-orbit rq-fallback-orbit-two" />
      <div className="rq-fallback-crystal">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

export class CoreBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <CoreFallback /> : this.props.children;
  }
}
