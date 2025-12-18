import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Select, DatePicker, Checkbox } from "antd";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import styles from "./voucher.module.css";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import FiltersModal from "./Filtermodal";
import { CREATE_jwel } from "../../Config/Config";
import axios from "axios";
import PaymentEntry from "./Payment";
import RateCutEntry from "./RateCut";
import ReceiptEntry from "./Recepit";
import dayjs from "dayjs";


const Voucher = () => {
    const { Option } = Select;
    // Default select — RECEIPT
    const [activeButton, setActiveButton] = useState("receipt");
    const [modalOpen, setModalOpen] = useState(false);
    const [metalBalance, setMetalBalance] = useState("");
    const [cashBalance, setCashBalance] = useState("");
    const userArea = localStorage.getItem("city");
    const userName = localStorage.getItem("userName");
    const singleImage = localStorage.getItem("singleImage");
    const tenantName = localStorage.getItem("tenantName");
    const [open, setOpen] = useState(false);
    const partyRef = useRef(null);
    const [vNo, setVNo] = useState(null);
    const [partyNames, setPartyNames] = useState([]);
    const [selectedParty, setSelectedParty] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());


    const toggleDrawer = () => {
        setOpen(false);
    };

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const reset = () => {
        setActiveButton("receipt");
        setSelectedParty(null);

    };

    const resetParty = () => {
        setSelectedParty(null);
    };

    // Rate Type Toggle
    const [metalValue, setMetalValue] = useState("");
    const [cashValue, setCashValue] = useState("");
    const [metalValue2, setMetalValue2] = useState("");
    const [cashValue2, setCashValue2] = useState("");
    const [selectedType, setSelectedType] = useState("metalToCash");

    const handleCheck = (type) => {

        if (selectedType === type) {
            setSelectedType(null);
        } else {
            setSelectedType(type);
        }
        setMetalValue("");
        setCashValue("");
        setMetalValue2("");
        setCashValue2("");
    };

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
            if (Array.isArray(data) && data.length > 0) {
                const rawValue = data[0]?.Column1;
                const maxInvNo = Number.isFinite(Number(rawValue))
                    ? Number(rawValue)
                    : 0;
                const newInvNo = maxInvNo + 1;
                setVNo(newInvNo);
                return newInvNo;
            }
        } catch (error) {
            console.error("Error fetching estimation count:", error);
        }
    };

    useEffect(() => {
        partyNamesAPI();
        vNoAPI();
    }, []);

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
            <div className={styles.invBox}>
                <span className={styles.invno}>Voc No: <span className={styles.vocNo}>{vNo ?? "--"}</span></span>
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    format="DD/MM/YYYY"
                    className={styles.datePicker}

                />

                <Button icon={<ReloadOutlined />} shape="circle" onClick={reset} />
                {/* <Button
                    icon={<FilterOutlined />}
                    onClick={() => setModalOpen(true)}
                    className={styles.filterButton}
                /> */}
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
            {/* TAB BUTTONS */}
            <div className={styles.actionButtons}>
                <button
                    className={`${styles.tabButton} ${activeButton === "receipt" ? styles.activeTab : ""}`}
                    onClick={() => handleClick("receipt")}
                >
                    RECEIPT
                </button>

                <button
                    className={`${styles.tabButton} ${activeButton === "payment" ? styles.activeTab : ""}`}
                    onClick={() => handleClick("payment")}
                >
                    PAYMENT
                </button>

                <button
                    className={`${styles.tabButton} ${activeButton === "rate" ? styles.activeTab : ""}`}
                    onClick={() => handleClick("rate")}
                >
                    RATE CUT
                </button>
            </div>
            {/* MAIN CONTENT CONTAINER */}
            <div className={styles.MainContainer}>
                <div className={styles.container}>
                    {activeButton === "receipt" && <ReceiptEntry
                        vNo={vNo}
                        selectedParty={selectedParty}
                        selectedDate={selectedDate}
                        refreshVno={vNoAPI}
                        resetparty={resetParty}
                    />}
                    {activeButton === "payment" && <PaymentEntry
                        vNo={vNo}
                        selectedParty={selectedParty}
                        selectedDate={selectedDate}
                        refreshVno={vNoAPI}
                        resetparty={resetParty}
                    />}
                    {activeButton === "rate" && (
                        <RateCutEntry
                            vNo={vNo}
                            selectedParty={selectedParty}
                            selectedDate={selectedDate}
                            refreshVno={vNoAPI}
                            resetparty={resetParty}
                            selectedType={selectedType}
                            handleCheck={handleCheck}
                            metalValue={metalValue}
                            setMetalValue={setMetalValue}
                            cashValue={cashValue}
                            setCashValue={setCashValue}
                            metalValue2={metalValue2}
                            setMetalValue2={setMetalValue2}
                            cashValue2={cashValue2}
                            setCashValue2={setCashValue2}
                        />
                    )}
                </div>
            </div>
            {/* FILTER POPUP */}
            <FiltersModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                setMetalBalance={setMetalBalance}
                setCashBalance={setCashBalance}
            />
        </>
    );
};

export default Voucher;
