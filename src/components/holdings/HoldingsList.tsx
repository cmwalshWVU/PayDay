import { useState, useEffect, useCallback } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { IonList, IonItem, IonAvatar, IonLabel } from "@ionic/react";
import numbro from "numbro";
import "./HoldingsList.scss"

interface Props {
    balances: any,
    balance: any,
    personalAccount?: boolean
}

const HoldingsList: React.FC<Props> = ({balance, balances, personalAccount}) => {

    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    const web3 = useSelector((state: any) => state.user.web3)

    const [list, setList] = useState(null)

    const buildList = useCallback(() => {
        // if (isPlatform('mobile')) {
            return (
                balances && balances.sort((a: any, b: any) => a[1] > b[1] ? -1 : 1).map((holding: any, index: number) => {
                    return (
                        <IonItem color={"light"} key={index} className="holding-item">
                            <IonLabel className={"holding-list-label"}>
                                <IonAvatar className={"holding-avatar"} slot="start">
                                    <img className={"holding-icon"} src={currentPrices.filter((it:any) => it.symbol === holding[2].toLowerCase())[0].image} alt="N/A"/>
                                </IonAvatar>
                                <div className="token-name">
                                    <div>
                                        {holding[2]}
                                    </div>
                                    <div className="token-symbol">
                                        {holding[3]}
                                    </div>
                                </div>
                            </IonLabel>
                            <div className={"holdings-list-amount"}>
                                {currentPrices.filter((it:any) => it.symbol === holding[2].toLowerCase())[0] && <div className="current-value">
                                    ${numbro(Number(currentPrices.filter((it:any) => it.symbol === holding[2].toLowerCase())[0].current_price) * Number(holding[0])).format({
                                        thousandSeparated: true,
                                        mantissa: 2,
                                    })}
                                </div>
                                }
                                <div className="token-amount">
                                    {numbro(holding[0]).format({
                                            thousandSeparated: true,
                                            mantissa: 4
                                        })
                                    } 
                                </div>
                            </div>
                        </IonItem>
                    )
                })
            )
    }, [balances, currentPrices])
    
    useEffect(() => {
        setList(buildList())
    }, [balances, balance, currentPrices, buildList])

    let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
    try {
        icon = require(`cryptocurrency-icons/32/icon/eth.png`); 
    } catch (ex) {
        console.log(`Using generic icon for eth`)
    }
    // const list = holdingsList.map((holding: Holding) => <div>Test</div>)
    return (
        <div className="mobile-holdings" >
        <IonList lines="full" className={`${personalAccount ? "personal-holdings-list" :    "holdings-list"} default-background`}>
            <IonItem color={"light"} className="holding-item">
                <IonLabel className={"holding-list-label"}>
                    <IonAvatar className={"holding-avatar"} slot="start">
                        <img className={"holding-icon"} src={icon} alt="N/A"/>
                    </IonAvatar>
                    <div className="token-name">
                        <div>
                            Ethereum
                        </div>
                        <div className="token-symbol">
                            Eth
                        </div>
                    </div>
                </IonLabel>
                <div className={"holdings-list-amount"}>
                    <div className="current-value">
                        {currentPrices.filter((it:any) => it.symbol === "eth")[0] ? 
                            "$" + numbro(Number(currentPrices.filter((it:any) => it.symbol === "eth")[0].current_price) * Number(numbro(web3.utils.fromWei(balance, 'ether')))).format({
                                thousandSeparated: true,
                                mantissa: 2,
                            })
                            : "$ N/A"
                        }
                    </div>
                    <div className="token-amount">
                        {numbro(web3.utils.fromWei(balance, 'ether')).format({
                                thousandSeparated: true,
                                mantissa: 4
                            })
                        } 
                    </div>
                </div>
            </IonItem>
            {list}
        </IonList>
        </div>
    )
}

export default HoldingsList