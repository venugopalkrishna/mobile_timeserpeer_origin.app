import { useRef, useState } from "react";
import styles from "./Customer.module.css";
import { Button, Input, message, Row, Select, Spin } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../../Config/Config";
import Header from "../../Header";
import SidebarDrawer from "../../SidebarDrawer";

const { Option } = Select;

const CustomerDetails = () => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [selectType, setSelectType] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerArea, setCustomerArea] = useState("");
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  const data = [
    { Dealername: "CUSTOMER" },
    { Dealername: "DEALER" },
    { Dealername: "WORKER" },
  ];

  const date = new Date();

  const createCustomerDetailsAPI = async () => {
    const requestBody = {
      custType: selectType || "",
      street: customerArea || "-",
      dealername: customerName || "-",
      address1: "-",
      address2: "-",
      address3: "-",
      address4: "-",
      cityName: "-",
      phonenum: "-",
      mobilenum: customerMobile || "-",
      mobileNum2: "-",
      card: "-",
      cardno: "-",
      state: "-",
      district: "-",
      pinCode: "-",
      education: "-",
      eMail: "",
      dob: "",
      annversary: "",
      gender: "-",
      website: "-",
      fax: "-",
      tinNo: "-",
      cst: "-",
      bcouponno: "-",
      acouponno: "-",
      entrydate: date.toISOString(),
      statecode: "",
      station: "",
      clouD_UPLOAD: false,
      entryno: 0,
    };

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/MasterDealerMasterInsert`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        },
      );
      let data = response?.data;
      setSelectType(null);
      setCustomerName("");
      setCustomerMobile("");
      setCustomerArea("");
      messageApi.open({
        type: "error",
        content: (
          <div style={{ fontSize: "20px" }}>Successfully submitted!</div>
        ),
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      {contextHolder}
      <div style={{ background: "#F6F1E9", height: "100vh" }}>
        <Header setOpen={setOpen} />
        <SidebarDrawer
          open={open}
          toggleDrawer={toggleDrawer}
          singleImage={singleImage}
          userArea={userArea}
          userName={userName}
        />
        <Row
          justify="space-between"
          align="middle"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={styles.headerContainer}>
            <h3 className={styles.heading}>Mail Book</h3>
          </div>
        </Row>
        <div className={styles.cardContainer2}>
          <div className={styles.infoBox2}>
            <div className={styles.rowTag2}>
              <span className={styles.label2}>Customer Type</span>
              {/* <span className={styles.separator2}>:</span> */}
              <span className={styles.value2}>
                <Select
                  allowClear
                  showSearch
                  placeholder="Select Type"
                  autoFocus={true}
                  style={{ width: "200px", textAlign: "left" }}
                  value={selectType || null}
                  onChange={(value) => {
                    setSelectType(value);
                  }}
                  onInputKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const filteredOptions = data.filter((party) =>
                        party.Dealername.toLowerCase().includes(
                          e.target.value.toLowerCase(),
                        ),
                      );
                      if (filteredOptions.length > 0) {
                        setSelectType(filteredOptions[0].Dealername);
                      }
                    }
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {data.map((party, index) => (
                    <Option key={index} value={party.Dealername}>
                      {party.Dealername}
                    </Option>
                  ))}
                </Select>
              </span>
            </div>
            <div className={styles.rowTag2}>
              <span className={styles.label2}>Name</span>
              {/* <span className={styles.separator2}>:</span> */}
              <span className={styles.value2}>
                <Input
                  placeholder="Enter Customer Name"
                  style={{ width: "200px", height: 32, fontSize: "16px" }}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </span>
            </div>
            <div className={styles.rowTag2}>
              <span className={styles.label2}>Contact No</span>
              {/* <span className={styles.separator2}>:</span> */}
              <span className={styles.value2}>
                <Input
                  placeholder="Enter Customer No"
                  style={{ width: "200px", height: 32, fontSize: "16px" }}
                  ref={inputRef}
                  value={customerMobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setCustomerMobile(value);
                    }
                  }}
                />
              </span>
            </div>

            <div className={styles.rowTag2}>
              <span className={styles.label2}>City</span>
              {/* <span className={styles.separator2}>:</span> */}
              <span className={styles.value2}>
                <Input
                  placeholder="Enter Area"
                  style={{ width: "200px", height: 32, fontSize: "16px" }}
                  value={customerArea}
                  onChange={(e) => setCustomerArea(e.target.value)}
                />
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              disabled={
                !selectType && !customerName && !customerMobile && !customerArea
              }
              onClick={() => {
                createCustomerDetailsAPI();
              }}
              style={{ background: "#53bd91", color: "white" }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default CustomerDetails;
