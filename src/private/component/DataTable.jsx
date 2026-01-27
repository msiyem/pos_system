export default function DataTable({ columns, data, onView }) {
  return (
    <table className="w-full border-collapse">
      <thead className="sticky top-0 bg-gray-100 text-center">
        <tr>
          {columns.map((col, colIndex) => (
            <th 
            key={`${col.label}${colIndex}`}
            className="border border-gray-300 p-2">{col.label}</th>
          ))}
        </tr>
      </thead>

      <tbody className="text-center">
        {data.length ? data.map((row, i) => (
          <tr key={i}>
            {columns.map((col, colIndex) => (
              <td 
              key={`${col.label}${colIndex}`} 
              className="border border-gray-300 p-2 ">
                <div className="flex items-center justify-center">
                  {col.render ? col.render(row, i) : row[col.key]}
                </div>
              </td>
            ))}
          </tr>
        )) : (
          <tr className="border-b border-x border-gray-300">
            <td colSpan={columns.length} className="text-center p-4 text-red-500">
              No data found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
