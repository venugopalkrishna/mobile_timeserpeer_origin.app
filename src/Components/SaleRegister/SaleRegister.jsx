import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import axios from "axios";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./saleregister.module.css";
import { DatePicker, Row, Spin, Typography } from "antd";

const SaleRegister = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);


    const userArea = localStorage.getItem("city");
    const userName = localStorage.getItem("userName");
    const singleImage = localStorage.getItem("singleImage");
    const tenantName = localStorage.getItem("tenantName");
    const toggleDrawer = () => setOpen(false);


    const SaleRegisterionSummaryAPI = async () => {
        setLoading(true);
        try {
            let whereCondition = "";
            if (fromDate && toDate) {
                whereCondition = `TRANS_TYPE='BILLING'AND SDATE>='${dayjs(fromDate).format(
                    "MM/DD/YYYY"
                )}' and SDATE<='${dayjs(toDate).format("MM/DD/YYYY")}'`;
            }
            let params = {
                tableName: "TRANS_ENTRY_DATA",
                where: whereCondition,
                order: "ENTRYNO",
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
                new Map(data.map((item) => [item.ENTRYNO, item])).values()
            );

            setSummaryData(uniqueData);
        } catch (error) {
            console.error("Error fetching Sale Register count:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fromDate && toDate) {
            SaleRegisterionSummaryAPI();
        }
    }, [fromDate, toDate]);

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
                            <h3 className={styles.heading}>Sale Register</h3>
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
                                        item.ENTRYNO <= 0 ? styles.infoBox : styles.infoBox1
                                    }
                                >
                                    {/* Tag No */}
                                    <div
                                        className={
                                            item.ENTRYNO <= 0 ? styles.rowTag : styles.rowTag1
                                        }
                                    >
                                        <p style={{ fontSize: "12px" }}>
                                            Entry No:{" "}
                                            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                                                {item.ENTRYNO}
                                            </span>
                                        </p>
                                        <div className={styles.row}>
                                            <p style={{ fontSize: "11px" }}>
                                                <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                                                    {dayjs(item.SDATE).format("DD-MMM-YYYY")}
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
                                    </div>
                                    {/* <hr className={styles.fullWidthLine} /> */}
                                    {/* Item and Purity */}


                                    {/* <hr className={styles.fullWidthLine} /> */}

                                    <div className={styles.row}>
                                        <p style={{ fontSize: "11px" }}>
                                            {" "}
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "12px",
                                                    color: "green",
                                                }}
                                            >
                                                {item.LNAME}
                                            </span>
                                        </p>
                                        <p style={{ fontSize: "11px" }}>
                                            Touch:{" "}
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "12px",
                                                    color: "darkblue",
                                                }}
                                            >
                                                {Number(item.TOUCH)?.toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                    <hr className={styles.fullWidthLine} />

                                    {/* Gross Wt, Less Wt, Net Wt */}
                                    <div className={styles.row}>
                                        <p style={{ fontSize: "11px" }}>
                                            Gross :{" "}
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "12px",
                                                    color: "red",
                                                }}
                                            >
                                                {Number(item.GNAMA)?.toFixed(3)}
                                            </span>
                                        </p>
                                        <p style={{ fontSize: "11px" }}>
                                            Less:{" "}
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "12px",
                                                    color: "red",
                                                }}
                                            >
                                                {Number(item.NSTONEWT)?.toFixed(3)}
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
                                                {Number(item.NNWT)?.toFixed(3)}
                                            </span>
                                        </p>
                                    </div>
                                    <hr className={styles.fullWidthLine} />

                                    <div className={styles.row}>
                                        <p style={{ fontSize: "11px" }}>
                                            Fine :{" "}
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "12px",
                                                    color: "red",
                                                }}
                                            >
                                                {Number(item.PNAMA)?.toFixed(3)}
                                            </span>
                                        </p>
                                        <p style={{ fontSize: "11px" }}>
                                            cash:{" "}
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "12px",
                                                    color: "red",
                                                }}
                                            >
                                                {Number(item.CNAMA)?.toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default SaleRegister;
