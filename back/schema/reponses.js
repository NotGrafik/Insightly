import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

const ReponseQuestionSchema = new Schema({
  question_id: { type: Types.ObjectId, required: true, ref: 'Sondage.questions' },
  reponse: { 
    type: Schema.Types.Mixed, 
    required: true
  }
})

const ReponseSchema = new Schema({
  sondage_id: { type: Types.ObjectId, required: true, ref: 'Sondage' },
  utilisateur_id: { type: Types.ObjectId, required: true, ref: 'User' },
  reponses: [ReponseQuestionSchema]
}, { timestamps: true })

export default model('Reponse', ReponseSchema)
