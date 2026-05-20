export const Header = () => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Project Aegis</h2>
          <p className="text-sm text-gray-400">Fully Offline Health Informatics Platform</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Connected</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
