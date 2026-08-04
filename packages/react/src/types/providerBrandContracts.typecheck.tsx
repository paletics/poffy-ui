import { PoffyBrandProvider, ThemeProvider, useBrand } from '@/providers';
import type { BrandProviderProps, ThemeProviderProps } from '@/providers';

void (
  <PoffyBrandProvider initialBrand="custom" customBrand={{ main: '#8B5CF6' }}>
    Content
  </PoffyBrandProvider>
);
void (<PoffyBrandProvider initialBrand="blue">Content</PoffyBrandProvider>);
// @ts-expect-error Custom providers require a palette.
void (<PoffyBrandProvider initialBrand="custom">Content</PoffyBrandProvider>);
// @ts-expect-error Built-in providers do not accept a custom palette.
const invalidBuiltInBrandProvider: BrandProviderProps = {
  children: 'Content',
  initialBrand: 'pome',
  customBrand: { main: '#8B5CF6' },
};

void (
  <ThemeProvider defaultBrand="custom" customBrand={{ main: '#8B5CF6' }}>
    Content
  </ThemeProvider>
);
void (<ThemeProvider defaultBrand="blue">Content</ThemeProvider>);
// @ts-expect-error A custom theme requires a palette.
void (<ThemeProvider defaultBrand="custom">Content</ThemeProvider>);
// @ts-expect-error A built-in theme does not accept custom colors.
const invalidBuiltInThemeProvider: ThemeProviderProps = {
  children: 'Content',
  defaultBrand: 'blue',
  customBrand: { main: '#8B5CF6' },
};

const BrandControls = () => {
  const { setBrand, setCustomBrand } = useBrand();
  setBrand('pome');
  setCustomBrand({ main: '#8B5CF6' });
  // @ts-expect-error Custom brands must be activated with their palette.
  setBrand('custom');
  return null;
};

void [BrandControls, invalidBuiltInBrandProvider, invalidBuiltInThemeProvider];
