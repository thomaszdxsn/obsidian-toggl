import {render} from '@testing-library/react'
import "@testing-library/jest-dom"
import {Button} from '../../src/components/Button'
import React from 'react'

it("should render loading icon if isLoading=true", () => {
  const {getByTestId, container} = render(<Button isLoading>Click me</Button>)
  const loadingIcon = getByTestId("loading-icon")
  expect(loadingIcon).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

it("should render children if isLoading=false", () => {
  const {queryByTestId, getByText, container} = render(<Button isLoading={false}>Click me</Button>)
  const loadingIcon = queryByTestId("loading-icon")
  expect(loadingIcon).not.toBeInTheDocument()
  const children = getByText("Click me")
  expect(children).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})