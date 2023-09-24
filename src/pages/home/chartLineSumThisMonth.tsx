import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Order } from 'src/interface'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const
    }
  }
}





function getDaysInMonthUTC(month: number, year: number) {
  const date = new Date(Date.UTC(year, month, 1))
  const days = []
  while (date.getUTCMonth() === month) {
    days.push(new Date(date).getDate())
    date.setUTCDate(date.getUTCDate() + 1)
  }

  return days
}

export function ChatLineSumThisMonth({ dataThisMonth }: { dataThisMonth: Order[] }) {
  const date = new Date()
  const days = getDaysInMonthUTC(date.getMonth(), date.getFullYear())
  const dateFetch: {day: string, value: number}[] = []

  days.map((e) => {
    const valueOfDate = dataThisMonth
    .filter((dt) => new Date(dt.orderDate).getDate() === e)
    .reduce((sum, order) => (sum = sum + order.total), 0)
    dateFetch.push({
      day: e + '/' + (date.getMonth() + 1),
      value: valueOfDate
    })
  })
const labels: string[] = []
const dataChart: number[] = []
dateFetch.map((e) => {
  labels.push(e.day)
  dataChart.push(e.value)
})
const data = {
  labels,
  datasets: [
    {
      label: 'TOTAL',
      data: dataChart,
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ]
    }
  ]
}
  return <Line options={options} data={data} />
}
