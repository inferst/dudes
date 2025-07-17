import * as Sentry from "@sentry/nestjs"

Sentry.init({
  dsn: "https://f37c4d61c30033a2d67b232af5275255@o4507430774898688.ingest.de.sentry.io/4509684650344529",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
