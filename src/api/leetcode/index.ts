import { API_BASE } from "../../config/env";
import type { LeetCodeSubmissionResponse } from "./types";

export async function fetchRecentAccepted(limit = 20, username: string): Promise<LeetCodeSubmissionResponse> {
  const url = `${API_BASE}/${encodeURIComponent(username)}/acSubmission?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LeetCode API failed (${username}): ${res.status} ${body}`);
  }
  return res.json() as Promise<LeetCodeSubmissionResponse>;
}
