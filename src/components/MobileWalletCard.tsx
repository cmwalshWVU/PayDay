import React, { useState, useEffect, useCallback } from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonToolbar, IonSegment, IonSegmentButton, IonIcon } from '@ionic/react';
import HoldingsPieChart from './holdings/HoldingsPieChart';
import { useSelector, useDispatch } from 'react-redux';
import './personalAccountHeader.scss'
import { setEthHoldings, setHoldings } from '../store/actions/holdingsActions';
import { setWeb3, setLoadingBalances } from '../store/actions/userActions';
import Web3 from 'web3';
import ClipLoader from "react-spinners/ClipLoader";
import MinAbi from '../MinAbi';
import { ERC20TOKENS } from './Erc20Tokens';
import HoldingsHistoryChart from './holdings/HoldingsHistoryChart';
import { pieChartOutline, trendingUpOutline } from 'ionicons/icons';

interface Props {
    accounts: any
    openTransak: (address: string) => void
    openModal: (open: boolean, address: string) => void
}


const MobileWalletCard: React.FC<Props> = ({accounts, openTransak, openModal}) => {
    
    const [selectedTab, setSelectedTab] = useState("pieChart")


    const web3 = useSelector((state: any) => state.user.web3)
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    
    const [series, setSeries] = useState<any>([])
    const [labels, setLabels] = useState<any>([])
    const walletConnector = useSelector((state: any) => state.user.walletConnector)

    const ethBal = useSelector((state: any) => state.holdings.ethBalance)

    const dispatch = useDispatch()
    const getEthBalance = useCallback(async () => {
        try {
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
    }, [accounts, currentPrices, dispatch, web3])
    
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

    const login = async () => {
        walletConnector.connect().then((provider: any) => {
            dispatch(setWeb3(new Web3(provider)))
        });
    }

    const buildHoldingsList = useCallback(() => {

        if (accounts[0]) {
            dispatch(setLoadingBalances(true))
            const bals = [...ERC20TOKENS, ].map(async (token) => {
                // GET TOKEN contract and decimals
                const contract = new web3.eth.Contract(MinAbi, token.address);
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
                dispatch(setLoadingBalances(false))

                const filteredSet = finalBalances.filter((it) => Number(it[0]) > 0 )
                
                dispatch(setHoldings(finalBalances.filter((it) => Number(it[0]) > 0 )))
                if (Number(ethBal) > 0) {
                    filteredSet.push([ethBal, ethBal, "ETH", "Ethereum"])
                }
                setSeries(filteredSet.map((it: any) => it[1]))
                setLabels(filteredSet.map((it: any) => it[2]))
            })
        }
    }, [accounts, currentPrices, dispatch, ethBal, web3])

    useEffect(() => {
        buildHoldingsList()
    }, [accounts, currentPrices, ethBal, buildHoldingsList])

    useEffect(() => {
        getEthBalance()
    }, [accounts, currentPrices, getEthBalance])
    

    if (web3) {
       if(accounts.length > 0) {
        return (
            <div>
                <IonToolbar>
                    <IonSegment className={"wallet-chart-toolbar"} value={selectedTab} onIonChange={(e: any) => setSelectedTab(e.detail.value)}>
                        <IonSegmentButton value="pieChart">
                            <IonIcon icon={pieChartOutline} />
                        </IonSegmentButton>
                        <IonSegmentButton value="lineChart">
                            <IonIcon icon={trendingUpOutline} />
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
                {selectedTab === "pieChart" ?
                    <div className="pie-chart-wrapper">
                        <HoldingsPieChart series={series} labels={labels} />
                    </div>
                :
                    <HoldingsHistoryChart />
                }
            </div>
        )
       } else {
           return (
                <IonCard className="loading-wallets-card">
                    <IonCardContent>
                        <div className="loading-wallets-text">
                            Loading Wallet
                            <ClipLoader
                                size={150}
                                color={"#123abc"}
                                loading={true}
                                />
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
                    <IonButton onClick={() => login()}>
                        Connect Your Wallet
                    </IonButton>
                </IonCardContent>
            </IonCard>
        )
    }
}

export default MobileWalletCard
