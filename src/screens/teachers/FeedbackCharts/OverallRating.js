import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Chart from "react-apexcharts";


const OverallRating = ({ data }) => {

  const [state, setState] = useState(
    {
      series: data,
      options: {
        chart: {
          width: '100%',
          type: 'pie',
        },
        labels: ["Filled", "Not Filled"],
        colors: ['#3E465E', "#8694C1"],
        theme: {
          monochrome: {
            enabled: false,
            color: '#3E465E'
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -30
            }
          }
        },
        title: {
          text: ""
        },
        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name, val.toFixed(1) + '%']
          }
        },
        legend: {
          show: true,
          position: 'bottom',
          onItemHover: {
            highlightDataSeries: true
          },
          onItemClick: {
            toggleDataSeries: true
          },
        }
      },

    }
  )

  // const state = {
  //   series: [44, 55, 41, 17, 15],
  //   options: {
  //     chart: {
  //       width: 380,
  //       type: 'donut',
  //     },
  //     plotOptions: {
  //       pie: {
  //         startAngle: -90,
  //         endAngle: 270
  //       }
  //     },
  //     dataLabels: {
  //       enabled: false
  //     },
  //     fill: {
  //       type: 'gradient',
  //     },
  //     legend: {
  //       formatter: function (val, opts) {
  //         return val + " - " + opts.w.globals.series[opts.seriesIndex]
  //       }
  //     },
  //     title: {
  //       text: 'Gradient Donut with custom Start-angle'
  //     },
  //     responsive: [{
  //       breakpoint: 480,
  //       options: {
  //         chart: {
  //           width: 200
  //         },
  //         legend: {
  //           position: 'bottom'
  //         }
  //       }
  //     }]
  //   },
  // }

  return (
    <div className="mixed-chart">
      <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />
    </div>
  )
}

export default OverallRating