import dotenv from "dotenv";
dotenv.config();

type EnvKeys =
    | "SERVE_PORT"
    | "JWT_SECRET"
    | "JANUS_URL"
    | "JANUS_SECRET"

const Env: Record<EnvKeys, any> = {
    SERVE_PORT: process.env.SERVE_PORT!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JANUS_URL: process.env.JANUS_URL!,
    JANUS_SECRET: process.env.JANUS_SECRET!,
};

for (let key of Object.keys(Env)) {
    if (!Env[key]) {
        throw new Error(`${key} not found in your .env`);
    }
}

export default Env;
