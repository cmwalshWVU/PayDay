import React, { useEffect, useState } from 'react';
import { IonItem, IonAvatar, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from "@ionic/react";
import Identicon from 'react-identicons';
import { chevronDown, chevronUp, copy} from 'ionicons/icons';
import { useSelector } from 'react-redux';
import numbro from 'numbro'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import './accountItem.scss'

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

    console.log(balances)
    return (
        <IonItemSliding id="item100">
        <IonItem >
            <IonAvatar className={"avatar"} slot="start">
            <Identicon size={40} string={account.address} />
            </IonAvatar>
            <IonLabel>
            <h2>{account.name}</h2>
            <CopyToClipboard text={account.address}>
                <div className={"account-flex"} >
                Address: 
                <IonIcon className={"copy-icon"} icon={copy}/>
                <p className={"account"}>
                    {account.address}
                </p>
                </div>
            </CopyToClipboard>
            <h2 onClick={() => setShowBalances(!showBalances)}>Balances: <IonIcon className={"copy-icon"} icon={showBalances ? chevronUp: chevronDown }/></h2>
            {balances && showBalances ? 
                <div className="balance-list">
                    <div>
                        <img className={"holding-icon"} src={require(`cryptocurrency-icons/32/icon/eth.png`)}/> {numbro(web3.utils.fromWei(balance, 'ether')).format({thousandSeparated: true})} ETH
                    </div>
                    {balances.map((token) => {
                        let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
                        try {
                            icon = require(`cryptocurrency-icons/32/icon/${token[1].toLowerCase()}.png`); 
                        } catch (ex) {
                            console.log(`Using generic icon for ${token[1]}`)
                        }
                        return <div>
                                    <img className={"holding-icon"} src={icon}/> {token[0]} {token[1]}
                                </div>
                        })
                    }
                </div>
            : null}
            </IonLabel>
        </IonItem>
        </IonItemSliding>
    )
}

export default PersonalAccountItem