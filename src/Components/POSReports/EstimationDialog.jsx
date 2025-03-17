import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Modal,
  Row,
  Spin,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import TableHeaderStyles from "../Pages/TableHeaderStyles";
import { CREATE_jwel } from "../../Config/Config";
import axios from "axios";

const EstimationDialog = ({
  setOpenDialog,
  openDialog,
  estimationNoDataAPI,
  setSelectedObject,
  selectedObject,
  setSelectEstimationNo,
  estimationNoItemsAPI,
}) => {
  const [summaryData, setSummaryData] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);

  const EstimationSummaryAPI = async () => {
    setLoading(true);
    try {
      let whereCondition = "";
      if (fromDate && toDate) {
        whereCondition = `ESTIMATIONDATE>='${dayjs(fromDate).format(
          "MM/DD/YYYY"
        )}' and ESTIMATIONDATE<='${dayjs(toDate).format("MM/DD/YYYY")}'`;
      }
      let params = {
        tableName: "ESTIMATION_MAST",
        where: whereCondition,
        order: "ESTIMATIONNO",
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder`,
        {
          params,
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );

      const data = response.data;

      const uniqueData = Array.from(
        new Map(data.map((item) => [item.ESTIMATIONNO, item])).values()
      );

      setSummaryData(uniqueData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      EstimationSummaryAPI();
    }
  }, [fromDate, toDate]);

  const handleCheckboxChange = (record) => {
    setSelectedObject(
      selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO ? null : record
    );
    setSelectEstimationNo(
      selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO ? null : record
    );
  };

  const columns = [
    {
      title: "SNo",
      dataIndex: "SNo",
      key: "SNo",
      className: "blue-background-column",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Est No",
      dataIndex: "ESTIMATIONNO",
      key: "ESTIMATIONNO",
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Checkbox
              checked={selectedObject?.ESTIMATIONNO === record.ESTIMATIONNO}
              onChange={() => handleCheckboxChange(record)}
              disabled={
                selectedObject !== null &&
                selectedObject?.ESTIMATIONNO !== record.ESTIMATIONNO
              }
            />
            <span style={{ fontWeight: "bold" }}>
              {record?.ESTIMATIONNO || 0}
            </span>
          </div>
        );
      },
    },
    {
      title: "Est Date",
      dataIndex: "ESTIMATIONDATE",
      key: "ESTIMATIONDATE",
      align: "center",
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>
              {record?.ESTIMATIONDATE
                ? dayjs(record.ESTIMATIONDATE).format("DD-MMM-YYYY")
                : "-"}
            </div>
          </>
        );
      },
    },
    {
      title: "Party Name",
      dataIndex: "DESCRIPTION",
      key: "DESCRIPTION",
      width: 100,
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>{record?.DESCRIPTION}</div>
          </>
        );
      },
    },
    {
      title: "Pieces",
      dataIndex: "TOTPCS",
      key: "TOTPCS",
      width: 100,
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.TOTPCS}</div>
          </>
        );
      },
    },
    {
      title: "Gross.Wt",
      dataIndex: "GWT",
      key: "GWT",
      align: "right",
      width: 80,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.GWT}</div>
          </>
        );
      },
    },
    {
      title: "Less.Wt",
      dataIndex: "STONEWT",
      key: "STONEWT",
      align: "right",
      width: 70,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.STONEWT}</div>
          </>
        );
      },
    },
    {
      title: "Net.Wt",
      dataIndex: "NWT",
      key: "NWT",
      align: "right",
      width: 70,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.NWT}</div>
          </>
        );
      },
    },
  ];
  return (
    <Spin spinning={loading} tip="Loading...">
      <Flex vertical gap="middle" align="flex-start">
        <Modal
          title={selectedObject?.ESTIMATIONNO ? `Estimation No: ${selectedObject?.ESTIMATIONNO}` :" Estimation Items"}
          centered
          open={openDialog}
          //   onOk={() => setOpenDialog(false)}
          //   onCancel={() => setOpenDialog(false)}
          width="80%"
          footer={null}
          closable={false}
        >
          <Row gutter={[16, 16]} align="middle" wrap>
            <Col
              xs={24}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              {/* Estimation Card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: "1 0 200px",
                }}
              >
                <div>From Date:</div>
                <DatePicker
                  style={{ width: "30%" }}
                  value={fromDate}
                  onChange={(date) => {
                    setFromDate(date);
                    setSelectedObject(null);
                  }}
                  format="DD-MMM-YYYY" // Format: 11-Mar-2025
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flex: "1 1 200px",
                }}
              >
                <div>To Date:</div>
                <DatePicker
                  style={{ width: "30%" }}
                  value={toDate}
                  onChange={(date) => {
                    setToDate(date);
                    setSelectedObject(null);
                  }}
                  format="DD-MMM-YYYY"
                />
              </div>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "green",
                  borderColor: "green",
                  flex: "0 1 50px",
                }}
                onClick={() => {
                  setOpenDialog(false);
                  estimationNoDataAPI(selectedObject?.ESTIMATIONNO);
                  estimationNoItemsAPI(selectedObject?.ESTIMATIONNO);
                }}
                disabled={selectedObject === null}
              >
                Submit
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "orange",
                  borderColor: "orange",
                  flex: "0 1 50px",
                }}
                onClick={() => {
                  setOpenDialog(false);
                  setSelectedObject(null);
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: "5px" }}>
            <Col span={24}>
              <div
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                }}
              >
                <TableHeaderStyles>
                  <Table
                    columns={columns}
                    dataSource={summaryData}
                    pagination={false}
                    size="small"
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    scroll={{ y: 450 }}
                  />
                </TableHeaderStyles>
              </div>
            </Col>
          </Row>
        </Modal>
      </Flex>
    </Spin>
  );
};
export default EstimationDialog;
