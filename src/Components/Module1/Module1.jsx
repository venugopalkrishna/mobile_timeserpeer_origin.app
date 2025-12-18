import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Select, DatePicker, message, InputNumber } from "antd";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./module1.module.css";
import axios from "axios";
import dayjs from "dayjs";
import { CREATE_jwel } from "../../Config/Config";


const Module1 = () => {
    const { Option } = Select;
    const userArea = localStorage.getItem("city");
    const userName = localStorage.getItem("userName");
    const singleImage = localStorage.getItem("singleImage");
    const tenantName = localStorage.getItem("tenantName");
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [open, setOpen] = useState(false);
    const partyRef = useRef(null);
    const [partyNames, setPartyNames] = useState([]);
    const [selectedParty, setSelectedParty] = useState(null);
    const [gwt, setGwt] = useState(0);
    const [less, setLess] = useState(0);
    const [nwt, setNwt] = useState(0);
    const [touch, setTouch] = useState(0);
    const [fine, setFine] = useState(0);
    const [cash, setCash] = useState(0);
    const [description, setDescription] = useState("");
    const [stCost, setStCost] = useState();
    const [vNo, setVNo] = useState(null);
    const toggleDrawer = () => setOpen(false);

    const partyNamesAPI = async () => {
        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder?tableName=Dealer_Master&where=Custtype%3D%27CUSTOMER%27&order=Dealername`,
                { headers: { tenantName } }
            );
            setPartyNames(response.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const vNoAPI = async () => {
        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable?tableName=TRANS_ENTRY_DATA&column=ENTRYNO`,
                { headers: { tenantName } }
            );

            const data = response.data;
            const rawValue = data?.[0]?.Column1;
            const newInvNo = (Number(rawValue) || 0) + 1;
            setVNo(newInvNo);
        } catch (error) {
            console.error(error);
        }
    };

    const date = new Date();
    const billNoDate = dayjs(selectedDate);
    date.setUTCHours(0, 0, 0, 0);

    useEffect(() => {
        partyNamesAPI();
        vNoAPI();
    }, []);

    const calculateNwt = (g, l) => {
        const gwtVal = parseFloat(g) || 0;
        const lessVal = parseFloat(l) || 0;
        return (gwtVal - lessVal).toFixed(3);
    };

    useEffect(() => {
        if (
            (parseFloat(gwt) || 0) > 0 ||
            (parseFloat(nwt) || 0) > 0
        ) {
            setTouch(100);
        } else {
            setTouch("");
        }
    }, [gwt, nwt]);

    useEffect(() => {
        const nwtVal = parseFloat(nwt) || 0;
        const touchVal = parseFloat(touch) || 0;

        if (nwtVal > 0 && touchVal > 0) {
            const calculatedFine = (nwtVal * touchVal) / 100;
            setFine(calculatedFine.toFixed(3));
        } else {
            setFine("");
        }
    }, [nwt, touch]);

    const handleSave = async () => {
        if (!selectedParty) {
            message.error("Select Party Name");
            return;
        }
        if (!vNo) {
            message.error("Invoice number not ready");
            return;
        }
        const payload = [
            {
                sdate: selectedDate ? billNoDate.toISOString() : date.toISOString(),
                entryno: vNo,
                groupname: "CUSTOMER",
                lname: selectedParty,
                particulars: "SALE",
                gjama: 0,
                gnama: Number(gwt) || 0,
                touch: Number(touch) || 0,
                pjama: 0,
                pnama: Number(fine) || 0,
                cjama: 0,
                cnama: Number(cash) || 0,
                vno: vNo,
                vtype: "CUSTOMER",
                stype: "NEW ORNAMENTS",
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
                nstonewt: Number(less) || 0,
                nnwt: Number(nwt) || 0,
                namount: 0,
                tranS_TYPE: "BILLING",
                maintype: "ORNAMENT STOCK",
                scode: 2,
                narration: description,
                branchname: "-",
                branchcode: "-",
                dealername: selectedParty,
                paytype: "-",
                sno: vNo,
                invno: String(vNo)
            }

        ];
        console.log("Post Payload" + payload);

        try {
            await axios.post(
                `${CREATE_jwel}/api/Wholesal/InsertTransEntryData`,
                payload,
                { headers: { tenantName } }
            );
            message.success("Saved Successfully");
            vNoAPI();
            handleReset();
        } catch (error) {
            console.error(error);
            message.error("Save Failed");
        }
    };
    /* -------- RESET -------- */
    const handleReset = () => {
        setSelectedParty(null);
        setGwt();
        setLess();
        setNwt();
        setTouch();
        setFine();
        setCash();
        setStCost();
        setDescription("");
    };

    return (
        <>
            <Header setOpen={setOpen} />
            <SidebarDrawer
                open={open}
                toggleDrawer={toggleDrawer}
                singleImage={singleImage}
                userArea={userArea}
                userName={userName}
            />
            <div className={styles.vocContainer}>
                <span>Voc No: <span className={styles.vocNo}>{vNo ?? "--"}</span></span>
                <span className={styles.datePicker}>
                    Date
                    <DatePicker
                        inputReadOnly
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        format="DD/MMM/YYYY"
                    />
                </span>
            </div>
            <div className={styles.partyWrapper}>
                <div className={styles.partyLabel}>Party Name:</div>
                <Select
                    ref={partyRef}
                    showSearch
                    allowClear
                    className={styles.partySelect}
                    value={selectedParty}
                    onChange={setSelectedParty}
                    placeholder="Select Party Name"
                >
                    {partyNames.map((party, index) => (
                        <Option key={index} value={party.Dealername}>
                            {party.Dealername}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className={styles.container}>
                <div className={styles.mainContainer}>
                    <div className={styles.subContainer}>
                        <span className={styles.spantext}> Gwt</span>
                        <Input
                            className={styles.inputfield}
                            value={gwt}
                            inputMode="decimal"
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setGwt("");
                                    setNwt("");
                                    return;
                                }
                                const regex = /^\d*\.?\d{0,3}$/;
                                if (regex.test(value)) {
                                    setGwt(value);
                                    setNwt(calculateNwt(value, less));
                                }
                            }}
                        />
                    </div>
                    <div className={styles.subContainer}>
                        <span className={styles.spantext}> Less</span>
                        <Input
                            className={styles.inputfield}
                            value={less}
                            inputMode="decimal"
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (value === "") {
                                    setLess("");
                                    setNwt(calculateNwt(gwt, 0));
                                    return;
                                }
                                const regex = /^\d*\.?\d{0,3}$/;
                                if (regex.test(value)) {
                                    setLess(value);
                                    setNwt(calculateNwt(gwt, value));
                                }
                            }}
                        />
                    </div>
                    <div className={styles.subContainer2}>
                        <span className={styles.spantext}> Nwt</span>
                        <Input className={styles.inputfield} value={nwt}
                            inputMode="decimal"
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setNwt(value);
                                    return;
                                }
                                const regex = /^\d+(\.\d{0,3})?$/;
                                if (regex.test(value)) {
                                    setNwt(value);
                                }
                            }}
                        />
                        <div className={styles.stCost}>
                            <span className={styles.spantext}>St.Cost</span>
                            <Input
                                className={styles.stInputField}
                                value={stCost}
                                inputMode="decimal"
                                onFocus={(e) => {
                                    e.target.select();
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // allow empty
                                    if (value === "") {
                                        setStCost(value);
                                        setCash(value);
                                        return;
                                    }
                                    const regex = /^\d+(\.\d{0,2})?$/;
                                    if (regex.test(value)) {
                                        setStCost(value);
                                        setCash(value); // ✅ AUTO CASH UPDATE
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.subContainer3}>
                        <span className={styles.spantext}> Touch</span>
                        <Input className={styles.inputfield} value={touch}
                            inputMode="decimal"
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setTouch(value);
                                    return;
                                }
                                const regex = /^\d+(\.\d{0,3})?$/;
                                if (regex.test(value)) {
                                    setTouch(value);
                                }
                            }}
                        />
                    </div>
                    <div className={styles.subContainer}>
                        <span className={styles.spantext}> Fine</span>
                        <Input className={styles.inputfield} value={fine}
                            inputMode="decimal"
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setFine(value);
                                    return;
                                }
                                const regex = /^\d+(\.\d{0,2})?$/;
                                if (regex.test(value)) {
                                    setFine(value);
                                }
                            }}
                        />
                    </div>
                    <div className={styles.subContainer4}>
                        <span className={styles.spantext}> Cash</span>
                        <Input className={styles.inputfield} value={cash}
                            inputMode="decimal"
                            onFocus={(e) => {
                                e.target.select();
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setCash(value);
                                    return;
                                }
                                const regex = /^\d+(\.\d{0,2})?$/;
                                if (regex.test(value)) {
                                    setCash(value);
                                }
                            }}
                        />
                    </div>
                    <div className={styles.subContainer4}>
                        <span className={styles.spantext}> Description</span>
                        <Input className={styles.inputfield} value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <Button className={styles.saveButton} onClick={handleSave}>Save</Button>
                <Button className={styles.cancleButton} onClick={handleReset}>Cancle</Button>
            </div>
        </>
    );
};
export default Module1;
