import React from 'react'
import styled from 'styled-components'
import tw from 'tailwind.macro'

const Main = styled.main`
  ${tw`bg-gray-300 flex flex-col font-sans justify-center min-h-screen`}
`

function Layout({ children }) {
  return <Main>{children}</Main>
}

export default Layout
