import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { authSchema } from '@mahendra2002/myblogs-common';

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

const createPrisma = (url: string) =>
  new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());

// Signup
userRouter.post('/signup', async (c) => {
  const prisma = createPrisma(c.env.DATABASE_URL);
  try {
    const body = authSchema.parse(await c.req.json());

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      c.status(409); // Conflict
      return c.text('User already exists');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name || '',
        password: hashedPassword
      }
    });

    const jwt = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET);
    return c.text(jwt);

  } catch (err) {
    c.status(400);
    return c.text(err instanceof Error ? err.message : 'Invalid input');
  }
});

// Signin
userRouter.post('/signin', async (c) => {
  const prisma = createPrisma(c.env.DATABASE_URL);
  try {
    const body = authSchema.omit({ name: true }).parse(await c.req.json());

    const user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      c.status(403);
      return c.text('Incorrect credentials');
    }

    const jwt = await sign({ id: user.id, name: user.name  }, c.env.JWT_SECRET);
    return c.text(jwt);

  } catch (err) {
    c.status(400);
    return c.text(err instanceof Error ? err.message : 'Something went wrong');
  }
});
