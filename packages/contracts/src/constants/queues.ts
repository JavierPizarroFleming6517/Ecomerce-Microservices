export const USERS_QUEUE = 'users_queue' as const;
export const CATALOG_QUEUE = 'catalog_queue' as const;
export const RECOMMENDATIONS_QUEUE = 'recommendations_queue' as const;

export const RETAIL_QUEUES = {
  USERS: USERS_QUEUE,
  CATALOG: CATALOG_QUEUE,
  RECOMMENDATIONS: RECOMMENDATIONS_QUEUE,
} as const;

export type RetailQueue = (typeof RETAIL_QUEUES)[keyof typeof RETAIL_QUEUES];
