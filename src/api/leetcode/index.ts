import { API_BASE, LEETCODE_USERNAME } from "../../config/env";
import type { LeetCodeSubmissionResponse } from "./types";

export async function fetchRecentAccepted(limit = 20, username = LEETCODE_USERNAME): Promise<LeetCodeSubmissionResponse> {
  const url = `${API_BASE}/${encodeURIComponent(username)}/acSubmission?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`LeetCode API failed: ${res.status} ${body}`);
  }
  return res.json() as Promise<LeetCodeSubmissionResponse>;
}
