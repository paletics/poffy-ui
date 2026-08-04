import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { ScreenDocument } from '@poffy-ui/behavior/screen-composer';
import { css } from '@/styled-system/css';
import { ScreenRenderer } from './ScreenRenderer';
import {
  landingPageDocument,
  operationsDashboardDocument,
  orderDetailDocument,
  storefrontDocument,
} from './ScreenRenderer.example-documents';
import { exampleRegistries } from './ScreenRenderer.example-host';

const pageClass = css({ display: 'grid', gap: 'xl', maxWidth: '[1120px]', padding: 'lg' });

const ExamplePage = ({ document, title }: { document: ScreenDocument; title?: string }) => {
  const [lastAction, setLastAction] = useState<string>();
  return (
    <main className={pageClass}>
      {title ? <h1>{title}</h1> : null}
      <ScreenRenderer document={document} {...exampleRegistries} onAction={setLastAction} />
      <p role="status">{lastAction ? `Host received: ${lastAction}` : 'No action dispatched.'}</p>
    </main>
  );
};


const meta: Meta<typeof ScreenRenderer> = {
  title: 'Display/ScreenRenderer Examples',
  component: ScreenRenderer,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof ScreenRenderer>;

export const Storefront: Story = {
  render: () => <ExamplePage title="Northwind store" document={storefrontDocument} />,
};

export const LandingPage: Story = {
  render: () => <ExamplePage document={landingPageDocument} />,
};

export const OperationsDashboard: Story = {
  render: () => <ExamplePage title="Order operations" document={operationsDashboardDocument} />,
};

export const OrderDetail: Story = {
  render: () => <ExamplePage title="Order #1042" document={orderDetailDocument} />,
};
