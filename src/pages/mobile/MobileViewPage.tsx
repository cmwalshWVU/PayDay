import React, { useState } from 'react'
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet, IonContent } from '@ionic/react';
import { walletOutline, statsChartOutline, newspaperOutline, personOutline } from 'ionicons/icons';
import PaymentPage from './PaymentPage';
import MarketPage from './MarketPage';
import NewsPage from './NewsPage';
import AccountPage from './AccountPage';
import { Route } from 'react-router';
import { ButtonGroup, Button } from '@material-ui/core';

const MobileViewPage: React.FC = () => {
    const [selectedView, setSelectedView] = useState("wallet")

    return (
        <IonPage>
            <IonContent>
                {
                    selectedView === "wallet" ?
                        <PaymentPage />
                    : selectedView === "market" ?
                        <MarketPage />
                    : selectedView === "news" ?
                        <NewsPage />
                    : <AccountPage/>
                }
            </IonContent>
            {/* <IonTabs>
            <IonTabBar slot="bottom">
                <IonTabButton  onClick={() => setSelectedView("wallet")} >
                    <IonIcon icon={walletOutline} />
                </IonTabButton>
                <IonTabButton onClick={() => setSelectedView("market")} >
                    <IonIcon icon={statsChartOutline} />
                </IonTabButton>
                <IonTabButton onClick={() => setSelectedView("news")} >
                    <IonIcon icon={newspaperOutline} />
                </IonTabButton>
                <IonTabButton onClick={() => setSelectedView("account")} >
                    <IonIcon icon={personOutline} />
                </IonTabButton>
            </IonTabBar>
            </IonTabs> */}
            <ButtonGroup style={{width: '100%', display: "flex"}} variant="text" color="primary" aria-label="text primary button group">
                <Button style={{flexGrow: 1}} onClick={() => setSelectedView("wallet")} ><IonIcon icon={walletOutline} /></Button>
                <Button style={{flexGrow: 1}} onClick={() => setSelectedView("market")} > <IonIcon icon={statsChartOutline} /></Button>
                <Button style={{flexGrow: 1}} onClick={() => setSelectedView("news")}><IonIcon icon={newspaperOutline} /></Button>
                <Button style={{flexGrow: 1}} onClick={() => setSelectedView("account")}><IonIcon icon={personOutline} /></Button>
            </ButtonGroup>
        </IonPage>
    )


}

export default MobileViewPage