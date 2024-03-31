import { TagList } from "../../src/components/TagList";
import "@testing-library/jest-dom";
import React from 'react';
import { render } from '@testing-library/react';
import { createRandomTag } from "../../mock";


it("render correctly", () => {
  const tags = Array.from({length: 10}, (_, i) => createRandomTag({
    name: `Tag Name ${i}`
  }))
  const {getAllByText, container} = render(<TagList data={tags} />)
  const tagNames = getAllByText(/Tag Name/)
  expect(tagNames).toHaveLength(10)
  expect(container).toMatchSnapshot()
})