import jwt from "jsonwebtoken";
import Env from "./env";

type TokenData = {
    user_id: string;
};

const verifyToken = (token: string): TokenData | null => {
    try {
        if (verifyScheme(token)) {
            let data = jwt.verify(extractToken(token), Env.JWT_SECRET);
            return data as TokenData;
        }
    } catch (err) {}
    return null;
};

const verifyScheme = (token: string) => {
    return token.startsWith("Bearer ");
};

const extractToken = (token: string) => {
    return token.replace("Bearer ", "");
};

export {
    verifyToken
}
