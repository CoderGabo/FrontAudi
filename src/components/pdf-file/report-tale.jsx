import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#ddd";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
    textAlign: "center",
  },
  galpon: {
    width: "60%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  mort: {
    width: "20%",
  },
  row: {
    flexDirection: "row",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    alignItems: "center",
    height: 24,
    fontStyle: "bold",
  },
  galponItem: {
    width: "60%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qtyItem: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: "right",
    paddingRight: 8,
  },
  mortItem: {
    width: "20%",
    textAlign: "right",
    paddingRight: 8,
  },
  mortalidad: {
    width: "80%",
    textAlign: "left",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
});
export default function ReportTable({ items }) {
  const mort = items
    .map((item) => parseInt(item.mortalidad))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const total = items
    .map((item) => parseInt(item.cantidad))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  let porc = 0;
  if (total !== 0) porc = (mort / total) * 100;

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.galpon}>GALPON</Text>
        <Text style={styles.qty}>CANTIDAD</Text>
        <Text style={styles.mort}>MORTALIDAD</Text>
      </View>
      {items.map((item) => (
        <View style={styles.row} key={item.id_galpon.toString()}>
          <Text style={styles.galponItem}>Galpon {item.id_galpon}</Text>
          <Text style={styles.qtyItem}>{item.cantidad}</Text>
          <Text style={styles.mortItem}>
            {(item.mortalidad / item.cantidad) * 100}% ({item.mortalidad})
          </Text>
        </View>
      ))}
      <View style={styles.row}>
        <Text style={styles.mortalidad}>MORTALIDAD</Text>
        <Text style={styles.mortItem}>
          {porc}% ({mort})
        </Text>
      </View>
    </>
  );
}
