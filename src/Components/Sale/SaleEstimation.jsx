import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import axios from "axios";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./SaleEstimation.module.css";
import { Button, Checkbox, Col, DatePicker, Row, Spin, Typography } from "antd";
import SaleEstimationDialog from "./SaleEstimationDialog";
import { DeleteOutlined } from "@ant-design/icons";
import DeleteSaleEstimationDialog from "./DeleteSaleEstimationDialog";

const SaleEstimation = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectEstimationNo, setSelectEstimationNo] = useState(0);
  const [billNo, setBillNo] = useState(0);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [saleOpen, setSaleOpen] = useState(false);
  const [estNo, setEstNo] = useState();
  const [estOpen, setEstOpen] = useState(false);

  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const billCountAPI = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable?tableName=ESTIMATION_MAST&column=ESTIMATIONNO`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setBillNo(data[0].Column1);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

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

  const estimationDataBill = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/UpdateEstimationDataBillDetails?billNo=${
          billNo + 1
        }&estNo=${selectEstimationNo}&billDate=${dayjs().format("MM/DD/YYYY")}`,
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

  const estimationMastBill = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/UpdateEstimationMastBillDetails?billNo=${
          billNo + 1
        }&estNo=${selectEstimationNo}&billDate=${dayjs().format("MM/DD/YYYY")}`,
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

  const estimationItemsBill = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/UpdateEstimationItemsBillDetails?billNo=${
          billNo + 1
        }&estNo=${selectEstimationNo}&billDate=${dayjs().format("MM/DD/YYYY")}`,
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

  const tagTagGenerationRecycle = async (tagNo) => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/UpdateTagGenerationRecycle?tagNo=${tagNo}`,
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

  const tagTagItemsRecycle = async (tagNo) => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/UpdateTagItemsRecycle?tagNo=${tagNo}`,
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

  const estimationNoDataAPI = async (estNo) => {
    try {
      let whereCondition = "";
      if (estNo) {
        whereCondition = `ESTIMATIONNO=${estNo}`;
      }
      let params = {
        tableName: "ESTIMATION_DATA",
        where: whereCondition,
        order: "SNO",
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

      if (Array.isArray(data) && data.length > 0) {
        const updatedData = data.map((item, index) => ({
          ...item,
          ACTSWT: 0.2,
          BALGWT: 1500,
          BALNWT: 1500,
          BALPIECES: 0,
          BALSTONEWT: 0,
          FINALGOLD: item.FINEGOLD,
          GROSSWEIGHT: item.GWT,
          GWT: item.GWT,
          NETWT: item.NWT,
          NWT: item.NWT,
          PIECES: item.PIECES,
          PRODNAME: item.PRODNAME,
          STONEWT: item.STONEWT,
          TAGNO: item.TAGNO,
          TOUCH: item.TOUCH,
        }));

        for (const item of updatedData) {
          if (item.TAGNO) {
            await tagTagGenerationRecycle(item.TAGNO);
            await tagTagItemsRecycle(item.TAGNO);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const estimationDeleteData = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_DATA&where=ESTIMATIONNO=${estNo}`,
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
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_MAST&where=ESTIMATIONNO=${estNo}`,
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
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_ITEMS&where=ESTIMATIONNO=${estNo}`,
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

  const handleSale = async () => {
    setLoading(true);
    try {
      await handleCancel();
      await estimationNoDataAPI(selectEstimationNo);
      await estimationDataBill();
      await estimationItemsBill();
      await estimationMastBill();

      setFromDate(dayjs());
      setToDate(dayjs());
      setSelectEstimationNo(0);
      setSelectedObject(null);
    } catch (error) {
      console.error("Error during Sale:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      EstimationSummaryAPI();
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    billCountAPI();
  }, []);

  const handleCheckboxChange = (record) => {
    setSelectedObject(
      selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO ? null : record
    );
    setSelectEstimationNo(record.ESTIMATIONNO);
  };

  const toggleDrawer = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setSaleOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await estimationDeleteData();
      await estimationDeleteItems();
      await estimationDeleteMast();
      setEstNo();
      setEstOpen(false);
    } catch (error) {
      console.error("Error during Sale:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstCancel = () => {
    setEstOpen(false);
    setEstNo();
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <div>
        <Header setOpen={setOpen} />
        <SidebarDrawer
          open={open}
          toggleDrawer={toggleDrawer}
          singleImage={singleImage}
          userArea={userArea}
          userName={userName}
        />
        <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
          <Row
            justify="space-between"
            align="middle"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className={styles.headerContainer}>
              <h3 className={styles.heading}>Sale</h3>
            </div>
          </Row>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flex: "0 1 200px",
              borderRadius: "8px",
              padding: "5px",
              // background: "#52bd91",
            }}
          >
            <div>From:</div>
            <DatePicker
              style={{ flex: 1, minWidth: "80px" }}
              inputReadOnly
              value={fromDate}
              onChange={(date) => {
                setFromDate(date);
                setSelectedObject(null);
              }}
              format="DD-MMM-YYYY"
            />
            <div>To:</div>
            <DatePicker
              style={{ flex: 1, minWidth: "80px" }}
              inputReadOnly
              value={toDate}
              onChange={(date) => {
                setToDate(date);
                setSelectedObject(null);
              }}
              format="DD-MMM-YYYY"
            />
          </div>
          <div className={styles.cardContainer}>
            {summaryData?.map((item, index) => (
              <>
                <div
                  className={
                    item.BILLNO <= 0 ? styles.infoBox : styles.infoBox1
                  }
                  // onClick={() => {
                  //   if (item.BILLNO <= 0) {
                  //     handleCheckboxChange(item);
                  //   }
                  // }}
                >
                  {/* Tag No */}
                  <div
                    className={
                      item.BILLNO <= 0 ? styles.rowTag : styles.rowTag1
                    }
                  >
                    {item.BILLNO <= 0 ? (
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
                    ) : (
                      ""
                    )}
                    <p style={{ fontSize: "12px" }}>
                      Est No:{" "}
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {item.ESTIMATIONNO}
                      </span>
                    </p>
                    {item.BILLNO <= 0 ? (
                      ""
                    ) : (
                      <p
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        Sold
                      </p>
                    )}
                    {item.BILLNO <= 0 ? (
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
                    ) : (
                      ""
                    )}
                  </div>
                  <hr className={styles.fullWidthLine} />

                  {/* Item and Purity */}
                  <div className={styles.row}>
                    <p style={{ fontSize: "11px" }}>
                      <span style={{ fontWeight: "bold", fontSize: "12px" }}>
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
                {item.BILLNO <= 0 ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "green",
                      borderColor: "green",
                    }}
                    onClick={() => {
                      // handleSale(item.ESTIMATIONNO)
                      setSaleOpen(true);
                    }}
                    disabled={
                      selectedObject?.ESTIMATIONNO !== item.ESTIMATIONNO
                    }
                  >
                    Sale
                  </Button>
                ) : (
                  ""
                )}
              </>
            ))}
          </div>
        </div>
        <SaleEstimationDialog
          saleOpen={saleOpen}
          handleCancel={handleCancel}
          handleSale={handleSale}
        />
        <DeleteSaleEstimationDialog
          estOpen={estOpen}
          handleCancel={handleEstCancel}
          handleDelete={handleDelete}
        />
      </div>
    </Spin>
  );
};

export default SaleEstimation;
