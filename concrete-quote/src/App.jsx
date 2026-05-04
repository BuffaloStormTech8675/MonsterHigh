import { useState, useEffect } from 'react'
import ProjectInfo from './components/ProjectInfo'
import Pricing, { defaultPricing } from './components/Pricing'
import FlatWork, { computeFlatWorkAreas } from './components/FlatWork'
import Walls, { computeWalls } from './components/Walls'
import Summary from './components/Summary'
import { currency } from './utils/concrete'
import './index.css'

const TABS = ['Info', 'Pricing', 'Flat Work', 'Walls', 'Summary']
const STORAGE_KEY = 'concreteQuoteState'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export default function App() {
  const saved = loadState()

  const [tab, setTab] = useState(0)
  const [projectInfo, setProjectInfo] = useState(saved?.projectInfo || { date: new Date().toISOString().split('T')[0] })
  const [pricing, setPricing] = useState(saved?.pricing || defaultPricing)
  const [flatAreas, setFlatAreas] = useState(saved?.flatAreas || [])
  const [walls, setWalls] = useState(saved?.walls || [])
  const [notes, setNotes] = useState(saved?.notes || '')

  useEffect(() => {
    const state = { projectInfo, pricing, flatAreas, walls, notes }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [projectInfo, pricing, flatAreas, walls, notes])

  const computedFlat = computeFlatWorkAreas(flatAreas, pricing)
  const computedWalls = computeWalls(walls, pricing)
  const grandTotal = [...computedFlat, ...computedWalls].reduce((s, x) => s + (x.subtotal || 0), 0)

  const resetQuote = () => {
    if (confirm('Clear all quote data and start fresh?')) {
      setProjectInfo({ date: new Date().toISOString().split('T')[0] })
      setFlatAreas([])
      setWalls([])
      setNotes('')
      setTab(0)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-lg mx-auto">
      <div className="bg-blue-700 text-white px-4 pt-10 pb-4 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold leading-tight">Concrete Estimator</h1>
            <p className="text-blue-200 text-xs">Flat Work & Walls</p>
          </div>
          {grandTotal > 0 && (
            <div className="text-right">
              <p className="text-blue-200 text-xs">Total</p>
              <p className="text-lg font-bold">{currency(grandTotal)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-800 px-2 flex overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              tab === i
                ? 'text-white border-white'
                : 'text-blue-300 border-transparent hover:text-white'
            }`}
          >
            {t}
            {i === 2 && flatAreas.length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">{flatAreas.length}</span>
            )}
            {i === 3 && walls.length > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">{walls.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {tab === 0 && (
          <>
            <ProjectInfo info={projectInfo} onChange={setProjectInfo} />
            <button
              onClick={resetQuote}
              className="text-center text-red-400 text-sm py-2 underline"
            >
              Clear & Start New Quote
            </button>
          </>
        )}
        {tab === 1 && <Pricing pricing={pricing} onChange={setPricing} />}
        {tab === 2 && <FlatWork areas={flatAreas} setAreas={setFlatAreas} pricing={pricing} />}
        {tab === 3 && <Walls walls={walls} setWalls={setWalls} pricing={pricing} />}
        {tab === 4 && (
          <Summary
            projectInfo={projectInfo}
            flatWorkAreas={computedFlat}
            wallAreas={computedWalls}
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </div>
      <div className="h-6" />
    </div>
  )
}
