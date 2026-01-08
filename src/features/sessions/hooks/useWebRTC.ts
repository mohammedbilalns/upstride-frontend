import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

const STUN_SERVERS = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
            ],
        },
    ],
};

export interface MediaStatus {
    isMicOn: boolean;
    isCamOn: boolean;
}

export const useWebRTC = (socket: Socket | null, roomId: string, userId: string) => {
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isJoined, setIsJoined] = useState(false);

    // Remote peer status
    const [remoteMediaStatus, setRemoteMediaStatus] = useState<MediaStatus>({ isMicOn: true, isCamOn: true });

    useEffect(() => {
        if (!socket) return;

        peerConnection.current = new RTCPeerConnection(STUN_SERVERS);

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    roomId,
                    candidate: event.candidate,
                });
            }
        };

        // Handle remote stream
        peerConnection.current.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        // Socket listeners
        socket.on('join_room', async (data: any) => {
            // Broadcast my current status to new joiner
            const currentAudio = localStream.current?.getAudioTracks()[0]?.enabled ?? true;
            const currentVideo = localStream.current?.getVideoTracks()[0]?.enabled ?? true;

            socket.emit('media_status', { roomId, type: 'audio', enabled: currentAudio });
            socket.emit('media_status', { roomId, type: 'video', enabled: currentVideo });

            if (data.userId !== userId) {
                const offer = await peerConnection.current?.createOffer();
                await peerConnection.current?.setLocalDescription(offer);
                socket.emit('offer', { roomId, offer });
            }
        });

        socket.on('offer', async (data: any) => {
            if (!peerConnection.current) return;
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit('answer', { roomId, answer });
        });

        socket.on('answer', async (data: any) => {
            if (!peerConnection.current) return;
            await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        socket.on('ice_candidate', async (data: any) => {
            if (!peerConnection.current) return;
            try {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        });

        socket.on('media_status', (data: { type: 'audio' | 'video', enabled: boolean, userId: string }) => {
            if (data.userId === userId) return; // Ignore self
            setRemoteMediaStatus(prev => ({
                ...prev,
                [data.type === 'audio' ? 'isMicOn' : 'isCamOn']: data.enabled
            }));
        });

        // Initial Join
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStream.current = stream;
                stream.getTracks().forEach((track) => {
                    peerConnection.current?.addTrack(track, stream);
                });
                socket.emit('join_room', { roomId, userId });
                setIsJoined(true);
            })
            .catch((err) => {
                console.error("Error accessing media devices.", err);
            });

        return () => {
            socket.off('join_room');
            socket.off('offer');
            socket.off('answer');
            socket.off('ice_candidate');
            socket.off('media_status');
            localStream.current?.getTracks().forEach(track => track.stop());
            peerConnection.current?.close();
        };
    }, [socket, roomId, userId]);

    const toggleAudio = (enabled: boolean) => {
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach(track => track.enabled = enabled);
            socket?.emit('media_status', { roomId, type: 'audio', enabled });
        }
    }

    const toggleVideo = (enabled: boolean) => {
        if (localStream.current) {
            localStream.current.getVideoTracks().forEach(track => track.enabled = enabled);
            socket?.emit('media_status', { roomId, type: 'video', enabled });
        }
    }

    return {
        localStream: localStream.current,
        remoteStream,
        toggleAudio,
        toggleVideo,
        isJoined,
        remoteMediaStatus
    };
};
