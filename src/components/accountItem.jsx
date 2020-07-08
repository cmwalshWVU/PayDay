import React, { useEffect, useState } from 'react';
import { IonItem, IonAvatar, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from "@ionic/react";
import Identicon from 'react-identicons';
import { trash, pencil } from 'ionicons/icons';
import { deleteAccount } from '../firebase';
import { useSelector } from 'react-redux';


const AccountItem = ({openModal, ownersAccount, account, openTransak}) => {

  const [balance, setBalance] = useState("0")
  const web3 = useSelector((state) => state.user.web3)
  const [open, setOpen] = useState(false)

  const getBalance = async (address) => {
    try {
      const amount = await web3.eth.getBalance(address)
      if (amount) {
        return amount.toString()
      } else {
        return "0"
      }
    } catch (ex) {
      return "0"
    }
  }

  useEffect(() => {
    getBalance(account.address).then((res) => {
      setBalance(res)
    })
  }, [account])

  
  return (
    <IonItemSliding id="item100">
      <IonItem onClick={() => openModal(true, account.address)} >
        <IonAvatar className={"avatar"} slot="start" onClick={() => openTransak(account.address)}>
          <Identicon size={40} string={account.address} />
        </IonAvatar>
        <IonLabel>
          <h2>{account.name}</h2>
          <h3>Balance: {web3.utils.fromWei(balance, 'ether')} ETH</h3>
          <p className={"account"}>Address: {account.address}</p>
        </IonLabel>
      </IonItem>
      {ownersAccount ?
        null 
        :
        <IonItemOptions side="end">
          <IonItemOption color="danger">
            <IonIcon slot="icon-only" icon={trash} onClick={() => deleteAccount(account.address)} />
          </IonItemOption>
          <IonItemOption color="warning">
            <IonIcon slot="icon-only" icon={pencil} onClick={() => console.log("Coming Soon!")} />
          </IonItemOption>
        </IonItemOptions>
      }
    </IonItemSliding>
  )
}

export default AccountItem