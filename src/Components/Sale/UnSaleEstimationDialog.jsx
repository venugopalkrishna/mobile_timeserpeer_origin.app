import { Modal } from "antd";

const UnSaleEstimationDialog = ({ saleOpen, handleCancel, handleSale }) => {
  return (
    <div>
      <Modal
        title="Un-Sale Estimation"
        open={saleOpen}
        // onOk={handleSale}
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
          <div style={{ fontSize: "18px", color: "red" }}>
            Are you sure to Un-Sale?
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UnSaleEstimationDialog;
