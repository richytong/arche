# Contributing

## Steps to release

1. Bump the repo version

```
npm version patch|minor|major
```

2. Copy `index.js` to `es.js` and `index.mjs`

3. Manually update the code versions and year

4. Commit the changes

```
git commit -m "distribute"
```

5. Publish the new version
```
npm publish
```
