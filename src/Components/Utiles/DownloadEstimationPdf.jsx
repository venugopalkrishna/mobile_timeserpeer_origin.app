import React from "react";
import { Table, Button } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";

const EstimationReport = ({
  columns,
  data,
  StoneColumns,
  stonesData,
  estimationCount,
  selectedParty,
  totalNetWeight,
  totalFineGold,
  totalGrossWeight,
  totalStoneWeight,
  totalPieces,
}) => {
  const updatedColumns = columns.filter((col) => col.dataIndex !== "Actions").map((col) => ({
    ...col,
    key: col.key || col.dataIndex,
  }));

  const updatedData = data.map((item, index) => ({ ...item, SNo: index + 1 }));
  const updatedStoneColumns = StoneColumns.filter((col) => col.dataIndex !== "Actions").map((col) => ({
    ...col,
    key: col.key || col.dataIndex,
  }));
  const updatedStoneData = stonesData.map((item, index) => ({ ...item, SNo: index + 1 }));

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(14);
    doc.text("ESTIMATION", 105, 10, null, null, "center");

    // Estimation Details
    doc.setFontSize(10);
    doc.text(`ESTIMATION NO.: ${estimationCount}`, 14, 20);
    doc.text(`DATE : ${new Date().toLocaleDateString()}`, 160, 20);
    doc.text(`PARTY NAME : ${selectedParty}`, 14, 30);

    // Table Headers
    const tableColumn = ["SNo", "TAG NO", "PARTICULARS", "PCS", "GWT", "SWT", "NWT", "TOUCH", "FINE GOLD", "ACT PER"];
    let tableRows = [];
    let totalPCS = 0, totalGWT = 0;

    updatedData.forEach((item, index) => {
      totalPCS += item.PIECES;
      totalGWT += item.GWT;
      tableRows.push([
        index + 1, item.TAGNO, item.PRODNAME, item.PIECES, item.GWT, item.STONEWT, item.NETWT, item.TOUCH, item.FINALGOLD, item.ACTPER,
      ]);

      if (item.ACTGRAMS) {
        tableRows.push(["", "", { content: item.ACTGRAMS, styles: { fontStyle: "bold", halign: "left" } }, "", "", "", "", "", "", ""]);
      }
    });

    // Total Row
    tableRows.push([
      { content: "Total", styles: { fontStyle: "bold", halign: "left" } }, "", "", 
      totalPCS.toString(), totalGWT.toFixed(3), "", "", "", "", ""
    ]);

    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200] }, // Gray header
      bodyStyles: { textColor: [0, 0, 0] },
    });

    // Stone Table
    const stoneTableColumn = updatedStoneColumns.map((col) => col.title);
    const stoneTableRows = updatedStoneData.map((item) => updatedStoneColumns.map((col) => item[col.dataIndex]));

    stoneTableRows.push(["", totalPieces, totalStoneWeight.toFixed(3), "", ""]);

    const firstTableY = doc.lastAutoTable.finalY + 10;

    doc.autoTable({
      startY: firstTableY,
      head: [stoneTableColumn],
      body: stoneTableRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200] },
    });

    // Summary Section
    const summaryY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text("Net Weight:", 140, summaryY + 10);
    doc.text(`${totalNetWeight.toFixed(3)}`, 180, summaryY + 10, { align: "right" });

    doc.setFillColor(200, 200, 200);
    doc.rect(138, summaryY + 15, 60, 7, "F");
    doc.setFont(undefined, "bold");
    doc.text("Fine Gold:", 140, summaryY + 20);
    doc.text(`${totalFineGold.toFixed(3)}`, 180, summaryY + 20, { align: "right" });

    doc.setFont(undefined, "normal");
    doc.text("Making 0 /g:", 140, summaryY + 30);
    doc.text("0.00", 180, summaryY + 30, { align: "right" });
    doc.text("Rodium Charges:", 140, summaryY + 40);
    doc.text("0.00", 180, summaryY + 40, { align: "right" });
    doc.text("Stone Cost:", 140, summaryY + 50);
    doc.text("0.00", 180, summaryY + 50, { align: "right" });

    doc.setFillColor(200, 200, 200);
    doc.rect(138, summaryY + 55, 60, 7, "F");
    doc.setFont(undefined, "bold");
    doc.text("Total Cash:", 140, summaryY + 60);
    doc.text("0.00", 180, summaryY + 60, { align: "right" });

    // Save PDF
    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, "Estimation_Report.pdf");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Button type="primary" icon={<FilePdfOutlined />} onClick={handleDownloadPDF}>
        Download PDF
      </Button>
    </div>
  );
};

export default EstimationReport;
