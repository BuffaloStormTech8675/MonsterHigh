import { currency } from '../utils/concrete'
import { generatePDF } from '../utils/pdfExport'

export default function Summary({ projectInfo, flatWorkAreas, wallAreas, notes, setNotes }) {
  const flatTotal = flatWorkAreas.reduce((sum, a) => sum + (a.subtotal || 0), 0)
  const wallTotal = wallAreas.reduce((sum, w) => sum + (w.subtotal || 0), 0)
  const grandTotal = flatTotal + wallTotal

  const handlePDF = () => {
    generatePDF({
      projectInfo,
      flatWork: flatWorkAreas,
      walls: wallAreas,
      notes,
      totals: { flatWork: flatTotal, walls: wallTotal, grand: grandTotal },
    })
  }

  const LineItem = ({ label, amount }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{currency(amount)}</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
        <h2 className="font-bold text-slate-800 text-base mb-1">Quote Summary</h2>

        {flatWorkAreas.length === 0 && wallAreas.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-4">
            Add flat work areas or walls to see a summary.
          </p>
        )}

        {flatWorkAreas.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-2">Flat Work</p>
            {flatWorkAreas.map(a => (
              <LineItem key={a.id} label={a.name || 'Unnamed Area'} amount={a.subtotal || 0} />
            ))}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-700">Flat Work Total</span>
              <span className="text-sm font-bold text-slate-800">{currency(flatTotal)}</span>
            </div>
          </>
        )}

        {wallAreas.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-2">Walls</p>
            {wallAreas.map(w => (
              <LineItem key={w.id} label={w.name || 'Unnamed Wall'} amount={w.subtotal || 0} />
            ))}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold text-slate-700">Walls Total</span>
              <span className="text-sm font-bold text-slate-800">{currency(wallTotal)}</span>
            </div>
          </>
        )}

        {grandTotal > 0 && (
          <div className="bg-blue-700 rounded-xl p-4 flex justify-between items-center mt-2">
            <span className="text-white font-bold text-base">GRAND TOTAL</span>
            <span className="text-white font-bold text-xl">{currency(grandTotal)}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes / Terms</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any notes, payment terms, or exclusions..."
          rows={4}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-slate-50"
        />
      </div>

      <button
        onClick={handlePDF}
        disabled={grandTotal === 0}
        className="w-full py-4 rounded-2xl bg-blue-700 text-white font-bold text-base shadow-lg hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Download PDF Quote
      </button>
    </div>
  )
}
