const EmailValidator = (email) => /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi.test(email);

module.exports = EmailValidator;