from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Optional
import os
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

app = FastAPI(title="Job Search Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Global variable to store the job data
job_data = None
job_embeddings = None

class Query(BaseModel):
    text: str

class JobResponse(BaseModel):
    summary: str
    relevant_jobs: List[dict]

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global job_data, job_embeddings
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        # Read the CSV file
        df = pd.read_csv(file.file)
        required_columns = ['job_title', 'company', 'location', 'sponsorship_details']
        
        if not all(col in df.columns for col in required_columns):
            raise HTTPException(
                status_code=400,
                detail="CSV must contain columns: job_title, company, location, sponsorship_details"
            )
        
        # Store the data
        job_data = df.to_dict('records')
        
        # Create embeddings for all job descriptions
        job_texts = [
            f"{job['job_title']} at {job['company']} in {job['location']}. {job['sponsorship_details']}"
            for job in job_data
        ]
        job_embeddings = model.encode(job_texts)
        
        return {"message": "File uploaded successfully", "num_jobs": len(job_data)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=JobResponse)
async def query_jobs(query: Query):
    print(f"Received query: {query.text}")
    
    if job_data is None or job_embeddings is None:
        print("No job data available")
        raise HTTPException(status_code=400, detail="Please upload a job data file first")
    
    try:
        print("Starting query processing")
        # Encode the query
        query_embedding = model.encode(query.text)
        print("Query encoded successfully")
        
        # Calculate similarities
        similarities = np.dot(job_embeddings, query_embedding)
        print("Similarities calculated")
        
        # Get top 5 most relevant jobs
        top_indices = np.argsort(similarities)[-5:][::-1]
        relevant_jobs = [job_data[i] for i in top_indices]
        print(f"Found {len(relevant_jobs)} relevant jobs")
        
        # Comment out or remove the OpenAI section temporarily
        # Generate summary using OpenAI
        # openai.api_key = os.getenv("OPENAI_API_KEY")
        # prompt = f"""Based on the following job listings..."""
        # response = openai.ChatCompletion.create...

        # Instead, just return the jobs with a simple summary
        return JobResponse(
            summary="Here are the most relevant jobs found:",
            relevant_jobs=relevant_jobs
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 