import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
  Table,
  Tooltip,
} from "antd";
import moment from "moment";
import { motion } from "framer-motion";
import TableHeaderStyles from "../Pages/TableHeaderStyles";
import { useEffect, useRef, useState } from "react";
import { CREATE_jwel } from "../../Config/Config";
import { use } from "react";
import axios from "axios";
import {
  DeleteOutlined,
  FolderAddOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import EstimationReport from "../Utiles/DownloadEstimationPdf";
import logo from "../../Components/Assets/stones-image.png";
import dayjs from "dayjs";
import EstimationDialog from "./EstimationDialog";

const { Option } = Select;
const Estimation = () => {
  const [form] = Form.useForm();
  const partyRef = useRef(null);
  const touchRef = useRef(null);
  const wastRef = useRef(null);
  const tagNoRef = useRef(null);
  const submitRef = useRef(null);

  const [selectedObject, setSelectedObject] = useState(null);
  const [selectEstimationNo, setSelectEstimationNo] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [stonesData, setStonesData] = useState([]);
  const [stoneMainData, setStoneMainData] = useState([]);
  const [estimationCount, setEstimationCount] = useState({});
  const [partyNames, setPartyNames] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [touchValue, setTouchValue] = useState(0);
  const [wastageValue, setWastageValue] = useState(0);
  const [tagNoValue, setTagNoValue] = useState(0);
  const [totalPieces, setTotalPieces] = useState(0);
  const [totalGrossWeight, setTotalGrossWeight] = useState(0);
  const [totalStoneWeight, setTotalStoneWeight] = useState(0);
  const [totalNetWeight, setTotalNetWeight] = useState(0);
  const [totalFineGold, setTotalFineGold] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [stoneRate, setStoneRate] = useState({});
  const [makingValue, setMakingValue] = useState(0);
  const [perGramValue, setPerGramValue] = useState(0);
  const [rodiumChargeValue, setRodiumChargeValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [mastData, setMastData] = useState();
  const [itemData, setItemData] = useState();
  const [estimationData, setEstimationData] = useState();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  console.log(stoneMainData, "stoneMainData");
  console.log(tableData, "tableData");
  console.log(stoneRate, "stoneRate");
  console.log(stonesData, "stonesData");
  console.log(selectedDate, "selectedDate");
  console.log(itemData, "itemData");
  console.log(selectEstimationNo, "selectEstimationNo");
  console.log(makingValue, "makingValue");

  const formatDate = dayjs(selectEstimationNo?.ESTIMATIONDATE).format(
    "ddd, DD MMM YYYY HH:mm:ss [GMT]"
  );

  // Estimation Count API
  const estimationCountAPI = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable?tableName=ESTIMATION_MAST&column=ESTIMATIONNO`,
        {
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        setEstimationCount(data[0].Column1);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  // Party Names API
  const partyNamesAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder?tableName=Dealer_Master&where=Custtype%3D%27CUSTOMER%27&order=Dealername`
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const filteredData = data
          .filter((item) => item.Dealername && item.Dealername.trim() !== "")
          .map(({ Dealername }) => ({ Dealername }));

        setPartyNames(filteredData);
      }
    } catch (error) {
      console.error("Error fetching party names:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stones API
  const stonesAPI = async (tagNo) => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_ITEMS&where=TAGNO%3D${
          tagNoValue ? tagNoValue : tagNo
        }`,
        {
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );

      let newData = response.data;
      if (!Array.isArray(newData) || newData.length === 0) {
        message.warning("Tag Not existed");
        return;
      }

      if (Array.isArray(newData) && newData.length > 0) {
        setStoneMainData((prevData) => {
          const existingTag = prevData.some(
            (item) => item.TAGNO === tagNoValue
          );

          if (existingTag) {
            message.warning("Already Existed This Tag No");
            return prevData;
          }
          const allData = [...prevData, ...newData];

          const mergedData = allData.reduce((acc, item) => {
            let existingItem = acc.find((el) => el.TAGNO === item.TAGNO);

            if (existingItem) {
              existingItem.MAINTYPES = existingItem.MAINTYPES || {};
              if (existingItem.MAINTYPES[item.MAINTYPE]) {
                existingItem.MAINTYPES[item.MAINTYPE] += item.ACTGRAMS;
              } else {
                existingItem.MAINTYPES[item.MAINTYPE] = item.ACTGRAMS;
              }
            } else {
              acc.push({
                TAGNO: item.TAGNO,
                MAINTYPES: { [item.MAINTYPE]: item.ACTGRAMS },
              });
            }

            return acc;
          }, []);

          // Convert MAINTYPES object into a formatted string
          return mergedData.map((item) => ({
            TAGNO: item.TAGNO,
            ACTGRAMS: Object.entries(item.MAINTYPES)
              .map(([key, value]) => `${key}(${value})`)
              .join(", "),
          }));
        });

        // mainAPI(formattedData);
        setStonesData((prevData) => {
          const combinedData = [...prevData, ...newData];

          const mergedData = combinedData.reduce((acc, item) => {
            const existingItem = acc.find(
              (el) => el.MAINTYPE === item.MAINTYPE
            );
            if (existingItem) {
              existingItem.PCS += item.PCS;
              existingItem.ACTGRAMS += item.ACTGRAMS;
              existingItem.CTS += item.CTS;
            } else {
              acc.push({ ...item });
            }
            return acc;
          }, []);

          return mergedData;
        });
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  // Main API
  const mainAPI = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `http://www.jewelerp.timeserasoftware.in/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TAGNO%3D${tagNoValue}`,
        {
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        message.warning("Tag Not existed");
        return;
      }

      setTableData((prevData) => {
        const existingTag = prevData.some((item) => item.TAGNO === tagNoValue);

        if (existingTag) {
          message.warning("Already Existed This Tag No");
          return prevData;
        }

        const newObjects = data.map((obj) => {
          const totalTouch = Number(touchValue) + Number(wastageValue);
          const finalGold = (Number(obj?.NWT) * totalTouch) / 100;
          const actPer = (Number(finalGold) / Number(obj?.GWT)) * 100;
          const actGrams = stoneMainData;
          console.log(actGrams, "actGrams");

          return {
            ...obj,
            TOUCH: totalTouch,
            FINALGOLD: finalGold?.toFixed(3),
            ACTPER: actPer?.toFixed(3),
            PIECES: obj?.PIECES || 0,
            GROSSWEIGHT: obj?.GWT?.toFixed(3) || 0,
            STONEWT: obj?.STONEWT?.toFixed(3) || 0,
            NETWT: obj?.NWT?.toFixed(3) || 0,
            // ACTGRAMS: actGrams[0]?.ACTGRAMS, // Ensure actm is a valid string here
          };
        });
        const updatedData = [...prevData, ...newObjects];
        const total = updatedData.reduce(
          (sum, item) => sum + Number(item.PIECES || 0),
          0
        );
        const totalGross = updatedData.reduce(
          (sum, item) => sum + Number(item.GROSSWEIGHT || 0),
          0
        );
        const totalStones = updatedData.reduce(
          (sum, item) => sum + Number(item.STONEWT || 0),
          0
        );
        const totalNetWt = updatedData.reduce(
          (sum, item) => sum + Number(item.NETWT || 0),
          0
        );
        const totalGold = updatedData.reduce(
          (sum, item) => sum + Number(item.FINALGOLD || 0),
          0
        );

        // Set totals
        setTotalPieces(total);
        setTotalGrossWeight(totalGross);
        setTotalStoneWeight(totalStones);
        setTotalNetWeight(totalNetWt);
        setTotalFineGold(totalGold);

        return updatedData;
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    estimationCountAPI();
    partyNamesAPI();
    if (selectEstimationNo?.ESTIMATIONDATE) {
      setSelectedDate(dayjs(selectEstimationNo.ESTIMATIONDATE));
    }
    if (selectEstimationNo?.MCPER) {
      setMakingValue(selectEstimationNo?.MCPER);
    }
    if (selectEstimationNo?.MCAMT) {
      setPerGramValue(selectEstimationNo?.MCAMT);
    }
    if (selectEstimationNo?.RCHARGES) {
      setRodiumChargeValue(selectEstimationNo?.RCHARGES);
    }
    if (selectEstimationNo?.TOUCHPER) {
      setTouchValue(selectEstimationNo?.TOUCHPER);
    }
    if (selectEstimationNo?.WASTAGE) {
      setWastageValue(selectEstimationNo?.WASTAGE);
    }
    if (selectEstimationNo?.DESCRIPTION) {
      const matchedParty = partyNames.find(
        (party) => party.Dealername === selectEstimationNo.DESCRIPTION
      );
      if (matchedParty) {
        setSelectedParty(matchedParty.Dealername);
      }
    }
  }, [selectEstimationNo]);

  const handleDelete = (tagNo) => {
    setTableData((prevData) => {
      const updatedData = prevData.filter((item) => item.TAGNO !== tagNo);

      setStonesData([]);
      setStoneMainData([]);

      updatedData.forEach((item) => {
        stonesAPI(item.TAGNO);
      });

      return updatedData;
    });

    const deletedItem = tableData.find((item) => item.TAGNO === tagNo);
    if (deletedItem) {
      setTotalPieces((prev) => prev - (deletedItem.PIECES || 0));
      setTotalGrossWeight((prev) => prev - (deletedItem.GROSSWEIGHT || 0));
      setTotalStoneWeight((prev) => prev - (deletedItem.STONEWT || 0));
      setTotalNetWeight((prev) => prev - (deletedItem.NETWT || 0));
      setTotalFineGold((prev) => prev - (deletedItem.FINALGOLD || 0));
    }
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleTagNoKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitRef.current?.click();
    }
  };
  const handlePartyChange = () => {
    touchRef.current?.focus();
  };

  const totalStoneCost = stonesData.reduce((total, stone, index) => {
    const rate = stoneRate[index] || 0; // Get the rate for the row or default to 0
    return total + stone.ACTGRAMS * rate; // Add the multiplied value to total
  }, 0);
  const totalCash =
    (Number(totalStoneCost) || 0) +
    (Number(perGramValue) || 0) +
    (Number(rodiumChargeValue) || 0);
  const getFormattedDate = () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-based) and add 1
    const day = String(date.getDate()).padStart(2, "0"); // Get day
    const year = date.getFullYear(); // Get year
    return `${year}-${month}-${day}`;
  };
  const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;

  const createEstimationData = async () => {
    const requestBody = tableData.map((stone, index) => {
      const actGrams =
        stoneMainData.find((item) => item.TAGNO === stone.TAGNO)?.ACTGRAMS ||
        "";
      const removeUndefinedWrapper = (str) => {
        let cleanedStr = str;
        let prevStr;
        do {
          prevStr = cleanedStr;
          cleanedStr = cleanedStr
            .replace(/undefined\(\s*(.*?)\s*\)/g, "$1")
            .trim();
        } while (prevStr !== cleanedStr);
        return cleanedStr;
      };
      const cleanedActGrams = removeUndefinedWrapper(actGrams);

      return {
        estimationtype: "estimation",
        estimationno: selectEstimationNo
          ? selectEstimationNo?.ESTIMATIONNO
          : estimationCount + 1,
        estimationdate: formattedDate,
        description: selectedParty,
        sno: index + 1 || 0,
        tagno: stone.TAGNO || "-",
        prodname: stone.PRODNAME || "-",
        gwt: Number(stone.GWT) || 0,
        stonewt: Number(stone.STONEWT) || 0,
        nwt: Number(stone.NETWT) || 0,
        mix: 0,
        rE_EM: 0,
        rb: 0,
        others: 0,
        cz: 0,
        re: 0,
        rr: 0,
        ee: 0,
        dp: 0,
        ds: 0,
        ch: 0,
        ep: 0,
        pf: 0,
        st: 0,
        gr: 0,
        ge: 0,
        dr: 0,
        dc: 0,
        bd: 0,
        bb: 0,
        etype: "-",
        billno: 0,
        billdate: formattedDate,
        status: false,
        apprtnstatus: false,
        tray: false,
        branchcode: "-",
        branchname: "-",
        ssp: 0,
        descriptioN1: "-",
        pieces: stone.PIECES || 0,
        diffswt: 0,
        appno: 0,
        appdate: formattedDate,
        prefix: stone.PREFIX || "-",
        touch: stone.TOUCH || 0,
        wastage: Number(wastageValue) || 0,
        finegold: Number(stone.FINALGOLD) || 0,
        actper: Number(stone.ACTPER) || 0,
        stdet: cleanedActGrams,
        homekey: 0,
      };
    });
    console.log(requestBody, "requestBody");
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalEstimationData`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );
      let data = response?.data;
      setEstimationData(data[0].isInsert);

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationItems = async () => {
    const requestBody = stonesData.map((stone, index) => ({
      estimationno: selectEstimationNo
        ? selectEstimationNo?.ESTIMATIONNO
        : estimationCount + 1,
      estimationdate: formattedDate,
      sno: index + 1,
      stonename: stone?.MAINTYPE,
      pcs: stone?.PCS,
      cts: Number(stone?.CTS?.toFixed(3)),
      gms: Number(stone?.ACTGRAMS?.toFixed(3)),
      rate: Number(stoneRate[index]) || 0,
      amt: parseFloat((stone.ACTGRAMS * (stoneRate[index] || 0)).toFixed(2)),
      priority: 0,
      calcrate: "-",
    }));
    console.log(requestBody, "requestBody");
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalEstimationItems`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );
      let data = response?.data;
      setItemData(data[0].isInsert);

      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationMast = async () => {
    const totalTouch = Number(touchValue) + Number(wastageValue);
    const requestBody = [
      {
        estimationtype: "estimation",
        estimationno: selectEstimationNo
          ? selectEstimationNo?.ESTIMATIONNO
          : estimationCount + 1,
        estimationdate: formattedDate,
        description: selectedParty,
        gwt: Number(totalGrossWeight.toFixed(3)),
        stonewt: Number(totalStoneWeight.toFixed(3)),
        nwt: Number(totalNetWeight.toFixed(3)),
        mix: 0,
        rE_EM: 0,
        rb: 0,
        others: 0,
        cz: 0,
        re: 0,
        rr: 0,
        ee: 0,
        dp: 0,
        ds: 0,
        ch: 0,
        ep: 0,
        pf: 0,
        st: 0,
        gr: 0,
        ge: 0,
        dr: 0,
        dc: 0,
        bd: 0,
        bb: 0,
        etype: "-",
        billno: 0,
        billdate: formattedDate,
        status: false,
        tray: false,
        branchcode: "-",
        branchname: "-",
        totpcs: totalPieces,
        ssp: 0,
        appno: 0,
        appdate: formattedDate,
        rbrate: 0,
        czrate: 0,
        ssprate: 0,
        beadsrate: 0,
        othersrate: 0,
        mixrate: 0,
        wastper: 0,
        wastage: Number(wastageValue),
        wt: 0,
        touchper: Number(touchValue),
        touch: Number(totalTouch),
        purewt: Number(totalFineGold?.toFixed(3)),
        mcper: Number(makingValue),
        mcamt: Number(perGramValue.toFixed(3)),
        stcharges: Number(totalStoneCost.toFixed(2)),
        totcash: Number(totalCash.toFixed(2)),
        stgmrate: "-",
        rcharges: Number(rodiumChargeValue),
      },
    ];
    console.log(requestBody, "requestBody");

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalEstimationMast`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );
      let data = response?.data;
      setMastData(data[0].isInsert);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationNoDataAPI = async (estNo) => {
    try {
      let whereCondition = "";
      if (estNo) {
        whereCondition = `ESTIMATIONNO=${estNo}`;
      }
      let params = {
        tableName: "ESTIMATION_DATA",
        where: whereCondition,
        order: "SNO",
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

      if (Array.isArray(data) && data.length > 0) {
        const updatedData = data.map((item, index) => ({
          ACTPER: item.ACTPER,
          ACTSWT: 0.2,
          BALGWT: 1500,
          BALNWT: 1500,
          BALPIECES: 0,
          BALSTONEWT: 0,
          BRANCHCODE: "",
          BRANCHNAME: "",
          CNAME: "",
          CZ: 0,
          DIFFSWT: 0,
          DIFFWT: 0,
          ENTRYNO: 0,
          FINALGOLD: item.FINEGOLD,
          GROSSWEIGHT: item.GWT,
          GWT: item.GWT,
          HUID1: "-",
          HUID2: "-",
          ITEM_TOTCTS: 1,
          ITEM_TOTGMS: 0,
          ITEM_TOTPCS: 0,
          LOTNO: 2,
          MIX: 0,
          NETWT: item.NWT,
          NWT: item.NWT,
          ORDERITEM: false,
          ORDERNO: ".",
          OTHERS: 0,
          PIECES: item.PIECES,
          PREFIX: item.PREFIX,
          PRODNAME: item.PRODNAME,
          RB: 0,
          RECYCLE: "NO",
          RE_EM: 0,
          SERIALNO: 242,
          SLIPNO: 79,
          SNO: 904,
          SSP: 0,
          SSTATUS: false,
          STONEWT: item.STONEWT,
          TAGDATE: "2025-03-04T00:00:00",
          TAGNO: item.TAGNO,
          TAGTIME: "1900-01-01T06:27:17",
          TAG_PRE: "*",
          TOTGWT: 30.23,
          TOTNWT: 26.13,
          TOTPCS: 2,
          TOTSTONEWT: 4.1,
          TOUCH: item.TOUCH,
          VNO: 0,
          slipdate: "2025-03-04T00:00:00",
          workername: "HIRU - A4",
        }));
        const stones = data.map((item, index) => ({
          TAGNO: item.TAGNO,
          ACTGRAMS: item.STDET,
        }));
        setStoneMainData(stones);
        setTableData(updatedData);
        const total = updatedData.reduce(
          (sum, item) => sum + Number(item.PIECES || 0),
          0
        );
        const totalGross = updatedData.reduce(
          (sum, item) => sum + Number(item.GROSSWEIGHT || 0),
          0
        );
        const totalStones = updatedData.reduce(
          (sum, item) => sum + Number(item.STONEWT || 0),
          0
        );
        const totalNetWt = updatedData.reduce(
          (sum, item) => sum + Number(item.NETWT || 0),
          0
        );
        const totalGold = updatedData.reduce(
          (sum, item) => sum + Number(item.FINALGOLD || 0),
          0
        );

        // Set totals
        setTotalPieces(total);
        setTotalGrossWeight(totalGross);
        setTotalStoneWeight(totalStones);
        setTotalNetWeight(totalNetWt);
        setTotalFineGold(totalGold);

        setSelectedObject(null);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const estimationNoItemsAPI = async (estNo) => {
    try {
      let whereCondition = "";
      if (estNo) {
        whereCondition = `ESTIMATIONNO=${estNo}`;
      }
      let params = {
        tableName: "ESTIMATION_ITEMS",
        where: whereCondition,
        order: "SNO",
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
      console.log("data", data);

      if (Array.isArray(data) && data.length > 0) {
        const updatedData = data.map((item, index) => ({
          ACTCTS: 0,
          ACTGRAMS: item?.gms,
          BRANCHCODE: "",
          BRANCHNAME: "",
          CTS: item?.cts,
          CTSPER: 0,
          DIFFWT: null,
          ENTRYNO: 0,
          GMS: 0,
          IACTSWT: 0,
          IDIFFSWT: 0,
          ITEMCODE: "8J ADROUND",
          MAINTYPE: item?.stonename,
          PCS: item?.pcs,
          PCSWT: 0,
          RECYCLE: "NO",
          SERIALNO: 0,
          SLIPNO: 0,
          SNO: item?.sno,
          SSTATUS: false,
          STONENAME: "-",
          StoneCode: "-",
          TAGNO: "-",
          VNO: 0,
        }));

        const stoneRateObj = data.reduce((acc, item, index) => {
          acc[index] = String(item.rate || "0"); // Convert to string and default to "0"
          return acc;
        }, {});

        setStonesData(updatedData);
        setStoneRate(stoneRateObj);

        setSelectedObject(null);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const estimationDeleteData = async () => {
    
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_DATA&where=ESTIMATIONNO=${selectEstimationNo?.ESTIMATIONNO}`,
        {
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteMast = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_MAST&where=ESTIMATIONNO=${selectEstimationNo?.ESTIMATIONNO}`,
        {
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteItems = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=ESTIMATION_ITEMS&where=ESTIMATIONNO=${selectEstimationNo?.ESTIMATIONNO}`,
        {
          headers: {
            tenantName: "fd7V0CCCS3URhSfa/g6drA==",
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleReset = () => {
    setTableData([]); // Clear the table data
    setStonesData([]);
    setStoneMainData([]);
    setSelectedParty(null);
    setWastageValue(0);
    setTouchValue(0);
    setTotalPieces(0);
    setTotalGrossWeight(0);
    setTotalStoneWeight(0);
    setTotalNetWeight(0);
    setTotalFineGold(0);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
    setStoneRate({});
    setMakingValue(0);
    setPerGramValue(0);
    setRodiumChargeValue(0);
    estimationCountAPI();
    setSelectEstimationNo(null);
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
      title: "Tag No",
      dataIndex: "TAGNO",
      key: "TAGNO",
      align: "left",

      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.TAGNO}</div>
          </>
        );
      },
    },
    {
      title: "Item Name",
      dataIndex: "PRODNAME",
      key: "PRODNAME",
      align: "center",
      align: "left",
      render: (text, record) => {
        return (
          <>
            <div>{record?.PRODNAME}</div>
          </>
        );
      },
    },
    {
      title: "Purity",
      dataIndex: "PREFIX",
      key: "PREFIX",
      align: "right",
      render: (text, record) => {
        return (
          <>
            <div>{record?.PREFIX}</div>
          </>
        );
      },
    },
    {
      title: "Pieces",
      dataIndex: "PIECES",
      key: "PIECES",
      width: 100,
      align: "right",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.PIECES}</div>
          </>
        );
      },
    },
    {
      title: "Gross.Wt",
      dataIndex: "GWT",
      key: "GWT",
      align: "right",
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
      dataIndex: "ACTSWT",
      key: "ACTSWT",
      align: "right",
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
      dataIndex: "NETWT",
      key: "NETWT",
      align: "right",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.NETWT}</div>
          </>
        );
      },
    },
    {
      title: "Touch",
      dataIndex: "TOUCH",
      key: "TOUCH",
      align: "right",
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
      dataIndex: "FINALGOLD",
      key: "FINALGOLD",
      align: "right",
      render: (text, record) => {
        return (
          <>
            <div style={{ fontWeight: "bold" }}>{record?.FINALGOLD}</div>
          </>
        );
      },
    },
    {
      title: "Act Per",
      dataIndex: "ACTPER",
      key: "ACTPER",
      align: "right",
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
      dataIndex: "ACTGRAMS",
      key: "ACTGRAMS",
      align: "center",
      width: 80,
      render: (text, record) => {
        const actGrams =
          stoneMainData.find((item) => item.TAGNO === record.TAGNO)?.ACTGRAMS ||
          "";

        const removeUndefinedWrapper = (str) => {
          let prevStr;
          do {
            prevStr = str;
            str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
          } while (prevStr !== str);
          return str;
        };

        const cleanedActGrams = removeUndefinedWrapper(actGrams);

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
    // {
    //   title: "Homekey",
    //   dataIndex: "Homekey",
    //   key: "Homekey",
    //   align: "right",
    //   render: (text, record) => {
    //     return (
    //       <>
    //         <div>0</div>
    //       </>
    //     );
    //   },
    // },
    {
      title: "Actions",
      dataIndex: "Actions",
      key: "Actions",
      align: "center",
      render: (text, record) => (
        <DeleteOutlined
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleDelete(record.TAGNO)}
        />
      ),
    },
  ];

  const StoneColumns = [
    {
      title: "SNo",
      dataIndex: "SNo",
      key: "sno",
      className: "blue-background-column",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Item Name",
      dataIndex: "MAINTYPE",
      key: "MAINTYPE",
      width: 100,
      render: (text, record) => {
        return (
          <>
            <div>{record?.MAINTYPE}</div>
          </>
        );
      },
    },
    {
      title: "Pcs",
      dataIndex: "PCS",
      key: "PCS",
      render: (text, record) => {
        return (
          <>
            <div>{record?.PCS}</div>
          </>
        );
      },
    },
    {
      title: "Grams",
      dataIndex: "ACTGRAMS",
      key: "ACTGRAMS",
      render: (text, record) => {
        return (
          <>
            <div>{record?.ACTGRAMS?.toFixed(3)}</div>
          </>
        );
      },
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (text, record, index) => (
        <Input
          style={{ width: "100%" }}
          placeholder="Enter Rate"
          value={stoneRate[index] || ""}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 8) {
              setStoneRate((prevRates) => ({
                ...prevRates,
                [index]: value,
              }));
            }
          }}
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render: (text, record, index) => {
        const rate = parseFloat(stoneRate[index]) || 0; // Get rate for this row
        return <div>{(rate * record.ACTGRAMS).toFixed(2)}</div>; // Calculate Amount
      },
    },
  ];

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=700,width=900");

    printWindow.document.write(
      "<html><head><title>Estimation Report</title><style>"
    );

    // Custom Print Styles
    printWindow.document.write(`
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }
        .sub-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-top: 5px;
        }
        th, td {
            border: 1px solid black;
            padding: 5px;
            text-align: center;
        }
        th {
            background-color: #e0e0e0;
            font-weight: bold;
        }
        .total {
            font-weight: bold;
            background-color: #ddd;
        }
        .summary {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        }
        .summary-box {
            width: 48%;
            border: 1px solid black;
            padding: 10px;
            font-size: 12px;
        }
        .summary-box table {
            width: 100%;
            border: none;
        }
        .summary-box td {
            border: none;
            text-align: left;
            padding: 3px 0;
        }
        .footer {
            margin-top: 15px;
            font-size: 12px;
        }
    `);

    printWindow.document.write("</style></head><body>");

    // Header Section
    printWindow.document.write(`
        <div class="header">
            <h2>ESTIMATION</h2>
        </div>
        <div class="sub-header">
            <span>ESTIMATION NO. : ${estimationCount + 1}</span>
            <span>DATE : ${new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}</span>
            <span>PARTY NAME : ${selectedParty}</span>
        </div>
    `);

    // Main Table
    printWindow.document.write(`
      <style>
          table {
              width: 100%;
              border-collapse: collapse;
              border: 2px solid black;
              font-family: Arial, sans-serif;
              font-size: 12px;
          }
          th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: center;
              vertical-align: middle;
          }
          th {
              font-weight: bold;
              background-color: #f0f0f0;
          }
          td strong {
              font-size: 12px;
          }
          td span {
              font-size: 10px;
          }
          .total td {
              font-weight: bold;
              background-color: #f0f0f0;
          }
          /* Ensuring sub-text like STONES: and PEARLS: appear correctly */
          td div.sub-text {
              text-align: left;
              font-size: 10px;
              font-weight: bold;
          }
          td div.sub-value {
              text-align: left;
              font-size: 10px;
          }
          /* Row styling for sub-details */
          tr.sub-row td {
              border-top: none;
              text-align: left;
          }
              .sub {
              text-align: left;
              }
              .sub-right {
              text-align: right;
              }
      </style>
      <table>
          <thead>
              <tr>
                  <th>SNo</th><th>TAG NO</th><th class="sub">PARTICULARS</th><th>Pieces</th><th class="sub-right">Gross.Wt</th>
                  <th class="sub-right">Less.Wt</th><th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-right">Fine Gold</th><th class="sub-right">Act Per</th>
              </tr>
          </thead>
          <tbody>
    `);

    let totalPCS = 0;
    let totalGWT = 0;

    tableData.forEach((item, index) => {
      const actGrams =
        stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
        "";
      const removeUndefinedWrapper = (str) => {
        let prevStr;
        do {
          prevStr = str;
          str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
        } while (prevStr !== str);
        return str;
      };
      const cleanedActGrams = removeUndefinedWrapper(actGrams);
      printWindow.document.write(`
          <tr>
              <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
        index + 1
      }</strong></td>
              <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
        item.TAGNO
      }</strong></td>
              <td class="sub"><strong>${item.PRODNAME}</strong></td>
              <td class="sub-right"><strong>${item.PIECES}</strong></td>
              <td class="sub-right"><strong>${item.GWT?.toFixed(
                3
              )}</strong></td>
              <td class="sub-right"><strong />${item.STONEWT}</td>
              <td class="sub-right"> <strong />${item.NETWT}</td>
              <td class="sub-right"><strong />${item.TOUCH}%</td>
              <td class="sub-right"><strong />${item.FINALGOLD}</td>
              <td class="sub-right"><strong />${item.ACTPER}%</td>
          </tr>
      `);

      // Add sub-details row for stones/pearls if available
      if (cleanedActGrams) {
        printWindow.document.write(`
          <tr class="sub-row">
              <td colspan="9" class="sub-text">${cleanedActGrams}</td>
          </tr>
        `);
      }

      totalPCS += item.PIECES;
      totalGWT += item.GWT;
    });

    printWindow.document.write(`
          <tr class="total">
              <td colspan="3">Total</td>
              <td>${totalPCS}</td>
              <td>${totalGWT.toFixed(3)}</td>
              <td></td><td></td><td></td><td></td><td></td>
          </tr>
      </tbody>
    </table>
    `);

    // Stone Details Table
    printWindow.document.write(`
      <style>
          body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              margin: 20px;
          }
          .container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              width: 100%;
              margin-top: 10px;
          }
          .table-container {
              width: 55%;
          }
          .summary-container {
              width: 35%;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              border: 2px solid black;
          }
          th, td {
              border: 1px solid black;
              padding: 5px;
              text-align: center;
              vertical-align: middle;
          }
          th {
              font-weight: bold;
              background-color: #f0f0f0;
          }
          .total td {
              font-weight: bold;
              background-color: #dcdcdc;
              text-align: right;
          }
          .summary-box {
              padding: 5px;
          }
          .summary-box table {
              width: 100%;
              border-collapse: collapse;
          }
          .summary-box td {
              padding: 5px;
              border: 1px solid black;
              text-align: left;
          }
          .summary-box td:nth-child(2) {
              text-align: right;
              font-weight: bold;
          }
          .footer {
              margin-top: 10px;
              font-size: 12px;
              text-align: left;
              padding-top: 5px;
          }
          .footer p {
              margin: 3px 0;
          }
              .stone-name {
              text-align: left;
              }
              .sub-right {
              text-align: right;
              }
              .sub-final {
              background-color:rgb(191, 186, 186);
              }
              .sub-text {
              text-align: right;
              }
      </style>
    
      <div class="container">
          <!-- Left Side: Stones Table -->
          <div class="table-container">
              <table>
                  <thead>
                      <tr>
                          <th class="stone-name">STONE NAME</th><th>PIECES</th><th class="sub-right">WEIGHT</th><th class="sub-right">COST</th><th class="sub-right">AMOUNT</th>
                      </tr>
                  </thead>
                  <tbody>
    `);

    let totalStoneWeight = 0;
    let totalAmount = 0;

    stonesData.forEach((stone, index) => {
      const rate = stoneRate[index] || 0; // Get the rate for the row or default to 0
      const amount = stone.ACTGRAMS * rate; // Calculate amount per row
      totalAmount += amount;
      printWindow.document.write(`
        <tr>
          <td class="stone-name">${stone.MAINTYPE}</td>
          <td>${stone.PCS}</td>
          <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
          <td class="sub-right">${
            rate || "0.00"
          }</td>  <!-- Get rate per row -->
          <td class="sub-right">${amount?.toFixed(
            2
          )}</td>  <!-- Calculate amount -->
        </tr>
      `);
      totalStoneWeight += stone.ACTGRAMS;
    });

    printWindow.document.write(`
                  <tr class="total">
                      <td colspan="2"></td>
                      <td>${totalStoneWeight.toFixed(3)}</td>
                      <td></td><td>${totalAmount.toFixed(2)}</td>
                  </tr>
              </tbody>
          </table>
      </div>
    
      <!-- Right Side: Summary Box -->
      <div class="summary-container">
              <table>
                  <tr><td class="stone-name">Net Weight</td><td class="sub-right"> <strong />${totalNetWeight.toFixed(
                    3
                  )}</td></tr>
                  <tr class="sub-final"><td class="stone-name"><strong />Fine Gold</td><td class="sub-right"><strong /> ${(
                    totalFineGold * 0.94
                  ).toFixed(3)}</td></tr>
                  <tr><td class="stone-name">Making ${makingValue} /g</td><td class="sub-right"><strong />${perGramValue.toFixed(
      3
    )}</td></tr>
                  <tr><td class="stone-name">Rodium Charges</td><td class="sub-right"><strong />${rodiumChargeValue}</td></tr>
                  <tr><td class="stone-name">Stone Cost</td><td class="sub-right"> <strong />${totalStoneCost?.toFixed(
                    2
                  )}</td></tr>
                  <tr class="sub-final"><td class="stone-name"><strong>Total Cash</strong></td><td class="sub-right"><strong>${totalCash.toFixed(
                    2
                  )}</strong></td></tr>
              </table>
      </div>
    </div>
    `);

    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Spin spinning={loading} tip="Loading...">
      <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
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
            <Card
              style={{
                backgroundColor: "darkblue",
                color: "#fff",
                flex: "0 1 150px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              {/* Wrapper for Two Columns */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left Side: Estimation & Count Centered */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    Estimation
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {selectEstimationNo
                      ? selectEstimationNo?.ESTIMATIONNO
                      : estimationCount + 1}
                  </div>
                </div>

                {/* Right Side: FolderAddOutlined Centered */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                    backgroundColor: "green",
                    borderRadius: "50%", // Ensures a perfect circle
                    width: "30px", // Adjusted for better visibility
                    height: "30px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  <FolderAddOutlined style={{ fontSize: "16px" }} />
                </div>
              </div>
            </Card>

            {/* Party Name Select */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: "1 1 200px",
              }}
            >
              <div>Party Name:</div>
              <Select
                showSearch
                placeholder="Select Party Name"
                autoFocus={true}
                style={{ width: "60%" }}
                ref={partyRef}
                value={selectedParty || null}
                onChange={(value) => {
                  setSelectedParty(value);
                  handlePartyChange();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const filteredOptions = partyNames.filter((party) =>
                      party.Dealername.toLowerCase().includes(
                        e.target.value.toLowerCase()
                      )
                    );
                    if (filteredOptions.length > 0) {
                      setSelectedParty(filteredOptions[0].Dealername);
                    }
                  }
                }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {partyNames.map((party, index) => (
                  <Option key={index} value={party.Dealername}>
                    {party.Dealername}
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
                flex: "1 1 200px",
              }}
            >
              <div>Touch:</div>
              <Input
                placeholder="Enter Touch"
                ref={touchRef}
                style={{ width: "60px", height: 30 }}
                onKeyDown={(e) => handleKeyDown(e, wastRef)}
                value={touchValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 2) {
                    setTouchValue(value);
                  }
                }}
              />
              <div>Wast:</div>
              <Input
                placeholder="Enter Wast"
                ref={wastRef}
                style={{ width: "60px", height: 30 }}
                onKeyDown={(e) => handleKeyDown(e, tagNoRef)}
                value={wastageValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 2) {
                    setWastageValue(value);
                  }
                }}
              />
            </div>

            {/* Tag No Input */}
            <Card
              style={{
                textAlign: "center",
                backgroundColor: "#52bd91",
                color: "#fff",
                flex: "1 1 150px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "500" }}>Tag No</div>
              <Input
                placeholder="Enter Tag No"
                ref={tagNoRef}
                style={{
                  width: "100%",
                  height: 30,
                  fontSize: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                onKeyDown={handleTagNoKeyDown}
                disabled={
                  selectedParty && touchValue && wastageValue ? false : true
                }
                value={tagNoValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 8) {
                    setTagNoValue(value);
                  }
                }}
              />
            </Card>

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "#0C1154",
                borderColor: "#0C1154",
                flex: "0 1 80px",
              }}
              ref={submitRef}
              onClick={() => {
                stonesAPI();
                mainAPI();
                setTagNoValue("");
              }}
            >
              Submit
            </Button>

            {/* Date Picker */}
            <Card
              style={{
                textAlign: "center",
                backgroundColor: "darkblue",
                color: "#fff",
                flex: "0 1 150px",
              }}
            >
              <div style={{ fontSize: "14px", fontWeight: "500" }}>Date</div>
              <DatePicker
                style={{ width: "100%" }}
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(date) => {
                  setSelectedDate(date);
                  console.log(date, "date");
                }}
                format="DD-MMM-YYYY" // Format: 11-Mar-2025
              />
            </Card>
            {/* <motion.div
          animate={isRotating ? { rotate: 360 } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={handleReset}
          style={{ display: "inline-block", cursor: "pointer" }}
        > */}
            <Button type="primary" danger onClick={handleReset}>
              Reset
            </Button>
            {/* </motion.div> */}
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
                  dataSource={tableData}
                  pagination={false}
                  size="small"
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "table-row-light" : "table-row-dark"
                  }
                  scroll={{ y: 190 }} // Internal scroll inside table
                />
              </TableHeaderStyles>
            </div>
          </Col>
        </Row>
        <Row
          gutter={16}
          style={{
            marginTop: "5px",
            background: "#f8f9fa",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <Col span={8}>
            <Table
              columns={StoneColumns}
              dataSource={stonesData}
              pagination={false}
              size="small"
            />
          </Col>

          <Col span={8}>
            <Card
              style={{
                background: "#d4edda",
                borderRadius: "8px",
                padding: "10px",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {[
                { label: "Total Pieces", value: totalPieces },
                { label: "Gross Weight", value: totalGrossWeight.toFixed(3) },
                { label: "Stone Weight", value: totalStoneWeight.toFixed(3) },
                { label: "Net Weight", value: totalNetWeight.toFixed(3) },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <label style={{ textAlign: "left", flex: 1 }}>
                    {item.label}
                  </label>
                  <span style={{ flex: 0.1 }}>:</span>
                  <div style={{ textAlign: "right", flex: 1 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </Card>
          </Col>

          <Col span={8}>
            <Card
              style={{
                background: "#d4edda",
                borderRadius: "8px",
                padding: "10px",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              {[
                { label: "NET Weight", value: totalNetWeight.toFixed(3) },
                { label: "Fine Gold", value: totalFineGold.toFixed(3) },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <label style={{ width: "50%", textAlign: "left" }}>
                    {item.label}
                  </label>
                  <span style={{ flex: 0.1 }}>:</span>
                  <div style={{ textAlign: "right", flex: 1 }}>
                    {item.value}
                  </div>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <label style={{ width: "18%", textAlign: "left" }}>
                  Making
                </label>
                <Input
                  style={{ width: "15%" }}
                  value={makingValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 2) {
                      setMakingValue(value);
                      setPerGramValue(makingValue * totalNetWeight);
                    }
                  }}
                />
                <span style={{ color: "red", marginLeft: 5 }}>Per Gm.</span>
                <span style={{ flex: 0.1 }}>:</span>
                <Input
                  style={{ width: "40%", textAlign: "right", flex: 1 }}
                  placeholder="0.00"
                  value={perGramValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 8) {
                      setPerGramValue(e.target.value);
                    }
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <label style={{ width: "50%", textAlign: "left" }}>
                  Rodium Charges
                </label>
                <span style={{ flex: 0.1 }}>:</span>
                <Input
                  style={{ width: "50%", textAlign: "right", flex: 1 }}
                  placeholder="Rodium Charges"
                  value={rodiumChargeValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 8) {
                      setRodiumChargeValue(e.target.value);
                    }
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <label style={{ width: "50%", textAlign: "left" }}>
                  Stone Cost
                </label>
                <span style={{ flex: 0.1 }}>:</span>
                {/* <Input
                style={{
                  width: "50%",
                  background: "#e8f5e9",
                  textAlign: "right",
                  flex: 1,
                }}
                placeholder="Stone Cost"
              /> */}
                <div style={{ textAlign: "right", flex: 1 }}>
                  {selectEstimationNo
                    ? selectEstimationNo?.STCHARGES
                    : totalStoneCost?.toFixed(2)}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label
                  style={{
                    width: "50%",
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  Total Cash
                </label>
                <span style={{ flex: 0.1 }}>:</span>
                {/* <Input
                style={{
                  width: "50%",
                  background: "#2196f3",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "right",
                  flex: 1,
                }}
                placeholder="0.00"
              /> */}
                <div
                  style={{
                    textAlign: "right",
                    background: "#2196f3",
                    color: "white",
                    fontWeight: "bold",
                    flex: 1,
                  }}
                >
                  {selectEstimationNo
                    ? selectEstimationNo?.TOTCASH
                    : totalCash.toFixed(2)}
                </div>
              </div>
            </Card>
          </Col>
          <Col
            span={2}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Button type="primary">Finalize</Button>
            <Button
              type="default"
              disabled={tableData.length === 0 && stonesData.length === 0}
              onClick={() => {
                if (selectEstimationNo?.ESTIMATIONNO) {
                  createEstimationMast();
                  createEstimationData();
                  createEstimationItems();
                  setSelectEstimationNo(null);
                  estimationDeleteData();
                  estimationDeleteItems();
                  estimationDeleteMast();
                  handleReset();
                } else {
                  createEstimationMast();
                  createEstimationData();
                  createEstimationItems();
                  setSelectEstimationNo(null);
                  handleReset();
                }
              }}
            >
              Save
            </Button>
            <Button
              type="dashed"
              onClick={handlePrint}
              disabled={tableData.length === 0}
            >
              Print
            </Button>
            <Button type="default">Cancel</Button>
            {/* <EstimationReport
            columns={columns}
            data={tableData}
            StoneColumns={StoneColumns}
            stonesData={stonesData}
            estimationCount={estimationCount}
            selectedParty={selectedParty}
            totalNetWeight={totalNetWeight}
            totalFineGold={totalFineGold}
            totalGrossWeight={totalGrossWeight}
            totalStoneWeight={totalStoneWeight}
            totalPieces={totalPieces}
          /> */}
          </Col>
        </Row>
        <EstimationDialog
          setOpenDialog={setOpenDialog}
          openDialog={openDialog}
          estimationNoDataAPI={estimationNoDataAPI}
          setSelectedObject={setSelectedObject}
          selectedObject={selectedObject}
          setSelectEstimationNo={setSelectEstimationNo}
          estimationNoItemsAPI={estimationNoItemsAPI}
        />
      </div>
    </Spin>
  );
};
export default Estimation;
