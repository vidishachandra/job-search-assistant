# Job Search Assistant

A modern web application that helps international students find software engineering jobs with sponsorship details. The application uses vector search and natural language processing to provide relevant job recommendations based on user queries.

## Features

- Upload CSV files containing job listings
- Natural language query processing
- Vector-based semantic search
- AI-powered response generation
- Modern, responsive UI
- Real-time job recommendations

## Prerequisites

- Python 3.8+
- Node.js 14+
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd job-search-assistant
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Running the Application

1. Start the backend server:
```bash
python main.py
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## CSV File Format

The application expects a CSV file with the following columns:
- job_title
- company
- location
- sponsorship_details

Example:
```csv
job_title,company,location,sponsorship_details
Software Engineer,Google,Mountain View,CA,H1B sponsorship available
Full Stack Developer,Microsoft,Seattle,WA,Green card sponsorship after 1 year
```

## Usage

1. Upload your CSV file containing job listings
2. Enter your query in natural language (e.g., "Which companies offer sponsorship in California?")
3. View the AI-generated summary and relevant job listings
4. Click on job cards to see more details

## Technologies Used

- Backend:
  - FastAPI
  - Sentence Transformers
  - OpenAI GPT-3.5
  - Pandas
  - NumPy

- Frontend:
  - React
  - Modern CSS
  - Fetch API

## License

MIT 