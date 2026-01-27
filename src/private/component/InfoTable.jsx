export default function InfoTable({ title, rows }) {
  return (
    <div className="w-full">
      <p className="text-[18px] mt-8 my-2 font-medium">{title}</p>
      <table className="w-full text-gray-700 text-[16px]">
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border border-gray-300">
              <th className="flex items-center gap-1.5 p-2">
                {row.icon && row.icon}
                <span className="font-medium">{row.label}</span>
              </th>
              <td className="w-1/2">{row.value ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
