import './ErrorPage.css';

const ErrorPage = ({ error }) => <div className="error-container"><h1 className="error-title">Ooops!</h1><p className="error-message">Error: {error.message}</p></div>;

export default ErrorPage;
