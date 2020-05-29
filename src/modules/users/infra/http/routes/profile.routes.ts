import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import isAuthenticated from '../middlewares/isAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(isAuthenticated);

profileRouter.put('/', profileController.update);
profileRouter.get('/', profileController.show);

export default profileRouter;
