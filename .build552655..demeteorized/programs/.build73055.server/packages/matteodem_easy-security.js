(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;
var _ = Package.underscore._;
var Random = Package.random.Random;

/* Package-scope variables */
var EasySecurity;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/matteodem:easy-security/lib/easy-security.js                                                  //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
EasySecurity = (function () {                                                                             // 1
  'use strict';                                                                                           // 2
                                                                                                          // 3
  var methods = {};                                                                                       // 4
                                                                                                          // 5
  var configuration = {                                                                                   // 6
      general: { type: 'rateLimit', ms: 500 },                                                            // 7
      hooks: {},                                                                                          // 8
      methods: {},                                                                                        // 9
      ignoredMethods: ['login'],                                                                          // 10
      maxQueueLength: 100                                                                                 // 11
  };                                                                                                      // 12
                                                                                                          // 13
  configuration._defaults = _.clone(configuration.general);                                               // 14
                                                                                                          // 15
  var Future = null;                                                                                      // 16
                                                                                                          // 17
  if (Meteor.isServer) {                                                                                  // 18
    Future = Npm.require('fibers/future');                                                                // 19
  } else if (Meteor.isClient) {                                                                           // 20
    // Future Fake                                                                                        // 21
    Future = function () {};                                                                              // 22
    Future.prototype.wait = function () {};                                                               // 23
    Future.prototype.return = function () {};                                                             // 24
  }                                                                                                       // 25
                                                                                                          // 26
  /**                                                                                                     // 27
   * Helper Functions                                                                                     // 28
   */                                                                                                     // 29
  function getId(scope, rand) {                                                                           // 30
    if (scope && scope.userId) {                                                                          // 31
      var userId = scope.userId;                                                                          // 32
    }                                                                                                     // 33
                                                                                                          // 34
    if (scope && scope.connection) return scope.connection.id;                                            // 35
    else if (userId) return userId;                                                                       // 36
    else return rand;                                                                                     // 37
  }                                                                                                       // 38
                                                                                                          // 39
  function wrapHooks(name, func) {                                                                        // 40
    var hooks = configuration.hooks[name] || [];                                                          // 41
                                                                                                          // 42
    return function () {                                                                                  // 43
      var funcScope = this, args = Array.prototype.slice.call(arguments);                                 // 44
                                                                                                          // 45
      var canExecute = _.every(_.map(hooks, function (hook) {                                             // 46
        return hook.apply(funcScope, args);                                                               // 47
      }));                                                                                                // 48
                                                                                                          // 49
      if (!canExecute) {                                                                                  // 50
        throw new Meteor.Error("Hook stopped " + name + " from being executed");                          // 51
      }                                                                                                   // 52
                                                                                                          // 53
      return func.apply(this, arguments);                                                                 // 54
    };                                                                                                    // 55
  }                                                                                                       // 56
                                                                                                          // 57
  /**                                                                                                     // 58
   * RateLimit Method                                                                                     // 59
   */                                                                                                     // 60
  methods.rateLimit = {                                                                                   // 61
    queues: {                                                                                             // 62
      // 'someId' : { functions: [func, func, func, func...], timer: ... }                                // 63
    },                                                                                                    // 64
    callFunctionsInQueue: function (id, funcScope) {                                                      // 65
      var funcs = this.queues[id].functions,                                                              // 66
        func = funcs.shift(),                                                                             // 67
        funcData;                                                                                         // 68
                                                                                                          // 69
      if (func) {                                                                                         // 70
        funcData = func._esData;                                                                          // 71
        funcData.future.return(func.apply(funcScope, funcData.args));                                     // 72
      } else {                                                                                            // 73
        this.queues[id].timer = null;                                                                     // 74
      }                                                                                                   // 75
                                                                                                          // 76
      if (funcs.length > configuration.maxQueueLength) {                                                  // 77
        this.queues[id].functions = [];                                                                   // 78
      }                                                                                                   // 79
    },                                                                                                    // 80
    wrap: function (func, ms, timeout) {                                                                  // 81
      var random = Random.id(),                                                                           // 82
        methodScope = methods.rateLimit;                                                                  // 83
                                                                                                          // 84
      if (!timeout) {                                                                                     // 85
        timeout = Meteor.setTimeout;                                                                      // 86
      }                                                                                                   // 87
                                                                                                          // 88
      function timeoutFunction(func, ms, id) {                                                            // 89
        if (methodScope.queues[id].timer) {                                                               // 90
          timeout(function () {                                                                           // 91
            func();                                                                                       // 92
            timeoutFunction(func, ms, id);                                                                // 93
          }, ms);                                                                                         // 94
        }                                                                                                 // 95
      }                                                                                                   // 96
                                                                                                          // 97
      return function () {                                                                                // 98
        var id = getId(this, random),                                                                     // 99
          future = new Future(),                                                                          // 100
          funcScope = this,                                                                               // 101
          args = arguments;                                                                               // 102
                                                                                                          // 103
        if (!methodScope.queues[id]) {                                                                    // 104
          methodScope.queues[id] = { 'functions' : [] };                                                  // 105
        }                                                                                                 // 106
                                                                                                          // 107
        func._esData = { args: args, future: future };                                                    // 108
        methodScope.queues[id].functions.push(func);                                                      // 109
                                                                                                          // 110
        if (!methodScope.queues[id].timer) {                                                              // 111
          methodScope.queues[id].timer = true;                                                            // 112
          methodScope.callFunctionsInQueue(id, funcScope);                                                // 113
                                                                                                          // 114
          timeoutFunction(function () {                                                                   // 115
            methodScope.callFunctionsInQueue(id, funcScope);                                              // 116
          }, ms, id);                                                                                     // 117
        }                                                                                                 // 118
                                                                                                          // 119
        return future.wait();                                                                             // 120
      };                                                                                                  // 121
    }                                                                                                     // 122
  };                                                                                                      // 123
                                                                                                          // 124
  // inspiration from http://blogorama.nerdworks.in/javascriptfunctionthrottlingan/                       // 125
                                                                                                          // 126
  /**                                                                                                     // 127
   * Throttle Method                                                                                      // 128
   */                                                                                                     // 129
  methods.throttle = {                                                                                    // 130
    queues: {                                                                                             // 131
      // 'someId' : { data: [], previousCall: time }                                                      // 132
    },                                                                                                    // 133
    wrap: function throttle(func, ms, collectData) {                                                      // 134
      var methodScope = methods.throttle,                                                                 // 135
        random = Random.id();                                                                             // 136
                                                                                                          // 137
      return function () {                                                                                // 138
        var id = getId(this, random),                                                                     // 139
          now = new Date().getTime(),                                                                     // 140
          funcScope = this || {};                                                                         // 141
                                                                                                          // 142
        if (!methodScope.queues[id]) {                                                                    // 143
          methodScope.queues[id] = { data: [], previousCall: null };                                      // 144
        }                                                                                                 // 145
                                                                                                          // 146
        if (collectData) {                                                                                // 147
          methodScope.queues[id].data.push(Array.prototype.slice.call(arguments));                        // 148
        }                                                                                                 // 149
                                                                                                          // 150
        if (!methodScope.queues[id].previousCall || (now  - methodScope.queues[id].previousCall) >= ms) { // 151
          var data = methodScope.queues[id].data;                                                         // 152
                                                                                                          // 153
          methodScope.queues[id].previousCall = now;                                                      // 154
          funcScope.collectedData = collectData ? { data: _.clone(data) } : null;                         // 155
          methodScope.queues[id].data = [];                                                               // 156
                                                                                                          // 157
          return func.apply(funcScope, arguments);                                                        // 158
        }                                                                                                 // 159
                                                                                                          // 160
        return null;                                                                                      // 161
      };                                                                                                  // 162
    }                                                                                                     // 163
  };                                                                                                      // 164
                                                                                                          // 165
  /**                                                                                                     // 166
   * Debounce Method                                                                                      // 167
   */                                                                                                     // 168
  var debounce = {                                                                                        // 169
    queues: {                                                                                             // 170
      // 'someId' : { data: [], previousCall: time }                                                      // 171
    },                                                                                                    // 172
    wrap: function (func, ms, collectData) {                                                              // 173
      var methodScope = debounce,                                                                         // 174
        random = Random.id();                                                                             // 175
                                                                                                          // 176
      return function () {                                                                                // 177
        var id = getId(this, random),                                                                     // 178
          funcScope = this || {},                                                                         // 179
          args = arguments;                                                                               // 180
                                                                                                          // 181
        if (!methodScope.queues[id]) {                                                                    // 182
          methodScope.queues[id] = { data: [], timeout: null };                                           // 183
        }                                                                                                 // 184
                                                                                                          // 185
        if (collectData) {                                                                                // 186
          methodScope.queues[id].data.push(Array.prototype.slice.call(args));                             // 187
        }                                                                                                 // 188
                                                                                                          // 189
        if (methodScope.queues[id].timeout) {                                                             // 190
          Meteor.clearTimeout(methodScope.queues[id].timeout);                                            // 191
        }                                                                                                 // 192
                                                                                                          // 193
        methodScope.queues[id].timeout = Meteor.setTimeout(function () {                                  // 194
          var data = methodScope.queues[id].data;                                                         // 195
          funcScope.collectedData = collectData ? _.clone({ data: data }) : null;                         // 196
          methodScope.queues[id].data = [];                                                               // 197
          methodScope.queues[id].timeout = null;                                                          // 198
          func.apply(funcScope, args);                                                                    // 199
        }, ms);                                                                                           // 200
                                                                                                          // 201
        return null;                                                                                      // 202
      };                                                                                                  // 203
    }                                                                                                     // 204
  };                                                                                                      // 205
                                                                                                          // 206
  return {                                                                                                // 207
    debounce: debounce.wrap,                                                                              // 208
    throttle: methods.throttle.wrap,                                                                      // 209
    rateLimit: methods.rateLimit.wrap,                                                                    // 210
    log: function () {                                                                                    // 211
      if (EasySecurity.DEBUG) {                                                                           // 212
        console.log('EasySecurity LOG: ' + Array.prototype.slice.call(arguments).join(', '));             // 213
      }                                                                                                   // 214
    },                                                                                                    // 215
    config: function (newConfig) {                                                                        // 216
      if (!newConfig) {                                                                                   // 217
        return configuration;                                                                             // 218
      }                                                                                                   // 219
                                                                                                          // 220
      configuration.general = _.extend(configuration.general, newConfig.general);                         // 221
      configuration.methods = _.extend(configuration.methods, newConfig.methods);                         // 222
      configuration.ignoredMethods = _.union(configuration.ignoredMethods, newConfig.ignoredMethods);     // 223
      EasySecurity.DEBUG = newConfig.debug;                                                               // 224
    },                                                                                                    // 225
    addHook: function (name, func) {                                                                      // 226
      if (!configuration.hooks[name]) {                                                                   // 227
        configuration.hooks[name] = [];                                                                   // 228
      }                                                                                                   // 229
                                                                                                          // 230
      configuration.hooks[name].push(func);                                                               // 231
    },                                                                                                    // 232
    getHooks: function (name) {                                                                           // 233
      return configuration.hooks[name] || [];                                                             // 234
    },                                                                                                    // 235
    resetHooks: function (name) {                                                                         // 236
      configuration.hooks[name] = [];                                                                     // 237
    },                                                                                                    // 238
    getMethod: function (name) {                                                                          // 239
      if (!methods[name]) {                                                                               // 240
        throw new Meteor.Error('Method: ' + name + ' does not exist!');                                   // 241
      }                                                                                                   // 242
                                                                                                          // 243
      return methods[name];                                                                               // 244
    },                                                                                                    // 245
    getSecuredFunction: function (name, func) {                                                           // 246
      var conf = configuration.general;                                                                   // 247
                                                                                                          // 248
      if (configuration.methods[name]) {                                                                  // 249
        conf = configuration.methods[name];                                                               // 250
      }                                                                                                   // 251
                                                                                                          // 252
      if (configuration.ignoredMethods.indexOf(name) > -1) {                                              // 253
        return func;                                                                                      // 254
      }                                                                                                   // 255
                                                                                                          // 256
      return wrapHooks(name, this.getMethod(conf.type).wrap(func, conf.ms));                              // 257
    },                                                                                                    // 258
    _getId: getId                                                                                         // 259
  };                                                                                                      // 260
})();                                                                                                     // 261
                                                                                                          // 262
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/matteodem:easy-security/lib/server.js                                                         //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
var connections = {},                                                                                     // 1
  calls = {};                                                                                             // 2
                                                                                                          // 3
var rateLimit = EasySecurity.rateLimit(function () {                                                      // 4
  var funcScope = this, args = Array.prototype.slice.call(arguments);                                     // 5
                                                                                                          // 6
  return _.every(_.map(EasySecurity.getHooks('login'), function (hook) {                                  // 7
    return hook.apply(funcScope, args);                                                                   // 8
  }));                                                                                                    // 9
}, 500);                                                                                                  // 10
                                                                                                          // 11
Meteor.server.onConnection(function (conn) {                                                              // 12
  connections[conn.clientAddress] = conn;                                                                 // 13
});                                                                                                       // 14
                                                                                                          // 15
// Hook into the raw ddp calls being sent                                                                 // 16
Meteor.server.stream_server.server.on('connection', function (socket) {                                   // 17
  if (!calls[socket.remoteAddress]) {                                                                     // 18
    calls[socket.remoteAddress] = [];                                                                     // 19
  }                                                                                                       // 20
                                                                                                          // 21
  EasySecurity.log(socket.remoteAddress + ' connected');                                                  // 22
                                                                                                          // 23
  socket.on('data', function (raw) {                                                                      // 24
    var ipAddr = socket.remoteAddress;                                                                    // 25
                                                                                                          // 26
    calls[ipAddr].push({ time: (new Date()).getTime(), data: raw });                                      // 27
    EasySecurity.log(ipAddr + ' sent '+ raw);                                                             // 28
                                                                                                          // 29
    if (calls[ipAddr].length > 100) {                                                                     // 30
      // More than 100 times data received in the past 5 seconds, close the socket                        // 31
      if ((calls[ipAddr][calls[ipAddr].length - 1].time  - calls[ipAddr][0].time) < 1000 * 5) {           // 32
        EasySecurity.log(ipAddr + ' sent data over 100 times in the past 5 seconds!');                    // 33
        EasySecurity.log('Closing session!');                                                             // 34
        socket.end();                                                                                     // 35
        calls[ipAddr] = [];                                                                               // 36
      } else {                                                                                            // 37
        calls[ipAddr] = [];                                                                               // 38
      }                                                                                                   // 39
    }                                                                                                     // 40
  });                                                                                                     // 41
                                                                                                          // 42
  socket.on('close', function () {                                                                        // 43
    EasySecurity.log(socket.remoteAddress + ' disconnected');                                             // 44
  });                                                                                                     // 45
});                                                                                                       // 46
                                                                                                          // 47
Meteor.startup(function () {                                                                              // 48
  'use strict';                                                                                           // 49
                                                                                                          // 50
  var _methods = Meteor.methods;                                                                          // 51
                                                                                                          // 52
  function createWrappedMethod(name, func) {                                                              // 53
    // create the securityWrappedMethod by the configuration                                              // 54
    return EasySecurity.getSecuredFunction(name, func);                                                   // 55
  }                                                                                                       // 56
                                                                                                          // 57
  function wrapMethods(methods) {                                                                         // 58
    var name;                                                                                             // 59
                                                                                                          // 60
    for (name in methods) {                                                                               // 61
      methods[name] = createWrappedMethod(name, methods[name]);                                           // 62
    }                                                                                                     // 63
                                                                                                          // 64
    return methods;                                                                                       // 65
  }                                                                                                       // 66
                                                                                                          // 67
  // Login hooks, needs to be handled with its own hooks                                                  // 68
  if (typeof Accounts !== "undefined") {                                                                  // 69
    Accounts.onLogin(rateLimit);                                                                          // 70
    Accounts.onLoginFailure(rateLimit);                                                                   // 71
  }                                                                                                       // 72
                                                                                                          // 73
  // Rewrite current registered methods and methods function                                              // 74
  Meteor.server.method_handlers = wrapMethods(Meteor.server.method_handlers);                             // 75
                                                                                                          // 76
  Meteor.methods = function (methods) {                                                                   // 77
    return _methods.apply(this, [wrapMethods(methods)]);                                                  // 78
  };                                                                                                      // 79
});                                                                                                       // 80
                                                                                                          // 81
////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['matteodem:easy-security'] = {
  EasySecurity: EasySecurity
};

})();

//# sourceMappingURL=matteodem_easy-security.js.map
