export interface Job {
  job_title: string;
  company: string;
  location: string;
  sponsorship_details: string;
}

export interface QueryResponse {
  summary: string;
  relevant_jobs: Job[];
}

export interface UploadResponse {
  message: string;
  num_jobs: number;
}