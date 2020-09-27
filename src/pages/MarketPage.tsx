import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton } from '@ionic/react';
import PriceList from '../components/market/PriceList';
import "./MarketPage.scss"

interface OwnProps { }

const MarketPage: React.FC<OwnProps> = ({}) => {

    return (
        <IonPage id="market-page">
            <IonContent className={`ion-padding`}>
                <PriceList />
            </IonContent>
        </IonPage>
    );
};

export default React.memo(MarketPage)