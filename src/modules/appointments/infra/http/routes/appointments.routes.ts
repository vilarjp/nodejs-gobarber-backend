import { Router } from 'express';

import isAuthenticated from '@modules/users/infra/http/middlewares/isAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(isAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
