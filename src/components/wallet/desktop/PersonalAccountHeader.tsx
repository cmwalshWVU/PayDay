import React from 'react'
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/react';
import HoldingsPieChart from '../../holdings/charts/HoldingsPieChart';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/personalAccountHeader.scss'
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import { setWeb3 } from '../../../store/actions/userActions';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import ClipLoader from "react-spinners/ClipLoader";
import HoldingsHistoryChart from '../../holdings/charts/HoldingsHistoryChart';

interface Props {
    accounts: any
}


const PersonalAccountHeader: React.FC<Props> = ({accounts}) => {
    const web3 = useSelector((state: any) => state.user.web3)
    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

    const dispatch = useDispatch()

    const login = async () => {
        const providerOptions = {
          walletconnect: {
            package: WalletConnectProvider, // required
            options: {
              infuraId: "fe144c9b7ccd44fc9f4ef53807df0bc5" // required
            }
          },
          fortmatic: {
            package: Fortmatic, // required
            options: {
              key: "pk_live_633916DC39808625" // required
            }
          }
        };

        const web3Modal = new Web3Modal({
          network: "mainnet", // optional
          // cacheProvider: true, // optional
          theme: "dark",
          providerOptions // required
        });

        const provider = await web3Modal.connect()
        dispatch(setWeb3(new Web3(provider)))

    }

    if (web3) {
       if(accounts.length > 0) {
        return (
            <div className="personal-account-header">
                <IonCard className={`owners-acount ${!useDarkMode ? "light-card" : null}`} >
                    <IonCardContent>
                        <HoldingsHistoryChart />
                    </IonCardContent>
                </IonCard>
                <IonCard className={`owners-acount ${!useDarkMode ? "light-card" : null}`} >
                    <div className="pie-chart-wrapper">
                        <HoldingsPieChart series={[]} labels={[]} />
                    </div>
                </IonCard>
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
                        Connect Wallet
                    </IonButton>
                </IonCardContent>
            </IonCard>
        )
    }
}

export default PersonalAccountHeader
