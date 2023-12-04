const allowedSymbols = new Map([
  [
    0,
    {
      barCode: "01010",
      val: 0,
    },
  ],
  [
    1,
    {
      barCode: "10100",
      val: 1,
    },
  ],
  [
    2,
    {
      barCode: "01001",
      val: 2,
    },
  ],
  [
    3,
    {
      barCode: "01000",
      val: 3,
    },
  ],
  [
    4,
    {
      barCode: "10010",
      val: 4,
    },
  ],
  [
    5,
    {
      barCode: "01100",
      val: 5,
    },
  ],
  [
    6,
    {
      barCode: "10001",
      val: 6,
    },
  ],
  [
    7,
    {
      barCode: "10000",
      val: 7,
    },
  ],
  [
    8,
    {
      barCode: "00101",
      val: 8,
    },
  ],
  [
    9,
    {
      barCode: "00100",
      val: 9,
    },
  ],
  [
    "K",
    {
      barCode: "00110",
      val: 10,
    },
  ],
  [
    "L",
    {
      barCode: "11000",
      val: 11,
    },
  ],
  [
    "M",
    {
      barCode: "00010",
      val: 12,
    },
  ],
  [
    "O",
    {
      barCode: "00001",
      val: 14,
    },
  ],
  [
    "start",
    {
      barCode: "00000",
      val: 13,
    },
  ],
  [
    "stop",
    {
      barCode: "00011",
      val: 15,
    },
  ],
]);
module.exports = {
  allowedSymbols,
};
