import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { z } from 'zod';

import { createVersionedLocalStorage, makeStorageKey } from '@/utils/persistence';
import { ACTIVE_VIEWS, type ActiveView } from '@/types/ui';

const persistedUiStateV1Schema = z.object({
  schemaVersion: z.literal(1),
  activeView: z.enum(ACTIVE_VIEWS),
});

type PersistedUiStateV1 = z.infer<typeof persistedUiStateV1Schema>;

const uiActiveViewStorage = createVersionedLocalStorage<PersistedUiStateV1>({
  key: makeStorageKey('ui', 'activeView'),
  latestVersion: 1,
  schemas: {
    1: persistedUiStateV1Schema,
  },
  coerce: (input) => {
    if (typeof input === 'string' && ACTIVE_VIEWS.includes(input as ActiveView)) {
      return { schemaVersion: 1, activeView: input as ActiveView };
    }

    if (typeof input === 'object' && input !== null) {
      const value = input as { schemaVersion?: unknown; activeView?: unknown };
      if (
        value.schemaVersion == null &&
        typeof value.activeView === 'string' &&
        ACTIVE_VIEWS.includes(value.activeView as ActiveView)
      ) {
        return { schemaVersion: 1, activeView: value.activeView as ActiveView };
      }
    }

    return undefined;
  },
});

export const useUiStore = defineStore('ui', () => {
  const persisted = uiActiveViewStorage.read();
  const activeView = ref<ActiveView>(persisted?.activeView ?? 'home');

  function setActiveView(view: ActiveView) {
    activeView.value = view;
  }

  watch(
    activeView,
    (view) => {
      const payload: PersistedUiStateV1 = { schemaVersion: 1, activeView: view };
      uiActiveViewStorage.write(payload);
    },
    { immediate: true },
  );

  return { activeView, setActiveView };
});
