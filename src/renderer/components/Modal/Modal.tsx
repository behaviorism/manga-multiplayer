import React, { PropsWithChildren, useRef } from "react";

type Props = PropsWithChildren<{
  title?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
}>;

const Modal = ({ children, title, isOpen, setIsOpen, onClose }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    isOpen && (
      <div
        ref={modalRef}
        tabIndex={-1}
        className="flex items-center justify-center fixed bg-gray-900 bg-opacity-50 top-0 left-0 right-0 z-50 w-full overflow-x-hidden overflow-y-hidden md:inset-0 h-[calc(100%-1rem)] max-h-full"
        onClick={({ target }) => modalRef.current === target && handleClose()}
      >
        <div className="border-2 border-gray-500 overflow-y-auto relative max-h-full max-w-md rounded-lg shadow bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={handleClose}
          >
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
          <div className="px-6 py-6">
            <h3 className="mb-4 mr-5 text-xl font-medium text-white overflow-hidden overflow-ellipsis">
              {title}
            </h3>
            {children}
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
