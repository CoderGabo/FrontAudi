import { PDFViewer } from "@react-pdf/renderer";
import React from "react";
import PdfFile from "../components/pdf-file";
import { useLocation } from "react-router-dom";

export default function PdfReport() {
  const location = useLocation();
  const { items, start, end } = location.state;
  return (
    <PDFViewer showToolbar>
      <PdfFile items={items} start={start} end={end} />
    </PDFViewer>
  );
}
