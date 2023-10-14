import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ValidatedInput from "../../Components/ValidatedInput/ValidatedInput";
import Modal from "../../Components/Modal/Modal";

const Link = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    try {
      handleValidate(url);
      navigate(`/connect?host=${url}`);
      event.preventDefault();
    } catch (_error: any) {}
  };

  const handleValidate = (url: string) => {
    try {
      new URL(url);
    } catch (_error: any) {
      throw new Error("Invalid URL");
    }
  };

  return (
    <>
      <button
        className="btn btn-primary w-52 mb-2 my-auto"
        onClick={() => navigate("/host")}
      >
        Host
      </button>
      <button
        className="btn btn-primary w-52 mt-2 my-auto"
        onClick={() => setShowModal(true)}
      >
        Connect
      </button>
      <Modal
        title="Connect to host"
        isOpen={showModal}
        setIsOpen={setShowModal}
        onClose={() => setUrl("")}
      >
        <form className="space-y-6 block m-0" onSubmit={handleSubmit}>
          <ValidatedInput
            label="Connect URL"
            setValue={setUrl}
            value={url}
            validate={handleValidate}
            placeholder="ws://twelve-moons-swim.loca.lt"
            required
          />
          <button type="submit" className="w-full btn btn-primary">
            Connect
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Link;
