import { Button, Drawer, Input, Space } from "antd";
import styles from "./ReturnEstimation.module.css";

const ReturnEstimationStonesDrawer = ({
  stonesDrawerOpen,
  setStonesDrawerOpen,
  stonesData,
  setStoneRate,
  stoneRate,
}) => {
  const onClose = () => {
    setStonesDrawerOpen(false);
  };
  return (
    <Drawer
      title="Stones Details"
      placement="bottom"
      width={500}
      height={500}
      onClose={onClose}
      open={stonesDrawerOpen}
      closable={false}
      footerStyle={{ display: "none" }}
      extra={
        <Space>
          <Button onClick={onClose} style={{ color: "white", backgroundColor: "red" }}>
            Cancel
          </Button>
        </Space>
      }
    >
      <div className={styles.cardContainer}>
        {stonesData?.map((item, index) => (
          <div key={index} className={styles.infoBox}>
            {/* Tag No */}
            <div className={styles.rowTag}>
              <p style={{ fontSize: "14px" }}>
                Item Name : <span style={{ fontWeight: "bold", fontSize: "16px" }}>{item.MAINTYPE}</span>
              </p>
            </div>
            <hr className={styles.fullWidthLine} />

            {/* Item and Purity */}
            <div className={styles.row}>
              <p style={{ fontSize: "11px" }}>
                Pieces : <span style={{ fontWeight: "bold", fontSize: "12px", color: "red" }}>{item.PCS}</span>
              </p>
              <p style={{ fontSize: "11px" }}>
                Grams : <span style={{ fontWeight: "bold", fontSize: "12px", color: "red" }}>{item?.ACTGRAMS?.toFixed(3)}</span>
              </p>
            </div>
            <hr className={styles.fullWidthLine} />

            {/* Gross Wt, Less Wt, Net Wt */}
            <div className={styles.row}>
              <p style={{ fontWeight: "bold", fontSize: "11px" }}>Rate</p>
              <Input
                style={{ width: "50%", fontSize: "14px", fontWeight:"bold" }}
                placeholder="Enter Rate"
                value={stoneRate[index] || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setStoneRate((prevRates) => ({
                      ...prevRates,
                      [index]: value,
                    }));
                  }
                }}
              />
            </div>
            <hr className={styles.fullWidthLine} />
            <div className={styles.row}>
              <p style={{ fontSize: "11px" }}>
                Amount : {" "}
                <span style={{ fontWeight: "bold", fontSize: "14px", color: "#52bd91" }}>{(
                  (parseFloat(stoneRate[index]) || 0) * (item?.ACTGRAMS || 0)
                ).toFixed(2)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default ReturnEstimationStonesDrawer;
