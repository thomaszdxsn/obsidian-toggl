import { Timeline } from "../../src/components/Timeline";
import "@testing-library/jest-dom";
import React from 'react';
import { render } from '@testing-library/react';


it("render label when showLabel=true", () => {
  const items = [
    { color: "red", label: "Item 1", percentage: 0.5 },
    { color: "blue", label: "Item 2", percentage: 0.5 }
  ]
  const {getByText, container} = render(<Timeline direction="horizontal" items={items} showLabel={true} />)
  expect(getByText("Item 1")).toBeInTheDocument()
  expect(getByText("Item 2")).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})

it("don't render label when showLabel=false", () => {
  const items = [
    { color: "red", label: "Item 1", percentage: 0.5 },
    { color: "blue", label: "Item 2", percentage: 0.5 }
  ]
  const {queryByText, container} = render(<Timeline direction="horizontal" items={items} showLabel={false} />)
  expect(queryByText("Item 1")).toBeNull()
  expect(queryByText("Item 2")).toBeNull()
  expect(container).toMatchSnapshot()
})

it("itemClassName should assign to each timeline item", () => {
  const items = [
    { color: "red", label: "Item 1", percentage: 0.5 },
    { color: "blue", label: "Item 2", percentage: 0.5 }
  ]
  const {container, getAllByTestId} = render(<Timeline direction="horizontal" items={items} itemClassName="item-class" />)
  const item1 =  getAllByTestId("timeline-item")[0]
  expect(item1).toBeInTheDocument()
  expect(container).toMatchSnapshot()
})