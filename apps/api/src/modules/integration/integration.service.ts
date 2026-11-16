import { prisma } from '../../shared/database/prisma';
import { NotFoundError } from '../../shared/errors';
import { eventBus } from '../../shared/events';
import {
  AddProviderCapabilityInput,
  IIntegrationGatewayService,
  RegisterProviderInput,
} from './integration.contracts';
import {
  GovAdapterMode,
  GovernmentProviderCode,
  IntegrationStatus,
} from '@gaonlab/shared-types';

export class IntegrationGatewayService implements IIntegrationGatewayService {
  async registerProvider(input: RegisterProviderInput) {
    return prisma.integrationProvider.upsert({
      where: { code: input.code },
      update: {
        name: input.name,
        officialPortalUrl: input.officialPortalUrl,
        operationalMode: input.operationalMode || 'MOCK',
        isEnabled: input.isEnabled ?? false,
        description: input.description,
      },
      create: {
        id: input.id,
        code: input.code,
        name: input.name,
        officialPortalUrl: input.officialPortalUrl,
        operationalMode: input.operationalMode || 'MOCK',
        isEnabled: input.isEnabled ?? false,
        description: input.description,
      },
    });
  }

  async addCapability(input: AddProviderCapabilityInput) {
    return prisma.providerCapability.upsert({
      where: {
        providerId_capabilityKey: {
          providerId: input.providerId,
          capabilityKey: input.capabilityKey,
        },
      },
      update: {
        isSupported: input.isSupported ?? true,
        requiresAuth: input.requiresAuth ?? false,
        fallbackStrategy: input.fallbackStrategy || 'LOCAL_CACHE',
        metadataConfig: input.metadataConfig as any,
      },
      create: {
        providerId: input.providerId,
        capabilityKey: input.capabilityKey,
        isSupported: input.isSupported ?? true,
        requiresAuth: input.requiresAuth ?? false,
        fallbackStrategy: input.fallbackStrategy || 'LOCAL_CACHE',
        metadataConfig: input.metadataConfig as any,
      },
    });
  }

  async setProviderMode(code: GovernmentProviderCode, mode: GovAdapterMode) {
    const provider = await prisma.integrationProvider.findUnique({
      where: { code },
    });
    if (!provider) {
      throw new NotFoundError('IntegrationProvider', code);
    }

    const updated = await prisma.integrationProvider.update({
      where: { code },
      data: { operationalMode: mode },
    });

    eventBus.publish({
      eventId: crypto.randomUUID(),
      type: 'INTEGRATION_STATUS_CHANGE',
      schemaVersion: '1.0.0',
      occurredAt: new Date().toISOString(),
      payload: {
        providerCode: code,
        newMode: mode,
      },
    });

    return updated;
  }

  async getProviderStatus(code: GovernmentProviderCode): Promise<IntegrationStatus> {
    const provider = await prisma.integrationProvider.findUnique({
      where: { code },
    });
    if (!provider) {
      throw new NotFoundError('IntegrationProvider', code);
    }

    return {
      providerCode: provider.code,
      operationalMode: provider.operationalMode,
      isHealthy: provider.isEnabled,
      lastCheckedAt: new Date().toISOString(),
      message: `Provider operational in ${provider.operationalMode} mode`,
    };
  }

  async listProviders() {
    return prisma.integrationProvider.findMany({
      include: { capabilities: true },
      orderBy: { code: 'asc' },
    });
  }
}

export const integrationGatewayService = new IntegrationGatewayService();
