import React from "react";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

const SmithIssuePdfDownload = ({
    voucherNo,
    voucherDate,
    smith,
    slipNo,
    particulars,
    pcs,
    orderNo,
    name,
    issueWt,
    description,
}) => {
    const formatNum = (val = 0, dec = 3) =>
        Number(val || 0).toFixed(dec).replace(/\.000$/, "");

    const row = (label, value) => `
      <div style="
        display:flex;
        justify-content:space-between;
        margin:4px 0;
      ">
        <div style="width:35%; text-align:left;">${label}</div>
        <div style="width:5%; text-align:center;">:</div>
        <div style="width:60%; text-align:right; font-weight:bold;">
          ${value}
        </div>
      </div>
    `;

    const handleDownloadPdf = () => {
        const htmlContent = `
      <div style="
        font-family: monospace;
        font-size:12px;
        // width:74mm;
        padding:10px;
        color:#000;
      ">

        <div style="text-align:center; font-size:18px; font-weight:bold;">
          SMITH ISSUE
        </div>

        <hr/>

        ${row("Voucher No", voucherNo || "")}
        ${row("Date", dayjs(voucherDate).format("DD-MMM-YYYY"))}

        <hr/>

        ${row("Smith", smith || "")}
        ${row("Slip No", slipNo || "")}

        <hr/>

        ${row("Particulars", particulars || "")}
        ${row("Pcs", formatNum(pcs, 0))}
        ${row("Order No", orderNo || "")}
        ${row("Name", name || "")}

        <hr/>

        <div style="
          display:flex;
          justify-content:space-between;
          font-size:14px;
          font-weight:bold;
          margin:6px 0;
        ">
          <div style="width:35%; text-align:left;">Issue Wt</div>
          <div style="width:5%; text-align:center;">:</div>
          <div style="width:60%; text-align:right;">
            ${formatNum(issueWt)}
          </div>
        </div>

        <hr/>

        ${row("Description", description || "")}

        <hr/>

        <div style="text-align:center; font-weight:bold;">
          *** THANK YOU ***
        </div>
      </div>
    `;

        const options = {
            margin: [5, 5, 5, 5],
            filename: `Smith_Issue_${voucherNo || "Receipt"}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: "mm",
                format: [80, 297],
                orientation: "portrait",
            },
        };

        html2pdf().from(htmlContent).set(options).save();
    };

    return (
        <div style={{ textAlign: "center" }}>
            <button
                onClick={handleDownloadPdf}
                style={{
                    padding: "8px 20px",
                    fontSize: "15px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    backgroundColor: "#c08241ff",
                    color: "white",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    borderColor:"#0a113c"
                }}
            >
                Print
            </button>
        </div>
    );
};

export default SmithIssuePdfDownload;
