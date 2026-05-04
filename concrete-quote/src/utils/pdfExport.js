import { jsPDF } from 'jspdf'
import { currency, round2 } from './concrete'

export function generatePDF(quote) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const margin = 40
  let y = margin

  const line = (text, x, yPos, size = 10, style = 'normal', color = [30, 30, 30]) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', style)
    doc.setTextColor(...color)
    doc.text(text, x, yPos)
  }

  const hRule = (yPos) => {
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPos, 572, yPos)
  }

  // Header
  doc.setFillColor(30, 64, 175)
  doc.rect(0, 0, 612, 70, 'F')
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('CONCRETE QUOTE', margin, 35)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(quote.projectInfo.companyName || '', margin, 52)
  doc.text(`Date: ${quote.projectInfo.date || ''}`, 572, 52, { align: 'right' })
  y = 90

  // Customer info
  line('CUSTOMER INFORMATION', margin, y, 11, 'bold', [30, 64, 175])
  y += 16
  hRule(y); y += 10
  line(`Customer: ${quote.projectInfo.customerName || ''}`, margin, y, 10)
  line(`Address: ${quote.projectInfo.address || ''}`, 300, y, 10)
  y += 14
  line(`Job Name: ${quote.projectInfo.jobName || ''}`, margin, y, 10)
  line(`Phone: ${quote.projectInfo.phone || ''}`, 300, y, 10)
  y += 20

  const sectionHeader = (title) => {
    doc.setFillColor(241, 245, 249)
    doc.rect(margin, y - 12, 532, 18, 'F')
    line(title, margin + 4, y, 11, 'bold', [30, 64, 175])
    y += 10
    hRule(y); y += 10
  }

  const tableRow = (label, value, bold = false) => {
    line(label, margin + 8, y, 10, bold ? 'bold' : 'normal')
    line(value, 572, y, 10, bold ? 'bold' : 'normal', [30, 30, 30])
    y += 14
    if (y > 720) { doc.addPage(); y = margin }
  }

  // Flat Work
  if (quote.flatWork.length > 0) {
    y += 6
    sectionHeader('FLAT WORK')
    quote.flatWork.forEach((area, i) => {
      line(`${i + 1}. ${area.name || 'Area'}  (${area.length}' × ${area.width}' × ${area.thickness}")`, margin + 4, y, 10, 'bold')
      line(`${round2(area.cubicYards)} cu yd`, 572, y, 10, 'normal', [100, 100, 100])
      y += 14
      if (area.concrete > 0) tableRow('  Concrete', currency(area.concrete))
      if (area.labor > 0) tableRow('  Labor', currency(area.labor))
      if (area.wireMesh > 0) tableRow('  Wire Mesh', currency(area.wireMesh))
      if (area.vaporBarrier > 0) tableRow('  Vapor Barrier', currency(area.vaporBarrier))
      if (area.rebar > 0) tableRow('  Rebar', currency(area.rebar))
      if (area.forms > 0) tableRow('  Forms', currency(area.forms))
      if (area.finishing > 0) tableRow('  Finishing', currency(area.finishing))
      if (area.pumpTruck > 0) tableRow('  Pump Truck', currency(area.pumpTruck))
      tableRow('  Area Subtotal', currency(area.subtotal), true)
      y += 4
    })
  }

  // Walls
  if (quote.walls.length > 0) {
    y += 6
    sectionHeader('WALLS')
    quote.walls.forEach((wall, i) => {
      line(`${i + 1}. ${wall.name || 'Wall'}  (${wall.length}' × ${wall.height}' × ${wall.thickness}")`, margin + 4, y, 10, 'bold')
      line(`${round2(wall.cubicYards)} cu yd`, 572, y, 10, 'normal', [100, 100, 100])
      y += 14
      if (wall.concrete > 0) tableRow('  Concrete', currency(wall.concrete))
      if (wall.labor > 0) tableRow('  Labor', currency(wall.labor))
      if (wall.rebar > 0) tableRow('  Rebar', currency(wall.rebar))
      if (wall.forms > 0) tableRow('  Forms/Forming', currency(wall.forms))
      if (wall.pumpTruck > 0) tableRow('  Pump Truck', currency(wall.pumpTruck))
      if (wall.ties > 0) tableRow('  Ties & Hardware', currency(wall.ties))
      tableRow('  Wall Subtotal', currency(wall.subtotal), true)
      y += 4
    })
  }

  // Totals
  y += 10
  hRule(y); y += 16
  const totalsX = 400
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 30, 30)
  doc.text('Flat Work Total:', totalsX, y)
  doc.text(currency(quote.totals.flatWork), 572, y, { align: 'right' })
  y += 16
  doc.text('Walls Total:', totalsX, y)
  doc.text(currency(quote.totals.walls), 572, y, { align: 'right' })
  y += 16
  doc.setFillColor(30, 64, 175)
  doc.rect(totalsX - 10, y - 12, 200, 22, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('TOTAL:', totalsX, y)
  doc.text(currency(quote.totals.grand), 572, y, { align: 'right' })

  // Notes
  if (quote.notes) {
    y += 30
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.setFontSize(10)
    doc.text('Notes:', margin, y)
    y += 14
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(quote.notes, 532)
    doc.text(lines, margin, y)
  }

  doc.save(`concrete-quote-${quote.projectInfo.customerName || 'quote'}.pdf`)
}
