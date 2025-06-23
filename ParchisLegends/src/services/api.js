// Simulación de WebSocket y API REST
let rooms = [];
let callbacks = [];

export function subscribeRooms(cb) {
  callbacks.push(cb);
  cb(rooms);
}

export function createRoom() {
  const id = Math.random().toString(36).slice(2, 6);
  rooms.push({ id });
  callbacks.forEach(cb => cb(rooms));
  return id;
}

export function joinRoom(id) {
  console.log('Join room', id);
}
