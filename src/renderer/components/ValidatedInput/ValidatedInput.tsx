import React, { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  validate: (input: string) => string | undefined;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const ValidatedInput = ({ validate, setValue, ...props }: Props) => {
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError(validate(event.target.value) || "");
  };

  return (
    <>
      <input
        type="text"
        {...props}
        className={props["className"] + error ? " border-red-400" : ""}
        onChange={handleChange}
      />
      {error && <span className="text-red-700">{error}</span>}
    </>
  );
};

export default ValidatedInput;
