import * as mongoose from 'mongoose';

export interface IState {
    // Creación del modelo para gestionar el estado de un usuario.
    // La relación que he utilizado es con el usuario de la aplicación.
    // Para cada uno he definido: id del estado, usuario para relacionarlo, un estado actual de tipo string, un date
    // que indica cuando se ha conectado, un date que indica cuando se ha desconectado y 
    // un date para saber cuando se produjo la última conexión (en formato fecha).
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    actualState: String;
    startOnline: Date;
    finishOnline: Date;
    lastConnection: Date
}