import assert from 'node:assert/strict';
import test from 'node:test';
import { publicPackages, validateReleaseTag } from './check-release-tag.mjs';

const packageNames = publicPackages.map(([name]) => name);

const validState = {
  fixedGroups: [packageNames],
  packageVersions: Object.fromEntries(packageNames.map((name) => [name, '0.2.0'])),
  tag: 'v0.2.0',
};

test('accepts a matching release tag and fixed public package group', () => {
  assert.deepEqual(validateReleaseTag(validState), []);
});

test('rejects tags outside the exact vX.Y.Z format', () => {
  assert.match(
    validateReleaseTag({ ...validState, tag: 'release-0.2.0' }).join('\n'),
    /exact vX\.Y\.Z format/,
  );
});

test('rejects a tag that differs from any public package version', () => {
  const packageVersions = { ...validState.packageVersions, '@poffy-ui/react': '0.2.1' };
  const failures = validateReleaseTag({ ...validState, packageVersions });

  assert.match(failures.join('\n'), /@poffy-ui\/react is 0\.2\.1/);
  assert.match(failures.join('\n'), /must share one version/);
});

test('rejects a changesets fixed group that omits a public package', () => {
  const failures = validateReleaseTag({
    ...validState,
    fixedGroups: [packageNames.slice(0, -1)],
  });

  assert.match(failures.join('\n'), /four public packages in one fixed group/);
});
