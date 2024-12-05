import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const TopBoxPlot = ({ data }) => {
  const [state, setState] = useState({
    series: [
      {
        type: 'boxPlot',
        data: [
          {
            x: 'Box Plot (Average Rating)',
            y: data,
          },

        ]
      }
    ],
    options: {
      chart: {
        type: 'boxPlot',
        height: 350
      },
      colors: ["#333333"],
      title: {
        text: '',
        align: 'left'
      },
      plotOptions: {
        boxPlot: {
          colors: {
            upper: '#8694C1',
            lower: '#3E465E'
          }
        }
      }
    },
  })
  return (
    <div id="chart">
      <ReactApexChart options={state.options} series={state.series} type="boxPlot" height={350} />
    </div>
  )
}

export default TopBoxPlot