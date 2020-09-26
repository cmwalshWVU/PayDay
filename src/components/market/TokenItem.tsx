import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import numbro from "numbro";
import "../holdings/HoldingsList.scss"

interface Props {
    token: any
}

const TokenItem: React.FC<Props> = ({token}) => {

    if (token) {
      return (            
        <IonItem className="holding-item">
            <IonLabel className={"holding-list-label"}>
              <img className={"holding-icon"} src={token.image} alt="N/A" />
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