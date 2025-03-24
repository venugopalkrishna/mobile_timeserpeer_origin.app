import { Button, Drawer, Input, Space } from "antd";
import styles from "./Estimation.module.css";

const EstimationStonesDrawer = ({
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
              <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                <strong>Item Name:</strong> {item.MAINTYPE}
              </p>
            </div>
            <hr className={styles.fullWidthLine} />

            {/* Item and Purity */}
            <div className={styles.row}>
              <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                <strong>Pieces:</strong> {item.PCS}
              </p>
              <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                <strong>Grams:</strong> {item?.ACTGRAMS?.toFixed(3)}
              </p>
            </div>
            <hr className={styles.fullWidthLine} />

            {/* Gross Wt, Less Wt, Net Wt */}
            <div className={styles.row}>
              <p style={{ fontWeight: "bold", fontSize: "11px" }}>Rate</p>
              <Input
                style={{ width: "50%" }}
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
              <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                <strong>Amount:</strong>
                {(
                  (parseFloat(stoneRate[index]) || 0) * (item?.ACTGRAMS || 0)
                ).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default EstimationStonesDrawer;
