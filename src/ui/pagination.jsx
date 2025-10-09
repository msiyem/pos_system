export default function Pagination({ currentPage, totalPages = 1, onPageChange }) {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && i > 2) ||
      (i === currentPage + 2 && i < totalPages - 1)
    ) {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((p, index) =>
        p === '...' ? (
          <span key={index} className="px-3 py-1 select-none">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => goToPage(p)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === p
                ? 'bg-red-500 text-white font-medium'
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
}
