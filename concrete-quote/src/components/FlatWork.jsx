import { calcCubicYards, round2, currency } from '../utils/concrete'

function calcArea(area, pricing) {
  const sqFt = (parseFloat(area.length) || 0) * (parseFloat(area.width) || 0)
  const perimeter = 2 * ((parseFloat(area.length) || 0) + (parseFloat(area.width) || 0))
  const cy = calcCubicYards(area.length, area.width, area.thickness)

  const concrete = area.includeConcrete ? cy * (parseFloat(pricing.concretePerYard) || 0) : 0
  const labor = area.includeLabor ? cy * (parseFloat(pricing.laborFlatPerYard) || 0) : 0
  const wireMesh = area.includeWireMesh ? sqFt * (parseFloat(pricing.wireMeshPerSqFt) || 0) : 0
  const vaporBarrier = area.includeVaporBarrier ? sqFt * (parseFloat(pricing.vaporBarrierPerSqFt) || 0) : 0
  const rebar = area.includeRebar ? cy * (parseFloat(pricing.rebarFlatPerYard) || 0) : 0
  const forms = area.includeForms ? perimeter * (parseFloat(pricing.formsFlatPerLnFt) || 0) : 0
  const finishing = area.includeFinishing ? sqFt * (parseFloat(pricing.finishingPerSqFt) || 0) : 0
  const pumpTruck = area.includePumpTruck ? (parseFloat(pricing.pumpTruckFlat) || 0) : 0

  return { concrete, labor, wireMesh, vaporBarrier, rebar, forms, finishing, pumpTruck, cubicYards: cy, sqFt }
}

function newArea() {
  return {
    id: Date.now(),
    name: '',
    length: '',
    width: '',
    thickness: '4',
    includeConcrete: true,
    includeLabor: true,
    includeWireMesh: false,
    includeVaporBarrier: false,
    includeRebar: false,
    includeForms: false,
    includeFinishing: false,
    includePumpTruck: false,
  }
}

function AreaCard({ area, pricing, onChange, onRemove }) {
  const calc = calcArea(area, pricing)
  const subtotal = Object.values(calc).filter(v => typeof v === 'number' && !['cubicYards', 'sqFt'].includes(v)).reduce((a, b) => a + b, 0)
  const numSubtotal = calc.concrete + calc.labor + calc.wireMesh + calc.vaporBarrier + calc.rebar + calc.forms + calc.finishing + calc.pumpTruck

  const toggle = (key) => onChange({ ...area, [key]: !area[key] })
  const set = (key, val) => onChange({ ...area, [key]: val })

  const dimField = (label, key, placeholder) => (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        value={area[key] || ''}
        placeholder={placeholder}
        onChange={e => set(key, e.target.value)}
        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 w-full"
      />
    </div>
  )

  const Check = ({ label, fieldKey, value }) => (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        checked={area[fieldKey]}
        onChange={() => toggle(fieldKey)}
        className="w-4 h-4 accent-blue-600"
      />
      <span className="flex-1">{label}</span>
      {area[fieldKey] && <span className="text-slate-400 text-xs">{currency(value)}</span>}
    </label>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 border border-slate-100">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={area.name}
          placeholder="Area name (e.g. Driveway)"
          onChange={e => set('name', e.target.value)}
          className="flex-1 font-semibold text-slate-800 border-b border-slate-200 pb-1 focus:outline-none focus:border-blue-500 bg-transparent text-sm"
        />
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-lg leading-none">✕</button>
      </div>

      <div className="flex gap-2">
        {dimField("Length (ft)", "length", "20")}
        {dimField("Width (ft)", "width", "12")}
        {dimField('Thickness (in)', 'thickness', '4')}
      </div>

      {calc.cubicYards > 0 && (
        <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700 font-medium">
          {round2(calc.cubicYards)} cu yd &nbsp;·&nbsp; {round2(calc.sqFt)} sq ft
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Include in Quote</p>
        <Check label="Concrete" fieldKey="includeConcrete" value={calc.concrete} />
        <Check label="Labor" fieldKey="includeLabor" value={calc.labor} />
        <Check label="Wire Mesh" fieldKey="includeWireMesh" value={calc.wireMesh} />
        <Check label="Vapor Barrier" fieldKey="includeVaporBarrier" value={calc.vaporBarrier} />
        <Check label="Rebar" fieldKey="includeRebar" value={calc.rebar} />
        <Check label="Forms" fieldKey="includeForms" value={calc.forms} />
        <Check label="Finishing" fieldKey="includeFinishing" value={calc.finishing} />
        <Check label="Pump Truck" fieldKey="includePumpTruck" value={calc.pumpTruck} />
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-1">
        <span className="text-sm font-bold text-slate-700">Area Subtotal</span>
        <span className="text-base font-bold text-blue-700">{currency(numSubtotal)}</span>
      </div>
    </div>
  )
}

export function computeFlatWorkAreas(areas, pricing) {
  return areas.map(area => {
    const calc = calcArea(area, pricing)
    const subtotal = calc.concrete + calc.labor + calc.wireMesh + calc.vaporBarrier + calc.rebar + calc.forms + calc.finishing + calc.pumpTruck
    return { ...area, ...calc, subtotal }
  })
}

export default function FlatWork({ areas, setAreas, pricing }) {
  const add = () => setAreas(prev => [...prev, newArea()])
  const remove = (id) => setAreas(prev => prev.filter(a => a.id !== id))
  const update = (id, updated) => setAreas(prev => prev.map(a => a.id === id ? updated : a))

  return (
    <div className="flex flex-col gap-3">
      {areas.map(area => (
        <AreaCard
          key={area.id}
          area={area}
          pricing={pricing}
          onChange={updated => update(area.id, updated)}
          onRemove={() => remove(area.id)}
        />
      ))}
      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
      >
        + Add Flat Work Area
      </button>
    </div>
  )
}
