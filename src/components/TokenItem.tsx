import { useState, useEffect } from "react";
import React from "react";
import { useSelector } from "react-redux";
import { IonList, IonItem, IonAvatar, IonLabel, IonGrid, IonRow, IonCol, IonCard } from "@ionic/react";
import numbro from "numbro";
import "./HoldingsList.scss"
import { isPlatform } from "@ionic/core";

interface Props {
    token: any
}

const TokenItem: React.FC<Props> = ({token}) => {

    if (token) {
      return (            
        <IonItem className="holding-item">
            <IonLabel className={"holding-list-label"}>
              <IonAvatar className={"holding-avatar"} slot="start">
                  <img className={"holding-icon"} src={token.image}/>
              </IonAvatar>
              <div className="token-name">
                <div>
                    {token.name}
                </div>
                <p className="token-symbol">
                    {token.symbol.toUpperCase()}
                </p>
              </div>
            </IonLabel>
            <IonLabel className={"holdings-list-amount"}>
              <div className={"name"}>
                ${numbro(token.current_price).format({
                    thousandSeparated: true,
                    mantissa: 2,
                })}
                <div className={"ticker-priceChange"}>
                  <div className={`${token.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
                      {token.price_change_percentage_24h}%
                  </div>
                </div>
              </div>
            </IonLabel>
        </IonItem>
      )
  } else {
    return null
  }
}

export default TokenItem