import React, { useState } from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useSelector } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { IonHeader, IonToolbar, IonTitle, IonSearchbar, IonIcon, IonContent } from '@ionic/react';
import numbro from 'numbro';
import "./DesktopPriceList.scss"
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';

const columns = [
    { id: 'image', label: 'Name', align: 'left',  },
    { id: 'name', label: '', align: 'left' },
    { id: 'current_price', label: 'Price', align: 'right' },
    { id: 'price_change_percentage_24h', label: 'Percent Change', align: 'right' },
    { id: 'market_cap', label: 'Market Cap', align: 'right' },

]

const DesktopPriceList: React.FC = () => {
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)
    const [searchString, setSearchString] = useState("")

    const [sortingField, setSortingField] = useState<String>("")
    const [sortingDirection, setSortingDirection] = useState("")

    const theme = createMuiTheme({
        palette: {
          type: useDarkMode ? "dark" : "light",
        }
      });

    const buildCellValue = (value: any, columnId: any, symbol: any) => {
        if (value === null) {
            return value
        } else if (columnId === 'current_price') {
            return (
                <div style={{whiteSpace: 'nowrap' }}>
                    ${numbro(value).format({
                            thousandSeparated: true,
                            mantissa: 2,
                        })}
                </div>
            )
        } else if (columnId === "price_change_percentage_24h") {
            return (
                <div className={Number(value) > 0 ? 'positive' : 'negative'}>
                    {numbro(value).format({
                        thousandSeparated: true,
                        mantissa: 2,
                    })}%
                </div>
            )
        } else if (columnId === "name") {
            return (
                <div className="name-cell">
                    <div>{value}</div>
                    <div className="symbol">{symbol.toUpperCase()}</div>
                </div>
            )
        } else if (columnId === "market_cap") {
            return (
                <div style={{whiteSpace: 'nowrap' }}>
                    {numbro(value).format({
                        average: true,
                        totalLength: 4
                    })}
                </div>
            )
        } else {
            return value
        }
    }

    const buildCell = (value: any, column: any, symbol: any) => {
        if (column.id === "image") {
            return (
                <TableCell style={{ width: '40px' }} className={column.id} key={column.id} align={column.align}>
                    <img className={"holding-icon"} src={value} alt="N/A" />
                </TableCell>
              );
        } else {
            return (
                <TableCell style={{maxWidth: '100px', fontSize: '20px', fontWeight: 600 }} className={column.id} key={column.id} align={column.align}>
                    {buildCellValue(value, column.id, symbol)}
                </TableCell>
              );
        }

    }

    const setSorting = (sortString: String) => {
        const newSortString = sortString !== "image" ? sortString : "name"
        if (sortingField === newSortString) {
            if (sortingDirection === "asc") {
                setSortingField("")
                setSortingDirection("desc")
            } else if (sortingDirection === "desc") {
                setSortingDirection("asc")
            } else {
                setSortingDirection("desc")
            }
        } else {
            setSortingDirection("desc")
            setSortingField(newSortString)
        }
    }
    
    const showFilter = (column: String) => {
        const newColumn = column !== "image" ? column : "name"

        if (sortingField === newColumn && column !== "name") {
            if (sortingDirection === "asc") {
                return <IonIcon style={{verticalAlign: 'middle'}} icon={arrowUpOutline} />
            } else if (sortingDirection === "desc") {
                return <IonIcon style={{verticalAlign: 'middle'}} icon={arrowDownOutline} />
            }
        } 
        return null

    }

    const buildTable = () => {
        return (
            <Table stickyHeader className={useDarkMode ? `dark-table mat-elevation-z0` : 'light-table mat-elevation-z0'}  aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {columns.map((column: any) => {
                            return ( 
                                <TableCell key={column.id} onClick={() => setSorting(column.id)}
                                            style={{cursor: 'pointer', whiteSpace: 'nowrap'}}
                                            align={column.id === "name" ? "left" : column.align} >
                                    {column.label} {showFilter(column.id)}
                                </TableCell>
                            )}
                        )
                    }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentPrices.filter((it: any) => it.symbol.toLowerCase().includes(searchString.toLowerCase()) || it.name.toLowerCase().includes(searchString.toLowerCase()))
                    .sort((a: any, b: any) => {
                        if (sortingField === "price_change_percentage_24h") {
                            if (sortingDirection === "desc") {
                                return a.price_change_percentage_24h > b.price_change_percentage_24h ? -1 : 1
                            } else {
                                return a.price_change_percentage_24h > b.price_change_percentage_24h ? 1 : -1
                            }
                        } if (sortingField === "market_cap") {
                            if (sortingDirection === "desc") {
                                return a.market_cap > b.market_cap ? -1 : 1
                            } else {
                                return a.market_cap > b.market_cap ? 1 : -1
                            }
                        } else if (sortingField === "current_price") {
                            if (sortingDirection === "desc") {
                                return a.current_price > b.current_price ? -1 : 1
                            } else {
                                return a.current_price > b.current_price ? 1 : -1
                            }
                        } else if (sortingField === "name") {
                            if (sortingDirection === "desc") {
                                return a.name > b.name ? -1 : 1
                            } else {
                                return a.name > b.name ? 1 : -1
                            }
                        } else {
                            return a.market_cap > b.market_cap ? -1 : 1
                        }
                    }).map((row: any, index: any) => {
                        const symbol = row.symbol
                        return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                            {columns.map((column: any) => {
                                const value = row[column.id];
                                return buildCell(value, column, symbol)
                            })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }

    return (
        <IonContent>
            <div className="market-list-desktopview">
                <IonHeader className="market-header">
                    <IonToolbar>
                        <IonTitle className="market-title" size="large">
                            <div className="market-title-content">
                                <div className="title">Market</div>
                                <IonSearchbar className={`search-bar ${useDarkMode ?  "dark-bar" : null}`} value={searchString} onIonChange={(e: any) => setSearchString(e.detail.value)} />
                            </div>
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="table-container">
                    <ThemeProvider theme={theme}>
                        {buildTable()}
                    </ThemeProvider>
                </div>
            </div>
        </IonContent>
    )
}

export default React.memo(DesktopPriceList)