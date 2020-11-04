import React from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonCardSubtitle } from '@ionic/react';
import PersonalAccountItem from '../contacts/personalAccountItem';
import { useSelector } from 'react-redux';
import HoldingsList from './HoldingsList';
import '../personalAccountHeader.scss'

interface Props {
    openTransak: (address: string) => void
    openModal: (open: boolean, address: string) => void
    accounts: any
}

const HoldingsListCard: React.FC<Props> = ({accounts, openTransak, openModal}) => {
    
    const ethHoldings = useSelector((state: any) => state.holdings.ethHoldings)
    const holdings = useSelector((state: any) => state.holdings.holdings)
    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

    return (
        <IonCard className={`holdings-card ${!useDarkMode ? "light-card" : null}`} >
            <IonCardHeader id={"holdings-card-header"}>
                <IonCardTitle className={"dekstop-accounts-title"} >
                    Holdings
                </IonCardTitle>
                <IonCardSubtitle  color={"light"}>
                    {accounts.map((account: any, index: number) =>
                        <PersonalAccountItem key={index} account={{name: "", address: account}} />
                    )}
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="holdings-list-card">
                <div className="header-buttons">
                    <IonButton onClick={() => openTransak(accounts[0])}>
                        Buy Crypto
                    </IonButton>
                    <IonButton size={"default"}  onClick={() => openModal(true, "")} >
                        Transfer Funds
                    </IonButton>
                </div>
                <HoldingsList balances={holdings} balance={ethHoldings} personalAccount={true} />
            </IonCardContent>
        </IonCard>
    )
}

export default HoldingsListCard
