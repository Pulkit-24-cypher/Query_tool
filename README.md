# Investment Incentive Query Tool

A modern web application for querying SQLite databases with a beautiful interface and REST API.

## Features

- **Modern Web Interface**: Clean, responsive design with real-time query execution
- **REST API**: Full API access to your database with comprehensive endpoints
- **Export Functionality**: Download query results as CSV files
- **Table Browser**: Explore database schema and sample data
- **Security**: Only SELECT queries allowed for data safety
- **Real-time Results**: Instant query execution with pagination

## Setup Instructions

### 1. Database Setup
Place your `Investment_Incentive.db` file in the root directory of this project, or update the path in `server.js`:

```javascript
const DB_PATH = path.join(__dirname, 'your-database-file.db');
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Application

#### Option 1: Start both frontend and backend together
```bash
npm run dev:full
```

#### Option 2: Start them separately
```bash
# Terminal 1 - Start the API server
npm run server

# Terminal 2 - Start the frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## API Endpoints

### GET /api/health
Check if the API server is running.

### POST /api/query
Execute a SELECT query against the database.
```json
{
  "query": "SELECT * FROM Incentive LIMIT 10"
}
```

### GET /api/tables
Get a list of all tables in the database.

### GET /api/tables/:tableName/schema
Get the schema information for a specific table.

### GET /api/tables/:tableName/sample?limit=10
Get sample data from a specific table.

## Usage Examples

### JavaScript
```javascript
const response = await fetch('http://localhost:3001/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'SELECT * FROM Incentive LIMIT 10'
  })
});

const data = await response.json();
console.log(data);
```

### Python
```python
import requests

response = requests.post('http://localhost:3001/api/query', 
                        json={'query': 'SELECT * FROM Incentive LIMIT 10'})
data = response.json()
print(data)
```

### cURL
```bash
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM Incentive LIMIT 10"}'
```

## Security Features

- Only SELECT queries are allowed (prevents data modification)
- CORS enabled for cross-origin requests
- Input validation and error handling
- Safe SQL execution with prepared statements

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, better-sqlite3
- **Database**: SQLite
- **Icons**: Lucide React