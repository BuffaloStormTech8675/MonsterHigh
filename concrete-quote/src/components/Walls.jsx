import { calcWallCubicYards, round2, currency } from '../utils/concrete'

function calcWall(wall, pricing) {
  const faceSqFt = (parseFloat(wall.length) || 0) * (parseFloat(wall.height) || 0)
  const cy = calcWallCubicYards(wall.length, wall.height, wall.thickness)

  const concrete = wall.includeConcrete ? cy * (parseFloat(pricing.concretePerYard) || 0) : 0
  const labor = wall.includeLabor ? cy * (parseFloat(pricing.laborWallPerYard) || 0) : 0
  const rebar = wall.includeRebar ? cy * (parseFloat(pricing.rebarWallPerYard) || 0) : 0
  const forms = wall.includeForms ? faceSqFt * (parseFloat(pricing.formsWallPerSqFt) || 0) : 0
  const pumpTruck = wall.includePumpTruck ? (parseFloat(pricing.pumpTruckWall) || 0) : 0
  const ties = wall.includeTies ? cy * (parseFloat(pricing.tiesPerYard) || 0) : 0

  return { concrete, labor, rebar, forms, pumpTruck, ties, cubicYards: cy, faceSqFt }
}

function newWall() {
  return {
    id: Date.now(),
    name: '',
    length: '',
    height: '',
    thickness: '8',
    includeConcrete: true,
    includeLabor: true,
    includeRebar: true,
    includeForms: true,
    includePumpTruck: false,
    includeTies: false,
  }
}

function WallCard({ wall, pricing, onChange, onRemove }) {
  const calc = calcWall(wall, pricing)
  const numSubtotal = calc.concrete + calc.labor + calc.rebar + calc.forms + calc.pumpTruck + calc.ties

  const toggle = (key) => onChange({ ...wall, [key]: !wall[key] })
  const set = (key, val) => onChange({ ...wall, [key]: val })

  const dimField = (label, key, placeholder) => (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs text-slate-500">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        value={wall[key] || ''}
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
        checked={wall[fieldKey]}
        onChange={() => toggle(fieldKey)}
        className="w-4 h-4 accent-blue-600"
      />
      <span className="flex-1">{label}</span>
      {wall[fieldKey] && <span className="text-slate-400 text-xs">{currency(value)}</span>}
    </label>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 border border-slate-100">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={wall.name}
          placeholder="Wall name (e.g. Foundation Wall)"
          onChange={e => set('name', e.target.value)}
          className="flex-1 font-semibold text-slate-800 border-b border-slate-200 pb-1 focus:outline-none focus:border-blue-500 bg-transparent text-sm"
        />
        <button onClick={onRemove} className="text-red-400 hover:text-red-600 text-lg leading-none">✕</button>
      </div>

      <div className="flex gap-2">
        {dimField("Length (ft)", "length", "40")}
        {dimField("Height (ft)", "height", "8")}
        {dimField('Thickness (in)', 'thickness', '8')}
      </div>

      {calc.cubicYards > 0 && (
        <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700 font-medium">
          {round2(calc.cubicYards)} cu yd &nbsp;·&nbsp; {round2(calc.faceSqFt)} sq ft face
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Include in Quote</p>
        <Check label="Concrete" fieldKey="includeConcrete" value={calc.concrete} />
        <Check label="Labor" fieldKey="includeLabor" value={calc.labor} />
        <Check label="Rebar" fieldKey="includeRebar" value={calc.rebar} />
        <Check label="Forms / Forming" fieldKey="includeForms" value={calc.forms} />
        <Check label="Pump Truck" fieldKey="includePumpTruck" value={calc.pumpTruck} />
        <Check label="Ties & Hardware" fieldKey="includeTies" value={calc.ties} />
      </div>

      <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-1">
        <span className="text-sm font-bold text-slate-700">Wall Subtotal</span>
        <span className="text-base font-bold text-blue-700">{currency(numSubtotal)}</span>
      </div>
    </div>
  )
}

export function computeWalls(walls, pricing) {
  return walls.map(wall => {
    const calc = calcWall(wall, pricing)
    const subtotal = calc.concrete + calc.labor + calc.rebar + calc.forms + calc.pumpTruck + calc.ties
    return { ...wall, ...calc, subtotal }
  })
}

export default function Walls({ walls, setWalls, pricing }) {
  const add = () => setWalls(prev => [...prev, newWall()])
  const remove = (id) => setWalls(prev => prev.filter(w => w.id !== id))
  const update = (id, updated) => setWalls(prev => prev.map(w => w.id === id ? updated : w))

  return (
    <div className="flex flex-col gap-3">
      {walls.map(wall => (
        <WallCard
          key={wall.id}
          wall={wall}
          pricing={pricing}
          onChange={updated => update(wall.id, updated)}
          onRemove={() => remove(wall.id)}
        />
      ))}
      <button
        onClick={add}
        className="w-full py-3 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
      >
        + Add Wall
      </button>
    </div>
  )
}
