import { IonModal, IonContent, IonHeader, IonTitle, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonButton } from "@ionic/react";
import { ERC20TOKENS } from "../Erc20Tokens";
import React, { useState } from "react";
import { useSelector } from "react-redux";

interface Props {
    open: boolean
    setOpen: (open: false) => void
    setTokenToSend: (token: string) => void
    tokenToSend: string
    account: string
    setTransferToAddress: (address: string) => void
    transferToAddress: string
    balance: string
    openFortmaticTransfer: (amount: string, account: string, transferToAddress: string) => void
}

const TransferModal: React.FC<Props> = ({account, open, setOpen, setTokenToSend, tokenToSend,
                                setTransferToAddress, transferToAddress, balance, openFortmaticTransfer}) => {
    
    const [amount, setAmount] = useState("")
    const web3 = useSelector((state: any) => state.user.web3)

    return (
        <IonModal id={"transfer-modal"} isOpen={open} onDidDismiss={() => setOpen(false)}>
            <IonContent className={"transfer-modal-content ion-padding"}>
            <IonHeader>
                <IonTitle className="transfer-modal-title">Transfer Funds</IonTitle>
            </IonHeader>
            <IonList className="address-inputs">
                <IonItem>
                <IonLabel>Crypto to Send</IonLabel>
                <IonSelect value={tokenToSend} okText="Okay" cancelText="Dismiss"  onIonChange={e => setTokenToSend(e.detail.value)}>
                    <IonSelectOption value={"ETH"} >Ethereum</IonSelectOption>
                    {ERC20TOKENS.map((token, index)  => {
                    return <IonSelectOption key={index} value={token}>{token.name}</IonSelectOption>
                    })}
                </IonSelect>
                </IonItem>
                <IonItem>
                <IonLabel position="stacked" color="primary">From:</IonLabel>
                <IonInput readonly name="transferToAddress" type="text" value={account} />
                </IonItem> 
                <IonItem>
                <IonLabel position="stacked" color="primary">To:</IonLabel>
                <IonInput readonly={transferToAddress !== ""} name="transferToAddress" type="text" value={transferToAddress} onIonChange={(e: any) => setTransferToAddress(e.detail.value)} />
                </IonItem> 
            </IonList>
            <IonList className="amount-inputs">
                <IonItem>
                <IonLabel position="stacked" color="primary">Amount:</IonLabel>
                <IonInput max={balance} clearInput name="transferToAddress" value={amount} onIonChange={(e: any) => setAmount(e.detail.value)}/>
                </IonItem> 
            </IonList>
            <div className="modal-buttons">
                <IonButton disabled={parseInt(amount) > 0 && web3.utils.isAddress(transferToAddress)} color="primary" onClick={() => openFortmaticTransfer(amount, account, transferToAddress)}>Transfer</IonButton>
                <IonButton color="light" onClick={() => setOpen(false)}>Cancel</IonButton>
            </div>
            </IonContent>
        </IonModal>
    )
}

export default TransferModal