import { createPortal } from 'react-dom';

export default function Dropdown({ open, children, position }) {
  if(!open) return null;
  return createPortal(
    <div
      className="absolute z-50 bg-white shadow rounded-xl border border-gray-300"
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        position: 'absolute',
      }}
    >
      {children}
    </div>,
    document.body
  );
}
