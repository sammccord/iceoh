import samples from './samples'
const sampleSelect = document.getElementById('samples')

let cleanupCurrentSample = samples[sampleSelect.options[sampleSelect.selectedIndex].value]()
sampleSelect.addEventListener('change', (event) => {
  cleanupCurrentSample()
  cleanupCurrentSample = samples[event.target.value]()
});
