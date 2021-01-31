function cons(line) {
  //console.log(line)
}


const Meditation = 0;
const MeditationHistory = 1;
const Concentration = 2;
const ConcentrationHistory = 3;
const BCI = 'bci';
const Rhythms = 5;
const RhythmsHistory = 6;
const MentalState = 7;
const MentalStateHistory = 8;
const RecordMentalState = 9;
const RemoveMentalStateRecord = 10;
const StartMentalStates = 11;
const StopMentalStates = 12;
const StartDevice = 13;
const StopDevice = 14;
const ListDevices = 15;
const DeviceCount = 16;
const DeviceInfo = 17;
const MakeFavorite = 18;
const StartRecord = 'StartRecord';
const StopRecord = 'StopRecord';
const Help = 21;

class NeuroplayConnector extends NotifyObject {
  constructor() {
    super();
    this.socket = null;
    this.timeout = null;
    this.watcher = null;
    this.lastmessagetime = 0;
    this.canconnect = true;
  }

  connect() {
    this.disconnect();

    if (!this.canconnect) return;

    cons("Connecting");


    this.socket = new WebSocket("ws://localhost:1336");

    var that = this;
    this.socket.onopen = function (event) {
      cons('Соединение установлено');
      //that.send("Hi");
      that.messageConnect(false);
      //that.trigger('connected');
      //that.trigger('connectedChanged', {connected: true});
    }

    this.socket.onclose = function (event) {
      if (event.wasClean) {
        cons('Соединение закрыто чисто');
      } else {
        cons('Обрыв соединения', "#C39"); // например, "убит" процесс сервера
      }
      cons('Код: ' + event.code + ' причина: ' + event.reason);

    };

    this.socket.onmessage = function (event) {
      var s = JSON.parse(event.data);

      that.lastmessagetime = new Date().getTime();

      cons(s);

      if (s.command == 'bci') {
        that.trigger('bci', s);
      }

      if (s.command == "stoprecord") {
        //console.log(s);
        //console.log('message')
        that.trigger('edfData', s);
      }

      if (s.command == "controloptions") {
        that.trigger('controlOptions', s);
      }
    };

    this.socket.onerror = function (error) {
      cons("Ошибка", error);
    };

    this.watcher = setInterval(function () {
      if (new Date().getTime() - that.lastmessagetime > 3000) {
        that.messageConnect(false);
        that.connect();
      }

    }, 5000);

    this.timeout = setInterval(function () {
      that.send(BCI);
    }, 100);
  }

  standalone() {
    this.canconnect = false;
  }

  messageBci(sample) {
    this.trigger(BCI, sample);
  }

  sendRecordData(sample) {
    this.trigger('edfData', sample);
  }

  controlOptions(sample) {
    this.trigger('controlOptions', sample);
  }

  messageConnect(connected) {
    this.trigger(connected ? 'connected' : 'disconnected');
    this.trigger('connectedChanged', { connected: connected });
  }

  send(text) {
    if (this.socket && this.socket.readyState == 1) {
      this.socket.send(text);
    }
  }

  start() {
    this.send(StartRecord);
  }

  stop() {
    this.send(StopRecord);
    cons('Послали остановку')
  }

  controlOptions() {
    this.send('controlOptions')
  }

  disconnect() {
    clearInterval(this.watcher);
    clearInterval(this.timeout);

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

}