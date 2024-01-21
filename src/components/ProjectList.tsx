import React from 'react'
import { Project } from "../interfaces"
import { css } from '@emotion/css'

interface Props {
  data: Project[]
}

export const ProjectList = ({ data }: Props) => {
  return (
    <div>
      {data.map((project: Project) => (
        <div style={{ color: project.color }}
          key={project.id}
          className={css`
              padding: 0.5rem 0;
              border-bottom: 1px solid var(--color-border, gray);
             `}
        >
          {project.name}
        </div>
      ))}
    </div>
  )
}