import type {Env} from "@tsed/core";
import {InjectorService} from "../services/InjectorService";
import {ContextLogger, ContextLoggerOptions} from "./ContextLogger";
import {LocalsContainer} from "./LocalsContainer";

export interface ContextMethods extends Map<any, any> {
  readonly id: string;
  readonly logger: ContextLogger;
  readonly injector: InjectorService;
  readonly container: LocalsContainer;
  readonly env: Env;

  destroy(): any;
}

declare global {
  namespace TsED {
    interface Context {}
  }
}

export interface DIContextOptions extends Omit<ContextLoggerOptions, "dateStart"> {
  id: string;
  logger: any;
  injector?: InjectorService;
}

export class DIContext extends Map<any, any> implements ContextMethods {
  [x: string]: any;

  /**
   * Request id generated by @@contextMiddleware@@.
   *
   * ::: tip
   * By default Ts.ED generate uuid like that `uuidv4().replace(/-/gi, ""))`.
   * Dash are removed to simplify tracking logs in Kibana
   * :::
   *
   * ::: tip
   * Request id can by customized by changing the server configuration.
   *
   * ```typescript
   * @Configuration({
   *   logger: {
   *     reqIdBuilder: createUniqId // give your own id generator function
   *   }
   * })
   * class Server {
   *
   * }
   * ```
   * :::
   *
   */
  readonly id: string;
  /**
   * Date when request have been handled by the server. @@RequestLogger@@ use this date to log request duration.
   */
  readonly dateStart: Date = new Date();
  /**
   * Logger attached to the context request.
   */
  public logger: ContextLogger;

  #container = new LocalsContainer<any>();

  readonly #injector: InjectorService;

  constructor({id, injector, logger, ignoreLog, ...options}: DIContextOptions) {
    super();
    this.id = id;

    injector && (this.#injector = injector);

    this.logger = new ContextLogger(logger, {
      ...options,
      dateStart: this.dateStart,
      id,
      ignoreLog
    });
  }

  /**
   * The request container used by the Ts.ED DI. It contain all services annotated with `@Scope(ProviderScope.REQUEST)`
   */
  get container(): LocalsContainer {
    return this.#container;
  }

  /**
   *
   */
  get injector(): InjectorService {
    return this.#injector;
  }

  get env() {
    return this.injector.settings.env;
  }

  async destroy() {
    await this.container.destroy();
    this.logger.destroy();
    // @ts-ignore
    delete this.logger;
  }

  async emit(eventName: string, ...args: any[]) {
    return this.injector?.emit(eventName, ...args);
  }
}

export type BaseContext = DIContext & TsED.Context;
