import type { Preview } from '@storybook/react';
import type { PartialStoryFn, Renderer, StoryContext } from 'storybook/internal/types';
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport';
import { ThemeProvider } from '../packages/react/src/providers/ThemeProvider';
import { css } from '../packages/react/src/styled-system/css';
import '../packages/react/src/styled-system/styles.css';

const storyRootClass = css({
  minHeight: '100vh',
  p: '8',
  bg: 'layout.background',
  color: 'text.primary',
});

/**
 * Wrap every story with the shared theme provider so component tokens resolve
 * the same way they do in the consuming application.
 */
const withTheme = (Story: PartialStoryFn<Renderer>, context: StoryContext<Renderer>) => {
  const { theme, brand } = context.globals;

  return (
    <ThemeProvider
      key={`${theme}-${brand}`}
      defaultBrand={brand}
      defaultColorMode={theme}
      global={false}
    >
      <div className={storyRootClass}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    layout: 'centered',
    viewport: {
      viewports: { ...INITIAL_VIEWPORTS, ...MINIMAL_VIEWPORTS },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  decorators: [withTheme],
  globalTypes: {
    theme: {
      name: 'Theme Mode',
      description: 'Global theme mode (Light/Dark)',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light Mode' },
          { value: 'dark', icon: 'circle', title: 'Dark Mode' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      name: 'Poffy Brand',
      description: 'Switch between Standard Blue and Iconic Pome Orange',
      defaultValue: 'blue',
      toolbar: {
        icon: 'heart',
        items: [
          { value: 'blue', icon: 'beaker', title: 'Standard Blue' },
          { value: 'pome', icon: 'lightning', title: 'Iconic Pome Orange' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
