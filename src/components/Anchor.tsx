import React from "react";

interface IAnchorProps {
  href: string,
  sameTab?: boolean,
  children: React.ReactChild | React.ReactChild[]
}

export default function Anchor(props: IAnchorProps) {
  return (
    <a className="text-blue-600 hover:underline" target={props.sameTab ? "_self" : "_blank"} href={props.href}>{props.children}</a>
  )
}