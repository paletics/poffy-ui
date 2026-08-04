const MAX_GRID_COLUMNS = 1_000;
const CSS_LENGTH_UNITS = [
  'cap',
  'ch',
  'cm',
  'cqb',
  'cqh',
  'cqi',
  'cqmax',
  'cqmin',
  'cqw',
  'dvb',
  'dvh',
  'dvi',
  'dvmax',
  'dvmin',
  'dvw',
  'em',
  'ex',
  'ic',
  'in',
  'lh',
  'lvb',
  'lvh',
  'lvi',
  'lvmax',
  'lvmin',
  'lvw',
  'mm',
  'pc',
  'pt',
  'px',
  'q',
  'rcap',
  'rch',
  'rem',
  'rex',
  'ric',
  'rlh',
  'svb',
  'svh',
  'svi',
  'svmax',
  'svmin',
  'svw',
  'vb',
  'vh',
  'vi',
  'vmax',
  'vmin',
  'vw',
] as const;
const CSS_NUMBER_PATTERN = String.raw`[+]?(?:\d+(?:\.\d*)?|\.\d+)`;
const CSS_LENGTH_PERCENTAGE_PATTERN = new RegExp(
  String.raw`^(${CSS_NUMBER_PATTERN})(${CSS_LENGTH_UNITS.join('|')}|%)$`,
  'i',
);
const CSS_LENGTH_FUNCTION_PATTERN =
  /^(?:abs|anchor-size|calc|clamp|env|hypot|max|min|mod|rem|round|var)\(/i;

interface RuntimeEnv {
  process?: { env?: { NODE_ENV?: string } };
}

const warnInvalidGridValue = (componentName: string, message: string) => {
  const nodeEnv = (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'];
  if (nodeEnv !== 'production') {
    console.warn(`[${componentName}] ${message}`);
  }
};

const hasBalancedParentheses = (value: string) => {
  let depth = 0;
  for (const character of value) {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
};

const isCSSLengthPercentage = (value: string) => {
  const dimension = CSS_LENGTH_PERCENTAGE_PATTERN.exec(value);
  if (dimension) return Number(dimension[1]) > 0;

  const openingParenthesis = value.indexOf('(');
  return (
    CSS_LENGTH_FUNCTION_PATTERN.test(value) &&
    value.endsWith(')') &&
    value.slice(openingParenthesis + 1, -1).trim().length > 0 &&
    !/[;{}]/.test(value) &&
    hasBalancedParentheses(value)
  );
};

export const normalizeGridColumns = (value: number | undefined, componentName: string) => {
  if (value === undefined) return undefined;
  if (Number.isSafeInteger(value) && value > 0 && value <= MAX_GRID_COLUMNS) return value;

  warnInvalidGridValue(
    componentName,
    `\`columns\` must be a positive safe integer no greater than ${MAX_GRID_COLUMNS}; the invalid value was ignored.`,
  );
  return undefined;
};

export const normalizeMinChildWidth = (
  value: string | number | undefined,
  componentName: string,
) => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') {
    if (Number.isFinite(value) && value > 0) return `${value}px`;

    warnInvalidGridValue(
      componentName,
      '`minChildWidth` must be a finite positive number; the invalid value was ignored.',
    );
    return undefined;
  }

  const normalizedValue = value.trim();
  if (isCSSLengthPercentage(normalizedValue)) return normalizedValue;

  warnInvalidGridValue(
    componentName,
    '`minChildWidth` must be a non-empty CSS length-percentage; the invalid value was ignored.',
  );
  return undefined;
};
