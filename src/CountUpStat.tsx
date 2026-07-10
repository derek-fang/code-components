import * as React from 'react';

interface CountUpStatProps {
  targetValue: number;
  duration: number;
  prefix: string;
  suffix: string;
  label: string;
  buttonLabel: string;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export const CountUpStat = ({
  targetValue,
  duration,
  prefix,
  suffix,
  label,
  buttonLabel,
}: CountUpStatProps) => {
  const [displayed, setDisplayed] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const rafRef = React.useRef<number | null>(null);
  const startRef = React.useRef<number | null>(null);

  const startAnimation = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    setRunning(true);

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayed(Math.round(easeOutQuart(progress) * targetValue));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setRunning(false);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 'var(--_layout---grid--gap-md)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          color: 'var(--colors--heading)',
          fontFamily: 'var(--_typography---h0--font)',
          fontSize: 'var(--_typography---h0--font-size)',
          fontWeight: 'var(--_typography---h0--font-weight)',
          letterSpacing: 'var(--_typography---h0--letter-spacing)',
          lineHeight: 'var(--_typography---h0--line-height)',
        }}
      >
        {prefix}
        {displayed.toLocaleString()}
        {suffix}
      </div>

      {label ? (
        <span
          style={{
            color: 'var(--colors--paragraph)',
            fontFamily: 'var(--_typography---paragraph-lg--font)',
            fontSize: 'var(--_typography---paragraph-lg--font-size)',
            fontWeight: 'var(--_typography---paragraph-lg--font-weight)',
            lineHeight: 'var(--_typography---paragraph-lg--line-height)',
          }}
        >
          {label}
        </span>
      ) : null}

      <button
        disabled={running}
        onClick={startAnimation}
        style={{
          backgroundColor: running
            ? 'var(--colors--border)'
            : 'var(--colors--primary-accent)',
          border: 'none',
          borderRadius: 'var(--_components---button--border-radius)',
          color: 'var(--button--primary-text)',
          cursor: running ? 'default' : 'pointer',
          fontFamily: 'var(--_components---button--font)',
          fontSize: 'var(--_components---button--font-size)',
          fontWeight: 'var(--_components---button--font-weight)',
          lineHeight: 'var(--_components---button--line-height)',
          paddingBlock: 'var(--_components---button--vertical-padding)',
          paddingInline: 'var(--_components---button--horizontal-padding)',
          transition: 'background-color 0.2s',
        }}
        type="button"
      >
        {buttonLabel}
      </button>
    </div>
  );
};
