import type { ReportSummary, Infringement } from "@/lib/api";

// Severity color mapping (RGB)
const SEVERITY_COLORS: Record<Infringement["severity"], [number, number, number]> = {
  CRITICAL: [147, 0, 20],
  MODERATE: [106, 71, 0],
  OBSERVATIONAL: [50, 53, 60],
};

const SEVERITY_TEXT: Record<Infringement["severity"], [number, number, number]> = {
  CRITICAL: [255, 179, 174],
  MODERATE: [255, 176, 0],
  OBSERVATIONAL: [215, 196, 172],
};

export async function exportReportAsPdf(report: ReportSummary): Promise<void> {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;

  let y = 0;

  // ─── helpers ───────────────────────────────────────────────────────────────

  function newPage() {
    doc.addPage();
    y = margin;
    drawPageHeader();
  }

  function checkPageBreak(needed: number) {
    if (y + needed > pageH - 20) newPage();
  }

  function drawPageHeader() {
    // thin amber top bar
    doc.setFillColor(255, 176, 0);
    doc.rect(0, 0, pageW, 2, "F");
  }

  function drawDivider(color: [number, number, number] = [50, 53, 60]) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 4;
  }

  // ─── Cover header ──────────────────────────────────────────────────────────

  // Dark background header block
  doc.setFillColor(25, 28, 34);
  doc.rect(0, 0, pageW, 52, "F");

  // Amber accent bar
  doc.setFillColor(255, 176, 0);
  doc.rect(0, 0, pageW, 2, "F");

  // Logo / title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 176, 0);
  doc.text("TRACEGUARD", margin, 18);

  doc.setFontSize(8);
  doc.setTextColor(160, 140, 120);
  doc.text("IP INFRINGEMENT INTELLIGENCE PLATFORM", margin, 24);

  // Report title
  doc.setFontSize(14);
  doc.setTextColor(225, 226, 235);
  doc.text("INFRINGEMENT REPORT", margin, 36);

  // Meta row
  doc.setFontSize(7.5);
  doc.setTextColor(160, 140, 120);
  const date = new Date().toUTCString().toUpperCase();
  doc.text(`SCAN ID: ${report.scanId}`, margin, 44);
  doc.text(`GENERATED: ${date}`, margin, 49);
  doc.text(`TOTAL MATCHES DETECTED: ${report.totalMatches}`, pageW - margin, 44, { align: "right" });
  doc.text(`RECORDS IN REPORT: ${report.infringements.length}`, pageW - margin, 49, { align: "right" });

  y = 58;

  // ─── Summary stats row ─────────────────────────────────────────────────────

  const critical = report.infringements.filter((i) => i.severity === "CRITICAL").length;
  const moderate = report.infringements.filter((i) => i.severity === "MODERATE").length;
  const observational = report.infringements.filter((i) => i.severity === "OBSERVATIONAL").length;

  const statBoxW = (contentW - 6) / 3;
  const stats = [
    { label: "CRITICAL", value: critical, bg: [147, 0, 20] as [number,number,number], fg: [255, 179, 174] as [number,number,number] },
    { label: "MODERATE", value: moderate, bg: [106, 71, 0] as [number,number,number], fg: [255, 176, 0] as [number,number,number] },
    { label: "OBSERVATIONAL", value: observational, bg: [30, 33, 40] as [number,number,number], fg: [215, 196, 172] as [number,number,number] },
  ];

  stats.forEach((stat, i) => {
    const x = margin + i * (statBoxW + 3);
    doc.setFillColor(...stat.bg);
    doc.rect(x, y, statBoxW, 20, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...stat.fg);
    doc.text(String(stat.value), x + statBoxW / 2, y + 12, { align: "center" });

    doc.setFontSize(6.5);
    doc.setTextColor(200, 180, 160);
    doc.text(stat.label, x + statBoxW / 2, y + 18, { align: "center" });
  });

  y += 26;
  drawDivider([255, 176, 0]);

  // ─── Column headers ────────────────────────────────────────────────────────

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(160, 140, 120);
  doc.text("SEVERITY", margin, y);
  doc.text("DOMAIN / ASSET", margin + 24, y);
  doc.text("MATCH", margin + 110, y);
  doc.text("SOURCE TYPE", margin + 128, y);
  doc.text("STATUS", margin + 165, y);
  y += 2;
  drawDivider([50, 53, 60]);

  // ─── Infringement rows ─────────────────────────────────────────────────────

  report.infringements.forEach((item, idx) => {
    const rowH = 34 + Math.ceil(item.systemNote.length / 60) * 4;
    checkPageBreak(rowH);

    // Alternating background
    if (idx % 2 === 0) {
      doc.setFillColor(29, 32, 38);
      doc.rect(margin, y - 2, contentW, rowH, "F");
    }

    // Left severity bar
    doc.setFillColor(...SEVERITY_COLORS[item.severity]);
    doc.rect(margin, y - 2, 2, rowH, "F");

    // Severity badge
    doc.setFillColor(...SEVERITY_COLORS[item.severity]);
    doc.roundedRect(margin + 4, y, 18, 5, 0.5, 0.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...SEVERITY_TEXT[item.severity]);
    doc.text(item.severity, margin + 13, y + 3.5, { align: "center" });

    // Domain
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(225, 226, 235);
    doc.text(item.domain, margin + 24, y + 4);

    // Match percent
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...SEVERITY_TEXT[item.severity]);
    doc.text(`${item.matchPercent}%`, margin + 110, y + 4);

    // Source type
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(215, 196, 172);
    doc.text(item.sourceType.replace(/_/g, " "), margin + 128, y + 4);

    // Status
    doc.setFontSize(7);
    doc.setTextColor(160, 140, 120);
    doc.text(item.status.replace(/_/g, " "), margin + 165, y + 4);

    // Tags
    let tagX = margin + 24;
    const tagY = y + 10;
    item.tags.slice(0, 5).forEach((tag) => {
      const tagW = Math.min(doc.getTextWidth(tag) * 0.7 + 4, 30);
      doc.setFillColor(50, 53, 60);
      doc.rect(tagX, tagY - 3, tagW, 4.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5);
      doc.setTextColor(255, 176, 0);
      doc.text(tag.toUpperCase(), tagX + tagW / 2, tagY + 0.5, { align: "center" });
      tagX += tagW + 2;
      if (tagX > margin + 100) return;
    });

    // System note (word-wrapped)
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(215, 196, 172);
    const noteLines = doc.splitTextToSize(`"${item.systemNote}"`, contentW - 28);
    const noteY = y + 17;
    // Left note bar
    doc.setDrawColor(...SEVERITY_COLORS[item.severity]);
    doc.setLineWidth(0.5);
    doc.line(margin + 24, noteY - 1, margin + 24, noteY + noteLines.length * 3.8);
    doc.text(noteLines, margin + 27, noteY);

    y += rowH + 2;
  });

  // ─── Footer on every page ──────────────────────────────────────────────────

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(11, 14, 20);
    doc.rect(0, pageH - 10, pageW, 10, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(100, 90, 80);
    doc.text(
      `TRACEGUARD CONFIDENTIAL  ·  SCAN ${report.scanId}  ·  ${new Date().toISOString().slice(0, 10)}`,
      margin,
      pageH - 4
    );
    doc.text(`PAGE ${p} / ${totalPages}`, pageW - margin, pageH - 4, { align: "right" });
  }

  // ─── Save ──────────────────────────────────────────────────────────────────

  doc.save(`traceguard-report-${report.scanId}.pdf`);
}
