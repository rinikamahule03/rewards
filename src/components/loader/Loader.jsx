import './Loader.css';
import { CircularProgress } from '@mui/material';

const Loader = () => <div className='loader-container'><CircularProgress sx={{ color: 'var(--primary-color)' }} /><div>Loading...</div></div>;

export default Loader;
