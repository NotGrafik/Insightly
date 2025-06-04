import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

const QuestionSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['ouverte', 'qcm', 'radio'], required: true },
  responses: [{ type: String }]
})

const SondageSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: Types.ObjectId, ref: 'User', required: true },
  questions: [QuestionSchema]
}, { timestamps: true })

export default model('Sondage', SondageSchema)
