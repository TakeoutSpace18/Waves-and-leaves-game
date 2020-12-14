class NotifyObject {
  constructor() {
    this.listeners = Object();
  }

  on(evt, callback) {
    //console.log("Listener added: " + evt);
    if (!this.listeners.hasOwnProperty(evt)) {
      this.listeners[evt] = Array();
    }
    this.listeners[evt].push(callback);
  }

  internalTriggerProcess(evt, params) {
    //Please override this function for custom processing;
  }

  trigger(evt, params) {
    //console.log("trigger called " + evt);
    //console.dir(listeners);

    if (evt in this.listeners) {
      var callbacks = this.listeners[evt];
      //Call all callbacks with the params
      for (var x in callbacks) {
        callbacks[x](params);
      }
    } else {
      //console.log("No listeners found for " + evt);
    }

    this.internalTriggerProcess(evt, params);
  }
}