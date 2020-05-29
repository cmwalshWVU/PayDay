import Portis from '@portis/web3';

const PortisClient = new Portis(process.env.PORTIS_CLIENT_KEY ? process.env.PORTIS_CLIENT_KEY : "DEFAULT_KEY", 'mainnet');

export default PortisClient