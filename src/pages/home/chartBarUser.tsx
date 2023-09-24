import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  indexAxis: "y" as const,
  plugins: {
    legend: {
        display: false,
    },

  },
};



export function ChartBarUser({listLevelUser}: {listLevelUser: {type: string, value: number}[]}) {
  const labels:string[] = [];
  const dataChart:number[] =  []
  listLevelUser.map((item) => {
    labels.push(item.type)
    dataChart.push(item.value)
  })
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: dataChart,
        backgroundColor: [
          "#3e95cd",
          "#8e5ea2",
          "#3cba9f",
          "#e8c3b9",
          "#c45850",
        ],
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
