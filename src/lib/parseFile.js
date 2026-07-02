import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const MAX_IMAGE_PAGES = 12; // max pages rendered as image
const PAGE_SCALE = 1.5;    // high enough to read text in stitched image
const STITCH_COLS = 2;

async function stitchImages(canvases) {
  if (canvases.length === 0) return null;
  if (canvases.length === 1) {
    return canvases[0].toDataURL('image/jpeg', 0.75);
  }

  // Arrange pages in a 2-column grid
  const cols = Math.min(STITCH_COLS, canvases.length);
  const rows = Math.ceil(canvases.length / cols);
  const cellW = Math.max(...canvases.map((c) => c.width));
  const cellH = Math.max(...canvases.map((c) => c.height));
  const gap = 8;

  const merged = document.createElement('canvas');
  merged.width = cols * cellW + (cols - 1) * gap;
  merged.height = rows * cellH + (rows - 1) * gap;

  const ctx = merged.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, merged.width, merged.height);

  canvases.forEach((c, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    ctx.drawImage(c, col * (cellW + gap), row * (cellH + gap));
  });

  return merged.toDataURL('image/jpeg', 0.75);
}

async function parsePDFWithImages(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  const canvases = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    // Extract text from ALL pages
    const content = await page.getTextContent();
    text += `[Halaman ${i}]\n` + content.items.map((item) => item.str).join(' ') + '\n\n';

    // Render image only for first MAX_IMAGE_PAGES pages
    if (i <= MAX_IMAGE_PAGES) {
      const viewport = page.getViewport({ scale: PAGE_SCALE });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      canvases.push(canvas);
    }
  }

  const stitched = await stitchImages(canvases);
  return { text: text.trim(), images: stitched ? [stitched] : [] };
}

async function parseDOCXWithImages(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();

  const rawCanvases = [];
  const htmlResult = await mammoth.convertToHtml({ arrayBuffer }, {
    convertImage: mammoth.images.imgElement(async (image) => {
      if (rawCanvases.length < MAX_IMAGE_PAGES) {
        const base64 = await image.read('base64');
        const src = `data:${image.contentType};base64,${base64}`;
        // Draw into canvas for stitching
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const c = document.createElement('canvas');
            c.width = img.width;
            c.height = img.height;
            c.getContext('2d').drawImage(img, 0, 0);
            rawCanvases.push(c);
            resolve();
          };
          img.src = src;
        });
      }
      return { src: '' };
    }),
  });

  const textResult = await mammoth.extractRawText({ arrayBuffer });
  const stitched = await stitchImages(rawCanvases);
  return { text: textResult.value.trim(), images: stitched ? [stitched] : [] };
}

async function parseTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result.trim());
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function parseFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') return parsePDFWithImages(file);
  if (ext === 'docx') return parseDOCXWithImages(file);
  if (ext === 'txt' || ext === 'md') return { text: await parseTXT(file), images: [] };
  throw new Error(
    `Format .${ext} tidak didukung. Gunakan PDF, DOCX, atau TXT.\n` +
    `Untuk PPT/PPTX: export dulu sebagai PDF dari Google Slides atau PowerPoint.`
  );
}
