
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export interface DocumentRecord {
  id: number;
  fileName: string;
  extractedText?: string | null;
  summary?: string | null;
  storedFileName?: string | null;
  embeddingJson?: string | null;
}

export interface SearchResult {
  documentId: number;
  fileName: string;
  similarity?: number;
}

export interface QaResponse {
  question: string;
  answer: string;
  sources: SearchResult[];
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  listDocuments: () =>
    request<DocumentRecord[]>("/api/documents"),

  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return request<DocumentRecord>("/api/documents/upload", {
      method: "POST",
      body: formData,
    });
  },

  extractDocument: (id: number) =>
    request<DocumentRecord>(`/api/documents/${id}/extract`, {
      method: "POST",
    }),

  summarizeDocument: (id: number) =>
    request<Record<string, unknown>>(`/api/documents/${id}/summarize`, {
      method: "POST",
    }),

  searchDocuments: (keyword: string) =>
    request<SearchResult[]>(
      `/api/documents/search/semantic?query=${encodeURIComponent(keyword)}`,
    ),

  askDocuments: (question: string) =>
    request<QaResponse>("/api/qa/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    }),
};
