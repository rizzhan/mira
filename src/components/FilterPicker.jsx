import { useMemo } from 'react'
import { FILTERS, filterThumb } from '../lib/photobooth'

function groupedFilters() {
  const groups = []
  for (const f of FILTERS) {
    const last = groups[groups.length - 1]
    if (!last || last.name !== f.group) groups.push({ name: f.group, items: [] })
    groups[groups.length - 1].items.push(f)
  }
  return groups
}

export default function FilterPicker({ value, onChange }) {
  const thumbs = useMemo(() => {
    const map = {}
    for (const f of FILTERS) map[f.id] = filterThumb(f)
    return map
  }, [])
  const groups = groupedFilters()
  return (
    <div className="filter-groups">
      {groups.map((g) => (
        <div className="filter-group" key={g.name}>
          <span className="filter-group-label">{g.name}</span>
          <div className="filter-row">
            {g.items.map((f) => (
              <button
                key={f.id}
                type="button"
                className={'swatch' + (value === f.id ? ' active' : '')}
                onClick={() => onChange(f.id)}
                aria-label={f.label}
              >
                <span className="swatch-dot" style={{ backgroundImage: `url(${thumbs[f.id]})` }} />
                <span className="swatch-label">{f.label}</span>
                <span className="swatch-tooltip" role="tooltip">
                  {f.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}