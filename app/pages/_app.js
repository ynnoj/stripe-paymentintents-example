import App, { Container } from 'next/app'
import Head from 'next/head'
import { createGlobalStyle } from 'styled-components'

import Layout from '../components/Layout'
import StripeProvider from '../components/StripeProvider'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0
  }
`

class StripeApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <script id="stripe-js" src="https://js.stripe.com/v3/" async />
        </Head>
        <StripeProvider>
          <React.Fragment>
            <GlobalStyle />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </React.Fragment>
        </StripeProvider>
      </Container>
    )
  }
}

export default StripeApp
