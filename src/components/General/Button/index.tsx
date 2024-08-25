import { ComponentChildren } from 'preact'
import styles from './index.module.css'

interface BaseButton {
  children: ComponentChildren
  type?: 'primary' | 'danger'
  disabled?: boolean
}

interface LinkButton {
  href: string
}

interface ActionButton {
  onClick: () => void
}

type ButtonProps = BaseButton & (LinkButton | ActionButton)

export function Button(props: ButtonProps) {
  const className = [
    styles.button,
    styles[props.type ?? 'primary'],
    props.disabled ? styles.disabled : null
  ].join(' ')

  if ('href' in props) {
    return (
      <a href={props.href} className={className}>
        {props.children}
      </a>
    )
  }

  return (
    <button
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}
