import z from "zod";

const mediaSchema = z.object({
  url: z.string(),
  size: z.number(),
  fileType: z.string()
})

export const messagePayloadSchema = z.object({
  chatId: z.string(),
  senderId: z.string(),
  senderName: z.string(),
  receiverId: z.string(), 
  messageId: z.string(),
  message: z.string(),
  type: z.enum(["TEXT", "FILE", "IMAGE"]),
  timestamp: z.string(), 
  attachment: mediaSchema.optional(),
});

export const pendingMessageSchema = z.object({
  status: z.literal("pending"),
  from: z.string(),
  to: z.string(),
  message: z.string(),
  type: z.enum(["TEXT", "FILE", "IMAGE"]),
  media: mediaSchema.optional(),
});

