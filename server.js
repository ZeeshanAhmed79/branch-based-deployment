const express = require("express");
const { execSync } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// Automatically detect the current Git branch
let BRANCH_NAME = "unknown";

try {
  BRANCH_NAME = execSync("git rev-parse --abbrev-ref HEAD")
    .toString()
    .trim();
} catch (err) {
  console.error("Unable to determine Git branch:", err.message);
}

const APP_VERSION = "1.0.0";

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Version endpoint
app.get("/version", (req, res) => {
  res.status(200).json({
    version: APP_VERSION,
    branch: BRANCH_NAME,
    environment: BRANCH_NAME === "main" ? "production" : "staging",
    timestamp: new Date().toISOString(),
  });
});

// Home page
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Branch-Based Deployment System</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          background-color: ${
            BRANCH_NAME === "main" ? "#e8f5e9" : "#fff3e0"
          };
        }

        .container {
          max-width: 700px;
          margin: auto;
          padding: 30px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }

        h1 {
          color: #333;
        }

        .info {
          margin: 20px 0;
          font-size: 18px;
        }

        .badge {
          display: inline-block;
          margin-left: 10px;
          padding: 8px 16px;
          border-radius: 5px;
          font-weight: bold;
          color: white;
          ${
            BRANCH_NAME === "main"
              ? "background:#4CAF50;"
              : "background:#FF9800;"
          }
        }

        hr {
          margin: 30px 0;
        }

        a {
          color: #2196F3;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        ul {
          line-height: 1.8;
        }
      </style>
    </head>

    <body>

      <div class="container">

        <h1>🚀 Branch-Based Deployment System</h1>

        <p>Welcome to the deployment verification page!</p>

        <div class="info">
          <strong>Current Branch:</strong> ${BRANCH_NAME}

          <span class="badge">
            ${
              BRANCH_NAME === "main"
                ? "📦 PRODUCTION"
                : "🔨 STAGING"
            }
          </span>

        </div>

        <div class="info">
          <strong>Application Version:</strong> ${APP_VERSION}
        </div>

        <div class="info">
          <strong>Environment:</strong>
          ${BRANCH_NAME === "main" ? "Production" : "Staging"}
        </div>

        <hr>

        <h3>Available Endpoints</h3>

        <ul>
          <li><a href="/health">/health</a> - Health Check</li>
          <li><a href="/version">/version</a> - Version Information</li>
        </ul>

      </div>

    </body>
    </html>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("==================================");
  console.log("🚀 Branch-Based Deployment System");
  console.log("==================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Branch      : ${BRANCH_NAME}`);
  console.log(
    `Environment : ${
      BRANCH_NAME === "main" ? "Production" : "Staging"
    }`
  );
  console.log(`Version     : ${APP_VERSION}`);
  console.log("==================================");
});