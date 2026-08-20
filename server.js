const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

// Security Passphrase configuration (Environment variable override supported)
const MASTER_PASSPHRASE = process.env.CMS_PASSPHRASE || "alexi@admin2026";

// Session & Security tracking
const activeSessions = new Map(); // token -> expireTimestamp
const loginAttempts = new Map();  // ip -> { count, lockoutUntil }

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
}

function isValidToken(token) {
  if (!token) return false;
  const expiry = activeSessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

const server = http.createServer((req, res) => {
  setSecurityHeaders(res);

  let parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const clientIp = req.socket.remoteAddress || "127.0.0.1";

  // API ROUTE 1: Authentication Login (/api/auth/login)
  if (pathname === "/api/auth/login" && req.method === "POST") {
    // Check Rate Limiting
    const attemptInfo = loginAttempts.get(clientIp) || { count: 0, lockoutUntil: 0 };
    if (attemptInfo.lockoutUntil > Date.now()) {
      const waitMins = Math.ceil((attemptInfo.lockoutUntil - Date.now()) / 60000);
      res.writeHead(429, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        success: false,
        error: `Too many failed attempts. IP temporarily locked. Try again in ${waitMins} minute(s).`
      }));
    }

    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 10240) req.destroy(); // Max 10KB
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const passphrase = parsed.passphrase || "";

        if (passphrase === MASTER_PASSPHRASE) {
          // Reset login attempts on success
          loginAttempts.delete(clientIp);
          
          // Generate crypto session token (valid 24h)
          const token = crypto.randomBytes(32).toString("hex");
          activeSessions.set(token, Date.now() + 24 * 60 * 60 * 1000);

          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({
            success: true,
            token: token,
            message: "Authentication successful."
          }));
        } else {
          // Increment failed attempt count
          attemptInfo.count += 1;
          if (attemptInfo.count >= 5) {
            attemptInfo.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 min lockout
          }
          loginAttempts.set(clientIp, attemptInfo);

          res.writeHead(401, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({
            success: false,
            error: attemptInfo.count >= 5
              ? "Too many failed attempts. IP locked for 15 minutes."
              : `Invalid passphrase. (${5 - attemptInfo.count} attempt(s) remaining)`
          }));
        }
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: false, error: "Malformed request payload" }));
      }
    });
    return;
  }

  // API ROUTE 2: CMS Data Persistence Endpoint (/api/cms)
  if (pathname === "/api/cms") {
    const cmsFilePath = path.join(BASE_DIR, "data", "cms_data.json");

    if (req.method === "GET") {
      fs.readFile(cmsFilePath, "utf8", (err, data) => {
        if (err) {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ status: "empty" }));
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(data);
      });
      return;
    }

    if (req.method === "POST" || req.method === "PUT") {
      // Authorization Check via Bearer Token
      const authHeader = req.headers["authorization"] || "";
      const token = authHeader.replace(/^Bearer\s+/i, "").trim();

      if (!isValidToken(token)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({
          success: false,
          error: "Unauthorized: Valid session token required."
        }));
      }

      let body = "";
      let exceededLimit = false;
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

      req.on("data", chunk => {
        body += chunk;
        if (body.length > MAX_SIZE) {
          exceededLimit = true;
          req.destroy();
        }
      });

      req.on("end", () => {
        if (exceededLimit) {
          res.writeHead(413, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ success: false, error: "Payload exceeds 5MB limit" }));
        }

        try {
          const parsed = JSON.parse(body);
          const dataDir = path.join(BASE_DIR, "data");
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }
          fs.writeFile(cmsFilePath, JSON.stringify(parsed, null, 2), "utf8", (writeErr) => {
            if (writeErr) {
              res.writeHead(500, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ success: false, error: writeErr.message }));
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ success: true, message: "CMS data securely saved to disk." }));
          });
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ success: false, error: "Invalid JSON format" }));
        }
      });
      return;
    }
  }

  // Static File Serving
  let filePath = path.normalize(path.join(BASE_DIR, pathname));

  // Security check: ensure filePath is within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("403 Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const notFoundPath = path.join(BASE_DIR, "404.html");
      fs.readFile(notFoundPath, (err404, data404) => {
        if (err404) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        } else {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data404);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache, no-store, must-revalidate"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🔒 Secure Portfolio server running live at http://localhost:${PORT}`);
});

