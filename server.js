import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";

const app = express();
const upload = multer({ dest: "." }); // PAS DE DOSSIER

app.use(cors());

app.post("/verify", upload.single("image"), (req, res) => {
  // On supprime l’image (pas utilisée ici)
  fs.unlinkSync(req.file.path);

  // RÉPONSE MOCK (IA simulée)
  res.json({
    is_funko_box: true,
    license: "demon_slayer",
    detected_number: 615,
    confidence: 0.95
  });
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
