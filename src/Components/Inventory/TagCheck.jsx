import React, { useState, useEffect } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

export default function CameraComponent() {
  const [isSupported, setIsSupported] = useState(false);
  const [photo, setPhoto] = useState(null);

  console.log(photo, "photo");
  

  useEffect(() => {
    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    ) {
      setIsSupported(true);
    } else {
      alert(
        "Camera not supported on this device/browser. Please use Chrome or Safari over HTTPS."
      );
    }
  }, []);

  const handleTakePhoto = (dataUri) => {
    setPhoto(dataUri);
  };

  if (!isSupported) {
    return <p>Camera not supported on this browser.</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      {!photo ? (
        <Camera
          onTakePhoto={handleTakePhoto}
          idealFacingMode="environment"
          isImageMirror={false}
        />
      ) : (
        <>
          <h3>Captured Image:</h3>
          <img
            src={photo}
            alt="Captured"
            style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}
          />
          <br />
          <button onClick={() => setPhoto(null)}>Retake</button>
        </>
      )}
    </div>
  );
}
