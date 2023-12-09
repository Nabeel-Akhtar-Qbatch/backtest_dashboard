import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const data = {
    1.5: {
      grossProfit: 12,
      grossLoss: 12,
      netProfit: 12,
      totalTrades: 12,
      longPositionNetResult: 12,
      shortPositionNetResult: 12,
      maximumConsecutiveWins: 12,
      maximumConsecutiveLoses: 12,
      relativeDropdown: 12,
    },
    2: {
      grossProfit: 12,
      grossLoss: 12,
      netProfit: 12,
      totalTrades: 12,
      longPositionNetResult: 12,
      shortPositionNetResult: 12,
      maximumConsecutiveWins: 12,
      maximumConsecutiveLoses: 12,
      relativeDropdown: 12,
    },
  };

  const columns = ["1.5", "2", "3", "5"];
  const rows = [
    { name: "Gross Profit", key: "grossProfit" },
    { name: "Gross Loss", key: "grossLoss" },
    { name: "Net Profit", key: "netProfit" },
    { name: "Total Trades", key: "totalTrades" },
    { name: "Long Position Net Result", key: "longPositionNetResult" },
    { name: "Short Positions Net Result", key: "shortPositionNetResult" },
    { name: "Maximum Consecutive Wins", key: "maximumConsecutiveWins" },
    { name: "Maximum Consecutive Wins", key: "maximumConsecutiveLoses" },
    { name: "Relative Drawdown", key: "relativeDropdown" },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>

          {columns.map((column) => (
            <TableHead>{column}R</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ name, key }) => (
          <TableRow>
            <TableCell>{name}</TableCell>
            {columns.map((column) => (
              <TableCell>{data[column]?.[key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
