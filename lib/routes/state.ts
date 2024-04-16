import { Application, Request, Response } from 'express';
import { StateController } from '../controllers/stateController';

export class StateRoutes {

    private state_controller: StateController = new StateController();

    public route(app: Application) {
        
        app.post('/state', (req: Request, res: Response) => {
            this.state_controller.createState(req, res);
        });

        app.get('/state/:id', (req: Request, res: Response) => {
            this.state_controller.getState(req, res);
        });

        app.put('/state/:id', (req: Request, res: Response) => {
            this.state_controller.updateState(req, res);
        });

        app.delete('/state/:id', (req: Request, res: Response) => {
            this.state_controller.deleteState(req, res);
        });
    }
}