import { FilterOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Row, Select, Typography } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import ReturnEstimationDetailsDialog from "./ReturnEstimationDetailsDialog";
import styles from "./ReturnEstimationRegister.module.css";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";

const { Option } = Select;

const ReturnEstimationDetails = () => {
  const formRef = useRef(null);
  const toRef = useRef(null);
  const partyRef = useRef(null);
  const itemRef = useRef(null);
  const tagNoRef = useRef(null);
  const estRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [partyNames, setPartyNames] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [searchTagNo, setSearchTagNo] = useState();
  const [searchEstimationNo, setSearchEstimationNO] = useState();
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGwt, setTotalGwt] = useState(0);
  const [totalNwt, setTotalNwt] = useState(0);
  const [totalSwt, setTotalSwt] = useState(0);
  const [totalFineGold, setTotalFineGold] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const imageUrls = localStorage.getItem("images")?.split(",");
  const imagesData = imageUrls?.length > 0 ? imageUrls : [];
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const EstimationSummaryAPI = async () => {
    // setLoading(true);
    try {
      let whereCondition = "";
      if (fromDate && toDate) {
        whereCondition = `ESTIMATIONDATE>='${dayjs(fromDate).format(
          "MM/DD/YYYY"
        )}' AND ESTIMATIONDATE<='${dayjs(toDate).format("MM/DD/YYYY")}'`;
      }
      let params = {
        tableName: "RETURN_ESTIMATION_DATA",
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

      const filteredData = data.filter((item) => {
        return (
          (!selectedParty ||
            item.DESCRIPTION?.trim().toUpperCase() ===
              selectedParty.toUpperCase()) &&
          (!selectedItem ||
            item.PRODNAME?.trim().toUpperCase() ===
              selectedItem.toUpperCase()) &&
          (!searchTagNo || String(item.TAGNO) === String(searchTagNo) || "") &&
          (!searchEstimationNo ||
            String(item.ESTIMATIONNO) === String(searchEstimationNo) ||
            "")
        );
      });
      const uniqueDescriptions = Array.from(
        new Set(
          data
            .map((item) => item.DESCRIPTION?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ DESCRIPTION: desc }));

      const uniqueItemNames = Array.from(
        new Set(
          data
            .map((item) => item.PRODNAME?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ PRODNAME: desc }));

      const totalPieces = filteredData.reduce(
        (sum, item) => sum + Number(item.PIECES || 0),
        0
      );
      const totalGross = filteredData.reduce(
        (sum, item) => sum + Number(item.GWT || 0),
        0
      );
      const totalStones = filteredData.reduce(
        (sum, item) => sum + Number(item.STONEWT || 0),
        0
      );
      const totalNetWt = filteredData.reduce(
        (sum, item) => sum + Number(item.NWT || 0),
        0
      );
      const totalGold = filteredData.reduce(
        (sum, item) => sum + Number(item.FINEGOLD || 0),
        0
      );

      setTotalPcs(totalPieces);
      setTotalGwt(totalGross);
      setTotalSwt(totalStones);
      setTotalNwt(totalNetWt);
      setTotalFineGold(totalGold);
      setPartyNames(uniqueDescriptions);
      setItemNames(uniqueItemNames);
      setSummaryData(filteredData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };
  useEffect(() => {
    if (fromDate && toDate) {
      EstimationSummaryAPI();
    }
  }, [
    fromDate,
    toDate,
    selectedParty,
    selectedItem,
    searchTagNo,
    searchEstimationNo,
  ]);

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

  return (
    <div>
      <Header setOpen={setOpen} />
      <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "10px" }}
        >
          <Col>
            <Typography style={{ fontSize: "15px", fontWeight: "bold" }}>
              Return Estimation Details
            </Typography>
          </Col>
        </Row>
        <Row
          justify="space-between"
          align="right"
          style={{ marginBottom: "10px" }}
        >
          <Col style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#0C1154",
                borderColor: "#0C1154",
                flex: "0 1 50px",
              }}
            >
              Show
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "orange",
                borderColor: "orange",
                flex: "0 1 50px",
              }}
            >
              Print
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "red",
                borderColor: "red",
                flex: "0 1 50px",
              }}
            >
              Exit
            </Button>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flex: "0 1 200px",
          }}
        >
          <div>From:</div>
          <DatePicker
            style={{ flex: 1, minWidth: "80px" }}
            ref={formRef}
            onKeyDown={(e) => handleKeyDown(e, toRef)}
            value={fromDate ? dayjs(fromDate) : null}
            onChange={(date) => setFromDate(date)}
            format="DD-MMM-YYYY"
          />
          <div>To:</div>
          <DatePicker
            style={{ flex: 1, minWidth: "80px" }}
            ref={toRef}
            onKeyDown={(e) => handleKeyDown(e, partyRef)}
            value={toDate ? dayjs(toDate) : null}
            onChange={(date) => setToDate(date)}
            format="DD-MMM-YYYY"
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <FilterOutlined
              style={{ color: "green", fontSize: "20px" }}
              onClick={() => {
                setFilterOpen(true);
              }}
            />
          </div>
        </div>
        <div className={styles.cardContainer}>
          {summaryData?.map((item, index) => (
            <div key={index} className={styles.infoBox}>
              <div className={styles.rowTag}>
                <div className={styles.estimationRow}>
                  <p style={{ fontSize: "14px" }}>
                    Est NO:{" "}
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        // color: "#52bd91",
                      }}
                    >
                      {item.ESTIMATIONNO}
                    </span>
                  </p>
                  <p style={{ fontSize: "12px", marginLeft: "16px" }}>
                    {/* Est Date: {" "} */}
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {dayjs(item.ESTIMATIONDATE).format("DD-MMM-YYYY")}
                    </span>
                  </p>
                </div>
                <p style={{ fontSize: "12px", padding: "0px 8px 0px 8px" }}>
                  Party:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {item?.DESCRIPTION || "-"}
                  </span>
                </p>
              </div>
              <hr className={styles.fullWidthLine} />

              <div className={styles.row}>
                <p style={{ fontSize: "12px" }}>
                  Tag No:{" "}
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#52bd91",
                    }}
                  >
                    {item.TAGNO}
                  </span>
                </p>
                <p style={{ fontSize: "14px" }}>
                  Item:{" "}
                  <span
                    style={{
                      fontSize: "16px",
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
              <hr className={styles.fullWidthLine} />

              <div className={styles.row}>
                <p style={{ fontSize: "12px" }}>
                  Touch:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {item.TOUCH}
                  </span>
                </p>
                <p style={{ fontSize: "12px" }}>
                  Fine Gold:{" "}
                  <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                    {Number(item.FINEGOLD)?.toFixed(3)}
                  </span>
                </p>
              </div>
              <hr className={styles.fullWidthLine} />

              <div className={styles.fullWidthStone}>
                <p style={{ fontSize: "14px", padding: "0px 8px 0px 8px" }}>
                  {item.STDET}
                </p>
              </div>
            </div>
          ))}
        </div>
        <ReturnEstimationDetailsDialog
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          selectedParty={selectedParty}
          setSelectedParty={setSelectedParty}
          partyNames={partyNames}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          itemNames={itemNames}
          searchTagNo={searchTagNo}
          setSearchTagNo={setSearchTagNo}
          searchEstimationNo={searchEstimationNo}
          setSearchEstimationNO={setSearchEstimationNO}
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
export default ReturnEstimationDetails;
