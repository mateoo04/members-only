module.exports = class User {
  constructor({
    id = null,
    firstName,
    lastName,
    username,
    password,
    isExclusive,
    isAdmin,
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.isExclusive = isExclusive;
    this.isAdmin = isAdmin;
  }
};
