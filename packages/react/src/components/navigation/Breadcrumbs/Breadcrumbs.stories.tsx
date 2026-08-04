import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs, BreadcrumbItem, BreadcrumbLink } from '.';
import { Box } from '@/components/layout';


const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['plain', 'background'] },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Category</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink isCurrentPage>Current Page</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const CustomSeparator: Story = {
  render: (args) => (
    <Breadcrumbs {...args} separator="-">
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Category</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink isCurrentPage>Current Page</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const BackgroundVariant: Story = {
  args: {
    variant: 'background',
  },
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Docs</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink isCurrentPage>Breadcrumbs</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const ConstrainedLongTrail: Story = {
  render: () => (
    <Box width="[17.5rem]">
      <Breadcrumbs>
        {['Home', 'Organization', 'International Projects', 'Design System', 'Components'].map(
          (label) => (
            <BreadcrumbItem key={label}>
              <BreadcrumbLink href="#">{label}</BreadcrumbLink>
            </BreadcrumbItem>
          ),
        )}
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>UnusuallyLongCurrentPageIdentifier</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>
    </Box>
  ),
};

export const ConstrainedLongTrailRtl: Story = {
  render: () => (
    <div dir="rtl">
      <Box width="[17.5rem]">
        <Breadcrumbs>
          {['בית', 'ארגון', 'פרויקטים בינלאומיים', 'מערכת עיצוב', 'רכיבים'].map((label) => (
            <BreadcrumbItem key={label}>
              <BreadcrumbLink href="#">{label}</BreadcrumbLink>
            </BreadcrumbItem>
          ))}
          <BreadcrumbItem>
            <BreadcrumbLink isCurrentPage>מזההדףהנוכחיהארוךבמיוחד</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumbs>
      </Box>
    </div>
  ),
};
