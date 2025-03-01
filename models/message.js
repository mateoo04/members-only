module.exports = class Message {
  constructor({ id = null, member, title, content, time = null }) {
    this.id = id;
    this.member = member;
    this.title = title;
    this.content = content;
    this.time = time;
  }
};
