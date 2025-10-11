import type { BaseEntity } from './user';

export enum AccessibilityFeatureCategoryEnum {
  OTHER = 'OTHER',
}

export interface AccessibilityFeature extends BaseEntity {
  name: string;
  description?: string | null;
  icon?: string | null;
  category: AccessibilityFeatureCategoryEnum;
}
