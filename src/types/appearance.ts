import type { Ref } from 'vue';

/** Theme appearance options for the application. */
export type Appearance = 'light' | 'dark' | 'system';

/** Return type for the `useAppearance` composable. */
export interface UseAppearanceReturn {
  appearance: Ref<Appearance>;
  updateAppearance: (value: Appearance) => void;
}
