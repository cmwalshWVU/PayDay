import Portis from '@portis/web3';

const PortisClient = new Portis(process.env.REACT_APP_PORTIS_CLIENT_KEY ? process.env.REACT_APP_PORTIS_CLIENT_KEY : 'DEFAULT_PORTIS_KEY', 'mainnet');

export default PortisClient