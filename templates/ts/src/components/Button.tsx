import React, {
    forwardRef,
    ButtonHTMLAttributes
} from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ type = 'submit', className = '', ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                className={`${className} inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export default Button
