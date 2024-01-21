import React from 'react'
import {  Tag } from "../interfaces"
import { css } from '@emotion/css'

interface Props {
  data: Tag[]
}

export const TagList = ({ data }: Props) => {
  return (
    <div>
      {data.map((tag) => (
        <div
          key={tag.id}
          className={css`
              padding: 0.5rem 0;
              border-bottom: 1px solid var(--color-border, gray);
             `}
        >
          🏷️ {tag.name}
        </div>
      ))}
    </div>
  )
}