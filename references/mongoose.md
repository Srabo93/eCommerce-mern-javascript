# Mongoose — Reference for Agentic Coding

This project uses **Mongoose** (v9.7.3) as the MongoDB ODM in `packages/api/`.

## Official Docs

- **Schema guide:** <https://mongoosejs.com/docs/guide.html>
- **TypeScript guide:** <https://mongoosejs.com/docs/typescript.html>
- **TypeScript methods/statics:** <https://mongoosejs.com/docs/typescript/statics-and-methods.html>
- **TypeScript queries:** <https://mongoosejs.com/docs/typescript/queries.html>
- **TypeScript populate:** <https://mongoosejs.com/docs/typescript/populate.html>
- **Migration to v9:** <https://mongoosejs.com/docs/migrating_to_9.html>

## Key Conventions for This Project

| Aspect | Convention |
|---|---|
| **Schema definition** | No generics on `new mongoose.Schema()` — let Mongoose 9 auto-infer types |
| **Model creation** | `mongoose.model('User', schema)` — no generics needed |
| **Instance methods** | Use `methods: {}` in schema options (NOT `schema.method()`) — enables auto type inference |
| **Static methods** | Use `statics: {}` in schema options (NOT `schema.static()`) |
| **Pre-hooks** | `schema.pre('save', async function () { ... })` — no `next()` callback (removed in v9) |
| **No manual interfaces** | Mongoose 9 infers document types from schema definition — no `IUser` interfaces needed |
| **Timestamps** | `{ timestamps: true }` in schema options for `createdAt`/`updatedAt` |
| **References** | `ref: 'User'` + `type: mongoose.Schema.Types.ObjectId` for population |
| **Subdocuments** | Inline schema arrays: `reviews: [reviewSchema]` |
| **Imports** | `import mongoose from 'mongoose'` (default import) |
| **Naming** | `camelCase` for fields, `PascalCase` for model names (`User`, `Product`, `Order`) |
| **File naming** | `User.ts`, `Product.ts`, `Order.ts` — PascalCase for model files |

## Pattern: Schema with Methods (Mongoose 9)

```ts
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    methods: {
      matchPassword(enteredPassword: string) {
        return bcrypt.compare(enteredPassword, this.password)
      },
    },
  },
)

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.model('User', userSchema)
```

## Pattern: Schema with Statics

```ts
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
    statics: {
      findByName(name: string) {
        return this.find({ name: new RegExp(name, 'i') })
      },
    },
  },
)

export const Product = mongoose.model('Product', productSchema)
```

## Pattern: Subdocuments

```ts
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true },
)

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    reviews: [reviewSchema], // embedded subdocument array
  },
  { timestamps: true },
)
```

## Pattern: Population

```ts
// In route handler:
const order = await Order.findById(id).populate('user').populate('orderItems.product')
```

## What NOT to Do

- Do NOT use `new mongoose.Schema<IType>()` with generics — Mongoose 9 infers automatically
- Do NOT use `mongoose.model<IType>()` with generics — same reason
- Do NOT define manual `IUser`/`IProduct`/`IOrder` interfaces — redundant with auto-inference
- Do NOT use `schema.method()` or `schema.static()` — use `methods: {}` / `statics: {}` in schema options
- Do NOT pass `next()` to `pre()` hooks — removed in Mongoose 9
- Do NOT use ES6 arrow functions for methods/statics — they prevent `this` binding
- Do NOT use `useNewUrlParser` or `useUnifiedTopology` — deprecated/removed in Mongoose 6+
