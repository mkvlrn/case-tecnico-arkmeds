import { jest } from '@jest/globals';
import type { PrismaClient as PrismaClientType } from '@prisma/client';
import { mock } from 'jest-mock-extended';

export const PrismaClient = jest.fn(() => mock<PrismaClientType>());
