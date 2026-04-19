import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { authenticate, AuthRequest } from './middleware/auth.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-mindmate';

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // In a real app, hash this using bcrypt!
        profile: {
          create: {
            name: username,
            joinedDate: new Date().toISOString()
          }
        }
      }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, username: true, email: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Profile Routes
app.get('/api/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    let profile = await prisma.userProfile.findUnique({
      where: { userId: req.userId }
    });

    if (!profile) {
      const user = await prisma.user.findUnique({ where: { id: req.userId! } });
      profile = await prisma.userProfile.create({
        data: {
          userId: req.userId!,
          name: user?.username || 'User',
          joinedDate: new Date().toISOString()
        }
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const { name, notifications, darkMode, reminderTime, theme } = req.body;

    const profile = await prisma.userProfile.update({
      where: { userId: req.userId },
      data: { name, notifications, darkMode, reminderTime, theme }
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Chat Routes
app.get('/api/chat', authenticate, async (req: AuthRequest, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.userId },
      orderBy: { timestamp: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/chat', authenticate, async (req: AuthRequest, res) => {
  try {
    const { text, sender } = req.body;
    const message = await prisma.chatMessage.create({
      data: {
        userId: req.userId!,
        text,
        sender
      }
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/chat', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.chatMessage.deleteMany({
      where: { userId: req.userId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mock Bot Routes
app.post('/api/chat/mock', authenticate, async (req: AuthRequest, res) => {
  const { text } = req.body;
  // Simple mock logic ported from frontend
  let botResponse = "I'm here to listen. Tell me more about what's on your mind.";
  const input = text.toLowerCase();

  if (input.includes("anxious") || input.includes("anxiety")) {
    botResponse = "Anxiety can be really overwhelming. Have you tried the 4-7-8 breathing exercise in our resources? It might help ground you.";
  } else if (input.includes("stress")) {
    botResponse = "It sounds like you're carrying a lot of weight right now. Remember to take things one step at a time. What's the most pressing thing causing you stress?";
  } else if (input.includes("sad") || input.includes("depressed")) {
    botResponse = "I'm sorry you're feeling this way. It takes courage to acknowledge these feelings. Please remember I'm here to support you, and there's no rush to feel better immediately.";
  }

  setTimeout(() => {
    res.json({ response: botResponse });
  }, 1000); // Simulate network delay
});


// Mood Routes
app.get('/api/mood', authenticate, async (req: AuthRequest, res) => {
  try {
    const history = await prisma.moodEntry.findMany({
      where: { userId: req.userId },
      orderBy: { timestamp: 'desc' }
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/mood', authenticate, async (req: AuthRequest, res) => {
  try {
    const { date, value, emoji } = req.body;
    const entry = await prisma.moodEntry.create({
      data: {
        userId: req.userId!,
        date,
        value,
        emoji
      }
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Resource Favorites Routes
app.get('/api/resources/favorites', authenticate, async (req: AuthRequest, res) => {
  try {
    const favs = await prisma.favoriteResource.findMany({
      where: { userId: req.userId }
    });
    res.json(favs.map(f => f.resourceId));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/resources/favorites', authenticate, async (req: AuthRequest, res) => {
  try {
    const { resourceIds } = req.body;

    // Clear old favorites
    await prisma.favoriteResource.deleteMany({
      where: { userId: req.userId }
    });

    // Create new ones
    if (resourceIds && resourceIds.length > 0) {
      await prisma.favoriteResource.createMany({
        data: resourceIds.map((id: string) => ({
          userId: req.userId!,
          resourceId: id
        }))
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Custom Quick Replies Routes
app.get('/api/chat/quick-replies', authenticate, async (req: AuthRequest, res) => {
  try {
    const replies = await prisma.customQuickReply.findMany({
      where: { userId: req.userId }
    });
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/chat/quick-replies', authenticate, async (req: AuthRequest, res) => {
  try {
    const { replies } = req.body;

    await prisma.customQuickReply.deleteMany({
      where: { userId: req.userId }
    });

    if (replies && replies.length > 0) {
      await prisma.customQuickReply.createMany({
        data: replies.map((r: { text: string }) => ({
          userId: req.userId!,
          text: r.text
        }))
      });
    }

    const newReplies = await prisma.customQuickReply.findMany({
      where: { userId: req.userId }
    });

    res.json(newReplies);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
