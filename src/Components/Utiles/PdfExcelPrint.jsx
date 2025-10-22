import React from "react";
import { Button } from "antd";
import {
  PrinterOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import * as html2pdf from "html2pdf.js";

const PdfExcelPrint = ({ data, columns, fileName }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print Table</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(`
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid black; padding: 8px; }
      th { background-color: #f2f2f2; }
    `);
    printWindow.document.write("</style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write("<table><thead><tr>");

    // Headers
    columns.forEach((col) => {
      const align = col.align || "left";
      printWindow.document.write(
        `<th style="text-align: ${align}">${col.title}</th>`
      );
    });

    printWindow.document.write("</tr></thead><tbody>");

    // Data rows
    data.forEach((item) => {
      printWindow.document.write("<tr>");
      columns.forEach((col) => {
        const value = item[col.dataIndex] ?? "";
        const align = col.align || "left";
        printWindow.document.write(
          `<td style="text-align: ${align}">${value}</td>`
        );
      });
      printWindow.document.write("</tr>");
    });

    printWindow.document.write("</tbody></table>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  //   const handlePDFWithPreview = () => {
  //     const doc = new jsPDF();

  //     const tableColumn = columns.map((col) => col.title);
  //     const tableRows = data.map((item) =>
  //       columns.map((col) => {
  //         const value = item[col.dataIndex];
  //         return typeof value === "number" ? value : value ?? "";
  //       })
  //     );

  //     // Column alignment
  //     const columnStyles = {};
  //     columns.forEach((col, index) => {
  //       const align =
  //         col.align === "right"
  //           ? "right"
  //           : col.align === "center"
  //           ? "center"
  //           : "left";
  //       columnStyles[index] = { halign: align };
  //     });

  //     doc.autoTable({
  //       head: [tableColumn],
  //       body: tableRows,
  //       columnStyles,
  //       styles: { fontSize: 6, cellPadding: 1 },
  //       headStyles: {
  //         fillColor: [211, 211, 211],
  //         textColor: [0, 0, 0],
  //         fontStyle: "normal",
  //         lineWidth: 0.1,
  //         lineColor: [211, 211, 211],
  //       },
  //       theme: "grid",
  //     });

  //     const pdfBlob = doc.output("blob");
  //     const pdfUrl = URL.createObjectURL(pdfBlob);
  //     const previewWindow = window.open(pdfUrl, "_blank");

  //     previewWindow.document.write(
  //       "<html><head><title>PDF Preview</title></head><body>"
  //     );
  //     previewWindow.document.write(
  //       `<iframe src="${pdfUrl}" width="100%" height="100%" style="border:none;"></iframe>`
  //     );
  //     previewWindow.document.write(
  //       '<button id="savePdf" style="position:fixed;top:10px;right:10px;">Save PDF</button>'
  //     );
  //     previewWindow.document.write("</body></html>");
  //     previewWindow.document.close();

  //     previewWindow.onload = () => {
  //       previewWindow.document.getElementById("savePdf").onclick = () => {
  //         saveAs(pdfBlob, `${fileName}.pdf`);
  //       };
  //     };
  //   };

  const handlePDFWithPreview = () => {
    const container = document.createElement("div");

    container.innerHTML = `
    <div style="font-size: 10px;">
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            ${columns
              .map(
                (col) =>
                  `<th style="border: 1px solid #ccc; padding: 4px; text-align:${
                    col.align || "left"
                  }; background-color: #d3d3d3;">
                    ${col.title}
                  </th>`
              )
              .join("")}
          </tr>
        </thead>
        <tbody>
          ${data
            .map((item) => {
              return `
                <tr>
                  ${columns
                    .map((col) => {
                      const value = item[col.dataIndex];
                      return `<td style="border: 1px solid #ccc; padding: 4px; text-align:${
                        col.align || "left"
                      };">
                        ${typeof value === "number" ? value : value ?? ""}
                      </td>`;
                    })
                    .join("")}
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;

    html2pdf()
      .set({
        margin: 10,
        filename: `${fileName}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save();
  };

  const handleExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(fileName);

    // Set headers with column width
    worksheet.columns = columns.map((col) => ({
      header: col.title,
      key: col.dataIndex,
      width: 25,
    }));

    // Add rows and apply alignment
    data.forEach((item) => {
      const row = worksheet.addRow(item);
      columns.forEach((col, colIndex) => {
        const cell = row.getCell(colIndex + 1);
        const align =
          col.align === "right"
            ? "right"
            : col.align === "center"
            ? "center"
            : "left";
        cell.alignment = { horizontal: align };

        if (typeof item[col.dataIndex] === "number") {
          cell.value = Number(item[col.dataIndex]);
        }
      });
    });

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D3D3D3" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Style all data cells
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  };

  return (
    <div>
      <Button
        icon={<PrinterOutlined style={{ color: "#fff" }} />}
        onClick={handlePrint}
        style={{
          backgroundColor: "#FF9900",
          color: "#fff",
          border: "none",
          marginRight: 8,
        }}
      >
        Print
      </Button>
      <Button
        icon={<FilePdfOutlined style={{ color: "#fff" }} />}
        onClick={handlePDFWithPreview}
        style={{
          backgroundColor: "#FF0955",
          color: "#fff",
          border: "none",
          marginRight: 8,
        }}
      >
        PDF
      </Button>
      {/* <Button
        icon={<FileExcelOutlined style={{ color: "#fff" }} />}
        onClick={handleExcel}
        style={{
          backgroundColor: "#FF9900",
          color: "#fff",
          border: "none",
          marginRight: 8,
        }}
      >
        Excel
      </Button> */}
    </div>
  );
};

export default PdfExcelPrint;
