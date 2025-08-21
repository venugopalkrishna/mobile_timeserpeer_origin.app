import {
  DeleteOutlined,
  FilePdfOutlined,
  FilterOutlined,
  PrinterOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { Box } from "@mui/material";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Typography,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";
import { Html5Qrcode } from "html5-qrcode";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   PDFDownloadLink,
//   Image
// } from "@react-pdf/renderer";
import { useEffect, useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useLocation } from "react-router-dom";
import { CREATE_jwel } from "../../Config/Config";
import Header from "../Header";
import ImageDialog from "../Inventory/ImageDialog";
import SidebarDrawer from "../SidebarDrawer";
import styles from "./Estimation.module.css";
import EstimationDialog from "./EstimationDialog";
import EstimationDrawer from "./EstimationDrawer";
import EstimationFields from "./EstimationFields";
import EstimationStonesDrawer from "./EstimationStonesDrawer";
import logo from "../Assets/tlogo.png";

const { Option } = Select;
const Estimation = () => {
  const [form] = Form.useForm();
  const partyRef = useRef(null);
  const touchRef = useRef(null);
  const wastRef = useRef(null);
  const tagNoRef = useRef(null);
  const submitRef = useRef(null);
  const pathName = useLocation();
  const path = pathName?.pathname;
  const pathModel2 = path === "/estimations-model2";

  const [open, setOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectEstimationNo, setSelectEstimationNo] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [stonesData, setStonesData] = useState([]);
  const [stoneMainData, setStoneMainData] = useState([]);
  const [estimationCount, setEstimationCount] = useState(0);
  const [partyNames, setPartyNames] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [touchValue, setTouchValue] = useState();
  const [wastageValue, setWastageValue] = useState();
  const [tagNoValue, setTagNoValue] = useState();
  const [totalPieces, setTotalPieces] = useState();
  const [totalGrossWeight, setTotalGrossWeight] = useState();
  const [totalStoneWeight, setTotalStoneWeight] = useState();
  const [totalNetWeight, setTotalNetWeight] = useState();
  const [totalFineGold, setTotalFineGold] = useState();
  const [isRotating, setIsRotating] = useState(false);
  const [stoneRate, setStoneRate] = useState({});
  const [makingValue, setMakingValue] = useState();
  const [perGramValue, setPerGramValue] = useState();
  const [stoneMakingValue, setStoneMakingValue] = useState();
  const [stonePerGramValue, setStonePerGramValue] = useState();
  const [rodiumChargeValue, setRodiumChargeValue] = useState();
  const [fineGoldValue, setFineGoldValue] = useState();
  const [rateValue, setRateValue] = useState();
  const [amountValue, setAmountValue] = useState();
  const [cashBalanceValue, setCashBalanceValue] = useState();
  const [metalBalanceValue, setMetalBalanceValue] = useState();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [mastData, setMastData] = useState();
  const [itemData, setItemData] = useState();
  const [estimationData, setEstimationData] = useState();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stonesDrawerOpen, setStonesDrawerOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [scanOpen, setScanOpen] = useState(false);
  const [code, setCode] = useState();
  const [rateCut, setRateCut] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [tagNo, setTagNo] = useState();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [photos, setPhotos] = useState({});
  const [cameraOpenIndex, setCameraOpenIndex] = useState(null);
  const [base64Images, setBase64Images] = useState({});

  const formatDate = dayjs(selectEstimationNo?.ESTIMATIONDATE).format(
    "ddd, DD MMM YYYY HH:mm:ss [GMT]"
  );

  const imageUrls = localStorage.getItem("images")?.split(",");
  const imagesData = imageUrls?.length > 0 ? imageUrls : [];
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");

  const toggleDrawer = () => {
    setOpen(false);
  };

  // Estimation Count API
  const estimationCountAPI = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable?tableName=ESTIMATION_MAST&column=ESTIMATIONNO`,
        {
          headers: {
            tenantName: tenantName,
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
    // setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder?tableName=Dealer_Master&where=Custtype%3D%27CUSTOMER%27&order=Dealername`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
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
    }
    // finally {
    //   setLoading(false);
    // }
  };

  // Stones API
  const stonesAPI = async (tagNo) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_ITEMS&where=TAGNO='${
          tagNoValue ? tagNoValue : tagNo
        }'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      let newData = response.data;

      if (!Array.isArray(newData) || newData.length === 0) {
        message.warning("Tag Not existed");
        return null;
      }

      let finalData = [];

      setStoneMainData((prevData) => {
        const existingTag = prevData.some(
          (item) => item.TAGNO === (tagNoValue || tagNo)
        );

        if (existingTag) {
          return prevData;
        }

        const validNewData = newData.filter(
          (item) => item?.TAGNO && item?.MAINTYPE && item?.ACTGRAMS
        );

        const mergedMap = {};

        prevData.forEach((item) => {
          mergedMap[item.TAGNO] = { TAGNO: item.TAGNO, MAINTYPES: {} };

          if (typeof item.ACTGRAMS === "string") {
            item.ACTGRAMS.split(",").forEach((entry) => {
              const match = entry.trim().match(/^(.+?)\(([\d.]+)\)$/);
              if (match) {
                const type = match[1].trim();
                const grams = parseFloat(match[2]);
                if (type && !isNaN(grams)) {
                  mergedMap[item.TAGNO].MAINTYPES[type] = grams;
                }
              }
            });
          }
        });

        validNewData.forEach((item) => {
          const tagNo = item.TAGNO;
          const type = item.MAINTYPE;
          const grams = Number(item.ACTGRAMS) || 0;

          if (!mergedMap[tagNo]) {
            mergedMap[tagNo] = { TAGNO: tagNo, MAINTYPES: {} };
          }

          if (mergedMap[tagNo].MAINTYPES[type]) {
            mergedMap[tagNo].MAINTYPES[type] += grams;
          } else {
            mergedMap[tagNo].MAINTYPES[type] = grams;
          }
        });

        finalData = Object.values(mergedMap).map((item) => ({
          TAGNO: item.TAGNO,
          ACTGRAMS: Object.entries(item.MAINTYPES)
            .map(([key, value]) => `${key}(${(value || 0).toFixed(3)})`)
            .join(", "),
        }));

        return finalData;
      });

      // Merge into setStonesData
      if(!selectEstimationNo?.ESTIMATIONNO) {
      setStonesData((prevData) => {
        const combinedData = [...prevData, ...newData];

        const mergedData = combinedData.reduce((acc, item) => {
          const existingItem = acc.find((el) => el.MAINTYPE === item.MAINTYPE);
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

      return finalData; // ✅ return processed data
    } catch (error) {
      console.error("Error fetching TAG_ITEMS:", error);
      return null;
    }
  };

  // Main API
  const mainAPI = async (tagNo, stoneData) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TAGNO='${
          tagNoValue ? tagNoValue : tagNo
        }'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      // const existingTag = tableData.some((item) => item.TAGNO === tagNo);
      // if (existingTag && tagNo) {
      //   message.warning({
      //     content: (
      //       <span style={{ fontSize: "20px", fontWeight: "bold" }}>
      //         Tag {data[0]?.TAGNO} Already Existed
      //       </span>
      //     ),
      //   });
      // }
      if (scanOpen === true && tagNo) {
        message.success({
          content: (
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              Tag{" "}
              <span style={{ color: "red" }}>{response.data[0]?.TAGNO}</span>{" "}
              Scan Successfully
            </span>
          ),
        });
      }

      if (!Array.isArray(data) || data.length === 0) {
        message.warning("Tag Not existed");
        return;
      }

      setTableData((prevData) => {
        const existingTag = prevData.some(
          (item) => item.TAGNO === (tagNoValue || tagNo)
        );

        if (existingTag) {
          return prevData;
        }

        const newObjects = data.map((obj) => {
          const totalTouch =
            Number(touchValue || 0) + Number(wastageValue || 0);
          const finalGold = (Number(obj?.NWT) * totalTouch) / 100;
          const actPer = (Number(finalGold || 0) / Number(obj?.GWT || 0)) * 100;

          const stoneEntry = stoneData?.find((s) => s.TAGNO === obj.TAGNO);

          return {
            ...obj,
            TOUCH: totalTouch,
            FINALGOLD: finalGold?.toFixed(3),
            ACTPER: actPer?.toFixed(3),
            PIECES: obj?.PIECES || 0,
            GROSSWEIGHT: obj?.GWT?.toFixed(3) || 0,
            STONEWT: obj?.STONEWT?.toFixed(3) || 0,
            NETWT: obj?.NWT?.toFixed(3) || 0,
            ACTGRAMS: stoneEntry?.ACTGRAMS || "", // ✅ use passed stone data
          };
        });

        const updatedData = [...prevData, ...newObjects];

        // Totals
        setTotalPieces(
          updatedData.reduce((sum, item) => sum + Number(item.PIECES || 0), 0)
        );
        setTotalGrossWeight(
          updatedData.reduce(
            (sum, item) => sum + Number(item.GROSSWEIGHT || 0),
            0
          )
        );
        setTotalStoneWeight(
          updatedData.reduce((sum, item) => sum + Number(item.STONEWT || 0), 0)
        );
        setTotalNetWeight(
          updatedData.reduce((sum, item) => sum + Number(item.NETWT || 0), 0)
        );
        setTotalFineGold(
          updatedData.reduce(
            (sum, item) => sum + Number(item.FINALGOLD || 0),
            0
          )
        );

        return updatedData;
      });
    } catch (error) {
      console.error("Error fetching TAG_GENERATION:", error);
    }
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
    if (selectEstimationNo?.STCHARGES) {
      setStonePerGramValue(selectEstimationNo?.STCHARGES);
    }
    if (selectEstimationNo?.RCHARGES) {
      setRodiumChargeValue(selectEstimationNo?.RCHARGES);
      setStoneMakingValue(selectEstimationNo?.RCHARGES);
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

  // const handleDelete = (tagNo) => {
  //   setTableData((prevData) => {
  //     const updatedData = prevData.filter((item) => item.TAGNO !== tagNo);

  //     setStonesData([]);
  //     setStoneMainData([]);

  //     updatedData.forEach((item) => {
  //       stonesAPI(item.TAGNO);
  //     });

  //     return updatedData;
  //   });

  //   const deletedItem = tableData.find((item) => item.TAGNO === tagNo);
  //   if (deletedItem) {
  //     setTotalPieces((prev) => prev - (deletedItem.PIECES || 0));
  //     setTotalGrossWeight((prev) => prev - (deletedItem.GROSSWEIGHT || 0));
  //     setTotalStoneWeight((prev) => prev - (deletedItem.STONEWT || 0));
  //     setTotalNetWeight((prev) => prev - (deletedItem.NETWT || 0));
  //     setTotalFineGold((prev) => prev - (deletedItem.FINALGOLD || 0));
  //   }
  // };

  const handleDelete = (indexToDelete) => {
    setTableData((prevData) => {
      const deletedItem = prevData[indexToDelete]; // Get item before deleting

      const updatedData = prevData.filter(
        (_, index) => index !== indexToDelete
      );

      setStonesData([]);
      setStoneMainData([]);

      updatedData.forEach((item) => {
        stonesAPI(item.TAGNO);
      });

      // Update totals only if item existed
      if (deletedItem) {
        setTotalPieces((prev) => prev - (deletedItem.PIECES || 0));
        setTotalGrossWeight((prev) => prev - (deletedItem.GROSSWEIGHT || 0));
        setTotalStoneWeight((prev) => prev - (deletedItem.STONEWT || 0));
        setTotalNetWeight((prev) => prev - (deletedItem.NETWT || 0));
        setTotalFineGold((prev) => prev - (deletedItem.FINALGOLD || 0));
      }

      return updatedData;
    });
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
    (Number(stonePerGramValue) || 0) +
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
        stdet: cleanedActGrams || "-",
        homekey: 0,
      };
    });
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalEstimationData`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        }
      );
      let data = response?.data;
      setEstimationData(data[0].isInsert);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationItems = async () => {
    const requestBody = stonesData.map((stone, index) => ({
      estimationno: selectEstimationNo
        ? selectEstimationNo?.ESTIMATIONNO
        : estimationCount + 1 || 0,
      estimationdate: formattedDate,
      sno: index + 1 || 0,
      stonename: stone?.MAINTYPE || "-",
      pcs: stone?.PCS || 0,
      cts: Number(stone?.CTS).toFixed(3) || 0,
      gms: Number(stone?.ACTGRAMS).toFixed(3) || 0,
      rate: Number(stoneRate[index]) || 0,
      amt:
        parseFloat((stone.ACTGRAMS * (stoneRate[index] || 0)).toFixed(2)) || 0,
      priority: 0,
      calcrate: "-",
    }));
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalEstimationItems`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        }
      );
      let data = response?.data;
      setItemData(data[0].isInsert);
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
        gwt: Number(Number(totalGrossWeight).toFixed(3)),
        stonewt: Number(Number(totalStoneWeight).toFixed(3)),
        nwt: Number(Number(totalNetWeight).toFixed(3)),
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
        totpcs: Number(totalPieces),
        ssp: 0,
        appno: 0,
        appdate: formattedDate,
        rbrate: Number(Number(fineGoldValue)?.toFixed(3)) || 0,
        czrate: Number(Number(rateValue)?.toFixed(2)) || 0,
        ssprate: Number(Number(amountValue)?.toFixed(2)),
        beadsrate: Number(Number(metalBalanceValue)?.toFixed(3)),
        othersrate: 0,
        mixrate: 0,
        wastper: 0,
        wastage: Number(wastageValue),
        wt: 0,
        touchper: Number(touchValue),
        touch: Number(totalTouch),
        purewt: Number(Number(totalFineGold)?.toFixed(3)),
        mcper: Number(Number(makingValue)) || 0,
        mcamt: Number(Number(perGramValue).toFixed(3)) || 0,
        stcharges: totalStoneCost
          ? Number(Number(totalStoneCost).toFixed(2))
          : Number(Number(stonePerGramValue).toFixed(2)) || 0,
        totcash: Number(Number(cashBalanceValue).toFixed(2)),
        stgmrate: "-",
        rcharges: rodiumChargeValue
          ? Number(rodiumChargeValue)
          : Number(stoneMakingValue) || 0,
      },
    ];

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalEstimationMast`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        }
      );
      let data = response?.data;
      setMastData(data[0].isInsert);
      window.location.reload();
      handleReset();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // const estimationNoDataAPI = async (estNo) => {
  //   try {
  //     let whereCondition = "";
  //     if (estNo) {
  //       whereCondition = `ESTIMATIONNO=${estNo}`;
  //     }
  //     let params = {
  //       tableName: "ESTIMATION_DATA",
  //       where: whereCondition,
  //       order: "SNO",
  //     };

  //     const response = await axios.get(
  //       `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhereandOrder`,
  //       {
  //         params,
  //         headers: {
  //           tenantName: tenantName,
  //         },
  //       }
  //     );

  //     const data = response.data;

  //     if (Array.isArray(data) && data.length > 0) {
  //       const updatedData = data.map((item, index) => ({
  //         ACTPER: item.ACTPER,
  //         ACTSWT: 0.2,
  //         BALGWT: 1500,
  //         BALNWT: 1500,
  //         BALPIECES: 0,
  //         BALSTONEWT: 0,
  //         BRANCHCODE: "",
  //         BRANCHNAME: "",
  //         CNAME: "",
  //         CZ: 0,
  //         DIFFSWT: 0,
  //         DIFFWT: 0,
  //         ENTRYNO: 0,
  //         FINALGOLD: item.FINEGOLD,
  //         GROSSWEIGHT: item.GWT,
  //         GWT: item.GWT,
  //         HUID1: "-",
  //         HUID2: "-",
  //         ITEM_TOTCTS: 1,
  //         ITEM_TOTGMS: 0,
  //         ITEM_TOTPCS: 0,
  //         LOTNO: 2,
  //         MIX: 0,
  //         NETWT: item.NWT,
  //         NWT: item.NWT,
  //         ORDERITEM: false,
  //         ORDERNO: ".",
  //         OTHERS: 0,
  //         PIECES: item.PIECES,
  //         PREFIX: item.PREFIX,
  //         PRODNAME: item.PRODNAME,
  //         RB: 0,
  //         RECYCLE: "NO",
  //         RE_EM: 0,
  //         SERIALNO: 242,
  //         SLIPNO: 79,
  //         SNO: 904,
  //         SSP: 0,
  //         SSTATUS: false,
  //         STONEWT: item.STONEWT,
  //         TAGDATE: "2025-03-04T00:00:00",
  //         TAGNO: item.TAGNO,
  //         TAGTIME: "1900-01-01T06:27:17",
  //         TAG_PRE: "*",
  //         TOTGWT: 30.23,
  //         TOTNWT: 26.13,
  //         TOTPCS: 2,
  //         TOTSTONEWT: 4.1,
  //         TOUCH: item.TOUCH,
  //         VNO: 0,
  //         slipdate: "2025-03-04T00:00:00",
  //         workername: "HIRU - A4",
  //       }));
  //       const stones = data.map((item, index) => ({
  //         TAGNO: item.TAGNO,
  //         ACTGRAMS: item.STDET,
  //       }));
  //       setStoneMainData(stones);
  //       setTableData(updatedData);
  //       const total = updatedData.reduce(
  //         (sum, item) => sum + Number(item.PIECES || 0),
  //         0
  //       );
  //       const totalGross = updatedData.reduce(
  //         (sum, item) => sum + Number(item.GROSSWEIGHT || 0),
  //         0
  //       );
  //       const totalStones = updatedData.reduce(
  //         (sum, item) => sum + Number(item.STONEWT || 0),
  //         0
  //       );
  //       const totalNetWt = updatedData.reduce(
  //         (sum, item) => sum + Number(item.NETWT || 0),
  //         0
  //       );
  //       const totalGold = updatedData.reduce(
  //         (sum, item) => sum + Number(item.FINALGOLD || 0),
  //         0
  //       );

  //       // Set totals
  //       setTotalPieces(total);
  //       setTotalGrossWeight(totalGross);
  //       setTotalStoneWeight(totalStones);
  //       setTotalNetWeight(totalNetWt);
  //       setTotalFineGold(totalGold);

  //       setSelectedObject(null);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching estimation count:", error);
  //   }
  // };

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
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const updatedData = data.map((item, index) => ({
          ...item,
          ACTSWT: 0.2,
          BALGWT: 1500,
          BALNWT: 1500,
          BALPIECES: 0,
          BALSTONEWT: 0,
          FINALGOLD: item.FINEGOLD,
          GROSSWEIGHT: item.GWT,
          GWT: item.GWT,
          NETWT: item.NWT,
          NWT: item.NWT,
          PIECES: item.PIECES,
          PRODNAME: item.PRODNAME,
          STONEWT: item.STONEWT,
          TAGNO: item.TAGNO,
          TOUCH: item.TOUCH,
          // ... keep other fields if needed
        }));

        // const stones = data.map((item) => ({
        //   TAGNO: item.TAGNO,
        //   ACTGRAMS: item.STDET,
        // }));

        // setStoneMainData(stones);
        // setTableData(updatedData);

        // ✅ Loop TAGNOs & call mainAPI for each
        for (const item of updatedData) {
          if (item.TAGNO) {
            await mainAPI(item.TAGNO);
            await stonesAPI(item.TAGNO);
          }
        }

        // Totals
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

        // setTotalPieces(total);
        // setTotalGrossWeight(totalGross);
        // setTotalStoneWeight(totalStones);
        // setTotalNetWeight(totalNetWt);
        // setTotalFineGold(totalGold);

        setSelectedObject(null);
      }
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    }
  };

  const estimationNoMastAPI = async (estNo) => {
    try {
      let whereCondition = "";
      if (estNo) {
        whereCondition = `ESTIMATIONNO=${estNo}`;
      }
      let params = {
        tableName: "ESTIMATION_MAST",
        where: whereCondition,
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere`,
        {
          params,
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;
      setFineGoldValue(data[0]?.RBRATE);
      setRateValue(data[0]?.CZRATE);
      setAmountValue(data[0]?.SSPRATE);
      setCashBalanceValue(data[0]?.TOTCASH);
      setMetalBalanceValue(data[0]?.BEADSRATE);
      if (data[0]?.RBRATE > 0) {
        setRateCut(true);
      }
      if (Array.isArray(data) && data.length > 0) {
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
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

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
        {},
        {
          headers: {
            tenantName: tenantName,
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
        {},
        {
          headers: {
            tenantName: tenantName,
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
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createImagePathAPI = async (imgUrl, tagNo) => {
    try {
      await axios.get(
        `${CREATE_jwel}/api/Wholesal/UpdateTagGenerationImagePath?tagNo=${tagNo}&path=${
          imgUrl || ""
        }`,
        { headers: { tenantName } }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getBase64Data = (dataUri) => {
    return dataUri.replace(/^data:image\/\w+;base64,/, "");
  };

  const generateFileName = (tagNo) => {
    const timestamp = Date.now();
    const safeTagNo = tagNo.replace(/\//g, "_"); // replace all '/' with '_'
    return `${safeTagNo}.jpg`;
  };

  const imageUploadAPI = async (index, tagNo) => {
    const photo = photos[index];
    if (!photo) return;

    const base64Str = getBase64Data(photo);
    const renamedFileName = generateFileName(tagNo);

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Utilities/SaveClientImages`,
        {
          fileName: renamedFileName,
          fileBase: base64Str,
          clientName: userName,
          dbId: "",
        },
        {
          headers: { tenantName },
        }
      );

      if (response.status === 200) {
        const imgUrl = `https://image.timeserasoftware.in/${userName}/${renamedFileName}`;
        createImagePathAPI(imgUrl, tagNo);
        alert("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed!");
    }
  };

  const html5QrCodeRef = useRef(null);
  const scannedRef = useRef(false);

  const SCAN_COOLDOWN_MS = 1000;

  const startScanner = async () => {
    try {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      };

      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          if (scannedRef.current) return;

          scannedRef.current = true;

          try {
            if (path === "/estimations-model2") {
              await mainAPI(decodedText, []);
            } else {
              const stoneData = await stonesAPI(decodedText);
              if (stoneData && Array.isArray(stoneData)) {
                await mainAPI(decodedText, stoneData);
              }
            }
          } catch (err) {
            console.error("Scan handling error:", err);
          }

          setTimeout(() => {
            scannedRef.current = false;
          }, SCAN_COOLDOWN_MS);
        },
        (error) => {
          console.warn("QR Scan Error:", error);
        }
      );
    } catch (error) {
      console.error("Failed to start scanner:", error);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      } finally {
        html5QrCodeRef.current = null;
        setQrOpen(false);
        scannedRef.current = false;
      }
    } else {
      setQrOpen(false);
      scannedRef.current = false;
    }
  };

  const handleOpenScanner = () => {
    setQrOpen(true);
    setTimeout(() => startScanner(), 300); // give DOM time to mount
  };

  const handleToggleScan = () => {
    setScanOpen((prev) => !prev);
  };

  const handleReset = () => {
    setTableData([]); // Clear the table data
    setStonesData([]);
    setStoneMainData([]);
    setSelectedParty(null);
    setWastageValue();
    setTouchValue();
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
    setStoneMakingValue(0);
    setStonePerGramValue(0);
    setRodiumChargeValue(0);
    setCashBalanceValue();
    setMetalBalanceValue();
    setFineGoldValue();
    setRateValue();
    setAmountValue();
    setRateCut(false);
    estimationCountAPI();
    setSelectEstimationNo(null);
    setTagNo();
    setPhoto(null);
    setImageUrl(null);
    setCameraOpen(false);
    setImageOpen(false);
    setIsSupported(false);
    setPhotos({});
    setCameraOpenIndex(null);
    setBase64Images({});
  };

  const handleOk = () => {
    setFilterOpen(false);
  };

  const handleCancel = () => {
    setFilterOpen(false);
  };

  useEffect(() => {
    if (rateCut === true) {
      setFineGoldValue(totalFineGold);
    } else {
      setFineGoldValue();
      setRateValue();
      setAmountValue();
    }
  }, [rateCut]);

  useEffect(() => {
    const amount =
      fineGoldValue * rateValue
        ? Number(fineGoldValue * rateValue)?.toFixed(2)
        : 0;
    const totalMatel = Number(totalFineGold || 0) - Number(fineGoldValue || 0);
    // const totalCashdata =
    //   selectEstimationNo ? selectEstimationNo.STCHARGES :
    //   totalStoneCost?.toFixed(2) ||
    //   stonePerGramValue;
    if (path === "/estimations-model1") {
      const totalCashValue =
        Number(amountValue || 0) +
        Number(perGramValue || 0) +
        Number(rodiumChargeValue || 0) +
        Number(totalStoneCost || 0);
      setCashBalanceValue(totalCashValue);
    } else {
      const totalCashValue =
        Number(amountValue || 0) +
        Number(perGramValue || 0) +
        Number(stonePerGramValue || 0);
      setCashBalanceValue(totalCashValue);
    }
    setMetalBalanceValue(totalMatel);
    setAmountValue(amount);
  }, [
    fineGoldValue,
    rateValue,
    totalFineGold,
    amountValue,
    perGramValue,
    rodiumChargeValue,
    selectEstimationNo,
    totalStoneCost,
    stonePerGramValue,
    rateCut,
  ]);

  // useEffect(() => {
  //   if (
  //     navigator.mediaDevices &&
  //     typeof navigator.mediaDevices.getUserMedia === "function"
  //   ) {
  //     setIsSupported(true);
  //   } else {
  //     alert(
  //       "Camera not supported on this device/browser. Please use Chrome or Safari over HTTPS."
  //     );
  //   }
  // }, []);

  const handleImageOk = (image) => {
    setImageOpen(true);
    setPhoto(image);
  };

  const handleImageCancel = () => {
    setImageOpen(false);
  };

  // const handleTakePhoto = (dataUri) => {
  //   setPhoto(dataUri);
  // };

  // const handleCameraOk = () => {
  //   setCameraOpen(true);
  // };

  // const handleCameraCancel = () => {
  //   setCameraOpen(false);
  // };
  const handleCameraOk = (index, tagNo, imgPath) => {
    setCameraOpenIndex(index);
    setTagNo(tagNo);
    setImageUrl(imgPath);
  };

  const handleCameraCancel = () => {
    setCameraOpenIndex(null);
  };

  const handleTakePhoto = (dataUri, index) => {
    setPhotos((prev) => ({
      ...prev,
      [index]: dataUri,
    }));
  };

  const fetchWithRetry = async (url, retries = 3, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch (e) {
      console.warn(`Retry ${i + 1} for ${url}`);
    }
    await new Promise(r => setTimeout(r, delay));
  }
  throw new Error("Failed after retries: " + url);
};

const urlToBase64 = async (url) => {
  const cleanUrl = decodeURIComponent(url);
  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(cleanUrl)}`;

  const response = await fetchWithRetry(proxyUrl, 3, 800);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

//   const urlToBase64 = async (url) => {
//   const cleanUrl = decodeURIComponent(url);
//   const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`;
  
//   const response = await fetch(proxyUrl);
//   if (!response.ok) {
//     throw new Error(`Proxy fetch failed: ${response.status} ${response.statusText}`);
//   }

//   const blob = await response.blob();
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.onerror = reject;
//     reader.readAsDataURL(blob);
//   });
// };

useEffect(() => {
  const convertAllImages = async () => {
    if (!tableData || tableData.length === 0) {
      setBase64Images({});
      return;
    }

    const imageMap = {};

    await Promise.all(
      tableData.map(async (item, index) => {
        if (item.IMGPATH) {
          try {
            // ✅ Use already available base64 (photos) or previously cached (base64Images)
            if (photos[index]) {
              imageMap[item.IMGPATH] = photos[index];
            } else if (base64Images[item.IMGPATH]) {
              imageMap[item.IMGPATH] = base64Images[item.IMGPATH];
            } else {
              const base64 = await urlToBase64(item.IMGPATH);
              imageMap[item.IMGPATH] = base64;
            }
          } catch (err) {
            console.error("Image conversion failed:", item.IMGPATH, err);
          }
        }
      })
    );

    setBase64Images(imageMap);
  };

  convertAllImages();
}, [tableData, photos]);
  console.log(base64Images, "base64");
  console.log("photos", photos);
  
  

  //   const handleLandScapePrint = () => {
  //     const printWindow = window.open("", "", "height=700,width=900");

  //     printWindow.document.write(
  //       "<html><head><title>Estimation Report</title><style>"
  //     );

  //     // Force landscape orientation
  //     printWindow.document.write(`
  //     @page {
  //         size: landscape;
  //         margin: 2mm;
  //     }
  //     body {
  //         font-family: Arial, sans-serif;
  //         margin: 20px;
  //         font-size: 12px;
  //     }
  //     .header {
  //         text-align: center;
  //         margin-bottom: 18px;
  //     }
  //     .header h2 {
  //         margin: 0;
  //         font-size: 16px;
  //         font-weight: bold;
  //         display: inline-block;
  //         text-decoration: underline;
  //         text-underline-offset: 4px;
  //     }
  //     .sub-header {
  //         display: flex;
  //         justify-content: space-between;
  //         font-size: 12px;
  //         font-weight: bold;
  //         margin-bottom: 10px;
  //         padding-bottom: 5px;
  //     }
  //     table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         font-size: 12px;
  //         margin-top: 5px;
  //     }
  //     th, td {
  //         border: 1px solid black;
  //         padding: 5px;
  //         text-align: center;
  //     }
  //     th {
  //         background-color: #e0e0e0;
  //         font-weight: bold;
  //     }
  //     .total {
  //         font-weight: bold;
  //         background-color: #ddd;
  //     }
  //     .summary {
  //         display: flex;
  //         justify-content: space-between;
  //         margin-top: 15px;
  //     }
  //     .summary-box {
  //         width: 48%;
  //         border: 1px solid black;
  //         padding: 10px;
  //         font-size: 12px;
  //     }
  //     .summary-box table {
  //         width: 100%;
  //         border: none;
  //     }
  //     .summary-box td {
  //         border: none;
  //         text-align: left;
  //         padding: 3px 0;
  //     }
  //     .footer {
  //         margin-top: 15px;
  //         font-size: 12px;
  //     }
  //   `);

  //     printWindow.document.write("</style></head><body>");

  //     // Header Section
  //     printWindow.document.write(`
  //     <div class="header">
  //         <h2>ESTIMATION</h2>
  //     </div>
  //     <div class="sub-header">
  //         <span>ESTIMATION NO. : ${
  //           selectEstimationNo
  //             ? selectEstimationNo?.ESTIMATIONNO
  //             : estimationCount + 1
  //         }</span>
  //         <span>DATE : ${new Date().toLocaleDateString("en-GB", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "numeric",
  //         })}</span>
  //         <span>PARTY NAME : ${selectedParty}</span>
  //     </div>
  //   `);

  //     // Main Table
  //     printWindow.document.write(`
  //     <style>
  //         table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             border: 2px solid black;
  //             font-family: Arial, sans-serif;
  //             font-size: 12px;
  //         }
  //         th, td {
  //             border: 1px solid black;
  //             padding: 5px;
  //             text-align: center;
  //             vertical-align: middle;
  //         }
  //         th {
  //             font-weight: bold;
  //             background-color: #e0e0e0;
  //         }
  //         td strong {
  //             font-size: 12px;
  //         }
  //         td span {
  //             font-size: 10px;
  //         }
  //         .total td {
  //             font-weight: bold;
  //             background-color: #ddd;
  //         }
  //         td div.sub-text {
  //             text-align: left;
  //             font-size: 10px;
  //             font-weight: bold;
  //         }
  //         td div.sub-value {
  //             text-align: left;
  //             font-size: 10px;
  //         }
  //         tr.sub-row td {
  //             border-top: none;
  //             text-align: left;
  //         }
  //         .sub {
  //             text-align: left;
  //             width: 600;
  //         }
  //             .sub-tag {
  //             text-align: center;
  //             width: 100;
  //         }
  //             .sub-image {
  //             text-align: center;
  //         }
  //             .sub-img {
  //             display: flex;
  //             text-align: center;
  //             border-radius: 10px;
  //             width: 100%;
  //             height: 100%;
  //             align-items: center;
  //         }
  //         .sub-right {
  //             text-align: right;
  //             width: 80;
  //         }
  //             .sub-gold {
  //             text-align: right;
  //             width: 130;
  //         }
  //     </style>
  //     <table>
  //         <thead>
  //             <tr>
  //                 <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub-image">Image</th><th class="sub">PARTICULARS</th><th>Purity</th><th>Pieces</th><th class="sub-right">Gross.Wt</th>
  //                 <th class="sub-right">Less.Wt</th><th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
  //             </tr>
  //         </thead>
  //         <tbody>
  //   `);

  //     let totalPCS = 0;
  //     let totalGWT = 0;
  //     let totalStone = 0;
  //     let totalNWT = 0;
  //     let totalGold = 0;

  //     tableData.forEach((item, index) => {
  //       const actGrams =
  //         stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
  //         "";
  //       const removeUndefinedWrapper = (str) => {
  //         let prevStr;
  //         do {
  //           prevStr = str;
  //           str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
  //         } while (prevStr !== str);
  //         return str;
  //       };
  //       const cleanedActGrams = removeUndefinedWrapper(actGrams);

  //       printWindow.document.write(`
  //         <tr>
  //             <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //         index + 1
  //       }</strong></td>
  //             <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //         item.TAGNO
  //       }</strong></td>
  //       <td rowspan="${cleanedActGrams ? 2 : 1}">

  // ${
  //   item.IMGPATH || photos[index]
  //     ? `<img src="${item.IMGPATH ? item.IMGPATH : photos[index]}"
  //              alt="Item Image"
  //              style="max-width:80px; max-height:80px; object-fit:contain;" />`
  //     : ""
  // }
  // </td>
  //             <td class="sub"><strong>${item.PRODNAME}</strong></td>
  //             <td>${item.PREFIX}</td>
  //             <td class="sub-right"><strong>${item.PIECES}</strong></td>
  //             <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
  //             <td class="sub-right">${item.STONEWT}</td>
  //             <td class="sub-right">${item.NETWT}</td>
  //             <td class="sub-right">${item.TOUCH}%</td>
  //             <td class="sub-gold">${item.FINALGOLD}</td>
  //         </tr>
  //     `);

  //       if (cleanedActGrams) {
  //         printWindow.document.write(`
  //         <tr class="sub-row">
  //             <td colspan="10" class="sub-text">${cleanedActGrams}</td>
  //         </tr>
  //       `);
  //       }

  //       totalPCS += item.PIECES;
  //       totalGWT += item.GWT;
  //       totalStone += Number(item.STONEWT);
  //       totalNWT += Number(item.NETWT);
  //       totalGold += Number(item?.FINALGOLD);
  //     });

  //     printWindow.document.write(`
  //         <tr class="total">
  //             <td colspan="5" class="sub-total">Total</td>
  //             <td>${totalPCS}</td>
  //             <td>${totalGWT.toFixed(3)}</td>
  //             <td>${Number(totalStone)?.toFixed(3)}</td>
  //             <td>${Number(totalNWT)?.toFixed(3)}</td>
  //             <td></td>
  //             <td>${Number(totalGold)?.toFixed(3)}</td>
  //         </tr>
  //     </tbody>
  //   </table>
  //   `);

  //     if (path === "/estimations-model1") {
  //       generateEstimationPrint({
  //         showStonesTable: true,
  //         includeRodiumCharges: true,
  //         rateCutChange: true,
  //       });
  //     } else if (path === "/estimations-model2") {
  //       generateEstimationPrint({
  //         showStonesTable: false,
  //         includeRodiumCharges: false,
  //         rateCutChange: true,
  //       });
  //     }

  //     function generateEstimationPrint({
  //       showStonesTable,
  //       includeRodiumCharges,
  //     }) {
  //       printWindow.document.write(`
  //       <style>
  //         .container {
  //           display: flex;
  //           justify-content: space-between;
  //           align-items: flex-start;
  //           width: 100%;
  //           margin-top: 10px;
  //         }
  //         .table-container {
  //           width: 55%;
  //         }
  //         .summary-container {
  //           width: 35%;
  //           margin-left: ${showStonesTable ? "0" : "auto"};
  //         }
  //         table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           border: 2px solid black;
  //         }
  //         th, td {
  //           border: 1px solid black;
  //           padding: 5px;
  //           text-align: center;
  //           vertical-align: middle;
  //         }
  //         th {
  //           font-weight: bold;
  //           background-color: #e0e0e0;
  //         }
  //         .total td {
  //           font-weight: bold;
  //           background-color: #ddd;
  //           text-align: right;
  //         }
  //         .stone-name {
  //           text-align: left;
  //         }
  //         .sub-right {
  //           text-align: right;
  //         }
  //         .sub-final {
  //           background-color: #e0e0e0;
  //           font-weight: bold;
  //         }
  //         .sub-right-bold {
  //           text-align: right;
  //           font-weight: bold;
  //         }
  //         .stone-name-bold {
  //           text-align: left;
  //           font-weight: bold;
  //         }
  //       </style>

  //       <div class="container">
  //     `);

  //       if (showStonesTable) {
  //         let totalStoneWeight = 0;
  //         let totalAmount = 0;

  //         printWindow.document.write(`
  //         <div class="table-container">
  //           <table>
  //             <thead>
  //               <tr>
  //                 <th class="stone-name">STONE NAME</th>
  //                 <th>PIECES</th>
  //                 <th class="sub-right">WEIGHT</th>
  //                 <th class="sub-right">COST</th>
  //                 <th class="sub-right">AMOUNT</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //       `);

  //         stonesData.forEach((stone, index) => {
  //           const rate = stoneRate[index] || 0;
  //           const amount = stone.ACTGRAMS * Number(rate);
  //           totalAmount += amount;
  //           totalStoneWeight += stone.ACTGRAMS;

  //           printWindow.document.write(`
  //           <tr>
  //             <td class="stone-name">${stone.MAINTYPE}</td>
  //             <td>${stone.PCS}</td>
  //             <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
  //             <td class="sub-right">${Number(rate)?.toFixed(2)}</td>
  //             <td class="sub-right">${amount.toFixed(2)}</td>
  //           </tr>
  //         `);
  //         });

  //         printWindow.document.write(`
  //               <tr class="total">
  //                 <td colspan="2"></td>
  //                 <td>${totalStoneWeight.toFixed(3)}</td>
  //                 <td></td>
  //                 <td>${totalAmount.toFixed(2)}</td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>
  //       `);
  //       }

  //       printWindow.document.write(`
  //       <div class="summary-container">
  //         <table>
  //           <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
  //             3
  //           )}</td></tr>
  //           ${
  //             rateCut === true
  //               ? `<tr>
  //                   <td class="stone-name">
  //                     Fine ${fineGoldValue || 0} @${Number(rateValue || 0)}/-
  //                   </td>
  //                   <td class="sub-right">
  //                     ${amountValue ? Number(amountValue).toFixed(2) : 0}
  //                   </td>
  //                 </tr>`
  //               : ""
  //           }
  //           <tr><td class="stone-name">Making ${
  //             makingValue || 0
  //           } /g</td><td class="sub-right">${
  //         perGramValue ? Number(perGramValue).toFixed(2) : 0
  //       }</td></tr>
  //           ${
  //             includeRodiumCharges
  //               ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
  //                   rodiumChargeValue || 0
  //                 }</td></tr>
  //                  <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
  //                    2
  //                  )}</td></tr>`
  //               : `<tr><td class="stone-name">Stone Cost ${
  //                   stoneMakingValue || 0
  //                 } /g</td>
  //                  <td class="sub-right">${
  //                    stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
  //                  }</td></tr>`
  //           }
  //           <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
  //             3
  //           )}</strong></td></tr>
  //           <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balnace</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
  //             2
  //           )}</strong></td></tr>
  //         </table>
  //       </div>
  //     </div>
  //     `);
  //     }

  //     printWindow.document.write("</body></html>");
  //     printWindow.document.close();
  //     printWindow.print();
  //   };
  const handleLandScapePrint = () => {
    let totalPCS = 0;
    let totalGWT = 0;
    let totalStone = 0;
    let totalNWT = 0;
    let totalGold = 0;

    // Build table rows
    const tableRows = tableData
      .map((item, index) => {
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

        totalPCS += item.PIECES;
        totalGWT += item.GWT;
        totalStone += Number(item.STONEWT);
        totalNWT += Number(item.NETWT);
        totalGold += Number(item?.FINALGOLD);
        const imgPath = item.IMGPATH || photos[index] || "";
        const base64Img = base64Images[imgPath] || "";

        return `
        <tr>
          <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
          index + 1
        }</strong></td>
          <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
          item.TAGNO
        }</strong></td>
        <td rowspan="${cleanedActGrams ? 2 : 1}">
      
${
  base64Img
    ? `<img src="${base64Img}" 
             alt="Item Image" 
             style="max-width:80px; max-height:80px;"/>`
    : ""
}
</td>
          <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
          <td>${item.PREFIX}</td>
          <td class="sub-right"><strong>${item.PIECES}</strong></td>
          <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
          <td class="sub-right">${item.STONEWT}</td>
          <td class="sub-right">${item.NETWT}</td>
          <td class="sub-right">${item.TOUCH}%</td>
          <td class="sub-gold">${item.FINALGOLD}</td>
        </tr>
        ${
          cleanedActGrams
            ? `<tr class="sub-row"><td colspan="10" class="sub-text">${cleanedActGrams}</td></tr>`
            : ""
        }
      `;
      })
      .join("");

    // Totals row
    const totalsRow = `
    <tr class="total">
      <td colspan="5">Total</td>
      <td>${totalPCS}</td>
      <td>${totalGWT.toFixed(3)}</td>
      <td>${Number(totalStone)?.toFixed(3)}</td>
      <td>${Number(totalNWT)?.toFixed(3)}</td>
      <td></td>
      <td>${Number(totalGold)?.toFixed(3)}</td>
    </tr>
  `;

    // Stones table if applicable
    const stonesTable =
      path === "/estimations-model1"
        ? `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="stone-name">STONE NAME</th>
                <th>PIECES</th>
                <th class="sub-right">WEIGHT</th>
                <th class="sub-right">COST</th>
                <th class="sub-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let totalStoneWeight = 0;
                let totalAmount = 0;
                return (
                  stonesData
                    .map((stone, index) => {
                      const rate = stoneRate[index] || 0;
                      const amount = stone.ACTGRAMS * Number(rate);
                      totalAmount += amount;
                      totalStoneWeight += stone.ACTGRAMS;
                      return `
                      <tr>
                        <td class="stone-name">${stone.MAINTYPE}</td>
                        <td>${stone.PCS}</td>
                        <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
                        <td class="sub-right">${Number(rate)?.toFixed(2)}</td>
                        <td class="sub-right">${amount.toFixed(2)}</td>
                      </tr>
                    `;
                    })
                    .join("") +
                  `<tr class="total">
                    <td colspan="2"></td>
                    <td>${totalStoneWeight.toFixed(3)}</td>
                    <td></td>
                    <td>${totalAmount.toFixed(2)}</td>
                  </tr>`
                );
              })()}
            </tbody>
          </table>
        </div>
      `
        : "";

    // Summary table
    const summaryTable = `
    <div class="summary-container">
      <table>
        <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
          3
        )}</td></tr>
        ${
          rateCut === true
            ? `<tr><td class="stone-name">Fine ${fineGoldValue || 0} @${Number(
                rateValue || 0
              )}/-</td>
                <td class="sub-right">${
                  amountValue ? Number(amountValue).toFixed(2) : 0
                }</td></tr>`
            : ""
        }
        <tr><td class="stone-name">Making ${
          makingValue || 0
        } /g</td><td class="sub-right">${
      perGramValue ? Number(perGramValue).toFixed(2) : 0
    }</td></tr>
        ${
          path === "/estimations-model1"
            ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                rodiumChargeValue || 0
              }</td></tr>
               <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                 2
               )}</td></tr>`
            : `<tr><td class="stone-name">Stone Cost ${
                stoneMakingValue || 0
              } /g</td>
               <td class="sub-right">${
                 stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
               }</td></tr>`
        }
        <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
          3
        )}</strong></td></tr>
        <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
          2
        )}</strong></td></tr>
      </table>
    </div>
  `;

    // Build full HTML content
    const htmlContent = `
    <html>
      <head>
        <style>
           body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 18px;
        }
        .header h2 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
    text-decoration: underline;
    text-underline-offset: 4px;
        }
        .sub-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
             .sub-est {
          font-weight : bold;
          font-size: 18px;
          color : red;
        }
          .sub-party {
          font-weight : bold;
          font-size: 14px;
          color : #ddd;
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
          .sub {
            text-align: left;
            width: 300px;
        }
            .sub-pro {
              text-align: left;
              width: 500;
              background-color: #ddd;
          }
            .sub-tag {
            text-align: center;
            width: 100;
        }
             .sub-image {
            text-align: center;
        }
            .sub-img {
            display: flex;
            text-align: center;
            border-radius: 10px;
            width: 100%;
            height: 100%;
            align-items: center;
        }
        .sub-right {
            text-align: right;
            width: 80;
        }
            .sub-gold {
            text-align: right;
            width: 130;
        }
          .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
          .sub-row td { border-top: none; text-align: left; }
          .container { display: flex; justify-content: space-between; margin-top: 10px; }
          .table-container { width: 55%; }
          .summary-container { width: 35%; }
          .stone-name { text-align: left; }
          .sub-final { background-color: #C9CDCF; font-weight: bold; }
          .sub-right-bold { text-align: right; font-weight: bold; }
          .stone-name-bold { text-align: left; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header"><h2>ESTIMATION</h2></div>
        <div class="sub-header">
          <span>ESTIMATION NO. : <span class="sub-est">${
            selectEstimationNo
              ? selectEstimationNo?.ESTIMATIONNO
              : estimationCount + 1
          }</span></span>
          <span>DATE : ${new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}</span>
          <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
        </div>
        <table>
          <thead>
            <tr>
              <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub-image">Image</th><th class="sub">PARTICULARS</th><th>Purity</th>
              <th>Pieces</th><th class="sub-right">Gross.Wt</th><th class="sub-right">Less.Wt</th>
              <th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            ${totalsRow}
          </tbody>
        </table>
        <div class="container">
          ${stonesTable}
          ${summaryTable}
        </div>
      </body>
    </html>
  `;

    // Create container for html2pdf
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2pdf()
      .set({
        margin: [10, 5, 10, 5],
        filename: `Estimation_${
          selectEstimationNo
            ? selectEstimationNo?.ESTIMATIONNO
            : estimationCount + 1
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        // html2canvas: { scale: 2, useCORS: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

  // const handlePrint = () => {
  //   const printWindow = window.open("", "", "height=700,width=900");

  //   printWindow.document.write(
  //     "<html><head><title>Estimation Report</title><style>"
  //   );

  //   // Force landscape orientation
  //   printWindow.document.write(`
  //   body {
  //       font-family: Arial, sans-serif;
  //       margin: 20px;
  //       font-size: 12px;
  //   }
  //   .header {
  //       text-align: center;
  //       margin-bottom: 18px;
  //   }
  //   .header h2 {
  //       margin: 0;
  //       font-size: 16px;
  //       font-weight: bold;
  //       display: inline-block;
  //       text-decoration: underline;
  //       text-underline-offset: 4px;
  //   }
  //   .sub-header {
  //       display: flex;
  //       justify-content: space-between;
  //       font-size: 12px;
  //       font-weight: bold;
  //       margin-bottom: 10px;
  //       padding-bottom: 5px;
  //   }
  //   table {
  //       width: 100%;
  //       border-collapse: collapse;
  //       font-size: 12px;
  //       margin-top: 5px;
  //   }
  //   th, td {
  //       border: 1px solid black;
  //       padding: 5px;
  //       text-align: center;
  //   }
  //   th {
  //       background-color: #e0e0e0;
  //       font-weight: bold;
  //   }
  //   .total {
  //       font-weight: bold;
  //       background-color: #ddd;
  //   }
  //   .summary {
  //       display: flex;
  //       justify-content: space-between;
  //       margin-top: 15px;
  //   }
  //   .summary-box {
  //       width: 48%;
  //       border: 1px solid black;
  //       padding: 10px;
  //       font-size: 12px;
  //   }
  //   .summary-box table {
  //       width: 100%;
  //       border: none;
  //   }
  //   .summary-box td {
  //       border: none;
  //       text-align: left;
  //       padding: 3px 0;
  //   }
  //   .footer {
  //       margin-top: 15px;
  //       font-size: 12px;
  //   }
  // `);

  //   printWindow.document.write("</style></head><body>");

  //   // Header Section
  //   printWindow.document.write(`
  //   <div class="header">
  //       <h2>ESTIMATION</h2>
  //   </div>
  //   <div class="sub-header">
  //       <span>ESTIMATION NO. : ${
  //         selectEstimationNo
  //           ? selectEstimationNo?.ESTIMATIONNO
  //           : estimationCount + 1
  //       }</span>
  //       <span>DATE : ${new Date().toLocaleDateString("en-GB", {
  //         day: "2-digit",
  //         month: "short",
  //         year: "numeric",
  //       })}</span>
  //       <span>PARTY NAME : ${selectedParty}</span>
  //   </div>
  // `);

  //   // Main Table
  //   printWindow.document.write(`
  //   <style>
  //       table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           border: 2px solid black;
  //           font-family: Arial, sans-serif;
  //           font-size: 12px;
  //       }
  //       th, td {
  //           border: 1px solid black;
  //           padding: 5px;
  //           text-align: center;
  //           vertical-align: middle;
  //       }
  //       th {
  //           font-weight: bold;
  //           background-color: #e0e0e0;
  //       }
  //       td strong {
  //           font-size: 12px;
  //       }
  //       td span {
  //           font-size: 10px;
  //       }
  //       .total td {
  //           font-weight: bold;
  //           background-color: #ddd;
  //       }
  //       td div.sub-text {
  //           text-align: left;
  //           font-size: 10px;
  //           font-weight: bold;
  //       }
  //       td div.sub-value {
  //           text-align: left;
  //           font-size: 10px;
  //       }
  //       tr.sub-row td {
  //           border-top: none;
  //           text-align: left;
  //       }
  //       .sub {
  //           text-align: left;
  //           width: 400;
  //       }
  //           .sub-tag {
  //           text-align: center;
  //           width: 100;
  //       }
  //           .sub-image {
  //           text-align: center;
  //       }
  //           .sub-img {
  //           display: flex;
  //           text-align: center;
  //           border-radius: 10px;
  //           width: 100%;
  //           height: 100%;
  //           align-items: center;
  //       }
  //       .sub-right {
  //           text-align: right;
  //           width: 80;
  //       }
  //           .sub-gold {
  //           text-align: right;
  //           width: 130;
  //       }
  //   </style>
  //   <table>
  //       <thead>
  //           <tr>
  //               <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub">PARTICULARS</th><th>Purity</th><th>Pieces</th><th class="sub-right">Gross.Wt</th>
  //               <th class="sub-right">Less.Wt</th><th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
  //           </tr>
  //       </thead>
  //       <tbody>
  // `);

  //   let totalPCS = 0;
  //   let totalGWT = 0;
  //   let totalStone = 0;
  //   let totalNWT = 0;
  //   let totalGold = 0;

  //   tableData.forEach((item, index) => {
  //     const actGrams =
  //       stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
  //       "";
  //     const removeUndefinedWrapper = (str) => {
  //       let prevStr;
  //       do {
  //         prevStr = str;
  //         str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
  //       } while (prevStr !== str);
  //       return str;
  //     };
  //     const cleanedActGrams = removeUndefinedWrapper(actGrams);

  //     printWindow.document.write(`
  //       <tr>
  //           <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //       index + 1
  //     }</strong></td>
  //           <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //       item.TAGNO
  //     }</strong></td>
  //           <td class="sub"><strong>${item.PRODNAME}</strong></td>
  //           <td>${item.PREFIX}</td>
  //           <td class="sub-right"><strong>${item.PIECES}</strong></td>
  //           <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
  //           <td class="sub-right">${item.STONEWT}</td>
  //           <td class="sub-right">${item.NETWT}</td>
  //           <td class="sub-right">${item.TOUCH}%</td>
  //           <td class="sub-gold">${item.FINALGOLD}</td>
  //       </tr>
  //   `);

  //     if (cleanedActGrams) {
  //       printWindow.document.write(`
  //       <tr class="sub-row">
  //           <td colspan="10" class="sub-text">${cleanedActGrams}</td>
  //       </tr>
  //     `);
  //     }

  //     totalPCS += item.PIECES;
  //     totalGWT += item.GWT;
  //     totalStone += Number(item.STONEWT);
  //     totalNWT += Number(item.NETWT);
  //     totalGold += Number(item?.FINALGOLD);
  //   });

  //   printWindow.document.write(`
  //       <tr class="total">
  //           <td colspan="4" class="sub-total">Total</td>
  //           <td>${totalPCS}</td>
  //           <td>${totalGWT.toFixed(3)}</td>
  //           <td>${Number(totalStone)?.toFixed(3)}</td>
  //           <td>${Number(totalNWT)?.toFixed(3)}</td>
  //           <td></td>
  //           <td>${Number(totalGold)?.toFixed(3)}</td>
  //       </tr>
  //   </tbody>
  // </table>
  // `);

  //   if (path === "/estimations-model1") {
  //     generateEstimationPrint({
  //       showStonesTable: true,
  //       includeRodiumCharges: true,
  //       rateCutChange: true,
  //     });
  //   } else if (path === "/estimations-model2") {
  //     generateEstimationPrint({
  //       showStonesTable: false,
  //       includeRodiumCharges: false,
  //       rateCutChange: true,
  //     });
  //   }

  //   function generateEstimationPrint({
  //     showStonesTable,
  //     includeRodiumCharges,
  //   }) {
  //     printWindow.document.write(`
  //     <style>
  //       .container {
  //         display: flex;
  //         justify-content: space-between;
  //         align-items: flex-start;
  //         width: 100%;
  //         margin-top: 10px;
  //       }
  //       .table-container {
  //         width: 55%;
  //       }
  //       .summary-container {
  //         width: 35%;
  //         margin-left: ${showStonesTable ? "0" : "auto"};
  //       }
  //       table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         border: 2px solid black;
  //       }
  //       th, td {
  //         border: 1px solid black;
  //         padding: 5px;
  //         text-align: center;
  //         vertical-align: middle;
  //       }
  //       th {
  //         font-weight: bold;
  //         background-color: #e0e0e0;
  //       }
  //       .total td {
  //         font-weight: bold;
  //         background-color: #ddd;
  //         text-align: right;
  //       }
  //       .stone-name {
  //         text-align: left;
  //       }
  //       .sub-right {
  //         text-align: right;
  //       }
  //       .sub-final {
  //         background-color: #e0e0e0;
  //         font-weight: bold;
  //       }
  //       .sub-right-bold {
  //         text-align: right;
  //         font-weight: bold;
  //       }
  //       .stone-name-bold {
  //         text-align: left;
  //         font-weight: bold;
  //       }
  //     </style>

  //     <div class="container">
  //   `);

  //     if (showStonesTable) {
  //       let totalStoneWeight = 0;
  //       let totalAmount = 0;

  //       printWindow.document.write(`
  //       <div class="table-container">
  //         <table>
  //           <thead>
  //             <tr>
  //               <th class="stone-name">STONE NAME</th>
  //               <th>PIECES</th>
  //               <th class="sub-right">WEIGHT</th>
  //               <th class="sub-right">COST</th>
  //               <th class="sub-right">AMOUNT</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //     `);

  //       stonesData.forEach((stone, index) => {
  //         const rate = stoneRate[index] || 0;
  //         const amount = stone.ACTGRAMS * Number(rate);
  //         totalAmount += amount;
  //         totalStoneWeight += stone.ACTGRAMS;

  //         printWindow.document.write(`
  //         <tr>
  //           <td class="stone-name">${stone.MAINTYPE}</td>
  //           <td>${stone.PCS}</td>
  //           <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
  //           <td class="sub-right">${Number(rate)?.toFixed(2)}</td>
  //           <td class="sub-right">${amount.toFixed(2)}</td>
  //         </tr>
  //       `);
  //       });

  //       printWindow.document.write(`
  //             <tr class="total">
  //               <td colspan="2"></td>
  //               <td>${totalStoneWeight.toFixed(3)}</td>
  //               <td></td>
  //               <td>${totalAmount.toFixed(2)}</td>
  //             </tr>
  //           </tbody>
  //         </table>
  //       </div>
  //     `);
  //     }

  //     printWindow.document.write(`
  //     <div class="summary-container">
  //       <table>
  //         <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
  //           3
  //         )}</td></tr>
  //         ${
  //           rateCut === true
  //             ? `<tr>
  //                 <td class="stone-name">
  //                   Fine ${fineGoldValue || 0} @${Number(rateValue || 0)}/-
  //                 </td>
  //                 <td class="sub-right">
  //                   ${amountValue ? Number(amountValue).toFixed(2) : 0}
  //                 </td>
  //               </tr>`
  //             : ""
  //         }
  //         <tr><td class="stone-name">Making ${
  //           makingValue || 0
  //         } /g</td><td class="sub-right">${
  //       perGramValue ? Number(perGramValue).toFixed(2) : 0
  //     }</td></tr>
  //         ${
  //           includeRodiumCharges
  //             ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
  //                 rodiumChargeValue || 0
  //               }</td></tr>
  //                <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
  //                  2
  //                )}</td></tr>`
  //             : `<tr><td class="stone-name">Stone Cost ${
  //                 stoneMakingValue || 0
  //               } /g</td>
  //                <td class="sub-right">${
  //                  stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
  //                }</td></tr>`
  //         }
  //         <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
  //           3
  //         )}</strong></td></tr>
  //         <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balnace</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
  //           2
  //         )}</strong></td></tr>
  //       </table>
  //     </div>
  //   </div>
  //   `);
  //   }

  //   printWindow.document.write("</body></html>");
  //   printWindow.document.close();
  //   printWindow.print();
  // };
  const handlePrint = () => {
    let totalPCS = 0;
    let totalGWT = 0;
    let totalStone = 0;
    let totalNWT = 0;
    let totalGold = 0;

    // Build table rows
    const tableRows = tableData
      .map((item, index) => {
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

        totalPCS += item.PIECES;
        totalGWT += item.GWT;
        totalStone += Number(item.STONEWT);
        totalNWT += Number(item.NETWT);
        totalGold += Number(item?.FINALGOLD);
        const imgPath = item.IMGPATH || photos[index] || "";
        const base64Img = base64Images[imgPath] || "";

        return `
        <tr>
          <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
          index + 1
        }</strong></td>
          <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
          item.TAGNO
        }</strong></td>
          <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
          <td>${item.PREFIX}</td>
          <td class="sub-right"><strong>${item.PIECES}</strong></td>
          <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
          <td class="sub-right">${item.STONEWT}</td>
          <td class="sub-right">${item.NETWT}</td>
          <td class="sub-right">${item.TOUCH}%</td>
          <td class="sub-gold">${item.FINALGOLD}</td>
        </tr>
        ${
          cleanedActGrams
            ? `<tr class="sub-row"><td colspan="10" class="sub-text">${cleanedActGrams}</td></tr>`
            : ""
        }
      `;
      })
      .join("");

    // Totals row
    const totalsRow = `
    <tr class="total">
      <td colspan="4">Total</td>
      <td>${totalPCS}</td>
      <td>${totalGWT.toFixed(3)}</td>
      <td>${Number(totalStone)?.toFixed(3)}</td>
      <td>${Number(totalNWT)?.toFixed(3)}</td>
      <td></td>
      <td>${Number(totalGold)?.toFixed(3)}</td>
    </tr>
  `;

    // Stones table if applicable
    const stonesTable =
      path === "/estimations-model1"
        ? `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="stone-name">STONE NAME</th>
                <th>PIECES</th>
                <th class="sub-right">WEIGHT</th>
                <th class="sub-right">COST</th>
                <th class="sub-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let totalStoneWeight = 0;
                let totalAmount = 0;
                return (
                  stonesData
                    .map((stone, index) => {
                      const rate = stoneRate[index] || 0;
                      const amount = stone.ACTGRAMS * Number(rate);
                      totalAmount += amount;
                      totalStoneWeight += stone.ACTGRAMS;
                      return `
                      <tr>
                        <td class="stone-name">${stone.MAINTYPE}</td>
                        <td>${stone.PCS}</td>
                        <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
                        <td class="sub-right">${Number(rate)?.toFixed(2)}</td>
                        <td class="sub-right">${amount.toFixed(2)}</td>
                      </tr>
                    `;
                    })
                    .join("") +
                  `<tr class="total">
                    <td colspan="2"></td>
                    <td>${totalStoneWeight.toFixed(3)}</td>
                    <td></td>
                    <td>${totalAmount.toFixed(2)}</td>
                  </tr>`
                );
              })()}
            </tbody>
          </table>
        </div>
      `
        : "";

    // Summary table
    const summaryTable = `
    <div class="summary-container">
      <table>
        <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
          3
        )}</td></tr>
        ${
          rateCut === true
            ? `<tr><td class="stone-name">Fine ${fineGoldValue || 0} @${Number(
                rateValue || 0
              )}/-</td>
                <td class="sub-right">${
                  amountValue ? Number(amountValue).toFixed(2) : 0
                }</td></tr>`
            : ""
        }
        <tr><td class="stone-name">Making ${
          makingValue || 0
        } /g</td><td class="sub-right">${
      perGramValue ? Number(perGramValue).toFixed(2) : 0
    }</td></tr>
        ${
          path === "/estimations-model1"
            ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                rodiumChargeValue || 0
              }</td></tr>
               <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                 2
               )}</td></tr>`
            : `<tr><td class="stone-name">Stone Cost ${
                stoneMakingValue || 0
              } /g</td>
               <td class="sub-right">${
                 stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
               }</td></tr>`
        }
        <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
          3
        )}</strong></td></tr>
        <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
          2
        )}</strong></td></tr>
      </table>
    </div>
  `;

    // Build full HTML content
    const htmlContent = `
    <html>
      <head>
        <style>
           body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 18px;
        }
        .header h2 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
    text-decoration: underline;
    text-underline-offset: 4px;
        }
        .sub-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
             .sub-est {
          font-weight : bold;
          font-size: 18px;
          color : red;
        }
          .sub-party {
          font-weight : bold;
          font-size: 14px;
          color : #ddd;
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
          .sub {
            text-align: left;
            width: 300px;
        }
            .sub-pro {
              text-align: left;
              width: 500;
              background-color: #ddd;
          }
            .sub-tag {
            text-align: center;
            width: 100;
        }
        .sub-right {
            text-align: right;
            width: 80;
        }
            .sub-gold {
            text-align: right;
            width: 130;
        }
          .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
          .sub-row td { border-top: none; text-align: left; }
          .container { display: flex; justify-content: space-between; margin-top: 10px; }
          .table-container { width: 55%; }
          .summary-container { width: 35%; }
          .stone-name { text-align: left; }
          .sub-final { background-color: #C9CDCF; font-weight: bold; }
          .sub-right-bold { text-align: right; font-weight: bold; }
          .stone-name-bold { text-align: left; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header"><h2>ESTIMATION</h2></div>
        <div class="sub-header">
          <span>ESTIMATION NO. : <span class="sub-est">${
            selectEstimationNo
              ? selectEstimationNo?.ESTIMATIONNO
              : estimationCount + 1
          }</span></span>
          <span>DATE : ${new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}</span>
          <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
        </div>
        <table>
          <thead>
            <tr>
              <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub">PARTICULARS</th><th>Purity</th>
              <th>Pieces</th><th class="sub-right">Gross.Wt</th><th class="sub-right">Less.Wt</th>
              <th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            ${totalsRow}
          </tbody>
        </table>
        <div class="container">
          ${stonesTable}
          ${summaryTable}
        </div>
      </body>
    </html>
  `;

    // Create container for html2pdf
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2pdf()
      .set({
        margin: [10, 5, 10, 5],
        filename: `Estimation_${
          selectEstimationNo
            ? selectEstimationNo?.ESTIMATIONNO
            : estimationCount + 1
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        // html2canvas: { scale: 2, useCORS: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

  // const handlePrint = () => {
  //   const printWindow = window.open("", "", "height=700,width=900");

  //   printWindow.document.write(
  //     "<html><head><title>Estimation Report</title><style>"
  //   );

  //   // Custom Print Styles
  //   printWindow.document.write(`
  //       body {
  //           font-family: Arial, sans-serif;
  //           margin: 20px;
  //           font-size: 12px;
  //       }
  //       .header {
  //           text-align: center;
  //           margin-bottom: 18px;
  //       }
  //       .header h2 {
  //           margin: 0;
  //           font-size: 16px;
  //           font-weight: bold;
  //           display: inline-block;
  //   text-decoration: underline;
  //   text-underline-offset: 4px;
  //       }
  //       .sub-header {
  //           display: flex;
  //           justify-content: space-between;
  //           font-size: 12px;
  //           font-weight: bold;
  //           margin-bottom: 10px;
  //           padding-bottom: 5px;
  //       }
  //       table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           font-size: 12px;
  //           margin-top: 5px;
  //       }
  //       th, td {
  //           border: 1px solid black;
  //           padding: 5px;
  //           text-align: center;
  //       }
  //       th {
  //           background-color: #e0e0e0;
  //           font-weight: bold;
  //       }
  //       .total {
  //           font-weight: bold;
  //           background-color: #ddd;
  //       }
  //       .summary {
  //           display: flex;
  //           justify-content: space-between;
  //           margin-top: 15px;
  //       }
  //       .summary-box {
  //           width: 48%;
  //           border: 1px solid black;
  //           padding: 10px;
  //           font-size: 12px;
  //       }
  //       .summary-box table {
  //           width: 100%;
  //           border: none;
  //       }
  //       .summary-box td {
  //           border: none;
  //           text-align: left;
  //           padding: 3px 0;
  //       }
  //       .footer {
  //           margin-top: 15px;
  //           font-size: 12px;
  //       }
  //   `);

  //   printWindow.document.write("</style></head><body>");

  //   // Header Section
  //   printWindow.document.write(`
  //       <div class="header">
  //           <h2>ESTIMATION</h2>
  //       </div>
  //       <div class="sub-header">
  //           <span>ESTIMATION NO. : ${
  //             selectEstimationNo
  //               ? selectEstimationNo?.ESTIMATIONNO
  //               : estimationCount + 1
  //           }</span>
  //           <span>DATE : ${new Date().toLocaleDateString("en-GB", {
  //             day: "2-digit",
  //             month: "short",
  //             year: "numeric",
  //           })}</span>
  //           <span>PARTY NAME : ${selectedParty}</span>
  //       </div>
  //   `);

  //   // Main Table
  //   printWindow.document.write(`
  //     <style>
  //         table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             border: 2px solid black;
  //             font-family: Arial, sans-serif;
  //             font-size: 12px;
  //         }
  //         th, td {
  //             border: 1px solid black;
  //             padding: 5px;
  //             text-align: center;
  //             vertical-align: middle;
  //         }
  //         th {
  //             font-weight: bold;
  //             background-color: #f0f0f0;
  //         }
  //         td strong {
  //             font-size: 12px;
  //         }
  //         td span {
  //             font-size: 10px;
  //         }
  //         .total td {
  //             font-weight: bold;
  //             background-color: #f0f0f0;
  //         }
  //         /* Ensuring sub-text like STONES: and PEARLS: appear correctly */
  //         td div.sub-text {
  //             text-align: left;
  //             font-size: 10px;
  //             font-weight: bold;
  //         }
  //         td div.sub-value {
  //             text-align: left;
  //             font-size: 10px;
  //         }
  //         /* Row styling for sub-details */
  //         tr.sub-row td {
  //             border-top: none;
  //             text-align: left;
  //         }
  //            .sub {
  //           text-align: left;
  //           width: 400px;
  //       }
  //           .sub-tag {
  //           text-align: center;
  //           width: 100;
  //       }
  //       .sub-right {
  //           text-align: right;
  //           width: 80;
  //       }
  //           .sub-gold {
  //           text-align: right;
  //           width: 130;
  //       }
  //     </style>
  //     <table>
  //         <thead>
  //             <tr>
  //                 <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub">PARTICULARS</th><th>Purity</th><th>Pieces</th><th class="sub-right">Gross.Wt</th>
  //                 <th class="sub-right">Less.Wt</th><th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
  //             </tr>
  //         </thead>
  //         <tbody>
  //   `);

  //   let totalPCS = 0;
  //   let totalGWT = 0;
  //   let totalStone = 0;
  //   let totalNWT = 0;
  //   let totalGold = 0;

  //   tableData.forEach((item, index) => {
  //     const actGrams =
  //       stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
  //       "";
  //     const removeUndefinedWrapper = (str) => {
  //       let prevStr;
  //       do {
  //         prevStr = str;
  //         str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
  //       } while (prevStr !== str);
  //       return str;
  //     };
  //     const cleanedActGrams = removeUndefinedWrapper(actGrams);

  //     printWindow.document.write(`
  //         <tr>
  //         <tr>
  //             <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //       index + 1
  //     }</strong></td>
  //             <td class="sub-tag" rowspan="${
  //               cleanedActGrams ? 2 : 1
  //             }"><strong>${item.TAGNO}</strong></td>
  //             <td class="sub"><strong>${item.PRODNAME}</strong></td>
  //             <td>${item.PREFIX}</td>
  //             <td class="sub-right"><strong>${item.PIECES}</strong></td>
  //             <td class="sub-right"><strong>${item.GWT?.toFixed(
  //               3
  //             )}</strong></td>
  //             <td class="sub-right"><strong />${item.STONEWT}</td>
  //             <td class="sub-right"> <strong />${item.NETWT}</td>
  //             <td class="sub-right"><strong />${item.TOUCH}%</td>
  //             <td class="sub-gold"><strong />${item.FINALGOLD}</td>
  //         </tr>
  //     `);

  //     // Add sub-details row for stones/pearls if available
  //     if (cleanedActGrams) {
  //       printWindow.document.write(`
  //         <tr class="sub-row">
  //             <td colspan="9" class="sub-text">${cleanedActGrams}</td>
  //         </tr>
  //       `);
  //     }

  //     totalPCS += item.PIECES;
  //     totalGWT += item.GWT;
  //     totalStone += Number(item.STONEWT);
  //     totalNWT += Number(item.NETWT);
  //     totalGold += Number(item?.FINALGOLD);
  //   });

  //   printWindow.document.write(`
  //         <tr class="total">
  //             <td colspan="4">Total</td>
  //             <td>${totalPCS}</td>
  //             <td>${totalGWT.toFixed(3)}</td>
  //             <td>${Number(totalStone)?.toFixed(3)}</td>
  //             <td>${Number(totalNWT)?.toFixed(3)}</td>
  //             <td></td>
  //             <td>${Number(totalGold)?.toFixed(3)}</td>
  //         </tr>
  //     </tbody>
  //   </table>
  //   `);

  //   if (path === "/estimations-model1") {
  //     generateEstimationPrint({
  //       showStonesTable: true,
  //       includeRodiumCharges: true,
  //       rateCutChange: true,
  //     });
  //   } else if (path === "/estimations-model2") {
  //     generateEstimationPrint({
  //       showStonesTable: false,
  //       includeRodiumCharges: false,
  //       rateCutChange: true,
  //     });
  //   }

  //   function generateEstimationPrint({
  //     showStonesTable,
  //     includeRodiumCharges,
  //   }) {
  //     printWindow.document.write(`
  //   <style>
  //     body {
  //       font-family: Arial, sans-serif;
  //       font-size: 12px;
  //       margin: 20px;
  //     }
  //     .container {
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: flex-start;
  //   width: 100%;
  //   margin-top: 10px;
  // }
  // .table-container {
  //   width: 55%;
  // }
  // .summary-container {
  //   width: 35%;
  //   margin-left: ${showStonesTable ? "0" : "auto"};
  // }
  //     table {
  //       width: 100%;
  //       border-collapse: collapse;
  //       border: 2px solid black;
  //     }
  //     th, td {
  //       border: 1px solid black;
  //       padding: 5px;
  //       text-align: center;
  //       vertical-align: middle;
  //     }
  //     th {
  //       font-weight: bold;
  //       background-color: #f0f0f0;
  //     }
  //     .total td {
  //       font-weight: bold;
  //       background-color: #dcdcdc;
  //       text-align: right;
  //     }
  //     .stone-name {
  //       text-align: left;
  //     }
  //     .sub-right {
  //       text-align: right;
  //     }
  //     .sub-final {
  //       background-color: rgb(191, 186, 186);
  //     }
  //       .sub-right-bold {
  //       text-align: right;
  //       font-weight: bold;
  //     }
  //       .stone-name-bold {
  //       text-align: left;
  //       font-weight: bold;
  //     }
  //   </style>

  //   <div class="container">
  // `);

  //     if (showStonesTable) {
  //       let totalStoneWeight = 0;
  //       let totalAmount = 0;

  //       printWindow.document.write(`
  //     <div class="table-container">
  //       <table>
  //         <thead>
  //           <tr>
  //             <th class="stone-name">STONE NAME</th>
  //             <th>PIECES</th>
  //             <th class="sub-right">WEIGHT</th>
  //             <th class="sub-right">COST</th>
  //             <th class="sub-right">AMOUNT</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //   `);

  //       stonesData.forEach((stone, index) => {
  //         const rate = stoneRate[index] || 0;
  //         const amount = stone.ACTGRAMS * Number(rate);
  //         totalAmount += amount;
  //         totalStoneWeight += stone.ACTGRAMS;

  //         printWindow.document.write(`
  //       <tr>
  //         <td class="stone-name">${stone.MAINTYPE}</td>
  //         <td>${stone.PCS}</td>
  //         <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
  //         <td class="sub-right">${Number(rate)?.toFixed(2)}</td>
  //         <td class="sub-right">${amount.toFixed(2)}</td>
  //       </tr>
  //     `);
  //       });

  //       printWindow.document.write(`
  //           <tr class="total">
  //             <td colspan="2"></td>
  //             <td>${totalStoneWeight.toFixed(3)}</td>
  //             <td></td>
  //             <td>${totalAmount.toFixed(2)}</td>
  //           </tr>
  //         </tbody>
  //       </table>
  //     </div>
  //   `);
  //     }

  //     printWindow.document.write(`
  //   <div class="summary-container">
  //     <table>
  //       <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
  //         3
  //       )}</td></tr>
  //       ${
  //         rateCut === true
  //           ? `<tr>
  //             <td class="stone-name">
  //               Fine ${fineGoldValue || 0} @${Number(rateValue || 0)}/-
  //             </td>
  //             <td class="sub-right">
  //               ${amountValue ? Number(amountValue).toFixed(2) : 0}
  //             </td>
  //           </tr>`
  //           : ""
  //       }

  //       <tr><td class="stone-name">Making ${
  //         makingValue || 0
  //       } /g</td><td class="sub-right">${
  //       perGramValue ? Number(perGramValue).toFixed(2) : 0
  //     }</td></tr>
  //       ${
  //         includeRodiumCharges
  //           ? `<tr><td class="stone-name">Rodium Charges</td><td class="sub-right">${
  //               rodiumChargeValue || 0
  //             }</td></tr>
  //          <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
  //            2
  //          )}</td></tr>`
  //           : `<tr><td class="stone-name">Stone Cost ${
  //               stoneMakingValue || 0
  //             } /g</td>
  //            <td class="sub-right">${
  //              stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
  //            }</td></tr>`
  //       }
  //       <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
  //         3
  //       )}</strong></td></tr>
  //       <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balnace</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
  //         2
  //       )}</strong></td></tr>
  //     </table>
  //   </div>
  // </div>
  // `);
  //   }

  //   printWindow.document.write("</body></html>");
  //   printWindow.document.close();
  //   printWindow.print();
  // };

  //   const handleDownloadPDF = () => {
  //     const container = document.createElement("div");
  //     container.style.padding = "20px";
  //     container.style.fontFamily = "Arial";
  //     container.style.fontSize = "12px";

  //     container.innerHTML = `
  //     <style>
  //       .main-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin-top: 5px;
  //         font-size: 12px;
  //       }
  //         .main-table th {
  //          border: 1px solid black;
  //         padding: 5px;
  //         text-align: center;
  //         background-color: #52bd91;
  //         }
  //       .main-table td {
  //         border: 1px solid black;
  //         padding: 5px;
  //         text-align: center;
  //       }
  //          .main-table td:nth-child(1),
  // .main-table th:nth-child(1) {
  //   width: auto;
  //   text-align: center;
  // }
  //   .main-table td:nth-child(2),
  // .main-table th:nth-child(2) {
  //   width: 200;
  //   text-align: center;
  // }
  //     .main-table td:nth-child(3),
  // .main-table th:nth-child(3) {
  //   width: 100%;
  //   text-align: left;
  // }
  //   .main-table td:nth-child(4),
  // .main-table th:nth-child(4) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(5),
  // .main-table th:nth-child(5) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(6),
  // .main-table th:nth-child(6) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(7),
  // .main-table th:nth-child(7) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(8),
  // .main-table th:nth-child(8) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(9),
  // .main-table th:nth-child(9) {
  //   width: 200;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(10),
  // .main-table th:nth-child(10) {
  //   width: auto;
  //   text-align: right;
  // }

  //       .stone-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin-top: 10px;
  //         font-size: 12px;
  //       }
  //         .stone-table th {
  //          border: 1px solid black;
  //         padding: 5px;
  //         text-align: center;
  //         background-color: #52bd91;
  //         }
  //       .stone-table td {
  //         border: 1px solid #333;
  //         padding: 5px;
  //         text-align: center;
  //       }

  //       .summary-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         font-size: 12px;
  //         margin-top: 10px;
  //         background: radial-gradient(circle at center, #ffffffff 50%, #f3f6fb 60%, #e0e7f1 80%);
  //       }
  //       .summary-table td {
  //         padding: 5px;
  //         border: 1px solid #aaa;
  //         text-align: right;
  //       }
  //       .summary-table td:first-child {
  //         text-align: left;
  //       }

  //       .total td {
  //         font-weight: bold;
  //         background-color: #162566;
  //         color: white;
  //       }

  //       h2 {
  //         text-align: center;
  //         text-decoration: underline;
  //         text-underline-offset: 4px;
  //         margin: 0 0 18px 0;
  //         font-size: 16px;
  //       }

  //       .sub-header {
  //         display: flex;
  //         justify-content: space-between;
  //         font-weight: bold;
  //         margin-bottom: 10px;
  //       }
  //         .sub-est {
  //         font-weight : bold;
  //         font-size: 18px;
  //         color : red;
  //       }
  //  .sub-party {
  //         font-weight : bold;
  //         font-size: 14px;
  //         color : #162566;
  //       }

  //       .container {
  //         display: flex;
  //         justify-content: space-between;
  //         margin-top: 15px;
  //       }

  //       .table-container {
  //         width: 55%;
  //       }

  //       .summary-container {
  //         width: 35%;
  //         margin-left: ${path === "/estimations-model1" ? "0" : "auto"};
  //       }

  //       .highlight {
  //         background-color: #f26d14ff;
  //         font-weight: bold;
  //       }
  //     </style>

  //     <h2>ESTIMATION</h2>
  //     <div class="sub-header">
  //       <span >ESTIMATION NO : <span class="sub-est">${
  //         selectEstimationNo
  //           ? selectEstimationNo?.ESTIMATIONNO
  //           : estimationCount + 1
  //       }</span></span>
  //       <span>DATE: ${new Date().toLocaleDateString("en-GB", {
  //         day: "2-digit",
  //         month: "short",
  //         year: "numeric",
  //       })}</span>
  //       <span>PARTY NAME: <span class="sub-party">${selectedParty}</span></span>
  //     </div>

  //     <table class="main-table">
  //       <thead>
  //         <tr>
  //           <th>SNo</th>
  //           <th>TAG NO</th>
  //           <th>PARTICULARS</th>
  //           <th>Pieces</th>
  //           <th>Gross.Wt</th>
  //           <th>Less.Wt</th>
  //           <th>Net.Wt</th>
  //           <th>Touch</th>
  //           <th>Fine Gold</th>
  //           <th>Act Per</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         ${tableData
  //           .map((item, index) => {
  //             const actGrams =
  //               stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)
  //                 ?.ACTGRAMS || "";
  //             const cleanedActGrams = actGrams.replace(
  //               /undefined\(\s*(.*?)\s*\)/g,
  //               "$1"
  //             );
  //             const subRow = cleanedActGrams
  //               ? `<tr>
  //                   <td colspan="9" style="text-align:left;font-size:10px;padding-left:10px">
  //                     ${cleanedActGrams}
  //                   </td>
  //                 </tr>`
  //               : "";

  //             return `
  //               <tr>
  //                 <td rowspan="${cleanedActGrams ? 2 : 1}">${index + 1}</td>
  //                 <td rowspan="${cleanedActGrams ? 2 : 1}">${item.TAGNO}</td>
  //                 <td>${item.PRODNAME}</td>
  //                 <td>${item.PIECES}</td>
  //                 <td>${item.GWT?.toFixed(3)}</td>
  //                 <td>${item.STONEWT}</td>
  //                 <td>${item.NETWT}</td>
  //                 <td>${item.TOUCH}%</td>
  //                 <td>${item.FINALGOLD}</td>
  //                 <td>${item.ACTPER}%</td>
  //               </tr>
  //               ${subRow}
  //             `;
  //           })
  //           .join("")}
  //         <tr class="total">
  //           <td colspan="3">Total</td>
  //           <td>${tableData.reduce((sum, i) => sum + (i.PIECES || 0), 0)}</td>
  //           <td>${tableData
  //             .reduce((sum, i) => sum + (i.GWT || 0), 0)
  //             .toFixed(3)}</td>
  //           <td>${totalStoneWeight?.toFixed(3)}</td>
  //             <td>${totalNetWeight.toFixed(3)}</td>
  //             <td colspan="1"></td>
  //              <td>${totalFineGold.toFixed(3)}</td>
  //              <td colspan="1"></td>
  //         </tr>
  //       </tbody>
  //     </table>
  //   `;

  //     container.innerHTML += `
  //     <div class="container">
  //       ${
  //         path === "/estimations-model1"
  //           ? `<div class="table-container">
  //               <table class="stone-table">
  //                 <thead>
  //                   <tr>
  //                     <th>STONE NAME</th>
  //                     <th>PIECES</th>
  //                     <th>WEIGHT</th>
  //                     <th>COST</th>
  //                     <th>AMOUNT</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   ${stonesData
  //                     .map((stone, index) => {
  //                       const rate = stoneRate[index] || 0;
  //                       const amount = stone.ACTGRAMS * Number(rate);
  //                       return `
  //                         <tr>
  //                           <td>${stone.MAINTYPE}</td>
  //                           <td>${stone.PCS}</td>
  //                           <td>${stone.ACTGRAMS.toFixed(3)}</td>
  //                           <td>${Number(rate).toFixed(2)}</td>
  //                           <td>${amount.toFixed(2)}</td>
  //                         </tr>`;
  //                     })
  //                     .join("")}
  //                   <tr class="total">
  //                     <td colspan="2"></td>
  //                     <td>${stonesData
  //                       .reduce((sum, s) => sum + s.ACTGRAMS, 0)
  //                       .toFixed(3)}</td>
  //                     <td></td>
  //                     <td>${stonesData
  //                       .reduce(
  //                         (sum, s, i) => sum + s.ACTGRAMS * (stoneRate[i] || 0),
  //                         0
  //                       )
  //                       .toFixed(2)}</td>
  //                   </tr>
  //                 </tbody>
  //               </table>
  //             </div>`
  //           : ""
  //       }

  //       <div class="summary-container">
  //         <table class="summary-table">
  //           <tr class="highlight"><td>Fine Gold</td><td>${totalFineGold.toFixed(
  //             3
  //           )}</td></tr>
  //           ${
  //             rateCut === true
  //               ? `<tr>
  //               <td class="stone-name">
  //                 Fine ${fineGoldValue || 0} @${Number(rateValue || 0)}/-
  //               </td>
  //               <td class="sub-right">
  //                 ${amountValue ? Number(amountValue).toFixed(2) : 0}
  //               </td>
  //             </tr>`
  //               : ""
  //           }
  //           <tr><td>Making ${makingValue || 0} /g</td><td>${
  //       perGramValue ? Number(perGramValue).toFixed(2) : 0
  //     }</td></tr>
  //           ${
  //             path === "/estimations-model1"
  //               ? `<tr><td>Rodium Charges</td><td>${
  //                   rodiumChargeValue || 0
  //                 }</td></tr>
  //                  <tr><td>Stone Cost</td><td>${totalStoneCost?.toFixed(
  //                    2
  //                  )}</td></tr>`
  //               : `<tr><td>Stone Cost ${stoneMakingValue || 0} /g</td><td>${
  //                   stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
  //                 }</td></tr>`
  //           }
  //           <tr class="highlight"><td>Metal Balance</td><td><strong>${metalBalanceValue.toFixed(
  //             3
  //           )}</strong></td></tr>
  //         <tr class="highlight"><td>Cash Balnace</td><td><strong>${cashBalanceValue.toFixed(
  //           2
  //         )}</strong></td></tr>
  //         </table>
  //       </div>
  //     </div>
  //   `;

  //     // Generate PDF
  //     html2pdf()
  //       .set({
  //         margin: 0,
  //         filename: `Estimation-${
  //           selectEstimationNo
  //             ? selectEstimationNo?.ESTIMATIONNO
  //             : estimationCount + 1
  //         }.pdf`,
  //         image: { type: "jpeg", quality: 0.98 },
  //         html2canvas: { scale: 2 },
  //         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  //       })
  //       .from(container)
  //       .save();
  //   };

  //   const handleLandScapDownloadPDF = () => {
  //     // Prepare your HTML content as a string (like your container.innerHTML)
  //     const htmlContent = `
  //   <html>
  //     <head>
  //       <title>Estimation_${
  //         selectEstimationNo
  //           ? selectEstimationNo?.ESTIMATIONNO
  //           : estimationCount + 1
  //       }</title>
  //       <style>
  //         @media print {
  //           @page {
  //             size: A4 landscape !important;
  //             margin: 2mm;
  //           }
  //           body {
  //             -webkit-print-color-adjust: exact !important;
  //             print-color-adjust: exact !important;
  //             color-adjust: exact !important;
  //           }
  //         }

  //         /* Force color printing for all elements */
  //         * {
  //           -webkit-print-color-adjust: exact !important;
  //           print-color-adjust: exact !important;
  //           color-adjust: exact !important;
  //         }
  //         .main-table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           margin-top: 5px;
  //           font-size: 12px;
  //         }
  //         .main-table th {
  //           border: 1px solid black;
  //           padding: 5px;
  //           text-align: center;
  //           background-color: #52bd91;
  //         }
  //         .main-table td {
  //           border: 1px solid black;
  //           padding: 5px;
  //           text-align: center;
  //         }
  //           .main-table td:nth-child(1),
  // .main-table th:nth-child(1) {
  //   width: auto;
  //   text-align: center;
  // }
  //   .main-table td:nth-child(2),
  // .main-table th:nth-child(2) {
  //   width: auto;
  //   text-align: center;
  // }
  //     .main-table td:nth-child(3),
  // .main-table th:nth-child(3) {
  //   width: auto;
  //   text-align: center;
  // }
  //   .main-table td:nth-child(4),
  // .main-table th:nth-child(4) {
  //   width: 100%;
  //   text-align: left;
  // }
  //   .main-table td:nth-child(5),
  // .main-table th:nth-child(5) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(6),
  // .main-table th:nth-child(6) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(7),
  // .main-table th:nth-child(7) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(8),
  // .main-table th:nth-child(8) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(9),
  // .main-table th:nth-child(9) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(10),
  // .main-table th:nth-child(10) {
  //   width: auto;
  //   text-align: right;
  // }
  //   .main-table td:nth-child(11),
  // .main-table th:nth-child(11) {
  //   width: auto;
  //   text-align: right;
  // }
  //         .stone-table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           margin-top: 10px;
  //           font-size: 12px;
  //         }
  //         .stone-table th {
  //           border: 1px solid black;
  //           padding: 5px;
  //           text-align: center;
  //           background-color: #52bd91;
  //         }
  //         .stone-table td {
  //           border: 1px solid #333;
  //           padding: 5px;
  //           text-align: center;
  //         }
  //         .summary-table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           font-size: 12px;
  //           margin-top: 10px;
  //           background: radial-gradient(circle at center, #ffffffff 50%, #f3f6fb 60%, #e0e7f1 80%);
  //         }
  //         .summary-table td {
  //           padding: 5px;
  //           border: 1px solid #aaa;
  //           text-align: right;
  //         }
  //         .summary-table td:first-child {
  //           text-align: left;
  //         }
  //         .total td {
  //           font-weight: bold;
  //           background-color: #162566;
  //           color: white;
  //         }
  //         h2 {
  //           text-align: center;
  //           text-decoration: underline;
  //           text-underline-offset: 4px;
  //           margin: 0 0 18px 0;
  //           font-size: 16px;
  //         }
  //         .sub-header {
  //           display: flex;
  //           justify-content: space-between;
  //           font-weight: bold;
  //           margin-bottom: 10px;
  //         }
  //         .sub-est {
  //           font-weight : bold;
  //           font-size: 18px;
  //           color : red;
  //         }
  //         .sub-party {
  //           font-weight : bold;
  //           font-size: 14px;
  //           color : #162566;
  //         }
  //         .container {
  //           display: flex;
  //           justify-content: space-between;
  //           margin-top: 15px;
  //         }
  //         .table-container {
  //           width: 55%;
  //         }
  //         .summary-container {
  //           width: 35%;
  //           margin-left: ${path === "/estimations-model1" ? "0" : "auto"};
  //         }
  //         .highlight {
  //           background-color: #f26d14ff;
  //           font-weight: bold;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <h2>ESTIMATION</h2>
  //       <div class="sub-header">
  //         <span>ESTIMATION NO : <span class="sub-est">${
  //           selectEstimationNo
  //             ? selectEstimationNo?.ESTIMATIONNO
  //             : estimationCount + 1
  //         }</span></span>
  //         <span>DATE: ${new Date().toLocaleDateString("en-GB", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "numeric",
  //         })}</span>
  //         <span>PARTY NAME: <span class="sub-party">${selectedParty}</span></span>
  //       </div>

  //       <table class="main-table">
  //         <thead>
  //           <tr>
  //             <th>SNo</th>
  //             <th>TAG NO</th>
  //             <th>Image</th>
  //             <th>PARTICULARS</th>
  //             <th>Pieces</th>
  //             <th>Gross.Wt</th>
  //             <th>Less.Wt</th>
  //             <th>Net.Wt</th>
  //             <th>Touch</th>
  //             <th>Fine Gold</th>
  //             <th>Act Per</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${tableData
  //             .map((item, index) => {
  //               const actGrams =
  //                 stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)
  //                   ?.ACTGRAMS || "";
  //               const cleanedActGrams = actGrams.replace(
  //                 /undefined\(\s*(.*?)\s*\)/g,
  //                 "$1"
  //               );
  //               const subRow = cleanedActGrams
  //                 ? `<tr>
  //                     <td colspan="10" style="text-align:left;font-size:10px;padding-left:10px">
  //                       ${cleanedActGrams}
  //                     </td>
  //                   </tr>`
  //                 : "";

  //               const imgurl = item.IMGPATH
  //                 ? `<img src="${item.IMGPATH}"
  //                      alt="Product Image"
  //                      style="width:80px;height:80px;object-fit:contain;border-radius:6px;" />`
  //                 : "";

  //               return `
  //                 <tr>
  //                   <td rowspan="${cleanedActGrams ? 2 : 1}">${index + 1}</td>
  //                   <td rowspan="${cleanedActGrams ? 2 : 1}">${item.TAGNO}</td>
  //                   <td rowspan="${cleanedActGrams ? 2 : 1}">${imgurl}</td>
  //                   <td>${item.PRODNAME}</td>
  //                   <td>${item.PIECES}</td>
  //                   <td>${item.GWT?.toFixed(3)}</td>
  //                   <td>${item.STONEWT}</td>
  //                   <td>${item.NETWT}</td>
  //                   <td>${item.TOUCH}%</td>
  //                   <td>${item.FINALGOLD}</td>
  //                   <td>${item.ACTPER}%</td>
  //                 </tr>
  //                 ${subRow}
  //               `;
  //             })
  //             .join("")}
  //           <tr class="total">
  //             <td colspan="4">Total</td>
  //             <td>${tableData.reduce((sum, i) => sum + (i.PIECES || 0), 0)}</td>
  //             <td>${tableData
  //               .reduce((sum, i) => sum + (i.GWT || 0), 0)
  //               .toFixed(3)}</td>
  //             <td>${totalStoneWeight?.toFixed(3)}</td>
  //             <td>${totalNetWeight.toFixed(3)}</td>
  //             <td colspan="1"></td>
  //             <td>${totalFineGold.toFixed(3)}</td>
  //             <td colspan="1"></td>
  //           </tr>
  //         </tbody>
  //       </table>

  //       <div class="container">
  //         ${
  //           path === "/estimations-model1"
  //             ? `<div class="table-container">
  //                 <table class="stone-table">
  //                   <thead>
  //                     <tr>
  //                       <th>STONE NAME</th>
  //                       <th>PIECES</th>
  //                       <th>WEIGHT</th>
  //                       <th>COST</th>
  //                       <th>AMOUNT</th>
  //                     </tr>
  //                   </thead>
  //                   <tbody>
  //                     ${stonesData
  //                       .map((stone, index) => {
  //                         const rate = stoneRate[index] || 0;
  //                         const amount = stone.ACTGRAMS * Number(rate);
  //                         return `
  //                           <tr>
  //                             <td>${stone.MAINTYPE}</td>
  //                             <td>${stone.PCS}</td>
  //                             <td>${stone.ACTGRAMS.toFixed(3)}</td>
  //                             <td>${Number(rate).toFixed(2)}</td>
  //                             <td>${amount.toFixed(2)}</td>
  //                           </tr>`;
  //                       })
  //                       .join("")}
  //                     <tr class="total">
  //                       <td colspan="2"></td>
  //                       <td>${stonesData
  //                         .reduce((sum, s) => sum + s.ACTGRAMS, 0)
  //                         .toFixed(3)}</td>
  //                       <td></td>
  //                       <td>${stonesData
  //                         .reduce(
  //                           (sum, s, i) => sum + s.ACTGRAMS * (stoneRate[i] || 0),
  //                           0
  //                         )
  //                         .toFixed(2)}</td>
  //                     </tr>
  //                   </tbody>
  //                 </table>
  //               </div>`
  //             : ""
  //         }

  //         <div class="summary-container">
  //           <table class="summary-table">
  //             <tr class="highlight"><td>Fine Gold</td><td>${totalFineGold.toFixed(
  //               3
  //             )}</td></tr>
  //             ${
  //               rateCut === true
  //                 ? `<tr>
  //                     <td class="stone-name">
  //                       Fine ${fineGoldValue || 0} @${Number(rateValue || 0)}/-
  //                     </td>
  //                     <td class="sub-right">
  //                       ${amountValue ? Number(amountValue).toFixed(2) : 0}
  //                     </td>
  //                   </tr>`
  //                 : ""
  //             }
  //             <tr><td>Making ${makingValue || 0} /g</td><td>${
  //       perGramValue ? Number(perGramValue).toFixed(2) : 0
  //     }</td></tr>
  //             ${
  //               path === "/estimations-model1"
  //                 ? `<tr><td>Rodium Charges</td><td>${
  //                     rodiumChargeValue || 0
  //                   }</td></tr>
  //                    <tr><td>Stone Cost</td><td>${totalStoneCost?.toFixed(
  //                      2
  //                    )}</td></tr>`
  //                 : `<tr><td>Stone Cost ${stoneMakingValue || 0} /g</td><td>${
  //                     stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
  //                   }</td></tr>`
  //             }
  //             <tr class="highlight"><td>Metal Balance</td><td><strong>${metalBalanceValue.toFixed(
  //               3
  //             )}</strong></td></tr>
  //             <tr class="highlight"><td>Cash Balnace</td><td><strong>${cashBalanceValue.toFixed(
  //               2
  //             )}</strong></td></tr>
  //           </table>
  //         </div>
  //       </div>
  //     </body>
  //   </html>
  //   `;

  //     // Open new window for print
  //     const printWindow = window.open("", "_blank", "width=1200,height=900");

  //     printWindow.document.open();
  //     printWindow.document.write(htmlContent);
  //     printWindow.document.close();

  //     printWindow.focus();

  //     // Delay print slightly to ensure styles load
  //     setTimeout(() => {
  //       printWindow.print();
  //       // Optional: close window after print
  //       // printWindow.close();
  //     }, 500);

  //     // Optional: close the print window automatically after printing
  //     // printWindow.close();
  //   };

  const handleDownloadPDF = () => {
    let totalPCS = 0;
    let totalGWT = 0;
    let totalStone = 0;
    let totalNWT = 0;
    let totalGold = 0;

    // Build table rows
    const tableRows = tableData
      .map((item, index) => {
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

        totalPCS += item.PIECES;
        totalGWT += item.GWT;
        totalStone += Number(item.STONEWT);
        totalNWT += Number(item.NETWT);
        totalGold += Number(item?.FINALGOLD);

        return `
        <tr>
          <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
          index + 1
        }</strong></td>
          <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
          item.TAGNO
        }</strong></td>
          <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
          <td>${item.PREFIX}</td>
          <td class="sub-right"><strong>${item.PIECES}</strong></td>
          <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
          <td class="sub-right">${item.STONEWT}</td>
          <td class="sub-right">${item.NETWT}</td>
          <td class="sub-right">${item.TOUCH}%</td>
          <td class="sub-gold">${item.FINALGOLD}</td>
        </tr>
        ${
          cleanedActGrams
            ? `<tr class="sub-row"><td colspan="10" class="sub-text">${cleanedActGrams}</td></tr>`
            : ""
        }
      `;
      })
      .join("");

    // Totals row
    const totalsRow = `
    <tr class="total">
      <td colspan="4">Total</td>
      <td>${totalPCS}</td>
      <td>${totalGWT.toFixed(3)}</td>
      <td>${Number(totalStone)?.toFixed(3)}</td>
      <td>${Number(totalNWT)?.toFixed(3)}</td>
      <td></td>
      <td>${Number(totalGold)?.toFixed(3)}</td>
    </tr>
  `;

    // Stones table if applicable
    const stonesTable =
      path === "/estimations-model1"
        ? `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="sub-stone-name">STONE NAME</th>
                <th class="stone-pieces">PIECES</th>
                <th class="stone-weight">WEIGHT</th>
                <th class="stone-cost">COST</th>
                <th class="stone-amount">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let totalStoneWeight = 0;
                let totalAmount = 0;
                let totalStonePieces = 0;
                return (
                  stonesData
                    .map((stone, index) => {
                      const rate = stoneRate[index] || 0;
                      const amount = stone.ACTGRAMS * Number(rate);
                      totalAmount += amount;
                      totalStoneWeight += stone.ACTGRAMS;
                      totalStonePieces += stone.PCS
                      return `
                      <tr>
                        <td class="sub-stone-name">${stone.MAINTYPE}</td>
                        <td class="stone-pieces">${stone.PCS}</td>
                        <td class="stone-weight">${stone.ACTGRAMS.toFixed(3)}</td>
                        <td class="stone-cost">${Number(rate)?.toFixed(2)}</td>
                        <td class="stone-amount">${amount.toFixed(2)}</td>
                      </tr>
                    `;
                    })
                    .join("") +
                  `<tr class="total">
                    <td colspan="1">Total</td>
                    <td class="stone-pieces">${totalStonePieces}</td>
                    <td class="stone-weight">${totalStoneWeight.toFixed(3)}</td>
                    <td class="stone-cost"></td>
                    <td class="stone-amount">${totalAmount.toFixed(2)}</td>
                  </tr>`
                );
              })()}
            </tbody>
          </table>
        </div>
      `
        : "";

    // Summary table
    const summaryTable = `
    <div class="summary-container">
      <table>
        <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
          3
        )}</td></tr>
        ${
          rateCut === true
            ? `<tr><td class="stone-name">Fine ${fineGoldValue || 0} @${Number(
                rateValue || 0
              )}/-</td>
                <td class="sub-right">${
                  amountValue ? Number(amountValue).toFixed(2) : 0
                }</td></tr>`
            : ""
        }
        <tr><td class="stone-name">Making ${
          makingValue || 0
        } /g</td><td class="sub-right">${
      perGramValue ? Number(perGramValue).toFixed(2) : 0
    }</td></tr>
        ${
          path === "/estimations-model1"
            ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                rodiumChargeValue || 0
              }</td></tr>
               <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                 2
               )}</td></tr>`
            : `<tr><td class="stone-name">Stone Cost ${
                stoneMakingValue || 0
              } /g</td>
               <td class="sub-right">${
                 stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
               }</td></tr>`
        }
        <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
          3
        )}</strong></td></tr>
        <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
          2
        )}</strong></td></tr>
      </table>
    </div>
  `;

    // Build full HTML content
    const htmlContent = `
    <html>
      <head>
        <style>
           body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 18px;
        }
        .header h2 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
    text-decoration: underline;
    text-underline-offset: 4px;
        }
        .sub-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
             .sub-est {
          font-weight : bold;
          font-size: 18px;
          color : red;
        }
          .sub-party {
          font-weight : bold;
          font-size: 14px;
          color : #162566;
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
            background-color: #52bd91;
            font-weight: bold;
        }
        .total {
            font-weight: bold;
            background-color: #162566;
            color: white;
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
          .sub {
            text-align: left;
            width: 300px;
        }
            .sub-pro {
              text-align: left;
              width: 500;
              background-color: #BCF2F6;
          }
            .sub-tag {
            text-align: center;
            width: 100;
        }
        .sub-right {
            text-align: right;
            width: 80;
        }
            .sub-gold {
            text-align: right;
            width: 130;
        }
          .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
          .sub-row td { border-top: none; text-align: left; }
          .container { display: flex; justify-content: space-between; margin-top: 10px; }
          .table-container { width: 55%; }
          .summary-container { width: 35%; }
          .stone-name { text-align: left; }
          .sub-final { background-color: #f26d14ff; font-weight: bold; }
          .sub-right-bold { text-align: right; font-weight: bold; }
          .stone-name-bold { text-align: left; font-weight: bold; }
          .sub-stone-name { text-align: left;  width: 100px}
          .stone-pieces { text-align: center; font-weight: bold; width: 60px }
          .stone-weight { text-align: right; width: 60px }
          .stone-cost { text-align: right; width: 60px }
          .stone-amount { text-align: right; width: 60px }
        </style>
      </head>
      <body>
        <div class="header"><h2>ESTIMATION</h2></div>
        <div class="sub-header">
          <span>ESTIMATION NO. : <span class="sub-est">${
            selectEstimationNo
              ? selectEstimationNo?.ESTIMATIONNO
              : estimationCount + 1
          }</span></span>
          <span>DATE : ${new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}</span>
          <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
        </div>
        <table>
          <thead>
            <tr>
              <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub">PARTICULARS</th><th>Purity</th>
              <th>Pieces</th><th class="sub-right">Gross.Wt</th><th class="sub-right">Less.Wt</th>
              <th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            ${totalsRow}
          </tbody>
        </table>
        <div class="container">
          ${stonesTable}
          ${summaryTable}
        </div>
      </body>
    </html>
  `;

    // Create container for html2pdf
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2pdf()
      .set({
        margin: [10, 5, 10, 5],
        filename: `Estimation_${
          selectEstimationNo
            ? selectEstimationNo?.ESTIMATIONNO
            : estimationCount + 1
        }.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

//   const handleDownloadPDF = () => {
//   let totalPCS = 0;
//   let totalGWT = 0;
//   let totalStone = 0;
//   let totalNWT = 0;
//   let totalGold = 0;

//   // Build table rows
//   const tableRows = tableData
//     .map((item, index) => {
//       const actGrams =
//         stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
//         "";
//       const removeUndefinedWrapper = (str) => {
//         let prevStr;
//         do {
//           prevStr = str;
//           str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
//         } while (prevStr !== str);
//         return str;
//       };
//       const cleanedActGrams = removeUndefinedWrapper(actGrams);

//       totalPCS += item.PIECES;
//       totalGWT += item.GWT;
//       totalStone += Number(item.STONEWT);
//       totalNWT += Number(item.NETWT);
//       totalGold += Number(item?.FINALGOLD);
//       const imgPath = item.IMGPATH || photos[index] || "";
//       const base64Img = base64Images[imgPath] || "";

//       return `
//         <tr>
//           <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${index + 1}</strong></td>
//           <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${item.TAGNO}</strong></td>
//           <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
//           <td>${item.PREFIX}</td>
//           <td class="sub-right"><strong>${item.PIECES}</strong></td>
//           <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
//           <td class="sub-right">${item.STONEWT}</td>
//           <td class="sub-right">${item.NETWT}</td>
//           <td class="sub-right">${item.TOUCH}%</td>
//           <td class="sub-gold">${item.FINALGOLD}</td>
//         </tr>
//         ${
//           cleanedActGrams
//             ? `<tr class="sub-row"><td colspan="10" class="sub-text">${cleanedActGrams}</td></tr>`
//             : ""
//         }
//       `;
//     })
//     .join("");

//   // Totals row
//   const totalsRow = `
//     <tr class="total">
//       <td colspan="4">Total</td>
//       <td class="sub-right">${totalPCS}</td>
//       <td class="sub-right">${totalGWT.toFixed(3)}</td>
//       <td class="sub-right">${Number(totalStone)?.toFixed(3)}</td>
//       <td class="sub-right">${Number(totalNWT)?.toFixed(3)}</td>
//       <td></td>
//       <td class="sub-right">${Number(totalGold)?.toFixed(3)}</td>
//     </tr>
//   `;

//   // Stones table if applicable
//   const stonesTable =
//     path === "/estimations-model1"
//       ? `
//         <div class="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th class="sub-stone-name">STONE NAME</th>
//                 <th class="stone-pieces">PIECES</th>
//                 <th class="stone-weight">WEIGHT</th>
//                 <th class="stone-cost">COST</th>
//                 <th class="stone-amount">AMOUNT</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${(() => {
//                 let totalStoneWeight = 0;
//                 let totalAmount = 0;
//                 let totalStonePieces = 0;
//                 return (
//                   stonesData
//                     .map((stone, index) => {
//                       const rate = stoneRate[index] || 0;
//                       const amount = stone.ACTGRAMS * Number(rate);
//                       totalAmount += amount;
//                       totalStoneWeight += stone.ACTGRAMS;
//                       totalStonePieces += stone.PCS;
//                       return `
//                       <tr>
//                         <td class="sub-stone-name">${stone.MAINTYPE}</td>
//                         <td class="stone-pieces">${stone.PCS}</td>
//                         <td class="stone-weight">${stone.ACTGRAMS.toFixed(3)}</td>
//                         <td class="stone-cost">${Number(rate)?.toFixed(2)}</td>
//                         <td class="stone-amount">${amount.toFixed(2)}</td>
//                       </tr>
//                     `;
//                     })
//                     .join("") +
//                   `<tr class="total">
//                     <td colspan="1">Total</td>
//                     <td class="stone-pieces">${totalStonePieces}</td>
//                     <td class="stone-weight">${totalStoneWeight.toFixed(3)}</td>
//                     <td class="stone-cost"></td>
//                     <td class="stone-amount">${totalAmount.toFixed(2)}</td>
//                   </tr>`
//                 );
//               })()}
//             </tbody>
//           </table>
//         </div>
//       `
//       : "";

//   // Summary table
//   const summaryTable = `
//     <div class="summary-container">
//       <table>
//         <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
//           3
//         )}</td></tr>
//         ${
//           rateCut === true
//             ? `<tr><td class="stone-name">Fine ${fineGoldValue || 0} @${Number(
//                 rateValue || 0
//               )}/-</td>
//                 <td class="sub-right">${
//                   amountValue ? Number(amountValue).toFixed(2) : 0
//                 }</td></tr>`
//             : ""
//         }
//         <tr><td class="stone-name">Making ${
//           makingValue || 0
//         } /g</td><td class="sub-right">${
//     perGramValue ? Number(perGramValue).toFixed(2) : 0
//   }</td></tr>
//         ${
//           path === "/estimations-model1"
//             ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
//                 rodiumChargeValue || 0
//               }</td></tr>
//                <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
//                  2
//                )}</td></tr>`
//             : `<tr><td class="stone-name">Stone Cost ${
//                 stoneMakingValue || 0
//               } /g</td>
//                <td class="sub-right">${
//                  stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
//                }</td></tr>`
//         }
//         <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
//           3
//         )}</strong></td></tr>
//         <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
//           2
//         )}</strong></td></tr>
//       </table>
//     </div>
//   `;

//   // Build full HTML content
//   const htmlContent = `
//     <html>
//       <head>
//         <style>
//            body {
//             font-family: Arial, sans-serif;
//             margin: 20px;
//             font-size: 12px;
//         }
//         .header {
//             text-align: center;
//             margin-bottom: 12px;
//           }
//           .header h2 {
//             margin: 0;
//             font-size: 16px;
//             font-weight: bold;
//             text-decoration: underline;
//             text-underline-offset: 3px;
//           }
//           .sub-header {
//             display: flex;
//             justify-content: space-between;
//             font-size: 11px;
//             font-weight: bold;
//             margin-bottom: 8px;
//           }
//           .sub-est { font-weight: bold; font-size: 14px; color: red; }
//           .sub-party { font-weight: bold; font-size: 13px; color: #162566; }

//           table {
//             border-collapse: collapse;
//             width: 100%;
//             font-size: 10px;
//           }
//           th, td {
//             border: 1px solid #000;
//             padding: 4px;
//             text-align: center;
//           }
//           thead {
//             display: table-header-group;
//             background: #e6f8f9;
//             font-weight: bold;
//           }
//           tfoot { display: table-footer-group; }
//           tr { page-break-inside: avoid; break-inside: avoid; }
//           .table-container, .summary-container { page-break-inside: avoid; }

//           th {
//             background-color: #52bd91;
//             font-weight: bold;
//           }
//         .total {
//             font-weight: bold;
//             background-color: #162566;
//             color: white;
//         }
//         .summary {
//             display: flex;
//             justify-content: space-between;
//             margin-top: 15px;
//         }
//         .summary-box {
//             width: 48%;
//             border: 1px solid black;
//             padding: 10px;
//             font-size: 12px;
//         }
//         .summary-box table {
//             width: 100%;
//             border: none;
//         }
//         .summary-box td {
//             border: none;
//             text-align: left;
//             padding: 3px 0;
//         }
//         .footer {
//             margin-top: 15px;
//             font-size: 12px;
//         }
//         .sub {
//             text-align: left;
//             width: 300px;
//         }
//         .sub-pro {
//             text-align: left;
//             width: 500;
//             background-color: #BCF2F6;
//         }
//         .sub-tag {
//             text-align: center;
//             width: 100;
//         }
//         .sub-image {
//             text-align: center;
//         }
//         .sub-img {
//             display: flex;
//             text-align: center;
//             border-radius: 10px;
//             width: 100%;
//             height: 100%;
//             align-items: center;
//         }
//         .sub-right {
//             text-align: right;
//             width: 80;
//         }
//         .sub-gold {
//             text-align: right;
//             width: 130;
//         }
//         .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
//         .sub-row td { border-top: none; text-align: left; }
//         .container { display: flex; justify-content: space-between; margin-top: 10px; }
//         .table-container { width: 40%; }
//         .summary-container { width: 35%; }
//         .stone-name { text-align: left;}
//         .sub-final { background-color: #f26d14ff; font-weight: bold; }
//         .sub-right-bold { text-align: right; font-weight: bold; }
//         .stone-name-bold { text-align: left; font-weight: bold; }
//         .sub-stone-name { text-align: left;  width: 100px}
//         .stone-pieces { text-align: center; font-weight: bold; width: 60px }
//         .stone-weight { text-align: right; width: 60px }
//         .stone-cost { text-align: right; width: 60px }
//         .stone-amount { text-align: right; width: 60px }
//         </style>
//       </head>
//       <body>
//         <div class="header"><h2>ESTIMATION</h2></div>
//         <div class="sub-header">
//           <span>ESTIMATION NO. : <span class="sub-est">${
//             selectEstimationNo
//               ? selectEstimationNo?.ESTIMATIONNO
//               : estimationCount + 1
//           }</span></span>
//           <span>DATE : ${new Date().toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })}</span>
//           <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub">PARTICULARS</th><th>Purity</th>
//               <th>Pieces</th><th class="sub-right">Gross.Wt</th><th class="sub-right">Less.Wt</th>
//               <th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${tableRows}
//             ${totalsRow}
//           </tbody>
//         </table>
//         <div class="container">
//           ${stonesTable}
//           ${summaryTable}
//         </div>
//       </body>
//     </html>
//   `;

//   // Create container for html2pdf
//   const container = document.createElement("div");
//   container.innerHTML = htmlContent;
//   document.body.appendChild(container);

//   html2pdf()
//     .set({
//       margin: [10, 5, 10, 5],
//       filename: `Estimation_${
//         selectEstimationNo
//           ? selectEstimationNo?.ESTIMATIONNO
//           : estimationCount + 1
//       }.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
//       pagebreak: { mode: ["avoid-all", "css", "legacy"] }
//     })
//     .from(container)
//     .save()
//     .then(() => {
//       document.body.removeChild(container);
//     });
// };

  //   const handleLandScapDownloadPDF = () => {
  //     let totalPCS = 0;
  //     let totalGWT = 0;
  //     let totalStone = 0;
  //     let totalNWT = 0;
  //     let totalGold = 0;

  //     // Build table rows
  //     const tableRows = tableData
  //       .map((item, index) => {
  //         const actGrams =
  //           stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
  //           "";
  //         const removeUndefinedWrapper = (str) => {
  //           let prevStr;
  //           do {
  //             prevStr = str;
  //             str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
  //           } while (prevStr !== str);
  //           return str;
  //         };
  //         const cleanedActGrams = removeUndefinedWrapper(actGrams);

  //         totalPCS += item.PIECES;
  //         totalGWT += item.GWT;
  //         totalStone += Number(item.STONEWT);
  //         totalNWT += Number(item.NETWT);
  //         totalGold += Number(item?.FINALGOLD);
  //         const imgPath = item.IMGPATH || photos[index] || "";
  // // const imgTag = imgPath
  // //   ? `<img src="${imgPath}"
  // //           alt="Item Image"
  // //           style="max-width:80px; max-height:80px; object-fit:contain;"
  // //            />`
  // //   : "";

  //         return `
  //         <tr>
  //           <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //           index + 1
  //         }</strong></td>
  //           <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //           item.TAGNO
  //         }</strong></td>
  //         <td rowspan="${cleanedActGrams ? 2 : 1}">

  // ${imgPath
  //   ? `<img src="${imgPath}"
  //           alt="Item Image"
  //           style="max-width:80px; max-height:80px;"
  //            />`
  //   : ""}
  // </td>
  //           <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
  //           <td>${item.PREFIX}</td>
  //           <td class="sub-right"><strong>${item.PIECES}</strong></td>
  //           <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
  //           <td class="sub-right">${item.STONEWT}</td>
  //           <td class="sub-right">${item.NETWT}</td>
  //           <td class="sub-right">${item.TOUCH}%</td>
  //           <td class="sub-gold">${item.FINALGOLD}</td>
  //         </tr>
  //         ${
  //           cleanedActGrams
  //             ? `<tr class="sub-row"><td colspan="10" class="sub-text">${cleanedActGrams}</td></tr>`
  //             : ""
  //         }
  //       `;
  //       })
  //       .join("");

  //     // Totals row
  //     const totalsRow = `
  //     <tr class="total">
  //       <td colspan="5">Total</td>
  //       <td>${totalPCS}</td>
  //       <td>${totalGWT.toFixed(3)}</td>
  //       <td>${Number(totalStone)?.toFixed(3)}</td>
  //       <td>${Number(totalNWT)?.toFixed(3)}</td>
  //       <td></td>
  //       <td>${Number(totalGold)?.toFixed(3)}</td>
  //     </tr>
  //   `;

  //     // Stones table if applicable
  //     const stonesTable =
  //       path === "/estimations-model1"
  //         ? `
  //         <div class="table-container">
  //           <table>
  //             <thead>
  //               <tr>
  //                 <th class="stone-name">STONE NAME</th>
  //                 <th>PIECES</th>
  //                 <th class="sub-right">WEIGHT</th>
  //                 <th class="sub-right">COST</th>
  //                 <th class="sub-right">AMOUNT</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               ${(() => {
  //                 let totalStoneWeight = 0;
  //                 let totalAmount = 0;
  //                 return (
  //                   stonesData
  //                     .map((stone, index) => {
  //                       const rate = stoneRate[index] || 0;
  //                       const amount = stone.ACTGRAMS * Number(rate);
  //                       totalAmount += amount;
  //                       totalStoneWeight += stone.ACTGRAMS;
  //                       return `
  //                       <tr>
  //                         <td class="stone-name">${stone.MAINTYPE}</td>
  //                         <td>${stone.PCS}</td>
  //                         <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
  //                         <td class="sub-right">${Number(rate)?.toFixed(2)}</td>
  //                         <td class="sub-right">${amount.toFixed(2)}</td>
  //                       </tr>
  //                     `;
  //                     })
  //                     .join("") +
  //                   `<tr class="total">
  //                     <td colspan="2"></td>
  //                     <td>${totalStoneWeight.toFixed(3)}</td>
  //                     <td></td>
  //                     <td>${totalAmount.toFixed(2)}</td>
  //                   </tr>`
  //                 );
  //               })()}
  //             </tbody>
  //           </table>
  //         </div>
  //       `
  //         : "";

  //     // Summary table
  //     const summaryTable = `
  //     <div class="summary-container">
  //       <table>
  //         <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
  //           3
  //         )}</td></tr>
  //         ${
  //           rateCut === true
  //             ? `<tr><td class="stone-name">Fine ${fineGoldValue || 0} @${Number(
  //                 rateValue || 0
  //               )}/-</td>
  //                 <td class="sub-right">${
  //                   amountValue ? Number(amountValue).toFixed(2) : 0
  //                 }</td></tr>`
  //             : ""
  //         }
  //         <tr><td class="stone-name">Making ${
  //           makingValue || 0
  //         } /g</td><td class="sub-right">${
  //       perGramValue ? Number(perGramValue).toFixed(2) : 0
  //     }</td></tr>
  //         ${
  //           path === "/estimations-model1"
  //             ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
  //                 rodiumChargeValue || 0
  //               }</td></tr>
  //                <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
  //                  2
  //                )}</td></tr>`
  //             : `<tr><td class="stone-name">Stone Cost ${
  //                 stoneMakingValue || 0
  //               } /g</td>
  //                <td class="sub-right">${
  //                  stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
  //                }</td></tr>`
  //         }
  //         <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
  //           3
  //         )}</strong></td></tr>
  //         <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
  //           2
  //         )}</strong></td></tr>
  //       </table>
  //     </div>
  //   `;

  //     // Build full HTML content
  //     const htmlContent = `
  //     <html>
  //       <head>
  //         <style>
  //            body {
  //             font-family: Arial, sans-serif;
  //             margin: 20px;
  //             font-size: 12px;
  //         }
  //         .header {
  //             text-align: center;
  //             margin-bottom: 18px;
  //         }
  //         .header h2 {
  //             margin: 0;
  //             font-size: 16px;
  //             font-weight: bold;
  //             display: inline-block;
  //     text-decoration: underline;
  //     text-underline-offset: 4px;
  //         }
  //         .sub-header {
  //             display: flex;
  //             justify-content: space-between;
  //             font-size: 12px;
  //             font-weight: bold;
  //             margin-bottom: 10px;
  //             padding-bottom: 5px;
  //         }
  //              .sub-est {
  //           font-weight : bold;
  //           font-size: 18px;
  //           color : red;
  //         }
  //           .sub-party {
  //           font-weight : bold;
  //           font-size: 14px;
  //           color : #162566;
  //         }
  //         table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             font-size: 12px;
  //             margin-top: 5px;
  //         }
  //         th, td {
  //             border: 1px solid black;
  //             padding: 5px;
  //             text-align: center;
  //         }
  //         th {
  //             background-color: #52bd91;
  //             font-weight: bold;
  //         }
  //         .total {
  //             font-weight: bold;
  //             background-color: #162566;
  //             color: white;
  //         }
  //         .summary {
  //             display: flex;
  //             justify-content: space-between;
  //             margin-top: 15px;
  //         }
  //         .summary-box {
  //             width: 48%;
  //             border: 1px solid black;
  //             padding: 10px;
  //             font-size: 12px;
  //         }
  //         .summary-box table {
  //             width: 100%;
  //             border: none;
  //         }
  //         .summary-box td {
  //             border: none;
  //             text-align: left;
  //             padding: 3px 0;
  //         }
  //         .footer {
  //             margin-top: 15px;
  //             font-size: 12px;
  //         }
  //           .sub {
  //             text-align: left;
  //             width: 300px;
  //         }
  //             .sub-pro {
  //               text-align: left;
  //               width: 500;
  //               background-color: #BCF2F6;
  //           }
  //             .sub-tag {
  //             text-align: center;
  //             width: 100;
  //         }
  //              .sub-image {
  //             text-align: center;
  //         }
  //             .sub-img {
  //             display: flex;
  //             text-align: center;
  //             border-radius: 10px;
  //             width: 100%;
  //             height: 100%;
  //             align-items: center;
  //         }
  //         .sub-right {
  //             text-align: right;
  //             width: 80;
  //         }
  //             .sub-gold {
  //             text-align: right;
  //             width: 130;
  //         }
  //           .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
  //           .sub-row td { border-top: none; text-align: left; }
  //           .container { display: flex; justify-content: space-between; margin-top: 10px; }
  //           .table-container { width: 55%; }
  //           .summary-container { width: 35%; }
  //           .stone-name { text-align: left; }
  //           .sub-final { background-color: #f26d14ff; font-weight: bold; }
  //           .sub-right-bold { text-align: right; font-weight: bold; }
  //           .stone-name-bold { text-align: left; font-weight: bold; }
  //         </style>
  //       </head>
  //       <body>
  //         <div class="header"><h2>ESTIMATION</h2></div>
  //         <div class="sub-header">
  //           <span>ESTIMATION NO. : <span class="sub-est">${
  //             selectEstimationNo
  //               ? selectEstimationNo?.ESTIMATIONNO
  //               : estimationCount + 1
  //           }</span></span>
  //           <span>DATE : ${new Date().toLocaleDateString("en-GB", {
  //             day: "2-digit",
  //             month: "short",
  //             year: "numeric",
  //           })}</span>
  //           <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
  //         </div>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub-image">Image</th><th class="sub">PARTICULARS</th><th>Purity</th>
  //               <th>Pieces</th><th class="sub-right">Gross.Wt</th><th class="sub-right">Less.Wt</th>
  //               <th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${tableRows}
  //             ${totalsRow}
  //           </tbody>
  //         </table>
  //         <div class="container">
  //           ${stonesTable}
  //           ${summaryTable}
  //         </div>
  //       </body>
  //     </html>
  //   `;

  //     const blob = new Blob([htmlContent], { type: "application/pdf" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `Estimation_${selectEstimationNo ? selectEstimationNo.ESTIMATIONNO : estimationCount + 1}.pdf`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   };

//   const handleLandScapDownloadPDF = () => {
//     let totalPCS = 0;
//     let totalGWT = 0;
//     let totalStone = 0;
//     let totalNWT = 0;
//     let totalGold = 0;

//     // Build table rows
//     const tableRows = tableData
//       .map((item, index) => {
//         const actGrams =
//           stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
//           "";
//         const removeUndefinedWrapper = (str) => {
//           let prevStr;
//           do {
//             prevStr = str;
//             str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
//           } while (prevStr !== str);
//           return str;
//         };
//         const cleanedActGrams = removeUndefinedWrapper(actGrams);

//         totalPCS += item.PIECES;
//         totalGWT += item.GWT;
//         totalStone += Number(item.STONEWT);
//         totalNWT += Number(item.NETWT);
//         totalGold += Number(item?.FINALGOLD);
//         const imgPath = item.IMGPATH || photos[index] || "";
//         const base64Img = base64Images[imgPath] || "";

//         return `
//         <tr>
//           <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
//           index + 1
//         }</strong></td>
//           <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
//           item.TAGNO
//         }</strong></td>
//         <td rowspan="${cleanedActGrams ? 2 : 1}">
      
// ${
//   base64Img
//     ? `<img src="${base64Img}" 
//              alt="Item Image" 
//              style="max-width:80px; max-height:80px;"/>`
//     : ""
// }
// </td>
//           <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
//           <td>${item.PREFIX}</td>
//           <td class="sub-right"><strong>${item.PIECES}</strong></td>
//           <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
//           <td class="sub-right">${item.STONEWT}</td>
//           <td class="sub-right">${item.NETWT}</td>
//           <td class="sub-right">${item.TOUCH}%</td>
//           <td class="sub-gold">${item.FINALGOLD}</td>
//         </tr>
//         ${
//           cleanedActGrams
//             ? `<tr class="sub-row"><td colspan="10" class="sub-text">${cleanedActGrams}</td></tr>`
//             : ""
//         }
//       `;
//       })
//       .join("");

//     // Totals row
//     const totalsRow = `
//     <tr class="total">
//       <td colspan="5">Total</td>
//       <td class="sub-right">${totalPCS}</td>
//       <td class="sub-right">${totalGWT.toFixed(3)}</td>
//       <td class="sub-right">${Number(totalStone)?.toFixed(3)}</td>
//       <td class="sub-right">${Number(totalNWT)?.toFixed(3)}</td>
//       <td></td>
//       <td class="sub-right">${Number(totalGold)?.toFixed(3)}</td>
//     </tr>
//   `;

//     // Stones table if applicable
//     const stonesTable =
//       path === "/estimations-model1"
//         ? `
//         <div class="table-container">
//           <table>
//             <thead>
//               <tr>
//                 <th class="sub-stone-name">STONE NAME</th>
//                 <th class="stone-pieces">PIECES</th>
//                 <th class="stone-weight">WEIGHT</th>
//                 <th class="stone-cost">COST</th>
//                 <th class="stone-amount">AMOUNT</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${(() => {
//                 let totalStoneWeight = 0;
//                 let totalAmount = 0;
//                 let totalStonePieces =0;
//                 return (
//                   stonesData
//                     .map((stone, index) => {
//                       const rate = stoneRate[index] || 0;
//                       const amount = stone.ACTGRAMS * Number(rate);
//                       totalAmount += amount;
//                       totalStoneWeight += stone.ACTGRAMS;
//                       totalStonePieces += stone.PCS;
//                       return `
//                       <tr>
//                         <td class="sub-stone-name">${stone.MAINTYPE}</td>
//                         <td class="stone-pieces">${stone.PCS}</td>
//                         <td class="stone-weight">${stone.ACTGRAMS.toFixed(3)}</td>
//                         <td class="stone-cost">${Number(rate)?.toFixed(2)}</td>
//                         <td class="stone-amount">${amount.toFixed(2)}</td>
//                       </tr>
//                     `;
//                     })
//                     .join("") +
//                   `<tr class="total">
//                     <td colspan="1">Total</td>
//                     <td class="stone-pieces">${totalStonePieces}</td>
//                     <td class="stone-weight">${totalStoneWeight.toFixed(3)}</td>
//                     <td class="stone-cost"></td>
//                     <td class="stone-amount">${totalAmount.toFixed(2)}</td>
//                   </tr>`
//                 );
//               })()}
//             </tbody>
//           </table>
//         </div>
//       `
//         : "";

//     // Summary table
//     const summaryTable = `
//     <div class="summary-container">
//       <table>
//         <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
//           3
//         )}</td></tr>
//         ${
//           rateCut === true
//             ? `<tr><td class="stone-name">Fine ${fineGoldValue || 0} @${Number(
//                 rateValue || 0
//               )}/-</td>
//                 <td class="sub-right">${
//                   amountValue ? Number(amountValue).toFixed(2) : 0
//                 }</td></tr>`
//             : ""
//         }
//         <tr><td class="stone-name">Making ${
//           makingValue || 0
//         } /g</td><td class="sub-right">${
//       perGramValue ? Number(perGramValue).toFixed(2) : 0
//     }</td></tr>
//         ${
//           path === "/estimations-model1"
//             ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
//                 rodiumChargeValue || 0
//               }</td></tr>
//                <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
//                  2
//                )}</td></tr>`
//             : `<tr><td class="stone-name">Stone Cost ${
//                 stoneMakingValue || 0
//               } /g</td>
//                <td class="sub-right">${
//                  stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
//                }</td></tr>`
//         }
//         <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
//           3
//         )}</strong></td></tr>
//         <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
//           2
//         )}</strong></td></tr>
//       </table>
//     </div>
//   `;

//     // Build full HTML content
//     const htmlContent = `
//     <html>
//       <head>
//         <style>
//            body {
//             font-family: Arial, sans-serif;
//             margin: 20px;
//             font-size: 12px;
//         }
//         .header {
//             text-align: center;
//             margin-bottom: 18px;
//         }
//         .header h2 {
//             margin: 0;
//             font-size: 16px;
//             font-weight: bold;
//             display: inline-block;
//     text-decoration: underline;
//     text-underline-offset: 4px;
//         }
//         .sub-header {
//             display: flex;
//             justify-content: space-between;
//             font-size: 12px;
//             font-weight: bold;
//             margin-bottom: 10px;
//             padding-bottom: 5px;
//         }
//              .sub-est {
//           font-weight : bold;
//           font-size: 18px;
//           color : red;
//         }
//           .sub-party {
//           font-weight : bold;
//           font-size: 14px;
//           color : #162566;
//         }
//         table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 12px;
//             margin-top: 5px;
//         }
//         th, td {
//             border: 1px solid black;
//             padding: 5px;
//             text-align: center;
//         }
//         th {
//             background-color: #52bd91;
//             font-weight: bold;
//         }
//         .total {
//             font-weight: bold;
//             background-color: #162566;
//             color: white;
//         }
//         .summary {
//             display: flex;
//             justify-content: space-between;
//             margin-top: 15px;
//         }
//         .summary-box {
//             width: 48%;
//             border: 1px solid black;
//             padding: 10px;
//             font-size: 12px;
//         }
//         .summary-box table {
//             width: 100%;
//             border: none;
//         }
//         .summary-box td {
//             border: none;
//             text-align: left;
//             padding: 3px 0;
//         }
//         .footer {
//             margin-top: 15px;
//             font-size: 12px;
//         }
//           .sub {
//             text-align: left;
//             width: 300px;
//         }
//             .sub-pro {
//               text-align: left;
//               width: 500;
//               background-color: #BCF2F6;
//           }
//             .sub-tag {
//             text-align: center;
//             width: 100;
//         }
//              .sub-image {
//             text-align: center;
//         }
//             .sub-img {
//             display: flex;
//             text-align: center;
//             border-radius: 10px;
//             width: 100%;
//             height: 100%;
//             align-items: center;
//         }
//         .sub-right {
//             text-align: right;
//             width: 80;
//         }
//             .sub-gold {
//             text-align: right;
//             width: 130;
//         }
//           .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
//           .sub-row td { border-top: none; text-align: left; }
//           .container { display: flex; justify-content: space-between; margin-top: 10px; }
//           .table-container { width: 40%; }
//           .summary-container { width: 35%; }
//           .stone-name { text-align: left;}
//           .sub-final { background-color: #f26d14ff; font-weight: bold; }
//           .sub-right-bold { text-align: right; font-weight: bold; }
//           .stone-name-bold { text-align: left; font-weight: bold; }
//           .sub-stone-name { text-align: left;  width: 100px}
//           .stone-pieces { text-align: center; font-weight: bold; width: 60px }
//           .stone-weight { text-align: right; width: 60px }
//           .stone-cost { text-align: right; width: 60px }
//           .stone-amount { text-align: right; width: 60px }
//         </style>
//       </head>
//       <body>
//         <div class="header"><h2>ESTIMATION</h2></div>
//         <div class="sub-header">
//           <span>ESTIMATION NO. : <span class="sub-est">${
//             selectEstimationNo
//               ? selectEstimationNo?.ESTIMATIONNO
//               : estimationCount + 1
//           }</span></span>
//           <span>DATE : ${new Date().toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           })}</span>
//           <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
//         </div>
//         <table>
//           <thead>
//             <tr>
//               <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub-image">Image</th><th class="sub">PARTICULARS</th><th>Purity</th>
//               <th>Pieces</th><th class="sub-right">Gross.Wt</th><th class="sub-right">Less.Wt</th>
//               <th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${tableRows}
//             ${totalsRow}
//           </tbody>
//         </table>
//         <div class="container">
//           ${stonesTable}
//           ${summaryTable}
//         </div>
//       </body>
//     </html>
//   `;

//     // Create container for html2pdf
//     const container = document.createElement("div");
//     container.innerHTML = htmlContent;
//     document.body.appendChild(container);

//     html2pdf()
//       .set({
//         margin: [10, 5, 10, 5],
//         filename: `Estimation_${
//           selectEstimationNo
//             ? selectEstimationNo?.ESTIMATIONNO
//             : estimationCount + 1
//         }.pdf`,
//         image: { type: "jpeg", quality: 0.98 },
//         // html2canvas: { scale: 2, useCORS: false },
//         jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
//       })
//       .from(container)
//       .save()
//       .then(() => {
//         document.body.removeChild(container);
//       });
//   };

  //   const handleLandScapDownloadPDF = () => {
  //     const printWindow = window.open("", "", "height=700,width=900");

  //     printWindow.document.write(
  //       `<html><head><title>Estimation_${
  //         selectEstimationNo
  //           ? selectEstimationNo?.ESTIMATIONNO
  //           : estimationCount + 1
  //       }</title><style>`
  //     );

  //     // Force landscape orientation
  //     printWindow.document.write(`
  //     @media print {
  //           @page {
  //             size: A4 landscape !important;
  //             margin: 1mm;
  //           }
  //           body {
  //             -webkit-print-color-adjust: exact !important;
  //             print-color-adjust: exact !important;
  //             color-adjust: exact !important;
  //           }
  //         }

  //         /* Force color printing for all elements */
  //         * {
  //           -webkit-print-color-adjust: exact !important;
  //           print-color-adjust: exact !important;
  //           color-adjust: exact !important;
  //         }
  //     body {
  //         font-family: Arial, sans-serif;
  //         margin: 0px;
  //         font-size: 12px;
  //     }
  //     .header {
  //         text-align: center;
  //         margin-bottom: 18px;
  //     }
  //     .header h2 {
  //         margin: 0;
  //         font-size: 16px;
  //         font-weight: bold;
  //         display: inline-block;
  //         text-decoration: underline;
  //         text-underline-offset: 4px;
  //     }
  //     .sub-header {
  //         display: flex;
  //         justify-content: space-between;
  //         font-size: 12px;
  //         font-weight: bold;
  //         margin-bottom: 10px;
  //         padding-bottom: 5px;
  //     }
  //         .sub-est {
  //           font-weight : bold;
  //           font-size: 18px;
  //           color : red;
  //         }
  //           .sub-party {
  //           font-weight : bold;
  //           font-size: 14px;
  //           color : #162566;
  //         }
  //     table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         font-size: 12px;
  //         margin-top: 5px;
  //     }
  //     th, td {
  //         border: 1px solid black;
  //         padding: 5px;
  //         text-align: center;
  //     }
  //     th {
  //         background-color: #52bd91;
  //         font-weight: bold;
  //     }
  //     .total {
  //         font-weight: bold;
  //         background-color: #162566;
  //         color: white;
  //     }
  //     .summary {
  //         display: flex;
  //         justify-content: space-between;
  //         margin-top: 15px;
  //     }
  //     .summary-box {
  //         width: 48%;
  //         border: 1px solid black;
  //         padding: 10px;
  //         font-size: 12px;
  //     }
  //     .summary-box table {
  //         width: 100%;
  //         border: none;
  //     }
  //     .summary-box td {
  //         border: none;
  //         text-align: left;
  //         padding: 3px 0;
  //     }
  //     .footer {
  //         margin-top: 15px;
  //         font-size: 12px;
  //     }
  //   `);

  //     printWindow.document.write("</style></head><body>");

  //     // Header Section
  //     printWindow.document.write(`
  //     <div class="header">
  //         <h2>ESTIMATION</h2>
  //     </div>
  //     <div class="sub-header">
  //         <span>ESTIMATION NO. : <span class="sub-est">${
  //           selectEstimationNo
  //             ? selectEstimationNo?.ESTIMATIONNO
  //             : estimationCount + 1
  //         }</span></span>
  //         <span>DATE : ${new Date().toLocaleDateString("en-GB", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "numeric",
  //         })}</span>
  //         <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
  //     </div>
  //   `);

  //     // Main Table
  //     printWindow.document.write(`
  //     <style>
  //         table {
  //             width: 100%;
  //             border-collapse: collapse;
  //             border: 2px solid black;
  //             font-family: Arial, sans-serif;
  //             font-size: 12px;
  //         }
  //         th, td {
  //             border: 1px solid black;
  //             padding: 5px;
  //             text-align: center;
  //             vertical-align: middle;
  //         }
  //         th {
  //             font-weight: bold;
  //             background-color: #52bd91;
  //         }
  //         td strong {
  //             font-size: 12px;
  //         }
  //         td span {
  //             font-size: 10px;
  //         }
  //         .total td {
  //             font-weight: bold;
  //             background-color: #162566;
  //             color: white;
  //         }
  //         td div.sub-text {
  //             text-align: left;
  //             font-size: 10px;
  //             font-weight: bold;
  //         }
  //         td div.sub-value {
  //             text-align: left;
  //             font-size: 10px;
  //         }
  //         tr.sub-row td {
  //             border-top: none;
  //             text-align: left;
  //         }
  //         .sub {
  //             text-align: left;
  //             width: 500;
  //         }
  //             .sub-pro {
  //               text-align: left;
  //               width: 500;
  //               background-color: #BCF2F6;
  //           }
  //             .sub-tag {
  //             text-align: center;
  //             width: 100;
  //         }
  //             .sub-image {
  //             text-align: center;
  //         }
  //             .sub-img {
  //             display: flex;
  //             text-align: center;
  //             border-radius: 10px;
  //             width: 100%;
  //             height: 100%;
  //             align-items: center;
  //         }
  //         .sub-right {
  //             text-align: right;
  //             width: 80;
  //         }
  //             .sub-gold {
  //             text-align: right;
  //             width: 130;
  //         }
  //     </style>
  //     <table>
  //         <thead>
  //             <tr>
  //                 <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub-image">Image</th><th class="sub">PARTICULARS</th><th>Purity</th><th>Pieces</th><th class="sub-right">Gross.Wt</th>
  //                 <th class="sub-right">Less.Wt</th><th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
  //             </tr>
  //         </thead>
  //         <tbody>
  //   `);

  //     let totalPCS = 0;
  //     let totalGWT = 0;
  //     let totalStone = 0;
  //     let totalNWT = 0;
  //     let totalGold = 0;

  //     tableData.forEach((item, index) => {
  //       const actGrams =
  //         stoneMainData.find((stone) => stone.TAGNO === item.TAGNO)?.ACTGRAMS ||
  //         "";
  //       const removeUndefinedWrapper = (str) => {
  //         let prevStr;
  //         do {
  //           prevStr = str;
  //           str = str.replace(/undefined\(\s*(.*?)\s*\)/g, "$1").trim();
  //         } while (prevStr !== str);
  //         return str;
  //       };
  //       const cleanedActGrams = removeUndefinedWrapper(actGrams);

  //       printWindow.document.write(`
  //         <tr>
  //             <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //         index + 1
  //       }</strong></td>
  //             <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${
  //         item.TAGNO
  //       }</strong></td>
  //       <td rowspan="${cleanedActGrams ? 2 : 1}">

  // ${
  //   item.IMGPATH || photos[index]
  //     ? `<img src="${item.IMGPATH ? item.IMGPATH : photos[index]}"
  //              alt="Item Image"
  //              style="max-width:80px; max-height:80px; object-fit:contain;" />`
  //     : ""
  // }
  // </td>
  //             <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
  //             <td>${item.PREFIX}</td>
  //             <td class="sub-right"><strong>${item.PIECES}</strong></td>
  //             <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
  //             <td class="sub-right">${item.STONEWT}</td>
  //             <td class="sub-right">${item.NETWT}</td>
  //             <td class="sub-right">${item.TOUCH}%</td>
  //             <td class="sub-gold">${item.FINALGOLD}</td>
  //         </tr>
  //     `);

  //       if (cleanedActGrams) {
  //         printWindow.document.write(`
  //         <tr class="sub-row">
  //             <td colspan="10" class="sub-text">${cleanedActGrams}</td>
  //         </tr>
  //       `);
  //       }

  //       totalPCS += item.PIECES;
  //       totalGWT += item.GWT;
  //       totalStone += Number(item.STONEWT);
  //       totalNWT += Number(item.NETWT);
  //       totalGold += Number(item?.FINALGOLD);
  //     });

  //     printWindow.document.write(`
  //         <tr class="total">
  //             <td colspan="5" class="sub-total">Total</td>
  //             <td>${totalPCS}</td>
  //             <td>${totalGWT.toFixed(3)}</td>
  //             <td>${Number(totalStone)?.toFixed(3)}</td>
  //             <td>${Number(totalNWT)?.toFixed(3)}</td>
  //             <td></td>
  //             <td>${Number(totalGold)?.toFixed(3)}</td>
  //         </tr>
  //     </tbody>
  //   </table>
  //   `);

  //     if (path === "/estimations-model1") {
  //       generateEstimationPrint({
  //         showStonesTable: true,
  //         includeRodiumCharges: true,
  //         rateCutChange: true,
  //       });
  //     } else if (path === "/estimations-model2") {
  //       generateEstimationPrint({
  //         showStonesTable: false,
  //         includeRodiumCharges: false,
  //         rateCutChange: true,
  //       });
  //     }

  //     function generateEstimationPrint({
  //       showStonesTable,
  //       includeRodiumCharges,
  //     }) {
  //       printWindow.document.write(`
  //       <style>
  //         .container {
  //           display: flex;
  //           justify-content: space-between;
  //           align-items: flex-start;
  //           width: 100%;
  //           margin-top: 10px;
  //         }
  //         .table-container {
  //           width: 55%;
  //         }
  //         .summary-container {
  //           width: 35%;
  //           margin-left: ${showStonesTable ? "0" : "auto"};
  //         }
  //         table {
  //           width: 100%;
  //           border-collapse: collapse;
  //           border: 2px solid black;
  //         }
  //         th, td {
  //           border: 1px solid black;
  //           padding: 5px;
  //           text-align: center;
  //           vertical-align: middle;
  //         }
  //         th {
  //           font-weight: bold;
  //           background-color: #52bd91;
  //         }
  //         .total td {
  //           font-weight: bold;
  //           background-color: #162566;
  //           text-align: right;
  //           color: white;
  //         }
  //         .stone-name {
  //           text-align: left;
  //         }
  //         .sub-right {
  //           text-align: right;
  //         }
  //         .sub-final {
  //           background-color: #f26d14ff;
  //           font-weight: bold;
  //         }
  //         .sub-right-bold {
  //           text-align: right;
  //           font-weight: bold;
  //         }
  //         .stone-name-bold {
  //           text-align: left;
  //           font-weight: bold;
  //         }
  //       </style>

  //       <div class="container">
  //     `);

  //       if (showStonesTable) {
  //         let totalStoneWeight = 0;
  //         let totalAmount = 0;

  //         printWindow.document.write(`
  //         <div class="table-container">
  //           <table>
  //             <thead>
  //               <tr>
  //                 <th class="stone-name">STONE NAME</th>
  //                 <th>PIECES</th>
  //                 <th class="sub-right">WEIGHT</th>
  //                 <th class="sub-right">COST</th>
  //                 <th class="sub-right">AMOUNT</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //       `);

  //         stonesData.forEach((stone, index) => {
  //           const rate = stoneRate[index] || 0;
  //           const amount = stone.ACTGRAMS * Number(rate);
  //           totalAmount += amount;
  //           totalStoneWeight += stone.ACTGRAMS;

  //           printWindow.document.write(`
  //           <tr>
  //             <td class="stone-name">${stone.MAINTYPE}</td>
  //             <td>${stone.PCS}</td>
  //             <td class="sub-right">${stone.ACTGRAMS.toFixed(3)}</td>
  //             <td class="sub-right">${Number(rate)?.toFixed(2)}</td>
  //             <td class="sub-right">${amount.toFixed(2)}</td>
  //           </tr>
  //         `);
  //         });

  //         printWindow.document.write(`
  //               <tr class="total">
  //                 <td colspan="2"></td>
  //                 <td>${totalStoneWeight.toFixed(3)}</td>
  //                 <td></td>
  //                 <td>${totalAmount.toFixed(2)}</td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>
  //       `);
  //       }

  //       printWindow.document.write(`
  //       <div class="summary-container">
  //         <table>
  //           <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
  //             3
  //           )}</td></tr>
  //           ${
  //             rateCut === true
  //               ? `<tr>
  //                   <td class="stone-name">
  //                     Fine ${fineGoldValue || 0} @${Number(rateValue || 0)}/-
  //                   </td>
  //                   <td class="sub-right">
  //                     ${amountValue ? Number(amountValue).toFixed(2) : 0}
  //                   </td>
  //                 </tr>`
  //               : ""
  //           }
  //           <tr><td class="stone-name">Making ${
  //             makingValue || 0
  //           } /g</td><td class="sub-right">${
  //         perGramValue ? Number(perGramValue).toFixed(2) : 0
  //       }</td></tr>
  //           ${
  //             includeRodiumCharges
  //               ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
  //                   rodiumChargeValue || 0
  //                 }</td></tr>
  //                  <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
  //                    2
  //                  )}</td></tr>`
  //               : `<tr><td class="stone-name">Stone Cost ${
  //                   stoneMakingValue || 0
  //                 } /g</td>
  //                  <td class="sub-right">${
  //                    stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
  //                  }</td></tr>`
  //           }
  //           <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
  //             3
  //           )}</strong></td></tr>
  //           <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balnace</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
  //             2
  //           )}</strong></td></tr>
  //         </table>
  //       </div>
  //     </div>
  //     `);
  //     }

  //     printWindow.document.close();
  // printWindow.onload = () => {
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.onafterprint = () => printWindow.close();
  // };
  //   };


  const handleLandScapDownloadPDF = () => {
  let totalPCS = 0;
  let totalGWT = 0;
  let totalStone = 0;
  let totalNWT = 0;
  let totalGold = 0;

  // Build table rows
  const tableRows = tableData
    .map((item, index) => {
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

      totalPCS += item.PIECES;
      totalGWT += item.GWT;
      totalStone += Number(item.STONEWT);
      totalNWT += Number(item.NETWT);
      totalGold += Number(item?.FINALGOLD);
      const imgPath = item.IMGPATH || photos[index] || "";
      const base64Img = base64Images[imgPath] || "";

      return `
        <tr>
          <td rowspan="${cleanedActGrams ? 2 : 1}"><strong>${index + 1}</strong></td>
          <td class="sub-tag" rowspan="${cleanedActGrams ? 2 : 1}"><strong>${item.TAGNO}</strong></td>
          <td rowspan="${cleanedActGrams ? 2 : 1}">
            ${
              base64Img
                ? `<img src="${base64Img}" 
                         alt="Item Image" 
                         style="max-width:80px; max-height:80px;"/>`
                : ""
            }
          </td>
          <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
          <td>${item.PREFIX}</td>
          <td class="sub-right"><strong>${item.PIECES}</strong></td>
          <td class="sub-right"><strong>${item.GWT?.toFixed(3)}</strong></td>
          <td class="sub-right">${item.STONEWT}</td>
          <td class="sub-right">${item.NETWT}</td>
          <td class="sub-right">${item.TOUCH}%</td>
          <td class="sub-gold">${item.FINALGOLD}</td>
        </tr>
        ${
          cleanedActGrams
            ? `<tr class="sub-row"><td colspan="10" class="sub-text">${cleanedActGrams}</td></tr>`
            : ""
        }
      `;
    })
    .join("");

  // Totals row
  const totalsRow = `
    <tr class="total">
      <td colspan="5">Total</td>
      <td class="sub-right">${totalPCS}</td>
      <td class="sub-right">${totalGWT.toFixed(3)}</td>
      <td class="sub-right">${Number(totalStone)?.toFixed(3)}</td>
      <td class="sub-right">${Number(totalNWT)?.toFixed(3)}</td>
      <td></td>
      <td class="sub-right">${Number(totalGold)?.toFixed(3)}</td>
    </tr>
  `;

  // Stones table if applicable
  const stonesTable =
    path === "/estimations-model1"
      ? `
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="sub-stone-name">STONE NAME</th>
                <th class="stone-pieces">PIECES</th>
                <th class="stone-weight">WEIGHT</th>
                <th class="stone-cost">COST</th>
                <th class="stone-amount">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${(() => {
                let totalStoneWeight = 0;
                let totalAmount = 0;
                let totalStonePieces = 0;
                return (
                  stonesData
                    .map((stone, index) => {
                      const rate = stoneRate[index] || 0;
                      const amount = stone.ACTGRAMS * Number(rate);
                      totalAmount += amount;
                      totalStoneWeight += stone.ACTGRAMS;
                      totalStonePieces += stone.PCS;
                      return `
                      <tr>
                        <td class="sub-stone-name">${stone.MAINTYPE}</td>
                        <td class="stone-pieces">${stone.PCS}</td>
                        <td class="stone-weight">${stone.ACTGRAMS.toFixed(3)}</td>
                        <td class="stone-cost">${Number(rate)?.toFixed(2)}</td>
                        <td class="stone-amount">${amount.toFixed(2)}</td>
                      </tr>
                    `;
                    })
                    .join("") +
                  `<tr class="total">
                    <td colspan="1">Total</td>
                    <td class="stone-pieces">${totalStonePieces}</td>
                    <td class="stone-weight">${totalStoneWeight.toFixed(3)}</td>
                    <td class="stone-cost"></td>
                    <td class="stone-amount">${totalAmount.toFixed(2)}</td>
                  </tr>`
                );
              })()}
            </tbody>
          </table>
        </div>
      `
      : "";

  // Summary table
  const summaryTable = `
    <div class="summary-container">
      <table>
        <tr class="sub-final"><td class="stone-name-bold">Fine Gold</td><td class="sub-right-bold">${totalFineGold.toFixed(
          3
        )}</td></tr>
        ${
          rateCut === true
            ? `<tr><td class="stone-name">Fine ${fineGoldValue || 0} @${Number(
                rateValue || 0
              )}/-</td>
                <td class="sub-right">${
                  amountValue ? Number(amountValue).toFixed(2) : 0
                }</td></tr>`
            : ""
        }
        <tr><td class="stone-name">Making ${
          makingValue || 0
        } /g</td><td class="sub-right">${
    perGramValue ? Number(perGramValue).toFixed(2) : 0
  }</td></tr>
        ${
          path === "/estimations-model1"
            ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                rodiumChargeValue || 0
              }</td></tr>
               <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                 2
               )}</td></tr>`
            : `<tr><td class="stone-name">Stone Cost ${
                stoneMakingValue || 0
              } /g</td>
               <td class="sub-right">${
                 stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
               }</td></tr>`
        }
        <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
          3
        )}</strong></td></tr>
        <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
          2
        )}</strong></td></tr>
      </table>
    </div>
  `;

  // Build full HTML content
  const htmlContent = `
    <html>
      <head>
        <style>
           body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 18px;
        }
        .header h2 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            display: inline-block;
            text-decoration: underline;
            text-underline-offset: 4px;
        }
        .sub-header {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
        }
        .sub-est {
          font-weight : bold;
          font-size: 18px;
          color : red;
        }
        .sub-party {
          font-weight : bold;
          font-size: 14px;
          color : #162566;
        }
        table {
            border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
  font-size: 12px;
        }
        th, td {
            border: 1px solid #000;
  padding: 6px;
  text-align: center;
  vertical-align: middle;
        }
  thead {
  display: table-header-group; /* repeat headers */
  background: #e6f8f9; 
  font-weight: bold;
}
  tfoot {
  display: table-footer-group;
}
  tr {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  -webkit-region-break-inside: avoid;
}
  td img {
  max-width: 70px;
  max-height: 70px;
  object-fit: contain;
  display: block;
  margin: auto;
  page-break-inside: avoid !important;
}
  .table-container {
  page-break-inside: avoid;
  margin-bottom: 10px;
}
        th {
            background-color: #52bd91;
            font-weight: bold;
        }
        .total {
            font-weight: bold;
            background-color: #162566;
            color: white;
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
        .sub {
            text-align: left;
            width: 300px;
        }
        .sub-pro {
            text-align: left;
            width: 500;
            background-color: #BCF2F6;
        }
        .sub-tag {
            text-align: center;
            width: 100;
        }
        .sub-image {
            text-align: center;
        }
        .sub-img {
            display: flex;
            text-align: center;
            border-radius: 10px;
            width: 100%;
            height: 100%;
            align-items: center;
        }
        .sub-right {
            text-align: right;
            width: 80;
        }
        .sub-gold {
            text-align: right;
            width: 130;
        }
        .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
        .sub-row td { border-top: none; text-align: left; }
        .container { display: flex; justify-content: space-between; margin-top: 10px; }
        .table-container { width: 40%; }
        .summary-container { width: 35%; }
        .stone-name { text-align: left;}
        .sub-final { background-color: #f26d14ff; font-weight: bold; }
        .sub-right-bold { text-align: right; font-weight: bold; }
        .stone-name-bold { text-align: left; font-weight: bold; }
        .sub-stone-name { text-align: left;  width: 100px}
        .stone-pieces { text-align: center; font-weight: bold; width: 60px }
        .stone-weight { text-align: right; width: 60px }
        .stone-cost { text-align: right; width: 60px }
        .stone-amount { text-align: right; width: 60px }

        /* ✅ Page break fixes */
        thead { display: table-header-group; }
        tfoot { display: table-footer-group; }
        tr { page-break-inside: avoid; break-inside: avoid; }
        img { page-break-inside: avoid; break-inside: avoid; }
        .table-container, .summary-container { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <div class="header"><h2>ESTIMATION</h2></div>
        <div class="sub-header">
          <span>ESTIMATION NO. : <span class="sub-est">${
            selectEstimationNo
              ? selectEstimationNo?.ESTIMATIONNO
              : estimationCount + 1
          }</span></span>
          <span>DATE : ${new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}</span>
          <span>PARTY NAME : <span class="sub-party">${selectedParty}</span></span>
        </div>
        <table>
          <thead>
            <tr>
              <th>SNo</th><th class="sub-tag">TAG NO</th><th class="sub-image">Image</th><th class="sub">PARTICULARS</th><th>Purity</th>
              <th>Pieces</th><th class="sub-right">Gross.Wt</th><th class="sub-right">Less.Wt</th>
              <th class="sub-right">Net.Wt</th><th class="sub-right">Touch</th><th class="sub-gold">Fine Gold</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            ${totalsRow}
          </tbody>
        </table>
        <div class="container">
          ${stonesTable}
          ${summaryTable}
        </div>
      </body>
    </html>
  `;

  // Create container for html2pdf
  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  html2pdf()
    .set({
      margin: [10, 5, 10, 5],
      filename: `Estimation_${
        selectEstimationNo
          ? selectEstimationNo?.ESTIMATIONNO
          : estimationCount + 1
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    })
    .from(container)
    .save()
    .then(() => {
      document.body.removeChild(container);
    });
};

  const handlePrintClick = ({ key }) => {
    if (key === "1") {
      handleLandScapePrint();
    } else if (key === "2") {
      handlePrint();
    }
  };

  const printMenu = {
    items: [
      {
        key: "1",
        icon: <PrinterOutlined />,
        label: "Print With Image",
      },
      {
        key: "2",
        icon: <PrinterOutlined />,
        label: "Print With Out Image",
      },
    ],
    onClick: handlePrintClick,
  };

  const handlePdfClick = ({ key }) => {
    if (key === "1") {
      handleLandScapDownloadPDF();
      // if (tableData.length > 0) {
      //   if (selectEstimationNo?.ESTIMATIONNO) {
      //     estimationDeleteItems();
      //     estimationDeleteData();
      //     estimationDeleteMast();
      //   }
      //   if (tableData.length > 0) {
      //     createEstimationMast();
      //     createEstimationItems();
      //     createEstimationData();
      //     setSelectEstimationNo(null);
      //   }
      // }
    } else if (key === "2") {
      handleDownloadPDF();
      // if (tableData.length > 0) {
      //   if (selectEstimationNo?.ESTIMATIONNO) {
      //     estimationDeleteItems();
      //     estimationDeleteData();
      //     estimationDeleteMast();
      //   }
      //   if (tableData.length > 0) {
      //     createEstimationMast();
      //     createEstimationItems();
      //     createEstimationData();
      //     setSelectEstimationNo(null);
          
      //   }
      // }
    }
  };

  const pdfMenu = {
    items: [
      {
        key: "1",
        icon: <FilePdfOutlined />,
        label: "PDF With Image",
      },
      {
        key: "2",
        icon: <FilePdfOutlined />,
        label: "PDF With Out Image",
      },
    ],
    onClick: handlePdfClick,
  };

  return (
    <div>
      <Header setOpen={setOpen} />
      {/* {cameraOpenIndex ? (
          !photos[cameraOpenIndex] ? (
                    <>
                      <Camera
                        onTakePhoto={(dataUri) =>
                          handleTakePhoto(dataUri, cameraOpenIndex)
                        }
                        idealFacingMode="environment"
                        isImageMirror={false}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          marginTop: "5px",
                        }}
                      >
                        <Button
                          onClick={handleCameraCancel}
                          style={{
                            background: "#EAA64D",
                          }}
                        >
                          <ArrowBackIcon />
                          Back
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={photos[cameraOpenIndex]}
                        alt="Captured"
                        style={{
                          width: "100%",
                          maxWidth: 400,
                          borderRadius: 8,
                        }}
                      />
                      <br />
                      <div
                        style={{
                          display: "flex",
                          alignContent: "center",
                          justifyContent: "center",
                          marginTop: "5px",
                          gap: "5px",
                        }}
                      >
                        <Button
                          style={{
                            background: "#91C8E4",
                          }}
                          onClick={() =>
                            setPhotos((prev) => ({ ...prev, [cameraOpenIndex]: null }))
                          }
                        >
                          Retake
                        </Button>
                        <Button
                          style={{
                            background: "#EAA64D",
                          }}
                          onClick={handleCameraCancel}
                        >
                          <ArrowBackIcon />
                          Back
                        </Button>
                      </div>
                    </>
                  )
                ) : (
        <>  */}
      <div className={styles.cardContainer}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "5px",
              background: "#51bd90",
              color: "white",
            }}
          >
            {pathModel2
              ? "Estimation With Out Stones"
              : "Estimation With Stones"}
          </Typography>
        </div>
        <div className={styles.estimationContainer}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span style={{ fontSize: "13px" }}>
                Estimation:{" "}
                <strong style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {selectEstimationNo
                    ? selectEstimationNo?.ESTIMATIONNO
                    : estimationCount + 1}
                </strong>
              </span>

              <div
                className={styles.dateContainer}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                }}
              >
                <span>Date:</span>
                <DatePicker
                  style={{ width: "130px" }}
                  inputReadOnly
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={(date) => setSelectedDate(date)}
                  format="DD-MMM-YYYY"
                />
              </div>
            </div>

            <FilterOutlined
              style={{
                color: "green",
                fontSize: "25px",
                cursor: "pointer",
              }}
              onClick={() => setFilterOpen(true)}
            />
          </div>
          {selectedParty ? (
            <div className={styles.partyNameContainer}>
              <span>
                Party Name:{" "}
                <strong
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {selectedParty}
                </strong>
              </span>
            </div>
          ) : (
            ""
          )}
          <div className={styles.detailsContainer}>
            {touchValue ? (
              <span>
                Touch:{" "}
                <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {touchValue}
                </span>
              </span>
            ) : (
              ""
            )}
            {wastageValue ? (
              <>
                |{" "}
                <span>
                  Wastage:{" "}
                  <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {wastageValue}
                  </span>
                </span>
              </>
            ) : (
              ""
            )}
            {tableData.length > 0 ? (
              <Button
                type="primary"
                htmlType="submit"
                className={styles.filesButton}
                onClick={() => {
                  setDrawerOpen(true);
                }}
              >
                Total
              </Button>
            ) : (
              ""
            )}
            {stonesData.length > 0 ? (
              <Button
                type="primary"
                htmlType="submit"
                className={styles.stoneButton}
                onClick={() => {
                  setStonesDrawerOpen(true);
                }}
              >
                Stone
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.estimationTagContainer}>
          <div className={styles.tagNoSection}>
            <span className={styles.tagLabel}>Tag No:</span>
            <Input
              // placeholder="Enter Tag No"
              ref={tagNoRef}
              className={styles.tagInput}
              onKeyDown={handleTagNoKeyDown}
              disabled={selectedParty ? false : true}
              value={tagNoValue}
              onChange={(e) => {
                const value = e.target.value.replace(/[a-zA-Z]/g, "");
                if (value.length <= 8) {
                  setTagNoValue(value);
                }
              }}
            />
          </div>

          <div className={styles.buttonSection}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.submitButton}
              ref={submitRef}
              onClick={() => {
                if (!tagNoValue) {
                  message.warning("Enter Tag No");
                } else if (path === "/estimations-model2") {
                  mainAPI();
                  setTagNoValue("");
                } else {
                  stonesAPI();
                  mainAPI();
                  setTagNoValue("");
                }
              }}
            >
              Submit
            </Button>

            <Button
              type="primary"
              danger
              className={styles.resetButton}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              type="dashed"
              danger
              className={styles.filesButton}
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Files
            </Button>
            {selectedParty && touchValue && wastageValue && (
              <div
                onClick={handleToggleScan}
                style={{ width: "20px", height: "20px" }}
              >
                <ScanOutlined
                  style={{
                    fontSize: "25px",
                    color: scanOpen === true ? "#162566" : "#eb14bcff",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cardContainer}>
        {tableData?.map((item, index) => (
          <>
            {cameraOpenIndex === index ? (
              !photos[index] ? (
                <>
                  <Camera
                    onTakePhoto={(dataUri) => handleTakePhoto(dataUri, index)}
                    idealFacingMode="environment"
                    isImageMirror={false}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <Button
                      onClick={handleCameraCancel}
                      style={{
                        background: "#EAA64D",
                      }}
                    >
                      <ArrowBackIcon />
                      Back
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={photos[index]}
                    alt="Captured"
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      borderRadius: 8,
                    }}
                  />
                  <br />
                  <div
                    style={{
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                      marginTop: "5px",
                      gap: "5px",
                    }}
                  >
                    <Button
                      style={{
                        background: "#91C8E4",
                      }}
                      onClick={() =>
                        setPhotos((prev) => ({ ...prev, [index]: null }))
                      }
                    >
                      Retake
                    </Button>
                    <Button
                      style={{
                        background: "#EAA64D",
                      }}
                      onClick={handleCameraCancel}
                    >
                      <ArrowBackIcon />
                      Back
                    </Button>
                  </div>
                </>
              )
            ) : (
              <>
                {/* Tag No */}
                <div key={index} className={styles.infoBox}>
                  <div className={styles.rowTag}>
                    <p>
                      <span
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          borderRadius: "50%",
                          padding: "5px",
                          background: "red",
                          color: "white",
                        }}
                      >
                        #{index + 1}
                      </span>
                    </p>
                    <p>
                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {item.TAGNO}
                      </span>
                    </p>
                    {item?.IMGPATH || photos[index] ? (
                      <div>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            backgroundColor: "black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "2px solid #52bd91",
                          }}
                          onClick={() => {
                            handleImageOk(photos[index] || base64Images[item?.IMGPATH] || item?.IMGPATH);
                          }}
                        >
                          <img
                            src={photos[index] || base64Images[item?.IMGPATH] || item?.IMGPATH}
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                            }}
                          />
                        </Box>
                      </div>
                    ) : (
                      ""
                    )}
                    <PhotoCameraIcon
                      style={{ color: "#000000" }}
                      onClick={() =>
                        handleCameraOk(index, item.TAGNO, item?.IMGPATH)
                      }
                    />
                    <DeleteOutlined
                      style={{
                        color: "red",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                      onClick={() => handleDelete(index)}
                    />
                  </div>
                  <hr className={styles.fullWidthLine} />

                  {/* Item and Purity */}
                  <div className={styles.row}>
                    <p style={{ fontSize: "12px" }}>
                      Item:{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {item.PRODNAME}
                      </span>
                    </p>
                    {item.IMGPATH || photos[index] ? (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (photos[index]) {
                            imageUploadAPI(index, item.TAGNO);
                          } else {
                            createImagePathAPI(item?.IMGPATH, item.TAGNO);
                          }
                        }}
                      >
                        <UpgradeIcon
                          style={{ color: "#007d32", fontSize: "30px" }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <p style={{ fontSize: "12px" }}>
                      Purity:{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {item.PREFIX}
                      </span>
                    </p>
                  </div>
                  <hr className={styles.fullWidthLine} />

                  {/* Gross Wt, Less Wt, Net Wt */}
                  <div className={styles.row}>
                    <p style={{ fontSize: "12px" }}>
                      Gross Wt:{" "}
                      <span
                        style={{
                          color: "red",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {Number(item.GROSSWEIGHT)?.toFixed(3)}
                      </span>
                    </p>
                    <p style={{ fontSize: "12px" }}>
                      Less Wt:{" "}
                      <span
                        style={{
                          color: "red",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {Number(item.STONEWT)?.toFixed(3)}
                      </span>
                    </p>
                    <p style={{ fontSize: "12px" }}>
                      Net Wt:{" "}
                      <span
                        style={{
                          color: "red",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {Number(item.NETWT)?.toFixed(3)}
                      </span>
                    </p>
                  </div>
                  <hr className={styles.fullWidthLine} />

                  {/* Touch and Fine Gold */}
                  <div className={styles.row}>
                    <p style={{ fontSize: "12px" }}>
                      Touch:{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {item.TOUCH}
                      </span>
                    </p>
                    <p style={{ fontSize: "12px" }}>
                      Fine Gold:{" "}
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {Number(item.FINALGOLD)?.toFixed(3)}
                      </span>
                    </p>
                  </div>
                  {path === "/estimations-model1" ? (
                    <>
                      <hr className={styles.fullWidthLine} />
                      <div className={styles.fullWidthStone}>
                        <p
                          style={{
                            fontSize: "14px",
                            padding: "0px 8px 0px 8px",
                            fontWeight: "bold",
                          }}
                        >
                          {(() => {
                            const actGrams =
                              stoneMainData.find(
                                (stone) => stone.TAGNO === item.TAGNO
                              )?.ACTGRAMS || "";

                            const removeUndefinedWrapper = (str) => {
                              let prevStr;
                              do {
                                prevStr = str;
                                str = str
                                  .replace(/undefined\(\s*(.*?)\s*\)/g, "$1")
                                  .trim();
                              } while (prevStr !== str);
                              return str;
                            };

                            return removeUndefinedWrapper(actGrams);
                          })()}
                        </p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </>
            )}
          </>
        ))}
      </div>
      <>
        {scanOpen === true && (
          <>
            {!qrOpen && (
              <div
                className={styles.scanIconContainer}
                onClick={handleOpenScanner}
              >
                <QrCodeScannerIcon style={{ fontSize: 30, color: "white" }} />
              </div>
            )}
          </>
        )}

        {qrOpen && (
          <div className={styles.qrScannerOverlay}>
            <div className={styles.qrScannerContent}>
              <div className={styles.closeIcon} onClick={stopScanner}>
                <CloseIcon style={{ fontSize: 30, color: "#fff" }} />
              </div>
              <div
                id="qr-reader"
                style={{ width: "300px", height: "300px" }}
              ></div>
            </div>
          </div>
        )}
      </>
      <ImageDialog
        handleImageCancel={handleImageCancel}
        imageOpen={imageOpen}
        imageData={photo}
      />
      <EstimationFields
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        partyRef={partyRef}
        selectedParty={selectedParty}
        setSelectedParty={setSelectedParty}
        handlePartyChange={handlePartyChange}
        touchRef={touchRef}
        handleKeyDown={handleKeyDown}
        touchValue={touchValue}
        setTouchValue={setTouchValue}
        wastRef={wastRef}
        wastageValue={wastageValue}
        setWastageValue={setWastageValue}
        partyNames={partyNames}
        tableData={tableData}
        setTableData={setTableData}
        setTotalFineGold={setTotalFineGold}
      />
      <EstimationDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        stonesData={stonesData}
        totalPieces={totalPieces}
        totalGrossWeight={totalGrossWeight}
        totalStoneWeight={totalStoneWeight}
        totalNetWeight={totalNetWeight}
        totalFineGold={totalFineGold}
        totalStoneCost={totalStoneCost}
        totalCash={totalCash}
        selectEstimationNo={selectEstimationNo}
        makingValue={makingValue}
        setMakingValue={setMakingValue}
        perGramValue={perGramValue}
        setPerGramValue={setPerGramValue}
        rodiumChargeValue={rodiumChargeValue}
        setRodiumChargeValue={setRodiumChargeValue}
        handlePrint={handlePrint}
        handleDownloadPDF={handleDownloadPDF}
        tableData={tableData}
        createEstimationMast={createEstimationMast}
        createEstimationData={createEstimationData}
        createEstimationItems={createEstimationItems}
        estimationDeleteData={estimationDeleteData}
        estimationDeleteItems={estimationDeleteItems}
        estimationDeleteMast={estimationDeleteMast}
        handleReset={handleReset}
        setSelectEstimationNo={setSelectEstimationNo}
        setStoneMakingValue={setStoneMakingValue}
        stoneMakingValue={stoneMakingValue}
        setStonePerGramValue={setStonePerGramValue}
        stonePerGramValue={stonePerGramValue}
        rateCut={rateCut}
        setRateCut={setRateCut}
        fineGoldValue={fineGoldValue}
        setFineGoldValue={setFineGoldValue}
        rateValue={rateValue}
        setRateValue={setRateValue}
        amountValue={amountValue}
        setAmountValue={setAmountValue}
        metalBalanceValue={metalBalanceValue}
        cashBalanceValue={cashBalanceValue}
        printMenu={printMenu}
        pdfMenu={pdfMenu}
      />
      <EstimationDialog
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        estimationNoDataAPI={estimationNoDataAPI}
        setSelectedObject={setSelectedObject}
        selectedObject={selectedObject}
        setSelectEstimationNo={setSelectEstimationNo}
        estimationNoItemsAPI={estimationNoItemsAPI}
        estimationNoMastAPI={estimationNoMastAPI}
        setStonesData={setStonesData}
        setTableData={setTableData}
        setStoneMainData={setStoneMainData}
      />
      <EstimationStonesDrawer
        stonesDrawerOpen={stonesDrawerOpen}
        setStonesDrawerOpen={setStonesDrawerOpen}
        stonesData={stonesData}
        setStoneRate={setStoneRate}
        stoneRate={stoneRate}
      />
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
      {/* </>
      )} */}
    </div>
  );
};
export default Estimation;
