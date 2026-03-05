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

export interface BundleSummary {
  id: string;
  [key: string]: unknown;
}

export interface Org {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  orgId: string;
  name: string;
}

export interface PulseEvent {
  id: string;
  projectId: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs?: number;
  costUsd: number;
  packName?: string;
  label?: string;
  timestamp: string;
}

export interface TrackUsageInput {
  projectId: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs?: number;
  packName?: string;
  label?: string;
}

export interface ModelSummary {
  model: string;
  events: number;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
}

export interface PulseSummary {
  projectId: string;
  totalEvents: number;
  totalTokensIn: number;
  totalTokensOut: number;
  totalCostUsd: number;
  byModel: ModelSummary[];
}

export interface PulseBudget {
  projectId: string;
  limitUsd: number;
  spentUsd: number;
  remainingUsd: number;
  batteryPct: number;
  health: 'ok' | 'warning' | 'critical';
}

export interface AuditEntry {
  time: string;
  action: string;
  orgId?: string;
  detail?: string;
}

export interface CreateApiKeyResponse {
  id: string;
  key: string;
  name: string;
}

export interface PackMetadata {
  name: string;
  version: string;
  contentUrl?: string;
}

export class SteerMeshClient {
  constructor(
    private baseUrl: string,
    private apiKey: string
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(this.baseUrl + path, {
      ...init,
      headers: { [API_KEY_HEADER]: this.apiKey, ...init?.headers },
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

  async getPackVersions(name: string): Promise<string[]> {
    const out = await this.request<{ versions: string[] }>(`/packs/${encodeURIComponent(name)}/versions`);
    return out.versions ?? [];
  }

  async getPack(name: string, version: string): Promise<PackMetadata> {
    return this.request<PackMetadata>(`/packs/${encodeURIComponent(name)}/${encodeURIComponent(version)}`);
  }

  async getBundle(bundleId: string): Promise<Bundle> {
    return this.request<Bundle>(`/bundles/${bundleId}`);
  }

  async listOrgs(): Promise<Org[]> {
    const out = await this.request<{ orgs: Org[] }>('/orgs');
    return out.orgs ?? [];
  }

  async createOrg(name: string): Promise<Org> {
    return this.request<Org>('/orgs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  async listProjects(): Promise<Project[]> {
    const out = await this.request<{ projects: Project[] }>('/projects');
    return out.projects ?? [];
  }

  async listProjectsByOrg(orgId: string): Promise<Project[]> {
    const out = await this.request<{ projects: Project[] }>(`/orgs/${encodeURIComponent(orgId)}/projects`);
    return out.projects ?? [];
  }

  async createProject(orgId: string, name: string): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, name }),
    });
  }

  async listBundles(projectId: string): Promise<BundleSummary[]> {
    const out = await this.request<{ bundles: BundleSummary[] }>(`/projects/${encodeURIComponent(projectId)}/bundles`);
    return out.bundles ?? [];
  }

  async listAuditEntries(limit = 50): Promise<AuditEntry[]> {
    const out = await this.request<{ entries: AuditEntry[] }>(`/audit?limit=${limit}`);
    return out.entries ?? [];
  }

  async createApiKey(name: string): Promise<CreateApiKeyResponse> {
    return this.request<CreateApiKeyResponse>('/auth/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  }

  async trackUsage(input: TrackUsageInput): Promise<PulseEvent> {
    return this.request<PulseEvent>('/pulse/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  }

  async listPulseEvents(projectId: string): Promise<PulseEvent[]> {
    const out = await this.request<{ events: PulseEvent[] }>(
      `/pulse/events?projectId=${encodeURIComponent(projectId)}`
    );
    return out.events ?? [];
  }

  async getPulseSummary(projectId: string): Promise<PulseSummary> {
    return this.request<PulseSummary>(
      `/pulse/summary?projectId=${encodeURIComponent(projectId)}`
    );
  }

  async getPulseBudget(projectId: string): Promise<PulseBudget> {
    return this.request<PulseBudget>(
      `/pulse/budget?projectId=${encodeURIComponent(projectId)}`
    );
  }

  async setPulseBudget(projectId: string, limitUsd: number): Promise<PulseBudget> {
    return this.request<PulseBudget>('/pulse/budget', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, limitUsd }),
    });
  }
}
