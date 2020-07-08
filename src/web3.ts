import Web3 from 'web3'
import PortisClient from './portis';
import { provider } from 'web3-core';

// const web3 = new Web3(PortisClient.provider)
const web3 = new Web3(process.env.REACT_APP_INFURA_URL as provider)

export default web3