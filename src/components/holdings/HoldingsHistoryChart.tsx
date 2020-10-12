import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux';
import Firebase from '../../firebase';
import Chart from 'react-apexcharts'
import numbro from 'numbro';
import moment from 'moment';
import ClipLoader from "react-spinners/ClipLoader";

const HoldingsHistoryChart: React.FC = () => {

    const user = useSelector((state: any) => state.user.user)

    const spinner = <ClipLoader size={300}
                        color={"#123abc"}
                        loading={true} />
    const [chart, setChart] = useState<any>(spinner)

    const options = useMemo(() => {
        return {
            chart: {
                type: 'area',
                toolbar: { tools: { download: false } },
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: false,
                },
                menu: {
                    show: false
                }
            },
            colors: ['#6851ff'],
            grid: {
                show: false,
            },
            legend: {
                show: false,
                floating: true,
                labels: {
                    color: "#000000",
                }
            },
            // tooltip: {
            //     x: {
            //         formatter: function (value: any) {
            //             return new Date(value).toLocaleString()
            //         }
            //     },
            //     y: {
            //         formatter: function (value: any) {
            //             if (value < .5) {
            //                 return "$" + numbro(value).format({
            //                     mantissa: 4,
            //                 })                        }
            //             return "$" + numbro(value).format({
            //                 thousandSeparated: true,
            //                 mantissa: 2,
            //             })
            //         }
            //     },
            // },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth',
              width: 3
            },
            yaxis: {
                // opposite: true,
                labels: {
                    style: {
                        colors: '#FFFFFF',
                        fontSize: '14px'
                    },
                    align: 'right',
                    show: true,
                    formatter: function (value: any) {
                        if (value < .5) {
                            return "$" + numbro(value).format({
                                average: true,
                                mantissa: 4,
                            })                        }
                        return "$" + numbro(value).format({
                            average: true,
                            mantissa: 2,
                        })
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            xaxis: {
                labels: {
                    style: {
                        colors: '#FFFFFF' 
                    },
                    formatter: function (value: any) {
                        return moment(value).format('LT')
                    }
                },
                type: 'datetime',
                tooltip: {
                    enabled: true
                }
            },
          }
    }, [])

    const buildChart = useCallback((history) => {
        // options.labels = history.map((hist: any) => new Date(hist.lastUpdated.seconds * 1000).toLocaleString())

        const s: any = series(history)
        if (history.length > 0) {
            return (
                <Chart options={options} series={[{
                    data: s[0].data,
                    name: "Holdings History"
                }]} type="area" />
            )
        } else {
            return null
        }
    }, [options])

    const series = (history: any) => {
        let priceData = []
        if(history === undefined && history.length ) {
            let data = [{
                x: new Date(0),
                y: [0, 0, 0, 0]
            },
            {
                x: new Date(1),
                y: [0,0,0,0]
            }
            ]
            priceData.push({data});
        }
        else {
            let data: any = [];
            try {
                history.forEach((record: any) => {
                    var obj: any = {};
                    obj.x = new Date(record.lastUpdated.seconds * 1000).toLocaleString();
                    obj.y = [record.totalHoldings];
                    data.push(obj);               
                });
                priceData.push({data});
            } catch {
                let data = [{
                    x: new Date(0),
                    y: [0, 0, 0, 0]
                },
                {
                    x: new Date(1),
                    y: [0,0,0,0]
                }
                ]
                priceData.push({data});
            }
        }
        return priceData
    }

    useEffect(() => {
        if (user) {
          const holdings = Firebase.firestore().collection('dailyHoldings').doc(user.uid).collection("holdingsHistory")
          holdings.onSnapshot(querySnapshot => {
             
            const history: any = querySnapshot.docs.map(doc => {
                const data = doc.data()
                return data
            })

            setChart(buildChart(history))

            // need to create store action/reducer for holdings history
          }, err => {
              console.log(`Encountered error: ${err}`);
          });
    
        } else {
          
        }
      }, [user]);
      
    return chart
}

export default HoldingsHistoryChart