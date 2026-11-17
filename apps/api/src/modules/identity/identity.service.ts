import { prisma } from '../../shared/database/prisma';
import { AppError, ConflictError, NotFoundError } from '../../shared/errors';
import { eventBus } from '../../shared/events';
import {
  CreateAccountInput,
  CreateLearnerProfileInput,
  IIdentityService,
  LinkGuardianInput,
} from './identity.contracts';
import { AccountStatus } from '@gaonlab/shared-types';

export class IdentityService implements IIdentityService {
  async createAccount(input: CreateAccountInput): Promise<{ accountId: string; personId: string }> {
    const existing = await prisma.account.findUnique({
      where: { loginIdentifier: input.loginIdentifier },
    });

    if (existing) {
      throw new ConflictError(`Account with identifier '${input.loginIdentifier}' already exists`);
    }

    if (input.email) {
      const existingEmail = await prisma.account.findUnique({
        where: { email: input.email },
      });
      if (existingEmail) {
        throw new ConflictError(`Account with email '${input.email}' already exists`);
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          loginIdentifier: input.loginIdentifier,
          email: input.email,
          phone: input.phone,
          passwordHash: input.passwordHash,
          accountType: input.accountType || 'LEARNER',
          status: input.status || 'REGISTERED_PENDING_CONSENT',
        },
      });

      const person = await tx.person.create({
        data: {
          accountId: account.id,
          displayName: input.displayName,
          preferredLanguage: input.preferredLanguage || 'en',
        },
      });

      return { accountId: account.id, personId: person.id };
    });

    eventBus.publish({
      eventId: crypto.randomUUID(),
      type: 'ACCOUNT_CREATED',
      schemaVersion: '1.0.0',
      occurredAt: new Date().toISOString(),
      learnerId: result.personId,
      payload: {
        accountId: result.accountId,
        loginIdentifier: input.loginIdentifier,
        accountType: input.accountType || 'LEARNER',
      },
    });

    return result;
  }

  async getAccountById(accountId: string) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { person: true },
    });
    if (!account) {
      throw new NotFoundError('Account', accountId);
    }
    return account;
  }

  async getPersonById(personId: string) {
    const person = await prisma.person.findUnique({
      where: { id: personId },
      include: { account: true, learnerProfile: true },
    });
    if (!person) {
      throw new NotFoundError('Person', personId);
    }
    return person;
  }

  async createLearnerProfile(input: CreateLearnerProfileInput) {
    const person = await prisma.person.findUnique({
      where: { id: input.personId },
    });
    if (!person) {
      throw new NotFoundError('Person', input.personId);
    }

    return prisma.learnerProfile.create({
      data: {
        personId: input.personId,
        learnerCategory: input.learnerCategory || 'MIDDLE',
        dateOfBirth: input.dateOfBirth,
        approximateAge: input.approximateAge,
        preferredInterfaceLanguage: input.preferredInterfaceLanguage || 'en',
        mediumOfInstruction: input.mediumOfInstruction || 'en',
        learningPreferences: input.learningPreferences as any,
        accessibilityPreferences: input.accessibilityPreferences as any,
      },
    });
  }

  async linkGuardian(input: LinkGuardianInput) {
    return prisma.guardianLink.create({
      data: {
        minorPersonId: input.minorPersonId,
        guardianPersonId: input.guardianPersonId,
        relationshipType: input.relationshipType,
        isPrimary: input.isPrimary ?? true,
      },
    });
  }

  async updateAccountStatus(accountId: string, status: AccountStatus): Promise<void> {
    await prisma.account.update({
      where: { id: accountId },
      data: { status },
    });
  }
}

export const identityService = new IdentityService();
