const API_KEY_HEADER = 'X-API-Key';

export interface Pack {
  name: string;
  versions: string[];
}

export interface BundleManifest {
  version: string;
  packs: { name: string; version: string }[];
  files: { path: string; sha256: string }[];
}

export interface Bundle {
  id: string;
  manifest: BundleManifest;
  files?: { path: string; url?: string }[];
}

export class SteerMeshClient {
  constructor(
    private baseUrl: string,
    private apiKey: string
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async request<T>(path: string): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      headers: { [API_KEY_HEADER]: this.apiKey },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${text}`);
    }
    return res.json();
  }

  async listPacks(): Promise<Pack[]> {
    const out = await this.request<{ packs: Pack[] }>('/packs');
    return out.packs;
  }

  async getBundle(bundleId: string): Promise<Bundle> {
    return this.request<Bundle>(`/bundles/${bundleId}`);
  }
}
