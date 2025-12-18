import React, { useState } from "react";
import { Modal, Button, message, Input } from "antd";
import axios from "axios";
import styles from "./voucherdelete.css";
import dayjs from "dayjs";
import { CREATE_jwel } from "../../Config/Config";


const DeleteEntryModal = ({ open, onClose }) => {
  const [entryNo, setEntryNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [entryData, setEntryData] = useState(null);
  const tenantName = localStorage.getItem("tenantName");
  const branchname = localStorage.getItem("city");
  const dealername = localStorage.getItem("userName");

  /* -------- GET DATA -------- */
  const fetchEntryData = async () => {
    if (!entryNo) 
      message.warning("Please enter Entry No");F
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere`,
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

      if (res.data && res.data.length > 0) {
        setEntryData(res.data[0]);
      } else {
        setEntryData(null);
        message.error("No data found for this Entry No");
      }
    } catch (err) {
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  /* -------- DELETE DATA -------- */
  const deleteEntry = async () => {
    try {
      await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=TRANS_ENTRY_DATA&where=ENTRYNO=${entryNo}`
        null,
        {
          accept: "*/*",
          headers: { tenantName }
        }
      );

      message.success("Entry deleted successfully");
      setEntryNo("");
      setEntryData(null);
      onClose();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  return (
    <Modal
      title="Delete Entry"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <div className={styles.container}>
        {/* ENTRY NO INPUT */}
        <div className={styles.row}>
          <label className={styles.label}>Entry No</label>
          <Input
            value={entryNo}
            onChange={(e) => setEntryNo(e.target.value)}
            placeholder="Enter Entry No"
          />
        </div>

        <Button
          type="primary"
          onClick={fetchEntryData}
          loading={loading}
          className={styles.fetchBtn}
        >
          Get Data
        </Button>

        {/* SHOW DATA AFTER FETCH */}
        {entryData && (
          <div className={styles.dataBox}>
            <div>
              <span className={styles.title}>Entry No:</span>
              <span>{entryData.ENTRYNO}</span>
            </div>

            <div>
              <span className={styles.title}>Group Name:</span>
              <span>{entryData.GROUPNAME}</span>
            </div>

            <div>
              <span className={styles.title}>Date:</span>
              <span>
                {dayjs(entryData.SDATE).format("DD/MMM/YYYY")}
              </span>
            </div>

            <Button
              danger
              type="primary"
              onClick={deleteEntry}
              className={styles.deleteBtn}
            >
              Delete Entry
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteEntryModal;
