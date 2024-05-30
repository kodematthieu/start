(function(global, factory) {
  "use strict";
  
  if(typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function(w) {
        if(!w.document) throw new Error("Music.js requires a window with a document");
        return factory(w);
      };
  } 
  else factory(global);
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
  "use strict";
  
  var document = window.document;
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  
  var splice = [].splice;
  var concat = [].concat;
  var filter = [].filter;
  var push = [].push;
  
  
  var secret = {};
  for(var e of ["class"]) secret[e] = Symbol(e);
  
  var isType = function(item, expect, deep = true) {return deep ? item.constructor.name === expect.name : typeof item === expect.name.toLowerCase()};
  
  var setter = function(obj, key, fn) {
    Object.defineProperty(obj, key, {configurable: true, enumerable: true});
    Object.defineProperty(obj, key, {set: fn});
  };
  var getter = function(obj, key, fn) {
    Object.defineProperty(obj, key, {configurable: true, enumerable: true});
    Object.defineProperty(obj, key, {get: fn});
  };
  
  var objMerge = function() {
    var final = Array.from(arguments).splice(0, 1)[0] || {};
    for(var obj of Array.from(arguments).splice(1, Infinity)) {
      if(!obj || Object.prototype.toString.call(obj) !== "[object Object]") continue;
      for(var key in obj) {
        if(!obj.hasOwnProperty(key)) continue;
        if(Object.prototype.toString.call(obj[key]) === "[object Object]") {
          final[key] = objMerge(final[key], obj[key]);
          continue;
        }
        Object.defineProperty(final, key, {writable: true, enumerable: true, configurable: true, value: obj[key]});
      }
    }
    return final;
  };
  
  var defaultClass = function defaultClass(cls, opts = {}) {
    cls[Symbol.toStringTag] = cls.constructor.name;
    if("json" in opts) cls.constructor.prototype.json = function(val) {
      if(!(val === null || typeof val === "undefined") && isType(val, Object)) return objMerge(new this.constructor(), val);
      var base = this.constructor.name;
      var prop = opts.json;
      var propSerialized = {};
      for(var k of prop) propSerialized[k] = cls[k];
      return propSerialized;
    };
  };
  
  var Music = function Music(...args) {
    if(!(this instanceof Music)) return new Music(...args);
    defaultClass(this, {json: ["tracks"]});
    this.tracks = [];
    for(var track of args) {
      if(!(track instanceof Track)) continue;
      this.append(track);
      args = args.filter(function(e) {return e !== track});
    }
  };
  objMerge(Music.prototype, {
    append: function(track) {
      if(!track) throw new Error("Music.prototype.append needs at least 1 argument.");
      this.duration = 0;
      for(var e of arguments) {
        if(!(e instanceof Track)) continue;
        push(this.tracks, e);
      }
      for(var e of this.tracks) this.duration += e.delay + e.duration;
      return this;
    },
    remove: function(tone) {
      if(!tone) return this.remove(this.tracks[this.tracks.length-1]);
      this.duration = 0;
      for(var e of arguments) {
        if(!(e instanceof Track)) continue;
        this.tracks = filter(this.tracks, function(e1) {return e1 !== e});
      }
      for(var e of this.tracks) this.duration += e.delay + e.duration;
      return this;
    },
    merge: function(other) {
      if(!(other instanceof Music)) throw new TypeError("Music.prototype.merge has to have a Music argument");
      return new Music(...this.tracks, ...other.tracks);
    },
    play: function() {
      var delay = 0;
      for(var track of this.tracks) {
        setTimeout(function() {
          track.play();
        }, delay);
        delay += track.duration;
      }
      return this;
    }
  });
  
  var Track = function Track(...args) {
    if(!(this instanceof Track)) return new Track(...args);
    defaultClass(this, {json: ["tones", "delay", "volume"]});
    this._ctx_ = new AudioContext();
    this.tones = [];
    for(var tone of args) {
      if(!(tone instanceof Tone)) continue;
      this.append(tone);
      args = args.filter(function(e) {return e !== tone});
    }
    objMerge(this, {
      delay: 0,
      volume: {
        value: 100,
        fadeIn: 100,
        fadeOut: 100,
      }
    }, ...args);
    this._vol_ = this._ctx_.createGain();
    this._vol_.connect(this._ctx_.destination);
  };
  objMerge(Track.prototype, {
    append: function(tone) {
      if(!tone) throw new TypeError("Track.prototype.append needs at least 1 argument.");
      this.duration = 0;
      for(var e of arguments) {
        if(!(e instanceof Tone)) continue;
        this.tones.push(e);
      }
      for(var e of this.tones) this.duration += e.delay + e.duration;
      return this;
    },
    remove: function(tone) {
      if(!tone) return this.remove(this.tones[this.tones-1]);
      this.duration = 0;
      for(var e of arguments) {
        if(!(e instanceof Tone)) continue;
        this.tones = this.tones.filter(function(e1) {return e1 !== e});
      }
      for(var e of this.tones) this.duration += e.delay + e.duration;
      return this;
    },
    duplicate: function() {
      return objMerge(this, this.merge(this));
    },
    merge: function(other) {
      if(!(other instanceof Track)) throw new TypeError("Track.prototype.merge has to have a Track argument");
      return new Track(...this.tones, ...other.tones);
    },
    play: function() {
      if(this.volume.fadeIn) this._vol_.gain.exponentialRampToValueAtTime(this.volume.value/100, this._ctx_.currentTime + this.volume.fadeIn/1000);
      var delay = this.delay;
      for(var freq of this.tones) {
        setTimeout((function() {
          freq.play(this._ctx_, this._vol_);
        }).bind(this), delay);
        delay += freq.duration;
      }
      return this;
    }
  });
  
  var Tone = function Tone(opt) {
    if(!(this instanceof Tone)) return new Tone(...Array.from(arguments));
    defaultClass(this, {json: ["frequency", "type", "delay", "duration"]});
    objMerge(this, {
      frequency: 210,
      type: "sine",
      delay: 0,
      duration: 100
    }, opt);
  };
  objMerge(Tone.prototype, {
    play: function(ctx, vol) {
      this._freq_ = ctx.createOscillator();
      this._freq_.connect(vol);
      this._freq_.type = this.type;
      this._freq_.frequency.setValueAtTime(this.frequency, ctx.currentTime);
      setTimeout(function() {
        this._freq_.start();
        this._freq_.stop(ctx.currentTime + this.duration/1000);
      }, isType(delay, Number) ? delay : 0);
    }
  });
  
  var Note = function Note() {
    if(!(this instanceof Note)) return new Note(...Array.from(arguments));
    defaultClass(this);
    if(secret.class !== arguments[0]) throw new Error("Illegal constructor");
    this._origin_ = {
      "C0": 16.35, "C#0": 17.32, "Db0": 17.32, "D0": 18.35, "D#0": 19.45, "Eb0": 19.45, "E0": 20.60, "F0": 21.83, "F#0": 23.12, "Gb0": 23.12, "G0": 24.50, "G#0": 25.96, "Ab0": 25.96, "A0": 27.50, "A#0": 29.14, "Bb0": 29.14, "B0": 30.87,
      "C1": 32.70, "C#1": 34.65, "Db1": 34.65, "D1": 36.71, "D#1": 38.89, "Eb1": 38.89, "E1": 41.20, "F1": 43.65, "F#1": 46.25, "Gb1": 46.25, "G1": 49.00, "G#1": 51.91, "Ab1": 51.91, "A1": 55.00, "A#1": 58.27, "Bb1": 58.27, "B1": 61.74,
      "C2": 65.41, "C#2": 69.30, "Db2": 69.30, "D2": 73.42, "D#2": 77.78, "Eb2": 77.78, "E2": 82.41, "F2": 87.31, "F#2": 92.50, "Gb2": 92.50, "G2": 98.00, "G#2": 103.83, "Ab2": 103.83, "A2": 110.00, "A#2": 116.54, "Bb2": 116.54, "B2": 123.47,
      "C3": 130.81, "C#3": 138.59, "Db3": 138.59, "D3": 146.83, "D#3": 155.56, "Eb3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185.00, "Gb3": 185.00, "G3": 196.00, "G#3": 207.65, "Ab3": 207.65, "A3": 220.00, "A#3": 233.08, "Bb3": 233.08, "B3": 246.94,
      "C4": 261.63, "C#4": 277.18, "Db4": 277.18, "D4": 293.66, "D#4": 311.13, "Eb4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "Gb4": 369.99, "G4": 392.00, "G#4": 415.30, "Ab4": 415.30, "A4": 440.00, "A#4": 466.16, "Bb4": 466.16, "B4": 493.88,
      "C5": 523.25, "C#5": 554.37, "Db5": 554.37, "D5": 587.33, "D#5": 622.25, "Eb5": 622.25, "E5": 659.25, "F5": 698.46, "F#5": 739.99, "Gb5": 739.99, "G5": 783.99, "G#5": 830.61, "Ab5": 830.61, "A5": 880.00, "A#5": 932.33, "Bb5": 932.33, "B5": 987.77,
      "C6": 1046.50, "C#6": 1108.73, "Db6": 1108.73, "D6": 1174.66, "D#6": 1244.51, "Eb6": 1244.51, "E6": 1318.51, "F6": 1396.91, "F#6": 1479.98, "Gb6": 1479.98, "G6": 1567.98, "G#6": 1661.22, "Ab6": 1661.22, "A6": 1760.00, "A#6": 1864.66, "Bb6": 1864.66, "B6": 1975.53,
      "C7": 2093.00, "C#7": 2217.46, "Db7": 2217.46, "D7": 2349.32, "D#7": 2489.02, "Eb7": 2489.02, "E7": 2637.02, "F7": 2793.83, "F#7": 2959.96, "Gb7": 2959.96, "G7": 3135.96, "G#7": 3322.44, "Ab7": 3322.44, "A7": 3520.00, "A#7": 3729.31, "Bb7": 3729.31, "B7": 3951.07,
      "C8": 4186.01, "C#8": 4434.92, "Db8": 4434.92, "D8": 4698.63, "D#8": 4978.03, "Eb8": 4978.03, "E8": 5274.04, "F8": 5587.65, "F#8": 5919.91, "Gb8": 5919.91, "G8": 6271.93, "G#8": 6644.88, "Ab8": 6644.88, "A8": 7040.00, "A#8": 7458.62, "Bb8": 7458.62, "B8": 7902.13
    };
    this._copy_ = Object.assign({}, this._origin_);
  };
  objMerge(Note.prototype, {
    getFrequency: function(key) {
      if(!isType(key, String)) return "";
      return this._copy_[key];
    },
    setFrequency: function(key, value) {
      if(!isType(key, String) || !isType(value, Number)) return;
      this._copy_[key] = value;
      return this;
    },
    reset: function() {
      this._copy_ = Object.assign({}, this._origin_);
      return this;
    }
  });
  
  var Recorder = function Recorder(type) {
    if(!(this instanceof Recorder)) return new Recorder(...Array.from(arguments));
    defaultClass(this);
    this.type = type || "webm";
    this.mimeType = {mp3: "mpeg"};
    this.mimeType = this.mimeType[this.type] || this.type;
    this.records = [];
    this.recording = null;
  };
  objMerge(Recorder.prototype, {
    start: async function() {
      if(this.recording !== null) throw new Error("Can't record, already started!");
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      var self = this;
      var stream = await new Promise(function(res, rej) {navigator.getUserMedia({audio: true}, res, rej)}).catch(function(e) {throw e});
      this.recording = new MediaRecorder(stream, {mimeType: "audio/" + this.mimeType});
      this.recording.ondataavailable = function(event) {
        if(event.data.size > 0) [].push.call(self.records, event.data);
      };
      this.recording.start();
      return this;
    },
    stop: function() {
      if(this.recording === null) throw new Error(`${this.constructor.name} is not recording.`);
      this.recording.stop();
      return this;
    },
    download: function(name) {
      var blob = new Blob(this.records, {type: "audio/" + this.mimeType });
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = (name || "unnamed") + "." + this.type;
      a.click();
      // window.URL.revokeObjectURL(url);
      return this;
    },
    clear: function() {
      this.records = [];
      this.recording = null;
      return this;
    }
  });
  
  var embed = function(data, obj) {
    var namespace = (data.prototype || data).constructor.name;
    if(namespace in obj) throw new Error(`${namespace} already exists in ${obj.constructor.name}. Can't override ${namespace} from ${obj.constructor.name}.`);
    obj[namespace] = data;
  };
  for(var first of [Music, Track, Tone, Note, Recorder]) {
    for(var key of Object.getOwnPropertyNames(first.prototype)) {
      var val = first.prototype[key];
      if(typeof val === "function") {
        delete first.prototype[key];
        Object.defineProperty(first.prototype, key, {writable: false, enumerable: true, configurable: true, value: val});
      }
    }
    if(first !== Note) {
      try {first()} catch (e) {}
      for(var second of [Music, Track, Tone, Recorder]) if(first.prototype.constructor.name !== second.prototype.constructor.name) embed(second, first);
    }
  }
  embed(new Note(secret.class), Tone);
  if(!noGlobal) {
    embed(Music, window);
    embed(Track, window);
    embed(Tone, window);
    embed(Recorder, window);
  }
  return Music;
});