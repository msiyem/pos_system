export default function DateRange({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <div className="flex gap-10">
      <div className="flex flex-col gap-2">
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded px-2 border-gray-300 p-1"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          min={startDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded px-2 border-gray-300 p-1"
        />
      </div>
    </div>
  );
}
