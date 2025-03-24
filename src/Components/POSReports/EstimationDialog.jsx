import {
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Flex,
  Spin
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import styles from "./Estimation.module.css";

const EstimationDialog = ({
  setOpenDialog,
  openDialog,
  estimationNoDataAPI,
  setSelectedObject,
  selectedObject,
  setSelectEstimationNo,
  estimationNoItemsAPI,
}) => {
  const [summaryData, setSummaryData] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const EstimationSummaryAPI = async () => {
    setLoading(true);
    try {
      let whereCondition = "";
      if (fromDate && toDate) {
        whereCondition = `ESTIMATIONDATE>='${dayjs(fromDate).format(
          "MM/DD/YYYY"
        )}' and ESTIMATIONDATE<='${dayjs(toDate).format("MM/DD/YYYY")}'`;
      }
      let params = {
        tableName: "ESTIMATION_MAST",
        where: whereCondition,
        order: "ESTIMATIONNO",
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder`,
        {
          params,
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.ESTIMATIONNO, item])).values()
      );

      setSummaryData(uniqueData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      EstimationSummaryAPI();
    }
  }, [fromDate, toDate]);

  const handleCheckboxChange = (record) => {
    setSelectedObject(
      selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO ? null : record
    );
    setSelectEstimationNo(
      selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO ? null : record
    );
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <Flex vertical gap="middle" align="flex-start">
        <Drawer
          title={
            selectedObject?.ESTIMATIONNO
              ? `Estimation No: ${selectedObject?.ESTIMATIONNO}`
              : " Estimation Items"
          }
          centered
          placement="bottom"
          onClose={() => setOpenDialog(false)}
          width={500}
          height={600}
          open={openDialog}
          closable={false}
        >
          {/* Estimation Card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: "1 0 200px",
              position: "sticky",
              zIndex: 10,
              top: 0,
            }}
          >
            <div>From:</div>
            <DatePicker
              style={{ width: "40%" }}
              value={fromDate}
              onChange={(date) => {
                setFromDate(date);
                setSelectedObject(null);
              }}
              format="DD-MMM-YYYY" // Format: 11-Mar-2025
            />
            <div>To:</div>
            <DatePicker
              style={{ width: "40%" }}
              value={toDate}
              onChange={(date) => {
                setToDate(date);
                setSelectedObject(null);
              }}
              format="DD-MMM-YYYY"
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: "1 0 200px",
              marginTop: "5px",
              position: "sticky",
              zIndex: 10,
              top: "40px",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "green",
                borderColor: "green",
                flex: "0 1 50px",
              }}
              onClick={() => {
                setOpenDialog(false);
                estimationNoDataAPI(selectedObject?.ESTIMATIONNO);
                estimationNoItemsAPI(selectedObject?.ESTIMATIONNO);
                setFromDate(dayjs());
                setToDate(dayjs());
              }}
              disabled={selectedObject === null}
            >
              Submit
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "orange",
                borderColor: "orange",
                flex: "0 1 50px",
              }}
              onClick={() => {
                setOpenDialog(false);
                setSelectedObject(null);
                setFromDate(dayjs());
                setToDate(dayjs());
              }}
            >
              Cancel
            </Button>
          </div>
          <div className={styles.cardContainer}>
            {summaryData?.map((item, index) => (
              <div key={index} className={styles.infoBox}
              onClick={() => handleCheckboxChange(item)}
              >
                {/* Tag No */}
                <div className={styles.rowTag}>
                  <p style={{ fontWeight: "bold", fontSize: "16px" }}>
                    <strong>Est No:</strong> {item.ESTIMATIONNO}
                  </p>
                  <Checkbox
                    checked={selectedObject?.ESTIMATIONNO === item.ESTIMATIONNO}
                    onChange={() => handleCheckboxChange(item)}
                    disabled={
                      selectedObject !== null &&
                      selectedObject?.ESTIMATIONNO !== item.ESTIMATIONNO
                    }
                  />
                </div>
                <hr className={styles.fullWidthLine} />

                {/* Item and Purity */}
                <div className={styles.row}>
                  <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                    <strong>Est Date:</strong>{" "}
                    {dayjs(item.ESTIMATIONDATE).format("DD-MMM-YYYY")}
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                    <strong>Party Name:</strong> {item.DESCRIPTION}
                  </p>
                </div>
                <hr className={styles.fullWidthLine} />

                {/* Gross Wt, Less Wt, Net Wt */}
                <div className={styles.row}>
                  {/* <p style={{ fontWeight: "bold", fontSize: "12px" }}>
                    <strong>Pieces:</strong> {item.TOTPCS}
                  </p> */}
                  <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                    Gross Wt:{" "}
                    <span>
                      <strong>{item.GWT}</strong>
                    </span>
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                    <strong>Less Wt:</strong> {item.STONEWT}
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                    <strong>Net Wt:</strong> {item.NWT}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Drawer>
      </Flex>
    </Spin>
  );
};
export default EstimationDialog;
