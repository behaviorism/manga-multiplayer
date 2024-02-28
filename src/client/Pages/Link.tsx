import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Components/Input";
import Modal from "../Components/Modal";
import Form from "../Components/Form";
import { ROOM_ID_LENGTH } from "../../constants";

const Link = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleSubmit = () => {
    navigate(`/connect?room_id=${roomId}`);
  };

  const handleValidate = (roomId: string) => {
    if (roomId.length !== ROOM_ID_LENGTH) {
      throw new Error("Invalid room ID");
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
        title="Connect to room"
        isOpen={showModal}
        setIsOpen={setShowModal}
        onClose={() => setRoomId("")}
      >
        <Form submitLabel="Connect" onSubmit={handleSubmit}>
          <Input
            label="Room ID"
            setValue={setRoomId}
            value={roomId}
            validate={handleValidate}
            required
            autoFocus={true}
          />
        </Form>
      </Modal>
    </>
  );
};

export default Link;
