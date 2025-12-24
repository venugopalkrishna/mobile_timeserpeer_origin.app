import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

export const EstimationPdfDownload = (
  estNo,
  selectEstimationNo,
  selectedParty,
  tableData = [],
  stoneMainData = [],
  totalPieces = 0,
  totalGrossWeight = 0,
  totalStoneWeight = 0,
  totalNetWeight = 0,
  totalFineGold = 0,
  totalStoneCost = 0,
  rodiumChargeValue = 0,
  cashBalanceValue = 0
) => {
  const formatNum = (val = 0, dec = 2) =>
    Number(val || 0)
      .toFixed(dec)
      .replace(/\.00$/, "");

  // build GST summary totals (if needed)

  // Prepare items HTML rows consistent with your printed layout
  const itemsHtml = tableData
    .map((item, index) => {
      const sno = index + 1;
      const code = (item.TAGNO || "").substring(0, 12);
      const qty = item.stock ?? item.QTY ?? 1;
      const rate = Number(item.CPrice ?? 0);
      const purity = item.PREFIX;
      const gross = Number(item.GROSSWEIGHT ?? 0)?.toFixed(3);
      const stone = Number(item.STONEWT ?? 0)?.toFixed(3);
      const net = Number(item.NETWT ?? 0)?.toFixed(3);
      const touch = Number(item.TOUCH ?? 0);
      const fine = Number(item.FINALGOLD ?? 0)?.toFixed(3);
      const discPercent = Number(item.Disper ?? 0);
      // offer = selling price per unit (used in printReceipt amount calculation)
      const offer = Number(item.offer ?? item.SellPrice ?? rate);
      const amount = qty * offer;

      // product extra line (HSN, SMCODE, GST)
      const prodLine = `HSN:${item.HSNCODE || "-"}  SMCODE:${
        item?.SMCODE || "-"
      }  GST:${item?.GST || 0}%`;

      // MRP and OFFER line
      const mrp = Number(item.CPrice ?? 0).toFixed(2);
      const offerStr = (item?.offer ?? offer).toFixed(2);

      // Limit product name width visually
      const productName = (item.PRODNAME || "").substring(0, 12);

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

      return `
        <div class="item-block">
          <div class="item-top">
            <div class="item-left"><b>${sno}</b> &nbsp; <span class="barcode">${productName}</span></div>
            <div class="item-right">
              <span class="qty">${formatNum(gross, 3)}</span>
              <span class="rate">${formatNum(stone, 3)}</span>
              <span class="disc">${formatNum(net, 3)}</span>
            </div>
          </div>

          <div class="item-name">
  <span class="item-left">
    ${purity}-${code} &nbsp; (${touch}%)
  </span>
  <span class="item-right1">
    FINE: ${formatNum(fine, 3)}
  </span>
</div>
<div class="item-name1">${cleanedActGrams}</div>
        </div>
      `;
    })
    .join("\n");

  // build GST table rows

  // HTML template matching thermal receipt layout (80mm)
  const htmlContent = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <title>Tax Invoice</title>
      <style>
        /* Receipt style tuned for 80mm width */
           body {
          font-family: monospace;
          font-size: 12px;
          width: 90mm;
          margin: 0 auto;
          padding: 6px;
          color: #000;
        }
        .center { text-align: center; }
        .logo { display:block; margin: 0 auto 6px auto; max-width: 180px; max-height:120px; object-fit: contain; }
        .logo { display:block; margin: 0 auto 6px auto; max-width: 250px; max-height:150px; object-fit: contain; }
        .store-name { font-size: 18px; font-weight: bold; letter-spacing: 1px; }
        .small { font-size: 10px; }
        .divider { border-top: 1.5px dashed #000; margin:6px 0; }
        .section { margin-bottom: 4px; }
        .info-row { display:flex; justify-content:space-between; font-weight: bold; font-size: 11px; }
        .info-row1 { display:flex; flex-direction:column; }
        .info-left { width: 30%; }
        .info-right { width: 70%; text-align:right; }
        .info-left1 { width: 100%; font-weight: bold; font-size: 11px;}

        /* Items header */
        .items-header { display:flex; font-weight:bold; margin-top:4px; }
        .h-left { width: 45%; } /* SNO BARCODE */
        .h-right { width: 55%; text-align:right; display:flex; justify-content:space-between; gap:6px; }

        .item-block { margin-top:6px; }
        .item-top { display:flex; justify-content:space-between; align-items:flex-start; }
        .item-left { width: 52%; word-break: break-word; font-weight: bold; }
        .item-right { width: 48%; text-align:right; display:flex; justify-content:space-between; gap:6px; font-variant-numeric: tabular-nums; }
        .item-name1 { font-size:9px; margin-top:4px; margin-left:10px; }
        .item-name {
  font-size: 10px;
  margin-top: 4px;
  margin-left: 30px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* or fixed width if needed */
}

.item-right1 {
  text-align: right;
  margin-right: 30px;
}
        .item-sub { font-size:11px; color:#000; margin-top:2px; }

       .summary {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
}

/* LEFT SIDE */
.summary-left {
  width: 45%;
  display: flex;
  justify-content: flex-start;
}

.summary-left .label {
  width: 40%;
  text-align: left;
}

.summary-left .value {
  width: 30%;
  text-align: left;
}

/* RIGHT SIDE */
.summary-right {
  width: 55%;
}

.summary-right-row {
  display: flex;
  justify-content: space-between;
  margin: 2px 0;
}

.summary-right-label {
  width: 60%;
  text-align: right;
}
  .row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-family: monospace;
      margin: 3px 0;
    }
      .col {
      width: 48%;
    }

    .tot-row {
      display: flex;
      justify-content: space-between;
    }
    .tot-label {
      min-width: 63px;
      text-align: left;
    }
    .tot-colon {
      padding: 0 3px;
    }
    .tot-value {
      text-align: right;
      flex: 1;
    }
      .data-row {
          display: flex;
          font-family: "Courier New", monospace;
          font-size: 14px;
          padding: 2px 0;
        }
          .data-colon {
          flex: 0 0 10px;
          text-align: center;
        }
          .total-label {
          width: 130px;
          text-align: left;
          font-size: 25px;
          font-weight: bold;
        }
          .total-value {
          flex: 1;
          text-align: right;
          min-width: 50px;
          font-size: 25px;
          font-weight: bold;
        }

.summary-right-colon {
  width: 5%;
  text-align: center;
}

.summary-right-value {
  width: 35%;
  text-align: right;
}

.net-bold {
  font-weight: bold;
  font-size: 14px;
}


        /* GST summary table */
        .gst-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-top:6px; }
        .gst-table th, .gst-table td { padding: 4px 4px; border-bottom: none; text-align: right; font-size:8px; }
        .gst-table th { text-align:left; font-weight:bold; }
        .gcell { text-align:right; min-width: 40px; font-weight: bold; font-size:5px; }

        /* Terms */
.terms {
    font-size: 8px;
    margin: 0;
    padding: 0;
    font-weight: bold;
  }

  .terms div {
    counter-increment: item;
    display: flex;
    gap: 4px;
    padding: 0;
  }


        .footer { text-align:center; margin-top:8px; font-size:9px; font-weight:bold; margin-bottom:8px; }

        /* small helpers */
        .muted { font-size: 12px; font-weight: bold; color: #000; }
      </style>
    </head>
    <body>
      <!-- Logo -->

      <!-- Store name & address -->
      <div class="center store-name">ESTIMATION</div>

      <div class="divider"></div>

      <!-- Invoice info -->
      <div class="section">
        <div class="info-row">
          <div class="info-left">EST NO : ${
            selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : estNo ?? "-"
          }</div>
          <div class="info-right">DATE : ${dayjs().format("DD-MMM-YYYY")}</div>
        </div>
        <div class="info-row1" style="margin-top:4px;">
          <div class="info-left1">CUST NAME : ${selectedParty || "-"}</div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Items header -->
      <div class="items-header">
        <div class="h-left">SNO ITEM</div>
        <div class="h-right"><span>GROSS.WT</span><span>STONE.WT</span><span>NET.WT</span></div>
      </div>
      <div class="divider"></div>

      <!-- Items -->
      ${itemsHtml || "<div class='muted'>No items</div>"}

      <div class="divider"></div>

     <div class="row">
        <div class="col">
        <div class="tot-row"><span class="tot-label">Gross.Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalGrossWeight,
          3
        )}</span></div>
        <div class="tot-row"><span class="tot-label">Stone.Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalStoneWeight,
          3
        )}</span></div>
        <div class="tot-row"><span class="tot-label">Net.Wt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalNetWeight,
          3
        )}</span></div>
        </div>

        <div class="col">
        <div class="tot-row"><span class="tot-label">Tot Pcs</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalPieces,
          0
        )}</span></div>
        <div class="tot-row"><span class="tot-label">Stone.Amt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
          totalStoneCost
        )}</span></div>
         <div class="tot-row"><span class="tot-label">Other.Amt</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
           rodiumChargeValue,
           0
         )}</span></div>
        </div>
    </div>


      <div class="divider"></div>
      <div class="row bold" style="font-size:16px; font-weight:bold;">
      <div class="col">
      <div class="tot-row"><span class="tot-label">FINE</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
        totalFineGold,
        3
      )}</span></div>
      </div>
      <div class="col">
      <div class="tot-row"><span class="tot-label">CASH</span><span class="tot-colon">:</span><span class="tot-value">${formatNum(
        cashBalanceValue,
        0
      )}</span></div>
      </div>
    </div>
    </body>
  </html>
  `;

  // html2pdf options tuned for narrow thermal receipt
  const opt = {
    margin: [0, 0, 0, 0],
    filename: `Estimation_${
      selectEstimationNo ? selectEstimationNo?.ESTIMATIONNO : estNo || "bill"
    }.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: [90, 297], orientation: "portrait" },
  };

  // start download
  html2pdf().from(htmlContent).set(opt).save();
};
