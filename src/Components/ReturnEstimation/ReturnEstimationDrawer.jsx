import { Button, Card, Checkbox, Drawer, Dropdown, Input, Table } from "antd";
import { useLocation } from "react-router-dom";

const ReturnEstimationDrawer = ({
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
  handleDownloadPDF,
  tableData,
  createEstimationMast,
  createEstimationData,
  createEstimationItems,
  estimationDeleteData,
  estimationDeleteItems,
  estimationDeleteMast,
  handleReset,
  setSelectEstimationNo,
  setStoneMakingValue,
  stoneMakingValue,
  setStonePerGramValue,
  stonePerGramValue,
  rateCut,
  setRateCut,
  fineGoldValue,
  setFineGoldValue,
  rateValue,
  setRateValue,
  amountValue,
  setAmountValue,
  metalBalanceValue,
  cashBalanceValue,
  printMenu,
  pdfMenu,
  admin,
  estimationCountAPI,
}) => {
  const onClose = () => {
    setDrawerOpen(false);
  };
  const pathName = useLocation();
  const path = pathName?.pathname;

  return (
    <Drawer
      title="Total Details"
      placement="bottom"
      width="100%"
      height={550}
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
      <div
        style={{
          background: "#d4edda",
          borderRadius: "8px",
          // padding: "5px",
          fontWeight: "bold",
          width: "100%",
          margin: "10px 0px",
        }}
        // style={{
        //   background: "#d4edda",
        //   borderRadius: "8px",
        //   fontWeight: "bold",
        //   padding: "10px",
        //   margin: "10px 0px",
        //   width: "100%",
        // }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            padding: "0px 10px",
          }}
        >
          <label style={{ width: "50%", textAlign: "left", marginTop: 7 }}>
            Total Pieces
          </label>
          <span style={{ flex: 0.1 }}>:</span>
          <div
            style={{
              textAlign: "right",
              flex: 1,
              fontSize: "18px",
              marginTop: 7,
            }}
          >
            {totalPieces}
          </div>
        </div>
        {[
          // { label: "Total Pieces", value: totalPieces },
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
              padding: "0px 10px",
            }}
          >
            <label style={{ width: "50%", textAlign: "left" }}>
              {item.label}
            </label>
            <span style={{ flex: 0.1 }}>:</span>
            <div style={{ textAlign: "right", flex: 1, fontSize: "16px" }}>
              {item.value}
            </div>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #0a1a53", // ✅ Border here
            borderRadius: "8px",
            padding: "8px",
            color: "white",
            background: "#0a1a53",
            marginBottom: "5px",
          }}
        >
          {" "}
          <Checkbox
            checked={rateCut}
            onChange={(e) => setRateCut(e.target.checked)}
            disabled={
              Number(totalFineGold) === 0 || selectEstimationNo?.BILLNO > 0
            }
          />
          <span style={{ marginLeft: 8, fontSize: "14px" }}>Rate Cut</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            padding: "0px 10px",
          }}
        >
          {/* <Checkbox
            checked={rateCut}
            onChange={(e) => setRateCut(e.target.checked)}
            disabled={Number(totalFineGold) === 0}
          /> */}
          <label
            style={{
              width: "25%",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Fine Gold
          </label>
          <Input
            style={{ width: "30%", fontSize: "15px" }}
            disabled={rateCut === false}
            placeholder="Select Fine Gold"
            value={fineGoldValue}
            onChange={(e) => {
              let value = e.target.value;
              value = value.replace(/[^0-9.]/g, "");

              const parts = value.split(".");
              if (parts.length > 2) {
                value = parts[0] + "." + parts[1];
              }
              if (parts[0].length > 8) {
                parts[0] = parts[0].slice(0, 8);
              }
              if (parts[1]?.length > 3) {
                parts[1] = parts[1].slice(0, 3);
              }

              value = parts.join(".");
              setFineGoldValue(value);
            }}
            onBlur={() => {
              if (fineGoldValue) {
                setFineGoldValue(parseFloat(fineGoldValue).toFixed(3));
              }
            }}
          />
          <span style={{ color: "red", marginLeft: 5 }}>Rate</span>
          <span style={{ flex: 0.1 }}>:</span>
          <Input
            style={{
              width: "40%",
              textAlign: "right",
              flex: 1,
              fontSize: "15px",
            }}
            value={rateValue}
            placeholder="Rate"
            disabled={rateCut === false}
            onChange={(e) => {
              let value = e.target.value;

              value = value.replace(/[^0-9.]/g, "");

              const parts = value.split(".");
              if (parts.length > 2) {
                value = parts[0] + "." + parts[1];
              }
              if (parts[0].length > 8) {
                parts[0] = parts[0].slice(0, 8);
              }
              if (parts[1]?.length > 2) {
                parts[1] = parts[1].slice(0, 2);
              }

              value = parts.join(".");

              setRateValue(value);
              setAmountValue(
                value && fineGoldValue
                  ? (parseFloat(value) * fineGoldValue).toFixed(2)
                  : 0,
              );
            }}
            onBlur={() => {
              if (rateValue) {
                setRateValue(parseFloat(rateValue).toFixed(2));
              }
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            padding: "0px 10px",
          }}
        >
          <label style={{ width: "50%", textAlign: "left" }}>Amount</label>
          <span style={{ flex: 0.1 }}>:</span>
          <Input
            style={{
              width: "50%",
              textAlign: "right",
              flex: 1,
              fontSize: "15px",
            }}
            placeholder="Amount"
            disabled={rateCut === false}
            value={amountValue}
            onChange={(e) => {
              let value = e.target.value;
              value = value.replace(/[^0-9.]/g, "");

              const parts = value.split(".");
              if (parts.length > 2) {
                value = parts[0] + "." + parts[1];
              }
              if (parts[0].length > 8) {
                parts[0] = parts[0].slice(0, 8);
              }
              if (parts[1]?.length > 2) {
                parts[1] = parts[1].slice(0, 2);
              }

              value = parts.join(".");
              setAmountValue(value);
            }}
            onBlur={() => {
              if (amountValue) {
                setAmountValue(parseFloat(amountValue).toFixed(2));
              }
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            padding: "0px 10px",
          }}
        >
          <label style={{ width: "18%", textAlign: "left" }}>Making</label>
          <Input
            style={{
              width: "30%",
              fontSize: "15px",
              backgroundColor: "AppWorkspace",
              color: "black",
            }}
            disabled={selectEstimationNo?.BILLNO > 0}
            value={makingValue}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 8) {
                setMakingValue(value);
                setPerGramValue(
                  value ? (value * totalNetWeight)?.toFixed(2) : 0,
                );
              }
            }}
          />
          <span style={{ color: "red", marginLeft: 5 }}>/G</span>
          <span style={{ flex: 0.1 }}>:</span>
          <Input
            style={{
              width: "40%",
              textAlign: "right",
              flex: 1,
              fontSize: "15px",
              backgroundColor: "AppWorkspace",
              color: "black",
            }}
            disabled={selectEstimationNo?.BILLNO > 0}
            placeholder="Per Gm."
            value={perGramValue}
            onChange={(e) => {
              let value = e.target.value;

              value = value.replace(/[^0-9.]/g, "");

              const parts = value.split(".");
              if (parts.length > 2) {
                value = parts[0] + "." + parts[1];
              }
              if (parts[0].length > 8) {
                parts[0] = parts[0].slice(0, 8);
              }
              if (parts[1]?.length > 2) {
                parts[1] = parts[1].slice(0, 2);
              }

              value = parts.join(".");

              setPerGramValue(value);
            }}
            onBlur={() => {
              if (rateValue) {
                setPerGramValue(parseFloat(rateValue).toFixed(2));
              }
            }}
          />
        </div>
        {path === "/return-estimations-model1" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 5,
              padding: "0px 10px",
            }}
          >
            <label style={{ width: "50%", textAlign: "left" }}>
              Other Charges
            </label>
            <span style={{ flex: 0.1 }}>:</span>
            <Input
              style={{
                width: "50%",
                textAlign: "right",
                flex: 1,
                fontSize: "15px",
                backgroundColor: "AppWorkspace",
                color: "black",
              }}
              disabled={selectEstimationNo?.BILLNO > 0}
              placeholder="Other Charges"
              value={rodiumChargeValue}
              onChange={(e) => {
                let value = e.target.value;

                value = value.replace(/[^0-9.]/g, "");

                const parts = value.split(".");
                if (parts.length > 2) {
                  value = parts[0] + "." + parts[1];
                }
                if (parts[0].length > 8) {
                  parts[0] = parts[0].slice(0, 8);
                }
                if (parts[1]?.length > 2) {
                  parts[1] = parts[1].slice(0, 2);
                }

                value = parts.join(".");

                setRodiumChargeValue(value);
              }}
              onBlur={() => {
                if (rateValue) {
                  setRodiumChargeValue(parseFloat(rateValue).toFixed(2));
                }
              }}
            />
          </div>
        ) : (
          ""
        )}
        <>
          {path === "/return-estimations-model2" || Number(admin) === 2 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
                padding: "0px 10px",
              }}
            >
              <label style={{ width: "18%", textAlign: "left" }}>Stone</label>
              <Input
                style={{
                  width: "30%",
                  fontSize: "15px",
                  backgroundColor: "AppWorkspace",
                  color: "black",
                }}
                disabled={selectEstimationNo?.BILLNO > 0}
                value={stoneMakingValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setStoneMakingValue(value);
                    setStonePerGramValue(
                      value ? (value * totalStoneWeight)?.toFixed(2) : 0,
                    );
                  }
                }}
              />
              <span style={{ color: "red", marginLeft: 5 }}>/G</span>
              <span style={{ flex: 0.1 }}>:</span>
              <Input
                style={{
                  width: "40%",
                  textAlign: "right",
                  flex: 1,
                  fontSize: "15px",
                  backgroundColor: "AppWorkspace",
                  color: "black",
                }}
                disabled={selectEstimationNo?.BILLNO > 0}
                placeholder="Per Gm."
                value={stonePerGramValue}
                onChange={(e) => {
                  let value = e.target.value;

                  value = value.replace(/[^0-9.]/g, "");

                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts[1];
                  }
                  if (parts[0].length > 8) {
                    parts[0] = parts[0].slice(0, 8);
                  }
                  if (parts[1]?.length > 2) {
                    parts[1] = parts[1].slice(0, 2);
                  }

                  value = parts.join(".");

                  setStonePerGramValue(value);
                }}
                onBlur={() => {
                  if (rateValue) {
                    setStonePerGramValue(parseFloat(rateValue).toFixed(2));
                  }
                }}
              />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 5,
                padding: "0px 10px",
              }}
            >
              <label style={{ width: "50%", textAlign: "left" }}>
                Stone Cost
              </label>
              <span style={{ flex: 0.1 }}>:</span>
              <div style={{ textAlign: "right", flex: 1, fontSize: "15px" }}>
                {totalStoneCost?.toFixed(2)}
              </div>
            </div>
          )}
        </>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            padding: "0px 10px",
          }}
        >
          <label
            style={{
              width: "50%",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Metal Balance
          </label>
          <span style={{ flex: 0.1 }}>:</span>
          <div
            style={{
              textAlign: "right",
              // background: "#2196f3",
              // borderRadius: "8px",
              // padding: "2px",
              // color: "white",
              fontWeight: "bold",
              flex: 1,
              fontSize: "18px",
            }}
          >
            {metalBalanceValue ? Number(metalBalanceValue)?.toFixed(3) : 0}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 5,
            padding: "0px 10px",
          }}
        >
          <label
            style={{
              width: "50%",
              textAlign: "left",
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            Cash Balance
          </label>
          <span style={{ flex: 0.1 }}>:</span>
          <div
            style={{
              textAlign: "right",
              background: "#2196f3",
              borderRadius: "8px",
              padding: "2px",
              color: "white",
              fontWeight: "bold",
              flex: 1,
              marginBottom: 5,
              fontSize: "18px",
            }}
          >
            {cashBalanceValue ? Number(cashBalanceValue)?.toFixed(2) : 0}
          </div>
        </div>
      </div>
      <div
        // span={2}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Button
          type="primary"
          style={{
            background: "#52bd91",
            borderColor: "#52bd91",
            width: "8rem",
          }}
          disabled={
            (tableData.length === 0 && stonesData.length === 0) ||
            selectEstimationNo?.BILLNO > 0
          }
          onClick={async () => {
            const isModel2 = path === "/return-estimations-model2";
            if (tableData.length > 0) {
              if (selectEstimationNo?.ESTIMATIONNO) {
                await estimationDeleteItems();
                await estimationDeleteData();
                await estimationDeleteMast();
                await createEstimationData();
                await createEstimationItems();
                await createEstimationMast();
                await setSelectEstimationNo(null);
                // handleReset();
                onClose();
              } else {
                const nextEstNo = await estimationCountAPI();
                await createEstimationData(nextEstNo);
                await createEstimationItems(nextEstNo);
                await createEstimationMast(nextEstNo);
                setSelectEstimationNo(null);
                // handleReset();
                onClose();
              }
            }
            // if (selectEstimationNo?.ESTIMATIONNO) {
            //   createEstimationMast();
            //   createEstimationData();
            //   setSelectEstimationNo(null);
            //   estimationDeleteData();
            //   estimationDeleteMast();
            //   estimationDeleteItems();
            //   handleReset();
            //   onClose();
            // } else {
            //   if (!isModel2) {
            //     createEstimationItems();
            //   }
            //   createEstimationMast();
            //   createEstimationData();
            //   setSelectEstimationNo(null);
            //   handleReset();
            //   onClose();
            // }
          }}
        >
          Save
        </Button>
        {/* <Dropdown menu={printMenu} placement="topCenter">
          <Button
            type="dashed"
            style={{
              background: "#FFDE63",
              borderColor: "#FFDE63",
              width: "8rem",
            }}
            // onClick={handlePrint}
            disabled={tableData.length === 0}
          >
            Print
          </Button>
        </Dropdown> */}
        <Dropdown menu={pdfMenu} placement="topCenter">
          <Button
            type="dashed"
            // onClick={handleDownloadPDF}
            disabled={tableData.length === 0}
            style={{
              background: "#FF7A30",
              borderColor: "#FF7A30",
              width: "8rem",
            }}
          >
            PDF
          </Button>
        </Dropdown>
        <Button
          type="default"
          style={{
            backgroundColor: "red",
            borderColor: "red",
            width: "8rem",
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Drawer>
  );
};

export default ReturnEstimationDrawer;
