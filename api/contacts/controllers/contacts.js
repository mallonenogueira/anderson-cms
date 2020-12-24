"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.contacts.create(data, { files });
    } else {
      entity = await strapi.services.contacts.create(ctx.request.body);
    }

    entity = sanitizeEntity(entity, { model: strapi.models.contacts });

    console.log("Enviando email", entity);

    try {
      await strapi.plugins["email"].services.email.send({
        to: "mallonenogueira@gmail.com",
        from: "mallonenogueira@gmail.com",
        replyTo: entity.email,
        subject: "Contact site - " + entity.name,
        text: `
            Contact id: ${entity.id}

            Name: ${entity.name}
            Phone: ${entity.phone}
            Email: ${entity.email}
            Help: ${entity.observation}
          `,
      });
      console.log("Email enviado");
    } catch (err) {
      console.error(err);
    }

    return entity;
  },
};
