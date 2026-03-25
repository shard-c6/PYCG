'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-[var(--bg)] text-[var(--error)] p-6 text-center">
          <div className="bg-[var(--surface-1)] p-8 rounded-2xl border border-[var(--error)]/20 shadow-lg">
            <h2 className="text-xl font-medium tracking-wide mb-2">System Interruption</h2>
            <p className="text-sm text-[var(--text-muted)]">Unable to initialize the global ledger interface.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
