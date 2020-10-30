import React, { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setLoadingBalances } from '../store/actions/userActions';
import { setEthHoldings, setHoldings, setPieChartData } from '../store/actions/holdingsActions';
import { ERC20TOKENS } from '../components/Erc20Tokens';
import MinAbi from '../MinAbi';
import DesktopViewPage from './DesktopViewPage';

const DesktopApp: React.FC = () => {
    const web3 = useSelector((state: any) => state.user.web3)
    
    const accounts = useSelector((state: any) => state.user.accounts)

    const dispatch = useDispatch()
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)

    const ethBal = useSelector((state: any) => state.holdings.ethBalance)

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
    
    const fakeList = ["LRC","LINK", "BAT", "BAND", "LEND", "USDC"]
    const fakeHoldings = () => {
        return fakeList.map((ticker) => {
            const bal = Math.floor(Math.random() * 100) + 1000
            if (currentPrices.filter((it: any) => it.symbol === ticker.toLowerCase())[0]) {
                const name = currentPrices.filter((it: any) => it.symbol === ticker.toLowerCase())[0].name
                const currentHoldings = currentPrices.filter((it: any) => it.symbol === ticker.toLowerCase())[0].current_price * bal
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

                if (currentPrices.filter((it: any) => it.symbol === token.symbol.toLowerCase())[0]) {
                    const currentHoldings = currentPrices.filter((it: any) => it.symbol === token.symbol.toLowerCase())[0].current_price * bal
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
                dispatch(setPieChartData(filteredSet.map((it: any) => it[1]), filteredSet.map((it: any) => it[2])))
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

    return (
        <DesktopViewPage />
        // <BrowserRouter>
        //   <div className="desktopview">
        //         <Menu />
        //         <Switch>
        //             <Route path="/" component={DashboardPage} exact={true} />
        //             <Route path="/account" component={AccountView} exact={true} />
        //             <Route path="/market" component={DesktopPriceList} exact={true} />
        //             <Route path="/news" render={() => <DesktopArticleList news={[]} />} exact={true} />
        //             <Route render={() => <Redirect to="/" />} />
        //         </Switch>
        //     </div>
        // </BrowserRouter>
      )
}

export default DesktopApp