import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

const QuestionSchema = new Schema({
  intitule: { type: String, required: true },
  type: { type: String, enum: ['ouverte', 'qcm', 'radio'], required: true },
  reponses: [{ type: String }]
})

const SondageSchema = new Schema({
  nom: { type: String, required: true },
  createur: { type: Types.ObjectId, ref: 'User', required: true },
  questions: [QuestionSchema]
}, { timestamps: true })

export default model('Sondage', SondageSchema)
