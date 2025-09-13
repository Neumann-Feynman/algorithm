/**
 * 개별 제출 내역
 */
export interface LeetCodeSubmission {
  /** 문제 이름 (예: "Sparse Matrix Multiplication") */
  title: string;
  /** 문제 식별용 slug (예: "sparse-matrix-multiplication") */
  titleSlug: string;
  /** 제출 시각 (Unix timestamp, 초 단위, 문자열로 제공됨) */
  timestamp: string;
  /** 제출 결과 (예: "Accepted", "Wrong Answer", "Runtime Error") */
  statusDisplay: string;
  /** 사용한 언어 (예: "javascript", "python3") */
  lang: string;
}

/**
 * 전체 제출 내역
 */
export interface LeetCodeSubmissionResponse {
  /** 불러온 제출 개수 */
  count: number;
  /** 제출 내역 배열 */
  submission: LeetCodeSubmission[];
}
