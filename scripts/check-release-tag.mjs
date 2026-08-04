import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const publicPackages = [
  ['@poffy-ui/react', 'packages/react/package.json'],
  ['@poffy-ui/system', 'packages/system/package.json'],
  ['@poffy-ui/behavior', 'packages/behavior/package.json'],
  ['@poffy-ui/types', 'packages/types/package.json'],
];

const releaseTagPattern = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

const sameMembers = (actual, expected) =>
  actual.length === expected.length &&
  [...actual].sort().every((member, index) => member === [...expected].sort()[index]);

export function validateReleaseTag({ fixedGroups, packageVersions, tag }) {
  const match = releaseTagPattern.exec(tag);
  if (!match) {
    return [`Release tag "${tag}" must use the exact vX.Y.Z format.`];
  }

  const expectedNames = publicPackages.map(([name]) => name);
  const hasExpectedFixedGroup = fixedGroups.some(
    (group) => Array.isArray(group) && sameMembers(group, expectedNames),
  );
  const failures = [];

  if (!hasExpectedFixedGroup) {
    failures.push(
      `Changesets must keep the four public packages in one fixed group: ${expectedNames.join(
        ', ',
      )}.`,
    );
  }

  const tagVersion = tag.slice(1);
  for (const packageName of expectedNames) {
    const packageVersion = packageVersions[packageName];
    if (packageVersion === undefined) {
      failures.push(`Missing version for public package ${packageName}.`);
    } else if (packageVersion !== tagVersion) {
      failures.push(
        `${packageName} is ${packageVersion}, but release tag ${tag} requires ${tagVersion}.`,
      );
    }
  }

  const distinctVersions = new Set(Object.values(packageVersions));
  if (distinctVersions.size > 1) {
    failures.push(
      `Fixed public packages must share one version; found ${[...distinctVersions].join(', ')}.`,
    );
  }

  return failures;
}

export function readReleaseState(root = repoRoot) {
  const changesetConfig = JSON.parse(
    fs.readFileSync(path.join(root, '.changeset/config.json'), 'utf8'),
  );
  const packageVersions = Object.fromEntries(
    publicPackages.map(([expectedName, relativePath]) => {
      const manifest = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
      if (manifest.name !== expectedName) {
        throw new Error(
          `${relativePath} must declare ${expectedName}; found ${String(manifest.name)}.`,
        );
      }
      return [expectedName, manifest.version];
    }),
  );

  return {
    fixedGroups: changesetConfig.fixed ?? [],
    packageVersions,
  };
}

export function runReleaseTagCheck(tag, root = repoRoot) {
  const failures = validateReleaseTag({ ...readReleaseState(root), tag });
  if (failures.length > 0) {
    throw new Error(
      `Release tag validation failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`,
    );
  }
}

const isDirectRun =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const tag =
    process.argv.slice(2).find((argument) => argument !== '--') ??
    process.env.GITHUB_REF_NAME ??
    '';
  try {
    runReleaseTagCheck(tag);
    console.log(`Release tag ${tag} matches all fixed public package versions.`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
