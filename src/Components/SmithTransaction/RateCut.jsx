import React, { useState } from "react";
import { Input, Checkbox, Button, message } from "antd";
import axios from "axios";
import styles from "./voucher.module.css";
import { CREATE_jwel } from "../../Config/Config";
import dayjs from "dayjs";

const RateCutEntry = ({ vNo, selectedParty, selectedDate, refreshVno, resetparty }) => {

    /* -------- STATES -------- */
    const [selectedType, setSelectedType] = useState("");
    const [rateValue, setRateValue] = useState("");

    // Metal → Cash
    const [metalValue, setMetalValue] = useState("");
    const [cashValue, setCashValue] = useState("");

    // Cash → Metal
    const [cashValue2, setCashValue2] = useState("");
    const [metalValue2, setMetalValue2] = useState("");

    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const tenantName = localStorage.getItem("tenantName");
    const API_URL = `${CREATE_jwel}/api/Wholesal/InsertTransEntryData`;

    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);

    const billNoDate = new Date(
        dayjs(selectedDate).startOf("day").format("YYYY-MM-DD")
    ).toISOString();

    /* -------- CHECKBOX HANDLER -------- */
    const handleCheck = (type) => {
        if (!rateValue || Number(rateValue) <= 0) {
            message.warning("Enter valid Rate first");
            return;
        }

        setSelectedType(type);

        // Clear opposite side values
        setMetalValue("");
        setCashValue("");
        setCashValue2("");
        setMetalValue2("");
    };

    /* -------- AUTO CALCULATIONS -------- */

    // Metal → Cash
    const handleMetalChange = (val) => {
        setMetalValue(val);

        if (val && rateValue) {
            const cash = Number(val) * Number(rateValue);
            setCashValue(cash.toFixed(2));
        } else {
            setCashValue("");
        }
    };

    // Metal → Cash (Cash edited)
    const handleCashChange = (val) => {
        setCashValue(val);

        if (val && rateValue) {
            const metal = Number(val) / Number(rateValue);
            setMetalValue(metal.toFixed(3));
        } else {
            setMetalValue("");
        }
    };

    // Cash → Metal (Cash entered)
    const handleCashChange2 = (val) => {
        setCashValue2(val);

        if (val && rateValue) {
            const metal = Number(val) / Number(rateValue);
            setMetalValue2(metal.toFixed(3));
        } else {
            setMetalValue2("");
        }
    };

    // Cash → Metal (Metal edited)
    const handleMetalChange2 = (val) => {
        setMetalValue2(val);

        if (val && rateValue) {
            const cash = Number(val) * Number(rateValue);
            setCashValue2(cash.toFixed(2));
        } else {
            setCashValue2("");
        }
    };

    /* -------- SAVE HANDLER -------- */
    const handleSave = async (vn) => {

        if (!rateValue || Number(rateValue) <= 0) {
            message.warning("Rate is required");
            return;
        }

        if (!selectedType) {
            message.warning("Select Metal to Cash or Cash to Metal");
            return;
        }

        const payload = [];
        /* ===== METAL → CASH ===== */
        if (selectedType === "metalToCash") {

            if (!metalValue || Number(metalValue) <= 0) {
                message.warning("Enter Metal value");
                return;
            }

            payload.push({
                sdate: selectedDate ? billNoDate : date.toISOString(),
                entryno: vn,
                groupname: "CUSTOMER",
                lname: selectedParty,
                particulars: `RATE CUT ${metalValue} × ${rateValue} (Metal To Cash)`,
                gjama: Number(metalValue),
                gnama: 0,
                touch: 100,
                pjama: Number(metalValue),
                pnama: 0,
                cjama: 0,
                cnama: Number(cashValue),
                vno: vn,
                vtype: "CUSTOMER",
                stype: "RATE CUT",
                cuT_METAL: Number(metalValue),
                cuT_TOUCH: 100,
                cuT_FINE: Number(metalValue),
                rate: Number(rateValue),
                cuT_AMOUNT: Number(cashValue),
                vaT_PER: 0,
                vaT_AMOUNT: 0,
                cuT_NETAMOUNT: Number(cashValue),
                jstonewt: 0,
                jnwt: 0,
                jamount: 0,
                nstonewt: 0,
                nnwt: 0,
                namount: 0,
                tranS_TYPE: "RECEPIT",
                maintype: "-",
                scode: 0,
                narration: description,
                branchname: "-",
                branchcode: "-",
                dealername: "-",
                paytype: "-",
                sno: vn,
                invno: String(vn)
            });
        }
        /* ===== CASH → METAL ===== */
        if (selectedType === "cashToMetal") {

            if (!cashValue2 || Number(cashValue2) <= 0) {
                message.warning("Enter Cash value");
                return;
            }

            payload.push({
                sdate: selectedDate ? billNoDate : date.toISOString(),
                entryno: vn,
                groupname: "CUSTOMER",
                lname: selectedParty,
                particulars: `RATE CUT ${cashValue2} ÷ ${rateValue} (Cash To Metal)`,
                gjama: 0,
                gnama: Number(metalValue2),
                touch: 0,
                pjama: 0,
                pnama: Number(metalValue2),
                cjama: Number(cashValue2),
                cnama: 0,
                vno: vn,
                vtype: "CUSTOMER",
                stype: "RATE CUT",
                cuT_METAL: 0,
                cuT_TOUCH: 0,
                cuT_FINE: 0,
                rate: Number(rateValue),
                cuT_AMOUNT: Number(cashValue2),
                vaT_PER: 0,
                vaT_AMOUNT: 0,
                cuT_NETAMOUNT: Number(cashValue2),
                jstonewt: 0,
                jnwt: 0,
                jamount: 0,
                nstonewt: 0,
                nnwt: 0,
                namount: 0,
                tranS_TYPE: "RECEPIT",
                maintype: "-",
                scode: 0,
                narration: description,
                branchname: "-",
                branchcode: "-",
                dealername: "-",
                paytype: "-",
                sno: vn,
                invno: String(vn)
            });
        }

        try {
            setLoading(true);

            await axios.post(API_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                    tenantName
                }
            });

            message.success("Rate Cut Entry Saved");
            /* -------- RESET -------- */
            setSelectedType("");
            setRateValue("");
            setMetalValue("");
            setCashValue("");
            setCashValue2("");
            setMetalValue2("");
            setDescription("");
            resetparty?.();

        } catch (err) {
            console.error(err);
            message.error("Failed to save Rate Cut");
        } finally {
            setLoading(false);
        }
    };

    const threeDigitOnly = (value) => {
        if (/^\d*\.?\d{0,3}$/.test(value)) {
            return value;
        }
        return null;
    };

    return (
        <>
            <div className={styles.rateHeader}>
                <label className={styles.boldLabel}>RATE CUT</label>
            </div>
            <div className={styles.rateContainer}>
                <label className={styles.rateLabel}>Rate</label>
                <Input
                    placeholder="Rate"
                    inputMode="decimal"
                    value={rateValue}
                    onFocus={(e) => {
                        e.target.select();
                    }}
                    onChange={(e) => setRateValue(e.target.value)}
                />
            </div>

            <div className={styles.metalCashContainer}>
                {/* METAL TO CASH */}
                <div className={styles.boxYellow}>
                    <Checkbox
                        checked={selectedType === "metalToCash"}
                        disabled={!rateValue}
                        onChange={() => handleCheck("metalToCash")}
                    >
                        METAL TO CASH
                    </Checkbox>

                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Metal</label>
                        <Input
                            disabled={selectedType !== "metalToCash"}
                            value={metalValue}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => handleMetalChange(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Cash</label>
                        <Input
                            disabled={selectedType !== "metalToCash"}
                            value={cashValue}
                            onFocus={(e) => {
                                e.target.select();
                            }} onChange={(e) => handleCashChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* CASH TO METAL */}
                <div className={styles.boxBlue}>
                    <Checkbox
                        checked={selectedType === "cashToMetal"}
                        disabled={!rateValue}
                        onChange={() => handleCheck("cashToMetal")}
                    >
                        CASH TO METAL
                    </Checkbox>

                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Cash</label>
                        <Input
                            disabled={selectedType !== "cashToMetal"}
                            value={cashValue2}
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => handleCashChange2(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <label className={styles.rowLabel}>Metal</label>
                        <Input
                            disabled={selectedType !== "cashToMetal"}
                            value={metalValue2}
                            onFocus={(e) => {
                                e.target.select();
                            }} onChange={(e) => handleMetalChange2(e.target.value)}
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
                            const vno = await refreshVno();
                            await handleSave(vno);
                        }}
                    >
                        SAVE
                    </Button>
                    <Button danger className={styles.cancelBtn} onClick={() => window.location.reload()}>
                        CANCEL
                    </Button>
                </div>
            </div>
        </>
    );
};

export default RateCutEntry;
