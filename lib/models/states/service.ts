import { IState } from './model';
import states from './schema';
import UserService from '../users/service';
import mongoose, { Types } from 'mongoose';

// Clase estado del usuario
export default class StateService {
    
    // Creación del estado de un usuario.
    // Si todo es correcto se guarda el estado y, en caso contrario, devuelve error.
    public async createState(state_params: IState): Promise<IState> {
        try {
            const session = new states(state_params);
            return await session.save();
        } catch (error) {
            throw error;
        }
    }

    // Filtro por diferentes estados.
    // Devuelve la búsqueda realizada o un error.
    public async filterState(query: any): Promise<IState | null> {
        try {
            return await states.findOne(query);
        } catch (error) {
            throw error;
        }
    }

    // Actualización del estado de un usuario.
    public async updateState(state_params: IState, state_id: any): Promise<void> {
        try {
            await states.findOneAndUpdate(state_id, state_params);

            const userService = new UserService();
            await userService.updateUserState(state_id.user, state_params.user); 
               
        } catch (error) {
            throw error;
        }
    }

    // Eliminar estado de un usuario.
    // Típicamente esto no tendría sentido, ya que siempre va a tener algún estado,
    // pero podría utilizarse por si se elimina algún usuario de la base de datos que
    // se elimine también el estado.
    public async deleteState(_id: string): Promise<{ deletedCount: number }> {
        try {
            const state = await states.findOne({ _id });
            if (!state) {
                throw new Error('Estado no encontrado');
            }
    
            // Eliminamos el estado
            const deletionResult = await states.deleteOne({ _id });
            if (deletionResult.deletedCount !== 1) {
                throw new Error('Falló la eliminación del estado');
            }
    
            return deletionResult;

        } catch (error) {
            throw error;
        }
    }

    // Populate para relacionar los estados y los usuarios.
    public async populateState(query: any): Promise<IState | null> {
        try {
            const state = await states.findOne(query).populate(['users', 'states']).exec();
            if (!state) {
                return null;
            }
            const populatedState: IState = {
                ...state.toObject(),
                _id: state._id
            };
            return populatedState;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}