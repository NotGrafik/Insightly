import mongoose from 'mongoose'

const { Schema, model, Types } = mongoose

const ReponseQuestionSchema = new Schema({
  question_id: { type: Types.ObjectId, required: true, ref: 'Sondage.questions' },
  response: { 
    type: Schema.Types.Mixed, 
    required: true
  }
})

const ReponseSchema = new Schema({
  survey_id: { type: Types.ObjectId, required: true, ref: 'Sondage' },
  user_id: { type: Types.ObjectId, required: true, ref: 'User' },
  responses: [ReponseQuestionSchema]
}, { timestamps: true })

export default model('Reponse', ReponseSchema)
