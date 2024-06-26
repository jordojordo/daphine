import http from 'http';

import app from './index';
import serverEvents from '@src/modules/serverEventEmitter';

const normalizePort = (val: string): number | string | void => {
	const port = parseInt(val, 10);

	if ( isNaN(port) ) {
		// named pipe
		return val;
	}

	if ( port >= 0 ) {
		return port;
	}
};

const onError = (error: NodeJS.ErrnoException): void => {
	if ( error.syscall !== 'listen' ) {
		throw error;
	}

	if ( error.syscall === 'listen' ) {
		serverEvents.markServerAsNotReady();
	}

	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

	switch ( error.code ) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`);
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const onListening = (): void => {
	serverEvents.markServerAsReady();
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
