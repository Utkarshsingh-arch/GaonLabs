/**
 * Government Integration Gateway Contracts
 * Defines multi-mode, resilient adapter specifications for Indian Digital Public Goods
 */

export type GovAdapterMode = 'LIVE' | 'CACHED' | 'MOCK' | 'OFF';

export type GovernmentProviderCode =
  | 'NDEAR'
  | 'DIKSHA'
  | 'APAAR'
  | 'BHASHINI'
  | 'PARAKH'
  | 'UDISE_PLUS'
  | 'KTBS'
  | 'DSERT'
  | 'KSEAB'
  | 'KARNATAKA_SATS'
  | 'VIDYA_SAMIKSHA_KENDRA';

export interface IntegrationProvider {
  id: string;
  code: GovernmentProviderCode;
  name: string;
  officialPortalUrl: string;
  operationalMode: GovAdapterMode;
  isEnabled: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderCapability {
  id: string;
  providerId: string;
  capabilityKey: string; // e.g. "TTS", "NMT_TRANSLATION", "TEXTBOOK_HIERARCHY", "UDISE_LOOKUP"
  isSupported: boolean;
  requiresAuth: boolean;
  fallbackStrategy: 'LOCAL_CACHE' | 'STATIC_MOCK' | 'FAIL_GRACEFUL';
  metadataConfig?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationStatus {
  providerCode: GovernmentProviderCode;
  operationalMode: GovAdapterMode;
  isHealthy: boolean;
  lastCheckedAt: string;
  message?: string;
}
