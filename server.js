const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Configure multer to store files in ./uploads/
const upload = multer({
    storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const userName = req.body.name || 'anonymous';
      const userFolder = path.join(__dirname, 'uploads', sanitize(userName));
      fs.mkdirSync(userFolder, { recursive: true });
      cb(null, userFolder);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  })
});

// Simple sanitizer to remove special characters
function sanitize(str) {
  return str.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
}

app.post('/upload', upload.array('files'), (req, res) => {
  const user = sanitize(req.body.name || 'anonymous');
  const uploadedFiles = req.files.map(f => f.filename);
  const files = req.files;

  console.log(`Uploaded by: ${user}`);
  console.log('Files:', uploadedFiles);

  res.json({
    success: true,
    user,
    savedTo: `/uploads/${user}/`,
    files: uploadedFiles,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
