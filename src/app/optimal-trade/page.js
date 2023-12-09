import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  const data = [
    {
      name: "Fixed SL",
      data: {
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
      },
    },
    {
      name: "Trailing SL",
      data: {
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
      },
    },
    {
      name: "Breakeven SL",
      data: {
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
      },
    },
  ];
  const columns = ["1.5", "2", "3", "5"];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          {columns.map((column) => (
            <TableHead className="text-center" colSpan={2}>
              {column}R
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(({ name, data }) => (
          <TableRow>
            <TableCell>{name}</TableCell>
            {columns.map((column) => (
              <>
                <TableCell className="text-center">
                  <div>{data[column]?.grossProfit}</div>
                  <div>{data[column]?.grossProfit}</div>
                </TableCell>
                <TableCell className="text-center">
                  <div>{data[column]?.netProfit}</div>
                  <div>{data[column]?.maximumConsecutiveLoses}</div>
                </TableCell>
              </>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
