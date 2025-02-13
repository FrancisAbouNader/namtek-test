import http from "http";
import fs from "fs";
import path from "path";
import url from "url";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  }
});
const upload = multer({ storage });

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname.startsWith("/uploads/")) {
    const filePath = path.join(uploadsDir, path.basename(parsedUrl.pathname));
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Image Not Found");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" }); 
        res.end(data);
      }
    });
    return;
  }

  if (parsedUrl.pathname === "/upload" && req.method === "POST") {
    upload.single("profile_picture")(req,res,(err) => {
      if (err) {
        res.writeHead(400);
        res.end("File upload error");
        return;
      }

      const filename = req.file ? req.file.filename : null;
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ filename }));
    });
    return;
  }

  res.writeHead(404);
  res.end("Route not found");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
