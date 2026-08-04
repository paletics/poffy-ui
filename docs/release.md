# Release

Poffy UI publishes npm packages from GitHub Actions through npm Trusted Publishing.
Do not create or store an `NPM_TOKEN` for release publishing.

## npm Setup

Configure a Trusted Publisher for each public package:

- `@poffy-ui/react`
- `@poffy-ui/system`
- `@poffy-ui/behavior`
- `@poffy-ui/types`

Use these npm Trusted Publisher settings:

- Publisher: GitHub Actions
- Organization or user: `paletics`
- Repository: `poffy-ui`
- Workflow filename: `npm_package.yml`
- Environment name: `npm-release`

Trusted Publisher setup requires the package to already exist on npm. For the
first ever publish of a package name, publish a bootstrap-only `0.0.1` package
manually with an npm account that requires 2FA. Do not add a publish token to
GitHub for this bootstrap publish. After the package exists, configure Trusted
Publishing before the `0.1.0` release.

Generate the bootstrap package folders:

```bash
pnpm release:bootstrap-packages
```

Review the generated files under `/tmp/poffy-ui-npm-bootstrap`, then publish
each package with 2FA:

```bash
npm publish /tmp/poffy-ui-npm-bootstrap/types --access public
npm publish /tmp/poffy-ui-npm-bootstrap/system --access public
npm publish /tmp/poffy-ui-npm-bootstrap/behavior --access public
npm publish /tmp/poffy-ui-npm-bootstrap/react --access public
```

After the first trusted publish succeeds, set each package's publishing access to
require two-factor authentication and disallow tokens. Revoke any existing
automation publish tokens.

## GitHub Setup

Create the `npm-release` environment in GitHub repository settings and require
manual approval from trusted maintainers. The release workflow uses this
environment before publishing.

Protect release tags matching `v*` so only trusted maintainers can create or
update release tags.

## Release Flow

1. Create or confirm a changeset and inspect it with `pnpm changeset:status`.
2. Complete the normal CI checks, including `pnpm build:storybook`.
3. Run `pnpm changeset:version`.
4. Confirm the intended tag against the versioned fixed package group, for
   example `pnpm check:release-tag -- v0.2.0`.
5. Commit the version changes to `main`.
6. Tag that commit as `vX.Y.Z`.
7. Push `main` and the tag.

The `Release` workflow rejects a tag whose version differs from any of the four
fixed public package versions. It also verifies from the fetched local Git
history that the tagged commit belongs to `main`; the guard does not contact the
remote during validation. The workflow then runs the release checks and
publishes with OIDC-backed Trusted Publishing.
