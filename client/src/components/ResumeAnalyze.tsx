import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaLightbulb,
} from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { ApiResponse } from "../types/apiResponse";
import { JOB_APPLICANT_API_END_POINT } from "../utils/constant";
import { ResumeAnalysisData, AppliedStatus } from "../types/models";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResumeAnalyze = () => {
  const { id: jobId } = useParams();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axios.get<ApiResponse<AppliedStatus>>(
          `${JOB_APPLICANT_API_END_POINT}/is-applied/${jobId}`,
          { withCredentials: true }
        );

        if (
          res.data.success &&
          res.data.data.applied &&
          res.data.data.resumeAnalysis
        ) {
          setAnalysis(res.data.data.resumeAnalysis);
        }
      } catch (err) {
        console.error("Failed to load resume analysis", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-400">
        Resume analysis not available.
      </div>
    );
  }

  const MAX_SCORE = 5;

  const doughnutData = {
    labels: ["Score", "Remaining"],
    datasets: [
      {
        data: [analysis.resumeScore, MAX_SCORE - analysis.resumeScore],
        backgroundColor: ["#10B981", "#E5E7EB"],
        borderColor: ["#059669", "#D1D5DB"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "75%",
    plugins: { tooltip: { enabled: false }, legend: { display: false } },
    animation: { duration: 1000, easing: "easeOutQuart" as const },
  };

  const renderList = (
    title: string,
    items: string[],
    icon: JSX.Element,
    color: string
  ) => (
    <div className="mb-6">
      <h3 className={`flex items-center gap-2 font-semibold text-base ${color}`}>
        {icon} {title}
      </h3>
      {items.length ? (
        <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic text-gray-400">No data available</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen mt-12 px-4 py-10 bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Resume Analysis</h1>
          {analysis.name && (
            <p className="text-sm text-gray-500 mt-1">
              for <span className="font-semibold text-gray-700">{analysis.name}</span>
            </p>
          )}
        </div>

        {/* Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 p-5 rounded-xl border border-gray-200">
          <div className="md:col-span-2 space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Employability Score
            </h2>
            <p className="text-sm text-gray-600">
              This is an AI-generated score based on your resume and job
              requirements.
            </p>
          </div>
          <div className="relative flex justify-center items-center w-40 h-40 mx-auto">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute text-center">
              <div className="text-4xl font-bold text-emerald-600">
                {analysis.resumeScore}
              </div>
              <div className="text-xs text-gray-500">out of {MAX_SCORE}</div>
            </div>
          </div>
        </div>

        {/* Lists & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            {renderList(
              "Key Qualifications Matched",
              analysis.keyQualificationsMatched,
              <FaCheckCircle className="text-emerald-600" />,
              "text-emerald-700"
            )}
            {renderList(
              "Skills Not Backed by Experience",
              analysis.skillsNotBackedByExperience,
              <FaExclamationTriangle className="text-orange-500" />,
              "text-orange-700"
            )}
            {renderList(
              "Suitable Job Roles",
              analysis.suitableJobRoles,
              <FaBriefcase className="text-blue-600" />,
              "text-blue-800"
            )}
            {renderList(
              "Education",
              analysis.education,
              <FaGraduationCap className="text-purple-600" />,
              "text-purple-800"
            )}
            {renderList(
              "Projects",
              analysis.projects,
              <FaCode className="text-teal-600" />,
              "text-teal-800"
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center gap-2">
              <FaLightbulb className="text-yellow-500" />
              Actionable Recommendations
            </h3>
            {Object.entries(analysis.recommendations).map(([key, list]) => (
              <div
                key={key}
                className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100"
              >
                <h4 className="text-sm font-bold text-yellow-900 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </h4>
                {list.length ? (
                  <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                    {list.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs italic text-gray-400">
                    No suggestions available.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📝 Final Summary
          </h3>
          <p className="text-sm text-gray-700 italic bg-green-50 border border-green-100 p-4 rounded-md">
            {analysis.finalNotes}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyze;
