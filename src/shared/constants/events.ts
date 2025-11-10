 // socket event constants

export const SOCKET_EVENTS = Object.freeze({
  NOTIFICATION: Object.freeze({
    NEW: "notification.new",
  }),
  CHAT:Object.freeze({
    SEND:"send.message",
    MARK_MESSAGE_READ:"markread.message"
  })
});
