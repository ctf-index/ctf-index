import {
  Walkthrough,
  WalkthroughStatus,
  Category,
  GetWalkthroughsResponse,
  GetAdminWalkthroughsResponse,
  CreateWalkthroughResponse,
  UpdateWalkthroughResponse,
  GetCategoriesResponse,
  DiscoverResponse,
  ReviewActionPayload,
  IngestPayload,
  SearchQueryParams,
} from "@/types/walkthrough";

class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      data.error || data.message || `Request failed with status ${res.status}`,
      res.status,
      data.details || data
    );
  }

  return data as T;
}

export const apiClient = {
  // Public Feed & Search
  async getPublicWalkthroughs(params?: SearchQueryParams): Promise<GetWalkthroughsResponse> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.cursor) searchParams.set("cursor", params.cursor);

    const query = searchParams.toString();
    const endpoint = `/api/walkthroughs${query ? `?${query}` : ""}`;
    return request<GetWalkthroughsResponse>(endpoint);
  },

  // Admin Walkthroughs Queue
  async getAdminWalkthroughs(status: WalkthroughStatus = "pending"): Promise<GetAdminWalkthroughsResponse> {
    return request<GetAdminWalkthroughsResponse>(`/api/admin/walkthroughs?status=${status}`);
  },

  // Admin Add Walkthrough (Ingest)
  async createAdminWalkthrough(payload: IngestPayload): Promise<CreateWalkthroughResponse> {
    return request<CreateWalkthroughResponse>("/api/admin/walkthroughs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Admin Update Walkthrough (Review Action)
  async updateAdminWalkthrough(
    walkthroughId: string,
    payload: Partial<ReviewActionPayload>
  ): Promise<UpdateWalkthroughResponse> {
    return request<UpdateWalkthroughResponse>(`/api/admin/walkthroughs/${walkthroughId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  // Admin Delete Walkthrough
  async deleteAdminWalkthrough(walkthroughId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/admin/walkthroughs/${walkthroughId}`, {
      method: "DELETE",
    });
  },

  // Admin Categories
  async getCategories(): Promise<GetCategoriesResponse> {
    return request<GetCategoriesResponse>("/api/admin/categories");
  },

  async createCategory(name: string): Promise<{ success: boolean; message: string; category: Category }> {
    return request<{ success: boolean; message: string; category: Category }>("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  async updateCategory(
    categoryId: string,
    name: string
  ): Promise<{ success: boolean; message: string; category: Category }> {
    return request<{ success: boolean; message: string; category: Category }>(
      `/api/admin/categories/${categoryId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }
    );
  },

  async deleteCategory(categoryId: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/api/admin/categories/${categoryId}`, {
      method: "DELETE",
    });
  },

  // Admin Discover (SerpApi)
  async discoverWalkthroughs(topic: string, totalWanted: number = 10): Promise<DiscoverResponse> {
    return request<DiscoverResponse>("/api/admin/discover", {
      method: "POST",
      body: JSON.stringify({ topic, totalWanted }),
    });
  },

  // Admin Invite
  async generateAdminInvite(canInviteForNewAdmin: boolean = false): Promise<{ success: boolean; message: string; inviteUrl: string }> {
    return request<{ success: boolean; message: string; inviteUrl: string }>("/api/admin/invite", {
      method: "POST",
      body: JSON.stringify({ canInviteForNewAdmin }),
    });
  },
};
