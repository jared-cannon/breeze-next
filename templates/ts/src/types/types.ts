import z from 'zod'
import { UserSchema } from '@/types/schemas'

export type User = z.infer<typeof UserSchema>

export interface LaravelValidationError {
    message?: string
    errors?: FormError
}

export type FormError = {
    [field: string]: string[]
}
