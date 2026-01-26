import './Loader.css';
import { CircularProgress } from '@mui/material';

const Loader = () => <div className='loader-container'><CircularProgress sx={{ color: '#1c697e' }} /><div>Loading...</div></div>;

export default Loader;
