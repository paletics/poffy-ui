import type { UseCommandMenuStateOptions } from './useCommandMenuState.types';

interface Item {
  id: string;
  label: string;
}

const uncontrolled = {
  defaultOpen: true,
  defaultQuery: 'docs',
  items: [],
} satisfies UseCommandMenuStateOptions<Item>;
const controlled = {
  items: [],
  onOpenChange: (_open: boolean) => undefined,
  onQueryChange: (_query: string) => undefined,
  open: true,
  query: 'docs',
} satisfies UseCommandMenuStateOptions<Item>;

// @ts-expect-error Controlled open state requires its change callback.
const openWithoutHandler: UseCommandMenuStateOptions<Item> = { items: [], open: true };
// @ts-expect-error Controlled and uncontrolled open values cannot be combined.
const openWithDefault: UseCommandMenuStateOptions<Item> = {
  defaultOpen: false,
  items: [],
  onOpenChange: () => undefined,
  open: true,
};
// @ts-expect-error Controlled query state requires its change callback.
const queryWithoutHandler: UseCommandMenuStateOptions<Item> = { items: [], query: 'docs' };
// @ts-expect-error Controlled and uncontrolled query values cannot be combined.
const queryWithDefault: UseCommandMenuStateOptions<Item> = {
  defaultQuery: '',
  items: [],
  onQueryChange: () => undefined,
  query: 'docs',
};

void [
  controlled,
  openWithDefault,
  openWithoutHandler,
  queryWithDefault,
  queryWithoutHandler,
  uncontrolled,
];
