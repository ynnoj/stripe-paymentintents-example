import React, { useState } from 'react'
import { Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'

function CheckoutForm({ stripe }) {
  const [checkoutError, setCheckoutError] = useState(null)

  async function onSubmit() {
    try {
      const stripePaymentIntent = await fetch('/api/intent', {
        method: 'POST',
        body: JSON.stringify({
          amount: 9999,
          currency: 'usd'
        })
      })
      const { client_secret } = await stripePaymentIntent.json()

      await stripe.handleCardPayment(client_secret)
    } catch (err) {
      setCheckoutError(err)
    }
  }

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            {checkoutError && { checkoutError }}
            <CardElement />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting' : 'Submit'}
            </button>
          </form>
        )
      }}
    />
  )
}

export default injectStripe(CheckoutForm)
