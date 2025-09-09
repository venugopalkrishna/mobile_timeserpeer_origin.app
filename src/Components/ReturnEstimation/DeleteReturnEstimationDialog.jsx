import { Modal } from "antd";

const DeleteReturnEstimationDialog = ({ estOpen, handleCancel, handleDelete }) => {
  return (
    <div>
      <Modal
        title="ReturnEstimation Delete"
        open={estOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        closable={false}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: "1 1 200px",
            marginBottom: "8px",
          }}
        >
          <div style={{ fontSize: "16px" }}>
            Are you sure <span style={{ color: "red" }}>DELETE</span>{" "}
            ReturnEstimation?
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteReturnEstimationDialog;
