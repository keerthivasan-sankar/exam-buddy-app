import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { mobile, name, gender, homeCity } = req.body;

    let user = await User.findOne({ mobile });

    if (user) {
      // User exists, login
      return res.json({
        user,
        token: generateToken(user.id),
      });
    }

    // New user, register
    user = await User.create({
      mobile,
      name,
      gender,
      homeCity,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });

    res.status(201).json({
      user,
      token: generateToken(user.id),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({ data: user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
