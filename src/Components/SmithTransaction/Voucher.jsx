import React, { useState, useEffect } from "react";
import { Button, Input, Select, DatePicker, Checkbox } from "antd";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import styles from "./voucher.module.css";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import FiltersModal from "./Filtermodal";

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

    const toggleDrawer = () => {
        setOpen(false);
    };

    const handleClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    const reset = () => {
        setActiveButton("receipt");   // Reset to default
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
                <span className={styles.invno}>Voc No</span>
                <DatePicker />
                <Button icon={<ReloadOutlined />} shape="circle" onClick={reset} />

                <Button
                    icon={<FilterOutlined />}
                    onClick={() => setModalOpen(true)}
                    className={styles.filterButton}
                />
            </div>

            {/* TAB BUTTONS */}
            <div className={styles.actionButtons}>
                <Button
                    className={`${styles.tabButton} ${activeButton === "receipt" ? styles.activeTab : ""}`}
                    onClick={() => handleClick("receipt")}
                >
                    RECEIPT
                </Button>

                <Button
                    className={`${styles.tabButton} ${activeButton === "payment" ? styles.activeTab : ""}`}
                    onClick={() => handleClick("payment")}
                >
                    PAYMENT
                </Button>

                <Button
                    className={`${styles.tabButton} ${activeButton === "rate" ? styles.activeTab : ""}`}
                    onClick={() => handleClick("rate")}
                >
                    RATE CUT
                </Button>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className={styles.MainContainer}>
                <div className={styles.container}>
                    {/* <h2 className={styles.headerTitle}>{activeButton.toUpperCase()}</h2> */}

                    {/* ================= RECEIPT ================= */}
                    {activeButton === "receipt" && (
                        <>
                            <div className={styles.receiptCentered}>
                                <span className={styles.receiptTitle}>RECEIPT ENTRY</span>
                            </div>

                            <div className={styles.metalCashContainer}>
                                <div className={styles.boxYellow}>
                                    <strong className={styles.sectionTitle}>METAL PAYMENT</strong>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Weight</label>
                                        <Input placeholder="Enter weight" />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Touch</label>
                                        <Input placeholder="Enter touch" />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Paid Metal</label>
                                        <Input placeholder="Enter paid metal" />
                                    </div>
                                </div>

                                <div className={styles.boxBlue}>
                                    <strong className={styles.sectionTitle}>CASH PAYMENT</strong>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Paid Cash</label>
                                        <Input placeholder="Enter cash amount" />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Discount</label>
                                        <Input placeholder="Enter discount" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ================= PAYMENT ================= */}
                    {activeButton === "payment" && (
                        <>
                            <div className={styles.paymentCentered}>
                                <span className={styles.paymentTitle}>PAYMENT ENTRY</span>
                            </div>

                            <div className={styles.metalCashContainer}>
                                <div className={styles.boxYellow}>
                                    <strong className={styles.sectionTitle}>METAL PAYMENT</strong>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Weight</label>
                                        <Input placeholder="Enter weight" />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Touch</label>
                                        <Input placeholder="Enter touch" />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Paid Metal</label>
                                        <Input placeholder="Enter paid metal" />
                                    </div>
                                </div>

                                <div className={styles.boxBlue}>
                                    <strong className={styles.sectionTitle}>CASH PAYMENT</strong>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Paid Cash</label>
                                        <Input placeholder="Enter cash amount" />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Discount</label>
                                        <Input placeholder="Enter discount" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ================= RATE CUT ================= */}
                    {activeButton === "rate" && (
                        <>
                            <div className={styles.rateHeader}>
                                <div className={styles.flexRow}>
                                    <label className={styles.boldLabel}>RATE CUT</label>
                                </div>
                            </div>

                            <div className={styles.metalCashContainer}>
                                <div className={styles.boxYellow}>
                                    <Checkbox
                                        checked={selectedType === "metalToCash"}
                                        onChange={() => handleCheck("metalToCash")}
                                        className={styles.checkButton}
                                    >
                                        METAL TO CASH
                                    </Checkbox>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Metal</label>
                                        <Input
                                            placeholder="Enter metal"
                                            disabled={selectedType !== "metalToCash"}
                                            value={metalValue}
                                            onChange={(e) => setMetalValue(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Cash</label>
                                        <Input
                                            placeholder="Enter cash amount"
                                            disabled={selectedType !== "metalToCash"}
                                            value={cashValue}
                                            onChange={(e) => setCashValue(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.boxBlue}>
                                    <Checkbox
                                        checked={selectedType === "cashToMetal"}
                                        onChange={() => handleCheck("cashToMetal")}
                                    >
                                        CASH TO METAL
                                    </Checkbox>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Cash</label>
                                        <Input
                                            placeholder="Enter cash amount"
                                            disabled={selectedType !== "cashToMetal"}
                                            value={cashValue2}
                                            onChange={(e) => setCashValue2(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.rowLabel}>Metal</label>
                                        <Input
                                            placeholder="Enter metal"
                                            disabled={selectedType !== "cashToMetal"}
                                            value={metalValue2}
                                            onChange={(e) => setMetalValue2(e.target.value)}
                                        />
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                    <div className={styles.descriptionRow}>
                        <label className={styles.rowLabel}>Description :</label>
                        <Input.TextArea rows={1} className={styles.descriptionTextArea} />
                    </div>
                </div>
            </div>
            {/* FOOTER */}
            <div className={styles.footerBar}>
                <div className={styles.balancesModule}>
                    <div className={styles.footerFields}>
                        <label>Metal Balance </label>
                        <span>:</span>
                        {/* <Input
                        value={metalBalance}
                        onChange={(e) => setMetalBalance(e.target.value)}
                    /> */}
                        <span className={styles.values}>0</span>
                    </div>
                    <div className={styles.footerFields}>
                        <label>Cash Balance</label>
                        <span>:</span>
                        {/* <Input
                        value={cashBalance}
                        onChange={(e) => setCashBalance(e.target.value)}
                    /> */}
                        <span className={styles.values}>0</span>
                    </div>
                </div>
                <div className={styles.footerButtons}>
                    <Button className={styles.saveBtn}>SAVE</Button>
                    <Button danger className={styles.cancelBtn}>CANCEL</Button>
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
