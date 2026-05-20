import { useState } from 'react';

interface SidebarItem {
  label: string;
  value: string;
  icon?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  active?: string;
  onItemClick?: (value: string) => void;
}

export const Sidebar = ({ items, active, onItemClick }: SidebarProps) => {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-6 space-y-2">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Aegis Health</h1>
        <p className="text-xs text-gray-500 mt-1">Personal Health Informatics</p>
      </div>

      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => onItemClick?.(item.value)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
              active === item.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
