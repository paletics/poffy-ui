import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/feedback/Alert';
import { BreadcrumbItem, BreadcrumbLink, Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/surfaces/Accordion';
import { Blockquote } from '@/components/typography/Blockquote';
import { Link } from '@/components/typography/Link';
import { css } from '@/styled-system/css';
import { ScreenRenderer } from './ScreenRenderer';
import {
  landingPageDocument,
  operationsDashboardDocument,
  storefrontDocument,
} from './ScreenRenderer.example-documents';
import { exampleRegistries } from './ScreenRenderer.example-host';

const shellClass = css({ display: 'grid', gap: 'xl', maxWidth: '[1120px]', padding: 'lg' });
const navigationClass = css({ display: 'flex', gap: 'md', alignItems: 'center' });

const ComposedScreen = ({
  document,
}: {
  document: Parameters<typeof ScreenRenderer>[0]['document'];
}) => {
  const [lastAction, setLastAction] = useState<string>();
  return (
    <>
      <ScreenRenderer document={document} {...exampleRegistries} onAction={setLastAction} />
      <p role="status">{lastAction ? `Host received: ${lastAction}` : 'No action dispatched.'}</p>
    </>
  );
};


const meta: Meta<typeof ScreenRenderer> = {
  title: 'Display/ScreenRenderer Rich Examples',
  component: ScreenRenderer,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof ScreenRenderer>;

export const StorefrontShell: Story = {
  render: () => (
    <main className={shellClass}>
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Store</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>
      <Alert status="info" live="off">
        <AlertIcon />
        <div>
          <AlertTitle>Free shipping this week</AlertTitle>
          <AlertDescription>
            Orders over $50 ship free within the continental United States.
          </AlertDescription>
        </div>
      </Alert>
      <h1>Northwind store</h1>
      <ComposedScreen document={storefrontDocument} />
    </main>
  ),
};

export const MarketingLandingShell: Story = {
  render: () => (
    <main className={shellClass}>
      <nav className={navigationClass} aria-label="Primary navigation">
        <Link href="/product">Product</Link>
        <Link href="/customers">Customers</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>
      <ComposedScreen document={landingPageDocument} />
      <section aria-labelledby="customer-quote">
        <h2 id="customer-quote">Trusted by focused teams</h2>
        <Blockquote>“The shared workflow finally made our operational work feel calm.”</Blockquote>
      </section>
      <section aria-labelledby="faq">
        <h2 id="faq">Frequently asked questions</h2>
        <Accordion appearance="outline">
          <AccordionItem value="security">
            <AccordionTrigger>How is access managed?</AccordionTrigger>
            <AccordionContent>
              Access is controlled by your organization and reviewed by the host application.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="trial">
            <AccordionTrigger>Can I start with a small team?</AccordionTrigger>
            <AccordionContent>
              Yes. Start with a focused workspace and grow when your process is established.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </main>
  ),
};

export const OperationsShell: Story = {
  render: () => (
    <main className={shellClass}>
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/operations">Operations</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Orders</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>
      <h1>Order operations</h1>
      <Alert status="warning" live="off">
        <AlertIcon />
        <div>
          <AlertTitle>Three shipments need review</AlertTitle>
          <AlertDescription>
            Resolve carrier updates before the next fulfillment run.
          </AlertDescription>
        </div>
      </Alert>
      <ComposedScreen document={operationsDashboardDocument} />
    </main>
  ),
};
