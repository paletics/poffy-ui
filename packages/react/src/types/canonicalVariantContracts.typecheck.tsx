import { Tag } from '@/components/data-display/Tag';
import { EmptyState } from '@/components/feedback/EmptyState';
import { CircleProgress } from '@/components/feedback/CircleProgress';
import { ProgressBar } from '@/components/feedback/ProgressBar';
import type { ProgressBarVariants } from '@/components/feedback/ProgressBar';
import { Result } from '@/components/feedback/Result';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Spinner } from '@/components/feedback/Spinner';
import { Tabs } from '@/components/navigation/Tabs';
import type { TabsVariants } from '@/components/navigation/Tabs';
import { Sidebar } from '@/components/navigation/Sidebar';
import type { SidebarVariants } from '@/components/navigation/Sidebar';
import { Navbar } from '@/components/navigation/Navbar';
import type { NavbarVariants } from '@/components/navigation/Navbar';
import { Pagination } from '@/components/navigation/Pagination';
import type { PaginationVariants } from '@/components/navigation/Pagination';
import { Stepper } from '@/components/navigation/Stepper';
import type { StepperVariants } from '@/components/navigation/Stepper';
import { Accordion } from '@/components/surfaces/Accordion';
import type { AccordionVariants } from '@/components/surfaces/Accordion';
import { Avatar } from '@/components/data-display/Avatar';
import type { AvatarVariants } from '@/components/data-display/Avatar';
import { Card } from '@/components/surfaces/Card';
import { TreeView } from '@/components/tree-view';
import { Code } from '@/components/typography/Code';

void (<Card appearance="soft" />);
// @ts-expect-error Card variant was replaced by appearance.
void (<Card variant="filled" />);

void (<Code variant="block">const value = 1;</Code>);
// @ts-expect-error Code variant changes DOM semantics and cannot be responsive.
void (<Code variant={{ base: 'inline', md: 'block' }}>const value = 1;</Code>);

void (<Accordion appearance="outline">Content</Accordion>);
// @ts-expect-error Accordion variant was replaced by appearance.
void (<Accordion variant="outline">Content</Accordion>);

void (<TreeView data={[]} appearance="soft" />);
// @ts-expect-error TreeView variant was replaced by appearance.
void (<TreeView data={[]} variant="default" />);

void (<Tabs appearance="ghost" />);
// @ts-expect-error Tabs exposes appearance rather than its internal recipe variant.
void (<Tabs variant="line" />);

void (<Sidebar appearance="outline" />);
// @ts-expect-error Sidebar has one canonical floating layout and no public variant.
void (<Sidebar variant="floating" />);

void (<Spinner intent="dark" />);
// @ts-expect-error Spinner variant was replaced by intent.
void (<Spinner variant="dark" />);

void (<CircleProgress value={50} intent="danger" />);
// @ts-expect-error CircleProgress variant was replaced by intent.
void (<CircleProgress value={50} variant="success" />);

void (<Result intent="danger" />);
// @ts-expect-error Result status was replaced by intent.
void (<Result status="error" />);

void (<Tag appearance="soft" intent="success" />);
// @ts-expect-error Tag variant was replaced by appearance.
void (<Tag variant="subtle" />);
// @ts-expect-error Tag colorScheme was replaced by intent.
void (<Tag colorScheme="green" />);

void (<EmptyState appearance="elevated" />);
// @ts-expect-error EmptyState variant was replaced by appearance.
void (<EmptyState variant="elevated" />);

void (<Skeleton intent="light" />);
// @ts-expect-error Skeleton variant was replaced by intent.
void (<Skeleton variant="light" />);

void (<ProgressBar intent="dark" />);
// @ts-expect-error ProgressBar variant was replaced by intent.
void (<ProgressBar variant="dark" />);

// @ts-expect-error Exported Tabs wrapper types do not expose internal recipe variants.
const badTabsVariants: TabsVariants = { variant: 'line' };
// @ts-expect-error Exported ProgressBar wrapper types use intent.
const badProgressBarVariants: ProgressBarVariants = { variant: 'primary' };

void [badTabsVariants, badProgressBarVariants];

const progressBarVariants: ProgressBarVariants = {
  appearance: 'outline',
  intent: 'dark',
  labelPosition: 'top',
};
void (<ProgressBar {...progressBarVariants} />);

const navbarVariants: NavbarVariants = { appearance: 'soft', narrowLayout: 'wrap' };
void (<Navbar {...navbarVariants} />);
// @ts-expect-error Navbar root variants do not expose NavbarContent alignment.
const badNavbarVariants: NavbarVariants = { justify: 'end' };

const accordionVariants: AccordionVariants = { appearance: 'outline' };
void (<Accordion {...accordionVariants}>Content</Accordion>);
// @ts-expect-error Canonical appearance is a scalar public state.
const badAccordionVariants: AccordionVariants = { appearance: { base: 'soft' } };

const paginationVariants: PaginationVariants = { appearance: 'ghost' };
void (<Pagination {...paginationVariants} count={3} page={1} />);
// @ts-expect-error Canonical appearance is a scalar public state.
const badPaginationVariants: PaginationVariants = { appearance: { base: 'soft' } };

const stepperVariants: StepperVariants = {
  appearance: 'outline',
  intent: 'primary',
  orientation: 'vertical',
};
void (<Stepper {...stepperVariants} />);
// @ts-expect-error Stepper orientation controls structure and cannot be responsive.
const badStepperVariants: StepperVariants = { orientation: { base: 'vertical' } };
// @ts-expect-error Stepper orientation controls complete descendant structure.
void (<Stepper orientation={{ base: 'vertical' }} />);

const sidebarVariants: SidebarVariants = { appearance: 'soft', collapsed: true };
void (<Sidebar {...sidebarVariants} />);
// @ts-expect-error Sidebar collapsed state controls descendant accessibility.
const badSidebarVariants: SidebarVariants = { collapsed: { base: true } };

const avatarVariants: AvatarVariants = { shape: 'rounded' };
void (<Avatar {...avatarVariants} name="Ada Lovelace" />);
// @ts-expect-error Avatar shape uses the canonical scalar control vocabulary.
const badAvatarVariants: AvatarVariants = { shape: { base: 'rounded' } };

void [
  badNavbarVariants,
  badAccordionVariants,
  badPaginationVariants,
  badStepperVariants,
  badSidebarVariants,
  badAvatarVariants,
];
