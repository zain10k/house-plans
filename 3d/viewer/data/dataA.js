// Architect's original (original drawing), from the wall lines measured out of the PDF (feet; origin = outer left / rear wall).
window.PLAN_DATA = window.PLAN_DATA || {};
window.PLAN_DATA.A = {
  name: "Architect's original",
  GF: {
    footprint: [[0,0],[38,0],[38,25.5],[37,25.5],[37,72.1],[18.7,72.1],[18.7,73.3],[9.3,73.3],[9.3,61.7],[1,61.7],[1,21],[0,21]],
    open: [ [16,15.5,22,39.6], [22,25.5,36.5,39.6], [1.5,29.5,15.5,42.6], [9.8,39.6,36.5,57.1], [9.8,57.1,18.2,72.8] ],
    rooms: [
      { n: 'MASTER BED', r: [0.5,0.5,15.5,20.5] }, { n: 'BATH', r: [1.5,21,10,29] }, { n: 'DRESS', r: [10.5,21,15.5,29] },
      { n: 'PRAYER', r: [16,0.5,22,15] }, { n: 'DRESS', r: [22.5,0.5,28,7.5] }, { n: 'BATH', r: [28.5,0.5,37.5,7.5] },
      { n: 'BEDROOM', r: [22.5,8,37.5,25] },
      { n: 'D.KITCHEN', r: [1.5,43,9.3,51.5] }, { n: 'POWDER', r: [2.8,52,9.3,56.1] }, { n: 'SERV. TOILET', r: [2.8,56.6,9.3,60.6] },
      { n: 'DRAWING ROOM', r: [18.7,57.6,36.5,71.6] },
    ],
    labels: [
      { n: 'LIVING ROOM', x: 29.25, y: 32.5 }, { n: 'KITCHEN', x: 7.5, y: 35.5 }, { n: 'DINING', x: 21, y: 49 },
      { n: '6\' LOBBY', x: 19, y: 22 }, { n: 'FOYER', x: 14, y: 66 },
    ],
    doors: [
      { w: 'v', at: 15.5, t: 0.5, from: 16.5, len: 3 }, { w: 'h', at: 20.5, t: 0.5, from: 6.5, len: 2.5 }, { w: 'h', at: 20.5, t: 0.5, from: 12, len: 2.5 },
      { w: 'h', at: 15, t: 0.5, from: 17.5, len: 3 }, { w: 'v', at: 22, t: 0.5, from: 21.5, len: 3 }, { w: 'h', at: 7.5, t: 0.5, from: 24, len: 2.5 },
      { w: 'h', at: 7.5, t: 0.5, from: 31, len: 2.5 }, { w: 'h', at: 42.5, t: 0.5, from: 4, len: 2.5 }, { w: 'v', at: 1, t: 0.5, from: 44.5, len: 2.5 },
      { w: 'v', at: 9.3, t: 0.5, from: 53, len: 2.5 }, { w: 'h', at: 60.6, t: 0.6, from: 4.8, len: 2.5 }, { w: 'v', at: 18.2, t: 0.5, from: 60, len: 3.5 },
      { w: 'h', at: 72.8, t: 0.5, from: 11.5, len: 5 },
    ],
    windows: [
      { w: 'h', at: 0, t: 0.5, from: 4, len: 7 }, { w: 'v', at: 0, t: 0.5, from: 6, len: 8 }, { w: 'h', at: 0, t: 0.5, from: 17.5, len: 3 },
      { w: 'v', at: 37.5, t: 0.5, from: 12, len: 8 }, { w: 'v', at: 37.5, t: 0.5, from: 2, len: 3 }, { w: 'v', at: 1, t: 0.5, from: 31, len: 9 },
      { w: 'v', at: 36.5, t: 0.5, from: 27, len: 12 }, { w: 'v', at: 36.5, t: 0.5, from: 45, len: 10 }, { w: 'h', at: 71.6, t: 0.5, from: 22, len: 12 },
      { w: 'v', at: 36.5, t: 0.5, from: 60, len: 9 }, { w: 'v', at: 1, t: 0.5, from: 23, len: 4 },
    ],
  },
  FF: {
    footprint: [[0,0],[38,0],[38,25.5],[37,25.5],[37,63.7],[18.7,63.7],[18.7,73.3],[8.85,73.3],[8.85,64.6],[1,64.6],[1,21],[0,21]],
    open: [ [16,16.17,22,55.7], [22,52,36.5,55.7], [18.2,55.7,36.5,63.2], [9.35,52.2,16,55.7], [9.85,55.7,17.68,72.8] ],
    voids: [ [22,25.5,36.5,52], [9.85,55.7,17.68,72.8] ],
    rooms: [
      { n: 'MASTER BED', r: [0.5,0.5,15.5,20.5] }, { n: 'BATH', r: [1.5,21,10,29] }, { n: 'DRESS', r: [10.5,21,15.5,29] },
      { n: 'STORE', r: [16,0.5,22,15.67] }, { n: 'DRESS', r: [22.5,0.5,28,7.5] }, { n: 'BATH', r: [28.5,0.5,37.5,7.5] },
      { n: 'MASTER BED', r: [22.5,8,37.5,25] },
      { n: 'BEDROOM 3', r: [1.5,29.5,15.5,43.5] }, { n: 'BATH', r: [1.5,44,10,51.7] }, { n: 'DRESS', r: [10.5,44,15.5,51.7] },
      { n: 'KITCHENETTE', r: [1.5,52.2,9.35,64.1] },
    ],
    labels: [ { n: 'SEATING', x: 27.4, y: 59.5 }, { n: 'LOOKING BELOW', x: 29.25, y: 38 } ],
    doors: [
      { w: 'v', at: 15.5, t: 0.5, from: 16.8, len: 3 }, { w: 'h', at: 20.5, t: 0.5, from: 6.5, len: 2.5 }, { w: 'h', at: 20.5, t: 0.5, from: 12, len: 2.5 },
      { w: 'v', at: 16, t: 0.5, from: 11, len: 2.5 }, { w: 'v', at: 22, t: 0.5, from: 21.5, len: 3 }, { w: 'h', at: 7.5, t: 0.5, from: 24, len: 2.5 },
      { w: 'h', at: 7.5, t: 0.5, from: 31, len: 2.5 }, { w: 'v', at: 15.5, t: 0.5, from: 35, len: 3 }, { w: 'h', at: 43.5, t: 0.5, from: 4, len: 2.5 },
      { w: 'h', at: 43.5, t: 0.5, from: 12, len: 2.5 }, { w: 'v', at: 9.35, t: 0.5, from: 53, len: 2.5 },
      { w: 'h', at: 63.2, t: 0.5, from: 22, len: 12, slide: true },
    ],
    windows: [
      { w: 'h', at: 0, t: 0.5, from: 4, len: 7 }, { w: 'v', at: 0, t: 0.5, from: 6, len: 8 }, { w: 'v', at: 37.5, t: 0.5, from: 12, len: 8 },
      { w: 'v', at: 37.5, t: 0.5, from: 2, len: 3 }, { w: 'v', at: 1, t: 0.5, from: 32, len: 8 }, { w: 'v', at: 1, t: 0.5, from: 46, len: 3 },
      { w: 'v', at: 1, t: 0.5, from: 55, len: 6 }, { w: 'v', at: 36.5, t: 0.5, from: 27, len: 24 }, { w: 'v', at: 36.5, t: 0.5, from: 56, len: 6 },
      { w: 'v', at: 1, t: 0.5, from: 23, len: 4 },
    ],
    railings: [ [22,25.5,22,52], [22,52,28.3,52], [16,55.7,17.68,55.7], [17.68,55.7,17.68,63.2] ],
  },
  terrace: [18.7,63.7,36.5,72.1],
  stair: [
    { r: [28.3,40,32.5,43.5], axis: 'x', dir: 1, treads: 5 },
    { landing: [32.7,40,36.2,43.5] },
    { r: [32.7,43.5,36.2,53.6], axis: 'y', dir: 1, treads: 11 },
  ],
};
