import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ disabled = false, className, ...props }) => (
    <input
        disabled={disabled}
        className={`${className} rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        {...props}
    />
))
Input.displayName = 'Input'

export default Input
