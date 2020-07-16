import Fortmatic from 'fortmatic';

const FortmaticClient = new Fortmatic(process.env.REACT_APP_FORTMATIC_API_KEY!!);

export default FortmaticClient