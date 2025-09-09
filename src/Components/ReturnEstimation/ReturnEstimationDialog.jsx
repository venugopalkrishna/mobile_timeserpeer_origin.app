import { Button, Checkbox, DatePicker, Drawer, Flex, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import styles from "./ReturnEstimation.module.css";
import { DeleteOutlined } from "@ant-design/icons";
import DeleteReturnEstimationDialog from "./DeleteReturnEstimationDialog";

const ReturnEstimationDialog = ({
  setOpenDialog,
  openDialog,
  estimationNoDataAPI,
  setSelectedObject,
  selectedObject,
  setSelectEstimationNo,
  estimationNoItemsAPI,
  estimationNoMastAPI,
  setStonesData,
  setTableData,
  setStoneMainData,
}) => {
  const [summaryData, setSummaryData] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [estNo, setEstNo] = useState();
  const [estOpen, setEstOpen] = useState(false);

  const tenantName = localStorage.getItem("tenantName");

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
        tableName: "RETURN_ESTIMATION_MAST",
        where: whereCondition,
        order: "ESTIMATIONNO",
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder`,
        {
          params,
          headers: {
            tenantName: tenantName,
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

  const estimationDeleteData = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=RETURN_ESTIMATION_DATA&where=ESTIMATIONNO=${estNo}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteMast = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=RETURN_ESTIMATION_MAST&where=ESTIMATIONNO=${estNo}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteItems = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=RETURN_ESTIMATION_ITEMS&where=ESTIMATIONNO=${estNo}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleCheckboxChange = (record) => {
    setSelectedObject(
      selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO ? null : record
    );
    setSelectEstimationNo(
      selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO ? null : record
    );
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await estimationDeleteData();
      await estimationDeleteMast();
      await estimationDeleteItems();
      setEstNo();
      setEstOpen(false);
    } catch (error) {
      console.error("Error during Sale:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEstOpen(false);
    setEstNo();
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <Flex vertical gap="middle" align="flex-start">
        <Drawer
          title={
            selectedObject?.ESTIMATIONNO
              ? `Estimation No: ${selectedObject?.ESTIMATIONNO}`
              : "Return Estimation Items"
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
              inputReadOnly
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
              inputReadOnly
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
            {/* <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "green",
                borderColor: "green",
                flex: "0 1 50px",
              }}
              onClick={() => {
                setOpenDialog(false);
                setStonesData([]);
                setTableData([]);
                estimationNoDataAPI(selectedObject?.ESTIMATIONNO);
                estimationNoItemsAPI(selectedObject?.ESTIMATIONNO);
                estimationNoMastAPI(selectedObject?.ESTIMATIONNO);
                setFromDate(dayjs());
                setToDate(dayjs());
              }}
              disabled={selectedObject === null}
            >
              Submit
            </Button> */}
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
              <>
                {item.BILLNO <= 0 ? (
                  <>
                    <div
                      key={index}
                      className={styles.infoBox}
                      // onClick={() => handleCheckboxChange(item)}
                    >
                      {/* Tag No */}
                      <div className={styles.rowTag}>
                        <Checkbox
                          checked={
                            selectedObject?.ESTIMATIONNO === item.ESTIMATIONNO
                          }
                          onChange={() => handleCheckboxChange(item)}
                          disabled={
                            selectedObject !== null &&
                            selectedObject?.ESTIMATIONNO !== item.ESTIMATIONNO
                          }
                        />
                        <p style={{ fontSize: "12px" }}>
                          Est No:{" "}
                          <span
                            style={{ fontWeight: "bold", fontSize: "16px" }}
                          >
                            {item.ESTIMATIONNO}
                          </span>
                        </p>
                        <DeleteOutlined
                          style={{
                            color: "red",
                            cursor: "pointer",
                            fontSize: "20px",
                          }}
                          onClick={() => {
                            setEstOpen(true);
                            setEstNo(item.ESTIMATIONNO);
                          }}
                        />
                      </div>
                      <hr className={styles.fullWidthLine} />

                      {/* Item and Purity */}
                      <div className={styles.row}>
                        <p style={{ fontSize: "11px" }}>
                          <span
                            style={{ fontWeight: "bold", fontSize: "12px" }}
                          >
                            {dayjs(item.ESTIMATIONDATE).format("DD-MMM-YYYY")}
                          </span>
                        </p>
                        <p style={{ fontWeight: "bold", fontSize: "11px" }}>
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "#52bd91",
                            }}
                          >
                            {item.DESCRIPTION}
                          </span>
                        </p>
                      </div>
                      <hr className={styles.fullWidthLine} />

                      {/* Gross Wt, Less Wt, Net Wt */}
                      <div className={styles.row}>
                        {/* <p style={{ fontWeight: "bold", fontSize: "12px" }}>
                    <strong>Pieces:</strong> {item.TOTPCS}
                  </p> */}
                        <p style={{ fontSize: "11px" }}>
                          Gross Wt:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "red",
                            }}
                          >
                            {item.GWT}
                          </span>
                        </p>
                        <p style={{ fontSize: "11px" }}>
                          Stone Wt:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "red",
                            }}
                          >
                            {item.STONEWT}
                          </span>
                        </p>
                        <p style={{ fontSize: "11px" }}>
                          Net Wt:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "12px",
                              color: "red",
                            }}
                          >
                            {item.NWT}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{
                        backgroundColor: "green",
                        borderColor: "green",
                      }}
                      onClick={() => {
                        setOpenDialog(false);
                        setStonesData([]);
                        setTableData([]);
                        estimationNoDataAPI(item.ESTIMATIONNO);
                        estimationNoItemsAPI(item.ESTIMATIONNO);
                        estimationNoMastAPI(item.ESTIMATIONNO);
                        setFromDate(dayjs());
                        setToDate(dayjs());
                      }}
                      disabled={
                        selectedObject?.ESTIMATIONNO !== item.ESTIMATIONNO
                      }
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  ""
                )}
              </>
            ))}
          </div>
          <DeleteReturnEstimationDialog
            estOpen={estOpen}
            handleCancel={handleCancel}
            handleDelete={handleDelete}
          />
        </Drawer>
      </Flex>
    </Spin>
  );
};
export default ReturnEstimationDialog;
