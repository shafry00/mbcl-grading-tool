import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, ShadingType,
} from 'docx';

// ── MD download ──────────────────────────────────────────────────────────────
export function downloadMD(text, peserta) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `feedback-${peserta.replace(/\s+/g, '-').toLowerCase()}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── DOCX download ─────────────────────────────────────────────────────────────
function parseInline(text) {
  // Bold **text** → TextRun bold
  const runs = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0, m;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) runs.push(new TextRun(text.slice(last, m.index)));
    runs.push(new TextRun({ text: m[1], bold: true }));
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push(new TextRun(text.slice(last)));
  return runs.length ? runs : [new TextRun(text)];
}

const PAGE_WIDTH_DXA = 9360; // A4 body width in twips (~6.5 inch)

function makeCell(text, header = false, widthDxa = null) {
  const runs = header
    ? [new TextRun({ text: text.trim(), color: 'FFFFFF', bold: true })]
    : parseInline(text.trim());

  return new TableCell({
    children: [new Paragraph({
      children: runs,
      ...(header ? { alignment: AlignmentType.CENTER } : {}),
    })],
    shading: header ? { type: ShadingType.CLEAR, color: 'auto', fill: '2563EB' } : undefined,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
    },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    ...(widthDxa ? { width: { size: widthDxa, type: WidthType.DXA } } : {}),
  });
}

function parseTableRows(lines) {
  const rows = [];
  let isHeader = true;
  let numCols = 0;

  // Count columns from header row
  for (const line of lines) {
    if (line.trim().startsWith('|') && !/^\|[-\s|]+\|$/.test(line.trim())) {
      numCols = line.split('|').slice(1, -1).length;
      break;
    }
  }
  const colWidth = numCols > 0 ? Math.floor(PAGE_WIDTH_DXA / numCols) : null;

  for (const line of lines) {
    if (!line.trim().startsWith('|')) break;
    if (/^\|[-\s|]+\|$/.test(line.trim())) { isHeader = false; continue; }
    const cells = line.split('|').slice(1, -1);
    rows.push(new TableRow({
      children: cells.map(c => makeCell(c, isHeader, colWidth)),
      tableHeader: isHeader,
    }));
    if (isHeader) isHeader = false;
  }
  return { rows, numCols };
}

export async function downloadDOCX(text, peserta) {
  const lines = text.split('\n');
  const children = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' } } }));
      i++; continue;
    }

    // Heading 1
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        text: line.slice(2),
        heading: HeadingLevel.HEADING_1,
      }));
      i++; continue;
    }

    // Heading 2
    if (line.startsWith('## ')) {
      children.push(new Paragraph({
        text: line.slice(3),
        heading: HeadingLevel.HEADING_2,
      }));
      i++; continue;
    }

    // Heading 3
    if (line.startsWith('### ')) {
      children.push(new Paragraph({
        text: line.slice(4),
        heading: HeadingLevel.HEADING_3,
      }));
      i++; continue;
    }

    // Table
    if (line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const { rows, numCols } = parseTableRows(tableLines);
      if (rows.length) {
        const colW = numCols > 0 ? Math.floor(PAGE_WIDTH_DXA / numCols) : 1872;
        children.push(new Table({
          rows,
          width: { size: PAGE_WIDTH_DXA, type: WidthType.DXA },
          columnWidths: Array(numCols).fill(colW),
        }));
        children.push(new Paragraph(''));
      }
      continue;
    }

    // Blockquote > text
    if (line.startsWith('> ')) {
      children.push(new Paragraph({
        children: parseInline(line.slice(2)),
        indent: { left: 720 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: '2563EB' } },
      }));
      i++; continue;
    }

    // Empty line
    if (!line.trim()) {
      children.push(new Paragraph(''));
      i++; continue;
    }

    // Italic *text*
    if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(1, -1), italics: true, color: '666666' })],
        alignment: AlignmentType.CENTER,
      }));
      i++; continue;
    }

    // Normal paragraph with possible bold
    children.push(new Paragraph({ children: parseInline(line) }));
    i++;
  }

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Heading1',
          name: 'Heading 1',
          run: { bold: true, size: 32, color: 'E53E3E' },
        },
        {
          id: 'Heading2',
          name: 'Heading 2',
          run: { bold: true, size: 26, color: '2563EB' },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        {
          id: 'Heading3',
          name: 'Heading 3',
          run: { bold: true, size: 22, color: '333333' },
          paragraph: { spacing: { before: 160, after: 80 } },
        },
      ],
    },
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `feedback-${peserta.replace(/\s+/g, '-').toLowerCase()}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
