import React, { useEffect, useState, useCallback } from 'react'
import Chart from 'react-apexcharts'
import numbro from 'numbro';
import { useSelector } from 'react-redux';
import ClipLoader from "react-spinners/ClipLoader";
import { isPlatform } from '@ionic/react';


const HoldingsPieChart = ({series, labels}) => {
    // var colorPalette = ['#00D8B6','#008FFB',  '#FEB019', '#FF4560', '#775DD0']
    var colorPalette = ['#00D8B6', "#6851FF", '#008FFB', '#FEB019', '#FF4560', '#775DD0', "#A300D6", "#7D02EB", "#5653FE", "#2983FF", "#00B1F2", "#F0C808", "#93E1D8", "#FFA69E", "#DDFFF7"]
    const ethBal = useSelector((state) => state.holdings.ethBalance)
    
    const useDarkMode = useSelector((state) => state.user.useDarkMode)

    const loadingBalances = useSelector((state) => state.user.loadingBalances)

    const spinner = <ClipLoader size={300}
                                color={"#123abc"}
                                loading={true} />

    const [chart, setChart] = useState(spinner)

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
                formatter: function(value) {
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
                    color: useDarkMode ? "#FFFFFF" : "#000000",
                    value: {
                        color: useDarkMode ? "#FFFFFF" : "#000000",
                        formatter: function (w) {
                            return "$" +  numbro(w).format({
                                            thousandSeparated: true,
                                            mantissa: 2,
                                        })
                                    }
                    },
                    total: {
                        show: true,
                        label: "Total",
                        color: useDarkMode ? "#FFFFFF" : "#000000",
                        formatter: function (w) {
                            return "$" +  numbro(w.globals.seriesTotals.reduce((a, b) => {
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
        labels: [],
        legend: {
            labels: {
                colors: [useDarkMode ? "#FFFFFF" : "#000000"]
            },
            position: isPlatform("mobile") ? 'bottom' : 'left'
        }
    }
    const buildChart = useCallback((chartSeries, chartLabels, loading) => {
        options.labels = chartLabels

        if (chartSeries.length > 0) {
            return <Chart options={options} series={chartSeries} type="donut" />
        } else {
            return spinner
        }
    }, [options, spinner])

    useEffect(() => {
        setChart(buildChart(series, labels, loadingBalances))
    }, [series, labels, ethBal, loadingBalances])

    return chart

}

export default HoldingsPieChart