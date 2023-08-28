import { io } from 'socket.io-client'

class Socket {
	socket;
	constructor () {}

	connect(username, chatid) {
		this.socket = io('https://api-aurorareg.onrender.com');
		this.socket.emit('online', { username, chatid });
	}

	checkMsg (cb) {
		if (!this.socket) return(true);
		this.socket.on('message', msg => {
			return cb(null, msg);
		});
	}

	checkOnline(cb) {
		if (!this.socket) return(true);
		this.socket.on('online', data => {
			return cb(null, data);
		});
	}

	checkLeave(cb) {
		if (!this.socket) return(true);
		this.socket.on('leave', data => {
			return cb(null, data);
		});
	}

	sendMessage(message, chatId, from, date) {
		if (this.socket) this.socket.emit('message', { message, chatId, from, date });
	}

	disconnect(index, chatid) {
		if (this.socket) {
			this.socket.emit('leave', { index, chatid });
			this.socket.disconnect();
		}
	}
}

export default new Socket();
