import { prisma } from '../../shared/database/prisma';
import {
  CreateFeatureFlagInput,
  EvaluateFlagContext,
  IFeatureFlagsService,
} from './feature-flags.contracts';

export class FeatureFlagsService implements IFeatureFlagsService {
  async createOrUpdateFlag(input: CreateFeatureFlagInput) {
    return prisma.featureFlag.upsert({
      where: { key: input.key },
      update: {
        description: input.description,
        isEnabledGlobally: input.isEnabledGlobally ?? false,
        enabledEnvironments: (input.enabledEnvironments || ['development']) as any,
        allowedCategories: (input.allowedCategories || []) as any,
        allowedOrganisations: (input.allowedOrganisations || []) as any,
        metadata: input.metadata as any,
      },
      create: {
        key: input.key,
        description: input.description,
        isEnabledGlobally: input.isEnabledGlobally ?? false,
        enabledEnvironments: (input.enabledEnvironments || ['development']) as any,
        allowedCategories: (input.allowedCategories || []) as any,
        allowedOrganisations: (input.allowedOrganisations || []) as any,
        metadata: input.metadata as any,
      },
    });
  }

  async isEnabled(key: string, context?: EvaluateFlagContext): Promise<boolean> {
    const flag = await prisma.featureFlag.findUnique({
      where: { key },
    });

    if (!flag) {
      return false;
    }

    if (flag.isEnabledGlobally) {
      return true;
    }

    if (!context) {
      return false;
    }

    const envs = (flag.enabledEnvironments as string[]) || [];
    if (!envs.includes(context.environment)) {
      return false;
    }

    if (context.organisationId) {
      const orgs = (flag.allowedOrganisations as string[]) || [];
      if (orgs.includes(context.organisationId)) {
        return true;
      }
    }

    if (context.learnerCategory) {
      const categories = (flag.allowedCategories as string[]) || [];
      if (categories.includes(context.learnerCategory)) {
        return true;
      }
    }

    return false;
  }

  async listFlags() {
    return prisma.featureFlag.findMany({
      orderBy: { key: 'asc' },
    });
  }
}

export const featureFlagsService = new FeatureFlagsService();
