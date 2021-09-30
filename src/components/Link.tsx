import { HTMLAttributes } from "react"
import * as Icon from "@graywolfai/react-heroicons"

interface ILinkProps extends HTMLAttributes<HTMLAnchorElement> {
  children?: any
  icon?: keyof typeof Icon
  theme?: keyof typeof themes
}

const themes = {
  normal: "text-blue-500 hover:text-blue-600",
  highlight: "text-gray-500 hover:text-gray-600",
  inverted: "text-black hover:text-gray-700",
  primary: "text-white hover:text-gray-200",
  danger: "text-red-500 hover:text-red-600",
  warning: "text-yellow-500 hover:text-yellow-600",
  success: "text-green-500 hover:text-green-600",
}

export default function Link(props: ILinkProps) {
  const SelectedIcon = props.icon && Icon[props.icon]

  return (
    <a {...props} className={`
    inline-flex items-center align-bottom
    ${themes[props.theme || "normal"]}
    cursor-pointer select-none
    no-underline
    hover:underline
    ${props.className || ""}
    `.replace(/\s+/g, " ")}>
      {props.icon ? <SelectedIcon className="w-4 h-4 mx-1 inline" /> : <></>}
      {props.children}
    </a>
  )
}
