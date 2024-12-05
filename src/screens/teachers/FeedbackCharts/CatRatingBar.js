import React from 'react';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const CatRatingBar = ({ data, index = 0, totalRes = 1, barColor = '#3E465E' }) => {

  const [mainData, setMainData] = useState(data[index]);
  // console.log(mainData);

  const getKeys = () => {
    const arr = Object.keys(mainData.distinctCount);
    // let newArr = []
    // for (let i = 0; i < arr.length; i++) {
    //   newArr.push(arr[i] + );
    // }
    // console.log(mainData.distinctCount, arr, newArr);
    return arr;
  }

  const getValues = () => {
    const arr = Object.values(mainData.distinctCount);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = parseFloat(((arr[i] / totalRes) * 100).toFixed(2));
    }
    // console.log(arr);
    return arr;
  }

  const [state, setState] = useState({
    series: [{
      name: 'Total Students',
      data: mainData !== undefined || mainData !== null ? getValues() : [1.3]
      // data: Object.values(data),
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: [barColor],
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"],
        }
      },
      grid: {
        show: true,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'front',

      },
      xaxis: {
        // categories: Object.keys(data),
        categories: mainData !== undefined ? getKeys() : ["0", "1", "2", "3", "4", "5"],
        position: 'bottom',
        style: {
          fontWeight: 'bold',
          cssClass: 'apexcharts-xaxis-label',
          fontFamily: 'Poppins',
        },
        axisBorder: {
          show: true,
          color: '#78909C',
          height: 1,
          width: '100%',
          offsetX: 0,
          offsetY: 0
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#78909C',
          height: 6,
          offsetX: 0,
          offsetY: 0
        },
        title: {
          text: 'Stars',
          offsetX: 0,
          offsetY: 0,
          style: {
            // color: undefined,
            fontWeight: 600,
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
          },
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        max: 100,
        forceNiceScale: true,
        axisBorder: {
          show: true,
          color: '#78909C',
          offsetX: 0,
          offsetY: 0
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#78909C',
          width: 6,
          offsetX: 0,
          offsetY: 0
        },
        labels: {
          show: true,
          align: 'right',
          minWidth: 0,
          maxWidth: 160,
          formatter: function (val) {
            return (Math.round(val * totalRes / 100));
          }
        },
        crosshairs: {
          show: true,
          position: 'back',
          stroke: {
            color: '#b6b6b6',
            width: 1,
            dashArray: 0,
          },
        },
        title: {
          text: 'No. of Students',
          offsetX: 0,
          offsetY: 0,
          style: {
            // color: undefined,
            fontWeight: 600,
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
          },
        },
        // tooltip: {
        //   enabled: true,
        //   offsetX: 0,
        // },
      },
      // title: {
      //   text: 'Star Rating',
      //   floating: false,
      //   // offsetY: 333,
      //   align: 'center',
      //   style: {
      //     color: '#444',
      //     fontWeight: 'bold',
      //   }
      // }
    },
  });
  return (
    <>
      {data !== null && data !== undefined &&
        <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
      }
    </>
  )
}

export default CatRatingBar