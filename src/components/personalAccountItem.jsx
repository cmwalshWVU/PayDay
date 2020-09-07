import React, { useEffect, useState } from 'react';
import { IonItem, IonAvatar, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon, IonList } from "@ionic/react";
import Identicon from 'react-identicons';
import { chevronDown, chevronUp, copy} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import numbro from 'numbro'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import './accountItem.scss'
import HoldingsList from './HoldingsList';

const PersonalAccountItem = ({tokens, openModal, ownersAccount, account, openTransak}) => {

    const [balance, setBalance] = useState("0")
    const web3 = useSelector((state) => state.user.web3)
    const [open, setOpen] = useState(false)
    const [balances, setTokenBalances] = useState(null)
    const [showBalances, setShowBalances] = useState(false)

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
      const bals = tokens.map(async (token) => {
        // GET TOKEN contract and decimals
        const contract = new web3.eth.Contract(minABI, token.address);
        const dec = await contract.methods.decimals().call()

        // GET ERC20 Token Balance and divide by decimals
        let bal = await contract.methods.balanceOf(account.address).call()
        bal = bal / (10**dec).toString();
        return [bal, token.symbol, token.name]
        
      })
      Promise.all(bals).then((finalBalances) => {
        setTokenBalances(finalBalances.filter((it) => Number(it[0]) > 0 ))
      })  
    }
  }

    return (
        <IonItemSliding id="item100">
        <IonItem >
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
            <h2 onClick={() => setShowBalances(!showBalances)}>Balances: <IonIcon className={"copy-icon"} icon={showBalances ? chevronUp: chevronDown }/></h2>
            </IonLabel>
        </IonItem>
        {balances && showBalances ?
              <HoldingsList balances={balances} balance={balance} />
            : null}
        </IonItemSliding>
    )
}

export default PersonalAccountItem