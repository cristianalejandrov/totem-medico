import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Sin StrictMode: su doble montaje en desarrollo duplica la carga del
// canvas Live2D y hace hablar dos veces al avatar.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
