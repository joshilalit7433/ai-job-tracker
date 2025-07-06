import React, { useEffect, useState } from "react";
import axios from "axios";
import { JOB_APPLICATION_API_END_POINT } from "../utils/constant.js";

const Companies = () => {
  const [logo, setLogo] = useState([]);

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const response = await axios.get(
          `${JOB_APPLICATION_API_END_POINT}/get-job-applications`
        );
        const data = response.data;
        if (data.success) {
          setLogo(data.jobapplications);
        }
      } catch (error) {
        console.error("Error fetching company logo:", error);
      }
    };
    fetchCompanyLogo();
  }, []);

  return (
    <div className="text-center py-10 px-4 bg-[#f7e9d6]">
      <h2 className="text-2xl font-semibold mb-10">
        We Are Glad To Be Trusted By!
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {logo.map((company) => (
          <div key={company._id} className="flex flex-col items-center">
            <img
              src={company.image}
              alt={company.company_name}
              className="h-16 object-contain mb-2"
            />
            <p className="text-sm">{company.company_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Companies;
