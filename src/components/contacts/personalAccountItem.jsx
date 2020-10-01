import React from 'react';
import { IonItem, IonAvatar, IonLabel, IonIcon } from "@ionic/react";
import Identicon from 'react-identicons';
import { copy} from 'ionicons/icons';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import './accountItem.scss'

const PersonalAccountItem = ({ account}) => {

    return (
        <IonItem className="personal-account" >
            <IonAvatar className={"avatar"} slot="start">
            <Identicon size={40} string={account.address} />
            </IonAvatar>
            <IonLabel>
            <div className="account-name">{account.name}</div>
            <CopyToClipboard text={account.address}>
                <div className={"account-flex"} >
                <IonIcon className={"copy-icon"} icon={copy}/>
                <p className={"account"}>
                    {account.address}
                </p>
                </div>
            </CopyToClipboard>
            </IonLabel>
        </IonItem>
    )
}

export default PersonalAccountItem