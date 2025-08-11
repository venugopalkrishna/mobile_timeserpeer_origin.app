import { Modal } from "antd";

const ImageDialog = ({ handleImageCancel, imageOpen, imageData }) => {
  return (
    <Modal
      closable={{ "aria-label": "Custom Close Button" }}
      open={imageOpen}
      onCancel={handleImageCancel}
      footer={null}
    >
      <img
        src={imageData}
        alt="img"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "20%",
        }}
      />
    </Modal>
  );
};

export default ImageDialog;
