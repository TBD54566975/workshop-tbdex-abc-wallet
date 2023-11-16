export function VcCard({ name, username }) {
  return (
    <div className="bg-blue-500 p-4 rounded-md overflow-hidden h-72">
      <div>
          <h2 className="text-lg font-semibold text-white">
            {name}
          </h2>
          <p className="text-sm" style={{ filter: 'var(--color-primary-yellow-filter)' }}>{`@${username}`}</p>
        </div>
    </div>
  )
}
