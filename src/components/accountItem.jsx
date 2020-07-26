import React, { useEffect, useState } from 'react';
import { IonItem, IonAvatar, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonInput, IonButtons, IonButton } from "@ionic/react";
import Identicon from 'react-identicons';
import { chevronUp, chevronDown, cashOutline, copy, trash, pencil, sendOutline, save, close} from 'ionicons/icons';
import { deleteAccount, saveNewAccount } from '../firebase';
import { useSelector } from 'react-redux';
import numbro from 'numbro'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import './accountItem.scss'
import { promised } from 'q';
import { toast } from './toast';

const AccountItem = ({tokens, openModal, ownersAccount, account, openTransak}) => {

  const [balance, setBalance] = useState("0")
  const web3 = useSelector((state) => state.user.web3)
  const [open, setOpen] = useState(false)
  const [balances, setTokenBalances] = useState(null)
  const [showBalances, setShowBalances] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedName, setUpdatedName] = useState(account.name)
  const [updatedAddress, setUpdatedAddress] = useState(account.address)

  let minABI = [
    // balanceOf
    {
      "constant":true,
      "inputs":[{"name":"_owner","type":"address"}],
      "name":"balanceOf",
      "outputs":[{"name":"balance","type":"uint256"}],
      "type":"function"
    },
    // decimals
    {
      "constant":true,
      "inputs":[],
      "name":"decimals",
      "outputs":[{"name":"","type":"uint8"}],
      "type":"function"
    }
  ];

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

  useEffect(() => {
    tokenBalances()
  }, [tokens])

  const tokenBalances = async () => {

    if (tokens) {
      console.log(tokens)
      const bals = tokens.map(async (token) => {
        // GET TOKEN contract and decimals
        console.log(token)
        const contract = new web3.eth.Contract(minABI, token.address);
        const dec = await contract.methods.decimals().call()

        // GET ERC20 Token Balance and divide by decimals
        let bal = await contract.methods.balanceOf(account.address).call()
        bal = bal / (10**dec).toString();

        console.log(bal)
        return [bal, token.symbol]
      })
      Promise.all(bals).then((finalBalances) => {
        console.log(finalBalances)
        setTokenBalances(finalBalances.filter((it) => Number(it[0]) > 0 ))
      })  
    }
  }

  const updateContact = async () => {
    if (web3.utils.isAddress(updatedAddress)) {
      const success = await saveNewAccount({name: updatedName, address: updatedAddress})
      if (success) {
        // getAccounts().then((resp) => {
        //   if (resp) {
        //     setDependentAccounts(resp)
        //   }          
        // })
      }
      setIsEditing(false)
    }
    else {
      toast("Invalid Address")
    }
  }

  console.log(balances)
  if (isEditing) {
    return (
      <IonItem className={"ion-padding"}>
        <IonAvatar className={"avatar"} slot="start">
          <Identicon size={40} string={account.address} />
        </IonAvatar>
        <IonLabel position="stacked" color="primary">Name</IonLabel>
        <IonInput name="name" type="text" value={updatedName} onIonChange={e => setUpdatedName(e.detail.value)} />
        <IonLabel position="stacked" color="primary">Address</IonLabel>
        <IonInput name="address" type="text" value={updatedAddress} onIonChange={e => setUpdatedAddress(e.detail.value)} />
        <IonButtons slot="end" className={"account-action-buttons"} >
          <IonButton onClick={() => updateContact()}>
            <IonIcon slot="icon-only" icon={save} />
          </IonButton>
          <IonButton onClick={() => setIsEditing(false)}>
            <IonIcon slot="icon-only" icon={close}  />
          </IonButton>
        </IonButtons>
      </IonItem>
    )
  } return (
    <IonItemSliding id="item100">
      <IonItem >
        <IonAvatar className={"avatar"} slot="start">
          <Identicon size={40} string={account.address} />
        </IonAvatar>
        <IonLabel>
          <h2>{account.name}</h2>
          <CopyToClipboard text={account.address}>
            <div className={"account-flex"} >
              <IonIcon className={"copy-icon"} icon={copy}/>
              <p className={"account"}>
                {account.address}
              </p>
            </div>
          </CopyToClipboard>
          <h2 onClick={() => setShowBalances(!showBalances)}>Balances: <IonIcon className={"collapse-balances-icon"} icon={showBalances ? chevronUp : chevronDown}/></h2>
          {balances && showBalances? 
            <div className="balance-list">
              <div className={"flex"}>
                <img className={"holding-icon"} src={require(`cryptocurrency-icons/32/icon/eth.png`)}/> 
                <div className={"holding-amount"} >
                  {numbro(web3.utils.fromWei(balance, 'ether')).format({thousandSeparated: true})}
                </div>
                ETH
              </div>
              {balances.map((token) => {
                let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
                try {
                    icon = require(`cryptocurrency-icons/32/icon/${token[1].toLowerCase()}.png`); 
                } catch (ex) {
                    console.log(`Using generic icon for ${token[1]}`)
                }
                return <div className={"flex"}>
                          <img className={"holding-icon"} src={icon}/>
                          <div className={"holding-amount"} >{token[0]}</div>
                          {token[1]}
                      </div>
              })}
            </div>
          : null}
        </IonLabel>
      </IonItem>
      {ownersAccount ?
        null 
        :
        <>
          <IonItemOptions side="start">
            <IonItemOption color="danger" onClick={() => deleteAccount(account.address)} >
              <IonIcon slot="icon-only" icon={trash} />
            </IonItemOption>
            <IonItemOption color="warning" onClick={() => setIsEditing(true)} >
              <IonIcon slot="icon-only" icon={pencil} />
            </IonItemOption>
          </IonItemOptions>
          <IonItemOptions side="end">
            <IonItemOption color="success" onClick={() => openTransak(account.address)} >
              <IonIcon slot="icon-only" icon={cashOutline} />
            </IonItemOption>
            <IonItemOption color="primary" onClick={() => openModal(true, account.address)}>
              <IonIcon slot="icon-only" icon={sendOutline} />
            </IonItemOption>
          </IonItemOptions>
        </>
      }
    </IonItemSliding>
  )
}

export default AccountItem