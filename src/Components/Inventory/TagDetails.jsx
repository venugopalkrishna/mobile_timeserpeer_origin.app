import { Checkbox, Col, DatePicker, Row, Select, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import PdfExcelPrint from "../Utiles/PdfExcelPrint";
import TagDetailsDialog from "./TagDetailsDialog";
import styles from "./inventory.module.css";
import { FilterOutlined } from "@ant-design/icons";

const { Option } = Select;

const TagDetails = () => {
  const formRef = useRef(null);
  const toRef = useRef(null);
  const partyRef = useRef(null);
  const itemRef = useRef(null);
  const tagNoRef = useRef(null);
  const estRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [rawTagDetailsData, setRawTagDetailsData] = useState([]);
  const [tagDetailsData, setTagDetailsData] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [workerName, setWorkerName] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState(null);
  const [searchSlipNo, setSearchSlipNo] = useState();
  const [searchLotNo, setSearchLotNo] = useState();
  const [selectDate, setSelectDate] = useState(false);
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGwt, setTotalGwt] = useState(0);
  const [totalNwt, setTotalNwt] = useState(0);
  const [totalSwt, setTotalSwt] = useState(0);
  console.log(tagDetailsData, "tagDetailsData");

  const imageUrls = localStorage.getItem("images")?.split(",");
  const imagesData = imageUrls?.length > 0 ? imageUrls : [];
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const tagDetailsAPI = async () => {
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
        tableName: "TAG_GENERATION",
        where: whereCondition,
        order: "SLIPNO,SNO",
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

      const uniqueProducts = Array.from(
        new Set(
          data
            .map((item) => item.PRODNAME?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ PRODNAME: desc }));

      const uniqueWorkerNames = Array.from(
        new Set(
          data
            .map((item) => item.workername?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ workername: desc }));

      setProductNames(uniqueProducts);
      setWorkerName(uniqueWorkerNames);
      setRawTagDetailsData(data); // Save unfiltered data
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tagDetailsAPI();
  }, [fromDate, toDate, selectDate]);

  useEffect(() => {
    const filtered = rawTagDetailsData.filter((item) => {
      const matchesProduct =
        !selectedProduct ||
        item.PRODNAME?.trim().toUpperCase() === selectedProduct.toUpperCase();

      const matchesWorker =
        !selectedWorkerName ||
        item.workername?.trim().toUpperCase() ===
          selectedWorkerName.toUpperCase();

      const matchesSlip =
        !searchSlipNo || item.SLIPNO?.toString().includes(searchSlipNo);

      const matchesLot =
        !searchLotNo || item.LOTNO?.toString().includes(searchLotNo);

      return matchesProduct && matchesWorker && matchesSlip && matchesLot;
    });
    const calculatedData = filtered.map((item, index) => ({
      ...item,
      key: index + 1,
      serialNo: index + 1,
    }));
    const totalPieces = calculatedData.reduce(
      (sum, item) => sum + Number(item.PIECES || 0),
      0
    );
    const totalGross = calculatedData.reduce(
      (sum, item) => sum + Number(item.GWT || 0),
      0
    );
    const totalStones = calculatedData.reduce(
      (sum, item) => sum + Number(item.STONEWT || 0),
      0
    );
    const totalNetWt = calculatedData.reduce(
      (sum, item) => sum + Number(item.NWT || 0),
      0
    );

    setTotalPcs(totalPieces);
    setTotalGwt(totalGross);
    setTotalSwt(totalStones);
    setTotalNwt(totalNetWt);

    setTagDetailsData(calculatedData);
  }, [
    rawTagDetailsData,
    selectedProduct,
    selectedWorkerName,
    searchSlipNo,
    searchLotNo,
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
      dataIndex: "SLIPNO",
      key: "SLIPNO",
      align: "center",
      width: 60,
      className: "designCode",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.SLIPNO || 0}</div>
          </>
        );
      },
    },
    {
      title: "Slip Date",
      dataIndex: "slipdate",
      key: "slipdate",
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>
              {record?.slipdate
                ? dayjs(record.slipdate).format("DD-MMM-YYYY")
                : "-"}
            </div>
          </>
        );
      },
    },
    {
      title: "Worker Name",
      dataIndex: "workername",
      key: "workername",
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>{record?.workername}</div>
          </>
        );
      },
    },
    {
      title: "Tag No",
      dataIndex: "TAGNO",
      key: "TAGNO",
      align: "center",
      width: 60,
      className: "tag",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.TAGNO}</div>
          </>
        );
      },
    },
    {
      title: "Product Name",
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
      dataIndex: "PIECES",
      key: "PIECES",
      align: "center",
      width: 60,
      className: "pics",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.PIECES}</div>
          </>
        );
      },
    },
    {
      title: "Gross.Wt",
      dataIndex: "GWT",
      key: "GWT",
      align: "right",
      width: 70,
      className: "gwt",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.GWT)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    {
      title: "Less.Wt",
      dataIndex: "STONEWT",
      key: "STONEWT",
      align: "right",
      width: 60,
      className: "less",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.STONEWT)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    {
      title: "Net.Wt",
      dataIndex: "NWT",
      key: "NWT",
      align: "right",
      width: 60,
      className: "nwt",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>
              {Number(record?.NWT)?.toFixed(3)}
            </div>
          </>
        );
      },
    },
    {
      title: "Dis.Wt",
      dataIndex: "DIFFWT",
      key: "DIFFWT",
      align: "right",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{Number(record?.DIFFWT)?.toFixed(3)}</div>
          </>
        );
      },
    },
    {
      title: "HUID1",
      dataIndex: "HUID1",
      key: "HUID1",
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.HUID1}</div>
          </>
        );
      },
    },
    {
      title: "HUID2",
      dataIndex: "HUID2",
      key: "HUID2",
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.HUID2}</div>
          </>
        );
      },
    },
    {
      title: "Lot No",
      dataIndex: "LOTNO",
      key: "LOTNO",
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.LOTNO}</div>
          </>
        );
      },
    },
  ];

  const formattedData = [
    ...tagDetailsData.map((item, index) => ({
      ...item,
      slipdate: dayjs(item.slipdate).format("DD-MMM-YYYY"),
    })),
    {
      serialNo: "Total",
      SLIPNO: "",
      slipdate: "",
      workername: "",
      TAGNO: "",
      PRODNAME: "",
      PREFIX: "",
      PIECES: totalPcs,
      GWT: Number(totalGwt).toFixed(3),
      STONEWT: Number(totalSwt).toFixed(3),
      NWT: Number(totalNwt).toFixed(3),
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
              Tag Details
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
          <Col style={{ display: "flex", gap: "10px" }}>
            <PdfExcelPrint
              data={formattedData}
              columns={columns}
              fileName="Tag-details"
            />
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: "0 1 200px",
            borderRadius: "8px",
            padding: "5px",
            background: "#52bd91",
          }}
        >
          <div
            style={{
              display: "flex",
              // flexDirection: "column",
            }}
          >
            <Checkbox
              checked={selectDate}
              onChange={(e) => {
                setSelectDate(e.target.checked);
                setFromDate(dayjs());
                setToDate(dayjs());
              }}
              style={{
                // background: "#52f59eff",
                // borderRadius: "5px",
                // padding: "0px 5px",
                fontSize: "30px",
              }}
            />
          </div>
          <div>From:</div>
          <DatePicker
            style={{ flex: 1, minWidth: "80px" }}
            ref={formRef}
            inputReadOnly
            disabled={selectDate === false}
            onKeyDown={(e) => handleKeyDown(e, toRef)}
            value={fromDate ? dayjs(fromDate) : null}
            onChange={(date) => setFromDate(date)}
            format="DD-MMM-YYYY"
          />
          <div>To:</div>
          <DatePicker
            style={{ flex: 1, minWidth: "80px" }}
            ref={toRef}
            inputReadOnly
            disabled={selectDate === false}
            onKeyDown={(e) => handleKeyDown(e, partyRef)}
            value={toDate ? dayjs(toDate) : null}
            onChange={(date) => setToDate(date)}
            format="DD-MMM-YYYY"
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <FilterOutlined
              style={{ color: "red", fontSize: "20px" }}
              onClick={() => {
                setFilterOpen(true);
              }}
            />
          </div>
        </div>
        <div className={styles.cardContainer}>
          {tagDetailsData?.map((item, index) => (
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
                      {item.SLIPNO}
                    </span>
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#52bd91",
                      }}
                    >
                      {item.TAGNO}
                    </span>
                  </p>
                  <p style={{ fontSize: "12px", marginLeft: "16px" }}>
                    {/* Est Date: {" "} */}
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {dayjs(item.slipdate).format("DD-MMM-YYYY")}
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
                        color: "red",
                      }}
                    >
                      {item?.workername || "-"}
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
                      <strong>{item.PIECES}</strong>
                    </span>
                  </p>
                </div>
              </div>
              <hr className={styles.fullWidthLine} />

              <div className={styles.row}>
                <p style={{ fontSize: "12px" }}>
                  Purity:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.PREFIX}
                  </span>
                </p>
                <p style={{ fontSize: "12px" }}>
                  Product:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#52bd91",
                    }}
                  >
                    {item.PRODNAME}
                  </span>
                </p>
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
                    <strong>{Number(item.GWT)?.toFixed(3)}</strong>
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
                    {Number(item.STONEWT)?.toFixed(3)}
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
                    {Number(item.NWT)?.toFixed(3)}
                  </span>
                </p>
              </div>
              {/* <hr className={styles.fullWidthLine} /> */}

              {/* <div className={styles.row}>
                <p style={{ fontSize: "12px" }}>
                  HUID1:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {item.HUID1}
                  </span>
                </p>
                <p style={{ fontSize: "12px" }}>
                  HUID2:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {item.HUID2}
                  </span>
                </p>
                <p style={{ fontSize: "12px" }}>
                  Lot No:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {item.LOTNO}
                  </span>
                </p>
              </div> */}
              {/* <hr className={styles.fullWidthLine} /> */}

              {/* <div className={styles.fullWidthStone}>
                <p style={{ fontSize: "14px", padding: "0px 8px 0px 8px" }}>
                  {item.STDET}
                </p>
              </div> */}
            </div>
          ))}
        </div>
        <TagDetailsDialog
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          selectedParty={selectedProduct}
          setSelectedParty={setSelectedProduct}
          partyNames={productNames}
          selectedItem={selectedWorkerName}
          setSelectedItem={setSelectedWorkerName}
          itemNames={workerName}
          searchTagNo={searchSlipNo}
          setSearchTagNo={setSearchSlipNo}
          searchEstimationNo={searchLotNo}
          setSearchEstimationNO={setSearchLotNo}
        />
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

export default TagDetails;
