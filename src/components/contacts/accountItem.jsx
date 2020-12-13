import React, { useEffect, useState, useCallback } from 'react';
import { IonItem, IonAvatar, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonInput, IonButtons, IonButton } from "@ionic/react";
import Identicon from 'react-identicons';
import { chevronUp, chevronDown, cashOutline, copy, trash, pencil, sendOutline, save, close} from 'ionicons/icons';
import { deleteAccount, saveNewAccount } from '../../firebase';
import { useSelector } from 'react-redux';
import {CopyToClipboard} from 'react-copy-to-clipboard'
import './styles/accountItem.scss'
import { toast } from '../toast';
import HoldingsList from '../holdings/HoldingsList';
import MinAbi from '../../MinAbi';

const AccountItem = ({tokens, openModal, ownersAccount, account, openTransak}) => {

  const [balance, setBalance] = useState("0")
  const web3 = useSelector((state) => state.user.web3)
  const [balances, setTokenBalances] = useState(null)
  const [showBalances, setShowBalances] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedName, setUpdatedName] = useState(account.name)
  const [updatedAddress, setUpdatedAddress] = useState(account.address)

  const currentPrices = useSelector((state) => state.prices.currentPrices)

  const getBalance = useCallback(async (address) => {
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
  }, [web3])

  useEffect(() => {
    getBalance(account.address).then((res) => {
      setBalance(res)
    })
  }, [account, getBalance])

  const tokenBalances = useCallback(async () => {

    if (tokens) {
      const bals = tokens.map(async (token) => {
        // GET TOKEN contract and decimals
        const contract = new web3.eth.Contract(MinAbi, token.address);
        const dec = await contract.methods.decimals().call()

        // GET ERC20 Token Balance and divide by decimals
        let bal = await contract.methods.balanceOf(account.address).call()
        bal = bal / (10**dec).toString();

        if (currentPrices.filter((it) => it.symbol === token.symbol.toLowerCase())[0]) {
          const currentHoldings = currentPrices.filter((it) => it.symbol === token.symbol.toLowerCase())[0].current_price * bal
          return [bal, currentHoldings, token.symbol, token.name]
        }
        return [0]
      })
      Promise.all(bals).then((finalBalances) => {
        setTokenBalances(finalBalances.filter((it) => Number(it[0]) > 0 ))
      })  
    }
  }, [tokens, account.address, currentPrices, web3])

  useEffect(() => {
    tokenBalances()
  }, [tokens, tokenBalances])

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

  if (isEditing) {
    return (
      <IonItem className={"ion-padding account-item-sliding"}>
        <IonAvatar className={"avatar"} slot="start">
          <Identicon className="identicon" size={40} string={account.address} />
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
    <IonItemSliding color={"light"} className="account-item-sliding">
      <IonItem className={"contact"} color={"light"} >
        <div className={"account-item"}>
          <div className={"main-content"} >
            <IonAvatar className={"avatar"} slot="start">
              <Identicon className="identicon" size={40} string={account.address} />
            </IonAvatar>
            <IonLabel>
              <div className="account-name">{account.name}</div>
              <CopyToClipboard text={account.address} >
                <div className={"account-flex"} onClick={() => toast("Address Copied")} >
                  <IonIcon className={"copy-icon"} icon={copy}/>
                  <p className={"account"}>
                    {account.address}
                  </p>
                </div>
              </CopyToClipboard>
              {/* <h2 onClick={() => setShowBalances(!showBalances)}>Balances: <IonIcon className={"collapse-balances-icon"} icon={showBalances ? chevronUp : chevronDown}/></h2> */}
            </IonLabel>
          </div>
          {/* {balances && showBalances &&
            <IonLabel className="account-holdings-list" >
              <HoldingsList balances={balances} balance={balance} />
            </IonLabel>
          } */}
        </div>
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