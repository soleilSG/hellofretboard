import './index.css';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

/******* Constants **********/
const svg = select('svg');
const svgWidth = svg.style('width').slice(0, -2);
const svgHeight = svg.style('height').slice(0, -2);
const margin = {
  top: 20,
  right: 30,
  bottom: 10,
  left: 30
};
const innerWidth = svgWidth - margin.left - margin.right;
const innerHeight = svgHeight - margin.top - margin.bottom;
const xScale = scaleLinear()
  .domain([0, 5])
  .range([0, innerWidth]);
const yScale = scaleLinear()
  .domain([0, 12])
  .range([0, innerHeight]);
const y2Scale = scaleLinear()
  .domain([0, 24])
  .range([0, innerHeight]);

/******** Globals ********/
let selectedNote = null;


/******** Functions invocations *************/
svgBorder();
createFretBoard();

handleShowNotes();
handleHideNotes();
handleHomophonic();

/********* Functions definitions ************/
function handleHomophonic() {
  select('#homophonicToggle').on('input', e => {
    if (e.target.checked) {
      const noteNum = selectedNote.data.stringNote + 1 + selectedNote.data.index;
      svg.selectAll('g').selectAll(`.note-${noteNum}`)
        .attr('stroke', 'blue');
    }
  });
}

function handleShowNotes() {
  select('#btnShowNotes').on('click', () => {
    svg.selectAll('.string')
      .selectAll('text')
      .attr('display', 'show')
  });
}

function handleHideNotes() {
  select('#btnHideNotes').on('click', () => {
    svg.selectAll('.string')
      .selectAll('text')
      .attr('display', 'none')
  });
}

function createFretBoard() {
  createFrets();
  const strings = [5, 10, 15, 20, 24, 29];
  createStringsTitles(strings);
  strings.forEach((e, i) => createString(e, i));
  createFretsLabels();
}

function createStringsTitles(strings) {
  const g = svg.append('g')
    .attr('id', 'stringTitles')
    .attr('transform', `translate(${margin.left}, 0)`);

  g.selectAll('text')
    .data(strings)
    .join('text')
    .attr('x', (_, i) => xScale(i))
    .attr('y', margin.top - 3)
    .attr('text-anchor', 'middle')
    .text(d => numToNote(d));
}

function createFretsLabels() {
  const data = [5, 10, 12];
  const g = svg.append('g')
    .attr('id', 'fretsLabels')
    .attr('transform', `translate(${margin.left - 3}, ${margin.top})`);

  g.selectAll('text')
    .data(data)
    .join('text')
    .attr('x', 0)
    .attr('y', d => yScale(d))
    .attr('text-anchor', 'end')
    .text(d => d);
}

function numToNote(num) {
  const scaleNotes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
  const numZeroBased = num - 1;

  //TODO, check 'num' range to avoid overbound of array.
  const noteGroup = Math.trunc(numZeroBased / 12) + 2;
  const noteIndex = numZeroBased % 12

  return scaleNotes.at(noteIndex) + noteGroup;
}

function displayNote() {
  const t = select('#displayNote');
  if (selectedNote !== null) {
    const noteNum = selectedNote.data.stringNote + 1 + selectedNote.data.index;
    t.text(numToNote(noteNum));
  } else {
    t.text('');
  }
}

function handleStringClick(e, d) {
  // console.log(`Note: ${numToNote(d.stringNote + 1 + d.index)}`);
  // console.log(e);
  // console.log(d);

  if (selectedNote !== null) {
    selectedNote.element.attributes['stroke'].value = 'black';
    if (selectedNote.data.stringNote === d.stringNote && selectedNote.data.index === d.index) {
      selectedNote = null;
      displayNote();
      return;
    }
  }
  selectedNote = {};
  selectedNote.element = e.target;
  selectedNote.element.attributes['stroke'].value = 'blue';
  selectedNote.data = d;
  displayNote();
}

function createString(stringNote, stringNo) {
  const xPos = margin.left + xScale(stringNo);

  const stringsGroup = svg.append("g")
    .attr("id", `string-${stringNo}`)
    .attr('class', 'string')
    .attr("transform", `translate(${xPos}, ${margin.top})`);

  const data = Array.from({ length: 12 }, (_, i) => {
    let dataItem = {};
    dataItem.stringNote = stringNote;
    dataItem.index = i;
    return dataItem;
  });

  stringsGroup.selectAll('line')
    .data(data)
    .join('line')
    .attr('class', d => `note-${d.stringNote + 1 + d.index}`)
    .attr('x1', 0)
    .attr('y1', (_, i) => yScale(i))
    .attr('x2', 0)
    .attr('y2', (_, i) => yScale(i + 1))
    .attr('stroke', 'black')
    .attr('stroke-width', 4)
    .on('click', handleStringClick);

  let labelPos = [];
  for (let i = 1; i <= 23; i++) {
    if (i % 2 !== 0) {
      labelPos.push(i);
    }
  }
  stringsGroup.selectAll('text')
    .data(labelPos)
    .join('text')
    .attr('x', 0)
    .attr('y', d => y2Scale(d))
    .attr('text-anchor', 'middle')
    .attr('display', 'none')
    .text((_, i) => numToNote(stringNote + 1 + i));
}

function createFrets() {
  const frets = Array.from({ length: 13 }, (_, i) => i);
  const fretsChart = svg.append('g')
    .attr('id', 'frets')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);
  fretsChart.selectAll('line')
    .data(frets)
    .join('line')
    .attr('x1', 0)
    .attr('y1', d => yScale(d))
    .attr('x2', innerWidth)
    .attr('y2', d => yScale(d))
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
}

function svgBorder() {
  svg.style('border', "1px solid black");
}
