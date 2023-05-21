import { Page } from '@playwright/test';
import { Logger } from 'winston';

export const testManager = {
  // @ts-ignore
  page: undefined as Page,
  logger: undefined as Logger,
};
