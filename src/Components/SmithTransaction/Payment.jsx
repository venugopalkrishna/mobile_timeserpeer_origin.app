import React, { useState } from "react";
import { Input, Button, message } from "antd";
import axios from "axios";
import styles from "./voucher.module.css";
import { CREATE_jwel } from "../../Config/Config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

const PaymentEntry = ({ vNo, selectedParty, selectedDate, refreshVno, billNoAPI, resetparty }) => {

    const [weight, setWeight] = useState("");
    const [touch, setTouch] = useState("");
    const [paidMetal, setPaidMetal] = useState("");
    const [paidCash, setPaidCash] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const tenantName = localStorage.getItem("tenantName");
    const branchname = localStorage.getItem("city");
    const dealername = localStorage.getItem("userName");

    const date = new Date();
    const billNoDate = new Date(
        dayjs(selectedDate).startOf("day").format("YYYY-MM-DD")
    ).toISOString();
    date.setUTCHours(0, 0, 0, 0);
    console.log(billNoDate, "date");
    /* -------- API URL -------- */
    const API_URL = `${CREATE_jwel}/api/Wholesal/InsertTransEntryData`; // 🔴 change api name
    /* -------- SAVE HANDLER -------- */
    const handleSave = async (vn, billNo) => {
        const metal = Number(paidMetal);
        const cash = Number(paidCash);

        if (metal <= 0 && cash <= 0) {
            message.warning("Enter Paid Metal or Paid Cash");
            return;
        }

        if (!selectedParty) {
            message.warning("Select Party Name");
            return;
        }
        try {
            setLoading(true);
            const payload = [];
            /* ========= 1️⃣ COMMON ENTRY (ALWAYS) ========= */
            payload.push({
                sdate: selectedDate ? billNoDate : date.toISOString(),
                entryno: vn,
                groupname: "CUSTOMER",
                lname: selectedParty,
                particulars: selectedParty,
                gjama: 0,
                gnama: Number(weight) || 0,
                touch: Number(touch) || 0,
                pjama: 0,
                pnama: Number(paidMetal) || 0,
                cjama: 0,
                cnama: Number(paidCash) || 0,
                vno: billNo,
                vtype: "CUSTOMER",
                stype: "RECEPIT",
                cuT_METAL: 0,
                cuT_TOUCH: 0,
                cuT_FINE: 0,
                rate: 0,
                cuT_AMOUNT: 0,
                vaT_PER: 0,
                vaT_AMOUNT: 0,
                cuT_NETAMOUNT: 0,
                jstonewt: 0,
                jnwt: Number(paidMetal) || 0,
                jamount: 0,
                nstonewt: 0,
                nnwt: 0,
                namount: 0,
                tranS_TYPE: "PAYMENT",
                maintype: "BULLION STOCK",
                scode: 1,
                narration: description,
                branchname: "-",
                branchcode: "-",
                dealername: "_",
                paytype: "-",
                sno: billNo,
                invno: String(billNo)
            });
            /* ========= 2️⃣ CASH ENTRY (IF CASH > 0) ========= */
            if (Number(paidCash) > 0) {
                payload.push({
                    sdate: selectedDate ? billNoDate : date.toISOString(),
                    entryno: vn,
                    groupname: "CASH BOOK",
                    lname: "CASH BOOK",
                    particulars: selectedParty,
                    gjama: 0,
                    gnama: 0,
                    touch: 0,
                    pjama: 0,
                    pnama: 0,
                    cjama: 0,
                    cnama: Number(paidCash) || 0,
                    vno: billNo,
                    vtype: "CUSTOMER",
                    stype: "CASH BOOK",
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
                    nstonewt: 0,
                    nnwt: 0,
                    namount: 0,
                    tranS_TYPE: "PAYMENT",
                    maintype: "CASH BOOK",
                    scode: 0,
                    narration: description,
                    branchname: "-",
                    branchcode: "-",
                    dealername: "-",
                    paytype: "-",
                    sno: billNo,
                    invno: String(billNo)
                });
            }
            /* ========= 3️⃣ METAL ENTRY (IF METAL > 0) ========= */
            if (Number(paidMetal) > 0) {
                payload.push({
                    sdate: selectedDate ? billNoDate : date.toISOString(),
                    entryno: vn,
                    groupname: "BULLION GOLD",
                    lname: "BULLION GOLD",
                    particulars: selectedParty,
                    gjama: 0,
                    gnama: Number(weight) || 0,
                    touch: Number(touch) ?? 0,
                    pjama: 0,
                    pnama: Number(paidMetal) ?? 0,
                    cjama: 0,
                    cnama: 0,
                    vno: billNo,
                    vtype: "CUSTOMER",
                    stype: "BULLION GOLD",
                    cuT_METAL: 0,
                    cuT_TOUCH: 0,
                    cuT_FINE: 0,
                    rate: 0,
                    cuT_AMOUNT: 0,
                    vaT_PER: 0,
                    vaT_AMOUNT: 0,
                    cuT_NETAMOUNT: 0,
                    jstonewt: 0,
                    jnwt: Number(paidMetal) || 0,
                    jamount: 0,
                    nstonewt: 0,
                    nnwt: 0,
                    namount: 0,
                    tranS_TYPE: "PAYMENT",
                    maintype: "BULLION GOLD",
                    scode: 1,
                    narration: description,
                    branchname: "_",
                    branchcode: "-",
                    dealername: "-",
                    paytype: "-",
                    sno: billNo,
                    invno: String(billNo)
                });
            }
            /* -------- API CALL -------- */
            await axios.post(
                API_URL,
                payload,          // ✅ SEND ARRAY DIRECTLY
                {
                    headers: {
                        "Content-Type": "application/json",
                        tenantName: tenantName
                    }
                }
            );
            message.success("Entry saved successfully");
            refreshVno();
            billNoAPI();
            /* -------- RESET -------- */
            setWeight("");
            setTouch("");
            setPaidMetal("");
            setPaidCash("");
            setDescription("");
            resetparty?.();

        } catch (error) {
            console.error(error);
            message.error("Failed to save receipt");
        } finally {
            setLoading(false);
        }
    };

    // allow only numbers up to 3 digits
    const threeDigitOnly = (value) => {
        if (/^\d*\.?\d{0,3}$/.test(value)) {
            return value;
        }
        return null;
    };

    // calculate paid metal
    const calculatePaidMetal = (w, t) => {
        if (!w || !t) return "";
        return ((Number(w) * Number(t)) / 100).toFixed(3);
    };

    const handelReset = () => {
        setPaidCash("");
        setPaidMetal("");
        setTouch("");
        setWeight("");
        setDescription("");
        refreshVno();
        billNoAPI();
    }

    return (
        <>
            <div className={styles.receiptCentered}>
                <span className={styles.receiptTitle}>RECEIPT ENTRY</span>
            </div>
            <div className={styles.metalCashContainer}>
                {/* METAL */}
                <div className={styles.boxYellow}>
                    <strong>Metal Payment</strong>
                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Weight</label>
                        <Input
                            className={styles.inputField}
                            placeholder="Weight"
                            inputMode="decimal"
                            value={weight}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const val = threeDigitOnly(e.target.value);
                                if (val === null) return;

                                setWeight(val);

                                // auto set touch to 100 if empty
                                const newTouch = touch || "100";
                                setTouch(newTouch);

                                setPaidMetal(calculatePaidMetal(val, newTouch));
                            }}
                        />
                    </div>
                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Touch(%)</label>
                        <Input
                            className={styles.inputField}
                            placeholder="Touch"
                            inputMode="decimal"
                            value={touch}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const val = threeDigitOnly(e.target.value);
                                if (val === null) return;

                                setTouch(val);
                                setPaidMetal(calculatePaidMetal(weight, val));
                            }}
                        />
                    </div>
                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Paid Metal</label>
                        <Input
                            className={styles.inputField}
                            placeholder="Paid Metal"
                            inputMode="decimal"
                            value={paidMetal}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const val = threeDigitOnly(e.target.value);
                                if (val === null) return;
                                setPaidMetal(val);
                            }}
                        />
                    </div>
                </div>
                {/* CASH */}
                <div className={styles.boxBlue}>
                    <strong>Cash Payment</strong>
                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Paid Cash</label>
                        <Input
                            className={styles.inputField}
                            placeholder="Paid Cash"
                            inputMode="decimal"
                            value={paidCash}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const val = threeDigitOnly(e.target.value);
                                if (val === null) return;
                                setPaidCash(val);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.descriptionRow}>
                <label className={styles.rowLabel}>Description :</label>
                <Input.TextArea
                    rows={1}
                    className={styles.descriptionTextArea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className={styles.footerBar}>
                <div className={styles.balancesModule}>
                    <div className={styles.footerFields}>
                        <label>Metal Balance</label>
                        <span>:</span>
                        <span className={styles.values}>0</span>
                    </div>
                    <div className={styles.footerFields}>
                        <label>Cash Balance</label>
                        <span>:</span>
                        <span className={styles.values}>0</span>
                    </div>
                </div>
                <div className={styles.footerButtons}>
                    <Button
                        className={styles.saveBtn}
                        type="primary"
                        loading={loading}
                        onClick={async () => {
                            // if (!vNo) return;
                            const vno = await refreshVno();
                            const billNo = await billNoAPI();
                            await handleSave(vno, billNo);
                        }}
                    >
                        SAVE
                    </Button>
                    <Button danger className={styles.cancelBtn} onClick={handelReset}>CANCEL</Button>
                </div>
            </div>
        </>
    );
};

export default PaymentEntry;
