import * as React from "react";

interface SavingsCalculatorProps {
  title: string;
  subtitle: string;
  currency: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  defaultTrips: number;
  defaultSpend: number;
  defaultPlan: "Free" | "Pro";
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "CA$",
  AUD: "A$",
};

// Savings model — how TripFold saves travelers money vs. booking the old way.
const PLANS = {
  Free: {
    discountRate: 0.08, // member rates on flights & stays
    feePerTrip: 25, // booking fees TripFold waives
    annualCost: 0, // subscription price
    blurb: "Member rates + zero booking fees",
  },
  Pro: {
    discountRate: 0.15,
    feePerTrip: 25,
    annualCost: 99,
    blurb: "Best rates, priority deals & free changes",
  },
} as const;

type PlanKey = keyof typeof PLANS;

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

const SPEND_MIN = 500;
const SPEND_MAX = 12000;
const SPEND_STEP = 250;

export const SavingsCalculator = ({
  title,
  subtitle,
  currency,
  defaultTrips,
  defaultSpend,
  defaultPlan,
}: SavingsCalculatorProps) => {
  const clamp = (n: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, n));

  const [trips, setTrips] = React.useState(
    clamp(Math.round(defaultTrips) || 3, 1, 24)
  );
  const [spend, setSpend] = React.useState(
    clamp(defaultSpend || 2500, SPEND_MIN, SPEND_MAX)
  );
  const [plan, setPlan] = React.useState<PlanKey>(defaultPlan);

  const sym = CURRENCY_SYMBOLS[currency] ?? "$";
  const fmt = (n: number) =>
    sym +
    Math.round(n).toLocaleString("en-US", { maximumFractionDigits: 0 });

  const { discountRate, feePerTrip, annualCost, blurb } = PLANS[plan];

  const annualSpend = spend * trips;
  const rateSavings = annualSpend * discountRate;
  const feeSavings = feePerTrip * trips;
  const grossSavings = rateSavings + feeSavings;
  const netSavings = Math.max(0, grossSavings - annualCost);
  const pctOfSpend =
    annualSpend > 0 ? Math.round((netSavings / annualSpend) * 100) : 0;

  const sliderPct =
    ((spend - SPEND_MIN) / (SPEND_MAX - SPEND_MIN)) * 100;

  const breakdown = [
    { label: "Member-rate savings", value: rateSavings, icon: "✈️" },
    { label: "Booking fees waived", value: feeSavings, icon: "🏷️" },
  ];
  if (annualCost > 0) {
    breakdown.push({
      label: "TripFold Pro plan",
      value: -annualCost,
      icon: "⭐",
    });
  }
  const maxBar = Math.max(...breakdown.map((b) => Math.abs(b.value)), 1);

  return (
    <div
      style={{
        background: "var(--colors--background)",
        borderRadius: "var(--_components---card--border-radius, 1.5rem)",
        border: "1px solid var(--colors--border)",
        padding: "var(--_components---card--padding, 1.5rem)",
        fontFamily:
          "var(--_typography---fonts--primary-font, Inter), sans-serif",
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
            letterSpacing: "var(--_typography---h3--letter-spacing, 0)",
            color: "var(--colors--heading)",
          }}
        >
          {title}
        </h3>
        {subtitle ? (
          <p
            style={{
              margin: "0.4rem 0 0",
              fontSize: "var(--_typography---paragraph-sm--font-size, 0.85rem)",
              color: "var(--colors--paragraph)",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Trips stepper */}
      <div style={{ marginBottom: "1.25rem" }}>
        <Stepper
          label="Trips per year"
          value={trips}
          min={1}
          max={24}
          unit={trips === 1 ? "trip" : "trips"}
          onChange={setTrips}
        />
      </div>

      {/* Spend slider */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              fontSize: "var(--_typography---eyebrow--font-size, 0.75rem)",
              fontWeight: "var(--_typography---eyebrow--font-weight, 500)",
              letterSpacing: "0.05em",
              color: "var(--colors--paragraph)",
              textTransform: "uppercase",
            }}
          >
            Average spend per trip
          </span>
          <span
            style={{
              fontSize: "var(--_typography---h5--font-size, 1.1rem)",
              fontWeight: 600,
              color: "var(--colors--heading)",
            }}
          >
            {fmt(spend)}
            {spend >= SPEND_MAX ? "+" : ""}
          </span>
        </div>
        <input
          type="range"
          min={SPEND_MIN}
          max={SPEND_MAX}
          step={SPEND_STEP}
          value={spend}
          onChange={(e) => setSpend(Number(e.target.value))}
          aria-label="Average spend per trip"
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "3px",
            appearance: "none",
            WebkitAppearance: "none",
            cursor: "pointer",
            background: `linear-gradient(to right, var(--colors--primary-accent) 0%, var(--colors--primary-accent) ${sliderPct}%, var(--colors--border) ${sliderPct}%, var(--colors--border) 100%)`,
            outline: "none",
          }}
        />
      </div>

      {/* Plan toggle */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            display: "block",
            fontSize: "var(--_typography---eyebrow--font-size, 0.75rem)",
            fontWeight: 500,
            letterSpacing: "0.05em",
            color: "var(--colors--paragraph)",
            textTransform: "uppercase",
            marginBottom: "0.6rem",
          }}
        >
          Your plan
        </span>
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            padding: "0.3rem",
            background: "var(--colors--secondary-background)",
            borderRadius:
              "calc(var(--_border-radius---global--radius, 1.5rem) / 2)",
          }}
        >
          {(["Free", "Pro"] as const).map((p) => {
            const active = plan === p;
            return (
              <button
                key={p}
                onClick={() => setPlan(p)}
                style={{
                  flex: 1,
                  padding: "0.5rem 0.25rem",
                  borderRadius:
                    "calc(var(--_border-radius---global--radius, 1.5rem) / 2.5)",
                  border: "none",
                  background: active
                    ? "var(--colors--primary-accent)"
                    : "transparent",
                  color: active
                    ? "var(--button--primary-text, white)"
                    : "var(--colors--paragraph)",
                  fontSize: "0.85rem",
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                }}
              >
                {p === "Pro" ? "Pro ⭐" : p}
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
          {blurb}
        </p>
      </div>

      {/* Savings breakdown */}
      <div
        style={{
          background: "var(--colors--secondary-background)",
          borderRadius:
            "calc(var(--_border-radius---global--radius, 1.5rem) / 2)",
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
          Where it adds up
        </span>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          {breakdown.map((b) => {
            const negative = b.value < 0;
            const barPct = Math.round((Math.abs(b.value) / maxBar) * 100);
            return (
              <div key={b.label}>
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
                    {b.icon} {b.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: negative
                        ? "var(--colors--paragraph)"
                        : "var(--colors--heading)",
                    }}
                  >
                    {negative ? "−" : "+"}
                    {fmt(Math.abs(b.value))}
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
                      background: negative
                        ? "var(--colors--border)"
                        : "var(--colors--primary-accent)",
                      opacity: negative ? 0.6 : 1,
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

      {/* Net savings total */}
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
            You'd save per year
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "var(--colors--paragraph)",
              opacity: 0.75,
            }}
          >
            ≈ {pctOfSpend}% of {fmt(annualSpend)} in travel
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
          {fmt(netSavings)}
        </div>
      </div>
    </div>
  );
};
