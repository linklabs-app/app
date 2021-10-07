import { HTMLAttributes } from "react"
import * as Icon from "@graywolfai/react-heroicons"

interface IButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  children?: any
  icon?: keyof typeof Icon
  theme?: keyof typeof themes
}

const themes = {
  normal: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  full: "bg-gray-50 text-gray-700 hover:bg-gray-100",
  inverted: "bg-gray-700 text-white hover:bg-gray-800",
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  success: "bg-green-500 text-white hover:bg-green-600",
}

export default function Button(props: IButtonProps) {
  const SelectedIcon = props.icon && Icon[props.icon]

  return (
    <a {...props} className={`
    inline-flex items-center justify-center
    ${themes[props.theme || "normal"]}
    rounded-lg
    cursor-pointer select-none
    py-2 ${props.icon ? "pl-3 pr-4" : "px-4"}
    no-underline
    ${props.className || ""}
    `.replace(/\s+/g, " ")}>
      {props.icon ? <SelectedIcon className={`w-6 h-6`} /> : <></>}
      {props.children}
    </a>
  )
}
