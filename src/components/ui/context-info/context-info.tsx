import { PropsWithChildren, ReactNode } from "react"

import { keyframes, css } from "goober"
import { Ghost } from "lucide-react"

import { Icon } from "components/ui/icon"
import { IconProp } from "types/base-props"
import { cn } from "utils/cn"

import { hstack, vstack } from "../../../utils/styles"

const animationOptions = "2.5s infinite ease-in-out"

const floatShadow = css`
  animation: ${animationOptions} ${keyframes`
  0%, 100% {
    transform: translateX(1.5rem);
    width: 3.25rem;
    height: 0.5rem;
    opacity: 0.5;
  }
  25%, 75% {
    width: 3.1rem;
    opacity: 0.4;
  }
  50% {
    transform: translateX(-1.5rem);
    width: 3.25rem;
    height: 0.5rem;
    opacity: 0.5;
  }
`};
`
const rotateShadow = css`
  animation: ${animationOptions} ${keyframes`
     0%, 100% {
      transform: translateX(0.25rem);
      width: 4.5rem;
      height: 0.5rem;
      opacity: 0.5;
    }
    50% {
      transform: translateX(-0.25rem);
      width: 4.5rem;
      height: 0.5rem;
      opacity: 0.5;
    }
  `};
`

const floatIcon = css`
  animation: ${animationOptions} ${keyframes`
    0%, 100% {
      translate: 1rem;
      rotate: -10deg;
      top: 0;
    }
    25%, 75% {
      top: -1rem;
    }
    50% {
      translate: -1rem;
      rotate: 10deg;
      top: 0;
    }
  `};
`
const rotateIcon = css`
  animation: ${animationOptions} ${keyframes`
    0%, 100% {
      rotate: 10deg;
      translate: 0.25rem 0;
    }
    50% {
      rotate: -10deg;
      translate: -0.25rem 0;
    }
  `};
`

interface ContextInfoProps extends IconProp {
  label: string | ReactNode
  animateIcon?: "float" | "rotate"
}
export const ContextInfo = ({
  icon = Ghost,
  label,
  animateIcon = "float",
  children,
}: PropsWithChildren<ContextInfoProps>) => (
  <div className={cn(vstack({ align: "center", gap: 4 }), "py-4")}>
    <div
      className={cn(
        hstack({ align: "center", justify: "center" }),
        "relative mb-4 size-20"
      )}
    >
      <Icon
        icon={icon}
        color="gentle"
        className={cn(
          "absolute size-18",
          animateIcon === "float" && floatIcon,
          animateIcon === "rotate" && rotateIcon
        )}
      />
      <div
        className={cn(
          "absolute -bottom-4 rounded-[50%] bg-[black]",
          animateIcon === "float" && floatShadow,
          animateIcon === "rotate" && rotateShadow
        )}
      />
    </div>
    <span className="block max-w-80 text-center font-bold text-text-gentle">
      {label}
    </span>
    {children && (
      <div className={cn(vstack({ gap: 2 }), "text-text-gentle")}>
        {children}
      </div>
    )}
  </div>
)
