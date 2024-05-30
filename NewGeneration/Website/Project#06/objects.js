// const Sound = function(opts = {}) {
//   let audio
//   let audioGain
//   let sound
//   reset.bind(this)(opts)
//   this.play = function() {
//     sound.start()
//   }
//   this.stop = function() {
//     sound.stop()
//     let _this = this
//     reset.bind(this)({
//       frequency: _this.frequency.value,
//       volume: _this.volume.value,
//       type: _this.type,
//     })
//   }
  
//   Object.defineProperty(this, "type", {
//     set: function(value) {
//       if(String(value) !== value) return
//       sound.type = value
//     },
//     get: function() {
//       return sound.type
//     }
//   })
//   function reset(opts) {
//     audio = new AudioContext()
//     audioGain = audio.createGain()
//     sound = audio.createOscillator()
    
//     sound.type = ("type" in opts) && (String(opts) === opts) ? opts["type"] : "sine"
//     this.frequency = sound.frequency
//     this.frequency.value = ("frequency" in opts) && (Number(opts) === opts) ? opts["frequency"] : 1
    
//     sound.connect(audioGain)
//     audioGain.connect(audio.destination)
//     this.volume = audioGain.gain
//     this.volume.value = ("type" in opts) && (Number(opts) === opts) ? opts["volume"] : 100
//   }
//   function time(value) {
//     if(!value) return 0
//     if(Number(value) === value) return value
//     else if(String(value) === value) {
//       let factor, _time = []
//       value = value.split('-')
//       for(let clock of value) {
//         switch(clock.match(/([a-z]+)/g)[0]) {
//           case '':
//             factor = 1
//             break;
//           case 'ms':
//             factor = 1
//             break;
//           case 'sec':
//             factor = 1000
//             break;
//           case 'min':
//             factor = 1000 * 60
//             break;
//           case 'hr':
//             factor = 1000 * 60 * 60
//             break;
//           default:
//             throw new TypeError(`Invalid time type: "${clock.match(/([a-z]+)/g)[0]}"`)
//         }
//         clock = !!parseFloat(clock) ? parseFloat(clock) : 1
//         _time.push(factor * clock)
//       }
//       return value.reduce((x,y) => x+y)
//     }
//     else throw new TypeError("Invalid time datatype!")
//   }
// }