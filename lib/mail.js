var lib = require('./index'),
configure = lib.config.mail,
mailLogger = lib.getLogger('mail'), emailer;
try {
  if (configure.host === undefined) {
      throw 'SMTP host is not configureured.';
    }
    configure.port = configure.port || 25;
    if (configure.email === undefined) {
      throw 'Sender email is not defined';
    }
    var conf = {
      host: configure.host,
      port: configure.port,
      secure: configure.secure || false
    };
    if (configure.user !== undefined && configure.password !== undefined) {
      conf.auth = {
        user: configure.user,
        pass: configure.password
      };
    }
    emailer = require('nodemailer').createTransport(conf);
    emailer.use('compile', require('nodemailer-html-to-text').htmlToText());
} catch (error) {
  mailLogger.fatal(error);
  process.exit(1);
}
