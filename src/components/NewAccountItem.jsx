import React, { useState } from 'react';
import { IonItem, IonLabel, IonInput, IonAvatar, IonIcon, IonButtons, IonButton } from "@ionic/react";
import Identicon from 'react-identicons';
import { save, close } from "ionicons/icons";
import './NewAccountItem.scss'
import { saveNewAccount } from '../firebase';
import { useSelector } from 'react-redux';
import { toast } from './toast';

const NewAccountItem = ({setAddNewUser}) => {

  const [address, setAddress] = useState("")
  const [name, setName] = useState("")
  const web3 = useSelector((state) => state.user.web3)

  const onClose = () => {
    setName("")
    setAddress("")
    setAddNewUser(false)
  }

  const onSave = async () => {
    if (web3.utils.isAddress(address)) {
      const success = await saveNewAccount({name: name, address: address})
      if (success) {
        setName("")
        setAddress("")
        setAddNewUser(false)
      }
    }
    else {
      toast("Invalid Address")
    }
  }

  return (
    <IonItem className={"ion-padding"}>
      <IonAvatar className={"avatar"} slot="start">
        <Identicon size={40} string={"BRANDNEWUSERSTRING"} />
      </IonAvatar>
      <IonLabel position="stacked" color="primary">Name</IonLabel>
      <IonInput name="name" type="text" value={name} onIonChange={e => setName(e.detail.value)} />
      <IonLabel position="stacked" color="primary">Address</IonLabel>
      <IonInput name="address" type="text" value={address} onIonChange={e => setAddress(e.detail.value)} />
      <IonButtons slot="end" className={"account-action-buttons"} >
        <IonButton onClick={() => onSave()}>
          <IonIcon slot="icon-only" icon={save} />
        </IonButton>
        <IonButton onClick={() => onClose()}>
          <IonIcon slot="icon-only" icon={close}  />
        </IonButton>
      </IonButtons>
    </IonItem>
  )
}

export default NewAccountItem