import * as React from "react";

interface TravelCalculatorProps {
  title: string;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  defaultStyle: "Budget" | "Mid-Range" | "Luxury";
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "CA$",
  AUD: "A$",
};

const DAILY_RATES: Record<string, Record<string, number>> = {
  Budget: { Accommodation: 30, Food: 20, Transport: 15, Activities: 10 },
  "Mid-Range": { Accommodation: 80, Food: 45, Transport: 30, Activities: 25 },
  Luxury: { Accommodation: 200, Food: 100, Transport: 60, Activities: 60 },
};

const STYLE_DESCRIPTIONS: Record<string, string> = {
  Budget: "Hostels, street food & buses",
  "Mid-Range": "Hotels, restaurants & trains",
  Luxury: "Resorts, fine dining & flights",
};

const CATEGORY_ICONS: Record<string, string> = {
  Accommodation: "🏨",
  Food: "🍽️",
  Transport: "🚌",
  Activities: "🎭",
};

function Stepper({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const btnBase: React.CSSProperties = {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    border: `1px solid var(--colors--border)`,
    background: "var(--colors--secondary-background)",
    color: "var(--colors--heading)",
    fontSize: "1.1rem",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    lineHeight: 1,
    transition: "background 0.15s, border-color 0.15s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span
        style={{
          fontSize: "var(--_typography---eyebrow--font-size, 0.75rem)",
          fontWeight: "var(--_typography---eyebrow--font-weight, 500)",
          letterSpacing: "var(--_typography---eyebrow--letter-spacing, 0.05em)",
          color: "var(--colors--paragraph)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          style={btnBase}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          −
        </button>
        <div
          style={{
            minWidth: "3.5rem",
            textAlign: "center",
            fontSize: "var(--_typography---h4--font-size, 1.4rem)",
            fontWeight: "var(--_typography---h4--font-weight, 500)",
            color: "var(--colors--heading)",
            lineHeight: 1.2,
          }}
        >
          {value}
          <span
            style={{
              display: "block",
              fontSize: "0.7rem",
              fontWeight: 400,
              color: "var(--colors--paragraph)",
              marginTop: "0.1rem",
            }}
          >
            {unit}
          </span>
        </div>
        <button
          style={btnBase}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export const TravelCalculator = ({
  title,
  currency,
  defaultStyle,
}: TravelCalculatorProps) => {
  const [travelers, setTravelers] = React.useState(2);
  const [days, setDays] = React.useState(7);
  const [style, setStyle] =
    React.useState<keyof typeof DAILY_RATES>(defaultStyle);

  const sym = CURRENCY_SYMBOLS[currency] ?? "$";
  const rates = DAILY_RATES[style];
  const categories = Object.keys(rates) as (keyof typeof rates)[];
  const perPersonTotal = categories.reduce(
    (sum, cat) => sum + rates[cat] * days,
    0
  );
  const grandTotal = perPersonTotal * travelers;

  const fmt = (n: number) =>
    sym + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  return (
    <div
      style={{
        background: "var(--colors--background)",
        borderRadius: "var(--_components---card--border-radius, 1.5rem)",
        border: "1px solid var(--colors--border)",
        padding: "var(--_components---card--padding, 1.5rem)",
        fontFamily: "var(--_typography---fonts--primary-font, Inter), sans-serif",
        maxWidth: "28rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "var(--_typography---h3--font-size, 1.8rem)",
            fontWeight: "var(--_typography---h3--font-weight, 500)",
            lineHeight: "var(--_typography---h3--line-height, 1.2)",
            letterSpacing: "var(--_typography---h3--letter-spacing, -0.02em)",
            color: "var(--colors--heading)",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Steppers */}
      <div
        style={{
          display: "flex",
          gap: "var(--_layout---grid--gap-main, 2.5rem)",
          marginBottom: "1.5rem",
        }}
      >
        <Stepper
          label="Travelers"
          value={travelers}
          min={1}
          max={12}
          unit="people"
          onChange={setTravelers}
        />
        <Stepper
          label="Duration"
          value={days}
          min={1}
          max={60}
          unit="days"
          onChange={setDays}
        />
      </div>

      {/* Travel style selector */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            display: "block",
            fontSize: "var(--_typography---eyebrow--font-size, 0.75rem)",
            fontWeight: "var(--_typography---eyebrow--font-weight, 500)",
            letterSpacing: "0.05em",
            color: "var(--colors--paragraph)",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}
        >
          Travel Style
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["Budget", "Mid-Range", "Luxury"] as const).map((s) => {
            const active = style === s;
            return (
              <button
                key={s}
                onClick={() => setStyle(s)}
                style={{
                  flex: 1,
                  padding: "0.5rem 0.25rem",
                  borderRadius: "calc(var(--_border-radius---global--radius, 1.5rem) / 2)",
                  border: `1px solid ${active ? "var(--colors--primary-accent)" : "var(--colors--border)"}`,
                  background: active
                    ? "var(--colors--primary-accent)"
                    : "var(--colors--secondary-background)",
                  color: active
                    ? "var(--button--primary-text, white)"
                    : "var(--colors--paragraph)",
                  fontSize: "0.78rem",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
        <p
          style={{
            margin: "0.4rem 0 0",
            fontSize: "0.78rem",
            color: "var(--colors--paragraph)",
          }}
        >
          {STYLE_DESCRIPTIONS[style]}
        </p>
      </div>

      {/* Cost breakdown */}
      <div
        style={{
          background: "var(--colors--secondary-background)",
          borderRadius: "calc(var(--_border-radius---global--radius, 1.5rem) / 2)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: "var(--colors--paragraph)",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          Per person · {days} day{days !== 1 ? "s" : ""}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {categories.map((cat) => {
            const amount = rates[cat] * days;
            const barPct = Math.round((amount / perPersonTotal) * 100);
            return (
              <div key={cat}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.2rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--colors--paragraph)",
                    }}
                  >
                    {CATEGORY_ICONS[cat]} {cat}
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "var(--colors--heading)",
                    }}
                  >
                    {fmt(amount)}
                  </span>
                </div>
                <div
                  style={{
                    height: "4px",
                    borderRadius: "2px",
                    background: "var(--colors--border)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${barPct}%`,
                      background: "var(--colors--primary-accent)",
                      borderRadius: "2px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div
        style={{
          borderTop: "1px solid var(--colors--border)",
          paddingTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.78rem",
              color: "var(--colors--paragraph)",
              marginBottom: "0.15rem",
            }}
          >
            Estimated total
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--colors--paragraph)",
              opacity: 0.75,
            }}
          >
            {travelers} traveler{travelers !== 1 ? "s" : ""} × {days} day
            {days !== 1 ? "s" : ""}
          </div>
        </div>
        <div
          style={{
            fontSize: "var(--_typography---h2--font-size, 2.8rem)",
            fontWeight: "var(--_typography---h2--font-weight, 500)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: "var(--colors--primary-accent)",
          }}
        >
          {fmt(grandTotal)}
        </div>
      </div>
    </div>
  );
};
