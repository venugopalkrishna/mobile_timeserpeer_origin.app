import { Modal } from "antd";

const SaleEstimationDialog = ({
    saleOpen, handleCancel, handleSale
}) => {
  return (
    <div>
      <Modal
        title="Sale Estimation"
        open={saleOpen}
        onOk={handleSale}
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
          <div style={{fontSize: "18px", color: "red"}}>Are you sure to Sale?</div>
        </div>
      </Modal>
    </div>
  );
};

export default SaleEstimationDialog;
