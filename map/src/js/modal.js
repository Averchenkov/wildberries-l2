const modalCreateMarker = document.querySelector("#create-marker")

const createMarkerCloseBtnHTML = modalCreateMarker.querySelector(".modal-create-marker__close-btn")
const inputMarkerNameHTML = modalCreateMarker.querySelector("#marker-name")
const inputMarkerTypeHTML = modalCreateMarker.querySelector("#marker-type")
const inputMarkerDescriptionHTML = modalCreateMarker.querySelector("#marker-description")
const markerColorListHTML = modalCreateMarker.querySelector(".color-list")
const createMarkerBtnHTML = modalCreateMarker.querySelector(".modal-create-marker__save-btn")

function getMarkerInfo(marker) {
    openModal(marker)
    return new Promise((resolve, reject) => {
        createMarkerBtnHTML.addEventListener("click", function() {
            const colorHTML = [...markerColorListHTML.markerColor].find(radioColorHTML => radioColorHTML.checked).parentElement

            const markerInfo = {
                name: inputMarkerNameHTML.value,
                type: inputMarkerTypeHTML.value,
                description: inputMarkerDescriptionHTML.value,
                color: window.getComputedStyle(colorHTML).color
            }
            resolve(markerInfo)
        }, {once : true})

        createMarkerCloseBtnHTML.addEventListener("click", function() {
            reject(null)
        }, {once : true})
    }).finally(() => closeModal())
}

function openModal(marker) {
    modalCreateMarker.classList.add("modal-create-marker_show")
    inputMarkerNameHTML.value = marker ? marker.name : ""
    inputMarkerTypeHTML.value = marker ? marker.type : ""
    inputMarkerDescriptionHTML.value = marker ? marker.description : ""
    if (marker) {
        markerColorListHTML.markerColor.forEach(radioColorHTML => {
            const color = window.getComputedStyle(radioColorHTML.parentElement).color
            radioColorHTML.checked = marker.color === color
        });
    } else {
        markerColorListHTML.markerColor[0].checked = true
    }   
}

function closeModal() {
    modalCreateMarker.classList.remove("modal-create-marker_show")
}

export default getMarkerInfo