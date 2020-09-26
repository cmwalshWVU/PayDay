import React, { useState, useEffect } from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';
import HoldingsPieChart from './holdings/HoldingsPieChart';
import { ERC20TOKENS } from './Erc20Tokens';
import FortmaticClient from '../fortmatic';
import { useSelector, useDispatch } from 'react-redux';
import './personalAccountHeader.scss'
import { setEthHoldings, setHoldings } from '../store/actions/holdingsActions';
import HoldingsListCard from './holdings/HoldingsListCard';

interface Props {
    accounts: any
    openTransak: () => void
    setPurchaseModalOpen: any
    openModal: (open: boolean, address: string) => void
}

const PersonalAccountHeader: React.FC<Props> = ({accounts, openTransak, openModal, setPurchaseModalOpen}) => {
    
    const fortmatic = useSelector((state: any) => state.user.fortmatic)
      
    const web3 = useSelector((state: any) => state.user.web3)
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    
    const [balances, setTokenBalances] = useState<any>(null)
    const [series, setSeries] = useState<any>([])
    const [labels, setLabels] = useState<any>([])

    const ethBal = useSelector((state: any) => state.holdings.ethBalance)

    const dispatch = useDispatch()
    const getEthBalance = async () => {
        try {
            console.log("getting eth bal")
            const amount = await web3.eth.getBalance(accounts[0])
            if (amount) {
                const holdings =  Number(currentPrices.filter((it:any) => it.symbol === "eth")[0].current_price) * Number(web3.utils.fromWei(amount, 'ether'))

                dispatch(setEthHoldings(amount, holdings))
            } else {
                return 0
            }
            } catch (ex) {
            return 0
        }
    }

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
    
    const fakeList = ["LINK", "BAT", "BAND", "LEND", "USDC"]
    const fakeHoldings = () => {
        return fakeList.map((ticker) => {
            const bal = Math.floor(Math.random() * 100) + 100
            if (currentPrices.filter((it: any) => it.symbol === ticker.toLowerCase())[0]) {
                const name = currentPrices.filter((it: any) => it.symbol === ticker.toLowerCase())[0].name
                const currentHoldings = currentPrices.filter((it: any) => it.symbol === ticker.toLowerCase())[0].current_price * bal
                return [bal.toFixed(4), currentHoldings, ticker, name]
            }
            return [0]
        })
    }

    const buildHoldingsList = () => {

        console.log(currentPrices)
        if (accounts[0]) {
            const bals = [...ERC20TOKENS, ].map(async (token) => {
                // GET TOKEN contract and decimals
                const contract = new web3.eth.Contract(minABI, token.address);
                const dec = await contract.methods.decimals().call()

                // GET ERC20 Token Balance and divide by decimals
                let bal = await contract.methods.balanceOf(accounts[0]).call()

                bal = bal / (10 ** dec)

                if (currentPrices.filter((it: any) => it.symbol === token.symbol.toLowerCase())[0]) {
                    const currentHoldings = currentPrices.filter((it: any) => it.symbol === token.symbol.toLowerCase())[0].current_price * bal
                    return [bal, currentHoldings, token.symbol, token.name]
                }
                return [0]
            })
            Promise.all(bals).then((finalBalances) => {
                // const fake = fakeHoldings()
                // finalBalances.push(...fake)
                const filteredSet = finalBalances.filter((it) => Number(it[0]) > 0 )
                
                setTokenBalances(finalBalances.filter((it) => Number(it[0]) > 0 ))
                dispatch(setHoldings(finalBalances.filter((it) => Number(it[0]) > 0 )))
                if (Number(ethBal) > 0) {
                    filteredSet.push([ethBal, ethBal, "ETH", "Ethereum"])
                }
                setSeries(filteredSet.map((it: any) => it[1]))
                setLabels(filteredSet.map((it: any) => it[2]))
            })
        }
    }

    useEffect(() => {
        buildHoldingsList()
    }, [accounts, currentPrices, ethBal])

    useEffect(() => {
        getEthBalance()
    }, [accounts])
    

    if (fortmatic.user.isLoggedIn()) {
       if(accounts.length > 0 && balances) {
        return (
            <div className="personal-account-header">
                <HoldingsListCard accounts={accounts} openTransak={openTransak} setPurchaseModalOpen={setPurchaseModalOpen} openModal={openModal}/>
                <IonCard className={"owners-acount"} >
                    <div className="pie-chart-wrapper">
                        <HoldingsPieChart series={series} labels={labels} />
                    </div>
                </IonCard>
            </div>
        )
       } else {
           return (
                <IonCard className="loading-wallets-card">
                    <IonCardContent>
                        <div className="loading-wallets-text">
                            Loading Wallet...
                        </div>
                    </IonCardContent>
                </IonCard>)
       }
    } else {
        return (
            <IonCard className={"owners-acount not-logged-in"} >
                <IonCardHeader>
                    <IonCardTitle className={"accounts-title"} >
                    Personal Account
                    </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="personal-account-header">
                    <IonButton onClick={() => fortmatic.user.login()}>
                        Sign Up /Login To Fortmatic
                    </IonButton>
                </IonCardContent>
            </IonCard>
        )
    }
}

export default PersonalAccountHeader
