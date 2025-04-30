import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from 'hono/jwt';
import { blogSchema, updateSchema } from '@mahendra2002/myblogs-common'
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

// Reusable Prisma factory
const createPrisma = (url: string) =>
  new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());

// Middleware: Verify JWT and extract userId
blogRouter.use('/*', async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user && typeof user === 'object' && typeof user.id === 'string') {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "Invalid token" });
    }
  } catch {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
});

// Create blog
blogRouter.post('/', async (c) => {
  try {
    const body = blogSchema.parse(await c.req.json());
    const authorId = c.get("userId");
    const prisma = createPrisma(c.env.DATABASE_URL);

    const blog = await prisma.post.create({
      data: {
        ...body,
        authorId
      }
    });

    return c.json({ id: blog.id });
  } catch (error) {
    c.status(400);
    if (error instanceof Error) {
      return c.json({ error: error.message });
    }
    return c.json({ error: "Unknown error" });
  }
  
});

// Update blog
blogRouter.put('/', async (c) => {
  try {
    const body = updateSchema.parse(await c.req.json());
    const prisma = createPrisma(c.env.DATABASE_URL);

    const blog = await prisma.post.update({
      where: { id: body.id },
      data: {
        title: body.title,
        content: body.content
      }
    });

    return c.json({ id: blog.id });
  } catch (error) {
    c.status(400);
    if (error instanceof Error) {
      return c.json({ error: error.message });
    }
    return c.json({ error: "Unknown error" });
  }
  
});

// Get all blogs
blogRouter.get('/bulk', async (c) => {
    try {
      const prisma = createPrisma(c.env.DATABASE_URL);
  
      const page = 1;
      const limit = 10;
      const skip = (page - 1) * limit;
  
      const [blogs, total] = await Promise.all([
        prisma.post.findMany({
          skip,
          take: limit,
        }),
        prisma.post.count()
      ]);
  
      return c.json({
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        blogs
      });
    } catch (error) {
      c.status(500);
      return c.json({
        error: error instanceof Error ? error.message : "Server error"
      });
    }
  });  
  

// Get blog by ID via query param
blogRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    if (!id) {
      c.status(400);
      return c.json({ message: "Missing 'id' query parameter" });
    }

    const prisma = createPrisma(c.env.DATABASE_URL);
    const blog = await prisma.post.findFirst({ where: { id } });

    if (!blog) {
      c.status(404);
      return c.json({ message: "Blog not found" });
    }

    return c.json({ blog });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Server error" });
  }
});


