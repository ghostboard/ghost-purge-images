module.exports = function(upload, mobiledoc) {
    const proceed = upload && upload.path && mobiledoc;
    if (!proceed) {
        return false;
    }
    let output = false;
    try {
        const json = JSON.parse(mobiledoc);
        const audioCards = json.cards.filter((card) => {
            return card.shift().toLowerCase() === 'audio'
        }).flat(1);
        let found = false;
        for (let i = 0, total = audioCards.length; !found && i<total; i++) {
            const current = audioCards[i];
            const matchFile = current.src.includes(upload.path);
            if (matchFile) {
                found = true;
                output = found;
            }
        }
    } catch(error) {
        console.error(`IsInAudioCard(${JSON.stringify(upload)}, ${JSON.stringify(mobiledoc)}) Error=`, error);
    } finally {
        return output;
    }
}