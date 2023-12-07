import { currentTrack, fillPlaylist, loadPlaylist } from "./playlist.js"
import { setTrack } from "./player.js"


main()

async function main() {
    await loadPlaylist()
    fillPlaylist(currentTrack)
    setTrack(currentTrack)
}

