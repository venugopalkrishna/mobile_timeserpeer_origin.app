import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import axios from "axios";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./SaleReturnEstimation.module.css";
import { Button, Checkbox, Col, DatePicker, Row, Spin, Typography, message } from "antd";
import SaleReturnEstimationDialog from "./SaleReturnEstimationDialog";
import DeleteSaleReturnEstimationDialog from "./DeleteSaleReturnEstimationDialog";
import { DeleteOutlined } from "@ant-design/icons";

const SaleReturnEstimation = () => {
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
  const [saveSale, setSaveSave] = useState({});
  const [vNo, setVNo] = useState(0);
  const [billNumber, setBillNumber] = useState(0);

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

  const vNoAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable?tableName=TRANS_ENTRY_DATA&column=ENTRYNO`,
        { headers: { tenantName } }
      );

      const data = response.data;
      const rawValue = data?.[0]?.Column1;
      const newInvNo = (Number(rawValue) || 0) + 1;
      setVNo(newInvNo);
      return newInvNo;
    } catch (error) {
      console.error(error);
    }
  };

  const billNoAPI = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTableWithOrder?tableName=TRANS_ENTRY_DATA&column=VNO&where=TRANS_TYPE='BILLING'`,
        { headers: { tenantName } }
      );

      const data = response.data;
      const rawValue = data?.[0]?.Column1;
      const newInvNo = (Number(rawValue) || 0) + 1;
      setBillNumber(newInvNo);
      return newInvNo;
    } catch (error) {
      console.error(error);
    }
  };
  const date = new Date();

  const handleSave = async (vn, bill) => {

    const payload = [
      {
        sdate: date.toISOString(),
        entryno: vn,
        groupname: "CUSTOMER",
        lname: saveSale.DESCRIPTION,
        particulars: "SALE",
        gjama: 0,
        gnama: Number(saveSale.GWT) || 0,
        touch: Number(saveSale.TOUCHPER) || 0,
        pjama: 0,
        pnama: Number(saveSale.PUREWT) || 0,
        cjama: 0,
        cnama: Number(saveSale.TOTCASH) || 0,
        vno: bill,
        vtype: "CUSTOMER",
        stype: "NEW ORNAMENTS",
        cuT_METAL: 0,
        cuT_TOUCH: 0,
        cuT_FINE: 0,
        rate: 0,
        cuT_AMOUNT: 0,
        vaT_PER: 0,
        vaT_AMOUNT: 0,
        cuT_NETAMOUNT: 0,
        jstonewt: 0,
        jnwt: 0,
        jamount: 0,
        nstonewt: Number(saveSale.STONEWT) || 0,
        nnwt: Number(saveSale.NWT) || 0,
        namount: 0,
        tranS_TYPE: "BILLING",
        maintype: "ORNAMENT STOCK",
        scode: 2,
        narration: "-",
        branchname: "-",
        branchcode: "-",
        dealername: saveSale.DESCRIPTION,
        paytype: "-",
        sno: bill,
        invno: String(bill)
      }

    ];
    console.log("Post Payload" + payload);

    try {
      await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertTransEntryData`,
        payload,
        { headers: { tenantName } }
      );
      message.success("Saved Successfully");
      // vNoAPI();
      // handleReset();
    } catch (error) {
      console.error(error);
      message.error("Save Failed");
    }
  };

  const estimationDataBill = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/UpdateEstimationDataBillDetails?billNo=${billNo + 1
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
        `${CREATE_jwel}/api/Wholesal/UpdateEstimationMastBillDetails?billNo=${billNo + 1
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
        `${CREATE_jwel}/api/Wholesal/UpdateEstimationItemsBillDetails?billNo=${billNo + 1
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
        tableName: "RETURN_ESTIMATION_DATA",
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
      const vno = await vNoAPI();
      const bill = await billNoAPI();
      await handleCancel();
      await estimationNoDataAPI(selectEstimationNo);
      await estimationDataBill();
      await estimationMastBill();
      await estimationItemsBill();
      await handleSave(vno, bill);


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
    vNoAPI();
    billNoAPI();
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
              <h3 className={styles.heading}>Sale Return</h3>
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
                      saveSale();
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
        <SaleReturnEstimationDialog
          saleOpen={saleOpen}
          handleCancel={handleCancel}
          handleSale={handleSale}
        />
        <DeleteSaleReturnEstimationDialog
          estOpen={estOpen}
          handleCancel={handleEstCancel}
          handleDelete={handleDelete}
        />
      </div>
    </Spin>
  );
};

export default SaleReturnEstimation;
