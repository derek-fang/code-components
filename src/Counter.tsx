import * as React from 'react';
import { useSharedCounter } from './hooks/useSharedCounter';

interface CounterProps {
  label: string;
  step: number;
}

export const Counter = ({ label, step }: CounterProps) => {
  const { count, increment, decrement } = useSharedCounter();

  const buttonStyle: React.CSSProperties = {
    alignItems: 'center',
    backgroundColor: 'var(--colors--primary-accent)',
    border: 'none',
    borderRadius: 'var(--_components---button--border-radius)',
    color: 'var(--button--primary-text)',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'var(--_components---button--font)',
    fontSize: 'var(--_components---button--font-size)',
    fontWeight: 'var(--_components---button--font-weight)',
    height: '2.5em',
    justifyContent: 'center',
    lineHeight: 'var(--_components---button--line-height)',
    width: '2.5em',
  };

  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: 'var(--colors--secondary-background)',
        borderRadius: 'var(--_border-radius---global--radius)',
        color: 'var(--colors--heading)',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 'var(--_layout---grid--gap-md)',
        padding: 'var(--_components---card--padding)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--_typography---eyebrow--font)',
          fontSize: 'var(--_typography---eyebrow--font-size)',
          fontWeight: 'var(--_typography---eyebrow--font-weight)',
          letterSpacing: 'var(--_typography---eyebrow--letter-spacing)',
          lineHeight: 'var(--_typography---eyebrow--line-height)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 'var(--_layout---grid--gap-md)',
        }}
      >
        <button
          aria-label="Decrement"
          onClick={() => decrement(step)}
          style={buttonStyle}
          type="button"
        >
          −
        </button>
        <span
          style={{
            fontFamily: 'var(--_typography---h3--font)',
            fontSize: 'var(--_typography---h3--font-size)',
            fontWeight: 'var(--_typography---h3--font-weight)',
            letterSpacing: 'var(--_typography---h3--letter-spacing)',
            lineHeight: 'var(--_typography---h3--line-height)',
            minWidth: '2ch',
            textAlign: 'center',
          }}
        >
          {count}
        </span>
        <button
          aria-label="Increment"
          onClick={() => increment(step)}
          style={buttonStyle}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
};
