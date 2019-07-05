import React, { useState } from 'react'
import { Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import tw from 'tailwind.macro'

const Button = styled.button`
  ${tw`bg-blue-500 border-0 cursor-pointer ml-4 px-4 py-2 rounded text-base text-white`}

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
  ${tw`flex items-center`}
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

  async function onSubmit() {
    try {
      setCheckoutProcessing(true)
      setCheckoutError(false)

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
      setCheckoutProcessing(false)
    } catch (err) {
      setCheckoutProcessing(false)
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
      />
    </Section>
  )
}

export default injectStripe(CheckoutForm)
