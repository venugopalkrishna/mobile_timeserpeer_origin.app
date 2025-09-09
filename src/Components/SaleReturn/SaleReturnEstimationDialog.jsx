import { Modal } from "antd";

const SaleReturnEstimationDialog = ({
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
          <div style={{fontSize: "18px", color: "red"}}>Are you sure to SaleReturn?</div>
        </div>
      </Modal>
    </div>
  );
};

export default SaleReturnEstimationDialog;
