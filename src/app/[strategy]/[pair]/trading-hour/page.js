import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import fs from "fs";

const formatNumberToString = (num, minChars) => {
  return num.toString().length < minChars
   ? formatNumberToString(`0${num}`, minChars)
   : num.toString()
}

export default function Home(props) {
  return <>
    <h1 className="text-4xl text-center font-extrabold dark:text-white">Long</h1>
    <TableComponent props={props} />
    <h1 className="text-4xl text-center font-extrabold dark:text-white">Short</h1>
    <TableComponent props={props} />
  </>

}

const TableComponent = ({ props }) => {
  const { params: { strategy, pair } } = props;
  const { data } = JSON.parse(
    fs.readFileSync(process.cwd() + `/public/${strategy}.json`)
  )[strategy]?.[pair].trading_hour || [];
  // const data = Array(24).fill(0).map((_, i) => {
  //   const name = formatNumberToString(i, 4);
  //   const name2 = formatNumberToString(i+1, 4);
  //   return {
  //     name: `${name} to ${name2}`,
  //     data: {
  //       1.5: {
  //         tradeCount: 12,
  //         netProfit: 24,
  //       },
  //       2: {
  //         tradeCount: 112212,
  //         netProfit: 12354,
  //       },
  //     },
  //   }
  // })
  // const data = [
  //   {
  //     name: "0000 to 0100",
  //     data: {
  //       1.5: {
  //         tradeCount: 12,
  //         netProfit: 24,
  //       },
  //       2: {
  //         tradeCount: 112212,
  //         netProfit: 12354,
  //       },
  //     },
  //   },
  //   {
  //     name: "0100 to 0200",
  //     data: {
  //       1.5: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //       2: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //     },
  //   },
  //   {
  //     name: "0200 to 0300",
  //     data: {
  //       1.5: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //       2: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //     },
  //   },
  //   {
  //     name: "0300 to 0400",
  //     data: {
  //       1.5: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //       2: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //     },
  //   },
  //   {
  //     name: "0400 to 0500",
  //     data: {
  //       1.5: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //       2: {
  //         tradeCount: 12,
  //         netProfit: 12,
  //       },
  //     },
  //   },
  // ];
  const columns = ["1.5", "2", "3", "5"];
  const subHeaders = ["Trade Count", "Net Profit"];

  const styles = {
    tableHead: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    subHeader: {
      backgroundColor: "#e2e3e5",
      color: "black",
      padding: "10px",
      fontSize: "16px",
      fontWeight: "bold",
    },
    tableRow: {
      borderBottom: "1px solid #dee2e6",
    },
    tableCell: {
      padding: "10px",
      textAlign: "center",
      fontSize: "14px",
    },
    timeCell: {
      backgroundColor: "#f8f9fa",
      fontWeight: "bold",
    },
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={styles.tableHead}>UTC-2</TableHead>
          {columns.map((column) => (
            <TableHead
              key={column}
              className="text-center"
              style={styles.tableHead}
              colSpan={subHeaders.length}
            >
              {column}R
            </TableHead>
          ))}
        </TableRow>
        <TableRow>
        <TableCell style={styles.subHeader}></TableCell>{" "}
          {columns.map((column) =>
            subHeaders.map((subHeader) => (
              <TableCell
                key={`${column}-${subHeader}`}
                style={styles.subHeader}
              >
                {subHeader}
              </TableCell>
            ))
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ name, data }, rowIndex) => (
          <TableRow key={name} style={styles.tableRow}>
            <TableCell style={{ ...styles.tableCell, ...styles.timeCell }}>
              {name}
            </TableCell>
            {columns.flatMap((column) =>
              subHeaders.map((_, subIndex) => (
                <TableCell
                  key={`${rowIndex}-${column}-${subIndex}`}
                  style={styles.tableCell}
                >
                  {subIndex === 0
                    ? data[column]?.tradeCount
                    : data[column]?.netProfit}
                </TableCell>
              ))
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
