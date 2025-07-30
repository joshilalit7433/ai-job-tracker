interface InputProps {
  label: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const InputField = ({ label, name, type, icon, value, onChange, error }: InputProps) => (
  <div className="mb-4">
    <label className="text-base sm:text-lg text-[#131D4F]">{label}</label>
    <div className="flex items-center border-b-2 border-[#131D4F] py-2 mt-1">
      {icon}
      <input
        type={type}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        className="bg-transparent w-full text-[#131D4F] focus:outline-none text-sm sm:text-base"
      />
    </div>
    {error && <p className="text-[#131D4F] text-xs sm:text-sm mt-1">{error}</p>}
  </div>
);
