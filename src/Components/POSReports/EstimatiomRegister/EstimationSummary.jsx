import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../../../Config/Config";
import TableHeaderStyles from "../../Pages/TableHeaderStyles";

const { Option } = Select;

const EstimationSummary = () => {
  const formRef = useRef(null);
  const toRef = useRef(null);
  const partyRef = useRef(null);

  const [summaryData, setSummaryData] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [selectedParty, setSelectedParty] = useState(null);
  const [partyNames, setPartyNames] = useState([]);
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGwt, setTotalGwt] = useState(0);
  const [totalNwt, setTotalNwt] = useState(0);
  const [totalSwt, setTotalSwt] = useState(0);
  const [totalFineGold, setTotalFineGold] = useState(0);
  const [totalMcAmt, setTotalMcAmt] = useState(0);
  const [totalCharges, setTotalCharges] = useState(0);
  const [totalStoneAmt, setTotalStoneAmt] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [loading, setLoading] = useState(false);
  console.log(summaryData);

  const estimationSummaryAPI = async () => {
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

      const filteredData = data.filter((item) => {
        return (
          !selectedParty ||
          item.DESCRIPTION?.trim().toUpperCase() === selectedParty.toUpperCase()
        );
      });
      const uniqueDescriptions = Array.from(
        new Set(
          data
            .map((item) => item.DESCRIPTION?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ DESCRIPTION: desc }));

      const totalPieces = filteredData.reduce(
        (sum, item) => sum + Number(item.TOTPCS || 0),
        0
      );
      const totalGross = filteredData.reduce(
        (sum, item) => sum + Number(item.GWT || 0),
        0
      );
      const totalStones = filteredData.reduce(
        (sum, item) => sum + Number(item.STONEWT || 0),
        0
      );
      const totalNetWt = filteredData.reduce(
        (sum, item) => sum + Number(item.NWT || 0),
        0
      );
      const totalGold = filteredData.reduce(
        (sum, item) => sum + Number(item.TOUCHPER || 0),
        0
      );
      const totalMc = filteredData.reduce(
        (sum, item) => sum + Number(item.MCAMT || 0),
        0
      );
      const totalRCharges = filteredData.reduce(
        (sum, item) => sum + Number(item.RCHARGES || 0),
        0
      );
      const totalStAmt = filteredData.reduce(
        (sum, item) => sum + Number(item.STCHARGES || 0),
        0
      );
      const totalCas = filteredData.reduce(
        (sum, item) => sum + Number(item.TOTCASH || 0),
        0
      );

      setTotalPcs(totalPieces);
      setTotalGwt(totalGross);
      setTotalSwt(totalStones);
      setTotalNwt(totalNetWt);
      setTotalFineGold(totalGold);
      setTotalMcAmt(totalMc);
      setTotalCharges(totalRCharges);
      setTotalStoneAmt(totalStAmt);
      setTotalCash(totalCas);
      setPartyNames(uniqueDescriptions);
      setSummaryData(filteredData);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (fromDate && toDate) {
      estimationSummaryAPI();
    }
  }, [fromDate, toDate, selectedParty]);

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
          <>
            <div style={{ fontWeight: "bold" }}>
              {record?.ESTIMATIONNO || 0}
            </div>
          </>
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
    {
      title: "Fine Gold",
      dataIndex: "TOUCHPER",
      key: "TOUCHPER",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.TOUCHPER}</div>
          </>
        );
      },
    },
    {
      title: "Mc (%)",
      dataIndex: "MCPER",
      key: "MCPER",
      align: "right",
      width: 70,
      render: (text, record) => {
        return (
          <>
            <div>{record?.MCPER}</div>
          </>
        );
      },
    },
    {
      title: "Mc Amt",
      dataIndex: "MCAMT",
      key: "MCAMT",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.MCAMT}</div>
          </>
        );
      },
    },
    {
      title: "R-Charges",
      dataIndex: "RCHARGES",
      key: "RCHARGES",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>{record?.RCHARGES}</div>
          </>
        );
      },
    },
    {
      title: "Stone Amt",
      dataIndex: "Homekey",
      key: "Homekey",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.STCHARGES}</div>
          </>
        );
      },
    },
    {
      title: "Total Cash",
      dataIndex: "TOTCASH",
      key: "TOTCASH",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.TOTCASH}</div>
          </>
        );
      },
    },
    {
      title: "Inv No",
      dataIndex: "Homekey",
      key: "Homekey",
      align: "left",
      width: 70,
      render: (text, record) => {
        return (
          <>
            <div>0</div>
          </>
        );
      },
    },
    {
      title: "Inv Date",
      dataIndex: "Homekey",
      key: "Homekey",
      align: "left",
      width: 70,
      render: (text, record) => {
        return (
          <>
            <div>-</div>
          </>
        );
      },
    },
  ];

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleTagNoKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      //   submitRef.current?.click();
    }
  };
  const handlePartyChange = () => {
    // touchRef.current?.focus();
  };

  const handleItemChange = () => {
    // touchRef.current?.focus();
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "10px" }}
        >
          <Col>
            <Typography style={{ fontSize: "20px", fontWeight: "bold" }}>
              Estimation Summary
            </Typography>
          </Col>
          <Col style={{ display: "flex", gap: "10px" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#0C1154",
                borderColor: "#0C1154",
                flex: "0 1 50px",
              }}
            >
              Show
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "orange",
                borderColor: "orange",
                flex: "0 1 50px",
              }}
            >
              Print
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "red",
                borderColor: "red",
                flex: "0 1 50px",
              }}
            >
              Exit
            </Button>
          </Col>
        </Row>
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
                flex: "1 1 150px",
              }}
            >
              <div>From Date:</div>
              <DatePicker
                style={{ width: "80%" }}
                ref={formRef}
                onKeyDown={(e) => handleKeyDown(e, toRef)}
                value={fromDate}
                onChange={(date) => setFromDate(date)}
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
                style={{ width: "80%" }}
                ref={toRef}
                onKeyDown={(e) => handleKeyDown(e, partyRef)}
                value={toDate}
                onChange={(date) => setToDate(date)}
                format="DD-MMM-YYYY"
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "1 1 150px",
              }}
            >
              <div>Party Name:</div>
              <Select
                showSearch
                placeholder="Select Party Name"
                autoFocus={true}
                style={{ width: "60%" }}
                ref={partyRef}
                value={selectedParty ? selectedParty : null}
                onChange={(value) => {
                  setSelectedParty(value);
                  handlePartyChange();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const filteredOptions = partyNames.filter((party) =>
                      party.DESCRIPTION.toLowerCase().includes(
                        e.target.value.toLowerCase()
                      )
                    );
                    if (filteredOptions.length > 0) {
                      setSelectedParty(filteredOptions[0].DESCRIPTION);
                    }
                  }
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {partyNames.map((party, index) => (
                  <Option key={index} value={party.DESCRIPTION}>
                    {party.DESCRIPTION}
                  </Option>
                ))}
              </Select>
            </div>
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
                  scroll={{ y: 450 }} // Internal scroll inside table
                  summary={() => (
                    <Table.Summary.Row
                      style={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}
                    >
                      <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                      <Table.Summary.Cell index={1} />
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3} />
                      <Table.Summary.Cell index={4} align="center">
                        {totalPcs}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5} align="right">
                        {totalGwt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="right">
                        {totalSwt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7} align="right">
                        {totalNwt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8} align="right">
                        {totalFineGold?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9} />
                      <Table.Summary.Cell index={10} align="right">
                        {totalMcAmt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={11} align="right">
                        {totalCharges?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={12} align="right">
                        {totalStoneAmt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={13} align="right">
                        {totalCash?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={14} />
                      <Table.Summary.Cell index={15} />
                    </Table.Summary.Row>
                  )}
                />
              </TableHeaderStyles>
            </div>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};
export default EstimationSummary;
