import { useEffect, useState } from "react";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import { Spin, Row } from "antd";

const Outstandings = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const tenantName = localStorage.getItem("tenantName");
    const userArea = localStorage.getItem("city");
    const userName = localStorage.getItem("userName");
    const singleImage = localStorage.getItem("singleImage");

    const toggleDrawer = () => setOpen(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                `${CREATE_jwel}/api/Wholesal/GetOutStandingCustTransEntrydata`,
                {
                    params: { groupName: "CUSTOMER" },
                    headers: { tenantName },
                }
            );
            setData(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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

                <div style={{ padding: "5px", width: "90%", marginLeft: "auto", marginRight: "auto" }}>
                    <Row justify="center">
                        <h3 style={{ margin: "5px 0", color: "black" }}>
                            OUTSTANDING CUSTOMERS
                        </h3>
                    </Row>

                    {/* 🔽 SCROLLABLE CONTAINER */}
                    <div
                        style={{
                            maxHeight: "calc(100vh - 190px)",// adjust if header size changes
                            overflowY: "auto",
                            paddingRight: "4px",
                            marginTop: "8px",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                gap: "8px",
                            }}
                        >
                            {data.map((item, idx) => {
                                const pure = (item.pJama || 0) - (item.pNama || 0);
                                const cash = (item.cJama || 0) - (item.cNama || 0);

                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            background: "#f0eeeeff",
                                            borderRadius: "8px",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                            overflow: "hidden",
                                            minHeight: "70px",   // ⬆ increase height

                                        }}
                                    >
                                        {/* HEADER */}
                                        <div
                                            style={{
                                                backgroundColor: "#52bd91",
                                                padding: "6px 8px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontWeight: "bold",
                                                    fontSize: "13px",
                                                    color: "#0f100fff",
                                                }}
                                            >
                                                {item.lName}
                                            </span>
                                        </div>

                                        <hr
                                            style={{
                                                margin: 0,
                                                border: "none",
                                                borderTop: "1px solid #ddd",
                                            }}
                                        />

                                        {/* CONTENT */}
                                        <div style={{ padding: "12px" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                <span>
                                                    Fine:{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            fontSize: "12px",
                                                            color: "red",
                                                        }}
                                                    >
                                                        {Math.abs(pure).toFixed(3)}
                                                    </span>
                                                </span>

                                                <span>
                                                    Cash:{" "}
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            fontSize: "12px",
                                                            color: "red",
                                                        }}
                                                    >
                                                        {Math.abs(cash).toFixed(2)}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {!loading && data.length === 0 && (
                        <div style={{ textAlign: "center", marginTop: "10px" }}>
                            No records found
                        </div>
                    )}
                </div>
            </div>
        </Spin>
    );
}
export default Outstandings;
