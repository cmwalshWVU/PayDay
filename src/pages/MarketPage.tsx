import React from 'react';
import { IonContent, IonPage, IonCardHeader, IonCardTitle } from '@ionic/react';
import PriceList from '../components/market/PriceList';
import "./MarketPage.scss"
import { useSelector } from 'react-redux';

interface OwnProps { }

const MarketPage: React.FC<OwnProps> = () => {

    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

    return (
        <IonPage id="market-page">
            <IonContent className={` ${useDarkMode ? null : 'light-card'}`}>
                <IonCardHeader className="header">
                    <IonCardTitle className={"title"} >
                        Market
                    </IonCardTitle>
                </IonCardHeader>
                <PriceList />
            </IonContent>
        </IonPage>
    );
};

export default React.memo(MarketPage)