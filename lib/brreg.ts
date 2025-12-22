/**
 * Brønnøysundregistrene (BRREG) API Client
 *
 * Fetches company information from the Norwegian business registry.
 * API Documentation: https://data.brreg.no/enhetsregisteret/api/docs/index.html
 */

export interface BrregEnhet {
  organisasjonsnummer: string;
  navn: string;
  organisasjonsform?: {
    kode: string;
    beskrivelse: string;
  };
  hjemmeside?: string;
  epostadresse?: string;
  telefon?: string;
  mobil?: string;
  postadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommunenummer?: string;
    kommune?: string;
    landkode?: string;
    land?: string;
  };
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
    kommunenummer?: string;
    kommune?: string;
    landkode?: string;
    land?: string;
  };
  naeringskode1?: {
    kode: string;
    beskrivelse: string;
  };
  institusjonellSektorkode?: {
    kode: string;
    beskrivelse: string;
  };
  registreringsdatoEnhetsregisteret?: string;
  stiftelsesdato?: string;
  registrertIMvaregisteret?: boolean;
  antallAnsatte?: number;
  konkurs?: boolean;
  underAvvikling?: boolean;
  underTvangsavviklingEllerTvangsopplosning?: boolean;
  slettedato?: string;
}

export interface BrregError {
  error: string;
  message: string;
}

export interface BrregMappedData {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  municipality?: string;
  county?: string;
  industry?: string;
}

/**
 * Normalize organization number by removing spaces and dots
 */
export function normalizeOrgNumber(orgNumber: string): string {
  return orgNumber.replace(/[\s.]/g, "");
}

/**
 * Validate Norwegian organization number (9 digits)
 */
export function isValidOrgNumber(orgNumber: string): boolean {
  const normalized = normalizeOrgNumber(orgNumber);
  return /^\d{9}$/.test(normalized);
}

/**
 * Fetch company data from BRREG API
 */
export async function fetchBrregData(
  orgNumber: string
): Promise<BrregEnhet | null> {
  const normalized = normalizeOrgNumber(orgNumber);

  if (!isValidOrgNumber(normalized)) {
    throw new Error("Ugyldig organisasjonsnummer. Må være 9 siffer.");
  }

  const response = await fetch(
    `https://data.brreg.no/enhetsregisteret/api/enheter/${normalized}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Kunne ikke hente data fra Brønnøysundregistrene`);
  }

  return response.json();
}

/**
 * Map BRREG data to our internal format
 */
export function mapBrregToEntityData(enhet: BrregEnhet): BrregMappedData {
  // Prefer forretningsadresse (business address), fall back to postadresse
  const address = enhet.forretningsadresse || enhet.postadresse;

  // Normalize website URL
  let website = enhet.hjemmeside;
  if (website && !website.startsWith("http")) {
    website = `https://${website}`;
  }

  // Prefer telefon (landline), fall back to mobil
  const phone = enhet.telefon || enhet.mobil;

  return {
    name: enhet.navn,
    email: enhet.epostadresse,
    phone,
    website,
    address: address?.adresse?.join(", "),
    postalCode: address?.postnummer,
    city: address?.poststed,
    country: address?.land || "Norge",
    municipality: address?.kommune,
    industry: enhet.naeringskode1?.beskrivelse,
  };
}

/**
 * Check if company is active (not bankrupt, dissolved, etc.)
 */
export function isCompanyActive(enhet: BrregEnhet): boolean {
  return (
    !enhet.konkurs &&
    !enhet.underAvvikling &&
    !enhet.underTvangsavviklingEllerTvangsopplosning &&
    !enhet.slettedato
  );
}

/**
 * Get company status warnings
 */
export function getCompanyWarnings(enhet: BrregEnhet): string[] {
  const warnings: string[] = [];

  if (enhet.konkurs) {
    warnings.push("Selskapet er under konkursbehandling");
  }
  if (enhet.underAvvikling) {
    warnings.push("Selskapet er under avvikling");
  }
  if (enhet.underTvangsavviklingEllerTvangsopplosning) {
    warnings.push("Selskapet er under tvangsavvikling");
  }
  if (enhet.slettedato) {
    warnings.push(`Selskapet ble slettet ${enhet.slettedato}`);
  }

  return warnings;
}
