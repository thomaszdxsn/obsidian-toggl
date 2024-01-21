import React from 'react'
import { useAtomValue } from "jotai"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { tagsAtom } from "src/atoms"
import { useCreateTagMutation } from "../hooks"
import { css } from '@emotion/css'
import { Button } from './Button'
import { FiCornerUpLeft, FiRefreshCw } from 'react-icons/fi'


interface Props {
  onSuccess: () => void
  tagId?: number
}


export const TagForm = ({ onSuccess, tagId }: Props) => {
  const tags = useAtomValue(tagsAtom)
  const tag = useMemo(() => tags.find(tag => tag.id === tagId), [tagId])
  const form = useForm({
    defaultValues: {
      name: tag?.name || "",
    },
  })
  const createTagMutation = useCreateTagMutation()

  const onSubmit = async () => {
    const data = form.getValues()
    createTagMutation.mutate(data.name, {
      onSuccess: () => onSuccess?.()
    })
  }
  const isPending = createTagMutation.isPending

  return (
    <form
      className={css`
    display: flex;
    flex-direction: column;
    gap: var(--size-4-2);
  `}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <label
        className={css`
                display: flex;
                flex-direction: column;
                gap: var(--size-4-1);
              `}
      >
        <span>Name</span>
        <input type="text" {...form.register("name")} />
      </label>
      <footer className={
        css`
          display: flex;
          gap: var(--size-4-2);
          justify-content: center;
        `
      }>
        <Button
          type="submit"
          disabled={isPending}
          className={css`
            cursor: pointer;
          `}
        >
          {isPending ?
            <FiRefreshCw className={
              css`
                    animation: spin 1s linear infinite
                  `
            } />
            : <FiCornerUpLeft />}
        </Button>
      </footer>
    </form>
  )
}