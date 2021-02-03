import React from 'react';
import { IonItem, IonAvatar, IonLabel, IonIcon } from "@ionic/react";
import Identicon from 'react-identicons';
import { copy} from 'ionicons/icons';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import './accountItem.scss'
import { toast } from '../toast';

const PersonalAccountItem = ({ account}) => {

    return (
        <IonItem color={"light"} className="personal-account" >
            <IonAvatar className={"avatar"} slot="start">
            <Identicon size={30} string={account.address} />
            </IonAvatar>
            <IonLabel className={"personel-account-address"}>
            <div className="account-name">{account.name}</div>
            <CopyToClipboard text={account.address} >
                <div className={"account-flex"} onClick={() => toast("Address Copied")}>
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