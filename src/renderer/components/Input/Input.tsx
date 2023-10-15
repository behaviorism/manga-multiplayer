import React, { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  validate?: (input: string) => void;
  label?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Input = ({ validate, label, value, setValue, ...props }: Props) => {
  const [error, setError] = useState("");

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setValue(value);

      if (validate) {
        if (value) {
          validate(value);
        } else {
          setError("");
        }
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <label
        htmlFor="input"
        className={
          "block mb-2 text-sm font-medium text-white" +
          (error ? " text-red-500" : "")
        }
      >
        {label}
      </label>
      <input
        type="text"
        id="input"
        value={value}
        onChange={handleChange}
        {...props}
        className={
          "inpt inpt-primary " +
          (error
            ? "border text-red-900 placeholder-red-700 focus:border-red-500 bg-red-100 border-red-400 "
            : "") +
          props.className
        }
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
