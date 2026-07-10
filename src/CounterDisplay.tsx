import * as React from 'react';
import { useSharedCounter } from './hooks/useSharedCounter';

interface CounterDisplayProps {
  label: string;
  variant: 'Light' | 'Dark';
}

export const CounterDisplay = ({ label, variant }: CounterDisplayProps) => {
  const { count } = useSharedCounter();

  const isDark = variant === 'Dark';

  return (
    <span
      style={{
        alignItems: 'baseline',
        backgroundColor: isDark
          ? 'var(--colors--heading)'
          : 'var(--colors--secondary-background)',
        borderRadius: 'var(--_border-radius---global--radius)',
        color: isDark ? 'var(--colors--background)' : 'var(--colors--heading)',
        display: 'inline-flex',
        fontFamily: 'var(--_typography---paragraph-body--font)',
        fontSize: 'var(--_typography---paragraph-body--font-size)',
        fontWeight: 'var(--_typography---paragraph-body--font-weight)',
        gap: 'var(--_layout---grid--gap-sm)',
        lineHeight: 'var(--_typography---paragraph-body--line-height)',
        padding:
          'var(--_layout---spacing--padding-xs) var(--_layout---spacing--padding-sm)',
      }}
    >
      <span>{label}</span>
      <span
        style={{
          color: isDark
            ? 'var(--colors--background)'
            : 'var(--colors--primary-accent)',
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    </span>
  );
};
