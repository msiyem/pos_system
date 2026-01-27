export default function SummaryCard({
  icon: Icon,
  title,
  value,
  color = 'text-green-500',
  active,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-2 border p-5 rounded-2xl 
        shadow-2xs hover:scale-101 cursor-pointer
        ${active ? 'border-orange-200 border-2' : 'border-gray-300'}`}
    >
      <Icon size={32} className={`${color} border rounded-lg p-1`} />
      <span className="font-semibold">{title}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}
