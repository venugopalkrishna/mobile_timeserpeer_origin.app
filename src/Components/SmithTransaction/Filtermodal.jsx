import React, { useState } from "react";
import { Modal, Select, Input } from "antd";
import styles from "./filtermodal.module.css";

const FiltersModal = ({ open, onClose, setMetalBalance, setCashBalance }) => {
    const { Option } = Select;
    const [group, setGroup] = useState("");
    const [ledger, setLedger] = useState("");

    return (
        <Modal
            title="Filters"
            open={open}
            onCancel={onClose}
            onOk={onClose}
            okText="Apply"
            centered
            className={styles.modalPopup}
        >
            <div className={styles.row}>
                <label className={styles.boldLabel}>Gold Rate</label>
                <Input className={styles.input} placeholder="Enter gold rate" />
            </div>
            <div className={styles.row}>
                <label>Group Name</label>
                <Select
                    value={group}
                    onChange={(v) => setGroup(v)}
                    className={styles.input}
                >
                    <Option>Group1</Option>
                    <Option>Group2</Option>
                </Select>
            </div>

            <div className={styles.row}>
                <label>Ledger Name</label>
                <Select
                    value={ledger}
                    onChange={(v) => setLedger(v)}
                    className={styles.input}
                >
                    <Option>Ledger1</Option>
                    <Option>Ledger2</Option>
                </Select>
            </div>

            <div className={styles.row}>
                <label>Metal Balance</label>
                <Input onChange={(e) => setMetalBalance(e.target.value)} />
            </div>

            <div className={styles.row}>
                <label>Cash Balance</label>
                <Input onChange={(e) => setCashBalance(e.target.value)} />
            </div>
        </Modal>
    );
};

export default FiltersModal;
