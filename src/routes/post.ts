import { Router, type Request, type Response } from "express"
import jwt from "jsonwebtoken"
import { getSigningCredentials } from "../db/get_signin_credentials.js";

const router = Router();

router.post('/api/generate-token', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const credentials = await getSigningCredentials();

    const { username, password } = credentials;

    const token = jwt.sign(
      {
        sub: userId,
        issuer: username,
      },
      password,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      expiresIn: '1h',
      issuedForUser: userId,
    });
  } catch (err: any) {
    console.error('Error generating token:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
export default router;
