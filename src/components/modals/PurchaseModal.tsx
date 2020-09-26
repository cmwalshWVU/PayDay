import { IonModal, IonContent, IonHeader, IonTitle, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton } from "@ionic/react";
import React from "react";
import { ERC20TOKENS } from "../Erc20Tokens";

interface Props {
    open: boolean
    tokenToSend: string
    amount: number
    setAmount: (amount: number) => void
    openTransakModal: (address: string, amount: number, token: string) => void
    account: string
    setPurchaseModalOpen: (open: boolean) => void
    setTokenToSend: (token: string) => void
}

const PurchaseModal: React.FC<Props> = ({account, setPurchaseModalOpen, amount, setTokenToSend, openTransakModal, open, tokenToSend, setAmount}) => {

    return <IonModal id={"purchase-modal"} isOpen={open} onDidDismiss={() => setPurchaseModalOpen(false)}>
            <IonContent className={"purchase-modal-content ion-padding"}>
            <IonHeader>
                <IonTitle className="purchase-modal-title">Purchase Crytocurrency</IonTitle>
            </IonHeader>
            <IonList className="address-inputs">
                <IonItem>
                <IonLabel>Crypto To Purchase</IonLabel>
                <IonSelect value={tokenToSend} okText="Okay" cancelText="Dismiss"  onIonChange={e => setTokenToSend(e.detail.value)}>
                    <IonSelectOption value={"ETH"} >Ethereum</IonSelectOption>
                    {ERC20TOKENS.map((token)  => {
                    return <IonSelectOption value={token.symbol}>{token.name}</IonSelectOption>
                    })}
                </IonSelect>
                </IonItem>
                <IonItem>
                <IonLabel position="stacked" color="primary">Amount:</IonLabel>
                <IonInput clearInput name="transferToAddress" value={amount} onIonChange={(e: any) => {
                    setAmount(parseInt(e.detail.value))}}/>
                </IonItem> 
            </IonList>
            <div className="modal-buttons">
                <IonButton color="primary" onClick={() => openTransakModal(account, amount, tokenToSend)}>Continue</IonButton>
                <IonButton color="light" onClick={() => setPurchaseModalOpen(false)}>Cancel</IonButton>
            </div>
            </IonContent>
        </IonModal>
}

export default PurchaseModal