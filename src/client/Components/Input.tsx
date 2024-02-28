import React, { useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "./Form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  validate?: (input: string) => void;
  label?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Input = ({ validate, label, value, setValue, ...props }: Props) => {
  const setValidators = useContext(FormContext);
  const valueRef = useRef(value);
  valueRef.current = value;
  const [error, setError] = useState("");

  useEffect(() => {
    if (validate) {
      if (setValidators) {
        const validator = () => validate(valueRef.current);
        setValidators((validators) => [...validators, validator]);

        return () => {
          setValidators((validators) => {
            const newValidators = [...validators];
            const index = newValidators.indexOf(validator);
            newValidators.splice(index, 1);
            return newValidators;
          });
        };
      }
    }
  }, [validate === undefined, setValidators === undefined]);

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setValue(value);

      if (validate) {
        if (value) {
          validate(value);
        }

        setError("");
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
          (error ? " !text-red-500" : "")
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
          "inpt inpt-primary w-72 " +
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
