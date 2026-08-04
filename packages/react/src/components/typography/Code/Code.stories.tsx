import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CopyButton } from '@/components/inputs/CopyButton';
import { Box } from '@/components/layout/Box';
import { Stack } from '@/components/layout/Stack';
import { Code } from '@/components/typography/Code';
import { Heading } from '@/components/typography/Heading';
import { Text } from '@/components/typography/Text';


const meta = {
  title: 'Display/Code',
  component: Code,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box w="[calc(100vw - 3rem)]" maxWidth="100%">
        <Story />
      </Box>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['inline', 'block'],
      description: 'Code display variant',
    },
    language: {
      control: 'text',
      description: 'Programming language for syntax highlighting',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child element (Radix UI Slot)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Text>
      Use the <Code>console.log()</Code> function to debug your code.
    </Text>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Block: Story = {
  render: () => (
    <Code variant="block">
      {`function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`}
    </Code>
  ),
};

export const InlineExamples: Story = {
  render: () => (
    <Stack gap="sm">
      <Text>
        Import React with <Code>import React from &apos;react&apos;;</Code>
      </Text>
      <Text>
        The <Code>useState</Code> hook manages component state.
      </Text>
      <Text>
        Set background color using <Code>backgroundColor: &apos;blue&apos;</Code>
      </Text>
    </Stack>
  ),
};

export const ConstrainedInlineLongToken: Story = {
  render: () => (
    <Stack gap="md">
      <Box width="[80px]" aria-label="Constrained inline code LTR">
        <Text>
          <Code>VeryLongInlineIdentifierWithoutBreakOpportunities</Code>
        </Text>
      </Box>
      <Box width="[80px]" dir="rtl" aria-label="Constrained inline code RTL">
        <Text>
          <Code>VeryLongInlineIdentifierWithoutBreakOpportunities</Code>
        </Text>
      </Box>
    </Stack>
  ),
};

export const BlockExamples: Story = {
  render: () => (
    <Stack gap="md">
      <Stack gap="xs">
        <Text weight="semibold">JavaScript:</Text>
        <Code variant="block" language="javascript">
          {`const sum = (a, b) => a + b;
console.log(sum(5, 3)); // 8`}
        </Code>
      </Stack>

      <Stack gap="xs">
        <Text weight="semibold">TypeScript:</Text>
        <Code variant="block" language="typescript">
          {`interface User {
  name: string;
  age: number;
}`}
        </Code>
      </Stack>

      <Stack gap="xs">
        <Text weight="semibold">CSS:</Text>
        <Code variant="block" language="css">
          {`.container {
  display: flex;
  align-items: center;
}`}
        </Code>
      </Stack>
    </Stack>
  ),
};

export const MultiLine: Story = {
  render: () => (
    <Code variant="block">
      {`// Component Example
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}`}
    </Code>
  ),
};

export const LongCode: Story = {
  render: () => (
    <Code variant="block">
      {`function calculateFibonacci(n) {
  if (n <= 1) return n;
  const fib = [0, 1];
  for (let i = 2; i <= n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib[n];
}`}
    </Code>
  ),
};

export const Copyable: Story = {
  render: () => {
    const codeString = `const greeting = 'Hello, World!';
console.log(greeting);`;

    return (
      <Stack gap="md">
        <Text weight="semibold">Copyable Code Block:</Text>
        <Box position="relative">
          <Code variant="block">{codeString}</Code>
          <Box position="absolute" top="xs" right="xs">
            <CopyButton value={codeString} />
          </Box>
        </Box>
        <Text variant="caption">Click the clipboard icon to copy the code</Text>
      </Stack>
    );
  },
};

export const CopyWithCallback: Story = {
  render: function CopyWithCallbackDemo() {
    const [copyCount, setCopyCount] = useState(0);
    const codeString = `// This code has been copied ${copyCount} times
function example() {
  return 'Copy me!';
}`;

    return (
      <Stack gap="md">
        <Text weight="semibold">Code with Copy Callback:</Text>
        <Box position="relative">
          <Code variant="block">{codeString}</Code>
          <Box position="absolute" top="xs" right="xs">
            <CopyButton value={codeString} onCopy={() => setCopyCount((current) => current + 1)} />
          </Box>
        </Box>
        <Text variant="caption">Copied {copyCount} times</Text>
      </Stack>
    );
  },
};

export const SyntaxHighlighting: Story = {
  render: () => (
    <Stack gap="md">
      <Text weight="semibold">TypeScript with Syntax Highlighting:</Text>
      <Code variant="block" language="typescript">
        {`const greeting: string = "Hello, World!";
const numbers: number[] = [1, 2, 3, 4, 5];

function sum(a: number, b: number): number {
  return a + b;
}`}
      </Code>
    </Stack>
  ),
};

export const AllLanguages: Story = {
  render: () => (
    <Stack gap="sm">
      <Heading level="3">JavaScript</Heading>
      <Code variant="block" language="javascript">
        {`const app = {
  name: 'MyApp',
  version: '1.0.0',
};`}
      </Code>

      <Heading level="3">TypeScript</Heading>
      <Code variant="block" language="typescript">
        {`interface User {
  id: number;
  name: string;
}`}
      </Code>

      <Heading level="3">JSX</Heading>
      <Code variant="block" language="jsx">
        {`function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}`}
      </Code>

      <Heading level="3">JSON</Heading>
      <Code variant="block" language="json">
        {`{
  "name": "poffy-ui",
  "version": "0.2.10"
}`}
      </Code>

      <Heading level="3">Bash</Heading>
      <Code variant="block" language="bash">
        {`npm install
npm test`}
      </Code>
    </Stack>
  ),
};

export const Composition: Story = {
  render: () => {
    const codeString = `import { Code } from '@/components/typography/Code';
import { CopyButton } from '@/components/inputs/CopyButton';

const Example = () => (
  <Box position="relative">
    <Code variant="block" language="tsx">
      {codeString}
    </Code>
    <Box position="absolute" top="xs" right="xs">
      <CopyButton value={codeString} />
    </Box>
  </Box>
);`;

    return (
      <Box position="relative" maxWidth="[600px]">
        <Code variant="block" language="tsx">
          {codeString}
        </Code>
        <Box position="absolute" top="xs" right="xs">
          <CopyButton value={codeString} />
        </Box>
      </Box>
    );
  },
};
