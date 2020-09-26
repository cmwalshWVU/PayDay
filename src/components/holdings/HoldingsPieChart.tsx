import React, { useEffect } from 'react'
import Chart from 'react-apexcharts'
import numbro from 'numbro';

interface Props {
    series: number[]
    labels: string[]
}

const HoldingsPieChart: React.FC<Props> = ({series, labels}) => {
    // var colorPalette = ['#00D8B6','#008FFB',  '#FEB019', '#FF4560', '#775DD0']
    var colorPalette = ['#00D8B6','#008FFB', '#FEB019', '#FF4560', '#775DD0', "#A300D6", "#7D02EB", "#5653FE", "#2983FF", "#00B1F2", "#6851FF", "#F0C808", "#93E1D8", "#FFA69E", "#DDFFF7"]
    useEffect(() => {
        console.log("Updating")
        console.log(series)
        console.log(labels)
    }, [series, labels])
    

    const options = {
        chart: {
            type: 'donut',
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            labels: {
                colors: ["#FFFFFF"]
            },
            y: {
                formatter: function(value: any) {
                    const amount = numbro(value).format({
                        thousandSeparated: true,
                        mantissa: 2,
                    })
                    return "$" + amount
                }
            }
        },
        plotOptions: {
          pie: {
            donut: {
                labels: {
                    show: true,
                    color: "#FFFFFF",
                    value: {
                        color: "#FFFFFF",
                        formatter: function (w: any) {
                            console.log(w)
                            return "$" +  numbro(w).format({
                                            thousandSeparated: true,
                                            mantissa: 2,
                                        })
                                    }
                    },
                    total: {
                        show: true,
                        label: "Total",
                        color: "#FFFFFF",
                        formatter: function (w: any) {
                            return "$" +  numbro(w.globals.seriesTotals.reduce((a: any, b: any) => {
                                return a + b
                                }, 0)).format({
                                thousandSeparated: true,
                                mantissa: 2,
                            })
                        }
                    },
                },
                size: '75%',
            },
            offset: 20
          },
          stroke: {
            colors: undefined
          }
        },
        colors: colorPalette,
        labels: labels,
        legend: {
            labels: {
                colors: ["#FFFFFF"]
            },
            position: 'bottom'
        }
    }
    return <Chart options={options} series={series} type="donut" /> 
}

export default HoldingsPieChart