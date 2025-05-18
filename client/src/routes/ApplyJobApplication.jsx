import { useState } from 'react';
import axios from 'axios';
import { JOB_APPLICANT_END_POINT, USER_API_END_POINT } from '../utils/constant.js';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { useNavigate, useParams } from 'react-router-dom';

const ApplyJobForm = () => {
  const [formData, setFormData] = useState({ cover_letter: '' });
  const { id } = useParams(); 

  const [resumeFile, setResumeFile] = useState(null);
  const [uploadedResumeURL, setUploadedResumeURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return toast.error('Please select a resume to upload.');

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API_END_POINT}/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      if (res.data.success) {
        toast.success('Resume uploaded!');
        setUploadedResumeURL(res.data.user.resume);
        dispatch(setUser(res.data.user));
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Error uploading resume');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!uploadedResumeURL) {
      toast.error('Please upload your resume first');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${JOB_APPLICANT_END_POINT}/apply/${id}`,
        {
          cover_letter: formData.cover_letter,
          resume: uploadedResumeURL,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Application submitted successfully!');
        setFormData({ coverLetter: '' });
        setUploadedResumeURL('');
        setResumeFile(null);
        navigate('/user-profile');
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Apply for this Job</h2>

      
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF, DOC)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="w-full px-2 py-2 border rounded-md"
          />
          {resumeFile && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">{resumeFile.name}</span>
              <button
                type="button"
                onClick={handleResumeUpload}
                disabled={loading}
                className="text-blue-600 hover:underline text-sm"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          )}
          {uploadedResumeURL && (
            <p className="text-sm text-green-600 mt-1">Resume uploaded ✔️</p>
          )}
        </div>

       
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
          <textarea
            name="cover_letter"
            rows="4"
            required
            value={formData.coverLetter}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

     
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200 w-full sm:w-auto"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>

      
        {message && (
          <p className="text-center text-sm text-green-600 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ApplyJobForm;
