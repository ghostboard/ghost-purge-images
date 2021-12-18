module.exports = function(upload, mobiledoc) {
    const proceed = upload && upload.path && mobiledoc;
    if (!proceed) {
        return false;
    }
    let output = false;
    try {
        const json = JSON.parse(mobiledoc);
        const videoCards = json.cards.filter((card) => {
            return card.shift().toLowerCase() === 'video'
        }).flat(1);
        let found = false;
        for (let i = 0, total = videoCards.length; !found && i<total; i++) {
            const current = videoCards[i];
            const matchFile = current.src.includes(upload.path);
            if (matchFile) {
                found = true;
                output = found;
            }
        }
    } catch(error) {
        console.error(`IsInVideoCard(${JSON.stringify(upload)}, ${JSON.stringify(mobiledoc)}) Error=`, error);
    } finally {
        return output;
    }
}