import React, { useState } from 'react'
import { Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import tw from 'tailwind.macro'

const Button = styled.button`
  ${tw`bg-blue-500 border-0 cursor-pointer ml-4 px-4 py-2 rounded text-base text-white`}
`
const Section = styled.section`
  ${tw`bg-white mx-auto px-4 py-4 rounded shadow w-2/3 md:w-1/3`}
`
const StyledCardElement = styled(CardElement)`
  ${tw`flex-auto`}
`
const StyledForm = styled.form`
  ${tw`flex items-center`}
`
const Error = styled.div`
  ${tw`border border-red-200 border-solid bg-red-100 mt-4 p-2 rounded text-red-400 text-sm`}
`

function CheckoutForm({ stripe }) {
  const [checkoutError, setCheckoutError] = useState(null)
  const [cardElement, setCardElement] = useState(null)

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

      cardElement.clear()
    } catch (err) {
      setCheckoutError('There was a problem processing your payment')
    }
  }

  return (
    <Section>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => {
          return (
            <React.Fragment>
              <StyledForm onSubmit={handleSubmit}>
                <StyledCardElement onReady={el => setCardElement(el)} />
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting' : 'Submit'}
                </Button>
              </StyledForm>
              {checkoutError && <Error>{checkoutError}</Error>}
            </React.Fragment>
          )
        }}
      />
    </Section>
  )
}

export default injectStripe(CheckoutForm)
