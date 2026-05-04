const DEFAULTS = {
  concretePerYard: '',
  laborFlatPerYard: '',
  laborWallPerYard: '',
  wireMeshPerSqFt: '',
  vaporBarrierPerSqFt: '',
  rebarFlatPerYard: '',
  rebarWallPerYard: '',
  formsFlatPerLnFt: '',
  formsWallPerSqFt: '',
  finishingPerSqFt: '',
  pumpTruckFlat: '',
  pumpTruckWall: '',
  tiesPerYard: '',
}

export const defaultPricing = DEFAULTS

export default function Pricing({ pricing, onChange }) {
  const field = (label, key, placeholder = '0.00') => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={pricing[key] || ''}
          placeholder={placeholder}
          onChange={e => onChange({ ...pricing, [key]: e.target.value })}
          className="border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
        <h2 className="font-bold text-slate-800 text-base">Concrete</h2>
        {field('Concrete per Cubic Yard', 'concretePerYard', '150.00')}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
        <h2 className="font-bold text-slate-800 text-base">Flat Work Rates</h2>
        {field('Labor per Cu Yd', 'laborFlatPerYard', '50.00')}
        {field('Wire Mesh per Sq Ft', 'wireMeshPerSqFt', '0.15')}
        {field('Vapor Barrier per Sq Ft', 'vaporBarrierPerSqFt', '0.10')}
        {field('Rebar per Cu Yd', 'rebarFlatPerYard', '20.00')}
        {field('Forms per Linear Ft', 'formsFlatPerLnFt', '2.00')}
        {field('Finishing per Sq Ft', 'finishingPerSqFt', '0.50')}
        {field('Pump Truck (flat job)', 'pumpTruckFlat', '500.00')}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
        <h2 className="font-bold text-slate-800 text-base">Wall Rates</h2>
        {field('Labor per Cu Yd', 'laborWallPerYard', '75.00')}
        {field('Rebar per Cu Yd', 'rebarWallPerYard', '30.00')}
        {field('Forms per Sq Ft (wall face)', 'formsWallPerSqFt', '3.00')}
        {field('Pump Truck (wall job)', 'pumpTruckWall', '700.00')}
        {field('Ties & Hardware per Cu Yd', 'tiesPerYard', '15.00')}
      </div>
    </div>
  )
}
