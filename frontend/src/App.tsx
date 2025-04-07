import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Job, QueryResponse, UploadResponse } from './types';
import './App.css';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const uploadFile = e.target.files[0];
    setFile(uploadFile);
    setError(null);

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data: UploadResponse = await response.json();
      console.log(`Successfully uploaded file with ${data.num_jobs} jobs`);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: QueryResponse = await response.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Search Assistant</h1>
        <p>Find software engineering jobs with sponsorship details</p>
      </header>

      <main className="App-main">
        <section className="upload-section">
          <h2>Upload Job Data</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input"
          />
          {file && <p>Selected file: {file.name}</p>}
        </section>

        <section className="query-section">
          <h2>Ask Questions</h2>
          <form onSubmit={handleQuery} className="query-form">
            <input
              type="text"
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="e.g., Which companies offer sponsorship in California?"
              className="query-input"
            />
            <button type="submit" disabled={loading || !file}>
              Search
            </button>
          </form>
        </section>

        {error && <div className="error-message">{error}</div>}

        {loading && <div className="loading">Loading...</div>}

        {response && (
          <section className="results-section">
            <h2>Results</h2>
            <div className="summary">
              <h3>Summary</h3>
              <p>{response.summary}</p>
            </div>
            <div className="relevant-jobs">
              <h3>Relevant Jobs</h3>
              {response.relevant_jobs.map((job: Job, index: number) => (
                <div key={index} className="job-card">
                  <h4>{job.job_title}</h4>
                  <p><strong>Company:</strong> {job.company}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Sponsorship:</strong> {job.sponsorship_details}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;