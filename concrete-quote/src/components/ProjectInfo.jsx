export default function ProjectInfo({ info, onChange }) {
  const field = (label, key, type = 'text', placeholder = '') => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={info[key] || ''}
        placeholder={placeholder}
        onChange={e => onChange({ ...info, [key]: e.target.value })}
        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
    </div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
      <h2 className="font-bold text-slate-800 text-base">Project Info</h2>
      {field('Company Name', 'companyName', 'text', 'Your Company')}
      {field('Customer Name', 'customerName', 'text', 'John Smith')}
      {field('Job Name / Description', 'jobName', 'text', 'Driveway & Foundation')}
      {field('Address', 'address', 'text', '123 Main St')}
      {field('Phone', 'phone', 'tel', '(555) 000-0000')}
      {field('Date', 'date', 'date')}
    </div>
  )
}
