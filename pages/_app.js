import '../styles/globals.css'
import { GridProvider } from '../context/GridContext'

export default function App({ Component, pageProps }) {
  return (
    <GridProvider>
      <Component {...pageProps} />
    </GridProvider>
  )
}
