import React from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonCardSubtitle } from '@ionic/react';
import PersonalAccountItem from '../contacts/personalAccountItem';
import { ERC20TOKENS } from '../Erc20Tokens';
import { useSelector } from 'react-redux';
import HoldingsList from './HoldingsList';
import '../personalAccountHeader.scss'

interface Props {
    openTransak: () => void
    setPurchaseModalOpen: any
    openModal: (open: boolean, address: string) => void
    accounts: any
}

const HoldingsListCard: React.FC<Props> = ({accounts, openTransak, setPurchaseModalOpen, openModal}) => {
    
    const ethHoldings = useSelector((state: any) => state.holdings.ethHoldings)
    const holdings = useSelector((state: any) => state.holdings.holdings)

    return (
        <IonCard className={"holdings-card"} >
            <IonCardHeader id={"holdings-card-header"}>
                <IonCardTitle className={"accounts-title"} >
                    Holdings
                </IonCardTitle>
                <IonCardSubtitle>
                    {accounts.map((account: any, index: number) =>
                        <PersonalAccountItem key={index} account={{name: "", address: account}} />
                    )}
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className="holdings-list-card">
                <div className="header-buttons">
                    <IonButton onClick={() => setPurchaseModalOpen(true)}>
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
