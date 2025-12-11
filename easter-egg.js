
// WaveSurfer is loaded globally from the UMD script tag
// Random Demo Assets are loaded from the demo-assets.json file
// The assets are then shuffled and loaded into the randomDemoAssets array
// When the audio finishes playing, a random asset is selected and loaded

// initialize the easter egg
let srcURL = "https://demos.audioshake.ai/demo-assets/shakeitup.mp3"

let randomDemoAssets = []


const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#00F5A0',
    progressColor: '#00D9F5',
    url: srcURL,
})

wavesurfer.on('interaction', () => {
    wavesurfer.play()
})

wavesurfer.on('finish', () => {
    wavesurfer.stop()
    updateEasterEgg()
})

async function updateEasterEgg() {
    console.log("updateEasterEgg")
    let randomAsset = randomDemoAssets[Math.floor(Math.random() * randomDemoAssets.length)];
    console.log("randomAsset.", randomAsset)

    const titleOverlay = document.createElement('div');
    titleOverlay.textContent = randomAsset.title;
    titleOverlay.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    color: white;
    font-size: 1.2em;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    border-radius: 5px;
    z-index: 10;
`;
    document.getElementById('waveform').appendChild(titleOverlay);
    wavesurfer.load(randomAsset.src)

}

async function loadRandomDemoAsset() {
    state.isDemo = true
    const response = await fetch("./assets/demo-assets.json");
    const demoData = await response.json();
    randomDemoAssets = demoData.assets
    console.log("randomDemoAssets", randomDemoAssets)
}

loadRandomDemoAsset();