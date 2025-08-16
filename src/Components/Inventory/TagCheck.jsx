import React, { useState, useEffect, useRef } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Header from "../Header";
import SidebarDrawer from "../SidebarDrawer";
import { CREATE_jwel } from "../../Config/Config";
import axios from "axios";
import styles from "./TagCheck.module.css";
import { Button, Input } from "antd";
import ImageDialog from "./ImageDialog";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TagCheck = () => {
  const tagNoRef = useRef(null);
  const submitRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [tagNoValue, setTagNoValue] = useState();
  const [tagDetailsData, setTagDetailsData] = useState([]);
  const [stonesData, setStonesData] = useState([]);
  const [tagNo, setTagNo] = useState();
  const [open, setOpen] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoId, setPhotoId] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  const imageUrls = localStorage.getItem("images")?.split(",");
  const imagesData = imageUrls?.length > 0 ? imageUrls : [];
  const userArea = localStorage.getItem("city");
  const userName = localStorage.getItem("userName");
  const singleImage = localStorage.getItem("singleImage");
  const tenantName = localStorage.getItem("tenantName");


  const mainAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TAGNO='${tagNoValue}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      // if (!Array.isArray(data) || data.length === 0) {
      //   message.warning("Tag Not existed");
      //   return;
      // }
      handleReset();
      setTagDetailsData(data);
      setTagNo(data[0]?.TAGNO);
      setImageUrl(data[0]?.IMGPATH);
      setPhoto(data[0]?.IMGPATH);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stonesAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_ITEMS&where=TAGNO='${tagNoValue}'`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      const data = response.data;

      setStonesData(data);
    } catch (error) {
      console.error("Error fetching estimation count:", error);
    } finally {
      setLoading(false);
    }
  };

  const createImagePathAPI = async (imgUrl) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Wholesal/UpdateTagGenerationImagePath?tagNo=${tagNo}&path=${
          imgUrl ? imgUrl : imageUrl
        }`,
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );
      handleReset();
    } catch (error) {
      console.error(error);
    }
  };

  const getBase64Data = (dataUri) => {
    return dataUri.replace(/^data:image\/\w+;base64,/, "");
  };

  const generateFileName = (tagNo) => {
    const timestamp = Date.now();
    return `${tagNo}.jpg`;
  };

  const imageUploadAPI = async () => {
    const base64Str = getBase64Data(photo);
    const renamedFileName = generateFileName(tagNo);

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Utilities/SaveClientImages`,
        {
          fileName: renamedFileName,
          fileBase: base64Str,
          clientName: "WHOLESALE",
          dbId: "",
        },
        {
          headers: {
            tenantName: tenantName,
          },
        }
      );

      if (response.status === 200) {
        const imgUrl = `https://image.timeserasoftware.in/WHOLESALE/${renamedFileName}`;
        createImagePathAPI(imgUrl);
        alert("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed!");
    }
  };

  const handleReset = () => {
    setTagNo();
    setStonesData([]);
    setTagDetailsData([]);
    setPhoto(null);
    setOpen(false);
    setIsSupported(false);
    setImageOpen(false);
    setCameraOpen(false);
    setImageUrl(null);
  };

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

  const handleTakePhoto = (dataUri) => {
    setPhoto(dataUri);
  };

  //   if (!isSupported) {
  //     return <p>Camera not supported on this browser.</p>;
  //   }

  const handleTagNoKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitRef.current?.click();
    }
  };

  const handleImageOk = () => {
    setImageOpen(true);
  };

  const handleImageCancel = () => {
    setImageOpen(false);
  };

  const handleCameraOk = () => {
    setCameraOpen(true);
  };

  const handleCameraCancel = () => {
    setCameraOpen(false);
  };

  const toggleDrawer = () => {
    setOpen(false);
  };

  return (
    <div>
      <Header setOpen={setOpen} />

      <div>
        {cameraOpen === true ? (
          <>
            {!photo ? (
              <>
                <Camera
                  onTakePhoto={handleTakePhoto}
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
                    onClick={() => {
                      handleCameraCancel();
                    }}
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
                  src={photo}
                  alt="Captured"
                  style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}
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
                    onClick={() => {
                      setPhoto(null);
                    }}
                    style={{
                      background: "#91C8E4",
                    }}
                  >
                    Retake
                  </Button>
                  <Button
                    onClick={() => {
                      handleCameraCancel();
                      // setPhoto(null);
                    }}
                    style={{
                      background: "#EAA64D",
                    }}
                  >
                    <ArrowBackIcon />
                    Back
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className={styles.container}>
              <div className={styles.headerContainer}>
                <h3 className={styles.heading}>Tag No Check</h3>
              </div>
              <div className={styles.estimationTagContainer}>
                <div className={styles.tagNoSection}>
                  <span className={styles.tagLabel}>Tag No</span>
                  <Input
                    className={styles.tagInput}
                    placeholder="Enter Tag No"
                    ref={tagNoRef}
                    value={tagNoValue}
                    autoFocus={true}
                    onKeyDown={handleTagNoKeyDown}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[a-zA-Z]/g, "");
                      if (value.length <= 10) {
                        setTagNoValue(value);
                      }
                      // setBarCode(e.target.value);
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
                      stonesAPI();
                      mainAPI();
                      setTagNoValue("");
                    }}
                  >
                    Show
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
                    type="primary"
                    danger
                    disabled={!photo}
                    className={styles.saveButton}
                    onClick={() => {
                      if (photo && photo.startsWith("data:image")) {
                        imageUploadAPI();
                      } else {
                        createImagePathAPI();
                      }
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.header}>
                  <div>
                    <small>Tag no</small>
                    <br />
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                      #{tagDetailsData ? tagDetailsData[0]?.TAGNO : "0"}
                    </span>
                  </div>
                  {tagDetailsData?.length > 0 && photo != null && (
                    <div>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          backgroundColor: "black",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: "2px solid #52bd91",
                        }}
                        onClick={handleImageOk}
                      >
                        <img
                          src={photo}
                          alt="img"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                    </div>
                  )}
                  {tagDetailsData?.length > 0 ? (
                    <div
                      onClick={() => {
                        handleCameraOk();
                      }}
                    >
                      <PhotoCameraIcon />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className={styles.content}>
                  <div className={styles.productHeader}>
                    <span className={styles.productName}>
                      {tagDetailsData ? tagDetailsData[0]?.PRODNAME : "-"}
                    </span>
                    <span className={styles.qtyBox}>
                      {tagDetailsData[0]?.PIECES
                        ? `${tagDetailsData[0]?.PIECES} ${
                            tagDetailsData[0]?.PIECES === 1 ? "piece" : "pieces"
                          }`
                        : "0 pieces"}
                    </span>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.details}>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>Gwt</span>
                      <span className={styles.separator2}>:</span>
                      <span className={styles.value2}>
                        {tagDetailsData[0]?.GWT
                          ? tagDetailsData[0]?.GWT?.toFixed(3) + "g"
                          : "0.000g"}
                      </span>
                    </div>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>Stone Wt</span>
                      <span className={styles.separator2}>:</span>
                      <span className={styles.value2}>
                        {tagDetailsData[0]?.STONEWT
                          ? tagDetailsData[0]?.STONEWT?.toFixed(3) + "g"
                          : "0.000g"}
                      </span>
                    </div>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>Nwt</span>
                      <span className={styles.separator2}>:</span>
                      <span className={styles.value2}>
                        {tagDetailsData[0]?.NWT
                          ? tagDetailsData[0]?.NWT?.toFixed(3) + "g"
                          : "0.000g"}
                      </span>
                    </div>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>HUID1</span>
                      <span className={styles.separator2}>:</span>
                      <span className={styles.value2}>
                        {tagDetailsData[0]?.HUID1
                          ? tagDetailsData[0]?.HUID1
                          : "-"}
                      </span>
                    </div>
                    <div className={styles.rowTag2}>
                      <span className={styles.label2}>HUID2</span>
                      <span className={styles.separator2}>:</span>
                      <span className={styles.value2}>
                        {tagDetailsData[0]?.HUID2
                          ? tagDetailsData[0]?.HUID2
                          : "-"}
                      </span>
                    </div>
                    <div
                      className={styles.highlightBox1}
                      // onClick={() => {
                      //   if (barCodeData[0]?.ITEM_TOTAMT > 0) {
                      //     handleOk();
                      //   }
                      // }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        Stone Details
                        {/* {barCodeData[0]?.ITEM_TOTAMT > 0 && (
                        <span style={{ color: "blue", cursor: "pointer" }}>
                          (Click Me)
                        </span>
                      )} */}
                      </span>
                    </div>
                    {stonesData.map((stone, index) => (
                      <div
                        key={stone.id}
                        style={{
                          background:
                            "radial-gradient(circle at center, #ffffff 40%, #f3f6fb 60%, #e0e7f1 80%)",
                          padding: "5px",
                          borderRadius: "8px",
                          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          border: "1px solid #f3f6fb",
                          marginTop: "5px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                          }}
                        >
                          <span>
                            Name:{" "}
                            <span
                              style={{
                                color: "#162566",
                                fontWeight: "bold",
                                fontSize: "12px",
                              }}
                            >
                              {stone.STONENAME || "-"}
                            </span>
                          </span>
                          <span>
                            Pieces:{" "}
                            <span
                              style={{
                                color: "#162566",
                                fontWeight: "bold",
                                fontSize: "12px",
                              }}
                            >
                              {stone.PCS || 0}
                            </span>
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: "10px",
                            color: "#555",
                            marginBottom: "2px",
                          }}
                        >
                          <span>
                            Grams:{" "}
                            <span
                              style={{
                                color: "#162566",
                                fontWeight: "bold",
                                fontSize: "12px",
                              }}
                            >
                              {stone.ACTGRAMS.toFixed(3) || 0.0}
                            </span>
                          </span>
                          <span>
                            CTS:{" "}
                            <span
                              style={{
                                color: "#162566",
                                fontWeight: "bold",
                                fontSize: "12px",
                              }}
                            >
                              {stone.CTS?.toFixed(3) || 0.0}
                            </span>
                          </span>
                          <span>
                            GMS:{" "}
                            <span
                              style={{
                                color: "#162566",
                                fontWeight: "bold",
                                fontSize: "12px",
                              }}
                            >
                              {stone.GMS?.toFixed(3) || 0.0}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <ImageDialog
        handleImageCancel={handleImageCancel}
        imageOpen={imageOpen}
        imageData={photo}
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

export default TagCheck;
