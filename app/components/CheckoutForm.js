import React, { useState } from 'react'
import { Field, Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import tw from 'tailwind.macro'

const Button = styled.button`
  ${tw`bg-blue-500 border-0 cursor-pointer px-4 py-2 rounded text-base text-white`}

  ${({ disabled }) => (disabled ? tw`bg-blue-200` : tw`bg-blue-500`)}
`
const Alert = styled.div`
  ${tw`border border-solid mt-4 p-2 rounded text-sm`}
`
const Section = styled.section`
  ${tw`bg-white mx-auto px-4 py-4 rounded shadow w-2/3 md:w-1/3`}
`
const StyledCardElement = styled(CardElement)`
  ${tw`border border-gray-300 border-solid flex-auto p-2 rounded`}

  ${({ disabled }) => (disabled ? tw`opacity-50` : tw`opacity-100`)}
`
const StyledForm = styled.form`
  ${tw`items-center`}
`
const StyledField = styled(Field)`
  ${tw`appearance-none bg-white block border border-gray-300 border-solid p-2 rounded w-full`}
`
const Error = styled(Alert)`
  ${tw`border-red-200 bg-red-100 text-red-400`}
`
const Processing = styled(Alert)`
  ${tw`border-blue-200 bg-blue-100 text-blue-400`}
`

function CheckoutForm({ stripe }) {
  const [checkoutError, setCheckoutError] = useState(null)
  const [checkoutProcessing, setCheckoutProcessing] = useState(null)
  const [cardElement, setCardElement] = useState(null)

  async function onSubmit({ amount, currency }) {
    try {
      setCheckoutProcessing(true)
      setCheckoutError(false)

      const stripePaymentIntent = await fetch('/api/intent', {
        method: 'POST',
        body: JSON.stringify({
          amount,
          currency
        })
      })
      const { client_secret } = await stripePaymentIntent.json()

      await stripe.handleCardPayment(client_secret)

      cardElement.clear()
      setCheckoutProcessing(false)
    } catch (err) {
      setCheckoutProcessing(false)
      setCheckoutError('There was a problem processing your payment')
    }
  }

  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount / 100)
  }

  return (
    <Section>
      <Form
        initialValues={{ amount: 1000, currency: 'usd' }}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, submitting, values }) => {
          const { amount, currency } = values

          return (
            <React.Fragment>
              <p>{formatCurrency(amount, currency)}</p>
              <StyledForm onSubmit={handleSubmit}>
                <div>
                  <StyledField name="amount" component="input" type="number" />
                </div>
                <div>
                  <StyledField name="currency" component="select">
                    <option value="usd">USD</option>
                    <option value="gbp">GBP</option>
                    <option value="eur">EUR</option>
                  </StyledField>
                </div>
                <StyledCardElement
                  onReady={el => setCardElement(el)}
                  disabled={submitting}
                />
                <Button type="submit" disabled={submitting}>
                  Submit
                </Button>
              </StyledForm>

              {checkoutProcessing && (
                <Processing>Processing your submission</Processing>
              )}
              {checkoutError && <Error>{checkoutError}</Error>}
            </React.Fragment>
          )
        }}
      </Form>
    </Section>
  )
}

export default injectStripe(CheckoutForm)
