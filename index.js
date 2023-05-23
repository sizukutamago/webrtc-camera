const candidates = [];

const videoElement = document.getElementById("video");

if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
    throw new Error("Video element not found");
}

const senderConnection = new RTCPeerConnection();

navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
        videoElement.srcObject = stream;
        stream.getTracks().forEach((track) => {
            senderConnection.addTrack(track, stream);
        });
        return senderConnection.createOffer();
    })
    .then((offer) => {
        return senderConnection.setLocalDescription(offer);
    })
    .then((offer) => {
        console.log(JSON.stringify(senderConnection.localDescription));
        return offer;
    })
    .then(() => {
        const receiverAnswer = window.prompt(
            "receiver の SDP answer description を入力してください。"
        );
        return senderConnection.setRemoteDescription(
            JSON.parse(receiverAnswer)
        );
    });

senderConnection.onicecandidate = (e) => {
    if (!e.candidate) {
        // 自分(Sender) の ICE を出力する
        console.log(JSON.stringify(candidates));
        alert(
            `sender の ice candidate はこちらです。receiver 側に入力してください。}`
        );
        return;
    }
    candidates.push(e.candidate);
    console.log(JSON.stringify(e.candidate));
};
