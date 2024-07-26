import janode from "janode";
// @ts-ignore
import AudioBridgePlugin from "janode/plugins/audiobridge";

class JanodeService {
  private static instance: JanodeService;
  private sessionHandler: any;
  private managerHandler: any

  constructor() {
    this._boot();
  }

  private async _boot() {
    let connection;

    try {
      connection = await janode.connect({
        address: [
          {
            url: "ws://37.152.178.4:8188",
            apisecret: "secret",
          },
        ],
        retry_time_secs: 10,
      });

      connection.once(janode.EVENT.CONNECTION_CLOSED, () => {
        console.log(`connection with Janus closed`);
      });

      connection.once(janode.EVENT.CONNECTION_ERROR, ({ message }) => {
        console.log(`connection with Janus error (${message})`);

        // replyError(io, "backend-failure");
      });

      const session = await connection.create();
      console.log(`session with Janus created`);
      this.sessionHandler = session;

      session.once(janode.EVENT.SESSION_DESTROYED, () => {
        console.log(`session destroyed`);
        this.sessionHandler = null;
      });

      const handle = await session.attach(AudioBridgePlugin);
      this.managerHandler = handle
      console.log(`manager handle attached`);

      // generic handle events
      handle.once(janode.EVENT.HANDLE_DETACHED, () => {
        console.log(`manager handle detached`);
      });
    } catch (error) {
      console.error(`janode setup error (${(error as any).message})`);
      if (connection) {
        connection.close().catch(() => {});
      }
    }
  }

  public static getInstance(): JanodeService {
    if (!JanodeService.instance) {
      JanodeService.instance = new JanodeService();
    }
    return JanodeService.instance;
  }

  public static getSessionHandler() {
    if (!JanodeService.instance) {
      throw new Error("[getSessionHandler] you should call this method only if you've an instance");
    }

    if (!JanodeService.instance.sessionHandler) {
      throw new Error("session handler not available");
    }

    return JanodeService.instance.sessionHandler;
  }

  public static getManagerHandler() {
    if (!JanodeService.instance) {
      throw new Error("[getManagerHandler] you should call this method only if you've an instance");
    }

    if (!JanodeService.instance.managerHandler) {
      throw new Error("manager handler not available");
    }

    return JanodeService.instance.managerHandler;
  }
}

export default JanodeService;
