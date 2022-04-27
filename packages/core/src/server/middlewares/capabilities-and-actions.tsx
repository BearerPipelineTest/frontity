import type { Next, Middleware } from "koa";
import type { Context } from "@frontity/types";
import { appComponent } from "./capabilities/app-component";
import { renderMethod } from "./capabilities/render-method";
import { template } from "./capabilities/template";

/**
 * Setup capabilities and execute server side actions.
 *
 * @param ctx - The request context.
 * @param next - The middleware function.
 *
 * @returns The middleware function.
 */
export const capabilitiesAndActions = async (
  ctx: Context,
  next: Next
): Promise<Middleware> => {
  // Apply the capabilities to the store.libraries.frontity namespce.
  appComponent(ctx.ctx.state.store.libraries.frontity, ctx.ctx);

  // Setup the render method.
  renderMethod(ctx.ctx.state.store.libraries.frontity);

  // Define the default template.
  template(ctx.ctx.state.store.libraries.frontity);

  // Run init actions.
  await Promise.all(
    Object.values(ctx.ctx.state.store.actions).map(({ init }) => {
      if (init) return init();
    })
  );

  // Run beforeSSR actions.
  await Promise.all(
    Object.values(ctx.ctx.state.store.actions).map(({ beforeSSR }) => {
      if (beforeSSR) return beforeSSR({ ctx: ctx.ctx });
    })
  );

  // The beforeSSR actions for source packages (e.g. wp-source) can set a
  // redirection by calling `ctx.redirect()`. In that case, the `Location`
  // HTTP header will already be set and we can just return early.
  if (
    [301, 302, 307, 308].includes(ctx.ctx.status) &&
    ctx.ctx.get("Location")
  ) {
    return;
  }

  return await next();
};
