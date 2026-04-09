export const ARRAY_QUESTIONS = [
  // EASY (10)
  {
    id: "a1", type: "array", difficulty: "easy",
    title: "Spiral Traversal (3x3)",
    desc: "Traverse the matrix in clockwise spiral order and print elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 2 3 6 9 8 7 4 5"
  },
  {
    id: "a2", type: "array", difficulty: "easy",
    title: "Main Diagonal",
    desc: "Print the main diagonal (top-left to bottom-right) elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 5 9"
  },
  {
    id: "a3", type: "array", difficulty: "easy",
    title: "Anti-Diagonal",
    desc: "Print the anti-diagonal (top-right to bottom-left) elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "3 5 7"
  },
  {
    id: "a4", type: "array", difficulty: "easy",
    title: "Column-wise Traversal",
    desc: "Traverse the matrix column by column (top to bottom) and print elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 4 7 2 5 8 3 6 9"
  },
  {
    id: "a5", type: "array", difficulty: "easy",
    title: "Boundary Elements",
    desc: "Print all boundary elements of the matrix in clockwise order starting from top-left.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 2 3 6 9 8 7 4"
  },
  {
    id: "a6", type: "array", difficulty: "easy",
    title: "Row Reversal",
    desc: "Reverse each row and print the matrix. Each row on a new line, elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "3 2 1\n6 5 4\n9 8 7"
  },
  {
    id: "a7", type: "array", difficulty: "easy",
    title: "Transpose",
    desc: "Print the transpose of the matrix. Each row on a new line, elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 4 7\n2 5 8\n3 6 9"
  },
  {
    id: "a8", type: "array", difficulty: "easy",
    title: "Diagonal Sum",
    desc: "Print the sum of both diagonals. Count center element only once.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "25"
  },
  {
    id: "a9", type: "array", difficulty: "easy",
    title: "Row-wise Sum",
    desc: "Print the sum of each row on separate lines.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "6\n15\n24"
  },
  {
    id: "a10", type: "array", difficulty: "easy",
    title: "Max in Each Row",
    desc: "Print the maximum element of each row on separate lines.",
    matrix: [[3,1,2],[9,4,6],[7,5,8]],
    expected: "3\n9\n8"
  },

  // MEDIUM (10)
  {
    id: "a11", type: "array", difficulty: "medium",
    title: "Spiral Traversal (4x4)",
    desc: "Traverse the 4x4 matrix in clockwise spiral order and print elements separated by spaces.",
    matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]],
    expected: "1 2 3 4 8 12 16 15 14 13 9 5 6 7 11 10"
  },
  {
    id: "a12", type: "array", difficulty: "medium",
    title: "X-Shape Traversal",
    desc: "Print all elements on both diagonals (X-shape), top-to-bottom left-to-right, no duplicates.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 3 5 7 9"
  },
  {
    id: "a13", type: "array", difficulty: "medium",
    title: "Zigzag Traversal",
    desc: "Traverse row by row but alternate direction each row (left→right then right→left). Print separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 2 3 6 5 4 7 8 9"
  },
  {
    id: "a14", type: "array", difficulty: "medium",
    title: "Cross/Plus Shape",
    desc: "Print middle row and middle column elements of the 5x5 matrix (cross shape), top-to-bottom left-to-right, no duplicates.",
    matrix: [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]],
    expected: "3 8 11 12 13 14 15 18 23"
  },
  {
    id: "a15", type: "array", difficulty: "medium",
    title: "Boundary 4x4",
    desc: "Print all boundary elements of the 4x4 matrix in clockwise order starting from top-left.",
    matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]],
    expected: "1 2 3 4 8 12 16 15 14 13 9 5"
  },
  {
    id: "a16", type: "array", difficulty: "medium",
    title: "Wave/Column Zigzag",
    desc: "Traverse column by column: even columns top-to-bottom, odd columns bottom-to-top. Print separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 4 7 8 5 2 3 6 9"
  },
  {
    id: "a17", type: "array", difficulty: "medium",
    title: "Diagonal Zigzag",
    desc: "Print elements diagonally: first diagonal top-right direction, next top-left, alternating. Print separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 2 4 7 5 3 6 8 9"
  },
  {
    id: "a18", type: "array", difficulty: "medium",
    title: "Rotate 90 Clockwise",
    desc: "Rotate the matrix 90 degrees clockwise and print. Each row on a new line, elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "7 4 1\n8 5 2\n9 6 3"
  },
  {
    id: "a19", type: "array", difficulty: "medium",
    title: "Inner Spiral",
    desc: "Print only the inner elements of the 4x4 matrix in spiral order.",
    matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]],
    expected: "6 7 11 10"
  },
  {
    id: "a20", type: "array", difficulty: "medium",
    title: "V-Shape Traversal",
    desc: "Print V-shape: left diagonal from top-left down, then right diagonal from bottom to top-right (no center duplicate).",
    matrix: [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]],
    expected: "1 7 13 19 25 24 18 12 6"
  },

  // HARD (10)
  {
    id: "a21", type: "array", difficulty: "hard",
    title: "Spiral Traversal (5x5)",
    desc: "Traverse the 5x5 matrix in clockwise spiral order and print elements separated by spaces.",
    matrix: [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]],
    expected: "1 2 3 4 5 10 15 20 25 24 23 22 21 16 11 6 7 8 9 14 19 18 17 12 13"
  },
  {
    id: "a22", type: "array", difficulty: "hard",
    title: "X-Shape 5x5",
    desc: "Print all elements on both diagonals of the 5x5 matrix (X-shape), top-to-bottom left-to-right, no duplicates.",
    matrix: [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]],
    expected: "1 5 7 9 13 17 19 21 25"
  },
  {
    id: "a23", type: "array", difficulty: "hard",
    title: "Rotate 90 Anti-Clockwise",
    desc: "Rotate the matrix 90 degrees anti-clockwise and print. Each row on a new line, elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "3 6 9\n2 5 8\n1 4 7"
  },
  {
    id: "a24", type: "array", difficulty: "hard",
    title: "Zigzag 4x4",
    desc: "Traverse the 4x4 matrix in zigzag pattern (alternate row direction each row). Print all elements.",
    matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]],
    expected: "1 2 3 4 8 7 6 5 9 10 11 12 16 15 14 13"
  },
  {
    id: "a25", type: "array", difficulty: "hard",
    title: "Layer-by-Layer Spiral",
    desc: "Print elements layer by layer. Format: 'Layer 1: ...' for outer ring, 'Layer 2: ...' for next, etc. till center.",
    matrix: [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]],
    expected: "Layer 1: 1 2 3 4 5 10 15 20 25 24 23 22 21 16 11 6\nLayer 2: 7 8 9 14 19 18 17 12\nLayer 3: 13"
  },
  {
    id: "a26", type: "array", difficulty: "hard",
    title: "Saddle Point",
    desc: "Find the saddle point — minimum in its row AND maximum in its column. Print the value, or -1 if none.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "7"
  },
  {
    id: "a27", type: "array", difficulty: "hard",
    title: "Anti-Spiral",
    desc: "Traverse the matrix in anti-clockwise spiral order and print elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1 4 7 8 9 6 3 2 5"
  },
  {
    id: "a28", type: "array", difficulty: "hard",
    title: "Diagonal Bands",
    desc: "Print each diagonal band (top-right to bottom-left) on a separate line, elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "1\n2 4\n3 5 7\n6 8\n9"
  },
  {
    id: "a29", type: "array", difficulty: "hard",
    title: "Rotate 180",
    desc: "Rotate the matrix 180 degrees and print. Each row on a new line, elements separated by spaces.",
    matrix: [[1,2,3],[4,5,6],[7,8,9]],
    expected: "9 8 7\n6 5 4\n3 2 1"
  },
  {
    id: "a30", type: "array", difficulty: "hard",
    title: "Hourglass Sum",
    desc: "Find the maximum hourglass sum in the 4x4 matrix (hourglass = 3 top + 1 middle + 3 bottom centered). Print the max sum.",
    matrix: [[1,1,1,0],[0,1,0,0],[1,1,1,0],[0,0,2,4]],
    expected: "7"
  },

];

export const PATTERN_QUESTIONS = [
  // EASY (10)
  {
    id: "p1", type: "pattern", difficulty: "easy",
    title: "Right-angle Star Triangle",
    desc: "Print a right-angle triangle of stars with n=5 rows. Each row i has i stars.",
    input: "n = 5",
    expected: "*\n**\n***\n****\n*****"
  },
  {
    id: "p2", type: "pattern", difficulty: "easy",
    title: "Inverted Star Triangle",
    desc: "Print an inverted right-angle triangle with n=5 rows.",
    input: "n = 5",
    expected: "*****\n****\n***\n**\n*"
  },
  {
    id: "p3", type: "pattern", difficulty: "easy",
    title: "Number Triangle",
    desc: "Print a triangle where row i contains numbers 1 to i, with n=5 rows.",
    input: "n = 5",
    expected: "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5"
  },
  {
    id: "p4", type: "pattern", difficulty: "easy",
    title: "Same Number Triangle",
    desc: "Print a triangle where row i has the number i repeated i times, with n=5 rows.",
    input: "n = 5",
    expected: "1\n2 2\n3 3 3\n4 4 4 4\n5 5 5 5 5"
  },
  {
    id: "p5", type: "pattern", difficulty: "easy",
    title: "Square Star Pattern",
    desc: "Print a 5x5 square filled entirely with stars.",
    input: "n = 5",
    expected: "*****\n*****\n*****\n*****\n*****"
  },
  {
    id: "p6", type: "pattern", difficulty: "easy",
    title: "Right-angle Number",
    desc: "Print a right-angle triangle where each row has numbers from 1 up to row index, n=5.",
    input: "n = 5",
    expected: "1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15"
  },
  {
    id: "p7", type: "pattern", difficulty: "easy",
    title: "Alphabet Triangle",
    desc: "Print a triangle where row i has alphabets A to the i-th letter, n=5 rows.",
    input: "n = 5",
    expected: "A\nA B\nA B C\nA B C D\nA B C D E"
  },
  {
    id: "p8", type: "pattern", difficulty: "easy",
    title: "Reverse Number Triangle",
    desc: "Print a triangle where row i starts from i down to 1, n=5 rows.",
    input: "n = 5",
    expected: "1\n2 1\n3 2 1\n4 3 2 1\n5 4 3 2 1"
  },
  {
    id: "p9", type: "pattern", difficulty: "easy",
    title: "Binary Triangle",
    desc: "Print a triangle where element at (row,col) is (row+col)%2. n=5 rows.",
    input: "n = 5",
    expected: "1\n0 1\n1 0 1\n0 1 0 1\n1 0 1 0 1"
  },
  {
    id: "p10", type: "pattern", difficulty: "easy",
    title: "Star Rectangle Border",
    desc: "Print a 4x5 rectangle with only border stars, interior spaces.",
    input: "rows=4, cols=5",
    expected: "*****\n*   *\n*   *\n*****"
  },

  // MEDIUM (10)
  {
    id: "p11", type: "pattern", difficulty: "medium",
    title: "Full Pyramid",
    desc: "Print a full star pyramid with n=5 rows, centered with spaces.",
    input: "n = 5",
    expected: "    *\n   ***\n  *****\n *******\n*********"
  },
  {
    id: "p12", type: "pattern", difficulty: "medium",
    title: "Inverted Full Pyramid",
    desc: "Print an inverted centered star pyramid with n=5 rows.",
    input: "n = 5",
    expected: "*********\n *******\n  *****\n   ***\n    *"
  },
  {
    id: "p13", type: "pattern", difficulty: "medium",
    title: "Diamond Pattern",
    desc: "Print a full diamond pattern with n=5 (n rows top half including middle, n-1 rows bottom).",
    input: "n = 5",
    expected: "    *\n   ***\n  *****\n *******\n*********\n *******\n  *****\n   ***\n    *"
  },
  {
    id: "p14", type: "pattern", difficulty: "medium",
    title: "Hollow Square",
    desc: "Print a 5x5 hollow square (only border stars).",
    input: "n = 5",
    expected: "*****\n*   *\n*   *\n*   *\n*****"
  },
  {
    id: "p15", type: "pattern", difficulty: "medium",
    title: "Hollow Triangle",
    desc: "Print a hollow right-angle triangle with n=5. Only border positions have stars.",
    input: "n = 5",
    expected: "*\n**\n* *\n*  *\n*****"
  },
  {
    id: "p16", type: "pattern", difficulty: "medium",
    title: "Number Pyramid",
    desc: "Print a centered number pyramid with n=5 rows. Each row i has numbers 1 to i centered.",
    input: "n = 5",
    expected: "    1\n   1 2\n  1 2 3\n 1 2 3 4\n1 2 3 4 5"
  },
  {
    id: "p17", type: "pattern", difficulty: "medium",
    title: "Butterfly Pattern",
    desc: "Print a butterfly pattern with n=4.",
    input: "n = 4",
    expected: "*      *\n**    **\n***  ***\n********\n********\n***  ***\n**    **\n*      *"
  },
  {
    id: "p18", type: "pattern", difficulty: "medium",
    title: "Pascal's Triangle",
    desc: "Print Pascal's triangle with n=5 rows. Elements separated by spaces.",
    input: "n = 5",
    expected: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1"
  },
  {
    id: "p19", type: "pattern", difficulty: "medium",
    title: "Zigzag Pattern",
    desc: "Print a 3-row zigzag pattern for string 'PAYPALISHIRING' with 3 rows.",
    input: "s = PAYPALISHIRING, rows = 3",
    expected: "PINALSIGYAHRPI"
  },
  {
    id: "p20", type: "pattern", difficulty: "medium",
    title: "Sandglass Pattern",
    desc: "Print a sandglass (hourglass) star pattern with n=5.",
    input: "n = 5",
    expected: "*********\n *******\n  *****\n   ***\n    *\n   ***\n  *****\n *******\n*********"
  },

  // HARD (10)
  {
    id: "p21", type: "pattern", difficulty: "hard",
    title: "Hollow Diamond",
    desc: "Print a hollow diamond pattern with n=5.",
    input: "n = 5",
    expected: "    *\n   * *\n  *   *\n *     *\n*       *\n *     *\n  *   *\n   * *\n    *"
  },
  {
    id: "p22", type: "pattern", difficulty: "hard",
    title: "Number Diamond",
    desc: "Print a number diamond where each row i of top-half has numbers 1..i..1 centered with spaces. n=5.",
    input: "n = 5",
    expected: "    1\n   212\n  32123\n 4321234\n543212345\n 4321234\n  32123\n   212\n    1"
  },
  {
    id: "p23", type: "pattern", difficulty: "hard",
    title: "Spiral Number Pattern",
    desc: "Print a 4x4 matrix filled with numbers in clockwise spiral order starting from 1.",
    input: "n = 4",
    expected: "1 2 3 4\n12 13 14 5\n11 16 15 6\n10 9 8 7"
  },
  {
    id: "p24", type: "pattern", difficulty: "hard",
    title: "Star Plus Pattern",
    desc: "Print a plus (+) pattern of stars in a 5x5 grid. Middle row and middle column are stars, rest are spaces.",
    input: "n = 5",
    expected: "  *  \n  *  \n*****\n  *  \n  *  "
  },
  {
    id: "p25", type: "pattern", difficulty: "hard",
    title: "Star X Pattern",
    desc: "Print an X pattern of stars in a 5x5 grid. Both diagonals are stars, rest spaces.",
    input: "n = 5",
    expected: "*   *\n * * \n  *  \n * * \n*   *"
  },
  {
    id: "p26", type: "pattern", difficulty: "hard",
    title: "Floyd's Triangle",
    desc: "Print Floyd's triangle with n=5 rows.",
    input: "n = 5",
    expected: "1\n2 3\n4 5 6\n7 8 9 10\n11 12 13 14 15"
  },
  {
    id: "p27", type: "pattern", difficulty: "hard",
    title: "Heart Pattern",
    desc: "Print a heart shape pattern with n=6.",
    input: "n = 6",
    expected: "  ***   ***  \n *****  *****\n ***********  \n  *********  \n   *******   \n    *****    \n     ***     \n      *      "
  },
  {
    id: "p28", type: "pattern", difficulty: "hard",
    title: "Sierpinski Triangle",
    desc: "Print Sierpinski triangle pattern of depth 3 (8 rows).",
    input: "depth = 3",
    expected: "*\n* *\n*   *\n* * * *\n*       *\n* *     * *\n*   *   *   *\n* * * * * * * *"
  },
  {
    id: "p29", type: "pattern", difficulty: "hard",
    title: "Star Arrow Pattern",
    desc: "Print an upward-pointing arrow of stars with n=5.",
    input: "n = 5",
    expected: "    *\n   ***\n  *****\n *******\n*********\n    *\n    *\n    *\n    *"
  },
  {
    id: "p30", type: "pattern", difficulty: "hard",
    title: "Checkerboard Pattern",
    desc: "Print a 5x5 checkerboard where (0,0) starts with * and alternates with spaces.",
    input: "n = 5",
    expected: "* * *\n * * \n* * *\n * * \n* * *"
  },
];
