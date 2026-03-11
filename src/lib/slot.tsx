import * as React from "react"

const Slot = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }
>(({ children, ...props }, forwardedRef) => {
  const childrenArray = React.Children.toArray(children)
  const cloneable = childrenArray.find(child => React.isValidElement(child))

  if (cloneable) {
    return (
      <>
        {React.cloneElement(cloneable, {
          ...props,
          ref: forwardedRef,
        } as any)}
        {childrenArray.map((child, _index) =>
          child === cloneable ? null : child
        )}
      </>
    )
  }

  return (
    <span ref={forwardedRef} {...props}>
      {children}
    </span>
  )
})

Slot.displayName = "Slot"

export { Slot }
