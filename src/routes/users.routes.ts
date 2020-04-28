import { Router } from 'express';

const usersRoute = Router();

usersRoute.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    response.send();
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRoute;
