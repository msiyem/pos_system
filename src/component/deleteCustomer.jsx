import { Trash2 } from "lucide-react";

export default function DeleteCustomerButton({ customerId, onDeleted }) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are sure you want to delete this customer?'
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3000/api/customers/${customerId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete customer');
      alert('✅ Customer deleted successfully!');
      if (onDeleted) onDeleted();
    } catch (err) {
      console.log(err);
      alert('❌ Error deleting customer');
    }
  };
  return (
    <button 
    onClick={handleDelete}
    className="flex gap-2 items-center border-gray-300 m-1 p-1 text-center cursor-pointer hover:bg-gray-50 hover:shadow mb-0 mt-0">
      <Trash2 className="h-4 w-4" />
      <span>Delete</span>
    </button>
  );
}
