import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useSocketStore } from "@/app/store/socket.store";
import { useCurrentUser } from "@/shared/hooks/useCurrentUser";
import { useWebRTC } from "@/features/sessions/hooks/useWebRTC";
import { useLiveChat } from "@/features/sessions/hooks/useLiveChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Send, MessageSquare, Loader2, UserX } from "lucide-react";
import Loading from "@/components/common/Loading";
import UserAvatar from "@/components/common/UserAvatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/(authenticated)/session/$sessionId")({
  component: LiveSession,
});

function LiveSession() {
  const { sessionId } = Route.useParams();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { socket } = useSocketStore();

  // WebRTC Hook
  const {
    localStream,
    remoteStream,
    toggleAudio,
    toggleVideo,
    isJoined,
    remoteMediaStatus
  } = useWebRTC(socket, sessionId, user?.id || "");

  // Chat Hook
  const { messages, sendMessage } = useLiveChat(socket, sessionId, user?.id || "", user?.name || "");

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, isJoined]); // Re-bind on join

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    toggleAudio(!isMicOn);
  };

  const handleToggleCam = () => {
    setIsCamOn(!isCamOn);
    toggleVideo(!isCamOn);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  if (isUserLoading || !user) return <Loading />;

  if (!socket || !isJoined) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-semibold mb-2">Joining Session...</h2>
        <p className="text-muted-foreground">Setting up your secure connection.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-950 text-white overflow-hidden">
      {/* Video Area */}
      <div className={`flex-1 relative flex flex-col p-4 transition-all duration-300 ${isChatOpen ? 'mr-0' : ''}`}>

        {/* Remote Video (Main) */}
        <div className="flex-1 bg-black/40 rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-800 shadow-2xl">
          {remoteStream ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-contain ${!remoteMediaStatus.isCamOn ? 'hidden' : ''}`}
              />
              {!remoteMediaStatus.isCamOn && (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <UserAvatar
                    name="Remote User"
                    size={24}
                    className="mb-4 text-3xl opacity-50"
                  />
                  <p className="flex items-center gap-2">
                    <VideoOff className="h-5 w-5" />
                    Camera is off
                  </p>
                </div>
              )}

              {/* Status Indicators Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {!remoteMediaStatus.isMicOn && (
                  <Badge variant="destructive" className="flex gap-1 items-center bg-red-500/80 backdrop-blur">
                    <MicOff className="h-3 w-3" /> Remote Mic Muted
                  </Badge>
                )}
              </div>
            </>
          ) : (
            // Waiting Screen
            <div className="text-center text-gray-400 flex flex-col items-center animate-pulse">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <UserAvatar
                  name="Waiting"
                  size={24}
                  className="relative bg-gray-800 text-3xl border-4 border-gray-800"
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Waiting for participant</h3>
              <p className="text-sm">They should be here shortly...</p>
            </div>
          )}

          {/* Local Video (PIP) */}
          <div className="absolute bottom-6 right-6 w-56 aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
            {localStream && isCamOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-500">
                <VideoOff className="h-8 w-8 mb-2" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold bg-black/60 px-2 py-0.5 rounded text-white/90 tracking-wider">You</span>
              {!isMicOn && <MicOff className="h-3 w-3 text-red-500" />}
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="h-20 mt-4 bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-2xl flex items-center justify-center gap-6 shadow-xl relative z-10 px-8">
          <div className="flex items-center gap-4">
            <Button
              variant={isMicOn ? "secondary" : "destructive"}
              size="icon"
              className={`rounded-full h-14 w-14 transition-all ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
              onClick={handleToggleMic}
            >
              {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
            <Button
              variant={isCamOn ? "secondary" : "destructive"}
              size="icon"
              className={`rounded-full h-14 w-14 transition-all ${isCamOn ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
              onClick={handleToggleCam}
            >
              {isCamOn ? <VideoIcon className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
          </div>

          <div className="h-8 w-[1px] bg-gray-700 mx-2"></div>

          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20"
            onClick={() => window.location.href = '/sessions'}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>

          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <Button
              variant={isChatOpen ? "secondary" : "ghost"}
              size="icon"
              className={`rounded-full h-12 w-12 transition-all ${isChatOpen ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'text-gray-400 hover:bg-gray-800'}`}
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {isChatOpen && (
        <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-semibold text-lg ml-2">Live Chat</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 text-xs rounded-full border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-10">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No messages yet. Say hello!
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isMe
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
                    }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 px-1">
                    {msg.senderName && !msg.isMe ? `${msg.senderName} • ` : ''}
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={chatScrollRef} />
            </div>
          </ScrollArea>
          <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <form onSubmit={handleSendMessage} className="flex gap-2 relative">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="bg-gray-950 border-gray-700 focus-visible:ring-primary h-12 pr-12 rounded-xl placeholder:text-gray-600"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1Bottom-1 h-10 w-10 top-1 rounded-lg"
                disabled={!messageInput.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
