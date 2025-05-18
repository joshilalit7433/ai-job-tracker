import { useState } from "react"

const FilterJobApplications = ({ onFilterChange }) => {
    const filterData=[
        {
            filterType:"Salary",
            filterOptions:["100000-300000","500000-800000","800000-1200000","1200000+"]
        },
        {
            filterType:"Location",
            filterOptions:["Mumbai","Delhi","Bangalore","Hyderabad","Pune","Rajasthan"]
        },
       
    ]

    const [selectedFilters, setSelectedFilters] = useState({
        Salary:"",
        Location:""
    });



  const handleFilterChange = (filterType,value) =>{
    let updateValue=value;

    const updateFilter={ ...selectedFilters,[filterType]:updateValue};
    setSelectedFilters(updateFilter);
    onFilterChange(updateFilter);
  }

  const resetFilters = () =>{
    const resetState={Salary:"",Location:""};
    setSelectedFilters(resetState);
    onFilterChange(resetState);
  }



  return (
     <div className="mt-16">
       <div className=" hidden lg:block p-4 border-r border-gray-200 fixed top-[64px] h-[calc(100vh-64px)] overflow-y-auto w-[200px] bg-white shadow-lg z-10">
        <h1 className="text-xl font-bold text-blue-500 mb-6 mt-4">
          Filter Job Applications
        </h1>
        {filterData.map((data, index) => (
          <div key={index} className="mb-4">
            <h2 className="text-lg font-semibold text-blue-500 mb-2">
              {data.filterType}
            </h2>
            {data.filterOptions.map((item, optionIndex) => (
              <div key={optionIndex} className="flex items-center mb-2">
                <input
                  type="radio"
                  id={`${data.filterType}-${item}`}
                  name={data.filterType}
                  value={item}
                  onChange={() => handleFilterChange(data.filterType, item)}
                  checked={data.filterType === "Jobs" 
                    ? selectedFilters[data.filterType] === item.toLowerCase()
                    : selectedFilters[data.filterType] === item}
                  className="form-radio h-4 w-4 text-blue-500"
                />
                <label
                  htmlFor={`${data.filterType}-${item}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {item}
                </label>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={resetFilters}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Reset Filters
        </button>
      </div>
      </div>
  )
}

export default FilterJobApplications