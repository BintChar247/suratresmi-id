import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface PDFRequest {
  letter: string;
  letterType?: string;
  requiresMaterai?: boolean;
  isFreeUser?: boolean;
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const MARGIN      = 25;   // mm, all sides
const FONT_FAMILY = 'times';

const SIZE = {
  h1:    16,
  h2:    13,
  h3:    12,
  body:  11,
  small:  9,
} as const;

const LINE_H = {
  h1:   9,
  h2:   7.5,
  h3:   7,
  body: 6.5,
} as const;

const SPACE = {
  afterH1:   5,
  beforeH2:  5,
  afterH2:   3,
  afterRule: 4,
  emptyLine: 4,
  listGap:   1,
} as const;

const BULLET_INDENT = 5; // mm — content indented after bullet

// ─── Inline formatting ────────────────────────────────────────────────────────

type FontStyle = 'normal' | 'bold' | 'italic' | 'bolditalic';

interface Segment {
  text:  string;
  style: FontStyle;
}

// Parse **bold**, *italic*, ***bold-italic*** inline markers.
function parseInline(raw: string): Segment[] {
  const out: Segment[] = [];
  const re = /\*\*\*([^*]+?)\*\*\*|\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) out.push({ text: raw.slice(last, m.index), style: 'normal' });
    if (m[1] !== undefined)      out.push({ text: m[1], style: 'bolditalic' });
    else if (m[2] !== undefined) out.push({ text: m[2], style: 'bold' });
    else if (m[3] !== undefined) out.push({ text: m[3], style: 'italic' });
    last = re.lastIndex;
  }
  if (last < raw.length) out.push({ text: raw.slice(last), style: 'normal' });
  return out;
}

// Strip all inline markers to get plain text (used for width calculation).
function stripInline(raw: string): string {
  return raw.replace(/\*+([^*]+)\*+/g, '$1');
}

// ─── PDF writer ───────────────────────────────────────────────────────────────

class PDFWriter {
  doc:    jsPDF;
  pageW:  number;
  pageH:  number;
  y:      number;

  constructor(doc: jsPDF) {
    this.doc   = doc;
    this.pageW = doc.internal.pageSize.getWidth();
    this.pageH = doc.internal.pageSize.getHeight();
    this.y     = MARGIN;
  }

  get contentWidth() { return this.pageW - 2 * MARGIN; }

  private newPageIfNeeded(needed: number) {
    if (this.y + needed > this.pageH - MARGIN) {
      this.doc.addPage();
      this.y = MARGIN;
    }
  }

  // Public: force a new page if fewer than `mm` mm remain on the current page.
  ensureRoom(mm: number) {
    this.newPageIfNeeded(mm);
  }

  get remainingY() {
    return this.pageH - MARGIN - this.y;
  }

  skip(mm: number) {
    if (mm > 0) this.newPageIfNeeded(mm);
    this.y += mm;
  }

  setFont(size: number, style: FontStyle = 'normal') {
    this.doc.setFont(FONT_FAMILY, style);
    this.doc.setFontSize(size);
  }

  // Horizontal rule
  drawRule() {
    this.newPageIfNeeded(2);
    this.doc.setDrawColor(160, 160, 160);
    this.doc.setLineWidth(0.3);
    this.doc.line(MARGIN, this.y, this.pageW - MARGIN, this.y);
    this.doc.setDrawColor(0, 0, 0);
    this.y += SPACE.afterRule;
  }

  // Render a plain (no inline markers) string — wraps automatically.
  renderPlain(
    text:    string,
    size:    number,
    lineH:   number,
    style:   FontStyle = 'normal',
    indent:  number    = 0,
    align:   'left' | 'center' | 'right' = 'left',
  ) {
    if (!text.trim()) return;
    this.setFont(size, style);
    const startX = MARGIN + indent;
    const width  = this.contentWidth - indent;
    const lines  = this.doc.splitTextToSize(text, width) as string[];

    for (const ln of lines) {
      this.newPageIfNeeded(lineH);
      if (align === 'center') {
        this.doc.text(ln, this.pageW / 2, this.y, { align: 'center' });
      } else if (align === 'right') {
        this.doc.text(ln, this.pageW - MARGIN, this.y, { align: 'right' });
      } else {
        this.doc.text(ln, startX, this.y);
      }
      this.y += lineH;
    }
  }

  // Render a line that may contain inline **bold** / *italic* markers,
  // wrapping correctly across page boundaries.
  renderInline(
    raw:    string,
    size:   number,
    lineH:  number,
    indent: number = 0,
  ) {
    if (!raw.trim()) return;

    const segments = parseInline(raw);
    const startX   = MARGIN + indent;
    const maxX     = startX + this.contentWidth - indent;

    // Flatten segments into word tokens preserving whitespace between them.
    type Token = { word: string; style: FontStyle };
    const tokens: Token[] = [];
    for (const seg of segments) {
      // Split on whitespace boundaries, keeping the spaces as tokens.
      const parts = seg.text.split(/(\s+)/);
      for (const p of parts) {
        if (p !== '') tokens.push({ word: p, style: seg.style });
      }
    }

    let x = startX;
    this.newPageIfNeeded(lineH);

    for (const tok of tokens) {
      this.doc.setFont(FONT_FAMILY, tok.style);
      this.doc.setFontSize(size);
      const w = this.doc.getTextWidth(tok.word);

      // Wrap: if adding this token would overflow AND we're not at line start
      if (x + w > maxX + 0.5 && x > startX) {
        this.y += lineH;
        if (this.y > this.pageH - MARGIN) {
          this.doc.addPage();
          this.y = MARGIN;
        }
        x = startX;
        // Skip leading whitespace at the start of a new line
        if (!tok.word.trim()) continue;
      }

      this.doc.text(tok.word, x, this.y);
      x += w;
    }

    this.y += lineH;
  }

  // Render a bullet item. Bullet symbol at left margin, content indented.
  renderBullet(content: string, size: number, lineH: number) {
    // Page-check FIRST, then save y — so bullet and content land on the same page.
    this.newPageIfNeeded(lineH);
    const bulletY = this.y;

    this.setFont(size, 'normal');
    this.doc.text('\u2022', MARGIN, bulletY);

    // renderInline starts from the current this.y (= bulletY) and advances it.
    this.renderInline(content, size, lineH, BULLET_INDENT);

    // Ensure y advanced by at least one lineH even if content was empty.
    if (this.y < bulletY + lineH) this.y = bulletY + lineH;
  }

  // Render a numbered list item: "N." at margin, content indented.
  renderNumbered(num: string, content: string, size: number, lineH: number) {
    // Page-check FIRST — same reasoning as renderBullet.
    this.newPageIfNeeded(lineH);
    const itemY = this.y;

    this.setFont(size, 'normal');
    this.doc.text(`${num}.`, MARGIN, itemY);

    this.renderInline(content, size, lineH, BULLET_INDENT);

    if (this.y < itemY + lineH) this.y = itemY + lineH;
  }
}

// ─── Markdown-to-PDF renderer ─────────────────────────────────────────────────

// Returns true if a line consists entirely of **...** (a "label" line like **PEMBERI KUASA:**)
function isAllBold(line: string): boolean {
  return /^\*\*[^*].+\*\*:?\s*$/.test(line.trim());
}

// Estimate the vertical space (mm) a block of lines will consume, so we can
// decide whether to start it on a new page.  Stops when it hits the next
// party-label, horizontal rule, or after `limit` lines.
// Estimate vertical space from line `start` until a natural break:
// next heading (##), next party label, horizontal rule, or `limit` lines.
function estimateBlockHeight(lines: string[], start: number, limit = 25): number {
  let h = 0;
  for (let j = start; j < Math.min(start + limit, lines.length); j++) {
    const t = lines[j].trim();
    if (j > start) {
      if (/^[-*_]{3,}$/.test(t)) break;
      if (/^## /.test(t)) break;
      if (isAllBold(t) && /^(PEMBERI|PENERIMA|SAKSI|PARA PIHAK|PIHAK)/i.test(stripInline(t))) break;
    }
    if (!t)              h += SPACE.emptyLine;
    else if (/^## /.test(t)) h += LINE_H.h2 + SPACE.beforeH2 + SPACE.afterH2;
    else                 h += LINE_H.body + SPACE.listGap;
  }
  return h + 4;
}

function renderMarkdownToPDF(w: PDFWriter, markdown: string) {
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const raw     = lines[i];
    const trimmed = raw.trim();

    // H1: # Title
    if (/^# /.test(trimmed)) {
      const text = stripInline(trimmed.replace(/^# /, ''));
      w.skip(2);
      w.renderPlain(text, SIZE.h1, LINE_H.h1, 'bold', 0, 'center');
      w.skip(SPACE.afterH1);
      i++; continue;
    }

    // H2: ## Section — keep heading + its body together on one page
    if (/^## /.test(trimmed)) {
      const text = stripInline(trimmed.replace(/^## /, ''));
      const blockH = estimateBlockHeight(lines, i);
      w.ensureRoom(blockH);
      w.skip(SPACE.beforeH2);
      w.renderPlain(text, SIZE.h2, LINE_H.h2, 'bold');
      w.skip(SPACE.afterH2);
      i++; continue;
    }

    // H3: ### Sub-section
    if (/^### /.test(trimmed)) {
      const text = stripInline(trimmed.replace(/^### /, ''));
      w.skip(2);
      w.renderPlain(text, SIZE.h3, LINE_H.h3, 'bolditalic');
      w.skip(1);
      i++; continue;
    }

    // Horizontal rule: ---, ***, ___
    if (/^[-*_]{3,}$/.test(trimmed)) {
      w.skip(2);
      w.drawRule();
      i++; continue;
    }

    // Empty line
    if (!trimmed) {
      w.skip(SPACE.emptyLine);
      i++; continue;
    }

    // Unordered bullet: - item  or  * item (but NOT *italic*)
    if (/^[-] /.test(trimmed) || /^\* [^ ]/.test(trimmed)) {
      const content = trimmed.replace(/^[-*] /, '');
      w.renderBullet(content, SIZE.body, LINE_H.body);
      w.skip(SPACE.listGap);
      i++; continue;
    }

    // Numbered list: 1. item
    if (/^\d+\. /.test(trimmed)) {
      const m = trimmed.match(/^(\d+)\. (.*)/);
      if (m) w.renderNumbered(m[1], m[2], SIZE.body, LINE_H.body);
      w.skip(SPACE.listGap);
      i++; continue;
    }

    // All-bold label line: **PEMBERI KUASA:** — party separator
    if (isAllBold(trimmed)) {
      const text = stripInline(trimmed);
      const isPartyLabel = /^(PEMBERI|PENERIMA|SAKSI|PARA PIHAK|PIHAK)/i.test(text);
      if (isPartyLabel) {
        // Look ahead: if the whole party block doesn't fit on this page, start fresh.
        const blockH = estimateBlockHeight(lines, i);
        w.ensureRoom(blockH);
        w.skip(3); // breathing room above
      }
      w.renderPlain(text, SIZE.body, LINE_H.body, 'bold');
      i++; continue;
    }

    // Italic-only line: *note text*
    if (/^\*[^*].+[^*]\*$/.test(trimmed)) {
      const text = trimmed.replace(/^\*|\*$/g, '');
      w.renderPlain(text, SIZE.small, LINE_H.body, 'italic', 0, 'right');
      i++; continue;
    }

    // Regular paragraph — may contain inline bold/italic
    w.renderInline(raw, SIZE.body, LINE_H.body);
    i++;
  }
}

// ─── POST /api/pdf ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PDFRequest;

    if (!body.letter) {
      return NextResponse.json({ error: 'Missing letter content' }, { status: 400 });
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit:        'mm',
      format:      'a4',
    });

    const writer = new PDFWriter(doc);
    renderMarkdownToPDF(writer, body.letter);

    // Add page numbers + paraf box on every page
    addFooters(doc);

    if (body.isFreeUser) {
      addWatermark(doc, 'DRAF - SuratResmi.Online');
    }

    if (body.requiresMaterai) {
      addMateraiBox(doc);
    }

    const pdfData = doc.output('arraybuffer');

    return new NextResponse(pdfData, {
      status:  200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="surat-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

// ─── Materai box — page 1, top-right ──────────────────────────────────────────
// Physical e-materai is roughly 30 × 40 mm. We draw a dashed-border box with a
// label so the user knows where to affix the stamp.

function addMateraiBox(doc: jsPDF): void {
  const pageW = doc.internal.pageSize.getWidth();

  doc.setPage(1); // materai goes on the first page

  const pageH  = doc.internal.pageSize.getHeight();
  const boxW   = 33;  // 28.95mm stamp (landscape) + 4mm margin
  const boxH   = 25;  // 21mm stamp (landscape) + 4mm margin
  const boxX   = pageW - MARGIN - boxW;
  const boxY   = pageH - MARGIN - boxH; // bottom-right

  // Solid gray border — visible at all zoom levels
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.rect(boxX, boxY, boxW, boxH);

  // Inner guide lines (light) to frame the stamp placement
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  const inset = 2;
  doc.rect(boxX + inset, boxY + inset, boxW - 2 * inset, boxH - 2 * inset);

  // Label text
  doc.setFont(FONT_FAMILY, 'italic');
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text('Materai', boxX + boxW / 2, boxY + boxH / 2 - 2, { align: 'center' });
  doc.text('Rp 10.000', boxX + boxW / 2, boxY + boxH / 2 + 2, { align: 'center' });

  // Reset
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
}

// ─── Page footers: pagination + paraf ─────────────────────────────────────────

function addFooters(doc: jsPDF): void {
  const pageW     = doc.internal.pageSize.getWidth();
  const pageH     = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();
  const footerY   = pageH - 12; // 12 mm from bottom edge

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // ── Page number: centered ────────────────────────────────────────────
    doc.setFont(FONT_FAMILY, 'normal');
    doc.setFontSize(SIZE.small);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageW / 2,
      footerY,
      { align: 'center' },
    );

    // ── Paraf box: bottom-right ──────────────────────────────────────────
    const boxW = 25;
    const boxH = 12;
    const boxX = pageW - MARGIN - boxW;
    const boxY = footerY - boxH + 2;

    doc.setDrawColor(160, 160, 160);
    doc.setLineWidth(0.3);
    doc.rect(boxX, boxY, boxW, boxH);

    doc.setFontSize(7);
    doc.setFont(FONT_FAMILY, 'normal');
    doc.setTextColor(140, 140, 140);
    doc.text('Paraf:', boxX + 1.5, boxY + 3.5);

    // Reset
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
  }
}

// ─── Watermark ────────────────────────────────────────────────────────────────

function addWatermark(doc: jsPDF, text: string): void {
  const pageW      = doc.internal.pageSize.getWidth();
  const pageH      = doc.internal.pageSize.getHeight();
  const pageCount  = doc.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(48);
    doc.setFont(FONT_FAMILY, 'bold');
    doc.text(text, pageW / 2, pageH / 2, { align: 'center', angle: -45 });
    doc.setTextColor(0, 0, 0);
  }
}
