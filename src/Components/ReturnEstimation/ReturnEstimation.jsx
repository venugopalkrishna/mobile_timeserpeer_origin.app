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
import { useEffect, useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { useLocation } from "react-router-dom";
import styles from "./ReturnEstimation.module.css";
import ReturnEstimationDialog from "./ReturnEstimationDialog";
import ReturnEstimationDrawer from "./ReturnEstimationDrawer";
import ReturnEstimationFields from "./ReturnEstimationFields";
import ReturnEstimationStonesDrawer from "./ReturnEstimationStonesDrawer";
import { CREATE_jwel } from "../../Config/Config";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import ImageDialog from "../Inventory/ImageDialog";
import { Box } from "@mui/material";

const { Option } = Select;
const ReturnEstimation = () => {
  const [form] = Form.useForm();
  const partyRef = useRef(null);
  const touchRef = useRef(null);
  const wastRef = useRef(null);
  const tagNoRef = useRef(null);
  const submitRef = useRef(null);
  const pathName = useLocation();
  const path = pathName?.pathname;
  const pathModel2 = path === "/return-estimations-model2";
  const admin = localStorage.getItem("admin");

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
    "ddd, DD MMM YYYY HH:mm:ss [GMT]",
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
        `${CREATE_jwel}/api/Wholesal/GetSchemeMaxNumberInTable?tableName=RETURN_ESTIMATION_MAST&column=ESTIMATIONNO`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

      // if (Array.isArray(data) && data.length > 0) {
      //   setEstimationCount(data[0].Column1);
      // }
      if (Array.isArray(data) && data.length > 0) {
        const rawValue = data[0]?.Column1;
        const maxInvNo = Number.isFinite(Number(rawValue))
          ? Number(rawValue)
          : 0;
        const newInvNo = maxInvNo + 1;
        setEstimationCount(newInvNo);
        return newInvNo;
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
        },
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
  const stonesAPI = async (tagNo, data) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_ITEMS&where=TAGNO='${
          tagNoValue ? tagNoValue : tagNo
        }'  AND RECYCLE='YES'`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      let newData = response.data;

      if (!Array.isArray(newData) || newData.length === 0) {
        message.warning("Tag Not existed");
        return null;
      }

      let finalData = [];

      setStoneMainData((prevData) => {
        const existingTag = prevData.some(
          (item) => item.TAGNO === (tagNoValue || tagNo),
        );

        if (existingTag) {
          return prevData;
        }

        const validNewData = newData.filter(
          (item) => item?.TAGNO && item?.MAINTYPE && item?.ACTGRAMS,
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

        const diffWtSubtractedMap = {};

        validNewData.forEach((item) => {
          const matchedItem = data?.find((d) => d.TAGNO === item.TAGNO);
          const tagNo = item.TAGNO;
          const type = item.MAINTYPE;
          const diffWt = matchedItem ? Number(matchedItem.DIFFWT) || 0 : 0;
          const grams = Number(item.ACTGRAMS) || 0;

          // Initialize tracking for this TAGNO + MAINTYPE
          if (!diffWtSubtractedMap[tagNo]) diffWtSubtractedMap[tagNo] = {};
          if (diffWtSubtractedMap[tagNo][type] === undefined)
            diffWtSubtractedMap[tagNo][type] = false;

          let finalGrams = grams;

          if (
            type === "STONES" &&
            Number(admin) === 3 &&
            !diffWtSubtractedMap[tagNo][type]
          ) {
            finalGrams = grams - diffWt;
            diffWtSubtractedMap[tagNo][type] = true;
          }

          if (!mergedMap[tagNo]) {
            mergedMap[tagNo] = { TAGNO: tagNo, MAINTYPES: {} };
          }

          if (mergedMap[tagNo].MAINTYPES[type]) {
            mergedMap[tagNo].MAINTYPES[type] += finalGrams;
          } else {
            mergedMap[tagNo].MAINTYPES[type] = finalGrams;
          }
        });

        const finalData = Object.values(mergedMap).map((item) => ({
          TAGNO: item.TAGNO,
          ACTGRAMS: Object.entries(item.MAINTYPES)
            .map(([key, value]) => `${key}(${(value || 0).toFixed(3)})`)
            .join(", "),
        }));

        return finalData;
      });

      setStonesData((prevData) => {
        const currentTag = tagNoValue || tagNo;

        // ✅ Check if TAGNO already exists → Don't add again
        const tagExists = prevData.some((item) => item.TAGNO === currentTag);

        if (tagExists) {
          return prevData; // ❌ Do NOT add duplicates
        }
        const combinedData = [...prevData, ...newData];

        const mergedData = combinedData.reduce((acc, item) => {
          const existingItem = acc.find((el) => el.MAINTYPE === item.MAINTYPE);
          const matchedItem = data?.find((d) => d.TAGNO === item.TAGNO);

          const grams = Number(item.ACTGRAMS) || 0;
          const diffWt = matchedItem ? Number(matchedItem.DIFFWT) || 0 : 0;

          if (existingItem) {
            existingItem.ACTGRAMS = (existingItem.ACTGRAMS || 0) + grams;

            if (
              !existingItem._diffWtSubtracted &&
              item.MAINTYPE === "STONES" &&
              Number(admin) === 3
            ) {
              existingItem.ACTGRAMS -= diffWt;
              existingItem._diffWtSubtracted = true;
            }

            existingItem.PCS =
              (existingItem.PCS || 0) + (Number(item.PCS) || 0);
            existingItem.CTS =
              (existingItem.CTS || 0) + (Number(item.CTS) || 0);
          } else {
            let initialGrams = grams;
            let diffWtSubtracted = false;

            if (item.MAINTYPE === "STONES" && Number(admin) === 3) {
              initialGrams -= diffWt;
              diffWtSubtracted = true;
            }

            acc.push({
              ...item,
              PCS: Number(item.PCS) || 0,
              CTS: Number(item.CTS) || 0,
              ACTGRAMS: initialGrams,
              _diffWtSubtracted: diffWtSubtracted,
            });
          }

          return acc;
        }, []);
        return mergedData.map(({ _diffWtSubtracted, ...rest }) => rest);
      });
      // }

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
        }'  AND RECYCLE='YES'`,
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;

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
      // stonesAPI(data[0]?.TAGNO, data);
      setTableData((prevData) => {
        const existingTag = prevData.some(
          (item) => item.TAGNO === (tagNoValue || tagNo),
        );

        if (existingTag) {
          return prevData;
        }

        const newObjects = data.map((obj) => {
          const totalTouch =
            Number(touchValue || 0) + Number(wastageValue || 0);
          const finalGold = (Number(obj?.NWT) * totalTouch) / 100;
          const actPer = (Number(finalGold || 0) / Number(obj?.GWT || 0)) * 100;

          const diffSwt = obj?.DIFFWT;
          const gwt = obj?.GWT;
          const lessWt = obj?.STONEWT;

          const diffStone = lessWt - diffSwt;
          const diffNwt = gwt - diffStone;

          const stoneEntry = stoneData?.find((s) => s.TAGNO === obj.TAGNO);

          return {
            ...obj,
            TOUCH: totalTouch,
            FINALGOLD: finalGold?.toFixed(3),
            ACTPER: actPer?.toFixed(3),
            PIECES: obj?.PIECES || 0,
            GROSSWEIGHT: obj?.GWT?.toFixed(3) || 0,
            STONEWT:
              Number(admin) === 3 ? diffStone : obj?.STONEWT?.toFixed(3) || 0,
            NETWT: Number(admin) === 3 ? diffNwt : obj?.NWT?.toFixed(3) || 0,
            ACTGRAMS: stoneEntry?.ACTGRAMS || "", // ✅ use passed stone data
          };
        });

        const updatedData = [...prevData, ...newObjects];

        // Totals
        setTotalPieces(
          updatedData.reduce((sum, item) => sum + Number(item.PIECES || 0), 0),
        );
        setTotalGrossWeight(
          updatedData.reduce(
            (sum, item) => sum + Number(item.GROSSWEIGHT || 0),
            0,
          ),
        );
        setTotalStoneWeight(
          updatedData.reduce((sum, item) => sum + Number(item.STONEWT || 0), 0),
        );
        setTotalNetWeight(
          updatedData.reduce((sum, item) => sum + Number(item.NETWT || 0), 0),
        );
        setTotalFineGold(
          updatedData.reduce(
            (sum, item) => sum + Number(item.FINALGOLD || 0),
            0,
          ),
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
      // setStoneMakingValue(selectEstimationNo?.RCHARGES);
    }
    if (selectEstimationNo?.STGMRATE) {
      setStoneMakingValue(Number(selectEstimationNo?.STGMRATE));
    }
    if (selectEstimationNo?.TOUCHPER) {
      setTouchValue(selectEstimationNo?.TOUCHPER);
    }
    if (selectEstimationNo?.WASTPER) {
      setWastageValue(selectEstimationNo?.WASTPER);
    }
    if (selectEstimationNo?.DESCRIPTION) {
      const matchedParty = partyNames.find(
        (party) => party.Dealername === selectEstimationNo.DESCRIPTION,
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
        (_, index) => index !== indexToDelete,
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
    const rate = stoneRate[index] || Number(stone?.RATE); // Get the rate for the row or default to 0
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

  const createEstimationData = async (estNo) => {
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
        estimationtype: "SALES",
        estimationno: selectEstimationNo
          ? selectEstimationNo?.ESTIMATIONNO
          : estNo,
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
        branchname: stone.IMGPATH || "-",
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
        `${CREATE_jwel}/api/Wholesal/InsertWholesalReturnEstimationData`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        },
      );
      let data = response?.data;
      setEstimationData(data[0].isInsert);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationItems = async (estNo) => {
    const requestBody = stonesData.map((stone, index) => ({
      estimationno: selectEstimationNo
        ? selectEstimationNo?.ESTIMATIONNO
        : estNo || 0,
      estimationdate: formattedDate,
      sno: index + 1 || 0,
      stonename: stone?.MAINTYPE || "-",
      pcs: stone?.PCS || 0,
      cts: Number(stone?.CTS).toFixed(3) || 0,
      gms: Number(stone?.ACTGRAMS).toFixed(3) || 0,
      rate: Number(stoneRate[index]) || Number(stone?.RATE),
      amt:
        parseFloat(
          (stone.ACTGRAMS * (stoneRate[index] || stone?.RATE)).toFixed(2),
        ) || 0,
      priority: 0,
      calcrate: "-",
    }));
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalReturnEstimationItems`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        },
      );
      let data = response?.data;
      setItemData(data[0].isInsert);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const createEstimationMast = async (estNo) => {
    const totalTouch = Number(touchValue) + Number(wastageValue);
    const requestBody = [
      {
        estimationtype: "SALES",
        estimationno: selectEstimationNo
          ? selectEstimationNo?.ESTIMATIONNO
          : estNo,
        estimationdate: formattedDate,
        description: selectedParty,
        gwt: Number(Number(totalGrossWeight).toFixed(3)) || 0,
        stonewt: Number(Number(totalStoneWeight).toFixed(3)) || 0,
        nwt: Number(Number(totalNetWeight).toFixed(3)) || 0,
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
        totpcs: Number(totalPieces) || 0,
        ssp: 0,
        appno: 0,
        appdate: formattedDate,
        rbrate: Number(Number(fineGoldValue)?.toFixed(3)) || 0,
        czrate: Number(Number(rateValue)?.toFixed(2)) || 0,
        ssprate: Number(Number(amountValue)?.toFixed(2)),
        beadsrate: Number(Number(metalBalanceValue)?.toFixed(3)) || 0,
        othersrate: 0,
        mixrate: 0,
        wastper: Number(wastageValue) || 0,
        wastage: Number(wastageValue) || 0,
        wt: 0,
        touchper: Number(touchValue) || 0,
        touch: Number(totalTouch) || 0,
        purewt: Number(Number(totalFineGold)?.toFixed(3)) || 0,
        mcper: Number(Number(makingValue)) || 0,
        mcamt: Number(Number(perGramValue).toFixed(3)) || 0,
        stcharges: totalStoneCost
          ? Number(Number(totalStoneCost).toFixed(2))
          : Number(Number(stonePerGramValue).toFixed(2)) || 0,
        totcash: Number(Number(cashBalanceValue).toFixed(2)) || 0,
        stgmrate: String(stoneMakingValue) || "0",
        rcharges: Number(rodiumChargeValue) || 0,
      },
    ];

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/InsertWholesalReturnEstimationMast`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            tenantName: tenantName,
          },
        },
      );
      let data = response?.data;
      setMastData(data[0].isInsert);
      handleReset();
      window.location.reload();
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
        tableName: "RETURN_ESTIMATION_DATA",
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
        },
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
          IMGPATH: item.BRANCHNAME,
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
          0,
        );
        const totalGross = updatedData.reduce(
          (sum, item) => sum + Number(item.GROSSWEIGHT || 0),
          0,
        );
        const totalStones = updatedData.reduce(
          (sum, item) => sum + Number(item.STONEWT || 0),
          0,
        );
        const totalNetWt = updatedData.reduce(
          (sum, item) => sum + Number(item.NETWT || 0),
          0,
        );
        const totalGold = updatedData.reduce(
          (sum, item) => sum + Number(item.FINALGOLD || 0),
          0,
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

  const estimationNoMastAPI = async (estNo) => {
    try {
      let whereCondition = "";
      if (estNo) {
        whereCondition = `ESTIMATIONNO=${estNo}`;
      }
      let params = {
        tableName: "RETURN_ESTIMATION_MAST",
        where: whereCondition,
      };

      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere`,
        {
          params,
          headers: {
            tenantName: tenantName,
          },
        },
      );

      const data = response.data;
      setFineGoldValue(data[0]?.RBRATE?.toFixed(3));
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
        tableName: "RETURN_ESTIMATION_ITEMS",
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
        },
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
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=RETURN_ESTIMATION_DATA&where=ESTIMATIONNO=${selectEstimationNo?.ESTIMATIONNO}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteMast = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=RETURN_ESTIMATION_MAST&where=ESTIMATIONNO=${selectEstimationNo?.ESTIMATIONNO}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const estimationDeleteItems = async () => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Wholesal/DeleteDataFromGivenTableNameWithWhere?tableName=RETURN_ESTIMATION_ITEMS&where=ESTIMATIONNO=${selectEstimationNo?.ESTIMATIONNO}`,
        {},
        {
          headers: {
            tenantName: tenantName,
          },
        },
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  // const createImagePathAPI = async (imgUrl, tagNo) => {
  //   try {
  //     await axios.get(
  //       `${CREATE_jwel}/api/Wholesal/UpdateTagGenerationImagePath?tagNo=${tagNo}&path=${
  //         imgUrl || ""
  //       }`,
  //       { headers: { tenantName } }
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const createImagePathAPI = async (imgUrl, tagNo) => {
    try {
      await axios.get(
        `${CREATE_jwel}/api/Wholesal/UpdateTagGenerationImagePath?tagNo=${tagNo}&path=${
          imgUrl || ""
        }`,
        { headers: { tenantName } },
      );

      setTableData((prevData) =>
        prevData.map((item) =>
          item.TAGNO === tagNo
            ? { ...item, IMGPATH: imgUrl } // update image path
            : item,
        ),
      );
    } catch (error) {
      console.error("Failed to update image path:", error);
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
        },
      );

      if (response.status === 200) {
        const imgUrl = `https://image.timeserasoftware.in/${userName}/${renamedFileName}`;
        createImagePathAPI(imgUrl, tagNo);
        setTableData((prevData) =>
          prevData.map((item) =>
            item.TAGNO === tagNo
              ? { ...item, IMGPATH: imgUrl } // update image path
              : item,
          ),
        );
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
            if (path === "/return-estimations-model2") {
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
        },
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
      setFineGoldValue(totalFineGold?.toFixed(3));
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
    if (path === "/return-estimations-model1") {
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

  const handleImageOk = (image) => {
    setImageOpen(true);
    setPhoto(image);
  };

  const handleImageCancel = () => {
    setImageOpen(false);
  };

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

  const fetchWithRetry = async (url, retries = 3, delay = 300) => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, { mode: "cors" });
        if (res.ok) return res;
      } catch (e) {
        console.warn(`Retry ${i + 1} for ${url}`);
      }
      await new Promise((r) => setTimeout(r, delay));
    }
    throw new Error("Failed after retries: " + url);
  };

  // ✅ Helper: resize & convert to base64 (fix for iOS Safari blank PDF)
  const resizeBase64Img = (base64Str, maxWidth = 500, maxHeight = 500) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height *= maxWidth / width;
            width = maxWidth;
          } else {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = base64Str;
    });

  // ✅ Convert URL → base64 (with resize)
  const urlToBase64 = async (url) => {
    const cleanUrl = decodeURIComponent(url);
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(
      cleanUrl,
    )}`;

    const response = await fetchWithRetry(proxyUrl, 3, 800);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const resized = await resizeBase64Img(reader.result);
        resolve(resized);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

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
        }),
      );
      setBase64Images(imageMap);
    };

    convertAllImages();
  }, [tableData, photos]);

  const handleLandScapePrint = (nextEstNo) => {
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
      path === "/return-estimations-model1"
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
                        const rate = stoneRate[index] || Number(stone?.RATE);
                        const amount = stone.ACTGRAMS * Number(rate);
                        totalAmount += amount;
                        totalStoneWeight += stone.ACTGRAMS;
                        return `
                        <tr>
                          <td class="stone-name">${stone.MAINTYPE}</td>
                          <td>${stone.PCS}</td>
                          <td class="sub-right">${stone.ACTGRAMS.toFixed(
                            3,
                          )}</td>
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
            3,
          )}</td></tr>
          ${
            rateCut === true
              ? `<tr><td class="stone-name">Fine ${
                  fineGoldValue || 0
                } @${Number(rateValue || 0)}/-</td>
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
            path === "/return-estimations-model1"
              ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                  rodiumChargeValue || 0
                }</td></tr>
                 <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                   2,
                 )}</td></tr>`
              : `<tr><td class="stone-name">Stone Cost ${
                  stoneMakingValue || 0
                } /g</td>
                 <td class="sub-right">${
                   stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
                 }</td></tr>`
          }
          <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
            3,
          )}</strong></td></tr>
          <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
            2,
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
          <div class="header"><h2>RETURN ESTIMATION</h2></div>
          <div class="sub-header">
            <span>ESTIMATION NO. : <span class="sub-est">${
              selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
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
        filename: `Return_Estimation_${
          selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
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

  const handlePrint = (nextEstNo) => {
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
      path === "/return-estimations-model1"
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
                        const rate = stoneRate[index] || Number(stone?.RATE);
                        const amount = stone.ACTGRAMS * Number(rate);
                        totalAmount += amount;
                        totalStoneWeight += stone.ACTGRAMS;
                        return `
                        <tr>
                          <td class="stone-name">${stone.MAINTYPE}</td>
                          <td>${stone.PCS}</td>
                          <td class="sub-right">${stone.ACTGRAMS.toFixed(
                            3,
                          )}</td>
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
            3,
          )}</td></tr>
          ${
            rateCut === true
              ? `<tr><td class="stone-name">Fine ${
                  fineGoldValue || 0
                } @${Number(rateValue || 0)}/-</td>
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
            path === "/return-estimations-model1"
              ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                  rodiumChargeValue || 0
                }</td></tr>
                 <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                   2,
                 )}</td></tr>`
              : `<tr><td class="stone-name">Stone Cost ${
                  stoneMakingValue || 0
                } /g</td>
                 <td class="sub-right">${
                   stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
                 }</td></tr>`
          }
          <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
            3,
          )}</strong></td></tr>
          <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
            2,
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
          <div class="header"><h2>RETURN ESTIMATION</h2></div>
          <div class="sub-header">
            <span>ESTIMATION NO. : <span class="sub-est">${
              selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
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
        filename: `Return_Estimation_${
          selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
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

  const handleDownloadPDF = (nextEstNo) => {
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
          <td rowspan="${
            cleanedActGrams && Number(admin) !== 2 ? 2 : 1
          }"><strong>${index + 1}</strong></td>
          <td class="sub-tag" rowspan="${
            cleanedActGrams && Number(admin) !== 2 ? 2 : 1
          }"><strong>${item.TAGNO}</strong></td>
          <td class="sub-pro"><strong>${item.PRODNAME}</strong></td>
          <td>${item.PREFIX}</td>
          <td class="sub-right"><strong>${item.PIECES}</strong></td>
          <td class="sub-right"><strong>${Number(item.GWT)?.toFixed(
            3,
          )}</strong></td>
            <td class="sub-right">${Number(item.STONEWT)?.toFixed(3)}</td>
          <td class="sub-right">${Number(item.NETWT)?.toFixed(3)}</td>
          <td class="sub-right">${item.TOUCH}%</td>
          <td class="sub-gold">${item.FINALGOLD}</td>
        </tr>
        ${
          cleanedActGrams && Number(admin) !== 2
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
      path === "/return-estimations-model1" && Number(admin) !== 2
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
                        const rate = stoneRate[index] || Number(stone?.RATE);
                        const amount = stone.ACTGRAMS * Number(rate);
                        totalAmount += amount;
                        totalStoneWeight += stone.ACTGRAMS;
                        totalStonePieces += stone.PCS;
                        return `
                        <tr>
                          <td class="sub-stone-name">${stone.MAINTYPE}</td>
                          <td class="stone-pieces">${stone.PCS}</td>
                          <td class="stone-weight">${stone.ACTGRAMS.toFixed(
                            3,
                          )}</td>
                          <td class="stone-cost">${Number(rate)?.toFixed(
                            2,
                          )}</td>
                          <td class="stone-amount">${amount.toFixed(2)}</td>
                        </tr>
                      `;
                      })
                      .join("") +
                    `<tr class="total">
                      <td colspan="1">Total</td>
                      <td class="stone-pieces">${totalStonePieces}</td>
                      <td class="stone-weight">${totalStoneWeight.toFixed(
                        3,
                      )}</td>
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
            3,
          )}</td></tr>
          ${
            rateCut === true
              ? `<tr><td class="stone-name">Fine ${
                  fineGoldValue || 0
                } @${Number(rateValue || 0)}/-</td>
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
            path === "/return-estimations-model1" && Number(admin) !== 2
              ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                  rodiumChargeValue || 0
                }</td></tr>
                 <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                   2,
                 )}</td></tr>`
              : `<tr><td class="stone-name">Stone Cost ${
                  stoneMakingValue || 0
                } /g</td>
                 <td class="sub-right">${
                   stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
                 }</td></tr>`
          }
          ${
            Number(admin) !== 2
              ? `<tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
                  3,
                )}</strong></td></tr>
          <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
            2,
          )}</strong></td></tr>`
              : ""
          }
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
            .header { text-align: center; margin-bottom: 18px; }
            .header h2 { margin: 0; font-size: 16px; font-weight: bold; display: inline-block; text-decoration: underline; text-underline-offset: 4px; }
            .sub-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; margin-bottom: 10px; padding-bottom: 5px; }
            .sub-est { font-weight : bold; font-size: 18px; color : red; }
            .sub-party { font-weight : bold; font-size: 14px; color : #162566; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 5px; }
            th, td { border: 1px solid black; padding: 5px; text-align: center; }
            th { background-color: #52bd91; font-weight: bold; }
            .total { font-weight: bold; background-color: #162566; color: white; }
            .sub { text-align: left; width: 300px; }
            .sub-pro { text-align: left; width: 500px; background-color: #BCF2F6; }
            .sub-tag { text-align: center; width: 100px; }
            .sub-right { text-align: right; width: 80px; }
            .sub-gold { text-align: right; width: 130px; }
            .sub-text { text-align: left; font-size: 10px; font-weight: bold; }
            .sub-row td { border-top: none; text-align: left; }
            .container { display: flex; justify-content: flex-start; margin-top: 10px; }
            .summary-container { width: 35%; margin-left: auto; }
            .stone-name { text-align: left; }
            .sub-final { background-color: #f26d14ff; font-weight: bold; }
            .sub-right-bold { text-align: right; font-weight: bold; }
            .stone-name-bold { text-align: left; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header"><h2>ESTIMATION</h2></div>
          <div class="sub-header">
            <span>ESTIMATION NO. : <span class="sub-est">${
              selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
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
            ${summaryTable} <!-- Only summary table fixed right -->
          </div>
        </body>
      </html>
    `;

    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    html2pdf()
      .set({
        margin: [10, 5, 10, 5],
        filename: `Estimation_${
          selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
        }.pdf`,
        image: { type: "jpeg", quality: 1 },
        pagebreak: { mode: ["css", "legacy"], avoid: "tr" },
        html2canvas: { scale: 4, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

  const handleLandScapDownloadPDF = (nextEstNo) => {
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
            <td class="sub-right"><strong>${Number(item.GWT)?.toFixed(
              3,
            )}</strong></td>
            <td class="sub-right">${Number(item.STONEWT)?.toFixed(3)}</td>
          <td class="sub-right">${Number(item.NETWT)?.toFixed(3)}</td>
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
      path === "/return-estimations-model1"
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
                        const rate = stoneRate[index] || Number(stone?.RATE);
                        const amount = stone.ACTGRAMS * Number(rate);
                        totalAmount += amount;
                        totalStoneWeight += stone.ACTGRAMS;
                        totalStonePieces += stone.PCS;
                        return `
                        <tr>
                          <td class="sub-stone-name">${stone.MAINTYPE}</td>
                          <td class="stone-pieces">${stone.PCS}</td>
                          <td class="stone-weight">${stone.ACTGRAMS.toFixed(
                            3,
                          )}</td>
                          <td class="stone-cost">${Number(rate)?.toFixed(
                            2,
                          )}</td>
                          <td class="stone-amount">${amount.toFixed(2)}</td>
                        </tr>
                      `;
                      })
                      .join("") +
                    `<tr class="total">
                      <td colspan="1">Total</td>
                      <td class="stone-pieces">${totalStonePieces}</td>
                      <td class="stone-weight">${totalStoneWeight.toFixed(
                        3,
                      )}</td>
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
            3,
          )}</td></tr>
          ${
            rateCut === true
              ? `<tr><td class="stone-name">Fine ${
                  fineGoldValue || 0
                } @${Number(rateValue || 0)}/-</td>
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
            path === "/return-estimations-model1"
              ? `<tr><td class="stone-name">Other Charges</td><td class="sub-right">${
                  rodiumChargeValue || 0
                }</td></tr>
                 <tr><td class="stone-name">Stone Cost</td><td class="sub-right">${totalStoneCost?.toFixed(
                   2,
                 )}</td></tr>`
              : `<tr><td class="stone-name">Stone Cost ${
                  stoneMakingValue || 0
                } /g</td>
                 <td class="sub-right">${
                   stonePerGramValue ? Number(stonePerGramValue).toFixed(2) : 0
                 }</td></tr>`
          }
          <tr class="sub-final"><td class="stone-name-bold"><strong>Metal Balance</strong></td><td class="sub-right-bold"><strong>${metalBalanceValue.toFixed(
            3,
          )}</strong></td></tr>
          <tr class="sub-final"><td class="stone-name-bold"><strong>Cash Balance</strong></td><td class="sub-right-bold"><strong>${cashBalanceValue.toFixed(
            2,
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
              selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
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
    const clone = container.cloneNode(true);

    html2pdf()
      .set({
        margin: [10, 5, 10, 5],
        filename: `Estimation_${
          selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : nextEstNo
        }.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: {
          useCORS: true,
          allowTaint: true,
          scale: 2, // clearer text
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(clone)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

  const handlePrintClick = async ({ key }) => {
    if (key === "1") {
      const nextEstNo = await estimationCountAPI();
      handleLandScapePrint(nextEstNo);
    } else if (key === "2") {
      const nextEstNo = await estimationCountAPI();
      handlePrint(nextEstNo);
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

  const handlePdfClick = async ({ key }) => {
    if (key === "1") {
      const nextEstNo = await estimationCountAPI();
      handleLandScapDownloadPDF(nextEstNo);
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
      const nextEstNo = await estimationCountAPI();
      handleDownloadPDF(nextEstNo);
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

  const pdfMenuItems =
    Number(admin) === 2
      ? [
          {
            key: "2",
            icon: <FilePdfOutlined />,
            label: "PDF Without Image",
          },
        ]
      : [
          {
            key: "1",
            icon: <FilePdfOutlined />,
            label: "PDF With Image",
          },
          {
            key: "2",
            icon: <FilePdfOutlined />,
            label: "PDF Without Image",
          },
        ];

  const pdfMenu = {
    items: pdfMenuItems,
    onClick: handlePdfClick,
  };

  return (
    <div>
      <Header setOpen={setOpen} />
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
              ? "Return Estimation With Out Stones"
              : "Return Estimation With Stones"}
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
                    : estimationCount}
                </strong>
              </span>

              <div
                className={styles.dateContainer}
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
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
              style={{ color: "green", fontSize: "25px", cursor: "pointer" }}
              onClick={() => setFilterOpen(true)}
            />
          </div>
          {selectedParty ? (
            <div className={styles.partyNameContainer}>
              <span>
                Party Name:{" "}
                <strong
                  style={{ fontSize: "16px", fontWeight: "bold", color: "red" }}
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
            {path === "/return-estimations-model1" &&
            stonesData.length > 0 &&
            Number(admin) !== 2 ? (
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
              style={{ backgroundColor: "AppWorkspace", color: "white" }}
              disabled={selectEstimationNo?.BILLNO > 0}
              className={styles.submitButton}
              ref={submitRef}
              onClick={() => {
                if (!tagNoValue) {
                  message.warning("Enter Tag No");
                } else if (path === "/return-estimations-model2") {
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
            {selectedParty && !(selectEstimationNo?.BILLNO > 0) && (
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
                <div key={index} className={styles.infoBox}>
                  {/* Tag No */}
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
                    {/* {item?.IMGPATH || photos[index] ? (
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
                            handleImageOk(photos[index] || item?.IMGPATH);
                          }}
                        >
                          <img
                            src={photos[index] || item?.IMGPATH}
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
                    )} */}
                    {(item?.IMGPATH &&
                      item.IMGPATH !== "-" &&
                      item.IMGPATH !== "") ||
                    photos[index] ? (
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
                            handleImageOk(
                              photos[index] ||
                                base64Images[item?.IMGPATH] ||
                                item?.IMGPATH,
                            );
                          }}
                        >
                          <img
                            src={
                              photos[index] ||
                              base64Images[item?.IMGPATH] ||
                              item?.IMGPATH
                            }
                            alt="img"
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                            }}
                          />
                        </Box>
                      </div>
                    ) : null}
                    <PhotoCameraIcon
                      style={{ color: "#000000" }}
                      onClick={() => {
                        if (!selectEstimationNo?.BILLNO > 0) {
                          handleCameraOk(index, item.TAGNO, item?.IMGPATH);
                        }
                      }}
                    />
                    <DeleteOutlined
                      style={{
                        color: "red",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                      onClick={() => {
                        if (!selectEstimationNo?.BILLNO > 0) {
                          handleDelete(index);
                        }
                      }}
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
                      Stone Wt:{" "}
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
                  {path === "/return-estimations-model1" &&
                  Number(admin) !== 2 ? (
                    <>
                      <hr className={styles.fullWidthLine} />
                      <div className={styles.fullWidthStone}>
                        <p>
                          {(() => {
                            const actGrams =
                              stoneMainData.find(
                                (stone) => stone.TAGNO === item.TAGNO,
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
      <ReturnEstimationFields
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
        selectEstimationNo={selectEstimationNo}
      />
      <ReturnEstimationDrawer
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
        admin={admin}
        estimationCountAPI={estimationCountAPI}
      />
      <ReturnEstimationDialog
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
      <ReturnEstimationStonesDrawer
        stonesDrawerOpen={stonesDrawerOpen}
        setStonesDrawerOpen={setStonesDrawerOpen}
        stonesData={stonesData}
        setStoneRate={setStoneRate}
        stoneRate={stoneRate}
        selectEstimationNo={selectEstimationNo}
      />
      <SidebarDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        singleImage={singleImage}
        userArea={userArea}
        userName={userName}
      />
    </div>
  );
};
export default ReturnEstimation;
