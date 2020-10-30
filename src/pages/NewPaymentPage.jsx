import React, { useEffect, useState, useCallback } from 'react';
import { IonList, IonContent, IonPage, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import './PaymentPage.scss';
import transakSDK from '@transak/transak-sdk'
import { useSelector, useDispatch } from 'react-redux';
import Firebase, { signInWithCustomToken, createAccountCollectionIfNotExists } from '../firebase';
import { setContacts, setWeb3, setLoadingBalances, setUser } from '../store/actions/userActions';
import { withRouter } from 'react-router';
import PersonalAccountItem from '../components/contacts/personalAccountItem'
import { erc20ContractAbi } from '../components/Erc20TokenAbi';
import { isString } from 'util';
import TransferModal from '../components/modals/TransferModal';
import LandingPageComponent from '../components/LandingPageComponent';
import Web3 from 'web3';
import { ERC20TOKENS } from '../components/Erc20Tokens';
import MobileWalletCard from '../components/NewMobileWalletCard';
import { setEthHoldings, setHoldings, setPieChartData } from '../store/actions/holdingsActions';
import MinAbi from '../MinAbi';
import { toast } from '../components/toast';
import HoldingsList from '../components/holdings/HoldingsList';


const PaymentPage = (props) => {
  const [accounts, setaccounts] = useState([])
  const [account, setAccount] = useState([])
  const [balance, setBalance] = useState("0");
  const [tokenToSend, setTokenToSend] = useState("ETH")

  const ethHoldings = useSelector((state) => state.holdings.ethHoldings)
  const holdings = useSelector((state) => state.holdings.holdings)
  const web3 = useSelector((state) => state.user.web3)
  const currentPrices = useSelector((state) => state.prices.currentPrices)
  const useDarkMode = useSelector((state) => state.user.useDarkMode)

  const [open, setOpen] = useState(false)
  const [transferToAddress, setTransferToAddress] = useState("")

  const dispatch = useDispatch()
  const walletConnector = useSelector((state) => state.user.walletConnector)

  const login = async () => {
    const provider = await walletConnector.connect()
    dispatch(setWeb3(new Web3(provider)))
  }

  const openModal = (open, address) => {
    setTransferToAddress(address)
    setOpen(true)
  }

  const closeModal = () => {
    setTransferToAddress("")
    setOpen(false)
  }

  const ethBal = useSelector((state) => state.holdings.ethBalance)

    const getEthBalance = useCallback(async () => {
        try {
            const amount = await web3.eth.getBalance(accounts[0])
            if (amount) {
                const holdings =  Number(currentPrices.filter((it) => it.symbol === "eth")[0].current_price) * Number(web3.utils.fromWei(amount, 'ether'))

                dispatch(setEthHoldings(amount, holdings))
            } else {
                return 0
            }
            } catch (ex) {
            return 0
        }
    }, [accounts, currentPrices, dispatch, web3])

    const fakeList = ["LRC","LINK", "BAT", "BAND", "LEND", "USDC"]
    const fakeHoldings = () => {
        return fakeList.map((ticker) => {
            const bal = Math.floor(Math.random() * 100) + 1000
            if (currentPrices.filter((it) => it.symbol === ticker.toLowerCase())[0]) {
                const name = currentPrices.filter((it) => it.symbol === ticker.toLowerCase())[0].name
                const currentHoldings = currentPrices.filter((it) => it.symbol === ticker.toLowerCase())[0].current_price * bal
                return [bal.toFixed(4), currentHoldings, ticker, name]
            }
            return [0]
        })
    }

    const buildHoldingsList = useCallback(() => {
        if (accounts[0] && web3) {
            dispatch(setLoadingBalances(true))
            const bals = [...ERC20TOKENS, ].map(async (token) => {
                // GET TOKEN contract and decimals
                const contract = new web3.eth.Contract(MinAbi, token.address);
                const dec = await contract.methods.decimals().call()

                // GET ERC20 Token Balance and divide by decimals
                let bal = await contract.methods.balanceOf(accounts[0]).call()

                bal = bal / (10 ** dec)

                if (currentPrices.filter((it) => it.symbol === token.symbol.toLowerCase())[0]) {
                    const currentHoldings = currentPrices.filter((it) => it.symbol === token.symbol.toLowerCase())[0].current_price * bal
                    return [bal, currentHoldings, token.symbol, token.name]
                }
                return [0]
            })
            Promise.all(bals).then((finalBalances) => {
                const fake = fakeHoldings()
                finalBalances.push(...fake)
                dispatch(setLoadingBalances(false))

                const filteredSet = finalBalances.filter((it) => Number(it[0]) > 0 )
                dispatch(setHoldings(finalBalances.filter((it) => Number(it[0]) > 0 )))
                if (Number(ethBal) > 0) {
                    filteredSet.push([ethBal, ethBal, "ETH", "Ethereum"])
                }
                dispatch(setPieChartData(filteredSet.map((it) => it[1]), filteredSet.map((it) => it[2])))
                // setSeries(filteredSet.map((it: any) => it[1]))
                // setLabels(filteredSet.map((it: any) => it[2]))
            })
        }
    }, [accounts, currentPrices, dispatch, ethBal, web3])

    useEffect(() => {
        buildHoldingsList()
    }, [accounts, currentPrices, ethBal, buildHoldingsList])

    useEffect(() => {
        getEthBalance()
    }, [accounts, currentPrices, getEthBalance])


  let calculateHexValue = (value, decimals, BN) => {
    if (!isString(value)) {
      throw new Error('Pass strings to prevent floating point precision issues.')
    }
    const ten = new BN(10)
    const base = ten.pow(new BN(decimals))

    if (value === '.') {
      throw new Error(
      `Invalid value ${value} cannot be converted to`
      + ` base unit with ${decimals} decimals.`)
    }

    // Split it into a whole and fractional part
    let comps = value.split('.')
    if (comps.length > 2) { throw new Error('Too many decimal points'); }
  
    let whole = comps[0], fraction = comps[1];
  
    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > decimals) {
      throw new Error('Too many decimal places')
    }

    while (fraction.length < decimals) {
      fraction += '0'
    }

    whole = new BN(whole)
    fraction = new BN(fraction)
    let result = (whole.mul(base)).add(fraction)

    return web3.utils.toHex(result)
  }

  const openFortmaticTransfer = (transferAmount, fromAddress, toAddress) => {

    if (tokenToSend === "ETH") {
      const sendValue = web3.utils.toWei(transferAmount, 'ether'); // Convert 1 ether to wei

      // Construct Ether transaction params
      const txnParams = {
        from: fromAddress,
        to: toAddress,
        value: sendValue
      }
      
      // Send Ether transaction with web3
      web3.eth.sendTransaction(txnParams)
        .once('transactionHash', (hash) => { console.log(hash); })
        .once('receipt', (receipt) => { 
          closeModal()
          console.log(receipt); 
        });
    } else {
      let contractAddress = tokenToSend.address
      let erc20Contract = new web3.eth.Contract(erc20ContractAbi, contractAddress);
      erc20Contract.methods.decimals().call().then((decimals) => {
        // Calculate contract compatible value for transfer with proper decimal points using BigNumber
        let calculatedValue = calculateHexValue(transferAmount, decimals, web3.utils.BN);
        erc20Contract
            .methods
            .transfer(toAddress, calculatedValue)
            .send({ from: fromAddress }, (err, txnHash) => {
              console.log(err);
              console.log(txnHash);
              closeModal()
            })
      })
    }
  }

  const user = useSelector((state) => state.user.user)

  const getAccounts = useCallback(async () => {
    if (web3 && web3.eth) {
      dispatch(setLoadingBalances(true))
      web3.eth.getAccounts().then(async accounts => {
        setAccount(accounts[0])
        setaccounts(accounts)

        if (!user) {
          signInWithCustomToken(accounts[0]).then((user) => {
            toast("Sucessfully Logged In")
            createAccountCollectionIfNotExists(accounts[0])
            dispatch(setUser(user))
            // return <Redirect to="/wallet" />
          })
        }
        const amount = await web3.eth.getBalance(accounts[0])
        if (amount) {
          return setBalance(web3.utils.fromWei(amount.toString(), 'ether'))
        } else {
          return 0
        }
      })
    }
  }, [dispatch, user, web3])


  useEffect(() => {
    if (user) {
      getAccounts()
      const holdings = Firebase.firestore().collection('dailyHoldings').doc(user.uid).collection("holdingsHistory")
      console.log(holdings.docs)
      const accounts = Firebase.firestore().collection('accounts').doc(user.uid).collection("accounts")
      accounts.onSnapshot(querySnapshot => {
          const accounts = []
          querySnapshot.docs.forEach(doc => {
              const data = doc.data()
              accounts.push(data)
          });
          dispatch(setContacts(accounts))
      }, err => {
          console.log(`Encountered error: ${err}`);
      });
    }
  }, [web3, user, dispatch, getAccounts]);
  
  const openTransak = (address) => {
    let transak = new transakSDK({
      apiKey: process.env.REACT_APP_TRANSAK_API_KEY,  // Your API Key
      environment: 'PRODUCTION', // STAGING/PRODUCTION
      hostURL: window.location.origin,
      defaultCryptoCurrency: 'ETH',
      networks: 'ethereum',
      walletAddress: address, // Your customer's wallet address
      themeColor: '6851ff', // App theme color
      fiatCurrency: 'USD', // INR/GBP
      widgetHeight: '600px',
      widgetWidth: '400px'
    });
    
    transak.init();
    
    transak.on(transak.ALL_EVENTS, (data) => {
        console.log(data)
    });

    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (data) => {
      transak.close();
    })
    
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log(orderData);
        transak.close();
    });
  }

  useEffect(() => {
    getAccounts()
  }, [web3, getAccounts])

  return (
    <IonPage id="mobile-view">
      <div className="wallet" >
      { user !== null ?
        <IonContent className={"ion-padding home-page light-card"} >
          <MobileWalletCard accounts={accounts} openTransak={openTransak} openModal={openModal} />
          {accounts.length > 0 ? 
            <>
              <IonList style={{background: "transparent"}} className={"account-list"} >
                {accounts.map((account) => 
                  <PersonalAccountItem tokens={ERC20TOKENS} openModal={openTransak} ownersAccount={true} openTransak={openTransak} account={{name: "", address: account}} />
                )}
              </IonList>
              <IonButton onClick={() => openTransak(accounts[0])}>
                Buy Crypto
              </IonButton>
              <IonButton size={"normal"}  onClick={() => openModal(true, "")} >
                Transfer Funds
              </IonButton>
            </>
            : 
              <IonButton onClick={() => login()}>
                Connect Wallet
              </IonButton>
            }

            <HoldingsList balances={holdings} balance={ethHoldings} personalAccount={true} />

        </IonContent>
      : 
        <IonContent className="ion-padding">
          <LandingPageComponent />
        </IonContent>}

      <TransferModal  open={open}
                      setOpen={setOpen}
                      setTokenToSend={setTokenToSend}
                      tokenToSend={tokenToSend}
                      account={account}
                      setTransferToAddress={setTransferToAddress}
                      transferToAddress={transferToAddress}
                      balance={balance}
                      openFortmaticTransfer={openFortmaticTransfer} />
    </div>
    </IonPage>
  );
};

export default withRouter(React.memo(PaymentPage))
