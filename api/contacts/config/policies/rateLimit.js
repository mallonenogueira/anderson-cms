"use strict";

const lazyRateLimit = {
  get RateLimit() {
    return require("koa2-ratelimit").RateLimit;
  },
};

module.exports = async (ctx, next) => {
  const message = [
    {
      messages: [
        {
          id: "ratelimit",
          message: "Too many attempts, please try again in a minute.",
        },
      ],
    },
  ];

  return lazyRateLimit.RateLimit.middleware(
    Object.assign(
      {},
      {
        interval: 1 * 60 * 1000,
        max: 1,
        prefixKey: `${ctx.request.path}:${ctx.request.ip}`,
        message,
      }
    )
  )(ctx, next);
};
