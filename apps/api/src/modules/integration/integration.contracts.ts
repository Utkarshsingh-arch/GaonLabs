import {
  GovAdapterMode,
  GovernmentProviderCode,
  IntegrationStatus,
} from '@gaonlab/shared-types';

export interface RegisterProviderInput {
  id: string;
  code: GovernmentProviderCode;
  name: string;
  officialPortalUrl: string;
  operationalMode?: GovAdapterMode;
  isEnabled?: boolean;
  description: string;
}

export interface AddProviderCapabilityInput {
  providerId: string;
  capabilityKey: string;
  isSupported?: boolean;
  requiresAuth?: boolean;
  fallbackStrategy?: string;
  metadataConfig?: Record<string, unknown>;
}

export interface IIntegrationGatewayService {
  registerProvider(input: RegisterProviderInput): Promise<any>;
  addCapability(input: AddProviderCapabilityInput): Promise<any>;
  setProviderMode(code: GovernmentProviderCode, mode: GovAdapterMode): Promise<any>;
  getProviderStatus(code: GovernmentProviderCode): Promise<IntegrationStatus>;
  listProviders(): Promise<any[]>;
}
