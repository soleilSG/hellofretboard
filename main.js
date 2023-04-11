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


/******** Functions invocations *************/
svgBorder();
createFretBoard();

handleShowNotes();
handleHideNotes();

/********* Functions definitions ************/
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
  strings.forEach((e, i) => createString(e + 1, i));
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

function numToNote(num) {
  const scaleNotes = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
  const numZeroBased = num - 1;

  //TODO, check 'num' range to avoid overbound of array.
  const noteGroup = Math.trunc(numZeroBased / 12) + 2;
  const noteIndex = numZeroBased % 12

  return scaleNotes.at(noteIndex) + noteGroup;
}

function handleStringClick(e, d) {
  console.log(`Note: ${numToNote(d)}`);
  console.log(e);
  console.log(d);
  e.target.attributes['stroke'].value = 'blue';
}

function createString(noteNo, stringNo) {
  const xPos = margin.left + xScale(stringNo);

  const stringsGroup = svg.append("g")
    .attr("id", `string-${stringNo}`)
    .attr('class', 'string')
    .attr("transform", `translate(${xPos}, ${margin.top})`);

  stringsGroup.selectAll('line')
    .data(Array.from({ length: 12 }, (_, i) => noteNo + i))
    .join('line')
    .attr('class', d => d)
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
    .text((_, i) => numToNote(noteNo + i));
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


function createFretBoard1() {
  const strings = [0, 1, 2, 3, 4, 5];
  const frets = Array.from({ length: 13 }, (_, i) => i);
  console.log(frets);

  const stringsChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const fretsChart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


  stringsChart.selectAll('line')
    .data(strings)
    // .enter().append('line')
    .join('line')
    .attr("x1", d => xScale(d))
    .attr("y1", 0)
    .attr("x2", d => xScale(d))
    .attr("y2", innerHeight)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

}

function createTable() {
  const data = Array.from({ length: 12 }, (_, i) => i + 1);
  const container = select('body').append('table');
  const rows = container.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

  const cells = rows.selectAll('td')
    .data(d => Array.from({ length: 6 }, (_, i) => i + 1))
    .enter()
    .append('td');

  cells.text((d, i) => `Row ${rows._groups[0].indexOf(cells._groups[0][i].parentNode) + 1}, Column ${i + 1}`);
  j
}

function svgBorder() {
  svg.style('border', "1px solid black");
}
