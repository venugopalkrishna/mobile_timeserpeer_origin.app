import React, { useState } from "react";
import { Modal, Button, message, Input } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { CREATE_jwel } from "../../Config/Config";
import styles from "./deletesalemodu.module.css";

const DeleteEntryModal = ({ open, onClose }) => {
    const [entryNo, setEntryNo] = useState("");
    const [loading, setLoading] = useState(false);
    const [entryData, setEntryData] = useState(null);

    const tenantName = localStorage.getItem("tenantName");

    const clearAll = () => {
        setEntryNo("");
        setEntryData(null);
        onClose();
    };

    /* -------- GET DATA -------- */
    const fetchEntryData = async () => {
        if (!entryNo) {
            message.warning("Please enter Voc No");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(
                `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere`,
                {
                    params: {
                        tableName: "TRANS_ENTRY_DATA",
                        where: `ENTRYNO=${entryNo} AND GROUPNAME='CUSTOMER' AND TRANS_TYPE='BILLING'`,
                    },
                    headers: {
                        accept: "*/*",
                        tenantName,
                    },
                }
            );

            if (res.data && res.data.length > 0) {
                const data = res.data[0];

                /* ✅ CHECK TRANS_TYPE */
                // if (data.TRANS_TYPE === "BILLING") {
                    setEntryData(data);
                // } else {
                //     setEntryData(null);
                //     message.warning("Enter Valid Voc No");
                // }
            } else {
                setEntryData(null);
                message.error("No data found for this Voucher Number.");
            }
        } catch (error) {
            message.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };
    /* -------- DELETE -------- */
    const confirmDelete = async () => {
        try {
            await axios.post(
                `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere`,
                null,
                {
                    params: {
                        tableName: "TRANS_ENTRY_DATA",
                        where: `ENTRYNO=${entryNo}`,
                    },
                    headers: {
                        accept: "*/*",
                        tenantName,
                    },
                }
            );

            message.success("Entry deleted successfully");
            clearAll();
        } catch (error) {
            message.error("Delete failed");
        }
    };

    /* -------- CONFIRM MODAL -------- */
    const handleDeleteClick = () => {
        Modal.confirm({
            title: "Confirm Delete",
            content: (
                <>
                    <span className={styles.messageSpan}>
                        Are you sure you want to delete this entry?
                    </span>
                    <span className={styles.vocmessage}>
                        <span>Voc No:</span>{" "}
                        <span className={styles.datamessage}>{entryData?.ENTRYNO}</span>
                    </span>
                </>
            ),
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: <span className={styles.cancelText}>Cancel</span>,
            onOk: confirmDelete,
        });
    };

    return (
        <Modal
            title="Delete Entry"
            open={open}
            onCancel={clearAll}
            footer={null}
            destroyOnClose
        >
            <div className={styles.container}>
                <div className={styles.row}>
                    <label className={styles.label}>Voc No</label>
                    <Input
                        value={entryNo}
                        onChange={(e) => {
                            setEntryNo(e.target.value);
                            if (!e.target.value) setEntryData(null);
                        }}
                        placeholder="Enter Voc No"
                        className={styles.vocInput}
                    />

                    <Button
                        type="primary"
                        onClick={fetchEntryData}
                        loading={loading}
                        className={styles.fetchBtn}
                    >
                        Submit
                    </Button>
                </div>

                {entryNo && entryData && (
                    <div className={styles.dataBox}>
                        <div className={styles.dataRow}>
                            <span className={styles.title}>Entry No</span>
                            <span className={styles.colon}>:</span>
                            <span className={styles.value}>{entryData.ENTRYNO}</span>
                        </div>

                        <div className={styles.dataRow}>
                            <span className={styles.title}>Group Name</span>
                            <span className={styles.colon}>:</span>
                            <span className={styles.value}>{entryData.GROUPNAME}</span>
                        </div>

                        <div className={styles.dataRow}>
                            <span className={styles.title}>L Name</span>
                            <span className={styles.colon}>:</span>
                            <span className={styles.value}>{entryData.LNAME}</span>
                        </div>

                        <div className={styles.dataRow}>
                            <span className={styles.title}>Date</span>
                            <span className={styles.colon}>:</span>
                            <span className={styles.value}>
                                {dayjs(entryData.SDATE).format("DD/MMM/YYYY")}
                            </span>
                        </div>

                        <div className={styles.buttonContainer}>
                            <Button
                                danger
                                type="primary"
                                onClick={handleDeleteClick}
                                className={styles.deleteBtn}
                            >
                                Delete
                            </Button>

                            <Button onClick={clearAll} className={styles.clearButton}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default DeleteEntryModal;
