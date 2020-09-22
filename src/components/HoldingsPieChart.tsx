import React, { useState, useEffect, useCallback } from 'react'
import Chart from 'react-apexcharts'
import { ERC20TOKENS } from './Erc20Tokens';
import { useSelector } from 'react-redux';
import { white } from 'color-name';
import numbro from 'numbro';

interface Props {
    address: any
}

const HoldingsPieChart: React.FC<Props> = ({address}) => {
    var colorPalette = ['#00D8B6','#008FFB',  '#FEB019', '#FF4560', '#775DD0']
    
    const web3 = useSelector((state: any) => state.user.web3)
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    
    const [balances, setTokenBalances] = useState<any>(null)
    const [series, setSeries] = useState<any>([])
    const [labels, setLabels] = useState<any>([])
    const [ethBal, setEthBalance] = useState(0)

    const getEthBalance = async () => {
        try {
            console.log("getting eth bal")
            const amount = await web3.eth.getBalance(address)
            if (amount) {
                console.log("amount")
                console.log(amount)

                const holdings =  Number(currentPrices.filter((it:any) => it.symbol === "eth")[0].current_price) * Number(web3.utils.fromWei(amount, 'ether'))
                console.log(holdings)
                setEthBalance(holdings)
                // return amount.toString()
            } else {
                return 0
            }
            } catch (ex) {
            return 0
        }
    }

    let minABI = [
        // balanceOf
        {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
        },
        // decimals
        {
        "constant":true,
        "inputs":[],
        "name":"decimals",
        "outputs":[{"name":"","type":"uint8"}],
        "type":"function"
        }
    ];
    const buildHoldingsList = () => {
        console.log(address)

        console.log(currentPrices)
        if (address) {
            // try {
            //     const amount = await web3.eth.getBalance(address)
            //     if (amount) {
            //         return amount.toString()
            //     } else {
            //         return "0"
            //     }
            //     } catch (ex) {
            //     return "0"
            //     }
            // getBalance(address).then((res) => {
            //     setBalance(res)
            // })
            const bals = [...ERC20TOKENS, ].map(async (token) => {
                // GET TOKEN contract and decimals
                const contract = new web3.eth.Contract(minABI, token.address);
                const dec = await contract.methods.decimals().call()

                // GET ERC20 Token Balance and divide by decimals
                let bal = await contract.methods.balanceOf(address).call()

                bal = bal / (10 ** dec)

                if (currentPrices.filter((it: any) => it.symbol === token.symbol.toLowerCase())[0]) {
                    const currentHoldings = currentPrices.filter((it: any) => it.symbol === token.symbol.toLowerCase())[0].current_price * bal
                    return [bal, currentHoldings, token.symbol, token.name]
                }
                return [0]
            })
            Promise.all(bals).then((finalBalances) => {
                const filteredSet = finalBalances.filter((it) => Number(it[0]) > 0 )
                if (ethBal > 0) {
                    console.log("adding Eth")
                    filteredSet.push([ethBal, ethBal, "ETH", "ETH"])
                }
                console.log(filteredSet.filter((it) => Number(it[0]) > 0 ).map((it: any) => it[2]))
                setSeries(filteredSet.filter((it) => Number(it[0]) > 0 ).map((it: any) => it[1]))
                setLabels(filteredSet.filter((it) => Number(it[0]) > 0 ).map((it: any) => it[2]))
                setTokenBalances(filteredSet.filter((it) => Number(it[0]) > 0 ))
            })
        }
    }

    useEffect(() => {
        buildHoldingsList()
    }, [address, currentPrices, ethBal])

    useEffect(() => {
        getEthBalance()
    }, [address])
    // const series = [21, 23, 19, 14, 6]
    const options = {
        chart: {
            type: 'donut',
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
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
            position: 'bottom',
            labels: {
                colors: white,
            }
        }
    }
    return <Chart options={options} series={series} type="donut" /> 
}

export default HoldingsPieChart