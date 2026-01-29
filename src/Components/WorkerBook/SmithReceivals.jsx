import { Button, Input, Select, DatePicker, message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { CREATE_jwel } from "../../Config/Config";
import styles from "./smithreceivals.module.css";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import SmithReceivalsprint from "./SmithReceivalsPdf"

const { Option } = Select;

const SmithReceivals = () => {
    const tenantName = localStorage.getItem("tenantName");
    const [showPrint, setShowPrint] = useState(false);


    /* ---------------- STATES ---------------- */
    const [voucherNo, setVoucherNo] = useState(1);
    const [voucherDate, setVoucherDate] = useState(dayjs());
    const [smith, setSmith] = useState(null);
    const [slipNo, setSlipNo] = useState("");
    const [particulars, setParticulars] = useState(null);

    const [pcs, setPcs] = useState(0);
    const [netWt, setNetWt] = useState(0);
    const [stoneWt, setStoneWt] = useState(0);
    const [wast, setWast] = useState(0);
    const [wastWt, setWastWt] = useState(0);
    const [recWt, setRecWt] = useState(0);
    const [recWeight, setRecWeight] = useState(0);
    const [orderNo, setOrderNo] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [issueItems, setIssueItems] = useState([]);
    const [dealerSmith, setDealerSmith] = useState([]);
    const [open, setOpen] = useState(false);

    const userArea = localStorage.getItem("city");
    const userName = localStorage.getItem("userName");
    const singleImage = localStorage.getItem("singleImage");
    const toggleDrawer = () => setOpen(false);

    /* ---------------- REFS ---------------- */
    const refs = useRef([]);
    const setRef = (i, el) => (refs.current[i] = el);

    const date = new Date();
    const billNoDate = new Date(
        dayjs(voucherDate).startOf("day").format("YYYY-MM-DD")
    ).toISOString();
    date.setUTCHours(0, 0, 0, 0);
    console.log(billNoDate, "date");

    const handleKeyDown = (e, i) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (refs.current[i + 1]) {
                refs.current[i + 1].focus();
            }
            // else do nothing (NO SAVE)
        }
    };

    // ---------- DECIMAL HANDLER ----------
    const handleDecimalChange = (value, setter, decimals = 3) => {
        if (value === "") {
            setter("");
            return;
        }
        const regex = new RegExp(`^\\d*\\.?\\d{0,${decimals}}$`);
        if (regex.test(value)) {
            setter(value);
        }
    };

    // NetWt = RecWt - StoneWt
    useEffect(() => {
        const r = parseFloat(recWt) || 0;
        const s = parseFloat(stoneWt) || 0;
        const n = r - s;
        setNetWt(n >= 0 ? n.toFixed(3) : "0");
    }, [recWt, stoneWt]);

    // WastageWt = NetWt * Wast% / 100
    useEffect(() => {
        const n = parseFloat(netWt) || 0;
        const w = parseFloat(wast) || 0;
        const ww = (n * w) / 100;
        setWastWt(ww >= 0 ? ww.toFixed(3) : "0");
    }, [netWt, wast]);

    // RecWeight (Final)
    useEffect(() => {
        const n = parseFloat(netWt) || 0;
        const w = parseFloat(wastWt) || 0;
        const total = n + w;
        setRecWeight(total >= 0 ? total.toFixed(3) : "0");
    }, [netWt, wastWt]);

    /* ---------------- FETCH VOUCHER NO ---------------- */
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

    useEffect(() => {
        fetchVoucherNo();
    }, []);

    /* ---------------- FETCH SLIP NO ---------------- */
    useEffect(() => {
        const fetchSlipNoBySmith = async () => {
            if (!smith) {
                setSlipNo("");
                return;
            }

            try {
                const res = await axios.get(
                    `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere`,
                    {
                        params: {
                            tableName: "WORKERTRANS",
                            where: `LNAME='${smith}'`,
                        },
                        headers: { tenantName },
                    }
                );

                const data = res.data ?? [];
                setSlipNo(data.length ? data[data.length - 1].SLIPNO : "");
            } catch {
                message.error("Failed to fetch Slip No");
                setSlipNo("");
            }
        };

        fetchSlipNoBySmith();
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

    /* ---------------- FETCH SMITH ---------------- */
    useEffect(() => {
        const fetchSmith = async () => {
            try {
                const res = await axios.get(
                    `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder?tableName=DEALER_MASTER&where=CUSTTYPE='WORKER'&order=DEALERNAME`,
                    { headers: { tenantName } }
                );
                setDealerSmith(res.data || []);
            } catch {
                message.error("Failed to load Smith");
            }
        };
        fetchSmith();
    }, []);

    /* ---------------- RESET ---------------- */
    const handleCancel = () => {
        setVoucherDate(dayjs());
        setSmith(null);
        setSlipNo("");
        setParticulars(null);
        setName("");
        setNetWt(null);
        setOrderNo(null);
        setPcs(null);
        setRecWeight(null);
        setRecWt(null);
        setStoneWt(null);
        setWast(null);
        setWastWt(null);

        setTimeout(() => refs.current[0]?.focus(), 0);
    };

    const getMainType = (particulars) => {
        if (!particulars) return "";

        const value = particulars.toUpperCase();

        if (value.includes("GOLD +")) return "92 GOLD";
        if (value.includes("STONE -")) return "ORNAMENT STOCK";

        return "";
    };

    const getScode = (particulars) => {
        if (!particulars) return "";

        const value = particulars.toUpperCase();

        if (value.includes("GOLD +")) return 3;
        if (value.includes("STONE -")) return 4;

        return "";
    };

    const sCode = (particulars) => {
        if (!particulars) return "";

        const value = particulars.toUpperCase();

        if (value.includes("ITEM JAMA -")) return "NEW ORNAMENT";

        return "";
    };

    const handleSave = async () => {
        try {
            // Validation (minimal & safe)
            if (!smith || !particulars) {
                message.warning("Smith and Particulars are required");
                return;
            }

            const payload = [
                {
                    slipno: Number(slipNo),
                    sdate: String(voucherDate) ? billNoDate : date.toISOString(),
                    sno: 1,
                    lname: String(smith),
                    det: String(particulars) || "",
                    partic: String(description),
                    pcs: Number(pcs) || 0,
                    jama: Number(recWeight) || 0,
                    nama: 0,
                    clstatus: false,
                    entryno: Number(voucherNo),
                    stime: String(voucherDate) ? billNoDate : date.toISOString(),
                    stype: sCode(String(particulars)) ?? "92 GOLD",
                    maintype: getMainType(String(particulars)),
                    scode: getScode(Number(particulars)) || 0,
                    prefix: "916",
                    wastper: Number(wast) || 0,
                    closestatus: false,
                    branchcode: "-",
                    branchname: "-",
                    reC_SWT: Number(stoneWt) || 0,
                    reC_NWT: Number(netWt) || 0,
                    recwastper: Number(wast) || 0,
                    recwastage: Number(wastWt) || 0,
                    recwt: Number(recWt) || 0,
                    isS_SWT: 0,
                    vtype: "SMITH RECEIVALS",
                    vno: Number(voucherNo),
                    ordno: Number(orderNo) || 0,
                    custname: String(name) || "",
                    status: false,
                },
            ];
            await axios.post(
                `${CREATE_jwel}/api/Erp/InsertWorkerTrans`,
                payload,
                { headers: { tenantName } }
            );

            message.success("Smith Recevial Saved Successfully ✅");

            // Reset safely
            handleCancel();
            fetchVoucherNo();

        } catch (error) {
            console.error(error);
            message.error("Failed to save Smith Receival ❌");
        }
    };

    return (
        <div className={styles.devContainer}>
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
                <div className={styles.invBox}>
                    <div className={styles.vocContainer}>
                        <label className={styles.invno}>VOUCHER</label>
                    </div>

                    <div className={styles.dateContainer}>
                        <div className={styles.vocCont}>
                            <div className={styles.no}>INVNO</div>
                            <span className={styles.vocNo}>{voucherNo}</span>
                        </div>
                        <DatePicker
                            className={styles.datePicker}
                            value={voucherDate}
                            format="DD/MM/YYYY"
                            onChange={setVoucherDate}
                            ref={(el) => setRef(0, el?.input)}
                            onKeyDown={(e) => handleKeyDown(e, 0)}
                        // className={styles.dateCont}
                        />
                    </div>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    {/* Smith */}
                    <div className={styles.rowCenter2}>
                        <div className={styles.rowCenter}>
                            <div className={styles.row3}>
                                <span className={styles.smallLabel}>Smith</span>
                                <span>
                                    <Select
                                        className={styles.partySelect}
                                        value={smith}
                                        showSearch
                                        allowClear
                                        onChange={(value) => {
                                            setSmith(value);

                                            // 👉 move cursor to Particulars
                                            setTimeout(() => {
                                                refs.current[3]?.rcSelect?.inputRef?.focus();
                                            }, 0);
                                        }}

                                        ref={(el) => setRef(1, el)}
                                        onKeyDown={(e) => handleKeyDown(e, 1)}
                                        placeholder="Select Smith"
                                    >
                                        {dealerSmith.map((d, i) => (
                                            <Option key={i} value={d.Dealername} className={styles.options}>
                                                {d.Dealername}

                                            </Option>
                                        ))}
                                    </Select>
                                </span>
                            </div>

                            {/* <div className={styles.row4}>
                                <label className={styles.smallLabel}>Slip No</label>
                                <Input
                                    className={styles.slipInput}
                                    value={slipNo}
                                    readOnly
                                    ref={(el) => setRef(2, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                />
                            </div> */}

                        </div>
                        <Button className={styles.cancleButton} onClick={handleCancel}>
                            Reset
                        </Button>
                    </div>
                    <div className={styles.devCont}>
                        <div className={styles.rowMain}>

                            {/* Particulars */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Particulars</label>
                                <Select
                                    className={styles.select300}
                                    value={particulars}
                                    onChange={(value) => {
                                        setParticulars(value);

                                        // 👉 move cursor to PCS
                                        setTimeout(() => {
                                            refs.current[4]?.focus();
                                        }, 0);
                                    }}

                                    ref={(el) => setRef(3, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 3)}
                                    showSearch
                                    allowClear
                                    placeholder="Select Particulars"
                                >
                                    {issueItems.map((it, i) => (
                                        <Option key={i} value={it.ISSUEITEM}>
                                            {it.ISSUEITEM}
                                        </Option>
                                    ))}
                                </Select>
                            </div>

                            {/* Pcs */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Pcs</label>
                                <Input
                                    className={`${styles.input} ${styles.pcs}`}
                                    value={pcs}
                                    onChange={(e) => handleDecimalChange(e.target.value, setPcs, 0)}
                                    ref={(el) => setRef(4, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 4)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Rec Wt */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Rec Wt</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={recWt}
                                    onChange={(e) => handleDecimalChange(e.target.value, setRecWt)}
                                    ref={(el) => setRef(5, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 5)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Stone Wt */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Stone Wt</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={stoneWt}
                                    onChange={(e) => handleDecimalChange(e.target.value, setStoneWt)}
                                    ref={(el) => setRef(6, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 6)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Net Wt */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Net Wt</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={netWt}
                                    onChange={(e) => setNetWt(e.target.value)}
                                    ref={(el) => setRef(7, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 7)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Wast (%) */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Wast (%)</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={wast}
                                    onChange={(e) => handleDecimalChange(e.target.value, setWast)}
                                    ref={(el) => setRef(8, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 8)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Wastage Wt */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Wastage Wt</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={wastWt}
                                    onChange={(e) => setWastWt(e.target.value)}
                                    ref={(el) => setRef(9, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 9)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Rec Weight */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Rec Weight</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={recWeight}
                                    onChange={(e) => setRecWeight(e.target.value)}
                                    ref={(el) => setRef(10, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 10)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Order No */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Order No</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={orderNo}
                                    onChange={(e) => setOrderNo(e.target.value)}
                                    ref={(el) => setRef(11, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 11)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Name */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Name</label>
                                <Input
                                    className={`${styles.input} ${styles.normal}`}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    ref={(el) => setRef(12, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 12)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div className={styles.row}>
                                <label className={styles.label120}>Description</label>
                                <Input
                                    className={`${styles.input} ${styles.desc}`}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    ref={(el) => setRef(13, el)}
                                    onKeyDown={(e) => handleKeyDown(e, 13)}
                                    onFocus={(e) => {
                                        e.target.select();
                                    }}
                                />
                            </div>

                            {/* Footer */}

                        </div>
                        <div className={styles.footer}>
                            <Button
                                id="save-btn"
                                type="primary"
                                className={styles.saveBtn}
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                            <SmithReceivalsprint
                                voucherNo={voucherNo}
                                voucherDate={voucherDate}
                                smith={smith}
                                slipNo={slipNo}
                                particulars={particulars}
                                pcs={pcs}
                                recWt={recWt}
                                stoneWt={stoneWt}
                                netWt={netWt}
                                wast={wast}
                                wastWt={wastWt}
                                recWeight={recWeight}
                                orderNo={orderNo}
                                name={name}
                                description={description}
                            />

                            {/* <Button
                            type="primary"
                            className={styles.print}
                            onClick={() => setShowPrint(true)}
                        >
                            Print
                        </Button> */}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SmithReceivals;
