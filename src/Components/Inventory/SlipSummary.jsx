import { Col, Input, Row, Select, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import SidebarDrawer from "../SidebarDrawer";
import PdfExcelPrint from "../Utiles/PdfExcelPrint";
import styles from "./inventory.module.css";
import Header from "../Header";

const { Option } = Select;

const SlipSummary = () => {
  const formRef = useRef(null);
  const toRef = useRef(null);
  const partyRef = useRef(null);
  const itemRef = useRef(null);
  const tagNoRef = useRef(null);
  const estRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [rawSlipSummaryData, setRawSlipSummaryData] = useState([]);
  const [slipSummaryData, setSlipSummaryData] = useState([]);
  const [workerName, setWorkerName] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedWorkerName, setSelectedWorkerName] = useState(null);
  const [searchSlipNo, setSearchSlipNo] = useState();
  const [selectDate, setSelectDate] = useState(false);
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

  const slipSummaryAPI = async () => {
    setLoading(true);
    try {
      let whereCondition = "";
      if (selectDate === true) {
        whereCondition = `RECYCLE='NO' AND SLIPDATE>='${dayjs(fromDate).format(
          "MM/DD/YYYY"
        )}' and SLIPDATE<='${dayjs(toDate).format("MM/DD/YYYY")}'`;
      } else {
        whereCondition = `RECYCLE='NO'`;
      }

      let params = {
        tableName: "LOT_CREATION",
        // where: whereCondition,
        order: "LOTNO",
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithOrder`,
        {
          params,
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      //   const uniqueProducts = Array.from(
      //     new Set(
      //       data
      //         .map((item) => item.PRODNAME?.trim().toUpperCase())
      //         .filter((desc) => desc && desc !== "-")
      //     )
      //   ).map((desc) => ({ PRODNAME: desc }));

      const uniqueWorkerNames = Array.from(
        new Set(
          data
            .map((item) => item.DEALERNAME?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ DEALERNAME: desc }));

      //   setProductNames(uniqueProducts);
      setWorkerName(uniqueWorkerNames);
      setRawSlipSummaryData(data); // Save unfiltered data
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    slipSummaryAPI();
  }, []);

  useEffect(() => {
    const filtered = rawSlipSummaryData.filter((item) => {
      //   const matchesProduct =
      //     !selectedProduct ||
      //     item.PRODNAME?.trim().toUpperCase() === selectedProduct.toUpperCase();

      const matchesWorker =
        !selectedWorkerName ||
        item.DEALERNAME?.trim().toUpperCase() ===
          selectedWorkerName.toUpperCase();

      const matchesSlip =
        !searchSlipNo || item.lotno?.toString().includes(searchSlipNo);

      //   const matchesLot =
      //     !searchLotNo || item.LOTNO?.toString().includes(searchLotNo);

      return matchesWorker && matchesSlip;
    });
    const calculatedData = filtered.map((item, index) => ({
      ...item,
      key: index + 1,
      serialNo: index + 1,
    }));
    const totalPieces = calculatedData.reduce(
      (sum, item) => sum + Number(item.pieces || 0),
      0
    );
    const totalGross = calculatedData.reduce(
      (sum, item) => sum + Number(item.gwt || 0),
      0
    );
    const totalStones = calculatedData.reduce(
      (sum, item) => sum + Number(item.stonewt || 0),
      0
    );
    const totalNetWt = calculatedData.reduce(
      (sum, item) => sum + Number(item.nwt || 0),
      0
    );

    setTotalPcs(totalPieces);
    setTotalGwt(totalGross);
    setTotalSwt(totalStones);
    setTotalNwt(totalNetWt);

    setSlipSummaryData(calculatedData);
  }, [
    rawSlipSummaryData,
    // selectedProduct,
    selectedWorkerName,
    searchSlipNo,
    // searchLotNo,
  ]);

  const columns = [
    {
      title: "SNo",
      dataIndex: "serialNo",
      key: "serialNo",
      className: "blue-background-column",
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
      title: "Slip No",
      dataIndex: "lotno",
      key: "lotno",
      align: "center",
      width: 60,
      className: "designCode",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.lotno || 0}</div>
          </>
        );
      },
    },
    {
      title: "Slip Date",
      dataIndex: "lotdate",
      key: "lotdate",
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>
              {record?.lotdate
                ? dayjs(record.lotdate).format("DD-MMM-YYYY")
                : "-"}
            </div>
          </>
        );
      },
    },
    {
      title: "Worker Name",
      dataIndex: "DEALERNAME",
      key: "DEALERNAME",
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>{record?.DEALERNAME}</div>
          </>
        );
      },
    },
    // {
    //   title: "Tag No",
    //   dataIndex: "TAGNO",
    //   key: "TAGNO",
    //   align: "center",
    //   width: 60,
    //   className: "tag",
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div style={{ fontWeight: "bold" }}>{record?.TAGNO}</div>
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "Product Name",
    //   dataIndex: "PRODNAME",
    //   key: "PRODNAME",
    //   align: "left",
    //   width: 100,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div>{record?.PRODNAME}</div>
    //       </>
    //     );
    //   },
    // },
    {
      title: "Purity",
      dataIndex: "PREFIX",
      key: "PREFIX",
      align: "right",
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
      title: "Pieces",
      dataIndex: "pieces",
      key: "pieces",
      align: "center",
      width: 60,
      className: "pics",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.pieces}</div>
          </>
        );
      },
    },
    {
      title: "Gross.Wt",
      dataIndex: "gwt",
      key: "gwt",
      align: "right",
      width: 70,
      className: "gwt",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.gwt)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    {
      title: "Less.Wt",
      dataIndex: "stonewt",
      key: "stonewt",
      align: "right",
      width: 60,
      className: "less",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.stonewt)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    {
      title: "Net.Wt",
      dataIndex: "nwt",
      key: "nwt",
      align: "right",
      width: 60,
      className: "nwt",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.nwt)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    // {
    //   title: "Dis.Wt",
    //   dataIndex: "DIFFWT",
    //   key: "DIFFWT",
    //   align: "right",
    //   width: 60,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div>{Number(record?.DIFFWT)?.toFixed(3)}</div>
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "HUID1",
    //   dataIndex: "HUID1",
    //   key: "HUID1",
    //   align: "center",
    //   width: 60,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div>{record?.HUID1}</div>
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "HUID2",
    //   dataIndex: "HUID2",
    //   key: "HUID2",
    //   align: "center",
    //   width: 60,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div>{record?.HUID2}</div>
    //       </>
    //     );
    //   },
    // },
    // {
    //   title: "Lot No",
    //   dataIndex: "LOTNO",
    //   key: "LOTNO",
    //   align: "center",
    //   width: 60,
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div>{record?.LOTNO}</div>
    //       </>
    //     );
    //   },
    // },
  ];

  const formattedData = [
    ...slipSummaryData.map((item, index) => ({
      ...item,
      lotdate: dayjs(item.lotdate).format("DD-MMM-YYYY"),
    })),
    {
      serialNo: "Total",
      lotno: "",
      lotdate: "",
      DEALERNAME: "",
      PREFIX: "",
      pieces: totalPcs,
      gwt: Number(totalGwt).toFixed(3),
      stonewt: Number(totalSwt).toFixed(3),
      nwt: Number(totalNwt).toFixed(3),
    },
  ];

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleTagNoKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      //   submitRef.current?.click();
    }
  };
  const handlePartyChange = () => {
    // touchRef.current?.focus();
  };

  const handleItemChange = () => {
    // touchRef.current?.focus();
  };

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
            <Typography style={{ fontSize: "18px", fontWeight: "bold" }}>
              Slip Summary
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
        <Row
          justify="space-between"
          align="right"
          style={{
            marginBottom: "10px",
            borderRadius: "8px",
            padding: "5px",
            background: "#52bd91",
          }}
        >
          <Col style={{ display: "flex", gap: "5px" }}>
            <div
              style={{
                // display: "flex",
                flexDirection: "column",
                // minWidth: "150px",
                // flex: "1 1 150px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "14px",
                  //   marginBottom: "3px",
                  //   marginRight: "3px",
                }}
              >
                Worker Name :{" "}
              </label>
              <Select
                showSearch
                allowClear
                placeholder="Select Worker Name"
                style={{ width: "100%" }}
                ref={itemRef}
                value={selectedWorkerName || null}
                onChange={(value) => {
                  setSelectedWorkerName(value);
                  handleItemChange();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const filteredOptions = workerName.filter((item) =>
                      item.DEALERNAME.toLowerCase().includes(
                        e.target.value.toLowerCase()
                      )
                    );
                    if (filteredOptions.length > 0) {
                      setSelectedWorkerName(filteredOptions[0].DEALERNAME);
                    }
                  }
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {workerName.map((item, index) => (
                  <Option key={index} value={item.DEALERNAME}>
                    {item.DEALERNAME}
                  </Option>
                ))}
              </Select>
            </div>

            <div
              style={{
                // display: "flex",
                flexDirection: "column",
                // minWidth: "150px",
                // flex: "1 1 150px",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "14px",
                  //   marginBottom: "3px",
                  //   marginRight: "3px",
                }}
              >
                Slip No :
              </label>
              <Input
                placeholder="Slip No"
                ref={tagNoRef}
                style={{ width: "100%" }}
                onKeyDown={(e) => handleKeyDown(e, estRef)}
                value={searchSlipNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setSearchSlipNo(value);
                  }
                }}
              />
            </div>
          </Col>
        </Row>
        <div className={styles.cardContainer}>
          {slipSummaryData?.map((item, index) => (
            <div key={index} className={styles.infoBox}>
              <div className={styles.rowTag}>
                <div className={styles.estimationRow}>
                  <p style={{ fontSize: "14px" }}>
                    Slip No:{" "}
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        // color: "#52bd91",
                      }}
                    >
                      {item.lotno}
                    </span>
                  </p>
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
                  <p style={{ fontSize: "12px", marginLeft: "16px" }}>
                    {/* Est Date: {" "} */}
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {dayjs(item.lotdate).format("DD-MMM-YYYY")}
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
                      {item?.DEALERNAME || "-"}
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
                      <strong>{item.pieces}</strong>
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
                    <strong>{Number(item.gwt)?.toFixed(3)}</strong>
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
                    {Number(item.stonewt)?.toFixed(3)}
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
                    {Number(item.nwt)?.toFixed(3)}
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

export default SlipSummary;
