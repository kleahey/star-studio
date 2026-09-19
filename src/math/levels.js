// Number Power world: Math Unit 1. Levels 6 to 8 aim at what the teachers flagged: choosing the rounding place, and subtraction.
import { gPlace, gValue, gWritten, gExpanded, gCompare, gOrder, gRound, gEstimate, gColumn, gStory, times } from './gen.js';
import { shuffle } from '../core/ui.js';

export const MATH_LEVELS=[
  {id:'math-1', name:'Place Race', emoji:'🏁', skill:'find the place', sticker:'🏁', make:()=>times(7,gPlace)},
  {id:'math-2', name:'What\'s It Worth?', emoji:'💎', skill:'place vs. value', sticker:'💎', make:()=>times(7,gValue)},
  {id:'math-3', name:'Number Builder', emoji:'🏗️', skill:'words → digits (mind the zeros)', sticker:'🏗️', make:()=>times(6,gWritten)},
  {id:'math-4', name:'Stretch It Out', emoji:'🪗', skill:'expanded form', sticker:'🪗', make:()=>times(6,gExpanded)},
  {id:'math-5', name:'Gator Gate', emoji:'🐊', skill:'compare and order', sticker:'🐊', make:()=>shuffle([...times(5,gCompare),...times(2,gOrder)])},
  {id:'math-6', name:'Rounding Hill', emoji:'⛰️', skill:'find the place, look next door', sticker:'⛰️', make:()=>times(7,gRound)},
  {id:'math-7', name:'Estimation Station', emoji:'🚉', skill:'rounding · front-end · compatible', sticker:'🚉', make:()=>times(7,gEstimate)},
  {id:'math-8', name:'Column Cruncher', emoji:'🧮', skill:'subtract across zeros, add with carrying', sticker:'🧮', make:()=>times(5,gColumn)},
  {id:'math-9', name:'Story Time', emoji:'📖', skill:'one step or more than one?', sticker:'📖', make:()=>times(5,gStory)},
  {id:'math-10', name:'Number Boss', emoji:'👑', skill:'BOSS: a bit of everything', sticker:'👑', make:()=>shuffle([gRound(),gRound(),gColumn(),gColumn(),gEstimate(),gWritten(),gValue(),gCompare(),gStory()])},
];
