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
                balances && balances.map((holding: any, index: number) => {
                    let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
                    try {
                        icon = require(`cryptocurrency-icons/32/icon/${holding[2].toLowerCase()}.png`); 
                    } catch (ex) {
                        console.log(`Using generic icon for ${holding[2]}`)
                    }
                    return (
                        <IonItem key={index} className="holding-item">
                            <IonLabel className={"holding-list-label"}>
                                <IonAvatar className={"holding-avatar"} slot="start">
                                    <img className={"holding-icon"} src={icon} alt="N/A"/>
                                </IonAvatar>
                                <div className="token-name">
                                    <div>
                                        {holding[2]}
                                    </div>
                                    <p className="token-symbol">
                                        {holding[3]}
                                    </p>
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
                                <p>
                                    {numbro(holding[0]).format({
                                            thousandSeparated: true,
                                            mantissa: 4
                                        })
                                    } 
                                </p>
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
        <IonList lines="full" className={`${personalAccount ? "personal-holdings-list" :    "holdings-list"} ion-padding default-background`}>
            <IonItem className="holding-item">
                <IonLabel className={"holding-list-label"}>
                    <IonAvatar className={"holding-avatar"} slot="start">
                        <img className={"holding-icon"} src={icon} alt="N/A"/>
                    </IonAvatar>
                    <div className="token-name">
                        <div>
                            Ethereum
                        </div>
                        <p className="token-symbol">
                            Eth
                        </p>
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
                    <p>
                        {numbro(web3.utils.fromWei(balance, 'ether')).format({
                                thousandSeparated: true,
                                mantissa: 4
                            })
                        } 
                    </p>
                </div>
            </IonItem>
            {list}
        </IonList>
    )
}

export default HoldingsList