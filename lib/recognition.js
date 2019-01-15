
let startBtn = document.querySelector('.start-btn')
let audioPlay
// audioPlay.playbackRate = 0.8

let recognition = new webkitSpeechRecognition()
// set params
recognition.continuous = false
recognition.interimResults = true
adjustStartSecond = -0.5
adjustEndSecond = 0.5

// start immediately
// recognition.start();


let playingFlag = false
let currentCaption
startBtn.addEventListener('click', function () {
  audioPlay = document.querySelector('.audio-player')
  recognition.lang = $('.lang').val()
  
  $('.recognition-status').attr('data-recognition-status', 'wait')
  
  playingFlag = true
  //SpeechToText.setPlayer()
  SpeechToText.addRow()
  
  var errorCount = 0

  var startRecognition = function () {
    try {
      //audioPlay.play()
      SpeechToText.audioPlay()
    }
    catch (e) {
      console.log(e)
      errorCount++
      console.log('Audio player load failed (' + errorCount + ')')
      
      if (errorCount > 3) {
        if (window.confirm('Audio player is broken. Do you want to refresh this page?')) {
          location.reload()
        }
        return 
      }
      setTimeout(function () {
        startRecognition()
      }, 0)
    }
    
    setTimeout(() => {
      recognitionFinish()
    }, (SpeechToText.getDuration() * 1000 + 100))
    //console.log(audioPlay.duration * 1000 + 100)

    // $('<div>0:00</div>').insertBefore(text)
    recognition.start()

    //document.querySelector('.text-content').style.display = 'block'
    $('.text-content').removeClass('hide')
  }
  startRecognition()
})

let recognitionFinish = function () {
  recognition.stop()
  playingFlag = false
  $('.content-controller .button.disabled').removeClass('disabled')
  $('.recognition-status').attr('data-recognition-status', 'finish')
  SpeechToText.complete()
  console.log('finish')
}

recognition.onresult = function (event) {
  let result = event.results[ event.results.length - 1 ]
  // let section = $('<div></div>').text(result[result.length - 1 ].transcript)
  // $(text).append(section);
  let transcript = result[ result.length - 1 ].transcript.trim()
  let caption = SpeechToText.getCaption()
  if (caption === '' && transcript !== '') {
    SpeechToText.setStart(SpeechToText.getPlayerCurrentTime(adjustStartSecond))
  }
  SpeechToText.setCaption(transcript)
}

// speech error handling
recognition.onerror = function (event) {
  console.log('error', event)
}

recognition.onend = function () {
  let caption = SpeechToText.getCaption()
  if (caption !== '') {
    SpeechToText.setEnd(SpeechToText.getPlayerCurrentTime(adjustEndSecond))
  }
  console.log('end')
  // auto restart
  if (playingFlag === true) {
    if (caption !== '') {
      SpeechToText.addRow()
    }
    recognition.start()
  }
}