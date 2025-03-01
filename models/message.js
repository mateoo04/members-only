module.exports = class Message {
  constructor({ id = null, memberId, title, content, time = null }) {
    this.id = id;
    this.memberId = memberId;
    this.title = title;
    this.content = content;
    this.time = time;
  }
};
