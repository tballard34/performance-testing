# 🚀 VDI Load Testing Framework

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![k6](https://img.shields.io/badge/k6-7D64FF?style=flat&logo=k6&logoColor=white)](https://k6.io/)

A powerful, data-driven load testing framework built with k6 and TypeScript, specifically designed for any REST API

## ✨ Features

-   🎯 **Data-Driven Testing** - Configure everything through JSON and CSV files
-   📊 **CSV Data Templating** - Dynamic request generation using CSV data
-   ⚡ **TypeScript Support** - Full type safety and modern JavaScript features
-   🔧 **Flexible Configuration** - Easy-to-modify test scenarios
-   📈 **Rich Reporting** - JSON output for detailed analysis
-   🏗️ **Modular Architecture** - Clean separation of concerns

## 🚀 Quick Start

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [pnpm](https://pnpm.io/) package manager (or you can use npm)
-   [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) load testing tool
    > **macOS**: `brew install k6`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vdi-load-testing

# Install dependencies
pnpm install
```

### Running Your First Test

```bash
# Build and run the load test
pnpm test

# Or build separately
pnpm build
k6 run dist/script.js
```

## 📁 Project Structure (subject to change)

```
├── src/
│   ├── script.ts          # Main k6 test script
│   ├── utils.ts           # Helper functions for CSV parsing and templating
│   ├── ...
│   └── types/             # TypeScript type definitions
├── config/
│   ├── example/           # Example configuration folder
│   │   ├── config.json    # Load test parameters
│   │   ├── endpoints.json # API endpoints configuration
│   │   └── data.csv       # Test data for templating
│   └── other_repos...     # other services to run tests with
├── dist/                  # Compiled JavaScript output
└── results/               # Test results and reports
```

## ⚙️ Configuration

### 1. Load Test Configuration (`config.json`)

```json
{
    "tps": 1, // Transactions per second
    "duration": "30s", // Test duration
    "vus": 1, // Virtual users
    "host": "http://localhost:8000" // Base URL
}
```

### 2. Endpoints Configuration (`endpoints.json`)

Define your API endpoints with dynamic templating support:

```json
{
    "endpoints": [
        {
            "name": "start",
            "traffic_weight": 100,
            "data_file": "data.csv",
            "url": "/v1/endpoint/start",
            "method": "POST",
            "headers": {
                "JWT": "fake_jwt_1234567890"
            },
            "body": {
                "user_id": "{{user_id}}",
                "session_id": "{{session_id_from_csv_column}}"
            }
        }
    ]
}
```

### 3. Test Data (`data.csv`)

Provide dynamic data for your tests (must match templated varible in step 2):

```csv
session_id_from_csv_column,user_id
sess_100,1
sess_101,2
sess_102,3
sess_103,4
```

## 🎯 How It Works

1. **Configuration Loading**: The framework loads configuration from the specified folder path
2. **Data Preparation**: CSV data is parsed and loaded into k6's SharedArray for efficient sharing
3. **Request Templating**: For each virtual user iteration:
    - A random row is selected from the CSV data
    - Template variables (`{{variable_name}}`) in endpoints are replaced with CSV values
    - HTTP requests are made with the templated data
4. **Response Validation**: Built-in checks validate response status codes
5. **Results Collection**: Test results are output to JSON for analysis

## 📋 Available Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `pnpm build`       | Compile TypeScript to JavaScript         |
| `pnpm build:watch` | Watch mode compilation                   |
| `pnpm test`        | Build and run load test with JSON output |
| `pnpm clean`       | Remove compiled files                    |

## 🔧 Customization

### Adding a New Service to Load Test

1. Create a new folder under `config/` (e.g., `config/my_test/`)
2. Add your `config.json`, `endpoints.json`, and `data.csv` files
3. Update the `config_folder_path` in `src/script.ts`:

```typescript
const config_folder_path: string = "config/my_test";
```

### Template Variables

Use double curly braces to create dynamic values:

-   `{{variable_name}}` in any string field
-   Variables are replaced with corresponding CSV column values
-   Works in URLs, headers, body content, and even object keys

## 📊 Analyzing Results

Test results are saved to `results/results.json` with detailed metrics:

-   Response times
-   Success/failure rates
-   Virtual user statistics
-   Custom check results

## 📚 Resources

-   [k6 Documentation](https://grafana.com/docs/k6/latest/)
-   [k6 Installation Guide](https://grafana.com/docs/k6/latest/set-up/install-k6/)
-   [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🛣️ Possible Future Additions

-   [ ] **Multi-endpoint Support** - Handle multiple endpoints in a single test
-   [ ] **Session Management** - Add a write/delete workflow for proper cleanup
-   [ ] **Performance Optimizations** - Enhanced efficiency for high TPS scenarios
