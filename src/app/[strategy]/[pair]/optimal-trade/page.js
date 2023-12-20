import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import fs from "fs";

export default function Home(props) {
  const { params: { strategy, pair } } = props;
  const {data} = JSON.parse(
    fs.readFileSync(process.cwd() + `/public/${strategy}.json`)
  )[strategy]?.[pair]?.optimal_trade || [];

  const columns = ["1.5", "2", "3", "5", "6"]; // Use the column labels as they appear in your data keys
  const subColumns = [
    { label: "Gross Profit", key: "grossProfit" },
    { label: "Gross Loss", key: "grossLoss" },
    { label: "Net Profit", key: "netProfit" },
    { label: "Maximum Consecutive Loss", key: "maximumConsecutiveLoses" }, // Ensure this key matches your data
  ];

  const styles = {
    header: {
      backgroundColor: "#0070f3",
      color: "white",
      padding: "15px",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
    },
    subHeader: {
      backgroundColor: "#e6e6e6",
      padding: "15px",
      fontSize: "16px",
      fontWeight: "normal",
      textAlign: "center",
    },
    row: {
      backgroundColor: "white",
      textAlign: "center",
      padding: "12px 15px",
      fontSize: "14px",
    },
    altRow: {
      backgroundColor: "#f2f2f2",
      textAlign: "center",
      padding: "12px 15px",
      fontSize: "14px",
    },
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={styles.header} colSpan="2">
              Stop Loss
            </TableHead>
            {columns.map((column) => (
              <TableHead
                key={column + "R"}
                style={styles.header}
                colSpan={subColumns.length}
              >
                {column + "R"}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            <TableCell style={styles.subHeader} colSpan="2"></TableCell>{" "}
            {/* Empty cell for alignment */}
            {columns.flatMap((column) =>
              subColumns.map((subColumn) => (
                <TableCell
                  key={`${column}-${subColumn.key}`}
                  style={styles.subHeader}
                >
                  {subColumn.label}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={entry.name}>
              <TableCell style={index % 2 === 0 ? styles.row : styles.altRow} colSpan="2">
                {entry.name}
              </TableCell>
              {columns.flatMap((column, colIdx) =>
                subColumns.map((subColumn, subIdx) => (
                  <TableCell
                    key={`${entry.name}-${column}-${subColumn.key}`}
                    style={index % 2 === 0 ? styles.row : styles.altRow}
                  >
                    {entry.data[column]?.[subColumn.key]}
                  </TableCell>
                ))
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
