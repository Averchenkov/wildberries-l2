window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

const start = function() {
    const audio = document.getElementById('audio');
    let ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    const audioSrc = ctx.createMediaElementSource(audio);
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);

    const canvas = document.getElementById('canvas')
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const cwidth = canvas.width
    const cheight = canvas.height
    const gap = 1    // Расстояние между столбиками
    
    ctx = canvas.getContext('2d'),
    gradient = ctx.createLinearGradient(0, 0, 0, cheight);
    gradient.addColorStop(1, '#35D62D');    // Красный
    gradient.addColorStop(0.6, '#F5F82E');    // Оранжевый
    gradient.addColorStop(0, '#FF2300');    // Зеленый

    // Зацикливание
    function renderFrame() {
        var uint8array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(uint8array);
        ctx.clearRect(0, 0, cwidth, cheight);

        const frequencies = Array.from(uint8array).map((el, i) => {
            // Увеличение значения частоты по мере приближения к краю высоких,
            // так как по стандарту значение частоты постепенно уменьшается от низких к высоким
            return el * (1 + i * 0.001)
        })
        // Обрезка части нижнего частотного диапазона, потому что там ничего не воспроизводится
        frequencies.length = Math.round(frequencies.length * 0.97)

        let j = 1
        let i = 0
        const pow = 6
        const step = 0.009
        const array = []

        while (j < frequencies.length) {
            const prev = j
            const next = j + 1 + Math.pow(i, pow)
            array.push(findAverageInRange(frequencies, prev, next))
            i += step
            j = next
        }
    
        const meterWidth = cwidth / array.length    // Ширина столбиков
        
        for (let i = 0; i < array.length; i++) {
            const amount = array[i];
            const percent = amount / 255;
            const value = cheight * percent

            ctx.fillStyle = gradient;
            ctx.fillRect(i * meterWidth, cheight - value, meterWidth - gap, cheight + 100);
        }
        
        requestAnimationFrame(renderFrame);
    }
    renderFrame();
};


audio.onplay = function(){
    start();
}

function findAverageInRange(arr, startIndex, endIndex) {
  // Проверка на пустой массив и коррекция индексов
  if (arr.length === 0 || startIndex < 0 || endIndex >= arr.length || startIndex > endIndex) {
    return 0;
  }

  // Получение подмассива в указанном диапазоне
  const range = arr.slice(startIndex, endIndex + 1);

  // Вычисление суммы всех чисел в диапазоне
  const sum = range.reduce((total, current) => total + current, 0);

  // Вычисление среднего значения
  const average = sum / range.length;

  return average;
}