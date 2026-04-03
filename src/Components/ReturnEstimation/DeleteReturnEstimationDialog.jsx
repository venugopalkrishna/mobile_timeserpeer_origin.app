import { Modal } from "antd";

const DeleteReturnEstimationDialog = ({
  estOpen,
  handleCancel,
  handleDelete,
}) => {
  return (
    <div>
      <Modal
        // title="ReturnEstimation Delete"
        title={
          <strong
            style={{
              fontSize: "20px",
              color: "red",
              // fontFamily:
              //   "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",
            }}
          >
            {" "}
            ReturnEstimation Delete{" "}
          </strong>
        }
        open={estOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        closable={false}
        maskStyle={{
          backdropFilter: "blur(8px)", // <- this applies the blur effect
          backgroundColor: "rgba(0, 0, 0, 0.2)", // optional: tint the background a little
        }}
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
          <div style={{ fontSize: "20px" }}>
            Are you sure you want{" "}
            <span style={{ color: "red", fontSize: "20px" }}>DELETE</span> this
            ReturnEstimation?
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteReturnEstimationDialog;
