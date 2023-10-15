import { PropsWithChildren } from "react";

interface Props {
  onClick?: () => void;
  width: string;
  height: string;
  viewBox?: string;
}

const ActionIcon = ({
  children,
  onClick,
  width,
  height,
  viewBox = "0 0 18 20",
}: PropsWithChildren<Props>) => {
  return (
    <button
      type="button"
      className="mx-2 text-white focus:ring-4 focus:outline-none font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
      onClick={onClick}
    >
      <svg
        className={`w-${width} h-${height} text-gray-800 dark:text-white`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={viewBox}
      >
        {children}
      </svg>
    </button>
  );
};

export default ActionIcon;
