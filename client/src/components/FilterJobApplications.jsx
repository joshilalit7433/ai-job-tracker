import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import { Filter, X, Search, MapPin } from "lucide-react";

const FilterJobApplications = ({ onFilterChange }) => {
  const filterData = [
    {
      filterType: "Salary",
      filterOptions: [
        "100000-300000",
        "500000-800000",
        "800000-1200000",
        "1200000+",
      ],
    },
  ];

  const locationOptions = [
    "Bangalore",
    "Pune", 
    "Remote",
    "New Delhi",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Mumbai"
  ];

  const [selectedFilters, setSelectedFilters] = useState({
    Salary: "",
    Location: [],
    Company: "",
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const handleFilterChange = (filterType, value) => {
    const updated = { ...selectedFilters, [filterType]: value };
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  const handleCompanyInputChange = (e) => {
    const updated = { ...selectedFilters, Company: e.target.value };
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  const handleLocationSearch = (e) => {
    setLocationSearch(e.target.value);
    setShowLocationDropdown(true);
  };

  const handleLocationSelect = (location) => {
    if (!selectedFilters.Location.includes(location)) {
      const updatedLocations = [...selectedFilters.Location, location];
      const updated = { ...selectedFilters, Location: updatedLocations };
      setSelectedFilters(updated);
      onFilterChange(updated);
    }
    setLocationSearch("");
    setShowLocationDropdown(false);
  };

  const handleLocationRemove = (locationToRemove) => {
    const updatedLocations = selectedFilters.Location.filter(loc => loc !== locationToRemove);
    const updated = { ...selectedFilters, Location: updatedLocations };
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  const handleLocationRemoveAll = () => {
    const updated = { ...selectedFilters, Location: [] };
    setSelectedFilters(updated);
    onFilterChange(updated);
    setLocationSearch("");
  };

  const filteredLocations = locationOptions.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase()) &&
    !selectedFilters.Location.includes(location)
  );

  const resetFilters = () => {
    const resetState = { Salary: "", Location: [], Company: "" };
    setSelectedFilters(resetState);
    onFilterChange(resetState);
    setLocationSearch("");
    setShowLocationDropdown(false);
  };

  const hasActiveFilters = selectedFilters.Salary !== "" || selectedFilters.Location.length > 0 || selectedFilters.Company !== "";

  const renderFilterUI = () => (
    <>
      {filterData.map(({ filterType, filterOptions }) => (
        <div key={filterType} className="mb-6">
          <h2 className="text-base font-semibold mb-3 text-gray-800">{filterType}</h2>
          <div className="space-y-2">
            {filterOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name={filterType}
                  value={option}
                  checked={selectedFilters[filterType] === option}
                  onChange={() => handleFilterChange(filterType, option)}
                  className="accent-blue-600 w-4 h-4"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <h2 className="text-base font-semibold mb-3 text-gray-800">Location</h2>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              placeholder="Search for location..."
              value={locationSearch}
              onChange={handleLocationSearch}
              onFocus={() => setShowLocationDropdown(true)}
            />
            {selectedFilters.Location.length > 0 && (
              <button
                onClick={handleLocationRemoveAll}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Selected Locations Display */}
          {selectedFilters.Location.length > 0 && (
            <div className="mt-3 space-y-2">
              {selectedFilters.Location.map((location) => (
                <div key={location} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{location}</span>
                  <button
                    onClick={() => handleLocationRemove(location)}
                    className="ml-auto text-blue-500 hover:text-blue-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Location Dropdown */}
          {showLocationDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationSelect(location)}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {location}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  {locationSearch ? "No locations found" : "All locations selected"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-semibold mb-3 text-gray-800">Company</h2>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="Search for company..."
            value={selectedFilters.Company}
            onChange={handleCompanyInputChange}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <div className="mt-16">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm w-full"
            >
              <Filter className="w-4 h-4" />
              <span>Filter Jobs</span>
              {hasActiveFilters && (
                <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {Object.values(selectedFilters).filter(v => v !== "" && v.length !== 0).length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-6 bg-white rounded-xl shadow-xl border-0 w-[90vw] max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">Filter Jobs</h1>
              <button
                onClick={() => setIsPopoverOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderFilterUI()}
          </PopoverContent>
        </Popover>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-80 bg-[#f7e9d6] shadow-lg border-r border-gray-200 z-10 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-blue-500">Filter Jobs</h1>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          {renderFilterUI()}
        </div>
      </div>
    </div>
  );
};

export default FilterJobApplications;
