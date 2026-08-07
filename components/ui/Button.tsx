import React from 'react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

type ButtonProps = {
  variant?:  'primary' | 'ghost'
  as?:       'button' | 'a'
  children?: React.ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>

export function Button({ variant = 'primary', as: Tag = 'button', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors duration-200'
  const variants = {
    primary: 'bg-accent text-paper px-6 py-3 hover:bg-accent/90',
    ghost:   'text-smoke border border-line px-6 py-3 hover:text-paper hover:border-smoke',
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = Tag as any
  return (
    <Component className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Component>
  )
}
