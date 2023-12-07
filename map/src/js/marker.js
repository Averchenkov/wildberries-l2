import { map } from "./main.js";
import getMarkerInfo from "./modal.js";

const markerListHTML = document.querySelector("#marker-list")
const markerTemlate = document.querySelector("#marker")
const markerFormHTML = document.querySelector("#marker-form")

let markerList = []
let abortController = new AbortController();

function createMarker(lat, lng, info) {
    const marker = L.marker([lat, lng])

    marker.name = info.name
    marker.type = info.type
    marker.description = info.description
    marker.color = info.color

    marker.setIconColor(info.color)
    marker.addTo(map)
    marker.on("click", function() {
        markerFormOpen(this)
    })

    marker.addEventListener("mousedown", function (e) {
        map.dragging.disable();
        map.doubleClickZoom.disable();

        map.on('mousemove', function (e) {
            marker.setLatLng(e.latlng);
        })

        map.on('mouseup', function (e) {
            map.dragging.enable();
            map.doubleClickZoom.enable();
            map.off('mousemove');
            saveMarkerList()
        });
    })
    return marker
}

function addMarker(marker) {
    marker.id = getRandomNumbers()
    markerList.push(marker)
    saveMarkerList()
    addMarkerHTML(marker)
}

function addMarkerHTML(marker) {
    const markerHTML = createMarkerHTML(markerTemlate, marker)
    markerListHTML.appendChild(markerHTML)

    markerHTML.addEventListener("click", () => markerFormOpen(marker))
}

function createMarkerHTML(template, marker) {
    const cloneHTML = template.content.cloneNode(true)
    const markerHTML = cloneHTML.querySelector(".marker")
    const markerAvatarHTML = markerHTML.querySelector(".marker__avatar")
    const markerNameHTML = markerHTML.querySelector(".marker__name")
    const markerTypeHTML = markerHTML.querySelector(".marker__type")
    const markerDeleteBtnHTML = markerHTML.querySelector(".marker__delete-btn")
    
    markerHTML.setAttribute("name", marker.id)
    markerAvatarHTML.style.backgroundColor = marker.color
    markerNameHTML.textContent = marker.name
    markerTypeHTML.textContent = marker.type

    markerDeleteBtnHTML.addEventListener("click", function(event) {
        event.stopPropagation()
        deleteMarker(marker)
    })

    return markerHTML
}

function filterMarkerList(name) {
    const filterMarkerList = markerList.filter(marker => marker.name.toLowerCase().includes(name.toLowerCase()))
    renderMarkerList(filterMarkerList)
}

function renderMarkerList(markerList) {
    markerListHTML.innerHTML = ""
    for (const marker of markerList) {
        addMarkerHTML(marker)
    }
}

function getRandomNumbers() {
    const typedArray = new Uint8Array(10);
    const randomValues = window.crypto.getRandomValues(typedArray);
    return randomValues.join('');
}

function deleteMarker(marker) {
    markerFormClose()
    marker.remove()
    markerList = markerList.filter(({id}) => id !== marker.id)
    saveMarkerList()

    const markerHTML = markerListHTML.children[marker.id]
    markerHTML.remove()
}

function markerFormOpen(marker) {
    map.setView(Object.values(marker.getLatLng()), 13)

    const headerHTML = markerFormHTML.querySelector(".marker-form__header")
    const nameHTML = markerFormHTML.querySelector(".marker-form__name")
    const typeHTML = markerFormHTML.querySelector(".marker-form__type")
    const descriptionHTML = markerFormHTML.querySelector(".marker-form__description")
    const colorListHTML = markerFormHTML.querySelector(".marker-form__color-list")
    const deleteBtnHTML = markerFormHTML.querySelector(".marker-form__delete-btn")
    const editBtnHTML = markerFormHTML.querySelector(".marker-form__edit-btn")

    headerHTML.style.backgroundColor = marker.color
    nameHTML.textContent = marker.name
    typeHTML.textContent = marker.type
    descriptionHTML.textContent = marker.description

    abortController.abort()
    abortController = new AbortController()

    colorListHTML.markerColor.forEach(radioColorHTML => {
        const color = window.getComputedStyle(radioColorHTML.parentElement).color
        radioColorHTML.checked = marker.color === color
        radioColorHTML.onchange = null;
        radioColorHTML.addEventListener("change", function() {
            const color = window.getComputedStyle(this.parentElement).color
            marker.color = color
            marker.setIconColor(color)
            headerHTML.style.backgroundColor = color
            editMarkerHTML(marker)
        }, { signal: abortController.signal })
    });

    deleteBtnHTML.addEventListener("click", function() {
        deleteMarker(marker)
    }, { signal: abortController.signal })

    editBtnHTML.addEventListener("click", function() {
        markerFormClose()
        getMarkerInfo(marker).then(info => {
            marker.name = info.name
            marker.type = info.type
            marker.description = info.description
            marker.color = info.color

            marker.setIconColor(info.color)

            editMarkerHTML(marker)
        })
    }, { signal: abortController.signal })

    markerFormHTML.classList.add("marker-form_show")
}

function editMarkerHTML(marker) {
    saveMarkerList()
    const markerHTML = markerListHTML.children[marker.id]
    const markerAvatarHTML = markerHTML.querySelector(".marker__avatar")
    const markerNameHTML = markerHTML.querySelector(".marker__name")
    const markerTypeHTML = markerHTML.querySelector(".marker__type")
    
    markerAvatarHTML.style.backgroundColor = marker.color
    markerNameHTML.textContent = marker.name
    markerTypeHTML.textContent = marker.type
}


function markerFormClose() {
    markerFormHTML.classList.remove("marker-form_show")
}

function saveMarkerList() {
    const markerInfoList = markerList.map(marker => ({
        name: marker.name,
        type: marker.type,
        description: marker.description,
        color: marker.color,
        latlng: marker.getLatLng()
    }))
    localStorage.setItem("markerList", JSON.stringify(markerInfoList))
}

export { createMarker, addMarker, markerFormClose, filterMarkerList }