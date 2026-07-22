export const USERS_PING = 'users.ping' as const;
export const CATALOG_PING = 'catalog.ping' as const;
export const RECOMMENDATIONS_PING = 'recommendations.ping' as const;
export const CATALOG_LIST_PRODUCTS = 'catalog.products.list' as const;
export const CATALOG_LIST_CATEGORIES = 'catalog.categories.list' as const;

export const MESSAGE_PATTERNS = {
  USERS_PING,
  CATALOG_PING,
  RECOMMENDATIONS_PING,
  CATALOG_LIST_PRODUCTS,
  CATALOG_LIST_CATEGORIES,
} as const;

export type MessagePattern =
  (typeof MESSAGE_PATTERNS)[keyof typeof MESSAGE_PATTERNS];
