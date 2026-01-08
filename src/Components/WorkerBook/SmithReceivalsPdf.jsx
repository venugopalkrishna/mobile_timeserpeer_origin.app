import { useEffect } from "react";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

const SmithReceivalsprint = (props) => {
  const {
    voucherNo,
    voucherDate,
    smith,
    slipNo,
    particulars,
    pcs,
    recWt,
    stoneWt,
    netWt,
    wast,
    wastWt,
    recWeight,
    orderNo,
    name,
    description,
  } = props;

  const formatNum = (val = 0, dec = 3) =>
    Number(val || 0).toFixed(dec).replace(/\.000$/, "");

  const row = (label, value) => `
    <div style="
      display:flex;
      justify-content:space-between;
      margin:2px 0;
    ">
      <div style="width:38%; text-align:left;">${label}</div>
      <div style="width:4%; text-align:center;">:</div>
      <div style="width:58%; text-align:right;">${value}</div>
    </div>
  `;

  const generatePdf = () => {
    const htmlContent = `
      <div style="
        font-family: monospace;
        font-size:12px;
        padding:12px 10px;
        color:#000;
      ">

        <div style="
          text-align:center;
          font-size:18px;
          font-weight:bold;
          margin-bottom:6px;
        ">
          SMITH RECEIVALS
        </div>

        <hr/>

        ${row("Voucher No", voucherNo || "-") }
        ${row("Date", dayjs(voucherDate).format("DD-MMM-YYYY"))}

        <hr/>

        ${row("Smith", smith || "-")}
        ${row("Slip No", slipNo || "-")}

        <hr/>

        ${row("Particulars", particulars || "-")}
        ${row("Pcs", formatNum(pcs, 0))}
        ${row("Rec Wt", formatNum(recWt))}
        ${row("Stone Wt", formatNum(stoneWt))}
        ${row("Net Wt", formatNum(netWt))}
        ${row("Wast (%)", formatNum(wast, 2))}
        ${row("Wast Wt", formatNum(wastWt))}

        <hr/>

        <div style="
          display:flex;
          justify-content:space-between;
          font-weight:bold;
          font-size:14px;
          margin:4px 0;
        ">
          <div style="width:38%;">Rec Weight</div>
          <div style="width:4%; text-align:center;">:</div>
          <div style="width:58%; text-align:right;">
            ${formatNum(recWeight)}
          </div>
        </div>

        <hr/>

        ${row("Order No", orderNo || "-")}
        ${row("Name", name || "-")}
        ${row("Description", description || "-")}

        <hr/>

        <div style="
          text-align:center;
          font-weight:bold;
          margin-top:6px;
        ">
          *** THANK YOU ***
        </div>

      </div>
    `;

    html2pdf().from(htmlContent).set({
      margin: [5, 5, 5, 5],
      filename: `Smith_Receivals_${voucherNo || "Receipt"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: [80, 297],
        orientation: "portrait",
      },
    }).save();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={generatePdf}
        style={{
          padding: "9px 20px",
          fontSize: 15,
          cursor: "pointer",
          borderRadius: "5px",
          backgroundColor: "#c08241ff",
          color: "white",
          border: "none",
          outline: "none",
          boxShadow: "none",
        }}
      >
        Print
      </button>
    </div>
  );
};

export default SmithReceivalsprint;
