import { Box, Grid, Stack } from '@/components/layout';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { keyframes, poffyPalette, semanticTokens, textStyles } from '@poffy-ui/system';
import React from 'react';

/**
 * Visual catalog of all design tokens defined in the system package.
 * Covers primitive palette, semantic color mappings, typography scales, and animation keyframes.
 *
 * ### AI Context & Architecture
 * - **Tier**: N/A (token documentation, not a component)
 * - **Stack**: @poffy-ui/system (poffyPalette, semanticTokens, textStyles, keyframes), Panda CSS
 */
const meta: Meta = {
  title: 'Theme/Tokens',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

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
    <Stack gap="8" p="8">
      {Object.entries(poffyPalette).map(([name, shades]) => (
        <Stack key={name} gap="2">
          <Box fontWeight="bold" textTransform="capitalize" fontSize="lg">
            {name}
          </Box>
          <Stack direction="row" gap="2" overflowX="auto" pb="4">
            {Object.entries(shades as Record<string, { value: string }>).map(
              ([shade, { value }]) => (
                <Stack key={shade} gap="1" minW="[100px]" flexShrink={0}>
                  <Box
                    w="full"
                    h="16"
                    rounded="md"
                    borderWidth="1px"
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
      <Stack gap="8" p="8">
        {colorGroups.map(([group, tokens]) => (
          <Stack key={group} gap="4">
            <Box
              fontWeight="bold"
              textTransform="capitalize"
              fontSize="xl"
              borderBottomWidth="1px"
              borderStyle="solid"
              borderColor="layout.divider"
              pb="2"
            >
              {group}
            </Box>
            <Grid gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="4">
              {Object.entries(tokens as Record<string, unknown>).map(([tokenName]) => {
                const tokenPath = `colors.${group}.${tokenName}`;
                return (
                  <Stack
                    key={tokenName}
                    gap="2"
                    direction="row"
                    align="center"
                    p="3"
                    rounded="lg"
                    borderWidth="1px"
                    borderStyle="solid"
                    borderColor="layout.divider"
                  >
                    <Box
                      w="12"
                      h="12"
                      rounded="full"
                      bg={tokenPath as Parameters<typeof Box>[0]['bg']}
                      borderWidth="1px"
                      borderStyle="solid"
                      borderColor="layout.divider"
                      flexShrink={0}
                    />
                    <Stack gap="0">
                      <Box fontWeight="bold" fontSize="sm">
                        {tokenName}
                      </Box>
                      <Box fontSize="xs" color="text.secondary" wordBreak="break-all">
                        {tokenPath}
                      </Box>
                    </Stack>
                  </Stack>
                );
              })}
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
    <Stack gap="6" p="8" maxW="[800px]">
      {Object.keys(textStyles).map((styleName) => (
        <Stack
          key={styleName}
          gap="1"
          borderBottomWidth="1px"
          borderStyle="solid"
          borderColor="layout.divider"
          pb="4"
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

export const Animations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Animation keyframes. Visual demonstration of available animations.',
      },
    },
  },
  render: () => (
    <Grid gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap="8" p="8">
      {Object.keys(keyframes).map((keyframe) => (
        <Stack
          key={keyframe}
          gap="4"
          p="4"
          borderWidth="1px"
          borderStyle="solid"
          borderColor="layout.divider"
          rounded="lg"
          align="center"
        >
          <Box fontWeight="bold" fontSize="sm">
            {keyframe}
          </Box>

          <Box
            w="20"
            h="20"
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

          {keyframe === 'circle-dash' || keyframe === 'pop-spin' || keyframe === 'refined-dash' ? (
            <svg
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
                style={{
                  color: 'var(--colors-brand-main)',
                  animation: `${keyframe} 2s infinite linear`,
                }}
              />
            </svg>
          ) : null}

          {keyframe === 'glow' && (
            <Box
              style={{ '--btn-glow-color': 'var(--colors-brand-main)' } as React.CSSProperties}
              w="16"
              h="8"
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
            <Box w="full" h="8" bg="slate.200" rounded="md" overflow="hidden" position="relative">
              <Box
                position="absolute"
                top="0"
                left="0"
                w="full"
                h="full"
                bg="[linear-gradient(to right, transparent, white, transparent)]"
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
