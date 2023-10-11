import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ValidatedInput from "../../Components/ValidatedInput/ValidatedInput";
import Modal from "../../Components/Modal/Modal";

const Link = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInput(address)) {
      return navigate(`/connect?host=${address}`);
    }
  };

  const validateInput = (input: string) => {
    const [ip, port] = input.split(":");

    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) {
      return "Invalid IP address";
    }

    if (!port) {
      return "Port is missing";
    }

    if (isNaN(parseInt(port))) {
      return "Invalid port";
    }
  };

  return (
    <>
      <div>
        <button onClick={() => navigate("/host")}>Host</button>
        <button onClick={() => setShowModal(true)}>Connect</button>
      </div>
      <Modal isOpen={showModal} setIsOpen={setShowModal}>
        <form onSubmit={handleSubmit}>
          <div>
            To connect to a host, you need to provide their IP address and port
          </div>
          <ValidatedInput
            value={address}
            setValue={setAddress}
            validate={validateInput}
            placeholder="192.168.1.1"
          />
          <button type="submit">Connect</button>
        </form>
      </Modal>
    </>
  );
};

export default Link;
