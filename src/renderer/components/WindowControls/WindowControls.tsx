import { IpcMessage, WindowControl } from "../../../types";
import "./WindowControls.css";

const WindowControls = () => {
  const sendControl = (control: WindowControl) =>
    window.ipc.send(IpcMessage.WindowControl, control);

  return (
    <div className="window-controls flex justify-between w-[53px] my-[12px] mx-[10px]">
      <div
        onClick={() => sendControl(WindowControl.Close)}
        className="window-control bg-[#fc615d]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path
            stroke="#4c0000"
            fill="none"
            d="M8.5,3.5 L6,6 L3.5,3.5 L6,6 L3.5,8.5 L6,6 L8.5,8.5 L6,6 L8.5,3.5 Z"
          />
        </svg>
      </div>
      <div
        onClick={() => sendControl(WindowControl.Minimize)}
        className="window-control bg-[#fdbc40]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <rect
            fill="#975500"
            width="8"
            height="2"
            x="2"
            y="5"
            fillRule="evenodd"
          />
        </svg>
      </div>
      <div
        onClick={() => sendControl(WindowControl.Maximize)}
        className="window-control bg-[#34c749]"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <g fill="#006500" fillRule="evenodd">
            <path
              d="M5,3 C5,3 5,6.1325704 5,6.48601043 C5,6.83945045 5.18485201,7 5.49021559,7 L9,7 L9,6 L8,6 L8,5 L7,5 L7,4 L6,4 L6,3 L5,3 Z"
              transform="rotate(180 7 5)"
            />
            <path d="M3,5 C3,5 3,8.1325704 3,8.48601043 C3,8.83945045 3.18485201,9 3.49021559,9 L7,9 L7,8 L6,8 L6,7 L5,7 L5,6 L4,6 L4,5 L3,5 Z" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default WindowControls;
