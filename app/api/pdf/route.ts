import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

interface PDFRequest {
  letter: string;
  letterType?: string;
  requiresMaterai?: boolean;
  isFreeUser?: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as PDFRequest;

    if (!body.letter) {
      return NextResponse.json({ error: 'Missing letter content' }, { status: 400 });
    }

    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Set up Times New Roman font
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    // Split letter content into lines that fit the page width
    const lines = doc.splitTextToSize(body.letter, contentWidth);
    const lineHeight = 6;

    // Add content to PDF
    for (const line of lines) {
      // Check if we need a new page
      if (yPosition + lineHeight > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    }

    // Add watermark for free tier
    if (body.isFreeUser) {
      addWatermark(doc, 'DRAF - SuratResmi.id');
    }

    // Optional: Materai placement notice
    if (body.requiresMaterai) {
      const lastPageNum = doc.getNumberOfPages();
      doc.setPage(lastPageNum);

      doc.setFontSize(9);
      doc.setFont('times', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text(
        '[Tempat Materai Rp 10.000]',
        pageWidth - margin - 40,
        pageHeight - margin - 10
      );
      doc.setTextColor(0, 0, 0);
    }

    // Generate PDF as ArrayBuffer
    const pdfData = doc.output('arraybuffer');

    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="surat-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function addWatermark(doc: jsPDF, text: string): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageCount = doc.getNumberOfPages();

  // Add watermark to all pages
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(220, 220, 220); // Light gray
    doc.setFontSize(48);
    doc.setFont('times', 'bold');

    // Rotate and place diagonally
    doc.text(text, pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: -45,
    });

    // Reset text color to black
    doc.setTextColor(0, 0, 0);
  }
}
