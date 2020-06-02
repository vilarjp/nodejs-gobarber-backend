import { Router } from 'express';

import isAuthenticated from '@modules/users/infra/http/middlewares/isAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import MonthAvailabilityController from '../controllers/MonthAvailabilityController';
import DayAvailabilityController from '../controllers/DayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const monthAvailabilityController = new MonthAvailabilityController();
const dayAvailabilityController = new DayAvailabilityController();

providersRouter.use(isAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/month-availability',
  monthAvailabilityController.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  dayAvailabilityController.index,
);

export default providersRouter;
