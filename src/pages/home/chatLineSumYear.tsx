import { Order } from 'src/interface'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

const monthAvailable = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];



export function ChatLineSumYear({dataThisYear}: { dataThisYear: Order[] }) {
  const dataFetch: {month: string, value: number }[] = []

  monthAvailable.map((e, i) => {
    const valueOfMonth = dataThisYear.filter((dt) => (new Date(dt.orderDate).getMonth() + 1 === i + 1))
    .reduce((sum, order:Order) => (sum = sum + order.total), 0)
    console.log('dfdfdfdf', valueOfMonth)
    dataFetch.push({
      month:e,
      value: valueOfMonth
    })
  })
  const labels:string[] = []
  const datachart:number[] = []

  dataFetch.map((e) => {
    labels.push(e.month)
    datachart.push(e.value)
  })
  const data = {
    labels,
    datasets: [
      {
        tension: 0.4,
        label: 'Price',
        data: datachart,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: "#FA8072",
        borderWidth: 3,
      },
    ],
  };
  return <Line options={options} data={data} />;
}
