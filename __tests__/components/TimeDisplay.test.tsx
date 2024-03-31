import { TimeDisplay } from "../../src/components/TimeDisplay";
import "@testing-library/jest-dom"
import React from 'react'
import {render}from '@testing-library/react'


it("render correctly", () => {
  const {getByText, container} = render(<TimeDisplay>10:00</TimeDisplay>)
  expect(getByText("10:00")).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})