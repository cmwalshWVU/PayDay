import React, { useState } from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonSearchbar, IonSegment, IonSegmentButton, IonIcon, IonCardContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import TokenItem from './TokenItem';
import { useSelector } from 'react-redux';

const PriceList: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState("all")
    const [searchString, setSearchString] = useState("")
    const [sortingDirection, setSortingDirection] = useState("")
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)

    return (
        <div className={`price-card`}>
            <IonCardHeader>
                <IonCardTitle className={"accounts-title"} >
                    Market
                </IonCardTitle>
            </IonCardHeader>
            <IonSearchbar value={searchString} onIonChange={(e: any) => setSearchString(e.detail.value)}></IonSearchbar>
            <IonSegment className="pricelist-tabs" value={selectedTab} >
                <IonSegmentButton value="all" onClick={() => {
                setSelectedTab("all")
                setSortingDirection("desc")}
                }>
                All
                </IonSegmentButton>
                <IonSegmentButton value="priceChange" onClick={() => {
                if (selectedTab === "priceChange") {
                    if (sortingDirection === "asc") {
                    setSortingDirection("desc")
                    } else if (sortingDirection === "desc") {
                    setSortingDirection("asc")
                    } else {
                    setSortingDirection("desc")
                    }
                } else {
                    setSelectedTab("priceChange")
                    setSortingDirection("desc")
                }
                }}>
                <div className="price-tab">
                    Price Change {selectedTab  === "priceChange" ? sortingDirection === "desc" ? <IonIcon className={"segment-icon"} icon={chevronDown} /> : sortingDirection === "asc" ? <IonIcon className={"segment-icon"} icon={chevronUp}/> : null : null}
                </div>
                </IonSegmentButton>
                <IonSegmentButton value="marketCap" onClick={() => {
                if (selectedTab === "marketCap") {
                    if (sortingDirection === "asc") {
                    setSortingDirection("desc")
                    } else if (sortingDirection === "desc") {
                    setSortingDirection("asc")
                    } else {
                    setSortingDirection("desc")
                    }
                } else {
                    setSelectedTab("marketCap")
                    setSortingDirection("desc")
                }
                }}>
                <div className="price-tab">
                    Market Cap {selectedTab  === "marketCap" ? sortingDirection === "desc" ? <IonIcon className={"segment-icon"} icon={chevronDown} /> : sortingDirection === "asc" ? <IonIcon className={"segment-icon"} icon={chevronUp}/> : null : null}
                </div>
                </IonSegmentButton>
            </IonSegment>
            <IonCardContent className="price-list">
                <IonList>
                {currentPrices.length > 0 ?
                    currentPrices.filter((it: any) => it.name.toLowerCase().includes(searchString.toLowerCase()))
                    .sort((a: any, b: any) => {
                        if (selectedTab === "priceChange") {
                            if (sortingDirection === "desc") {
                                return a.price_change_percentage_24h > b.price_change_percentage_24h ? -1 : 1
                            } else {
                                return a.price_change_percentage_24h > b.price_change_percentage_24h ? 1 : -1
                            }
                        } if (selectedTab === "marketCap") {
                            if (sortingDirection === "desc") {
                                return a.market_cap > b.market_cap ? -1 : 1
                            } else {
                                return a.market_cap > b.market_cap ? 1 : -1
                            }
                        } else {
                            return a.market_cap > b.market_cap ? -1 : 1
                        }
                    })
                    .map((token: any) => {
                        return(
                            <TokenItem token={token} />
                        )
                    })
                :
                    <IonItem>
                    <IonLabel className={"no-price-list"}>
                        No Current Market Data
                    </IonLabel>
                    </IonItem>
                }
                </IonList>
            </IonCardContent>
        </div>
    )

}

export default PriceList