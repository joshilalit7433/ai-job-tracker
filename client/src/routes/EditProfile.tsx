import React from "react";
import ProfileEditForm from "../components/ProfileEditForm";

const EditProfile: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7e9d6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <ProfileEditForm />
      </div>
    </div>
  );
};

export default EditProfile;