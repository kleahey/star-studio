import { SPACE_LEVELS } from './space/levels.js';
import { MATH_LEVELS } from './math/levels.js';
import { VA_LEVELS } from './va/levels.js';
export const WORLDS=[
  {id:'math',  name:'Number Power', emoji:'🔢', theme:'math',  color:0xdb2777, sub:'Math Unit 1 · test Fri 9/25', levels:MATH_LEVELS},
  {id:'space', name:'Solar System', emoji:'🪐', theme:'space', color:0x6d28d9, sub:'Science Unit 1 · test Tue 9/29', levels:SPACE_LEVELS},
  {id:'va',    name:'Virginia Studies', emoji:'🗺️', theme:'va', color:0x15803d, sub:'Unit 2 · Indigenous People', levels:VA_LEVELS},
];
