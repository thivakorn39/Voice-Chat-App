const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

const users = {}; // เก็บข้อมูลการเชื่อมต่อของผู้ใช้

wss.on('connection', ws => {
    let userId;

    ws.on('message', message => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            userId = generateUserId();
            users[userId] = ws;
            ws.send(JSON.stringify({ type: 'join', userId: userId }));
        }

        if (data.type === 'offer') {
            const peer = users[data.to];
            if (peer) {
                peer.send(JSON.stringify({ type: 'offer', offer: data.offer, from: userId }));
            }
        }

        if (data.type === 'answer') {
            const peer = users[data.to];
            if (peer) {
                peer.send(JSON.stringify({ type: 'answer', answer: data.answer, from: userId }));
            }
        }

        if (data.type === 'candidate') {
            const peer = users[data.to];
            if (peer) {
                peer.send(JSON.stringify({ type: 'candidate', candidate: data.candidate, from: userId }));
            }
        }
    });

    ws.on('close', () => {
        if (userId) {
            delete users[userId];
        }
    });
});

// ฟังก์ชันสำหรับสร้าง user ID
function generateUserId() {
    return Math.random().toString(36).substring(2, 9);
}
