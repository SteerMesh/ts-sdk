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

## License

See repository license.
