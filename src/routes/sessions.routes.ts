import { Router } from 'express';

import AuthUserService from '../services/AuthUserService';

const sessionsRoute = Router();

sessionsRoute.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authUser = new AuthUserService();

  const { user, token } = await authUser.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRoute;
