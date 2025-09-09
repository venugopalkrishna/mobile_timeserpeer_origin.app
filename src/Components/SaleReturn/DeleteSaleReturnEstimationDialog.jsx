import { Modal } from "antd";

const DeleteSaleReturnEstimationDialog = ({ estOpen, handleCancel, handleDelete }) => {
  return (
    <div>
      <Modal
        title="SaleReturnEstimation Delete"
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
            SaleReturnEstimation?
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteSaleReturnEstimationDialog;
