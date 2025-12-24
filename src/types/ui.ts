export const ACTIVE_VIEWS = ['home', 'about'] as const;

export type ActiveView = (typeof ACTIVE_VIEWS)[number];
