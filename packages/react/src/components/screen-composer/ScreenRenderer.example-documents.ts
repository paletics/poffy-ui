import type { ScreenDocument, ScreenNode } from '@poffy-ui/behavior/screen-composer';

const node = (
  id: string,
  type: string,
  props?: ScreenNode['props'],
  children?: readonly ScreenNode[],
): ScreenNode => ({ id, type, version: 1, props, children });
const text = (id: string, value: string) => node(id, 'core.text', { text: value });
const action = (id: string, actionId: string, label: string) =>
  node(id, 'core.action', { actionId, label });
const section = (id: string, title: string, children: readonly ScreenNode[]) =>
  node(id, 'core.section', { title }, children);
const stack = (id: string, children: readonly ScreenNode[], gap = 'xl') =>
  node(id, 'core.stack', { gap }, children);
type ExampleGridMinimumWidth = 'sm' | 'md' | 'lg';
const grid = (
  id: string,
  children: readonly ScreenNode[],
  minChildWidth: ExampleGridMinimumWidth = 'md',
) => node(id, 'core.grid', { mode: 'responsive', minChildWidth, gap: 'md' }, children);
const app = (
  id: string,
  type: string,
  props: ScreenNode['props'],
  children?: readonly ScreenNode[],
) => node(id, type, props, children);

export const storefrontDocument: ScreenDocument = {
  version: 1,
  root: stack('store', [
    text('intro', 'Thoughtful equipment for everyday work.'),
    section('featured', 'Featured products', [
      grid('products', [
        app('lamp', 'app.product-card', {
          name: 'Desk lamp',
          price: '$48.00',
          actionId: 'add-to-cart',
        }),
        app('notebook', 'app.product-card', {
          name: 'Daily notebook',
          price: '$18.00',
          actionId: 'add-to-cart',
        }),
        app('stand', 'app.product-card', {
          name: 'Laptop stand',
          price: '$72.00',
          actionId: 'add-to-cart',
        }),
      ]),
    ]),
  ]),
};

export const landingPageDocument: ScreenDocument = {
  version: 1,
  root: stack('landing', [
    app(
      'hero',
      'app.landing-hero',
      {
        eyebrow: 'Poffy Cloud',
        title: 'Calm operations for growing teams',
        summary: 'Bring requests, work, and decisions into one dependable workspace.',
      },
      [
        stack(
          'hero-actions',
          [
            action('start', 'start-trial', 'Start free trial'),
            node('pricing', 'core.link', { href: '/pricing', label: 'View pricing' }),
          ],
          'sm',
        ),
      ],
    ),
    section('features', 'Everything your team needs', [
      grid('feature-grid', [
        app('intake', 'app.feature-card', {
          title: 'Clear intake',
          description: 'Give every request one reliable starting point.',
        }),
        app('visibility', 'app.feature-card', {
          title: 'Shared visibility',
          description: 'Keep status and decisions visible to the whole team.',
        }),
        app('focus', 'app.feature-card', {
          title: 'Focused delivery',
          description: 'Turn priorities into a calm, repeatable workflow.',
        }),
      ]),
    ]),
  ]),
};

export const operationsDashboardDocument: ScreenDocument = {
  version: 1,
  root: stack('dashboard', [
    grid('metrics', [
      app('open', 'app.metric', {
        label: 'Open orders',
        value: '24',
        description: '6 require review today',
      }),
      app('revenue', 'app.metric', {
        label: 'Today’s revenue',
        value: '$8,420',
        description: '12% above yesterday',
      }),
      app('risk', 'app.metric', {
        label: 'At-risk shipments',
        value: '3',
        description: 'Awaiting carrier update',
      }),
    ]),
    section('orders', 'Orders requiring attention', [
      app('order-table', 'app.record-table', {
        caption: 'Orders requiring attention',
        rowHeaderColumnId: 'order',
        columns: [
          { id: 'order', label: 'Order' },
          { id: 'customer', label: 'Customer' },
          { id: 'status', label: 'Status' },
          { id: 'total', label: 'Total' },
        ],
        rows: [
          {
            id: '1042',
            cells: {
              order: '#1042',
              customer: 'Avery Lin',
              status: 'Awaiting review',
              total: '$248.00',
            },
          },
          {
            id: '1043',
            cells: {
              order: '#1043',
              customer: 'Sora Kim',
              status: 'Address check',
              total: '$84.00',
            },
          },
        ],
      }),
      action('export', 'export-attention-list', 'Export attention list'),
    ]),
  ]),
};

export const orderDetailDocument: ScreenDocument = {
  version: 1,
  root: stack('detail', [
    app('status', 'app.status', { label: 'Awaiting review', tone: 'warning' }),
    section('customer', 'Customer', [
      app('customer-details', 'app.key-value-list', {
        items: [
          { label: 'Name', value: 'Avery Lin' },
          { label: 'Email', value: 'avery@example.com' },
          { label: 'Shipping method', value: 'Priority' },
        ],
      }),
    ]),
    section('items', 'Items', [
      app('item-table', 'app.record-table', {
        caption: 'Items in order #1042',
        rowHeaderColumnId: 'item',
        columns: [
          { id: 'item', label: 'Item' },
          { id: 'quantity', label: 'Quantity' },
          { id: 'price', label: 'Price' },
        ],
        rows: [
          { id: 'lamp', cells: { item: 'Desk lamp', quantity: '1', price: '$48.00' } },
          { id: 'stand', cells: { item: 'Laptop stand', quantity: '2', price: '$200.00' } },
        ],
      }),
    ]),
    section('fulfillment', 'Fulfillment', [
      text('message', 'Review the shipping address before releasing this order.'),
      action('review', 'review-order', 'Review order'),
    ]),
  ]),
};
