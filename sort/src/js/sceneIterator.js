// Хранилище этапов сортировок в виде карты с ключом - назавание сортировки и заначением - список этапов этой сортировки

function makeSceneIterator() {
    const sectionMap = new Map()
    let sceneIndex = 0;    // Индекс текущей сцены

    return {
        [Symbol.iterator]() {
            return this;
        },
        // Возвращает наличие в хранилище данной сортировки
        hasSort (sortName) {
            return sectionMap.has(sortName)
        },
        // Добавляет этап сортировки
        addSection (sortName, section) {
            if (!sectionMap.has(sortName)) {
                sectionMap.set(sortName, [])
            }
            sectionMap.get(sortName).push(section)
        },
        // Генерирует сцену как список состоящий из этапа от каждой сортровки
        nextScene () {
            const scene = []
            for (const [sortName, sections] of sectionMap.entries()) {
                const section = sections[sceneIndex]
                if (section) {
                    scene.push({
                        sortName,
                        ...section
                    })
                }
            }
            sceneIndex++
            return scene.length
                ? { value: scene, done: false }
                : { done: true };
        }
    };
}

export default makeSceneIterator