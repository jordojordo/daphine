import EventEmitter from 'events';

class ServerEventEmitter extends EventEmitter {
  public markServerAsReady(): void {
    this.emit('ready', true);
  }

  public markServerAsNotReady(): void {
    this.emit('ready', false);
  }
}

const serverEvents = new ServerEventEmitter();

export default serverEvents;