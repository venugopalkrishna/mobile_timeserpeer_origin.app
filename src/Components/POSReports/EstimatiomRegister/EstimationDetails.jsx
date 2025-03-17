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
import logo from "../../../Components/Assets/stones-image.png";

const { Option } = Select;

const EstimationDetails = () => {
  const formRef = useRef(null);
  const toRef = useRef(null);
  const partyRef = useRef(null);
  const itemRef = useRef(null);
  const tagNoRef = useRef(null);
  const estRef = useRef(null);

  const [summaryData, setSummaryData] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [selectedParty, setSelectedParty] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [partyNames, setPartyNames] = useState([]);
  const [itemNames, setItemNames] = useState([]);
  const [searchTagNo, setSearchTagNo] = useState(0);
  const [searchEstimationNo, setSearchEstimationNO] = useState(0);
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGwt, setTotalGwt] = useState(0);
  const [totalNwt, setTotalNwt] = useState(0);
  const [totalSwt, setTotalSwt] = useState(0);
  const [totalFineGold, setTotalFineGold] = useState(0);
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
        tableName: "ESTIMATION_DATA",
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
          (!selectedParty ||
            item.DESCRIPTION?.trim().toUpperCase() ===
              selectedParty.toUpperCase()) &&
          (!selectedItem ||
            item.PRODNAME?.trim().toUpperCase() ===
              selectedItem.toUpperCase()) &&
          (!searchTagNo || String(item.TAGNO) === String(searchTagNo) || "") &&
          (!searchEstimationNo ||
            String(item.ESTIMATIONNO) === String(searchEstimationNo) ||
            "")
        );
      });
      const uniqueDescriptions = Array.from(
        new Set(
          data
            .map((item) => item.DESCRIPTION?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ DESCRIPTION: desc }));

      const uniqueItemNames = Array.from(
        new Set(
          data
            .map((item) => item.PRODNAME?.trim().toUpperCase())
            .filter((desc) => desc && desc !== "-")
        )
      ).map((desc) => ({ PRODNAME: desc }));

      const totalPieces = filteredData.reduce(
        (sum, item) => sum + Number(item.PIECES || 0),
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
        (sum, item) => sum + Number(item.FINEGOLD || 0),
        0
      );

      setTotalPcs(totalPieces);
      setTotalGwt(totalGross);
      setTotalSwt(totalStones);
      setTotalNwt(totalNetWt);
      setTotalFineGold(totalGold);
      setPartyNames(uniqueDescriptions);
      setItemNames(uniqueItemNames);
      setSummaryData(filteredData);
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
  }, [
    fromDate,
    toDate,
    selectedParty,
    selectedItem,
    searchTagNo,
    searchEstimationNo,
  ]);

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
      title: "Tag No",
      dataIndex: "TAGNO",
      key: "TAGNO",
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.TAGNO}</div>
          </>
        );
      },
    },
    {
      title: "Item Name",
      dataIndex: "PRODNAME",
      key: "PRODNAME",
      align: "left",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>{record?.PRODNAME}</div>
          </>
        );
      },
    },
    {
      title: "Pieces",
      dataIndex: "PIECES",
      key: "PIECES",
      align: "center",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.PIECES}</div>
          </>
        );
      },
    },
    {
      title: "Gross.Wt",
      dataIndex: "GWT",
      key: "GWT",
      align: "right",
      width: 70,
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
      width: 60,
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
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.NWT}</div>
          </>
        );
      },
    },
    {
      title: "Purity",
      dataIndex: "PREFIX",
      key: "PREFIX",
      align: "right",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.PREFIX}</div>
          </>
        );
      },
    },
    {
      title: "Touch",
      dataIndex: "TOUCH",
      key: "TOUCH",
      align: "right",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.TOUCH}</div>
          </>
        );
      },
    },
    {
      title: "Fine Gold",
      dataIndex: "FINEGOLD",
      key: "FINEGOLD",
      align: "right",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.FINEGOLD}</div>
          </>
        );
      },
    },
    {
      title: "Act Per",
      dataIndex: "ACTPER",
      key: "ACTPER",
      align: "right",
      width: 60,
      render: (text, record) => {
        return (
          <>
            <div>{record?.ACTPER}</div>
          </>
        );
      },
    },
    {
      title: "Stones",
      dataIndex: "STDET",
      key: "STDET",
      align: "left",
      width: 60,
      render: (text, record) => {
        const cleanedActGrams = record?.STDET;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {/* <span style={{ fontSize: "12px" }}>{cleanedActGrams}</span> */}
            <Tooltip title={cleanedActGrams} style={{ fontSize: "12px" }}>
              <div
                style={{
                  textAlign: "center",
                  // padding: "5px 0",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <img
                  src={logo}
                  alt=""
                  style={{
                    width: "30px",
                    height: "20px",
                    align: "center",
                    cursor: "pointer",
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Party Name",
      dataIndex: "Homekey",
      key: "Homekey",
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
    //   {
    //     title: "Actions",
    //     dataIndex: "Actions",
    //     key: "Actions",
    //     align: "center",
    //     render: (text, record) => (
    //       <DeleteOutlined
    //         style={{ color: "red", cursor: "pointer" }}
    //         onClick={() => handleDelete(record.TAGNO)}
    //       />
    //     ),
    //   },
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
              Estimation Details
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
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* Estimation Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "0 1 200px",
              }}
            >
              <div>From Date:</div>
              <DatePicker
                style={{ width: "60%" }}
                ref={formRef}
                onKeyDown={(e) => handleKeyDown(e, toRef)}
                value={fromDate ? dayjs(fromDate) : null}
                onChange={(date) => setFromDate(date)}
                format="DD-MMM-YYYY" // Format: 11-Mar-2025
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "0 1 200px",
              }}
            >
              <div>To Date:</div>
              <DatePicker
                style={{ width: "60%" }}
                ref={toRef}
                onKeyDown={(e) => handleKeyDown(e, partyRef)}
                value={toDate ? dayjs(toDate) : null}
                onChange={(date) => setToDate(date)}
                format="DD-MMM-YYYY" // Format: 11-Mar-2025
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "0 1 220px",
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "0 1 200px",
              }}
            >
              <div>Item Name:</div>
              <Select
                showSearch
                placeholder="Select Item Name"
                autoFocus={true}
                style={{ width: "60%" }}
                ref={itemRef}
                value={selectedItem ? selectedItem : null}
                onChange={(value) => {
                  setSelectedItem(value);
                  handleItemChange();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const filteredOptions = itemNames.filter((party) =>
                      party.PRODNAME.toLowerCase().includes(
                        e.target.value.toLowerCase()
                      )
                    );
                    if (filteredOptions.length > 0) {
                      setSelectedItem(filteredOptions[0].PRODNAME);
                    }
                  }
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {itemNames.map((party, index) => (
                  <Option key={index} value={party.PRODNAME}>
                    {party.PRODNAME}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Touch & Wast Inputs */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "0 1 150px",
              }}
            >
              <div>Tag No:</div>
              <Input
                placeholder="Enter TagNo"
                ref={tagNoRef}
                style={{ width: "60%" }}
                onKeyDown={(e) => handleKeyDown(e, estRef)}
                value={searchTagNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setSearchTagNo(value);
                  }
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "0 1 150px",
              }}
            >
              <div>Est No:</div>
              <Input
                placeholder="Enter EstNo"
                ref={estRef}
                style={{ width: "60%" }}
                value={searchEstimationNo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setSearchEstimationNO(value);
                  }
                }}
              />
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
                      <Table.Summary.Cell index={4} />
                      <Table.Summary.Cell index={5} align="center">
                        {totalPcs}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={6} align="right">
                        {totalGwt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7} align="right">
                        {totalSwt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={8} align="right">
                        {totalNwt?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={9} />
                      <Table.Summary.Cell index={10} />
                      <Table.Summary.Cell index={11} align="right">
                        {totalFineGold?.toFixed(2)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={12} />
                      <Table.Summary.Cell index={13} />
                      <Table.Summary.Cell index={14} />
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
export default EstimationDetails;
