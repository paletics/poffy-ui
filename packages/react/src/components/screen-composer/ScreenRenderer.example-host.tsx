/* eslint-disable @typescript-eslint/dot-notation -- JSON records require indexed access. */
import { coreScreenExtension, createScreenRegistry } from '@poffy-ui/behavior/screen-composer';
import type {
  ScreenExtension,
  ScreenJsonValue,
  ScreenNode,
} from '@poffy-ui/behavior/screen-composer';
import { Button } from '@/components/inputs';
import { Table } from '@/components/data-display';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/surfaces';
import { css } from '@/styled-system/css';
import { coreScreenRendererExtension } from './ScreenRenderer';
import type { ScreenRendererExtension } from './ScreenRenderer.types';
import { createScreenRendererRegistry } from './createScreenRendererRegistry';

const cardClass = css({ display: 'grid', gap: 'sm', height: 'full' });
const heroClass = css({ display: 'grid', gap: 'md', paddingBlock: '2xl' });
const detailListClass = css({ display: 'grid', gridTemplateColumns: '[auto 1fr]', gap: 'sm' });
const priceClass = css({ fontWeight: 'bold', color: 'text.primary' });
const metricValueClass = css({ fontSize: '2xl', fontWeight: 'bold' });
const featureDescriptionClass = css({ color: 'text.secondary' });
const tableClass = css({
  minInlineSize: '[max-content]',
  borderCollapse: 'collapse',
  '& :is(th, td)': {
    paddingBlock: 'xs',
    paddingInline: 'sm',
    textAlign: 'start',
    whiteSpace: 'nowrap',
  },
});
const statusClasses = {
  success: css({ color: 'variants.success.main', fontWeight: 'semibold' }),
  warning: css({ color: 'variants.warning.main', fontWeight: 'semibold' }),
  danger: css({ color: 'variants.danger.main', fontWeight: 'semibold' }),
  neutral: css({ color: 'text.secondary', fontWeight: 'semibold' }),
} as const;

const hasOnly = (props: Readonly<Record<string, ScreenJsonValue>> | undefined, keys: string[]) =>
  Object.keys(props ?? {}).every((key) => keys.includes(key));
const nonEmptyString = (value: ScreenJsonValue | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const strings =
  (keys: string[]) => (props: Readonly<Record<string, ScreenJsonValue>> | undefined) =>
    hasOnly(props, keys) && keys.every((key) => nonEmptyString(props?.[key]));
const string = (node: ScreenNode, key: string) =>
  typeof node.props?.[key] === 'string' ? node.props[key] : '';
const record = (
  value: ScreenJsonValue | undefined,
): value is Readonly<Record<string, ScreenJsonValue>> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const tableCell = (cells: Readonly<Record<string, ScreenJsonValue>>, id: string): string => {
  const value = cells[id];
  return typeof value === 'string' ? value : '';
};
const hasUnique = (values: readonly string[]) => new Set(values).size === values.length;
const hasExactKeys = (value: Readonly<Record<string, ScreenJsonValue>>, keys: readonly string[]) =>
  Object.keys(value).length === keys.length && keys.every((key) => key in value);
const validateDetailItems = (props: Readonly<Record<string, ScreenJsonValue>> | undefined) => {
  const items = props?.['items'];
  if (!hasOnly(props, ['items']) || !Array.isArray(items) || items.length === 0)
    return ['items must be a non-empty array.'];
  const valid = items.every(
    (item) =>
      record(item) &&
      hasExactKeys(item, ['label', 'value']) &&
      nonEmptyString(item['label']) &&
      nonEmptyString(item['value']),
  );
  return valid && hasUnique(items.map((item) => (item as Record<string, string>)['label']))
    ? []
    : ['items must have unique, non-empty label and value strings.'];
};
const isValidTableRow = (row: ScreenJsonValue, columnIds: readonly string[]) => {
  if (!record(row) || !hasExactKeys(row, ['id', 'cells']) || !nonEmptyString(row['id']))
    return false;
  const cells = row['cells'];
  if (!record(cells) || !hasExactKeys(cells, columnIds)) return false;
  return columnIds.every((id) => nonEmptyString(cells[id]));
};
const validateTable = (props: Readonly<Record<string, ScreenJsonValue>> | undefined) => {
  const caption = props?.['caption'];
  const columns = props?.['columns'];
  const rows = props?.['rows'];
  const rowHeaderColumnId = props?.['rowHeaderColumnId'];
  if (
    !hasOnly(props, ['caption', 'columns', 'rows', 'rowHeaderColumnId']) ||
    !nonEmptyString(caption) ||
    !nonEmptyString(rowHeaderColumnId) ||
    !Array.isArray(columns) ||
    !Array.isArray(rows) ||
    columns.length === 0
  )
    return ['caption, columns, rows, and rowHeaderColumnId are required.'];
  const validColumns = columns.every(
    (column) =>
      record(column) &&
      hasExactKeys(column, ['id', 'label']) &&
      nonEmptyString(column['id']) &&
      nonEmptyString(column['label']),
  );
  if (
    !validColumns ||
    !hasUnique(columns.map((column) => (column as Record<string, string>)['id']))
  )
    return ['columns must have unique, non-empty id and label strings.'];
  const columnIds = columns.map((column) => (column as Record<string, string>)['id']);
  if (!columnIds.includes(rowHeaderColumnId))
    return ['rowHeaderColumnId must identify a declared column.'];
  const validRows = rows.every((row) => isValidTableRow(row, columnIds));
  return validRows && hasUnique(rows.map((row) => (row as Record<string, string>)['id']))
    ? []
    : ['rows must have unique ids and a non-empty string cell for every column.'];
};

const hostSchemaExtension: ScreenExtension = {
  id: 'storybook-example-host',
  namespace: 'app',
  nodes: [
    {
      type: 'app.product-card',
      version: 1,
      validateProps: (props) =>
        strings(['name', 'price', 'actionId'])(props)
          ? []
          : ['name, price, and actionId are required string props.'],
    },
    {
      type: 'app.landing-hero',
      version: 1,
      allowsChildren: true,
      validateProps: (props) =>
        hasOnly(props, ['title', 'summary', 'eyebrow']) &&
        nonEmptyString(props?.['title']) &&
        nonEmptyString(props?.['summary']) &&
        (props?.['eyebrow'] === undefined || nonEmptyString(props['eyebrow']))
          ? []
          : ['title and summary are required; eyebrow is an optional non-empty string.'],
    },
    {
      type: 'app.feature-card',
      version: 1,
      validateProps: (props) =>
        strings(['title', 'description'])(props)
          ? []
          : ['title and description are required string props.'],
    },
    {
      type: 'app.metric',
      version: 1,
      validateProps: (props) =>
        strings(['label', 'value', 'description'])(props)
          ? []
          : ['label, value, and description are required string props.'],
    },
    {
      type: 'app.status',
      version: 1,
      validateProps: (props) =>
        strings(['label', 'tone'])(props) &&
        ['success', 'warning', 'danger', 'neutral'].includes(props?.['tone'] as string)
          ? []
          : ['label and a supported tone are required.'],
    },
    {
      type: 'app.key-value-list',
      version: 1,
      validateProps: validateDetailItems,
    },
    {
      type: 'app.record-table',
      version: 1,
      validateProps: validateTable,
    },
  ],
};

const detailItems = (node: ScreenNode) =>
  ((node.props?.['items'] ?? []) as readonly Readonly<Record<string, string>>[]).map((item) => ({
    label: item['label'],
    value: item['value'],
  }));
const columns = (node: ScreenNode) =>
  ((node.props?.['columns'] ?? []) as readonly Readonly<Record<string, string>>[]).map((item) => ({
    id: item['id'],
    label: item['label'],
  }));
const rows = (node: ScreenNode) =>
  ((node.props?.['rows'] ?? []) as readonly Readonly<Record<string, ScreenJsonValue>>[]).map(
    (item) => ({
      id: item['id'] as string,
      cells: item['cells'] as Readonly<Record<string, ScreenJsonValue>>,
    }),
  );

const hostRendererExtension: ScreenRendererExtension = {
  id: 'storybook-example-host',
  namespace: 'app',
  renderers: [
    {
      type: 'app.product-card',
      version: 1,
      render: (node, context) => (
        <Card asChild appearance="outline">
          <article className={cardClass} aria-labelledby={`${node.id}-title`}>
            <CardHeader>
              <h3 id={`${node.id}-title`}>{string(node, 'name')}</h3>
            </CardHeader>
            <CardBody>
              <p className={priceClass}>{string(node, 'price')}</p>
            </CardBody>
            <CardFooter>
              <Button onClick={() => context.dispatchAction(string(node, 'actionId'), node)}>
                Add {string(node, 'name')} to cart
              </Button>
            </CardFooter>
          </article>
        </Card>
      ),
    },
    {
      type: 'app.landing-hero',
      version: 1,
      render: (node, context) => (
        <header className={heroClass}>
          <p>{string(node, 'eyebrow')}</p>
          <h1>{string(node, 'title')}</h1>
          <p>{string(node, 'summary')}</p>
          <div role="group" aria-label="Get started">
            {context.renderChildren(node)}
          </div>
        </header>
      ),
    },
    {
      type: 'app.feature-card',
      version: 1,
      render: (node) => (
        <Card asChild appearance="outline">
          <article className={cardClass} aria-labelledby={`${node.id}-title`}>
            <CardHeader>
              <h3 id={`${node.id}-title`}>{string(node, 'title')}</h3>
            </CardHeader>
            <CardBody>
              <p className={featureDescriptionClass}>{string(node, 'description')}</p>
            </CardBody>
          </article>
        </Card>
      ),
    },
    {
      type: 'app.metric',
      version: 1,
      render: (node) => (
        <Card>
          <CardHeader>{string(node, 'label')}</CardHeader>
          <CardBody>
            <p className={metricValueClass}>{string(node, 'value')}</p>
            <p>{string(node, 'description')}</p>
          </CardBody>
        </Card>
      ),
    },
    {
      type: 'app.status',
      version: 1,
      render: (node) => (
        <p
          className={
            statusClasses[string(node, 'tone') as keyof typeof statusClasses] ??
            statusClasses.neutral
          }
        >
          {string(node, 'label')}
        </p>
      ),
    },
    {
      type: 'app.key-value-list',
      version: 1,
      render: (node) => (
        <dl className={detailListClass}>
          {detailItems(node).flatMap((item) => [
            <dt key={`${item.label}-term`}>{item.label}</dt>,
            <dd key={`${item.label}-value`}>{item.value}</dd>,
          ])}
        </dl>
      ),
    },
    {
      type: 'app.record-table',
      version: 1,
      render: (node) => {
        const tableColumns = columns(node);
        const caption = string(node, 'caption');
        return (
          <Table.ScrollContainer aria-label={caption}>
            <table className={tableClass}>
              <caption>{caption}</caption>
              <thead>
                <tr>
                  {tableColumns.map((column) => (
                    <th key={column.id} scope="col">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows(node).map((row) => (
                  <tr key={row.id}>
                    {tableColumns.map((column) =>
                      column.id === string(node, 'rowHeaderColumnId') ? (
                        <th key={column.id} scope="row">
                          {tableCell(row.cells, column.id)}
                        </th>
                      ) : (
                        <td key={column.id}>{tableCell(row.cells, column.id)}</td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Table.ScrollContainer>
        );
      },
    },
  ],
};

const schema = createScreenRegistry([coreScreenExtension, hostSchemaExtension]);
if (!schema.ok)
  throw new Error(schema.issues[0]?.message ?? 'Unable to create example schema registry.');
const renderers = createScreenRendererRegistry(schema.registry, [
  coreScreenRendererExtension,
  hostRendererExtension,
]);
if (!renderers.ok)
  throw new Error(renderers.issues[0]?.message ?? 'Unable to create example renderer registry.');
export const exampleRegistries = {
  schemaRegistry: schema.registry,
  rendererRegistry: renderers.registry,
};
