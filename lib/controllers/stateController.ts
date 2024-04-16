import { Request, Response } from 'express';
import { IState } from '../models/states/model';
import StateService from '../models/states/service';
import UserService from '../models/users/service';
import e = require('express');

export class StateController {

    private state_service: StateService = new StateService();
    private user_service: UserService = new UserService();

    // Creación de un nuevo estado
    public async createState(req: Request, res: Response) {
        try{
            if (req.body.user && req.body.actualState && req.body.startOnline && req.body.finishOnline && req.body.lastConnection) {
                const state_params: IState = {
                    user: req.body.user,
                    actualState: req.body.actualState,
                    startOnline: req.body.startOnline,
                    finishOnline: req.body.finishOnline,
                    lastConnection: req.body.lastConnection
                };
                const state_data = await this.state_service.createState(state_params);
                await this.user_service.addStateToUser(req.body.users, state_data._id);
                return res.status(201).json({ message: 'Estado creado correctamente.', state: state_data });
            }else{ 
                return res.status(400).json({ error: 'Faltan datos' });
            }
        }catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    // Obtención del estado
    public async getState(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const state_filter = { _id: req.params.id };
                const state_data = await this.state_service.populateState(state_filter);
                // Si todo va bien
                return res.status(200).json({ data: state_data, message: 'OK'});
            } else {
                // Si algo falla
                return res.status(400).json({ error: 'Faltan datos' });
            }
        }catch(error){
            // Error del servidor
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Actualización del estado
    public async updateState(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const state_filter = { _id: req.params.id };
                const state_data = await this.state_service.filterState(state_filter);
                if (!state_data) {
                    // Si no se esncuentra el estado
                    return res.status(400).json({ error: 'Estado no encontrado'});
                }
    
                const state_params: IState = {
                    user: req.body.user || state_data.user,
                    actualState: req.body.actualState || state_data.actualState,
                    startOnline: req.body.startOnline || state_data.startOnline,
                    finishOnline: req.body.finishOnline || state_data.finishOnline,
                    lastConnection: req.body.lastConnection || state_data.lastConnection
                };
                await this.state_service.updateState(state_params, state_filter);
                const new_state_data = await this.state_service.filterState(state_filter);
                // Si todo correcto
                return res.status(200).json({ data: new_state_data, message: 'OK'});
            } else {
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    
    // Eliminación de estado
    public async deleteState(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const delete_details = await this.state_service.deleteState(req.params.id);
                if (delete_details.deletedCount != 0) {
                    return res.status(200).json({ message: 'OK'});
                } else {
                    return res.status(400).json({ error: 'Estado no encontrado' });
                }
            } else {
                return res.status(400).json({ error: 'Missing Id' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}