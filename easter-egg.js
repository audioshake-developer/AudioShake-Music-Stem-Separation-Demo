
// WaveSurfer is loaded globally from the UMD script tag
// todo -- change to evergreen url
// let url = "https://demos.spatial-explorer.com/demo-assets/shakeitup.mp3"

let url = "https://demos.audioshake.ai/demo-assets/Audiio_Drakeford_The_Venture_Stronger_Than_One.wav";

const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#4F4A85',
    progressColor: '#383351',
    url: url,
})

wavesurfer.on('interaction', () => {
    wavesurfer.play()
})
