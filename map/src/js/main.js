import { addMarker, createMarker, filterMarkerList, markerFormClose } from "./marker.js";
import getMarkerInfo from "./modal.js"
const buttonAddMarker = document.querySelector("#add-marker")
const searchMarkerHTML = document.querySelector("#search")
let stateAddMarker = false


// Создаем карту
const map = L.map('map').setView([55.7558, 37.6176], 13);

// Добавляем слой OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);


// Добавляем попап к маркеру
L.Marker.prototype.setIconColor = setColor

for (const markerInfo of JSON.parse(localStorage.getItem("markerList")) ?? []) {
    const marker = createMarker(markerInfo.latlng.lat, markerInfo.latlng.lng, markerInfo)
    addMarker(marker)
}

buttonAddMarker.addEventListener("click", function(event) {
    stateAddMarker = true
    L.DomUtil.addClass(map._container,'cursor-pointer')
})

// Обработчик события щелчка по карте
map.on('click', async function (e) {
    if (stateAddMarker) {
        const lat = e.latlng.lat; // Широта
        const lng = e.latlng.lng; // Долгота
        
        stateAddMarker = false
        L.DomUtil.removeClass(map._container,'cursor-pointer')

        getMarkerInfo().then(info => {
            const marker = createMarker(lat, lng, info)
            addMarker(marker)
        })
        .catch(err => console.error(err)) 
    }
    markerFormClose()
});

searchMarkerHTML.addEventListener("input", debounce(function() {
    filterMarkerList(this.value)
}))

function debounce(func, timeout = 1000){
    let timer;
    return function(...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    };
}

async function setColor(color) {
    const rgbRegexp = /rgba?\((?<r>[.\d]+)[, ]+(?<g>[.\d]+)[, ]+(?<b>[.\d]+)(?:\s?[,\/]\s?(?<a>[.\d]+%?))?\)/
    const rgb = color.match(rgbRegexp).groups
    const img = new Image();
    img.src = "./assets/img/marker.svg";
    
    const srcNewImage = await new Promise(resolve => {
        img.onload = function () {
            // Получаем контекст для рисования на холсте
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext('2d');
    
            // Отрисовываем SVG-иконку на холсте
            context.drawImage(img, 0, 0);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
            // Изменяем цвет (например, все красные пиксели меняем на синие)
            for (var i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = rgb.r;   // Красный
                imageData.data[i + 1] = rgb.g; // Зеленый
                imageData.data[i + 2] = rgb.b; // Синий
            }
            context.putImageData(imageData, 0, 0)
    
            // Возвращаем обновленные данные на холсте как URL данных
            resolve(canvas.toDataURL())
        };
    })

    const customIcon = L.icon({
        iconUrl: srcNewImage,
        iconSize: [30, 30], // Размер иконки (ширина x высота)
        iconAnchor: [15, 30], // Активная точка иконки (по умолчанию в центре нижней части)
    });

    this.setIcon(customIcon)   
}

export { map }