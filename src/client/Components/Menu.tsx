import ActionIcon from "./ActionIcon";

interface Props {
  onAdd?: () => void;
  onCopy?: () => void;
  onBack?: () => void;
  onClose?: () => void;
  transform?: string;
}

const Menu = ({ onAdd, onCopy, onBack, onClose }: Props) => {
  return (
    <div className="absolute top-5 right-3 flex justify-between">
      {onCopy && (
        <ActionIcon onClick={onCopy} width="3" height="3">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m7.708 2.292.706-.706A2 2 0 0 1 9.828 1h6.239A.97.97 0 0 1 17 2v12a.97.97 0 0 1-.933 1H15M6 5v4a1 1 0 0 1-1 1H1m11-4v12a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V9.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 5h5.239A.97.97 0 0 1 12 6Z"
          />
        </ActionIcon>
      )}
      {onAdd && (
        <ActionIcon onClick={onAdd} width="3" height="3">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </ActionIcon>
      )}
      {onBack && (
        <ActionIcon onClick={onBack} width="3" height="3" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </ActionIcon>
      )}
      {onClose && (
        <ActionIcon onClick={onClose} width="3" height="3" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </ActionIcon>
      )}
    </div>
  );
};

export default Menu;
