# SteerMesh TypeScript SDK

TypeScript/JavaScript client for the SteerMesh Cloud API. Use from the dashboard or Node automation.

## Install

```bash
npm install @steermesh/ts-sdk
```

## Usage

```ts
import { SteerMeshClient } from '@steermesh/ts-sdk';

const client = new SteerMeshClient('https://api.steermesh.dev', 'your-api-key');

const packs = await client.listPacks();
const bundle = await client.getBundle('bundle-id');
```

## Error handling

```ts
try {
  const bundles = await client.listBundles();
} catch (error) {
  // handle error
}
```

## Compatibility
The SDK is intended for Node 18+ and modern browsers. Pair versions with the Cloud API you target.

## License

See repository license.
