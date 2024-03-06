import { z } from 'nestjs-zod/z'

export const JsonSchema = ({
  schema,
  label,
  strict = true,
}: {
  schema: z.ZodSchema
  label: string
  strict?: boolean
}) =>
  z
    .any()
    .transform((content, ctx) => {
      try {
        const parsed = JSON.parse(content)
        return parsed
      } catch (error) {
        if (strict) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El filtro para ${label} es inválido.`,
          })
          return z.NEVER
        }
        return content
      }
    })
    .pipe(schema)

export const NullableNumberFilterSchema = (label: string) =>
  z.union([
    z.number(),
    z.null(),
    z
      .object({
        $not: z.union([z.number(), z.null()]).optional(),
        $gte: z.number().optional(),
        $lte: z.number().optional(),
        $in: z.array(z.union([z.number(), z.null()])).optional(),
        $notIn: z.array(z.union([z.number(), z.null()])).optional(),
      })
      .superRefine((val, ctx) => {
        if (val.$gte && val.$lte && +val.$gte > +val.$lte) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El rango de valores para ${label} es inválido.`,
          })
        }
      }),
  ])

export const NumberFilterSchema = (label: string) =>
  z.union([
    z.number(),
    z
      .object({
        $not: z.number().optional(),
        $gte: z.number().optional(),
        $lte: z.number().optional(),
        $in: z.array(z.number()).optional(),
        $notIn: z.array(z.number()).optional(),
      })
      .superRefine((val, ctx) => {
        if (val.$gte && val.$lte && val.$gte > val.$lte) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El rango de valores para ${label} es inválido.`,
          })
        }
      }),
  ])

export const NullableStringFilterSchema = z.union([
  z.string(),
  z.null(),
  z.object({
    $not: z.union([z.string(), z.null()]).optional(),
    $contains: z.string().optional(),
    $notContains: z.string().optional(),
    $in: z.array(z.union([z.string(), z.null()])).optional(),
    $notIn: z.array(z.union([z.string(), z.null()])).optional(),
  }),
])
export const StringFilterSchema = z.union([
  z.string(),
  z.object({
    $not: z.string().optional(),
    $contains: z.string().optional(),
    $notContains: z.string().optional(),
    $in: z.array(z.string()).optional(),
    $notIn: z.array(z.string()).optional(),
  }),
])

export const NullableDateFilterSchema = (label: string) =>
  z.union([
    z.date(),
    z.null(),
    z
      .object({
        $not: z.union([z.date(), z.null()]).optional(),
        $gte: z.date().optional(),
        $lte: z.date().optional(),
        $in: z.array(z.union([z.date(), z.null()])).optional(),
        $notIn: z.array(z.union([z.date(), z.null()])).optional(),
      })
      .superRefine((val, ctx) => {
        if (val.$gte && val.$lte && val.$gte > val.$lte) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El rango de valores para ${label} es inválido.`,
          })
        }
      }),
  ])
export const DateFilterSchema = (label: string) =>
  z.union([
    z.date(),
    z
      .object({
        $not: z.date().optional(),
        $gte: z.date().optional(),
        $lte: z.date().optional(),
        $in: z.array(z.date()).optional(),
        $notIn: z.array(z.date()).optional(),
      })
      .superRefine((val, ctx) => {
        if (val.$gte && val.$lte && val.$gte > val.$lte) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `El rango de valores para ${label} es inválido.`,
          })
        }
      }),
  ])

export const NullableBooleanFilterSchema = z.union([
  z.boolean(),
  z.null(),
  z.object({
    $not: z.union([z.boolean(), z.null()]).optional(),
  }),
])
export const BooleanFilterSchema = z.union([
  z.boolean(),
  z.object({
    $not: z.boolean().optional(),
  }),
])

export const NullFilterSchema = z.object({
  $not: z.null().optional(),
})
