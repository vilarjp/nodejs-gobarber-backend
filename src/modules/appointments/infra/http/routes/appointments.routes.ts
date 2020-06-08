import { Router } from 'express';

import isAuthenticated from '@modules/users/infra/http/middlewares/isAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(isAuthenticated);

appointmentsRouter.post('/', appointmentsController.create);
appointmentsRouter.get('/schedule', providerAppointmentsController.index);

export default appointmentsRouter;
