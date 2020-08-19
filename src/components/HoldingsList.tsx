import { useState, useEffect } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { IonList, IonItem, IonAvatar, IonLabel, IonGrid, IonRow, IonCol, IonCard } from "@ionic/react";
import numbro from "numbro";
import "./HoldingsList.scss"
import { isPlatform } from "@ionic/core";

interface Props {
    balances: any,
    balance: any
}

const HoldingsList: React.FC<Props> = ({balance, balances}) => {

    // const [list, setList] = useState([])
    // const holdingsList = useSelector((state: any) => state.coinbase.holdingsList)
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    const web3 = useSelector((state: any) => state.user.web3)

    const [list, setList] = useState(null)

    useEffect(() => {
        setList(buildList())
    }, [balances, balance, currentPrices])

    const buildList = () => {
        // if (isPlatform('mobile')) {
            return (
                balances && balances.map((holding: any, index: number) => {
                    let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
                    try {
                        icon = require(`cryptocurrency-icons/32/icon/${holding[1].toLowerCase()}.png`); 
                    } catch (ex) {
                        console.log(`Using generic icon for ${holding[1]}`)
                    }
                    return (
                        <IonItem className="holding-item">
                            <IonAvatar className={"holding-avatar"} slot="start">
                                <img className={"holding-icon"} src={icon}/>
                            </IonAvatar>
                            <IonLabel className={"holding-list-label"}>
                                <div>
                                    {holding[2]}
                                </div>
                                <p>
                                    {holding[1]}
                                </p>
                            </IonLabel>
                            <IonLabel className={"holdings-list-amount"}>
                                {currentPrices.filter((it:any) => it.symbol === holding[1].toLowerCase())[0] && <div className="current-value">
                                    ${numbro(Number(currentPrices.filter((it:any) => it.symbol === holding[1].toLowerCase())[0].current_price) * Number(holding[0])).format({
                                        thousandSeparated: true,
                                        mantissa: 2,
                                    })}
                                </div>
                                }
                                <p>
                                    {numbro(holding[0]).format({
                                            thousandSeparated: true
                                        })
                                    } 
                                </p>
                                {currentPrices.filter((it:any) => it.symbol === holding[1].toLowerCase())[0] && <div className={"name"}>
                                    ${numbro(currentPrices.filter((it:any) => it.symbol === holding[1].toLowerCase())[0].current_price).format({
                                        thousandSeparated: true,
                                        mantissa: 2,
                                    })}
                                    <div className={"ticker-priceChange"}>
                                        (<div className={`${currentPrices.filter((it:any) => it.symbol === holding[1].toLowerCase())[0].price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
                                            {numbro(currentPrices.filter((it:any) => it.symbol === holding[1].toLowerCase())[0].price_change_percentage_24h).format({
                                                average: true,
                                                mantissa: 2,
                                            })}%
                                        </div>)
                                    </div>
                                </div>
                                }
                            </IonLabel>
                        </IonItem>
                    )
                })
            )
        // } else {
        //     return (
        //         <IonGrid fixed className="holdings-grid">
        //             <IonRow className={"holdings-row"} >
        //                 { holdingsList.map((holding: any, index: number) => {
        //                     let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
        //                     try {
        //                         icon = require(`cryptocurrency-icons/32/icon/${holding.ticker.toLowerCase()}.png`); 
        //                     } catch (ex) {
        //                         console.log(`Using generic icon for ${holding.ticker}`)
        //                     }
        //                     return (
        //                         <IonCol className="holding-col" size="6" size-md="2" key={index}>
        //                             <IonCard className={"holding-card"}>
        //                             <IonItem >
        //                                 <IonAvatar className={"holding-avatar"} slot="start">
        //                                     <img className={"holding-icon"} src={icon}/>
        //                                 </IonAvatar>

        //                                 <IonLabel className={"holding-label"}>
        //                                     <div className={"name"}>
        //                                         {holding.ticker}
        //                                         <div className={"ticker-priceChange"}>
        //                                             (<div className={`${holding.currentPrice.quote.USD.percent_change_24h >= 0 ? "positive" : "negative"}`}> {numbro(holding.currentPrice.quote.USD.percent_change_24h).format({
        //                                                     average: true,
        //                                                     mantissa: 2,
        //                                                 })}%</div>)
        //                                         </div>
        //                                     </div>
        //                                     <div>
        //                                         ${numbro(Number(holding.currentPrice.quote.USD.price) * Number(holding.amount)).format({
        //                                             thousandSeparated: true,
        //                                             mantissa: 2,
        //                                         })}
        //                                     </div>
        //                                     <h3>
        //                                         ${numbro(holding.currentPrice.quote.USD.price).format({
        //                                             thousandSeparated: true,
        //                                             mantissa: 2,
        //                                         })}
        //                                     </h3>
        //                                     <p>{holding.amount} </p>
        //                                 </IonLabel>
        //                             </IonItem>
        //                             </IonCard>
        //                         </IonCol>
        //                     )
        //                 })
        //             }
            //         </IonRow>
            //     </IonGrid>
            // )
        // }
    }
    
    let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
    try {
        icon = require(`cryptocurrency-icons/32/icon/eth.png`); 
    } catch (ex) {
        console.log(`Using generic icon for eth`)
    }
    // const list = holdingsList.map((holding: Holding) => <div>Test</div>)
    return (
        <IonList lines="full" className={"holdings-list ion-padding default-background"}>
            <IonItem className="holding-item">
                            <IonAvatar className={"holding-avatar"} slot="start">
                                <img className={"holding-icon"} src={icon}/>
                            </IonAvatar>
                            <IonLabel className={"holding-list-label"}>
                                <div>
                                    Ethereum
                                </div>
                                <p>
                                    Eth
                                </p>

                            </IonLabel>
                            <IonLabel className={"holdings-list-amount"}>
                                <div className="current-value">
                                    ${numbro(Number(currentPrices.filter((it:any) => it.symbol === "eth")[0].current_price) * Number(numbro(web3.utils.fromWei(balance, 'ether')))).format({
                                        thousandSeparated: true,
                                        mantissa: 2,
                                    })}
                                </div>
                                <p>
                                    {numbro(web3.utils.fromWei(balance, 'ether')).format({
                                            thousandSeparated: true
                                        })
                                    } 
                                </p>
                                <div className={"name"}>
                                    ${numbro(currentPrices.filter((it:any) => it.symbol === "eth")[0].current_price).format({
                                        thousandSeparated: true,
                                        mantissa: 2,
                                    })}
                                    <div className={"ticker-priceChange"}>
                                        (<div className={`${currentPrices.filter((it:any) => it.symbol === "eth")[0].price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
                                            {numbro(currentPrices.filter((it:any) => it.symbol === "eth")[0].price_change_percentage_24h).format({
                                                average: true,
                                                mantissa: 2,
                                            })}%
                                        </div>)
                                    </div>
                                </div>
                            </IonLabel>
                        </IonItem>
            {list}
        </IonList>
    )
}

export default HoldingsList