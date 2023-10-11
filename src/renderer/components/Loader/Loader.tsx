interface Props {
  label: string;
}

const Loader = ({ label }: Props) => {
  return (
    <>
      <span>{label}</span>
      <div className="spinner"></div>
    </>
  );
};

export default Loader;
