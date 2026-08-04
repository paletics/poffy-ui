import { Box, Grid, Stack } from '@/components/layout';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { keyframes, poffyPalette, semanticTokens, textStyles } from '@poffy-ui/system';
import React from 'react';


const meta: Meta = {
  title: 'Theme/Tokens',
  tags: ['autodocs'],
  includeStories: ['Palette', 'SemanticColors', 'Typography', 'CjkTypography', 'Animations'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj;

type SemanticTokenTree = Record<string, unknown>;

const strokeDashKeyframes = new Set([
  'circle-dash',
  'pop-spin',
  'refined-dash',
  'breathe',
  'line-dash',
  'edge-dash',
]);

interface SemanticColorToken {
  name: string;
  path: string;
}

const isSemanticTokenLeaf = (token: unknown): token is { value: unknown } =>
  typeof token === 'object' && token !== null && 'value' in token;

const collectSemanticColorTokens = (
  tokens: SemanticTokenTree,
  path: string[] = [],
): SemanticColorToken[] =>
  Object.entries(tokens).flatMap(([name, token]) => {
    const tokenPath = [...path, name];

    if (isSemanticTokenLeaf(token)) {
      return [{ name: tokenPath.join('.'), path: `colors.${tokenPath.join('.')}` }];
    }

    if (typeof token === 'object' && token !== null) {
      return collectSemanticColorTokens(token as SemanticTokenTree, tokenPath);
    }

    return [];
  });

/** Converts a semantic token path into the CSS custom property emitted by the system. */
export const getSemanticColorVariable = (tokenPath: string): string =>
  `var(--poffy-${tokenPath.replaceAll('.', '-')})`;

/** Renders one semantic color token using its emitted CSS custom property. */
export const SemanticColorSwatch = ({ tokenPath }: { tokenPath: string }) => (
  <Box
    data-semantic-token={tokenPath}
    data-testid={`semantic-token-${tokenPath.replaceAll('.', '-')}`}
    w="[3rem]"
    h="[3rem]"
    rounded="full"
    style={{ backgroundColor: getSemanticColorVariable(tokenPath) }}
    borderWidth="thin"
    borderStyle="solid"
    borderColor="layout.divider"
    flexShrink={0}
  />
);

export const Palette: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Primitive color palette. These are the fundamental colors defined by the system package.',
      },
    },
  },
  render: () => (
    <Stack gap="xl" p={{ base: 'base', md: 'xl' }} width="100%" maxWidth="100%" overflowX="hidden">
      {Object.entries(poffyPalette).map(([name, shades]) => (
        <Stack key={name} gap="sm">
          <Box fontWeight="bold" textTransform="capitalize" fontSize="lg">
            {name}
          </Box>
          <Stack direction="row" gap="sm" overflowX="auto" pb="base" maxWidth="100%">
            {Object.entries(shades as Record<string, { value: string }>).map(
              ([shade, { value }]) => (
                <Stack key={shade} gap="2xs" minW="[100px]" flexShrink={0}>
                  <Box
                    w="full"
                    h="[4rem]"
                    rounded="md"
                    borderWidth="thin"
                    borderStyle="solid"
                    borderColor="layout.divider"
                    style={{ backgroundColor: value }}
                  />
                  <Box fontSize="xs" textAlign="center">
                    <Box fontWeight="medium">{shade}</Box>
                    <Box color="text.secondary">{value}</Box>
                  </Box>
                </Stack>
              ),
            )}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
};

export const SemanticColors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Semantic tokens. Maps primitive colors to meaningful UI intents.',
      },
    },
  },
  render: () => {
    const colorGroups = semanticTokens.colors ? Object.entries(semanticTokens.colors) : [];

    return (
      <Stack gap="xl" p="xl" width="100%" maxWidth="100%" minWidth="0" overflowX="hidden">
        {colorGroups.map(([group, tokens]) => (
          <Stack key={group} gap="base">
            <Box
              fontWeight="bold"
              textTransform="capitalize"
              fontSize="xl"
              borderBottomWidth="thin"
              borderStyle="solid"
              borderColor="layout.divider"
              pb="sm"
            >
              {group}
            </Box>
            <Grid gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="base">
              {collectSemanticColorTokens(tokens as SemanticTokenTree, [group]).map(
                ({ name, path: tokenPath }) => {
                  return (
                    <Stack
                      key={tokenPath}
                      gap="sm"
                      direction="row"
                      align="center"
                      p="md"
                      rounded="lg"
                      borderWidth="thin"
                      borderStyle="solid"
                      borderColor="layout.divider"
                    >
                      <SemanticColorSwatch tokenPath={tokenPath} />
                      <Stack gap="none">
                        <Box fontWeight="bold" fontSize="sm">
                          {name}
                        </Box>
                        <Box fontSize="xs" color="text.secondary" wordBreak="break-all">
                          {tokenPath}
                        </Box>
                      </Stack>
                    </Stack>
                  );
                },
              )}
            </Grid>
          </Stack>
        ))}
      </Stack>
    );
  },
};

export const Typography: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Typography styles. Standard text styles across the system.',
      },
    },
  },
  render: () => (
    <Stack gap="lg" p="xl" maxW="[800px]">
      {Object.keys(textStyles).map((styleName) => (
        <Stack
          key={styleName}
          gap="2xs"
          borderBottomWidth="thin"
          borderStyle="solid"
          borderColor="layout.divider"
          pb="base"
        >
          <Box color="text.secondary" fontSize="xs" fontFamily="mono">
            textStyle: {styleName}
          </Box>
          <Box textStyle={styleName as Parameters<typeof Box>[0]['textStyle']}>
            The quick brown fox jumps over the lazy dog.
          </Box>
        </Stack>
      ))}
    </Stack>
  ),
};

export const CjkTypography: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Japanese sample used to verify that the system stack resolves real CJK glyphs in the browser-test environment.',
      },
    },
  },
  render: () => (
    <Stack lang="ja" gap="lg" p="xl" maxW="[800px]">
      <Stack gap="2xs">
        <Box color="text.secondary" fontSize="xs" fontFamily="mono">
          heading / Japanese
        </Box>
        <Box data-testid="cjk-heading-sample" textStyle="h3">
          日本語の見出し：漢字・ひらがな・カタカナ
        </Box>
      </Stack>
      <Stack gap="2xs">
        <Box color="text.secondary" fontSize="xs" fontFamily="mono">
          body / Japanese
        </Box>
        <Box data-testid="cjk-body-sample" textStyle="body1">
          予約時刻は午前9時30分です。0123456789、。「」ー
        </Box>
      </Stack>
    </Stack>
  ),
};

export const Animations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Animation keyframes. Visual demonstration of available animations.',
      },
    },
  },
  render: () => (
    <Grid gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="xl" p="xl">
      {Object.keys(keyframes).map((keyframe) => (
        <Stack
          key={keyframe}
          gap="base"
          p="base"
          borderWidth="thin"
          borderStyle="solid"
          borderColor="layout.divider"
          rounded="lg"
          align="center"
        >
          <Box fontWeight="bold" fontSize="sm">
            {keyframe}
          </Box>

          {!strokeDashKeyframes.has(keyframe) &&
            keyframe !== 'glow' &&
            keyframe !== 'shimmer' &&
            keyframe !== 'progressLoad' && (
              <Box
                w="[5rem]"
                h="[5rem]"
                bg="brand.main"
                rounded="md"
                className={css({
                  animation: `${keyframe} 2s infinite ease-in-out`,
                } as Parameters<typeof css>[0])}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="brand.contrast"
                fontSize="xs"
              >
                Demo
              </Box>
            )}

          {strokeDashKeyframes.has(keyframe) ? (
            <svg
              data-testid={`theme-stroke-dash-${keyframe}`}
              width="40"
              height="40"
              viewBox="0 0 40 40"
              style={{ '--circumference': '100' } as React.CSSProperties}
            >
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="100"
                style={{
                  color: 'var(--poffy-colors-brand-main)',
                  animation: `${keyframe} 2s infinite linear`,
                }}
              />
            </svg>
          ) : null}

          {keyframe === 'progressLoad' && (
            <Box
              data-testid="theme-progress-load-track"
              w="full"
              h="[2rem]"
              bg="layout.background"
              rounded="md"
              overflow="hidden"
            >
              <Box
                w="[70.7%]"
                h="full"
                bg="brand.main"
                className={css({
                  animation: 'progressLoad 2s infinite ease-in-out',
                })}
              />
            </Box>
          )}

          {keyframe === 'glow' && (
            <Box
              style={
                {
                  '--btn-glow-color': 'var(--poffy-colors-brand-main)',
                } as React.CSSProperties
              }
              w="[4rem]"
              h="[2rem]"
              bg="brand.main"
              rounded="md"
              className={css({
                animationName: 'glow',
                animationDuration: '[2s]',
                animationIterationCount: 'infinite',
              } as unknown as Parameters<typeof css>[0])}
            />
          )}

          {keyframe === 'shimmer' && (
            <Box
              w="full"
              h="[2rem]"
              bg="slate.200"
              rounded="md"
              overflow="hidden"
              position="relative"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                w="full"
                h="full"
                bg="[linear-gradient(to_right,transparent,var(--poffy-colors-layout-surface),transparent)]"
                className={css({
                  animationName: 'shimmer',
                  animationDuration: '[2s]',
                  animationIterationCount: 'infinite',
                } as unknown as Parameters<typeof css>[0])}
              />
            </Box>
          )}
        </Stack>
      ))}
    </Grid>
  ),
};
