import {Controller, inject, injector} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Middleware, UseBeforeEach} from "@tsed/platform-middlewares";
import {Context, PlatformParams} from "@tsed/platform-params";
import {Get} from "@tsed/schema";

import {PlatformRouter} from "../src/domain/PlatformRouter.js";
import {PlatformRouters} from "../src/domain/PlatformRouters.js";

@Middleware()
class MyMiddleware {
  use() {}
}

@Controller("/controller")
@UseBeforeEach(MyMiddleware)
class MyController {
  @Get("/")
  get(@Context() $ctx: Context) {
    return $ctx;
  }
}

function createAppRouterFixture() {
  const platformRouters = inject(PlatformRouters);
  const platformParams = inject(PlatformParams);
  const appRouter = inject(PlatformRouter);

  platformRouters.hooks.destroy();

  injector().addProvider(MyMiddleware);
  injector().addProvider(MyController, {});

  return {appRouter, platformRouters, platformParams};
}

describe("routers with middlewares", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should declare router", () => {
    const {appRouter, platformRouters} = createAppRouterFixture();

    const router = platformRouters.from(MyController);

    appRouter.use("/rest", router);

    const layers = platformRouters.getLayers(appRouter);

    expect(layers.length).toEqual(1);
    expect(layers[0].getArgs().length).toEqual(4);

    expect(layers[0].handlers[1].type).toEqual("middleware");
    expect(layers[0].handlers[1].isEndpoint()).toEqual(false);
  });
});
