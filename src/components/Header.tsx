const Header = () => {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="text-xl font-semibold">Q3 Financial Overview</div>
      <button
        onClick={() => console.log("New Action clicked")}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
      >
        New Action
      </button>
    </div>
  );
};

export default Header;
