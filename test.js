function numToNote(num) {
  const scaleNotes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
  const numZeroBased = num - 1;

  //TODO, check 'num' range to avoid overbound of array.
  const noteGroup = Math.trunc(numZeroBased / 12) + 2;
  const noteIndex = numZeroBased % 12
  console.log(`noteGroup:${noteGroup}, noteIndex:${noteIndex}`);

  return scaleNotes.at(noteIndex) + noteGroup;
}

console.log(numToNote(30));

