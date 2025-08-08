import { Col, Row, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import PdfExcelPrint from "../Utiles/PdfExcelPrint";
import styles from "./inventory.module.css";

const TagStockSummary = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tagStockSummaryData, setTagStockSummaryData] = useState([]);
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGwt, setTotalGwt] = useState(0);
  const [totalNwt, setTotalNwt] = useState(0);
  const [totalSwt, setTotalSwt] = useState(0);

  const imageUrls = localStorage.getItem("images")?.split(",");
  const imagesData = imageUrls?.length > 0 ? imageUrls : [];
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const tagStockSummaryAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/MasterItemMasterList`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      const calculatedData = data.map((item, index) => ({
        ...item,
        key: index + 1,
        serialNo: index + 1,
      }));
      const totalPieces = calculatedData.reduce(
        (sum, item) => sum + Number(item.Pieces || 0),
        0
      );
      const totalGross = calculatedData.reduce(
        (sum, item) => sum + Number(item.Gwt || 0),
        0
      );
      const totalStones = calculatedData.reduce(
        (sum, item) => sum + Number(item.Swt || 0),
        0
      );
      const totalNetWt = calculatedData.reduce(
        (sum, item) => sum + Number(item.Nwt || 0),
        0
      );

      setTotalPcs(totalPieces);
      setTotalGwt(totalGross);
      setTotalSwt(totalStones);
      setTotalNwt(totalNetWt);

      setTagStockSummaryData(calculatedData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tagStockSummaryAPI();
  }, []);

  const columns = [
    {
      title: "SNo",
      dataIndex: "serialNo",
      key: "serialNo",
      className: "blue-background-column",
      align: "center",
      width: 50,
      render: (text, record) => {
        return (
          <>
            <div>{record?.serialNo}</div>
          </>
        );
      },
    },
    {
      title: "Purity",
      dataIndex: "PREFIX",
      key: "PREFIX",
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.PREFIX}</div>
          </>
        );
      },
    },
    {
      title: "Worker Name",
      dataIndex: "PRODNAME",
      key: "PRODNAME",
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>{record?.PRODNAME}</div>
          </>
        );
      },
    },
    {
      title: "Pieces",
      dataIndex: "Pieces",
      key: "Pieces",
      align: "center",
      width: 60,
      className: "pics",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.Pieces}</div>
          </>
        );
      },
    },
    {
      title: "Gross.Wt",
      dataIndex: "Gwt",
      key: "Gwt",
      align: "right",
      width: 70,
      className: "gwt",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.Gwt)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    {
      title: "Less.Wt",
      dataIndex: "Swt",
      key: "Swt",
      align: "right",
      width: 60,
      className: "less",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.Swt)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    {
      title: "Net.Wt",
      dataIndex: "Nwt",
      key: "Nwt",
      align: "right",
      width: 60,
      className: "nwt",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.Nwt)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
  ];

  const formattedData = [
    ...tagStockSummaryData.map((item, index) => ({
      ...item,
    })),
    {
      serialNo: "Total",
      PREFIX: "",
      PRODNAME: "",
      Pieces: totalPcs,
      Gwt: Number(totalGwt).toFixed(3),
      Swt: Number(totalSwt).toFixed(3),
      Nwt: Number(totalNwt).toFixed(3),
    },
  ];

  const toggleDrawer = () => {
    setOpen(false);
  };

  return (
    <div>
      <Header setOpen={setOpen} />
      <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col>
            <Typography style={{ fontSize: "15px", fontWeight: "bold" }}>
              Tag Stock Summary
            </Typography>
          </Col>
        </Row>
        <Row
          justify="space-between"
          align="right"
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PdfExcelPrint
              data={formattedData}
              columns={columns}
              fileName="Tag-details"
            />
          </Col>
        </Row>
        <div className={styles.cardContainer}>
          {tagStockSummaryData?.map((item, index) => (
            <div key={index} className={styles.infoBox}>
              <div className={styles.rowTag}>
                <div className={styles.estimationRow}>
                  <p style={{ fontSize: "12px" }}>
                    Purity:{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      <strong>{item.PREFIX}</strong>
                    </span>
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    Pieces:{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      <strong>{item.Pieces}</strong>
                    </span>
                  </p>
                </div>
                <div className={styles.estimationRow}>
                  <p style={{ fontSize: "14px" }}>
                    Worker:{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#52bd91",
                      }}
                    >
                      {item?.PRODNAME || "-"}
                    </span>
                  </p>
                </div>
              </div>
              <hr className={styles.fullWidthLine} />

              <div className={styles.row}>
                <p style={{ fontSize: "12px" }}>
                  Gross Wt:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    <strong>{Number(item.Gwt)?.toFixed(3)}</strong>
                  </span>
                </p>
                <p style={{ fontSize: "12px" }}>
                  Less Wt:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {Number(item.Swt)?.toFixed(3)}
                  </span>
                </p>
                <p style={{ fontSize: "12px" }}>
                  Net Wt:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {Number(item.Nwt)?.toFixed(3)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
    </div>
  );
};

export default TagStockSummary;
