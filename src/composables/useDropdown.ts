import { ref, onMounted, onUnmounted, type Ref } from 'vue';

export interface UseDropdownOptions<ItemOption> {
  /** Array of selectable items */
  items: Ref<ItemOption[]>;
  /** Function to get unique key for each item */
  getKey: (item: ItemOption) => string;
  /** Callback when an item is selected */
  onSelect: (item: ItemOption) => void;
}

export interface UseDropdownReturn<ItemOption> {
  /** Whether the dropdown is open */
  isOpen: Ref<boolean>;
  /** Index of currently focused item (-1 if none) */
  focusedIndex: Ref<number>;
  /** Currently focused item */
  focusedItem: Ref<ItemOption | null>;
  /** Toggle dropdown open/closed */
  toggle: () => void;
  /** Open the dropdown */
  open: () => void;
  /** Close the dropdown */
  close: () => void;
  /** Handle keydown events for accessibility */
  handleKeydown: (event: KeyboardEvent) => void;
  /** Handle click outside to close dropdown */
  handleClickOutside: (event: MouseEvent) => void;
  /** Ref to attach to the dropdown container for click-outside detection */
  containerRef: Ref<HTMLElement | null>;
}

/**
 * Composable for accessible dropdown menus with keyboard navigation.
 * Handles: Arrow keys, Escape, Enter/Space, click outside
 */
export function useDropdown<ItemOption>(
  options: UseDropdownOptions<ItemOption>,
): UseDropdownReturn<ItemOption> {
  const { items, onSelect } = options;

  const isOpen = ref(false);
  const focusedIndex = ref(-1);
  const containerRef = ref<HTMLElement | null>(null);

  const focusedItem = ref<ItemOption | null>(null) as Ref<ItemOption | null>;

  function updateFocusedItem() {
    const idx = focusedIndex.value;
    focusedItem.value = idx >= 0 && idx < items.value.length ? (items.value[idx] ?? null) : null;
  }

  function toggle() {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  }

  function open() {
    isOpen.value = true;
    focusedIndex.value = 0;
    updateFocusedItem();
  }

  function close() {
    isOpen.value = false;
    focusedIndex.value = -1;
    focusedItem.value = null;
  }

  function focusNext() {
    if (!isOpen.value) {
      return;
    }
    const len = items.value.length;
    if (len === 0) {
      return;
    }
    focusedIndex.value = (focusedIndex.value + 1) % len;
    updateFocusedItem();
  }

  function focusPrev() {
    if (!isOpen.value) {
      return;
    }
    const len = items.value.length;
    if (len === 0) {
      return;
    }
    focusedIndex.value = (focusedIndex.value - 1 + len) % len;
    updateFocusedItem();
  }

  function selectFocused() {
    if (!isOpen.value) {
      return;
    }
    const item = focusedItem.value;
    if (item) {
      onSelect(item);
      close();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen.value) {
          open();
        } else {
          focusNext();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen.value) {
          open();
        } else {
          focusPrev();
        }
        break;
      case 'Enter':
      case ' ':
        if (isOpen.value && focusedIndex.value >= 0) {
          event.preventDefault();
          selectFocused();
        } else if (!isOpen.value) {
          event.preventDefault();
          open();
        }
        break;
      case 'Tab':
        if (isOpen.value) {
          close();
        }
        break;
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (!isOpen.value) {
      return;
    }
    const container = containerRef.value;
    if (container && !container.contains(event.target as Node)) {
      close();
    }
  }

  function onDocumentClick(event: MouseEvent) {
    handleClickOutside(event);
  }

  onMounted(() => {
    document.addEventListener('click', onDocumentClick, true);
  });

  onUnmounted(() => {
    document.removeEventListener('click', onDocumentClick, true);
  });

  return {
    isOpen,
    focusedIndex,
    focusedItem,
    toggle,
    open,
    close,
    handleKeydown,
    handleClickOutside,
    containerRef,
  };
}
