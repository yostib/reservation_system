import './Loader.css';

function Loader({ fullPage = false }) {
    return (
        <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
            <div className="loader-spinner"></div>
        </div>
    );
}

export default Loader;