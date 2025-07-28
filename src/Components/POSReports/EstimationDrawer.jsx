import { Button, Card, Drawer, Input, Table } from "antd";

const EstimationDrawer = ({
  drawerOpen,
  setDrawerOpen,
  stonesData,
  totalPieces,
  totalGrossWeight,
  totalStoneWeight,
  totalNetWeight,
  totalFineGold,
  totalStoneCost,
  totalCash,
  selectEstimationNo,
  makingValue,
  setMakingValue,
  perGramValue,
  setPerGramValue,
  rodiumChargeValue,
  setRodiumChargeValue,
  handlePrint,
  tableData,
  createEstimationMast,
  createEstimationData,
  createEstimationItems,
  estimationDeleteData,
  estimationDeleteItems,
  estimationDeleteMast,
  handleReset,
  setSelectEstimationNo,
}) => {
  const onClose = () => {
    setDrawerOpen(false);
  };
  console.log(totalStoneCost, "totalStoneCost");

  return (
    <Drawer
      title="Total Details"
      placement="bottom"
      width={500}
      height={500}
      onClose={onClose}
      open={drawerOpen}
      closable={false}
      footerStyle={{ display: "none" }}
      //   extra={
      //     <Space>
      //       <Button onClick={onClose}>Cancel</Button>
      //       <Button type="primary" onClick={onClose}>
      //         OK
      //       </Button>
      //     </Space>
      //   }
    >
      {/* <Table
        columns={StoneColumns}
        dataSource={stonesData}
        pagination={false}
        size="small"
      /> */}
      <Card
        style={{
          background: "#d4edda",
          borderRadius: "8px",
          //   padding: "5px",
          fontWeight: "bold",
          width: "100%",
          margin: "10px 0px",
        }}
      >
        {[
          { label: "Total Pieces", value: totalPieces },
          { label: "Gross Weight", value: totalGrossWeight?.toFixed(3) },
          { label: "Stone Weight", value: totalStoneWeight?.toFixed(3) },
          { label: "NET Weight", value: totalNetWeight?.toFixed(3) },
          { label: "Fine Gold", value: totalFineGold?.toFixed(3) },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <label style={{ width: "50%", textAlign: "left" }}>
              {item.label}
            </label>
            <span style={{ flex: 0.1 }}>:</span>
            <div style={{ textAlign: "right", flex: 1, fontSize:"18px" }}>{item.value}</div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <label style={{ width: "18%", textAlign: "left" }}>Making</label>
          <Input
            style={{ width: "30%", fontSize:"15px" }}
            value={makingValue}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 8) {
                setMakingValue(value);
                setPerGramValue(value ? value * totalNetWeight : 0);
              }
            }}
          />
          <span style={{ color: "red", marginLeft: 5 }}>/G</span>
          <span style={{ flex: 0.1 }}>:</span>
          <Input
            style={{ width: "40%", textAlign: "right", flex: 1, fontSize:"15px" }}
            placeholder="Per Gm."
            value={perGramValue}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 8) {
                setPerGramValue(e.target.value);
              }
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <label style={{ width: "50%", textAlign: "left" }}>
            Rodium Charges
          </label>
          <span style={{ flex: 0.1 }}>:</span>
          <Input
            style={{ width: "50%", textAlign: "right", flex: 1, fontSize:"15px" }}
            placeholder="Rodium Charges"
            value={rodiumChargeValue}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 8) {
                setRodiumChargeValue(e.target.value);
              }
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <label style={{ width: "50%", textAlign: "left" }}>Stone Cost</label>
          <span style={{ flex: 0.1 }}>:</span>
          <div style={{ textAlign: "right", flex: 1, fontSize:"15px" }}>
            {selectEstimationNo
              ? selectEstimationNo?.STCHARGES
              : totalStoneCost?.toFixed(2)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            style={{
              width: "50%",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Total Cash
          </label>
          <span style={{ flex: 0.1 }}>:</span>
          <div
            style={{
              textAlign: "right",
              background: "#2196f3",
              color: "white",
              fontWeight: "bold",
              flex: 1,
              fontSize:"15px"
            }}
          >
            {selectEstimationNo
              ? selectEstimationNo?.TOTCASH
              : totalCash.toFixed(2)}
          </div>
        </div>
      </Card>
      <div
        // span={2}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Button
          type="default"
          style={{
            backgroundColor: "blue",
            borderColor: "blue",
            width: "8rem"
          }}
            disabled={tableData.length === 0 && stonesData.length === 0}
            onClick={() => {
              if (selectEstimationNo?.ESTIMATIONNO) {
                createEstimationMast();
                createEstimationData();
                createEstimationItems();
                setSelectEstimationNo(null);
                estimationDeleteData();
                estimationDeleteItems();
                estimationDeleteMast();
                handleReset();
                onClose();
              } else {
                createEstimationMast();
                createEstimationData();
                createEstimationItems();
                setSelectEstimationNo(null);
                handleReset();
                onClose();
              }
            }}
        >
          Save
        </Button>
        <Button
          type="dashed"
          style={{
            backgroundColor: "Green",
            borderColor: "green",
            width: "8rem"
          }}
            onClick={handlePrint}
            disabled={tableData.length === 0}
        >
          Print
        </Button>
        <Button
          type="default"
          style={{
            backgroundColor: "red",
            borderColor: "red",
            width: "8rem"
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Drawer>
  );
};

export default EstimationDrawer;
