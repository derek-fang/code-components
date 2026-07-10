import * as React from "react";

interface Airport {
  code: string;
  name: string;
  lat: number;
  lon: number;
}

const AIRPORTS: Airport[] = [
  { code: "JFK", name: "New York (JFK)", lat: 40.64, lon: -73.78 },
  { code: "LAX", name: "Los Angeles (LAX)", lat: 33.94, lon: -118.41 },
  { code: "LHR", name: "London (LHR)", lat: 51.48, lon: -0.45 },
  { code: "CDG", name: "Paris (CDG)", lat: 49.01, lon: 2.55 },
  { code: "FRA", name: "Frankfurt (FRA)", lat: 50.03, lon: 8.57 },
  { code: "AMS", name: "Amsterdam (AMS)", lat: 52.31, lon: 4.76 },
  { code: "DXB", name: "Dubai (DXB)", lat: 25.25, lon: 55.36 },
  { code: "SIN", name: "Singapore (SIN)", lat: 1.36, lon: 103.99 },
  { code: "NRT", name: "Tokyo (NRT)", lat: 35.77, lon: 140.39 },
  { code: "HKG", name: "Hong Kong (HKG)", lat: 22.31, lon: 113.92 },
  { code: "SYD", name: "Sydney (SYD)", lat: -33.95, lon: 151.18 },
  { code: "GRU", name: "São Paulo (GRU)", lat: -23.43, lon: -46.47 },
  { code: "JNB", name: "Johannesburg (JNB)", lat: -26.13, lon: 28.24 },
  { code: "CPT", name: "Cape Town (CPT)", lat: -33.96, lon: 18.6 },
  { code: "NBO", name: "Nairobi (NBO)", lat: -1.32, lon: 36.93 },
  { code: "MEX", name: "Mexico City (MEX)", lat: 19.44, lon: -99.07 },
  { code: "YYZ", name: "Toronto (YYZ)", lat: 43.68, lon: -79.63 },
  { code: "ORD", name: "Chicago (ORD)", lat: 41.97, lon: -87.91 },
  { code: "MIA", name: "Miami (MIA)", lat: 25.79, lon: -80.29 },
  { code: "SFO", name: "San Francisco (SFO)", lat: 37.62, lon: -122.38 },
  { code: "BOM", name: "Mumbai (BOM)", lat: 19.09, lon: 72.87 },
  { code: "BKK", name: "Bangkok (BKK)", lat: 13.69, lon: 100.75 },
  { code: "ICN", name: "Seoul (ICN)", lat: 37.46, lon: 126.44 },
  { code: "DEL", name: "Delhi (DEL)", lat: 28.57, lon: 77.1 },
];

const MAP_W = 800;
const MAP_H = 380;

function lonToX(lon: number): number {
  return ((lon + 180) / 360) * MAP_W;
}

function latToY(lat: number): number {
  return ((90 - lat) / 180) * MAP_H;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getArcPath(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string {
  const x1 = lonToX(lon1);
  const y1 = latToY(lat1);
  const x2 = lonToX(lon2);
  const y2 = latToY(lat2);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.sqrt(dx * dx + dy * dy);
  const arcHeight = Math.min(d * 0.28, 80);
  // offset control point upward (toward poles looks natural for flight arcs)
  const nx = d > 0 ? -dy / d : 0;
  const ny = d > 0 ? dx / d : 1;
  const cpx = mx + nx * arcHeight;
  const cpy = my + ny * arcHeight - arcHeight * 0.4;
  return `M ${x1.toFixed(1)},${y1.toFixed(1)} Q ${cpx.toFixed(1)},${cpy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}

// Simplified continent outlines as polygon point strings for SVG
// Equirectangular projection: x = (lon+180)/360*800, y = (90-lat)/180*380
const CONTINENT_POLYGONS = [
  // North America
  "27,51 56,40 200,36 244,49 278,78 260,99 222,137 204,156 218,171 184,150 156,141 124,112 124,97 100,70 40,68",
  // South America
  "229,171 260,167 289,177 322,207 304,239 280,262 251,306 233,296 244,228 229,198",
  // Europe
  "380,108 433,40 462,42 522,53 489,89 458,106 449,112 436,110 389,114",
  // Africa
  "387,114 420,112 476,127 513,167 491,192 480,245 460,264 440,264 427,236 404,182 362,163",
  // Asia (includes Arabian Peninsula, India outline)
  "480,112 500,101 533,74 578,53 711,53 713,97 669,144 640,160 629,186 578,173 569,173 537,139 531,144 498,165 484,139",
  // Australia
  "653,236 693,215 722,226 736,262 722,270 656,264",
  // Greenland
  "284,63 302,63 360,42 356,15 300,15 280,32",
];

interface FlightCarbonMapProps {
  title: string;
  subtitle: string;
  defaultOrigin: string;
  defaultDestination: string;
}

export const FlightCarbonMap = ({
  title,
  subtitle,
  defaultOrigin,
  defaultDestination,
}: FlightCarbonMapProps) => {
  const resolveCode = (code: string, fallback: string) =>
    AIRPORTS.find((a) => a.code === code) ? code : fallback;

  const [origin, setOrigin] = React.useState(() =>
    resolveCode(defaultOrigin, "JFK")
  );
  const [destination, setDestination] = React.useState(() =>
    resolveCode(defaultDestination, "LHR")
  );
  const [dashOffset, setDashOffset] = React.useState(2000);
  const [dashLength, setDashLength] = React.useState(2000);
  const pathRef = React.useRef<SVGPathElement>(null);
  const animRef = React.useRef<number>(0);

  // Sync with Designer prop changes
  React.useEffect(() => {
    const code = resolveCode(defaultOrigin, "JFK");
    setOrigin(code);
  }, [defaultOrigin]);

  React.useEffect(() => {
    const code = resolveCode(defaultDestination, "LHR");
    setDestination(code);
  }, [defaultDestination]);

  // Animate arc whenever route changes
  React.useEffect(() => {
    cancelAnimationFrame(animRef.current);
    const timer = setTimeout(() => {
      if (!pathRef.current) return;
      const len = pathRef.current.getTotalLength() || 1200;
      setDashLength(len);
      setDashOffset(len);
      let start = 0;
      const duration = 1400;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const t = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setDashOffset(len * (1 - ease));
        if (t < 1) animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    }, 60);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animRef.current);
    };
  }, [origin, destination]);

  const originAirport = AIRPORTS.find((a) => a.code === origin)!;
  const destAirport = AIRPORTS.find((a) => a.code === destination)!;
  const sameAirport = origin === destination;

  const distKm = sameAirport
    ? 0
    : haversineKm(
        originAirport.lat,
        originAirport.lon,
        destAirport.lat,
        destAirport.lon
      );

  // DEFRA methodology: 0.255 kg CO₂e/km economy class (includes radiative forcing)
  const co2Kg = distKm * 0.255;
  const trees = co2Kg > 0 ? Math.ceil(co2Kg / 21) : 0; // avg tree absorbs ~21 kg CO₂/yr
  const offsetUSD = (co2Kg / 1000) * 18; // Gold Standard ~$18/tonne

  const arcPath =
    !sameAirport
      ? getArcPath(
          originAirport.lat,
          originAirport.lon,
          destAirport.lat,
          destAirport.lon
        )
      : "";

  const selectStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "var(--colors--secondary-background)",
    color: "var(--colors--heading)",
    border: "1px solid var(--colors--border)",
    borderRadius: "var(--_components---input--border-radius, 0.75rem)",
    padding: "0.65em 2.5em 0.65em 1em",
    fontSize: "var(--_components---button--font-size, 1rem)",
    fontFamily:
      "var(--_typography---fonts--primary-font, Inter), sans-serif",
    fontWeight: 500,
    cursor: "pointer",
    outline: "none",
    appearance: "none" as React.CSSProperties["appearance"],
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.9em center",
    boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  };

  const statCard: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    backgroundColor: "var(--colors--secondary-background)",
    border: "1px solid var(--colors--border)",
    borderRadius:
      "calc(var(--_border-radius---global--radius, 1.5rem) / 2)",
    padding: "0.875rem 1rem",
    textAlign: "center" as const,
  };

  const eyebrow: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "var(--colors--paragraph)",
    marginBottom: "0.3em",
  };

  const bigNum: React.CSSProperties = {
    fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
    fontWeight: 600,
    color: "var(--colors--heading)",
    lineHeight: 1.1,
  };

  const unit: React.CSSProperties = {
    fontSize: "0.7rem",
    color: "var(--colors--paragraph)",
    marginTop: "0.15em",
  };

  return (
    <div
      style={{
        background: "var(--colors--background)",
        borderRadius: "var(--_components---card--border-radius, 1.5rem)",
        border: "1px solid var(--colors--border)",
        padding: "var(--_components---card--padding, 1.5rem)",
        fontFamily:
          "var(--_typography---fonts--primary-font, Inter), sans-serif",
        maxWidth: "56rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      {title && (
        <h2
          style={{
            margin: "0 0 0.25em",
            fontSize:
              "var(--_typography---h3--font-size, clamp(1.5rem, 3vw, 2.3rem))",
            fontWeight: "var(--_typography---h3--font-weight, 500)" as any,
            lineHeight: "var(--_typography---h3--line-height, 1.2)" as any,
            letterSpacing: "var(--_typography---h3--letter-spacing, 0)",
            color: "var(--colors--heading)",
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p
          style={{
            margin: "0 0 1.25rem",
            fontSize:
              "var(--_typography---paragraph-body--font-size, clamp(0.9rem, 1.5vw, 1rem))",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "var(--colors--paragraph)",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Airport selectors */}
      <div
        style={{
          display: "flex",
          gap: "var(--_layout---grid--gap-md, 1.5rem)",
          alignItems: "flex-end",
          marginBottom: "1rem",
          flexWrap: "wrap" as const,
        }}
      >
        <div style={{ flex: 1, minWidth: "160px" }}>
          <label
            style={{
              display: "block",
              fontSize:
                "var(--_components---input-label--font-size, 0.9rem)",
              fontWeight:
                "var(--_components---input-label--font-weight, 500)" as any,
              color: "var(--colors--heading)",
              marginBottom: "0.4em",
            }}
          >
            From
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            style={selectStyle}
          >
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plane icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--colors--primary-accent)",
            paddingBottom: "0.15em",
            flexShrink: 0,
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: "160px" }}>
          <label
            style={{
              display: "block",
              fontSize:
                "var(--_components---input-label--font-size, 0.9rem)",
              fontWeight:
                "var(--_components---input-label--font-weight, 500)" as any,
              color: "var(--colors--heading)",
              marginBottom: "0.4em",
            }}
          >
            To
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={selectStyle}
          >
            {AIRPORTS.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* World map */}
      <div
        style={{
          borderRadius:
            "calc(var(--_border-radius---global--radius, 1.5rem) / 2)",
          overflow: "hidden",
          border: "1px solid var(--colors--border)",
          background: "var(--colors--secondary-background)",
          marginBottom: "1rem",
        }}
      >
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{ display: "block", width: "100%", height: "auto" }}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="World map showing flight route"
        >
          {/* Latitude grid lines */}
          {[-60, -30, 0, 30, 60].map((lat) => (
            <line
              key={`lat${lat}`}
              x1={0}
              y1={latToY(lat)}
              x2={MAP_W}
              y2={latToY(lat)}
              stroke="var(--colors--border)"
              strokeWidth={lat === 0 ? 1 : 0.5}
              opacity={lat === 0 ? 0.6 : 0.35}
            />
          ))}
          {/* Longitude grid lines */}
          {[-120, -60, 0, 60, 120].map((lon) => (
            <line
              key={`lon${lon}`}
              x1={lonToX(lon)}
              y1={0}
              x2={lonToX(lon)}
              y2={MAP_H}
              stroke="var(--colors--border)"
              strokeWidth="0.5"
              opacity="0.35"
            />
          ))}

          {/* Continent fills */}
          {CONTINENT_POLYGONS.map((pts, i) => (
            <polygon
              key={i}
              points={pts}
              fill="var(--colors--border)"
              stroke="var(--colors--border)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              opacity="0.45"
            />
          ))}

          {/* All airport dots */}
          {AIRPORTS.map((ap) => {
            const active = ap.code === origin || ap.code === destination;
            return (
              <circle
                key={ap.code}
                cx={lonToX(ap.lon)}
                cy={latToY(ap.lat)}
                r={active ? 5 : 2.5}
                fill={
                  active
                    ? "var(--colors--primary-accent)"
                    : "var(--colors--paragraph)"
                }
                opacity={active ? 1 : 0.4}
              />
            );
          })}

          {/* Flight arc */}
          {arcPath && (
            <>
              {/* Glow */}
              <path
                d={arcPath}
                fill="none"
                stroke="var(--colors--primary-accent)"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.15"
              />
              {/* Main animated stroke */}
              <path
                ref={pathRef}
                d={arcPath}
                fill="none"
                stroke="var(--colors--primary-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${dashLength} ${dashLength}`}
                strokeDashoffset={dashOffset}
              />
              {/* Static dashed underlay */}
              <path
                d={arcPath}
                fill="none"
                stroke="var(--colors--primary-accent)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeDasharray="4 7"
                opacity="0.25"
              />
            </>
          )}

          {/* Origin / destination labels */}
          {[originAirport, destAirport].map((ap) => (
            <g key={ap.code + "-label"}>
              <text
                x={lonToX(ap.lon)}
                y={latToY(ap.lat) - 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
                fill="var(--colors--heading)"
                stroke="var(--colors--secondary-background)"
                strokeWidth="3"
                paintOrder="stroke"
              >
                {ap.code}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Stats row */}
      {!sameAirport && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap" as const,
          }}
        >
          <div style={statCard}>
            <div style={eyebrow}>Distance</div>
            <div style={bigNum}>{Math.round(distKm).toLocaleString()}</div>
            <div style={unit}>km</div>
          </div>

          <div
            style={{
              ...statCard,
              border: "2px solid var(--colors--primary-accent)",
            }}
          >
            <div style={eyebrow}>CO₂ per Passenger</div>
            <div style={{ ...bigNum, color: "var(--colors--primary-accent)" }}>
              {co2Kg >= 1000
                ? `${(co2Kg / 1000).toFixed(2)}`
                : Math.round(co2Kg).toLocaleString()}
            </div>
            <div style={unit}>{co2Kg >= 1000 ? "tonnes CO₂e" : "kg CO₂e"}</div>
          </div>

          <div style={statCard}>
            <div style={eyebrow}>Trees to Offset</div>
            <div style={bigNum}>{trees.toLocaleString()}</div>
            <div style={unit}>trees / 1 year</div>
          </div>

          <div style={statCard}>
            <div style={eyebrow}>Offset Cost</div>
            <div style={bigNum}>${offsetUSD.toFixed(2)}</div>
            <div style={unit}>Gold Standard</div>
          </div>
        </div>
      )}

      {/* Methodology note */}
      <p
        style={{
          margin: "0.875rem 0 0",
          fontSize: "0.68rem",
          color: "var(--colors--paragraph)",
          opacity: 0.55,
          lineHeight: 1.5,
        }}
      >
        Estimates per economy-class passenger. DEFRA methodology: 0.255 kg
        CO₂e/km (includes radiative forcing index). Carbon offset pricing via
        Gold Standard at $18/tonne.
      </p>
    </div>
  );
};
