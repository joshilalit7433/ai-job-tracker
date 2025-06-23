import axios from 'axios';
import { useState, useEffect } from 'react';
import { JOB_APPLICANT_API_END_POINT } from '../utils/constant';
import { useParams } from 'react-router-dom';

const RecruiterResponse = () => {
  const [recruiterResponse, setRecruiterResponse] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { id: applicantId } = useParams();  


  useEffect(() => {
    const fetchRecruiterResponse = async () => {
      try {
        const response = await axios.get(`${JOB_APPLICANT_API_END_POINT}/response-to-applicant/${applicantId}`, {
          withCredentials: true,
        });

        const data = response.data;
        if (data.success) {
          setRecruiterResponse(data.recruiterResponse || '');
          setStatus(data.status || '');
        } else {
          console.error('Failed to fetch recruiter response:', data.message);
        }
      } catch (error) {
        console.error('Error fetching recruiter response:', error);
      }
    };

    if (applicantId) fetchRecruiterResponse();
  }, [applicantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${JOB_APPLICANT_API_END_POINT}/response-to-applicant/${applicantId}`,
        {
          recruiterResponse,
          status,
        },
        { withCredentials: true }
      );

      const data = response.data;
      if (data.success) {
        setMessage('Response sent successfully!');
        setRecruiterResponse('');
        setStatus('');
      } else {
        setMessage('Failed to send response.');
      }
    } catch (error) {
      console.error('Error sending recruiter response:', error);
      setMessage('An error occurred while sending response.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-[150px] p-4 border rounded shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Recruiter Response</h2>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="rejected">Rejected</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea
            value={recruiterResponse}
            onChange={(e) => setRecruiterResponse(e.target.value)}
            rows={5}
            placeholder="Write your response..."
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Sending...' : 'Submit Response'}
        </button>

        {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
};

export default RecruiterResponse;
