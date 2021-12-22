const DEFAULT_CARD_TYPES = ['audio', 'video', 'file', 'image'];

module.exports = function(uploadPath, mobiledoc, types = DEFAULT_CARD_TYPES) {
  const proceed = uploadPath && mobiledoc;
  if (!proceed) {
    return false;
  }
  try {
    const json = JSON.parse(mobiledoc);
    const cards = json.cards.filter((card) => {
      return DEFAULT_CARD_TYPES.includes(card.shift().toLowerCase());
    }).flat(1);
    let found = false;
    for (let i = 0, total = cards.length; !found && i < total; i++) {
      const current = cards[i];
      const matchSourceFile = current.src && current.src.includes(uploadPath);
      const matchThumbnailFile = current.thumbnailSrc && current.thumbnailSrc.includes(uploadPath);
      const anyMatch = matchSourceFile || matchThumbnailFile;
      if (anyMatch) {
        found = true;
      }
    }
    return found;
  } catch (error) {
    console.error(`IsInCard(${uploadPath}, ${JSON.stringify(mobiledoc)}, ${types}}) Error=`, error);
    return true;
  }
};
