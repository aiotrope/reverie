import mongoose, { Schema, model, Types, Document, Model } from 'mongoose'
import slugify from 'slugify'

export interface IPost extends Document {
  id: string
  title: string
  slug: string
  description: string
  entry: string
  user: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PostSchema: Schema = new Schema<IPost>(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    entry: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
    versionKey: false,
  }
)

PostSchema.set('toJSON', {
  transform: (document, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
  },
})

PostSchema.pre<IPost>('save', async function (next) {
  const post = this as IPost

  if (!post.isModified('title')) return next()

  const slug = slugify(post.title, { lower: true, trim: true })

  post.slug = slug

  return next()
})

/* PostSchema.virtual('slug').get(function () {
  return (this.slug = slugify(this.title, { lower: true, trim: true }))
}) */

PostSchema.pre('deleteMany', { document: true, query: false }, function (next) {
  /* eslint-disable-next-line @typescript-eslint/no-this-alias */
  const target: any = this
  target?.model('UserModel').deleteMany({ posts: target._id }, next)
  /* eslint-enable-next-line @typescript-eslint/no-this-alias */
})

const PostModel =
  (mongoose.models.UserModel as Model<IPost>) ||
  model<IPost>('PostModel', PostSchema)

export default PostModel
