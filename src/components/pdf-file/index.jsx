import React from "react";
import { Page, Document, Image, StyleSheet, Text } from "@react-pdf/renderer";
import logo from "../../assets/images/logo.png";
import ReportTable from "./report-tale";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: "auto",
    marginRight: "auto",
  },
  reportTitle: {
    color: "black",
    fontSize: 20,
    textAlign: "center",
  },
});

export default function PdfFile({ items, start, end }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.logo} src={logo} />

        <Text style={styles.reportTitle}>S.I. AVICOLA</Text>

        <Text style={styles.reportTitle}>Resumen de Produccion-Mortandad</Text>
        <Text>
          Periodo:{start} ~ {end}
        </Text>
        <ReportTable items={items} />
      </Page>
    </Document>
  );
}
