import { forwardRef, LabelHTMLAttributes, PropsWithChildren } from 'react'

interface LabelProps extends PropsWithChildren<LabelHTMLAttributes<HTMLLabelElement>> {
    className?: string
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, children, ...props }) => (
        <label
            className={`${className} block font-medium text-sm text-gray-700`}
            {...props}>
            {children}
        </label>
    )
)
Label.displayName = 'Label'

export default Label
