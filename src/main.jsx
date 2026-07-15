import ReactDOM from 'react-dom/client'
import App from './App'
// Inline: en Render el .css separado llegó a devolver 404;
// embeberlo en el JS evita depender de /assets/*.css
import cssText from './styles.css?inline'

const style = document.createElement('style')
style.setAttribute('data-totem-css', '1')
style.textContent = cssText
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
