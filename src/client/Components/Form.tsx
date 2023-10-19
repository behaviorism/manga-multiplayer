import { createContext, useState } from "react";

interface Props {
  onSubmit: (event: React.FormEvent) => void;
  submitLabel: string;
}

type Validator = () => void;

type Context = React.Dispatch<React.SetStateAction<Array<Validator>>>;

export const FormContext = createContext<Context>(() => {});

const Form = ({
  onSubmit,
  submitLabel,
  children,
}: React.PropsWithChildren<Props>) => {
  const [validators, setValidators] = useState<Array<Validator>>([]);

  const _handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let hasError = false;

    for (let validator of validators) {
      try {
        validator();
      } catch (error: any) {
        hasError = true;
      }
    }

    if (!hasError) {
      onSubmit(event);
    }
  };

  return (
    <FormContext.Provider value={setValidators}>
      <form className="space-y-6 block m-0" onSubmit={_handleSubmit}>
        {children}
        <button type="submit" className="w-full btn btn-primary">
          {submitLabel}
        </button>
      </form>
    </FormContext.Provider>
  );
};

export default Form;
