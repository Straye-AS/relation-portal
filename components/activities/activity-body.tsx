"use client";

import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { OfferHealthBadge } from "@/components/offers/offer-health-badge";
import { ProjectPhaseBadge } from "@/components/projects/project-phase-badge";
import { Badge } from "@/components/ui/badge";

interface ActivityBodyProps {
  title: string;
  body: string;
}

// Format currency in Norwegian format
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(value);
}

// Parse a number from string (handles formats like "980000.00")
function parseNumber(str: string): number | null {
  const cleaned = str.replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// Check if a string looks like a currency value
function isCurrencyValue(str: string): boolean {
  const num = parseNumber(str);
  return num !== null && num >= 1000;
}

// Health status mapping for validation
const healthMap: Record<string, string> = {
  on_track: "on_track",
  at_risk: "at_risk",
  delayed: "delayed",
  over_budget: "over_budget",
};

export function ActivityBody({ title: _title, body }: ActivityBodyProps) {
  // Handle empty body
  if (!body) {
    return <span className="text-muted-foreground">Ingen beskrivelse</span>;
  }

  // Check for phase changes in offers (e.g., "fase: order -> completed" or "fase: order → completed")
  const phaseChangeMatch = body.match(/\(fase:\s*(\w+)\s*(?:->|→)\s*(\w+)\)/i);
  if (phaseChangeMatch) {
    const [fullMatch, fromPhase, toPhase] = phaseChangeMatch;
    const beforeText = body.substring(0, body.indexOf(fullMatch));

    return (
      <span className="flex flex-wrap items-center gap-1">
        <span>{beforeText}</span>
        <OfferStatusBadge phase={fromPhase} className="text-xs" />
        <span className="text-muted-foreground">→</span>
        <OfferStatusBadge phase={toPhase} className="text-xs" />
      </span>
    );
  }

  // Also check for inline phase mentions without parentheses (e.g., "fase: order -> completed")
  const inlinePhaseMatch = body.match(/fase:\s*(\w+)\s*(?:->|→)\s*(\w+)/i);
  if (inlinePhaseMatch) {
    const [fullMatch, fromPhase, toPhase] = inlinePhaseMatch;
    const beforeText = body.substring(0, body.indexOf(fullMatch));
    const afterText = body.substring(
      body.indexOf(fullMatch) + fullMatch.length
    );

    return (
      <span className="flex flex-wrap items-center gap-1">
        <span>{beforeText}</span>
        <OfferStatusBadge phase={fromPhase} className="text-xs" />
        <span className="text-muted-foreground">→</span>
        <OfferStatusBadge phase={toPhase} className="text-xs" />
        <span>{afterText}</span>
      </span>
    );
  }

  // Check for reopen activity (e.g., "gjenåpnet fra completed til ordre")
  const reopenMatch = body.match(/(.+)gjenåpnet fra (\w+) til (\w+)/i);
  if (reopenMatch) {
    const [, beforeText, fromPhase, toPhase] = reopenMatch;

    return (
      <span className="flex flex-wrap items-center gap-1">
        <span>{beforeText}gjenåpnet fra</span>
        <OfferStatusBadge phase={fromPhase} className="text-xs" />
        <span>til</span>
        <OfferStatusBadge phase={toPhase} className="text-xs" />
      </span>
    );
  }

  // Check for health changes (e.g., "Helse endret fra 'on_track' til 'at_risk'")
  const healthChangeMatch = body.match(/Helse endret fra '(\w+)' til '(\w+)'/i);
  if (healthChangeMatch) {
    const [, fromHealth, toHealth] = healthChangeMatch;
    if (healthMap[fromHealth] && healthMap[toHealth]) {
      return (
        <span className="flex flex-wrap items-center gap-1">
          <span>Helse endret fra</span>
          <OfferHealthBadge health={fromHealth as any} />
          <span>til</span>
          <OfferHealthBadge health={toHealth as any} />
        </span>
      );
    }
  }

  // Check for currency value changes (e.g., "Fakturert endret fra 980000.00 til 12000000.00")
  const currencyChangeMatch = body.match(
    /(.+) endret fra ([\d.,]+) til ([\d.,]+)/i
  );
  if (currencyChangeMatch) {
    const [, fieldName, fromValue, toValue] = currencyChangeMatch;
    const fromNum = parseNumber(fromValue);
    const toNum = parseNumber(toValue);

    if (
      fromNum !== null &&
      toNum !== null &&
      (isCurrencyValue(fromValue) || isCurrencyValue(toValue))
    ) {
      return (
        <span className="flex flex-wrap items-center gap-1">
          <span>{fieldName} endret fra</span>
          <Badge variant="outline" className="font-mono text-xs">
            {formatCurrency(fromNum)}
          </Badge>
          <span>til</span>
          <Badge variant="outline" className="font-mono text-xs">
            {formatCurrency(toNum)}
          </Badge>
        </span>
      );
    }
  }

  // Check for percentage changes (e.g., "Ferdigstillelse endret fra 50 til 75")
  const percentChangeMatch = body.match(
    /(Ferdigstillelse|Sannsynlighet) endret fra (\d+) til (\d+)/i
  );
  if (percentChangeMatch) {
    const [, fieldName, fromValue, toValue] = percentChangeMatch;
    const fromNum = parseInt(fromValue);
    const toNum = parseInt(toValue);

    return (
      <span className="flex flex-wrap items-center gap-1">
        <span>{fieldName} endret fra</span>
        <Badge variant="outline" className="text-xs">
          {fromNum}%
        </Badge>
        <span>til</span>
        <Badge variant="outline" className="text-xs">
          {toNum}%
        </Badge>
      </span>
    );
  }

  // Check for project phase changes
  const projectPhaseMatch = body.match(
    /Prosjektfase endret fra '(\w+)' til '(\w+)'/i
  );
  if (projectPhaseMatch) {
    const [, fromPhase, toPhase] = projectPhaseMatch;
    return (
      <span className="flex flex-wrap items-center gap-1">
        <span>Prosjektfase endret fra</span>
        <ProjectPhaseBadge phase={fromPhase} />
        <span>til</span>
        <ProjectPhaseBadge phase={toPhase} />
      </span>
    );
  }

  // Check for responsible/user changes (e.g., "Ansvarlig endret fra 'Name' til 'Name'" or "Ansvarlig endret fra '' til 'Name'")
  const userChangeMatch = body.match(
    /(.+) endret fra '([^']*)' til '([^']*)'/i
  );
  if (userChangeMatch) {
    const [, fieldName, fromValue, toValue] = userChangeMatch;
    return (
      <span className="flex flex-wrap items-center gap-1">
        <span>{fieldName} endret fra</span>
        {fromValue ? (
          <Badge variant="secondary" className="text-xs font-normal">
            {fromValue}
          </Badge>
        ) : (
          <span className="italic text-muted-foreground">(ingen)</span>
        )}
        <span>til</span>
        {toValue ? (
          <Badge variant="secondary" className="text-xs font-normal">
            {toValue}
          </Badge>
        ) : (
          <span className="italic text-muted-foreground">(ingen)</span>
        )}
      </span>
    );
  }

  // Default: return the body as-is
  return <span>{body}</span>;
}
