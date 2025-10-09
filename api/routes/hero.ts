import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.resolve(process.cwd(), "public", "uploads");
const BASENAME = "hero-image";
const exts = ["jpg", "jpeg", "png", "webp"];

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export const getHeroUrl: RequestHandler = (_req, res) => {
  ensureDir(UPLOAD_DIR);
  for (const ext of exts) {
    const p = path.join(UPLOAD_DIR, `${BASENAME}.${ext}`);
    if (fs.existsSync(p)) {
      return res.json({ url: `/uploads/${BASENAME}.${ext}` });
    }
  }
  return res.json({ url: null });
};

export const saveHeroImage: RequestHandler = async (req, res) => {
  try {
    const dataUrl = (req.body?.dataUrl ?? "") as string;
    const match = /^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/.exec(
      dataUrl,
    );
    if (!match) return res.status(400).json({ error: "Invalid image data" });
    const mime = match[1];
    const ext = match[2] === "jpg" ? "jpg" : match[2];
    const b64 = match[3];
    const buf = Buffer.from(b64, "base64");
    ensureDir(UPLOAD_DIR);
    // remove previous variants
    for (const e of exts) {
      const prev = path.join(UPLOAD_DIR, `${BASENAME}.${e}`);
      if (fs.existsSync(prev)) fs.unlinkSync(prev);
    }
    const file = path.join(UPLOAD_DIR, `${BASENAME}.${ext}`);
    fs.writeFileSync(file, buf);
    return res.json({ url: `/uploads/${BASENAME}.${ext}`, mime });
  } catch (e) {
    return res.status(500).json({ error: "Failed to save image" });
  }
};
