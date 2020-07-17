import React, { useEffect, useState } from 'react';
import { IonItem, IonAvatar, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from "@ionic/react";
import Identicon from 'react-identicons';
import { cashOutline, copy, trash, pencil, sendOutline} from 'ionicons/icons';
import { deleteAccount } from '../firebase';
import { useSelector } from 'react-redux';
import numbro from 'numbro'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import './accountItem.scss'

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
      <IonItem >
        <IonAvatar className={"avatar"} slot="start">
          <Identicon size={40} string={account.address} />
        </IonAvatar>
        <IonLabel>
          <h2>{account.name}</h2>
          <h3>Balance: {numbro(web3.utils.fromWei(balance, 'ether')).format({thousandSeparated: true})} ETH</h3>
          <CopyToClipboard text={account.address}>
            <div className={"account-flex"} >
              Address: 
              <IonIcon className={"copy-icon"} icon={copy}/>
              <p className={"account"}>
                {account.address}
              </p>
            </div>
          </CopyToClipboard>
        </IonLabel>
      </IonItem>
      {ownersAccount ?
        null 
        :
        <>
          <IonItemOptions side="start">
            <IonItemOption color="danger">
              <IonIcon slot="icon-only" icon={trash} onClick={() => deleteAccount(account.address)} />
            </IonItemOption>
            <IonItemOption color="warning">
              <IonIcon slot="icon-only" icon={pencil} onClick={() => console.log("Coming Soon!")} />
            </IonItemOption>
          </IonItemOptions>
          <IonItemOptions side="end">
            <IonItemOption color="success">
              <IonIcon slot="icon-only" icon={cashOutline} onClick={() => openTransak(account.address)} />
            </IonItemOption>
            <IonItemOption color="primary">
              <IonIcon slot="icon-only" icon={sendOutline} onClick={() => openModal(true, account.address)} />
            </IonItemOption>
          </IonItemOptions>
        </>
      }
    </IonItemSliding>
  )
}

export default AccountItem