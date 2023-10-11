import React from "react";

type Props = React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>;

const Modal = ({ children, isOpen, setIsOpen }: Props) => {
  return (
    isOpen && (
      <div>
        <button
          type="button"
          className="p-1.5 inline-flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        {children}
      </div>
    )
  );
};

export default Modal;
