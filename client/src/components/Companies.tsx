import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant";
import { JobApplication } from "../types/models";
import { ApiResponse } from "../types/apiResponse";

const Companies = () => {
  const [logo, setLogo] = useState<JobApplication[]>([]);
  

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const response = await axios.get<ApiResponse<JobApplication[]>>(
          `${JOB_APPLICATION_API_END_POINT}/get-job-applications`
        );
        const data = response.data.data;
          setLogo(data);

      } catch (error) {
        console.error("Error fetching company logo:", error);
        
      }
    };
    fetchCompanyLogo();
  }, []);

  const firstRow = logo.slice(0, Math.ceil(logo.length / 2));
  const secondRow = logo.slice(Math.ceil(logo.length / 2));

  return (
    <div className="text-center py-10 px-4 bg-[#f7e9d6] overflow-hidden">
      <h2 className="text-2xl font-semibold mb-10">
        We Are Glad To Be Trusted By!
      </h2>
      <div className="mb-8">
        <div className="flex animate-slide-left-to-right">
          {firstRow.map((company) => (
            <div key={company._id} className="flex flex-col items-center mx-8 min-w-[120px]">
              <img src={company.image} alt={company.companyName} className="h-16 object-contain mb-2" />
              <p className="text-sm text-center">{company.companyName}</p>
            </div>
          ))}
          {firstRow.map((company) => (
            <div key={`duplicate-${company._id}`} className="flex flex-col items-center mx-8 min-w-[120px]">
              <img src={company.image} alt={company.companyName} className="h-16 object-contain mb-2" />
              <p className="text-sm text-center">{company.companyName}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex animate-slide-right-to-left">
          {secondRow.map((company) => (
            <div key={company._id} className="flex flex-col items-center mx-8 min-w-[120px]">
              <img src={company.image} alt={company.companyName} className="h-16 object-contain mb-2" />
              <p className="text-sm text-center">{company.companyName}</p>
            </div>
          ))}
          {secondRow.map((company) => (
            <div key={`duplicate-${company._id}`} className="flex flex-col items-center mx-8 min-w-[120px]">
              <img src={company.image} alt={company.companyName} className="h-16 object-contain mb-2" />
              <p className="text-sm text-center">{company.companyName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;