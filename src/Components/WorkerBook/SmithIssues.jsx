import { Button, DatePicker, Input, message, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import SmithIssuePdfDownload from "./SmithIssuesPdfDownload";
import styles from "./smithtissues.module.css";

const { Option } = Select;

const SmithIssues = () => {
    /* ---------------- STATES ---------------- */
    const [voucherNo, setVoucherNo] = useState(1);
    const [voucherDate, setVoucherDate] = useState(dayjs());
    const [smith, setSmith] = useState(null);
    const [slipNo, setSlipNo] = useState(null);
    const [particulars, setParticulars] = useState(null);
    const [pcs, setPcs] = useState("");
    const [orderNo, setOrderNo] = useState("");
    const [name, setName] = useState("");
    const [issueWt, setIssueWt] = useState(0);
    const [description, setDescription] = useState("");
    const tenantName = localStorage.getItem("tenantName");
    const [issueItems, setIssueItems] = useState([]);
    const [dealerSmith, setDealerSmith] = useState([]);
    const [focusIndex, setFocusIndex] = useState(0);
    const toggleDrawer = () => setOpen(false);
    const [open, setOpen] = useState(false);
    const userArea = localStorage.getItem("city");
    const userName = localStorage.getItem("userName");
    const singleImage = localStorage.getItem("singleImage");

    const date = new Date();
    const billNoDate = new Date(
        dayjs(voucherDate).startOf("day").format("YYYY-MM-DD")
    ).toISOString();
    date.setUTCHours(0, 0, 0, 0);
    console.log(billNoDate, "date");

    const refs = useRef([]);
    const setRef = (i, el) => (refs.current[i] = el);

    const handleKeyDown = (e, i) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const next = refs.current[i + 1];
            if (next) next.focus();
            else document.getElementById("save-btn")?.click();
        }
    };

    const fetchVoucherNo = async () => {
        try {
            const res = await axios.get(
                `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable`,
                {
                    params: {
                        tableName: "WORKERTRANS",
                        column: "VNO",
                    },
                    headers: { tenantName },
                }
            );
            const maxNo = res.data?.[0]?.Column1 ?? 0;
            setVoucherNo(Number(maxNo) + 1);
        } catch (error) {
            message.error("Failed to fetch Voucher No");
            console.error(error);
        }
    };
    /* ---------------- INITIAL LOAD ---------------- */
    useEffect(() => {
        fetchVoucherNo();
    }, []);

    const fetchSlipNoBySmith = async (dealerName) => {
        try {
            // ❌ If smith or particulars missing → clear slip
            if (!dealerName) {
                setSlipNo(null);
                return;
            }

            // 1️⃣ Check if slip ALREADY EXISTS for smith + particulars
            const existingRes = await axios.get(
                `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere`,
                {
                    params: {
                        tableName: "WORKERTRANS",
                        where: `LNAME='${dealerName}'`,
                    },
                    headers: { tenantName },
                }
            );

            // ✅ SLIP EXISTS → USE THAT SLIP (NO MAX, NO +1)
            if (existingRes.data && existingRes.data.length > 0) {
                const existingSlipNo = Number(existingRes.data[0].SLIPNO);
                setSlipNo(existingSlipNo);
                return;
            }

            // 2️⃣ SLIP DOES NOT EXIST → GET GLOBAL MAX
            const globalRes = await axios.get(
                `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable`,
                {
                    params: {
                        tableName: "WORKERTRANS",
                        column: "SLIPNO",
                    },
                    headers: { tenantName },
                }
            );

            const globalMax = Number(globalRes.data?.[0]?.Column1 || 0);
            // ✅ NEW SLIP
            setSlipNo(globalMax + 1);

        } catch (error) {
            console.error(error);
            message.error("Failed to fetch Slip No");
            setSlipNo(null);
        }
    };

    useEffect(() => {
        if (smith) {
            fetchSlipNoBySmith(smith);
        } else {
            setSlipNo(null);
        }
    }, [smith]);

    /* ---------------- FETCH ISSUE ITEMS ---------------- */
    useEffect(() => {
        const fetchIssueItems = async () => {
            try {
                const res = await axios.get(
                    `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableName`,
                    {
                        params: { tableName: "ISSUEITEM_MASTER" },
                        headers: { tenantName },
                    }
                );
                setIssueItems(res.data || []);
            } catch {
                message.error("Failed to load particulars");
            }
        };
        fetchIssueItems();
    }, []);

    useEffect(() => {
        const fetchSmith = async () => {
            try {
                const res = await axios.get(
                    `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder?tableName=DEALER_MASTER&where=CUSTTYPE='WORKER'&order=DEALERNAME`,
                    {
                        headers: { tenantName },
                    }
                );
                setDealerSmith(res.data || []);
            } catch (error) {
                message.error("Failed to load Smith");
                console.error(error);
            }
        };

        fetchSmith();
    }, []);

    const getMainType = (particulars) => {
        if (!particulars) return "";

        const value = particulars.toUpperCase();

        if (value.includes("GOLD +")) return "92 GOLD";
        if (value.includes("STONE +")) return "STONE STOCK";

        return "";
    };
    const sType = (particulars) => {
        if (!particulars) return "";

        const value = particulars.toUpperCase();

        if (value.includes("GOLD +")) return "92 GOLD";
        if (value.includes("STONE +")) return "STONE STOCK";

        return "";
    };

    const getScode = (particulars) => {
        if (!particulars) return "";

        const value = particulars.toUpperCase();

        if (value.includes("GOLD +")) return 1;
        if (value.includes("STONE +")) return 2;

        return "";
    };
    const stoneWt = (particulars) => {
        if (!particulars) return 0;

        const value = particulars.toUpperCase();

        if (value.includes("STONE +")) {
            return Number(issueWt) || 0;
        }

        return 0;
    };

    console.log(stoneWt + "stone")

    const handleSave = async () => {
        try {
            // Validation
            if (!smith || !particulars) {
                message.warning("Smith and Particulars are required");
                return;
            }

            const payload = [
                {
                    slipno: Number(slipNo) || 0,
                    sdate: String(billNoDate),
                    sno: 0,
                    lname: String(smith),
                    det: String(particulars) || "",
                    partic: String(description) || "",
                    pcs: Number(pcs) || 0,
                    jama: 0,
                    nama: Number(issueWt) || 0,
                    clstatus: false,
                    entryno: Number(voucherNo),
                    stime: String(billNoDate),
                    stype: sType(particulars) || "92 GOLD",
                    maintype: getMainType(String(particulars)) || "",
                    scode: getScode(particulars) || 0,
                    prefix: "916",
                    wastper: 0,
                    closestatus: false,
                    branchcode: "-",
                    branchname: "-",
                    reC_SWT: 0,
                    reC_NWT: 0,
                    recwastper: 0,
                    recwastage: 0,
                    recwt: 0,
                    isS_SWT: stoneWt(particulars) || 0,
                    vtype: "SMITH ISSUE",
                    vno: Number(voucherNo),
                    ordno: Number(orderNo) || 0,
                    custname: String(name) || "",
                    status: false,
                },
            ];

            console.log("POST PAYLOAD 👉", payload);

            await axios.post(
                `${CREATE_jwel}/api/Erp/InsertWorkerTrans`,
                payload,
                { headers: { tenantName } }
            );

            message.success("Smith Issue Saved Successfully ✅");

            handleCancel();
            fetchVoucherNo();

        } catch (error) {
            console.error("POST ERROR ❌", error.response || error);
            message.error("Failed to save Smith Issue ❌");
        }
    };

    const handleCancel = () => window.location.reload();

    return (

        <div>
            <Header setOpen={setOpen} />
            <SidebarDrawer
                open={open}
                toggleDrawer={toggleDrawer}
                singleImage={singleImage}
                userArea={userArea}
                userName={userName}
            />
            <div className={styles.container}>
                {/* Header */}
                <div
                    className={styles.invBox}
                >
                    <div className={styles.vocContainer}>
                        <label className={styles.invno}>VOUCHER</label>
                    </div>

                    {/* <div className={styles.dateContainer}>
                            <span className={styles.voucherNo}>
                                {voucherNo}
                            </span>
                        </div> */}

                    <div className={styles.dateContainer}>
                        <div className={styles.vocCont}>
                            <div className={styles.no}>INVNO</div>
                            <span className={styles.vocNo}>
                                {voucherNo}
                            </span>
                        </div>
                        <DatePicker
                            data-focus
                            value={voucherDate}
                            format="DD/MM/YYYY"
                            onChange={setVoucherDate}
                            className={styles.datePicker}
                        // onKeyDown={(e) => handleKeyDown(e, 1)}
                        />
                    </div>
                </div>
                {/* Body */}
                <div
                    className={styles.body}
                >
                    {/* Smith / Slip / New Slip */}
                    <div className={styles.topRow}>
                        <div className={styles.row1}>
                            <div className={styles.row3}>
                                <span className={styles.smithLabel}>Smith</span>
                                <span>
                                    <Select
                                        className={styles.partySelect}
                                        ref={(el) => setRef(0, el)}
                                        value={smith}
                                        onChange={(value) => {
                                            setSmith(value);

                                            // 👉 MOVE TO PARTICULARS
                                            setTimeout(() => {
                                                refs.current[1]?.rcSelect?.inputRef?.focus();
                                            }, 0);
                                        }}
                                        allowClear
                                        showSearch
                                        placeholder="Select Smith"
                                    >
                                        {dealerSmith.map((item, idx) => (
                                            <Option key={idx} value={item.Dealername}>
                                                {item.Dealername}
                                            </Option>
                                        ))}
                                    </Select>
                                </span>
                            </div>
                            {/* <div className={styles.row4}>
                                <label className={styles.slipLabel}>Slip No</label>
                                <Input
                                    // data-focus
                                    className={styles.slipInput}
                                    value={slipNo}
                                    readOnly
                                // onChange={setSlipNo}
                                // onInputKeyDown={(e) => handleKeyDown(e, 3)}
                                />
                            </div> */}
                        </div>

                        <Button className={styles.cancleButton} onClick={handleCancel}>
                            Reset
                        </Button>

                        {/* <button
                        style={{
                            height: "40px",
                            backgroundColor: "rgba(239,236,236,0.6)",
                            borderRadius: "8px",
                            border: "none",
                            padding: "0 15px",
                        }}
                    >
                        New Slip
                    </button> */}
                    </div >
                    {/* Particulars */}
                    <div className={styles.devCont}>
                        <div className={styles.rowMain}>
                            <div className={styles.row}>
                                <label className={styles.lableatyle}>Particulars</label>
                                <Select
                                    className={styles.particularSelect}
                                    ref={(el) => setRef(1, el)}
                                    // style={{ width: 240, textAlign: "center" }}
                                    value={particulars}
                                    onChange={(value) => {
                                        setParticulars(value);

                                        // 👉 MOVE TO PCS INPUT
                                        setTimeout(() => {
                                            refs.current[2]?.focus();
                                        }, 0);
                                    }}
                                    showSearch
                                    allowClear
                                    placeholder="Select Particulars"
                                >
                                    {issueItems.map((item, idx) => (
                                        <Option key={idx} value={item.ISSUEITEM}>
                                            {item.ISSUEITEM}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            <div className={styles.row} >
                                <label className={styles.label} >Pcs</label>
                                <Input
                                    ref={(el) => setRef(2, el)}
                                    // style={{ width: 120, textAlign: "center" }}
                                    value={pcs}
                                    onChange={(e) => setPcs(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    inputMode="decimal"
                                    onFocus={(e) => e.target.select()}
                                    className={styles.inputValue}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Order No</label>
                                <Input
                                    // style={{ width: 200, textAlign: "center" }}
                                    data-focus
                                    value={orderNo}
                                    onChange={(e) => setOrderNo(e.target.value)}
                                    ref={(el) => setRef(3, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 3)}
                                    inputMode="decimal"
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                    className={styles.inputValue}
                                // onKeyDown={(e) => handleKeyDown(e, 6)}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Name</label>
                                <Input
                                    // style={{ width: 200, textAlign: "center" }}
                                    data-focus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    ref={(el) => setRef(4, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 4)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                    className={styles.inputValue}
                                // onKeyDown={(e) => handleKeyDown(e, 7)}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Issue Wt</label>
                                <Input
                                    // style={{ width: 200, textAlign: "center" }}
                                    data-focus
                                    value={issueWt}
                                    onChange={(e) => setIssueWt(e.target.value)}
                                    ref={(el) => setRef(5, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 5)}
                                    inputMode="decimal"
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                    className={styles.inputValue}
                                // onKeyDown={(e) => handleKeyDown(e, 8)}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label}>Description</label>
                                <Input
                                    // style={{ width: 240, textAlign: "center" }}
                                    data-focus
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    ref={(el) => setRef(6, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 6)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                    className={styles.inputValue}
                                // onKeyDown={(e) => handleKeyDown(e, 9)}
                                />
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <Button
                                data-focus
                                className={styles.saveBtn}
                                // onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <SmithIssuePdfDownload
                                voucherNo={voucherNo}
                                voucherDate={voucherDate}
                                smith={smith}
                                slipNo={slipNo}
                                particulars={particulars}
                                pcs={pcs}
                                orderNo={orderNo}
                                name={name}
                                issueWt={issueWt}
                                description={description}
                            />
                        </div>
                    </div>
                    {/* Footer */}
                </div>
            </div>
        </div>
    );
};

export default SmithIssues;
