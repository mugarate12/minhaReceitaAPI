import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export default function createToken(userId: string) {
  return jwt.sign({
    id: userId
  }, JWT_SECRET, {})
}
