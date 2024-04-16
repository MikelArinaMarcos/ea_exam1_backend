import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Relación con el usuario
    actualState: { type: String, required: true }, // Estado actual del usuario
    startOnline: { type: Date, required: true}, // Inicio del estado online
    finishOnline: { type: Date, required: true}, // Final del estado online
    lastConnection: { type: Date, required: true} // Fecha de la última conexión del usuario
    }
);

export default mongoose.model('comments', schema);