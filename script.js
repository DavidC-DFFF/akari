const canvas = document.getElementById('akariCanvas');
const ctx = canvas.getContext('2d');
const difficultySelect = document.getElementById('difficultySelect');
const difficultyInfo = document.getElementById('difficultyInfo');
const difficultyScore = document.getElementById('difficultyScore');
const customSizeControls = document.getElementById('customSizeControls');
const customWidthInput = document.getElementById('customWidthInput');
const customHeightInput = document.getElementById('customHeightInput');
const batchCountInput = document.getElementById('batchCountInput');
const generateButton = document.getElementById('generateButton');
const batchGenerateButton = document.getElementById('batchGenerateButton');
const hintButton = document.getElementById('hintButton');
const exportBlankButton = document.getElementById('exportBlankButton');
const exportSolutionButton = document.getElementById('exportSolutionButton');
const statusMessage = document.getElementById('statusMessage');

const difficultyPresets = {
  mini4: { label: '4x4', fileLabel: '4x4', fileRank: 9, sizes: [4], count: 12, density: 0.31, targetLevel: 'mini4', mini4: true, blackCells: 5, minSolutionBulbs: 3, maxSolutionBulbs: 5, minClueTypes: 2, maxZeroClues: 3, maxHighClues: 2, maxFourClues: 1, maxIndirectSteps: 1, minMiniScore: 22, maxMiniScore: 42 },
  mini6: { label: '6x6', fileLabel: '6x6', fileRank: 10, sizes: [6], count: 24, density: 0.32, targetLevel: 'mini6', mini6: true, minBlackCells: 10, maxBlackCells: 13, minVisibleClues: 9, maxVisibleClues: 12, minSolutionBulbs: 6, maxSolutionBulbs: 11, minClueTypes: 3, maxZeroClues: 5, maxHighClues: 5, maxFourClues: 1, maxIndirectSteps: 3, maxLogicIterations: 8 },
  decouverte: { label: 'Apprenti', fileLabel: 'Apprenti', fileRank: 1, sizes: [7], count: 30, density: 0.30, targetLevel: 'decouverte', minClueTypes: 2 },
  facile: { label: 'Novice', fileLabel: 'Novice', fileRank: 2, sizes: [7], count: 40, density: 0.22, targetLevel: 'facile', clueKeepRate: 0.55, maxVisibleClues: 8, minClueTypes: 3 },
  intermediaire: { label: 'Initié', fileLabel: 'Initie', fileRank: 3, sizes: [8, 10], count: 50, density: 0.24, targetLevel: 'intermediaire', minClueTypes: 3, minHighClues: 1, highClueSeeds: 1 },
  difficile: { label: 'Disciple', fileLabel: 'Disciple', fileRank: 4, sizes: [10, 12], count: 50, density: 0.24, targetLevel: 'difficile', minClueTypes: 4, minHighClues: 2, highClueSeeds: 2 },
  expert: { label: 'Stratège', fileLabel: 'Stratege', fileRank: 5, sizes: [12, 15], count: 30, density: 0.24, targetLevel: 'expert', minClueTypes: 4, minHighClues: 3, highClueSeeds: 3 },
  niveau6: { label: 'Sensei', fileLabel: 'Sensei', fileRank: 6, sizes: [12], count: 20, density: 0.23, targetLevel: 'niveau6', gameLevel: true, minClueTypes: 4, minHighClues: 2, minIndirectSteps: 1, minHardnessScore: 30, maxZeroClues: 12, maxEasyClueRatio: 0.74, highClueSeeds: 2 },
  niveau7: { label: 'Maître', fileLabel: 'Maitre', fileRank: 7, sizes: [13, 14], count: 20, density: 0.24, targetLevel: 'niveau7', gameLevel: true, minClueTypes: 4, minHighClues: 2, minIndirectSteps: 1, minHardnessScore: 36, maxZeroClues: 12, maxEasyClueRatio: 0.72, highClueSeeds: 3 },
  niveau8: { label: 'Grand Maître', fileLabel: 'GrandMaitre', fileRank: 8, sizes: [15], count: 20, density: 0.25, targetLevel: 'niveau8', gameLevel: true, minClueTypes: 4, minHighClues: 2, minIndirectSteps: 1, minHardnessScore: 42, maxZeroClues: 12, maxEasyClueRatio: 0.70, highClueSeeds: 4 },
  personnalise: { label: 'Personnalisé', fileLabel: 'Personnalise', fileRank: 0, count: 1, density: 0.24, custom: true },
};

let currentGrid = null;
let currentSolution = null;
let currentClues = null;
let currentEvaluatedDifficulty = null;
let playerGrid = null;
let noBulbCells = new Set();
let invalidBulbCells = new Set();
let invalidNumberedCells = new Set();
let generationId = 0;
let currentDifficulty = 'mini4';
let puzzleCompleted = false;
let celebrationUntil = 0;
let celebrationAnimating = false;
const cellSize = 64;
const exportScale = 4;
const celebrationDuration = 4200;
const directions = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

function init() {
  updateDifficultyInfo();
  attachEvents();
  generatePuzzle();
}

function attachEvents() {
  difficultySelect.addEventListener('change', () => {
    currentDifficulty = difficultySelect.value;
    updateDifficultyInfo();
  });

  customWidthInput.addEventListener('input', updateDifficultyInfo);
  customHeightInput.addEventListener('input', updateDifficultyInfo);
  batchCountInput.addEventListener('input', updateBatchButtonLabel);

  canvas.addEventListener('mousedown', handleCanvasClick);
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  hintButton.addEventListener('click', giveHint);
  generateButton.addEventListener('click', () => generatePuzzle());
  batchGenerateButton.addEventListener('click', () => generateBatchFiles());
  exportBlankButton.addEventListener('click', () => exportPNG(false));
  exportSolutionButton.addEventListener('click', () => exportPNG(true));
}

function updateDifficultyInfo() {
  const preset = difficultyPresets[currentDifficulty];
  customSizeControls.hidden = !preset.custom;
  updateBatchButtonLabel();
  updateDifficultyScore(null);
  if (preset.custom) {
    const { width, height } = getCustomDimensions();
    difficultyInfo.textContent = `Format : ${width}×${height} · Difficulté évaluée après génération`;
    return;
  }
  if (preset.mini4) {
    difficultyInfo.textContent = 'Format : 4×4 · 5 indices numérotés · minimum 3 à 5 ampoules · analyse logique directe/indirecte';
    return;
  }
  if (preset.mini6) {
    difficultyInfo.textContent = 'Format : 6×6 · 9 à 12 indices visibles · minimum 6 à 11 ampoules · analyse logique directe/indirecte';
    return;
  }
  const formattedSizes = preset.sizes.length > 1 ? preset.sizes.map((size) => `${size}×${size}`).join(' / ') : `${preset.sizes[0]}×${preset.sizes[0]}`;
  difficultyInfo.textContent = `Formats : ${formattedSizes} · Niveau validé par le solveur · ${preset.count} grilles recommandées`;
}

function getCustomDimensions() {
  return {
    width: clampInteger(customWidthInput.value, 5, 20, 10),
    height: clampInteger(customHeightInput.value, 5, 20, 10),
  };
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function getBatchCount() {
  return clampInteger(batchCountInput.value, 1, 99, 1);
}

function updateBatchButtonLabel() {
  const count = getBatchCount();
  batchGenerateButton.textContent = `Générer ${count} grille${count > 1 ? 's' : ''} + solution${count > 1 ? 's' : ''}`;
}

async function generatePuzzle() {
  const activeGeneration = generationId + 1;
  generationId = activeGeneration;
  setControlsDisabled(true);
  statusMessage.textContent = 'Génération en cours...';
  updateDifficultyScore(null);
  await waitForPaint();
  if (activeGeneration !== generationId) {
    return;
  }
  const preset = difficultyPresets[currentDifficulty];
  const puzzle = await generatePuzzleData(preset);
  if (activeGeneration !== generationId) {
    return;
  }
  if (puzzle) {
    setCurrentPuzzle(puzzle);
    renderGrid(false, true);
    updateDifficultyScore(puzzle);
    if (preset.mini4) {
      statusMessage.textContent = formatMini4GenerationStatus(puzzle);
    } else if (preset.mini6) {
      statusMessage.textContent = formatMini6GenerationStatus(puzzle);
    } else if (preset.gameLevel) {
      statusMessage.textContent = `Grille générée (${preset.label} - ${puzzle.width}×${puzzle.height}), avec indices faciles masqués.`;
    } else {
      statusMessage.textContent = `Grille générée (${preset.label} - ${puzzle.width}×${puzzle.height}, évaluée ${puzzle.evaluatedDifficulty.label}), résoluble par logique.`;
    }
    setControlsDisabled(false);
    return;
  }
  clearCurrentPuzzle();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  statusMessage.textContent = 'Impossible de générer une grille logique pour ces critères. Réessayez ou ajustez la dimension.';
  setControlsDisabled(false);
}

async function generatePuzzleData(preset) {
  if (preset.mini4) {
    return generateMini4PuzzleData(preset);
  }
  if (preset.mini6) {
    return generateMini6PuzzleData(preset);
  }
  const needsMoreAttempts = preset.clueKeepRate || preset.gameLevel || preset.targetLevel === 'decouverte';
  const maxAttempts = preset.custom ? 80 : preset.gameLevel ? 45 : needsMoreAttempts ? 220 : 120;
  const solveBudget = 500;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { width, height } = getCandidateDimensions(preset);
    const grid = createRandomGrid(width, height, preset.density);
    seedHighClueTargets(grid, preset);
    const solution = solveAkari(grid, solveBudget);
    if (!solution) {
      await waitForPaint();
      continue;
    }
    const diverseSolution = enhanceSolutionClueDiversity(grid, solution, preset);
    const candidate = findValidClueSet(grid, diverseSolution, preset);
    if (!candidate) {
      await waitForPaint();
      continue;
    }
    const { clues, evaluatedDifficulty } = candidate;
    return { grid, solution: diverseSolution, clues, evaluatedDifficulty, width, height };
  }
  return null;
}

async function generateMini4PuzzleData(preset) {
  const targetMinimum = pickMini4TargetMinimum(preset);
  const maxAttempts = 1600;
  let fallbackCandidate = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const grid = createMini4Grid(preset);
    let solution = solveAkari(grid, 350);
    if (!solution) {
      if (attempt % 30 === 0) {
        await waitForPaint();
      }
      continue;
    }

    if (shouldBoostMini4HighClues(targetMinimum)) {
      solution = enhanceMini4SolutionClues(grid, solution);
    }

    const clues = buildClues(grid, solution);
    const candidate = evaluateMini4Candidate(grid, solution, clues, preset);
    if (!candidate) {
      if (attempt % 30 === 0) {
        await waitForPaint();
      }
      continue;
    }

    if (candidate.evaluatedDifficulty.minimumBulbs === targetMinimum) {
      return candidate;
    }

    if (!fallbackCandidate || isBetterMini4Fallback(candidate, fallbackCandidate, targetMinimum)) {
      fallbackCandidate = candidate;
    }

    if (attempt % 30 === 0) {
      await waitForPaint();
    }
  }

  return fallbackCandidate;
}

function pickMini4TargetMinimum(preset) {
  const min = preset.minSolutionBulbs || 3;
  const max = preset.maxSolutionBulbs || 5;
  const roll = Math.random();
  const target = roll < 0.28 ? 3 : roll < 0.68 ? 4 : 5;
  return Math.min(max, Math.max(min, target));
}

function shouldBoostMini4HighClues(targetMinimum) {
  const chance = targetMinimum >= 5 ? 0.42 : 0.12;
  return Math.random() < chance;
}

function createMini4Grid(preset) {
  const size = 4;
  const blackCells = preset.blackCells || 5;
  let fallbackGrid = null;

  for (let shapeAttempt = 0; shapeAttempt < 40; shapeAttempt += 1) {
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    const cells = [];
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        cells.push([x, y]);
      }
    }
    shuffleArray(cells);
    for (let index = 0; index < blackCells; index += 1) {
      const [x, y] = cells[index];
      grid[y][x] = 1;
    }
    fallbackGrid = grid;
    if (isMini4ShapeAllowed(grid)) {
      return grid;
    }
  }

  return fallbackGrid;
}

function isMini4ShapeAllowed(grid) {
  for (let y = 0; y < grid.length; y += 1) {
    const blackInRow = grid[y].filter((value) => value === 1).length;
    if (blackInRow > 3) {
      return false;
    }
  }
  for (let x = 0; x < grid[0].length; x += 1) {
    let blackInColumn = 0;
    for (let y = 0; y < grid.length; y += 1) {
      if (grid[y][x] === 1) {
        blackInColumn += 1;
      }
    }
    if (blackInColumn > 3) {
      return false;
    }
  }
  return countBlackCells(grid) === 5;
}

function enhanceMini4SolutionClues(grid, solution) {
  const enhanced = solution.map((row) => row.slice());
  const blackCells = collectInteriorBlackCells(grid);
  shuffleArray(blackCells);

  for (const [x, y] of blackCells) {
    if (tryAddHighClueSeed(grid, enhanced, x, y)) {
      return enhanced;
    }
  }

  return solution;
}

function evaluateMini4Candidate(grid, solution, clues, preset) {
  if (countBlackCells(grid) !== preset.blackCells || countVisibleClues(clues) !== preset.blackCells) {
    return null;
  }

  const minimumBulbs = countSolutionBulbs(solution);
  if (minimumBulbs < preset.minSolutionBulbs || minimumBulbs > preset.maxSolutionBulbs) {
    return null;
  }

  const histogram = getClueHistogram(clues);
  const visibleTypes = histogram.filter((count) => count > 0).length;
  const mediumOrHighClues = histogram[2] + histogram[3] + histogram[4];
  const highClues = histogram[3] + histogram[4];

  if (visibleTypes < preset.minClueTypes) {
    return null;
  }
  if (histogram[0] > preset.maxZeroClues || highClues > preset.maxHighClues || histogram[4] > preset.maxFourClues) {
    return null;
  }
  if (minimumBulbs >= preset.maxSolutionBulbs && mediumOrHighClues === 0) {
    return null;
  }

  const evaluatedDifficulty = evaluateStandardCandidate(grid, clues, solution);
  if (!evaluatedDifficulty) {
    return null;
  }

  const indirectSteps = getIndirectStepCount(evaluatedDifficulty.stats);
  if (indirectSteps > preset.maxIndirectSteps) {
    return null;
  }
  if (evaluatedDifficulty.stats.iterations > 4) {
    return null;
  }
  if (evaluatedDifficulty.score < preset.minMiniScore || evaluatedDifficulty.score > preset.maxMiniScore) {
    return null;
  }

  const mini4Analysis = analyzeMini4Difficulty(evaluatedDifficulty, minimumBulbs);
  const resolutionScore = normalizeResolutionScore(mini4Analysis.relativeScore, 24, 80);
  return {
    grid,
    solution,
    clues,
    evaluatedDifficulty: {
      ...evaluatedDifficulty,
      level: preset.targetLevel,
      label: preset.label,
      minimumBulbs,
      resolutionScore,
      mini4Analysis,
    },
    width: 4,
    height: 4,
  };
}

function analyzeMini4Difficulty(evaluation, minimumBulbs) {
  const stats = evaluation.stats || {};
  const histogram = evaluation.histogram || [0, 0, 0, 0, 0];
  const indirectSteps = getIndirectStepCount(stats);
  const directSteps = (stats.clueBulbs || 0)
    + (stats.clueCrosses || 0)
    + (stats.singleSourceBulbs || 0)
    + (stats.forcedCrosses || 0);
  const mediumClues = histogram[2] || 0;
  const highClues = (histogram[3] || 0) + (histogram[4] || 0);
  const relativeScore = minimumBulbs * 8
    + indirectSteps * 16
    + mediumClues * 3
    + highClues * 5
    + Math.max(0, (stats.iterations || 1) - 1) * 3
    + (stats.singleSourceBulbs || 0);

  let label = 'directe';
  if (indirectSteps > 0) {
    label = 'indirecte';
  } else if (minimumBulbs >= 5 || highClues > 0) {
    label = 'serrée';
  } else if (minimumBulbs >= 4 || mediumClues > 0) {
    label = 'tactique';
  }

  return {
    label,
    relativeScore,
    minimumBulbs,
    indirectSteps,
    directSteps,
    mediumClues,
    highClues,
  };
}

function isBetterMini4Fallback(candidate, currentBest, targetMinimum) {
  const candidateMinimum = candidate.evaluatedDifficulty.minimumBulbs;
  const currentMinimum = currentBest.evaluatedDifficulty.minimumBulbs;
  const candidateDistance = Math.abs(candidateMinimum - targetMinimum);
  const currentDistance = Math.abs(currentMinimum - targetMinimum);
  if (candidateDistance !== currentDistance) {
    return candidateDistance < currentDistance;
  }
  return candidate.evaluatedDifficulty.mini4Analysis.relativeScore > currentBest.evaluatedDifficulty.mini4Analysis.relativeScore;
}

function formatMini4GenerationStatus(puzzle) {
  const analysis = puzzle.evaluatedDifficulty.mini4Analysis;
  if (!analysis) {
    return `Grille générée (4x4 - ${puzzle.width}×${puzzle.height}), résoluble par logique.`;
  }
  const indirectText = analysis.indirectSteps === 0
    ? 'aucun coup indirect'
    : `${analysis.indirectSteps} coup${analysis.indirectSteps > 1 ? 's' : ''} indirect${analysis.indirectSteps > 1 ? 's' : ''}`;
  const score = getPuzzleResolutionScore(puzzle);
  return `Grille générée (4x4 - minimum ${analysis.minimumBulbs} ampoules, difficulté ${score}/100). Analyse ${analysis.label} : ${indirectText}, ${analysis.directSteps} déduction${analysis.directSteps > 1 ? 's' : ''} directe${analysis.directSteps > 1 ? 's' : ''}.`;
}

function countBlackCells(grid) {
  return grid.reduce((sum, row) => sum + row.filter((value) => value === 1).length, 0);
}

function countSolutionBulbs(solution) {
  return solution.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
}

function getIndirectStepCount(stats = {}) {
  return (stats.indirectBulbs || 0) + (stats.indirectCrosses || 0);
}

function normalizeResolutionScore(relativeScore, low, high) {
  const normalized = ((relativeScore - low) / (high - low)) * 99 + 1;
  return Math.min(100, Math.max(1, Math.round(normalized)));
}

function getPuzzleResolutionScore(puzzle) {
  return puzzle?.evaluatedDifficulty?.resolutionScore || null;
}

function updateDifficultyScore(puzzle) {
  if (!difficultyScore) {
    return;
  }
  const score = getPuzzleResolutionScore(puzzle);
  difficultyScore.textContent = score
    ? `Score de difficulté : ${score}/100`
    : 'Score de difficulté : --/100';
}

async function generateMini6PuzzleData(preset) {
  const targetMinimum = pickMini6TargetMinimum();
  const maxAttempts = 900;
  let fallbackCandidate = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const blackCells = pickMini6BlackCellCount(preset, targetMinimum);
    const grid = createMini6Grid(blackCells);
    let solution = solveAkari(grid, 700);
    if (!solution) {
      if (attempt % 20 === 0) {
        await waitForPaint();
      }
      continue;
    }

    solution = enhanceMini6SolutionClues(grid, solution, targetMinimum);
    const minimumBulbs = countSolutionBulbs(solution);
    if (minimumBulbs < preset.minSolutionBulbs || minimumBulbs > preset.maxSolutionBulbs) {
      if (attempt % 20 === 0) {
        await waitForPaint();
      }
      continue;
    }

    const fullClues = buildClues(grid, solution);
    const targetVisible = pickMini6TargetVisible(preset, blackCells);
    const clues = reduceMini6CluesPreservingLogic(grid, solution, fullClues, preset, targetVisible);
    const candidate = evaluateMini6Candidate(grid, solution, clues, preset);
    if (!candidate) {
      if (attempt % 20 === 0) {
        await waitForPaint();
      }
      continue;
    }

    if (candidate.evaluatedDifficulty.minimumBulbs === targetMinimum) {
      return candidate;
    }

    if (!fallbackCandidate || isBetterMini6Fallback(candidate, fallbackCandidate, targetMinimum)) {
      fallbackCandidate = candidate;
    }

    if (attempt % 20 === 0) {
      await waitForPaint();
    }
  }

  return fallbackCandidate;
}

function pickMini6TargetMinimum() {
  const roll = Math.random();
  if (roll < 0.08) {
    return 6;
  }
  if (roll < 0.16) {
    return 8;
  }
  if (roll < 0.48) {
    return 9;
  }
  if (roll < 0.86) {
    return 10;
  }
  return 11;
}

function pickMini6BlackCellCount(preset, targetMinimum) {
  const options = targetMinimum <= 6
    ? [10, 11]
    : targetMinimum >= 11
      ? [11, 12, 13]
      : [10, 11, 12, 13];
  return options[Math.floor(Math.random() * options.length)];
}

function pickMini6TargetVisible(preset, blackCells) {
  const hiddenClues = Math.random() < 0.75 ? Math.floor(Math.random() * 3) : 0;
  return Math.max(preset.minVisibleClues, Math.min(preset.maxVisibleClues, blackCells - hiddenClues));
}

function createMini6Grid(blackCells) {
  const size = 6;
  let fallbackGrid = null;

  for (let shapeAttempt = 0; shapeAttempt < 80; shapeAttempt += 1) {
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    const cells = [];
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        cells.push([x, y]);
      }
    }
    shuffleArray(cells);
    for (let index = 0; index < blackCells; index += 1) {
      const [x, y] = cells[index];
      grid[y][x] = 1;
    }
    fallbackGrid = grid;
    if (isMini6ShapeAllowed(grid, blackCells)) {
      return grid;
    }
  }

  return fallbackGrid;
}

function isMini6ShapeAllowed(grid, blackCells) {
  if (countBlackCells(grid) !== blackCells) {
    return false;
  }
  for (let y = 0; y < grid.length; y += 1) {
    const blackInRow = grid[y].filter((value) => value === 1).length;
    if (blackInRow > 4) {
      return false;
    }
  }
  for (let x = 0; x < grid[0].length; x += 1) {
    let blackInColumn = 0;
    for (let y = 0; y < grid.length; y += 1) {
      if (grid[y][x] === 1) {
        blackInColumn += 1;
      }
    }
    if (blackInColumn > 4) {
      return false;
    }
  }
  return true;
}

function enhanceMini6SolutionClues(grid, solution, targetMinimum) {
  const enhanced = solution.map((row) => row.slice());
  const blackCells = collectInteriorBlackCells(grid);
  const boostLimit = targetMinimum >= 10 ? 7 : targetMinimum >= 9 ? 5 : 2;
  shuffleArray(blackCells);

  let boosted = 0;
  for (const [x, y] of blackCells) {
    if (tryAddHighClueSeed(grid, enhanced, x, y)) {
      boosted += 1;
      if (boosted >= boostLimit) {
        break;
      }
    }
  }

  return enhanced;
}

function reduceMini6CluesPreservingLogic(grid, solution, fullClues, preset, targetVisible) {
  const clues = fullClues.map((row) => row.slice());
  const clueCells = collectVisibleClueCells(clues);
  shuffleArray(clueCells);
  clueCells.sort(([ax, ay], [bx, by]) => clues[ay][ax] - clues[by][bx]);

  for (const [x, y] of clueCells) {
    if (countVisibleClues(clues) <= targetVisible) {
      break;
    }
    const previous = clues[y][x];
    clues[y][x] = null;
    if (
      countVisibleClues(clues) < preset.minVisibleClues
      || !logicSolveAkari(grid, clues)
      || !verifyUniqueSolution(grid, clues, solution)
    ) {
      clues[y][x] = previous;
    }
  }

  return clues;
}

function evaluateMini6Candidate(grid, solution, clues, preset) {
  const blackCells = countBlackCells(grid);
  const visibleClues = countVisibleClues(clues);
  const minimumBulbs = countSolutionBulbs(solution);

  if (blackCells < preset.minBlackCells || blackCells > preset.maxBlackCells) {
    return null;
  }
  if (visibleClues < preset.minVisibleClues || visibleClues > preset.maxVisibleClues) {
    return null;
  }
  if (minimumBulbs < preset.minSolutionBulbs || minimumBulbs > preset.maxSolutionBulbs || minimumBulbs === 7) {
    return null;
  }

  const histogram = getClueHistogram(clues);
  const visibleTypes = histogram.filter((count) => count > 0).length;
  const highClues = histogram[3] + histogram[4];
  if (visibleTypes < preset.minClueTypes) {
    return null;
  }
  if (histogram[0] > preset.maxZeroClues || highClues > preset.maxHighClues || histogram[4] > preset.maxFourClues) {
    return null;
  }
  if (histogram[2] + highClues === 0) {
    return null;
  }

  const evaluatedDifficulty = evaluateStandardCandidate(grid, clues, solution);
  if (!evaluatedDifficulty) {
    return null;
  }
  const indirectSteps = getIndirectStepCount(evaluatedDifficulty.stats);
  if (indirectSteps > preset.maxIndirectSteps || evaluatedDifficulty.stats.iterations > preset.maxLogicIterations) {
    return null;
  }

  const mini6Analysis = analyzeMini6Difficulty(evaluatedDifficulty, minimumBulbs, blackCells, visibleClues);
  const resolutionScore = normalizeResolutionScore(mini6Analysis.relativeScore, 55, 145);
  return {
    grid,
    solution,
    clues,
    evaluatedDifficulty: {
      ...evaluatedDifficulty,
      level: preset.targetLevel,
      label: preset.label,
      minimumBulbs,
      resolutionScore,
      mini6Analysis,
    },
    width: 6,
    height: 6,
  };
}

function analyzeMini6Difficulty(evaluation, minimumBulbs, blackCells, visibleClues) {
  const stats = evaluation.stats || {};
  const histogram = evaluation.histogram || [0, 0, 0, 0, 0];
  const indirectSteps = getIndirectStepCount(stats);
  const directSteps = (stats.clueBulbs || 0)
    + (stats.clueCrosses || 0)
    + (stats.singleSourceBulbs || 0)
    + (stats.forcedCrosses || 0);
  const mediumClues = histogram[2] || 0;
  const highClues = (histogram[3] || 0) + (histogram[4] || 0);
  const blankBlackCells = blackCells - visibleClues;
  const relativeScore = minimumBulbs * 8
    + indirectSteps * 14
    + mediumClues * 2
    + highClues * 5
    + blankBlackCells * 3
    + Math.max(0, (stats.iterations || 1) - 1) * 3
    + (stats.singleSourceBulbs || 0);

  let label = 'directe';
  if (indirectSteps >= 2) {
    label = 'indirecte';
  } else if (minimumBulbs >= 11 || highClues >= 3) {
    label = 'serrée';
  } else if (minimumBulbs >= 9 || mediumClues >= 3 || indirectSteps === 1) {
    label = 'tactique';
  }

  return {
    label,
    relativeScore,
    minimumBulbs,
    indirectSteps,
    directSteps,
    visibleClues,
    blankBlackCells,
    mediumClues,
    highClues,
  };
}

function isBetterMini6Fallback(candidate, currentBest, targetMinimum) {
  const candidateMinimum = candidate.evaluatedDifficulty.minimumBulbs;
  const currentMinimum = currentBest.evaluatedDifficulty.minimumBulbs;
  const candidateDistance = Math.abs(candidateMinimum - targetMinimum);
  const currentDistance = Math.abs(currentMinimum - targetMinimum);
  if (candidateDistance !== currentDistance) {
    return candidateDistance < currentDistance;
  }
  return candidate.evaluatedDifficulty.mini6Analysis.relativeScore > currentBest.evaluatedDifficulty.mini6Analysis.relativeScore;
}

function formatMini6GenerationStatus(puzzle) {
  const analysis = puzzle.evaluatedDifficulty.mini6Analysis;
  if (!analysis) {
    return `Grille générée (6x6 - ${puzzle.width}×${puzzle.height}), résoluble par logique.`;
  }
  const indirectText = analysis.indirectSteps === 0
    ? 'aucun coup indirect'
    : `${analysis.indirectSteps} coup${analysis.indirectSteps > 1 ? 's' : ''} indirect${analysis.indirectSteps > 1 ? 's' : ''}`;
  const score = getPuzzleResolutionScore(puzzle);
  return `Grille générée (6x6 - minimum ${analysis.minimumBulbs} ampoules, difficulté ${score}/100). Analyse ${analysis.label} : ${analysis.visibleClues} indices visibles, ${indirectText}.`;
}

function setCurrentPuzzle(puzzle) {
  currentGrid = puzzle.grid;
  currentSolution = puzzle.solution;
  currentClues = puzzle.clues;
  currentEvaluatedDifficulty = puzzle.evaluatedDifficulty;
  playerGrid = Array.from({ length: puzzle.height }, () => Array.from({ length: puzzle.width }, () => false));
  noBulbCells = new Set();
  invalidBulbCells = new Set();
  invalidNumberedCells = new Set();
  puzzleCompleted = false;
  celebrationUntil = 0;
}

function clearCurrentPuzzle() {
  currentGrid = null;
  currentSolution = null;
  currentClues = null;
  currentEvaluatedDifficulty = null;
  playerGrid = null;
  noBulbCells = new Set();
  invalidBulbCells = new Set();
  invalidNumberedCells = new Set();
  puzzleCompleted = false;
  celebrationUntil = 0;
}

function setControlsDisabled(disabled) {
  generateButton.disabled = disabled;
  batchGenerateButton.disabled = disabled;
  hintButton.disabled = disabled;
  exportBlankButton.disabled = disabled;
  exportSolutionButton.disabled = disabled;
}

function getCandidateDimensions(preset) {
  if (preset.custom) {
    return getCustomDimensions();
  }
  const size = preset.sizes[Math.floor(Math.random() * preset.sizes.length)];
  return { width: size, height: size };
}

function findValidClueSet(grid, solution, preset) {
  const candidates = buildClueCandidates(grid, solution, preset);
  let bestGameCandidate = null;
  for (const clues of candidates) {
    const evaluatedDifficulty = preset.gameLevel
      ? evaluateUniqueGameLevelCandidate(grid, clues)
      : evaluateStandardCandidate(grid, clues, solution);
    if (!evaluatedDifficulty) {
      continue;
    }
    if (preset.gameLevel) {
      const fallbackScore = getGameCandidateScore(evaluatedDifficulty, preset);
      if (!bestGameCandidate || fallbackScore > bestGameCandidate.fallbackScore) {
        bestGameCandidate = { clues, evaluatedDifficulty, fallbackScore };
      }
    }
    if (!preset.custom && !preset.gameLevel && evaluatedDifficulty.level !== preset.targetLevel) {
      continue;
    }
    if (!meetsClueDiversity(clues, preset)) {
      continue;
    }
    if (!meetsLogicDepth(evaluatedDifficulty, preset)) {
      continue;
    }
    if (preset.gameLevel) {
      maskEasyCluesForGameLevel(clues, preset);
      return { clues, evaluatedDifficulty: { ...evaluatedDifficulty, level: preset.targetLevel, label: preset.label } };
    }
    return { clues, evaluatedDifficulty };
  }
  if (bestGameCandidate) {
    maskEasyCluesForGameLevel(bestGameCandidate.clues, preset);
    return {
      clues: bestGameCandidate.clues,
      evaluatedDifficulty: {
        ...bestGameCandidate.evaluatedDifficulty,
        level: preset.targetLevel,
        label: preset.label,
      },
    };
  }
  return null;
}

function getGameCandidateScore(evaluation, preset) {
  const histogram = evaluation.histogram || [0, 0, 0, 0, 0];
  const visible = histogram.reduce((sum, value) => sum + value, 0);
  const easyRatio = visible === 0 ? 1 : (histogram[0] + histogram[1]) / visible;
  const zeroPenalty = Math.max(0, histogram[0] - preset.maxZeroClues) * 6;
  const easyPenalty = Math.max(0, easyRatio - preset.maxEasyClueRatio) * 80;
  return getHardnessScore(evaluation) - zeroPenalty - easyPenalty;
}

function maskEasyCluesForGameLevel(clues, preset) {
  if (!preset.gameLevel) {
    return;
  }
  const zeroCells = collectClueCellsByValue(clues, 0);
  shuffleArray(zeroCells);
  while (zeroCells.length > 0 && getClueHistogram(clues)[0] > preset.maxZeroClues) {
    const [x, y] = zeroCells.pop();
    clues[y][x] = null;
  }

  const easyCells = collectClueCellsByValue(clues, 1);
  shuffleArray(easyCells);
  while (easyCells.length > 0) {
    const histogram = getClueHistogram(clues);
    const visible = histogram.reduce((sum, value) => sum + value, 0);
    const easyRatio = visible === 0 ? 1 : (histogram[0] + histogram[1]) / visible;
    if (easyRatio <= preset.maxEasyClueRatio) {
      break;
    }
    const [x, y] = easyCells.pop();
    clues[y][x] = null;
  }
}

function collectClueCellsByValue(clues, value) {
  const cells = [];
  for (let y = 0; y < clues.length; y += 1) {
    for (let x = 0; x < clues[0].length; x += 1) {
      if (clues[y][x] === value) {
        cells.push([x, y]);
      }
    }
  }
  return cells;
}

function evaluateStandardCandidate(grid, clues, solution) {
  if (!verifyUniqueSolution(grid, clues, solution)) {
    return null;
  }
  return evaluatePuzzleDifficulty(grid, clues);
}

function evaluateUniqueGameLevelCandidate(grid, clues) {
  return evaluatePuzzleDifficulty(grid, clues);
}

function buildClueCandidates(grid, solution, preset) {
  const fullClues = buildClues(grid, solution);
  if (preset.gameLevel) {
    return buildGameLevelClueCandidates(grid, solution, fullClues, preset);
  }
  if (!preset.clueKeepRate) {
    return [fullClues];
  }
  const candidates = [];
  const variants = preset.targetLevel === 'niveau6' || preset.targetLevel === 'niveau7' || preset.targetLevel === 'niveau8' ? 8 : 14;
  for (let index = 0; index < variants; index += 1) {
    const clues = reduceCluesPreservingUniqueness(grid, solution, fullClues, preset);
    const visibleClues = countVisibleClues(clues);
    const enoughClues = !preset.minVisibleClues || visibleClues >= preset.minVisibleClues;
    const notTooManyClues = !preset.maxVisibleClues || visibleClues <= preset.maxVisibleClues;
    if (visibleClues > 0 && enoughClues && notTooManyClues) {
      candidates.push(clues);
    }
  }
  return candidates;
}

function buildGameLevelClueCandidates(grid, solution, fullClues, preset) {
  const candidates = [];
  const variants = 3;
  for (let index = 0; index < variants; index += 1) {
    candidates.push(reduceGameLevelClues(grid, solution, fullClues, preset));
  }
  candidates.push(fullClues);
  return candidates;
}

function reduceGameLevelClues(grid, solution, fullClues, preset) {
  const clues = fullClues.map((row) => row.slice());
  const removable = collectVisibleClueCells(clues).filter(([x, y]) => clues[y][x] <= 2);
  shuffleArray(removable);

  for (const [x, y] of removable) {
    const histogram = getClueHistogram(clues);
    const visible = countVisibleClues(clues);
    const easyRatio = visible === 0 ? 1 : (histogram[0] + histogram[1]) / visible;
    if (histogram[0] <= preset.maxZeroClues && easyRatio <= preset.maxEasyClueRatio) {
      break;
    }
    const previous = clues[y][x];
    const removalChance = previous === 0 ? 0.92 : previous === 1 ? 0.72 : 0.28;
    if (Math.random() < removalChance) {
      clues[y][x] = null;
    }
  }

  return clues;
}

function reduceCluesPreservingUniqueness(grid, solution, fullClues, preset) {
  const clues = fullClues.map((row) => row.slice());
  const clueCells = collectVisibleClueCells(clues);
  shuffleArray(clueCells);
  const minVisible = preset.minVisibleClues || 1;
  const maxVisible = preset.maxVisibleClues || clueCells.length;
  const targetVisible = Math.max(minVisible, Math.min(maxVisible, Math.floor(clueCells.length * preset.clueKeepRate)));

  for (const [x, y] of clueCells) {
    if (countVisibleClues(clues) <= targetVisible) {
      break;
    }
    const previous = clues[y][x];
    clues[y][x] = null;
    if (!logicSolveAkari(grid, clues) || !verifyUniqueSolution(grid, clues, solution)) {
      clues[y][x] = previous;
    }
  }

  return clues;
}

function collectVisibleClueCells(clues) {
  const cells = [];
  for (let y = 0; y < clues.length; y += 1) {
    for (let x = 0; x < clues[0].length; x += 1) {
      if (clues[y][x] !== null) {
        cells.push([x, y]);
      }
    }
  }
  return cells;
}

function countVisibleClues(clues) {
  let count = 0;
  for (let y = 0; y < clues.length; y += 1) {
    for (let x = 0; x < clues[0].length; x += 1) {
      if (clues[y][x] !== null) {
        count += 1;
      }
    }
  }
  return count;
}

function meetsClueDiversity(clues, preset) {
  if (preset.custom) {
    return true;
  }
  const histogram = getClueHistogram(clues);
  const visibleTypes = histogram.filter((count) => count > 0).length;
  const highClues = histogram[3] + histogram[4];
  if (preset.minClueTypes && visibleTypes < preset.minClueTypes) {
    return false;
  }
  if (preset.minHighClues && highClues < preset.minHighClues) {
    return false;
  }
  if (preset.minFourClues && histogram[4] < preset.minFourClues) {
    return false;
  }
  if (preset.maxZeroClues !== undefined && histogram[0] > preset.maxZeroClues) {
    return false;
  }
  if (preset.maxEasyClueRatio !== undefined) {
    const visible = histogram.reduce((sum, value) => sum + value, 0);
    const easyRatio = visible === 0 ? 1 : (histogram[0] + histogram[1]) / visible;
    if (easyRatio > preset.maxEasyClueRatio) {
      return false;
    }
  }
  return true;
}

function meetsLogicDepth(evaluation, preset) {
  if (!preset.minIndirectSteps) {
    return true;
  }
  const stats = evaluation.stats || {};
  const indirectSteps = (stats.indirectBulbs || 0) + (stats.indirectCrosses || 0);
  if (indirectSteps < preset.minIndirectSteps) {
    return false;
  }
  if (preset.minHardnessScore && getHardnessScore(evaluation) < preset.minHardnessScore) {
    return false;
  }
  return true;
}

function getHardnessScore(evaluation) {
  const stats = evaluation.stats || {};
  const histogram = evaluation.histogram || [0, 0, 0, 0, 0];
  const visible = histogram.reduce((sum, value) => sum + value, 0);
  const easyClues = histogram[0] + histogram[1];
  const easyPenalty = visible === 0 ? 0 : (easyClues / visible) * 35;
  return (stats.indirectBulbs || 0) * 26
    + (stats.indirectCrosses || 0) * 18
    + (stats.singleSourceBulbs || 0) * 1.5
    + histogram[3] * 4
    + histogram[4] * 7
    - easyPenalty;
}

function getClueHistogram(clues) {
  const histogram = [0, 0, 0, 0, 0];
  for (let y = 0; y < clues.length; y += 1) {
    for (let x = 0; x < clues[0].length; x += 1) {
      const clue = clues[y][x];
      if (clue !== null) {
        histogram[clue] += 1;
      }
    }
  }
  return histogram;
}

function enhanceSolutionClueDiversity(grid, solution, preset) {
  if (!preset.highClueSeeds) {
    return solution;
  }
  const enhanced = solution.map((row) => row.slice());
  const blackCells = collectInteriorBlackCells(grid);
  shuffleArray(blackCells);
  let addedSeeds = 0;
  for (const [x, y] of blackCells) {
    if (tryAddHighClueSeed(grid, enhanced, x, y)) {
      addedSeeds += 1;
    }
    if (addedSeeds >= preset.highClueSeeds) {
      break;
    }
  }
  return enhanced;
}

function collectInteriorBlackCells(grid) {
  const cells = [];
  for (let y = 1; y < grid.length - 1; y += 1) {
    for (let x = 1; x < grid[0].length - 1; x += 1) {
      if (grid[y][x] === 1) {
        cells.push([x, y]);
      }
    }
  }
  return cells;
}

function seedHighClueTargets(grid, preset) {
  if (!preset.highClueSeeds) {
    return;
  }
  const width = grid[0].length;
  const height = grid.length;
  const targetCount = Math.min(preset.highClueSeeds, Math.floor((width * height) / 45) + 1);
  const candidates = [];
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      candidates.push([x, y]);
    }
  }
  shuffleArray(candidates);
  let seeded = 0;
  for (const [x, y] of candidates) {
    if (hasNearbyHighClueTarget(grid, x, y)) {
      continue;
    }
    grid[y][x] = 1;
    for (const { dx, dy } of directions) {
      grid[y + dy][x + dx] = 0;
    }
    seeded += 1;
    if (seeded >= targetCount) {
      break;
    }
  }
}

function hasNearbyHighClueTarget(grid, x, y) {
  for (let ny = Math.max(1, y - 2); ny <= Math.min(grid.length - 2, y + 2); ny += 1) {
    for (let nx = Math.max(1, x - 2); nx <= Math.min(grid[0].length - 2, x + 2); nx += 1) {
      if (grid[ny][nx] === 1 && Math.abs(nx - x) + Math.abs(ny - y) <= 2) {
        return true;
      }
    }
  }
  return false;
}

function tryAddHighClueSeed(grid, solution, x, y) {
  const adjacent = directions.map(({ dx, dy }) => [x + dx, y + dy]);
  if (!adjacent.every(([nx, ny]) => grid[ny] && grid[ny][nx] === 0)) {
    return false;
  }
  const snapshot = solution.map((row) => row.slice());
  for (const [nx, ny] of adjacent) {
    removeSeenBulbs(grid, solution, nx, ny);
    solution[ny][nx] = true;
  }
  if (isValidAkariSolution(grid, solution)) {
    return true;
  }
  for (let row = 0; row < solution.length; row += 1) {
    solution[row] = snapshot[row];
  }
  return false;
}

function removeSeenBulbs(grid, solution, x, y) {
  for (const { dx, dy } of directions) {
    let nx = x + dx;
    let ny = y + dy;
    while (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length && grid[ny][nx] === 0) {
      if (solution[ny][nx]) {
        solution[ny][nx] = false;
      }
      nx += dx;
      ny += dy;
    }
  }
}

function isValidAkariSolution(grid, solution) {
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[0].length; x += 1) {
      if (grid[y][x] !== 0) {
        continue;
      }
      if (solution[y][x] && hasVisibleBulb(grid, solution, x, y)) {
        return false;
      }
      if (!isLitInSolution(grid, solution, x, y)) {
        return false;
      }
    }
  }
  return true;
}

function hasVisibleBulb(grid, solution, x, y) {
  for (const { dx, dy } of directions) {
    let nx = x + dx;
    let ny = y + dy;
    while (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length && grid[ny][nx] === 0) {
      if (solution[ny][nx]) {
        return true;
      }
      nx += dx;
      ny += dy;
    }
  }
  return false;
}

function isLitInSolution(grid, solution, x, y) {
  if (solution[y][x]) {
    return true;
  }
  return hasVisibleBulb(grid, solution, x, y);
}

function shuffleArray(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
}

function waitForPaint() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function createRandomGrid(width, height, density) {
  const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (Math.random() < density) {
        grid[y][x] = 1;
      }
    }
  }

  // Ensure edges and connected area remain playable
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] === 1) {
        const neighbors = getNeighbors(x, y, width, height).filter(([nx, ny]) => grid[ny][nx] === 1);
        if (neighbors.length > 2 && Math.random() < 0.5) {
          grid[y][x] = 0;
        }
      }
    }
  }

  return grid;
}

function solveAkari(grid, timeBudget = 1500) {
  const width = grid[0].length;
  const height = grid.length;
  const whiteCells = [];
  const blackCells = new Set();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] === 1) {
        blackCells.add(`${x},${y}`);
      } else {
        whiteCells.push([x, y]);
      }
    }
  }

  const bulbSet = new Set();
  const litCounts = new Map();
  const startTime = performance.now();
  const cellKey = (x, y) => `${x},${y}`;

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  function isWhite(x, y) {
    return inBounds(x, y) && grid[y][x] === 0;
  }

  function canPlaceBulb(x, y) {
    if (!isWhite(x, y) || bulbSet.has(cellKey(x, y))) {
      return false;
    }
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && grid[ny][nx] === 0) {
        if (bulbSet.has(cellKey(nx, ny))) {
          return false;
        }
        nx += dx;
        ny += dy;
      }
    }
    return true;
  }

  function addLight(x, y) {
    const k = cellKey(x, y);
    litCounts.set(k, (litCounts.get(k) || 0) + 1);
  }

  function removeLight(x, y) {
    const k = cellKey(x, y);
    const value = (litCounts.get(k) || 1) - 1;
    if (value <= 0) {
      litCounts.delete(k);
    } else {
      litCounts.set(k, value);
    }
  }

  function markLine(x, y, delta) {
    if (delta > 0) {
      addLight(x, y);
    } else {
      removeLight(x, y);
    }
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && grid[ny][nx] === 0) {
        if (delta > 0) {
          addLight(nx, ny);
        } else {
          removeLight(nx, ny);
        }
        nx += dx;
        ny += dy;
      }
    }
  }

  function placeBulb(x, y) {
    bulbSet.add(cellKey(x, y));
    markLine(x, y, 1);
  }

  function removeBulb(x, y) {
    bulbSet.delete(cellKey(x, y));
    markLine(x, y, -1);
  }

  function isLit(x, y) {
    return litCounts.has(cellKey(x, y));
  }

  function getLightingCandidates(x, y) {
    const candidates = new Set();
    if (canPlaceBulb(x, y)) {
      candidates.add(cellKey(x, y));
    }
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && grid[ny][nx] === 0) {
        if (canPlaceBulb(nx, ny)) {
          candidates.add(cellKey(nx, ny));
        }
        nx += dx;
        ny += dy;
      }
    }
    return Array.from(candidates).map((keyString) => keyString.split(',').map(Number));
  }

  function findBestUnlitCell() {
    let best = null;
    let bestCandidates = null;
    for (const [x, y] of whiteCells) {
      if (isLit(x, y)) {
        continue;
      }
      const candidates = getLightingCandidates(x, y);
      if (candidates.length === 0) {
        return { failure: true };
      }
      if (!bestCandidates || candidates.length < bestCandidates.length) {
        best = { x, y };
        bestCandidates = candidates;
        if (bestCandidates.length === 1) {
          break;
        }
      }
    }
    return best ? { ...best, candidates: bestCandidates } : { completed: true };
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function search() {
    if (performance.now() - startTime > timeBudget) {
      return false;
    }
    const candidateInfo = findBestUnlitCell();
    if (candidateInfo.failure) {
      return false;
    }
    if (candidateInfo.completed) {
      return true;
    }

    const candidates = candidateInfo.candidates.slice();
    shuffle(candidates);
    candidates.sort((a, b) => {
      const aCoverage = countCoverage(a[0], a[1]);
      const bCoverage = countCoverage(b[0], b[1]);
      return bCoverage - aCoverage;
    });

    for (const [cx, cy] of candidates) {
      placeBulb(cx, cy);
      if (search()) {
        return true;
      }
      removeBulb(cx, cy);
    }
    return false;
  }

  function countCoverage(x, y) {
    let count = isLit(x, y) ? 0 : 1;
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && grid[ny][nx] === 0) {
        if (!isLit(nx, ny)) {
          count += 1;
        }
        nx += dx;
        ny += dy;
      }
    }
    return count;
  }

  if (!search()) {
    return null;
  }

  const solution = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  bulbSet.forEach((value) => {
    const [x, y] = value.split(',').map(Number);
    solution[y][x] = true;
  });
  return solution;
}

function logicSolveAkari(grid, clues, stats = null) {
  const height = grid.length;
  const width = grid[0].length;
  const state = Array.from({ length: height }, () => Array.from({ length: width }, () => 'unknown'));
  if (stats) {
    stats.iterations = 0;
    stats.clueBulbs = 0;
    stats.clueCrosses = 0;
    stats.singleSourceBulbs = 0;
    stats.forcedCrosses = 0;
    stats.indirectBulbs = 0;
    stats.indirectCrosses = 0;
  }

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  function isWhite(x, y) {
    return inBounds(x, y) && grid[y][x] === 0;
  }

  function isBlack(x, y) {
    return inBounds(x, y) && grid[y][x] === 1;
  }

  function neighbors(x, y) {
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(([nx, ny]) => inBounds(nx, ny));
  }

  function lineOfSight(x, y) {
    const cells = [];
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && grid[ny][nx] === 0) {
        cells.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
    }
    return cells;
  }

  function litCellsFromBulb(x, y) {
    const lit = [[x, y]];
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && grid[ny][nx] === 0) {
        lit.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
    }
    return lit;
  }

  function countAdjacentBulbs(x, y) {
    return neighbors(x, y).filter(([nx, ny]) => state[ny][nx] === 'bulb').length;
  }

  function isLit(x, y) {
    if (state[y][x] === 'bulb') {
      return true;
    }
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (state[ny][nx] === 'bulb') {
        return true;
      }
    }
    return false;
  }

  function canBeBulb(x, y) {
    if (!isWhite(x, y) || state[y][x] === 'no-bulb') {
      return false;
    }
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (state[ny][nx] === 'bulb') {
        return false;
      }
    }
    return true;
  }

  function setBulb(x, y) {
    if (state[y][x] === 'bulb') {
      return true;
    }
    if (state[y][x] === 'no-bulb' || !canBeBulb(x, y)) {
      return false;
    }
    state[y][x] = 'bulb';
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (state[ny][nx] === 'bulb') {
        return false;
      }
      state[ny][nx] = 'no-bulb';
    }
    return true;
  }

  function setNoBulb(x, y) {
    if (state[y][x] === 'no-bulb') {
      return true;
    }
    if (state[y][x] === 'bulb') {
      return false;
    }
    state[y][x] = 'no-bulb';
    return true;
  }

  function possibleBulbSourcesForCell(x, y) {
    const sources = [];
    if (canBeBulb(x, y)) {
      sources.push([x, y]);
    }
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (canBeBulb(nx, ny)) {
        sources.push([nx, ny]);
      }
    }
    return sources;
  }

  function cloneState() {
    return state.map((row) => row.slice());
  }

  function boardIsLit(board, x, y) {
    if (board[y][x] === 'bulb') {
      return true;
    }
    return lineOfSight(x, y).some(([nx, ny]) => board[ny][nx] === 'bulb');
  }

  function boardCanBeBulb(board, x, y) {
    if (!isWhite(x, y) || board[y][x] !== 'unknown') {
      return false;
    }
    return lineOfSight(x, y).every(([nx, ny]) => board[ny][nx] !== 'bulb');
  }

  function boardSetBulb(board, x, y) {
    if (!boardCanBeBulb(board, x, y)) {
      return false;
    }
    board[y][x] = 'bulb';
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (board[ny][nx] === 'bulb') {
        return false;
      }
      if (board[ny][nx] === 'unknown') {
        board[ny][nx] = 'no-bulb';
      }
    }
    return true;
  }

  function boardSetNoBulb(board, x, y) {
    if (!isWhite(x, y)) {
      return true;
    }
    if (board[y][x] === 'bulb') {
      return false;
    }
    if (board[y][x] === 'unknown') {
      board[y][x] = 'no-bulb';
    }
    return true;
  }

  function boardPossibleBulbSources(board, x, y) {
    const sources = [];
    if (boardCanBeBulb(board, x, y)) {
      sources.push([x, y]);
    }
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (boardCanBeBulb(board, nx, ny)) {
        sources.push([nx, ny]);
      }
    }
    return sources;
  }

  function boardPropagate(board) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (grid[y][x] !== 1 || clues[y][x] === null) {
            continue;
          }
          const clue = clues[y][x];
          const adjacent = neighbors(x, y).filter(([nx, ny]) => isWhite(nx, ny));
          const bulbCount = adjacent.filter(([nx, ny]) => board[ny][nx] === 'bulb').length;
          const candidates = adjacent.filter(([nx, ny]) => boardCanBeBulb(board, nx, ny));
          if (bulbCount > clue || bulbCount + candidates.length < clue) {
            return false;
          }
          if (bulbCount === clue) {
            for (const [nx, ny] of adjacent) {
              if (board[ny][nx] === 'unknown') {
                if (!boardSetNoBulb(board, nx, ny)) {
                  return false;
                }
                changed = true;
              }
            }
          } else if (bulbCount + candidates.length === clue) {
            for (const [nx, ny] of candidates) {
              if (!boardSetBulb(board, nx, ny)) {
                return false;
              }
              changed = true;
            }
          }
        }
      }

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (!isWhite(x, y) || boardIsLit(board, x, y)) {
            continue;
          }
          const sources = boardPossibleBulbSources(board, x, y);
          if (sources.length === 0) {
            return false;
          }
          if (sources.length === 1) {
            const [bx, by] = sources[0];
            if (board[by][bx] !== 'bulb') {
              if (!boardSetBulb(board, bx, by)) {
                return false;
              }
              changed = true;
            }
          }
        }
      }
    }
    return true;
  }

  function assumptionContradicts(x, y, value) {
    const board = cloneState();
    const applied = value === 'bulb' ? boardSetBulb(board, x, y) : boardSetNoBulb(board, x, y);
    return !applied || !boardPropagate(board);
  }

  function applyIndirectStep() {
    const candidates = getIndirectCandidateCells();
    for (const [x, y] of candidates) {
        if (canBeBulb(x, y) && assumptionContradicts(x, y, 'bulb')) {
          if (!setNoBulb(x, y)) {
            return null;
          }
          if (stats) {
            stats.indirectCrosses += 1;
          }
          return true;
        }
        if (assumptionContradicts(x, y, 'no-bulb')) {
          if (!setBulb(x, y)) {
            return null;
          }
          if (stats) {
            stats.indirectBulbs += 1;
          }
          return true;
        }
    }
    return false;
  }

  function getIndirectCandidateCells() {
    const keys = new Set();
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (grid[y][x] === 1 && clues[y][x] !== null) {
          for (const [nx, ny] of neighbors(x, y)) {
            if (isWhite(nx, ny) && state[ny][nx] === 'unknown') {
              keys.add(cellKey(nx, ny));
            }
          }
        }
        if (grid[y][x] === 0 && state[y][x] === 'unknown' && !isLit(x, y)) {
          for (const [sx, sy] of possibleBulbSourcesForCell(x, y)) {
            if (state[sy][sx] === 'unknown') {
              keys.add(cellKey(sx, sy));
            }
          }
        }
      }
    }
    return Array.from(keys).slice(0, 80).map((key) => key.split(',').map(Number));
  }

  function satisfyNumberedCell(x, y) {
    const clue = clues[y][x];
    if (clue === null) {
      return true;
    }
    const adjacent = neighbors(x, y).filter(([nx, ny]) => isWhite(nx, ny));
    const bulbCount = adjacent.filter(([nx, ny]) => state[ny][nx] === 'bulb').length;
    const unknownCells = adjacent.filter(([nx, ny]) => state[ny][nx] === 'unknown');
    if (bulbCount > clue || bulbCount + unknownCells.length < clue) {
      return false;
    }
    if (bulbCount === clue) {
      for (const [nx, ny] of unknownCells) {
        if (!setNoBulb(nx, ny)) {
          return false;
        }
        if (stats) {
          stats.clueCrosses += 1;
        }
      }
    }
    if (bulbCount + unknownCells.length === clue) {
      for (const [nx, ny] of unknownCells) {
        if (!setBulb(nx, ny)) {
          return false;
        }
        if (stats) {
          stats.clueBulbs += 1;
        }
      }
    }
    return true;
  }

  function propagate() {
    let changed = false;
    if (stats) {
      stats.iterations += 1;
    }
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (grid[y][x] !== 0) {
          continue;
        }
        if (state[y][x] === 'unknown' && !canBeBulb(x, y) && !isLit(x, y)) {
          if (!setNoBulb(x, y)) {
            return null;
          }
          if (stats) {
            stats.forcedCrosses += 1;
          }
          changed = true;
        }
      }
    }

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (isBlack(x, y)) {
          if (!satisfyNumberedCell(x, y)) {
            return null;
          }
        }
      }
    }

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (grid[y][x] !== 0 || isLit(x, y)) {
          continue;
        }
        const sources = possibleBulbSourcesForCell(x, y);
        if (sources.length === 0) {
          return null;
        }
        if (sources.length === 1) {
          const [bx, by] = sources[0];
          if (state[by][bx] !== 'bulb') {
            if (!setBulb(bx, by)) {
              return null;
            }
            if (stats) {
              stats.singleSourceBulbs += 1;
            }
            changed = true;
          }
        }
      }
    }

    return changed;
  }

  let progress = true;
  while (progress) {
    progress = propagate();
    if (progress === null) {
      return null;
    }
    if (!progress) {
      progress = applyIndirectStep();
      if (progress === null) {
        return null;
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] === 0 && state[y][x] === 'unknown') {
        return null;
      }
    }
  }

  const finalSolution = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (state[y][x] === 'bulb') {
        finalSolution[y][x] = true;
      }
    }
  }
  return finalSolution;
}

function areSolutionsEqual(solutionA, solutionB) {
  if (solutionA.length !== solutionB.length) {
    return false;
  }
  for (let y = 0; y < solutionA.length; y += 1) {
    for (let x = 0; x < solutionA[0].length; x += 1) {
      if (solutionA[y][x] !== solutionB[y][x]) {
        return false;
      }
    }
  }
  return true;
}

function buildClues(grid, solution) {
  const height = grid.length;
  const width = grid[0].length;
  const clues = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] !== 1) {
        continue;
      }
      let count = 0;
      for (const { dx, dy } of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (ny >= 0 && ny < height && nx >= 0 && nx < width && solution[ny][nx]) {
          count += 1;
        }
      }
      clues[y][x] = count;
    }
  }
  return clues;
}

function renderGrid(showSolution, showPlayer = false) {
  if (!currentGrid) {
    return;
  }
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
  drawOnContext(ctx, cellSize, showSolution, showPlayer);
}

function cellKey(x, y) {
  return `${x},${y}`;
}

function inCurrentGridBounds(x, y) {
  return x >= 0 && y >= 0 && y < currentGrid.length && x < currentGrid[0].length;
}

function isCellLitByBulbs(x, y, bulbs) {
  if (bulbs[y][x]) {
    return true;
  }
  for (const { dx, dy } of directions) {
    let nx = x + dx;
    let ny = y + dy;
    while (inCurrentGridBounds(nx, ny) && currentGrid[ny][nx] === 0) {
      if (bulbs[ny][nx]) {
        return true;
      }
      nx += dx;
      ny += dy;
    }
  }
  return false;
}

function drawOnContext(renderCtx, size, showSolution, showPlayer) {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  renderCtx.clearRect(0, 0, cols * size, rows * size);
  renderCtx.fillStyle = '#f8fafc';
  renderCtx.fillRect(0, 0, cols * size, rows * size);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = x * size;
      const py = y * size;
      const isWhiteCell = currentGrid[y][x] === 0;
      const isLit = showPlayer && playerGrid && isWhiteCell && isCellLitByBulbs(x, y, playerGrid);
      renderCtx.fillStyle = isLit ? '#fef3c7' : '#ffffff';
      renderCtx.fillRect(px, py, size, size);
      renderCtx.strokeStyle = '#d1d5db';
      renderCtx.lineWidth = 1;
      renderCtx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);

      if (currentGrid[y][x] === 1) {
        const clue = currentClues[y][x];
        renderCtx.fillStyle = invalidNumberedCells.has(`${x},${y}`) ? '#b91c1c' : '#111827';
        renderCtx.fillRect(px + 2, py + 2, size - 4, size - 4);
        if (clue !== null) {
          renderCtx.fillStyle = invalidNumberedCells.has(`${x},${y}`) ? '#fee2e2' : '#f8fafc';
          renderCtx.font = `bold ${Math.floor(size * 0.45)}px Inter, system-ui, sans-serif`;
          renderCtx.textAlign = 'center';
          renderCtx.textBaseline = 'middle';
          renderCtx.fillText(clue.toString(), px + size / 2, py + size / 2 + 1);
        }
      }
    }
  }

  if (showSolution) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (currentSolution[y][x]) {
          drawBulb(renderCtx, x, y, size);
        }
      }
    }
  }

  if (showPlayer && playerGrid) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (playerGrid[y][x]) {
          const invalid = invalidBulbCells.has(cellKey(x, y));
          drawBulb(renderCtx, x, y, size, invalid);
        } else if (noBulbCells.has(cellKey(x, y))) {
          drawNoBulbMarker(renderCtx, x, y, size);
        }
      }
    }
  }

  if (showPlayer && playerGrid && puzzleCompleted) {
    drawCompletionOverlay(renderCtx, cols * size, rows * size, size);
  }
}

function drawBulb(renderCtx, x, y, size, invalid = false) {
  const px = x * size;
  const py = y * size;
  const centerX = px + size / 2;
  const centerY = py + size / 2;
  const radius = size * 0.26;

  renderCtx.fillStyle = invalid ? '#fecaca' : '#fde68a';
  renderCtx.beginPath();
  renderCtx.arc(centerX, centerY - radius * 0.12, radius, 0, Math.PI * 2);
  renderCtx.fill();

  renderCtx.fillStyle = '#f59e0b';
  renderCtx.fillRect(centerX - radius * 0.18, centerY - radius * 0.1, radius * 0.36, radius * 0.7);

  if (invalid) {
    renderCtx.strokeStyle = '#b91c1c';
    renderCtx.lineWidth = Math.max(2, size * 0.05);
    renderCtx.beginPath();
    renderCtx.arc(centerX, centerY - radius * 0.12, radius + 4, 0, Math.PI * 2);
    renderCtx.stroke();
  }

  renderCtx.fillStyle = '#f59e0b';
  renderCtx.beginPath();
  renderCtx.moveTo(centerX - radius * 0.28, centerY + radius * 0.35);
  renderCtx.lineTo(centerX + radius * 0.28, centerY + radius * 0.35);
  renderCtx.lineTo(centerX + radius * 0.1, centerY + radius * 0.6);
  renderCtx.lineTo(centerX - radius * 0.1, centerY + radius * 0.6);
  renderCtx.closePath();
  renderCtx.fill();
}

function drawNoBulbMarker(renderCtx, x, y, size) {
  const px = x * size;
  const py = y * size;
  const padding = size * 0.33;

  renderCtx.strokeStyle = '#64748b';
  renderCtx.lineWidth = Math.max(2, size * 0.045);
  renderCtx.lineCap = 'round';
  renderCtx.beginPath();
  renderCtx.moveTo(px + padding, py + padding);
  renderCtx.lineTo(px + size - padding, py + size - padding);
  renderCtx.moveTo(px + size - padding, py + padding);
  renderCtx.lineTo(px + padding, py + size - padding);
  renderCtx.stroke();
  renderCtx.lineCap = 'butt';
}

function drawCompletionOverlay(renderCtx, width, height, size) {
  const remaining = Math.max(0, celebrationUntil - performance.now());
  const confettiActive = remaining > 0;
  const progress = confettiActive ? 1 - remaining / celebrationDuration : 1;
  const centerX = width / 2;
  const centerY = height / 2;
  const panelWidth = Math.min(width * 0.82, size * 4.4);
  const panelHeight = Math.min(height * 0.26, size * 1.35);
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#a855f7'];

  renderCtx.save();
  renderCtx.globalAlpha = 0.9;
  renderCtx.fillStyle = '#0f172a';
  renderCtx.beginPath();
  renderCtx.roundRect(centerX - panelWidth / 2, centerY - panelHeight / 2, panelWidth, panelHeight, Math.max(8, size * 0.16));
  renderCtx.fill();

  renderCtx.globalAlpha = 1;
  renderCtx.fillStyle = '#f8fafc';
  renderCtx.font = `bold ${Math.max(24, Math.floor(size * 0.48))}px Inter, system-ui, sans-serif`;
  renderCtx.textAlign = 'center';
  renderCtx.textBaseline = 'middle';
  renderCtx.fillText('Well done', centerX, centerY + size * 0.02);

  if (!confettiActive) {
    renderCtx.restore();
    return;
  }

  for (let i = 0; i < 34; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const lane = Math.floor(i / 2);
    const angle = (-0.95 + (lane % 17) * 0.12) * side;
    const distance = size * (0.55 + (lane % 5) * 0.15 + progress * 1.35);
    const x = centerX + Math.cos(angle) * distance * side;
    const y = centerY - panelHeight * 0.35 + Math.sin(angle) * distance + progress * size * 0.55;
    const confettiSize = Math.max(4, size * (0.07 + (i % 3) * 0.015));
    renderCtx.fillStyle = colors[i % colors.length];
    renderCtx.globalAlpha = Math.max(0, 1 - progress * 0.45);
    renderCtx.translate(x, y);
    renderCtx.rotate(progress * Math.PI * 2 + i);
    renderCtx.fillRect(-confettiSize / 2, -confettiSize / 2, confettiSize, confettiSize * 0.55);
    renderCtx.setTransform(1, 0, 0, 1, 0, 0);
  }
  renderCtx.restore();
}

async function generateBatchFiles() {
  const activeGeneration = generationId + 1;
  generationId = activeGeneration;
  const preset = difficultyPresets[currentDifficulty];
  const count = getBatchCount();
  const padLength = Math.max(2, String(count).length);
  let lastPuzzle = null;
  const zipEntries = [];
  setControlsDisabled(true);

  for (let index = 1; index <= count; index += 1) {
    statusMessage.textContent = `Génération ${index}/${count}...`;
    await waitForPaint();
    if (activeGeneration !== generationId) {
      setControlsDisabled(false);
      return;
    }
    const puzzle = await generatePuzzleData(preset);
    if (!puzzle) {
      statusMessage.textContent = `La génération ${index}/${count} a échoué. Les fichiers déjà créés ont été téléchargés.`;
      setControlsDisabled(false);
      return;
    }
    lastPuzzle = puzzle;
    const baseName = buildPuzzleFileBaseName(preset, puzzle, index, padLength);
    const blankBlob = await renderPuzzleToBlob(puzzle, false);
    const solutionBlob = await renderPuzzleToBlob(puzzle, true);
    if (!blankBlob || !solutionBlob) {
      statusMessage.textContent = `L'export PNG a échoué à la génération ${index}/${count}.`;
      setControlsDisabled(false);
      return;
    }
    zipEntries.push({ name: `${baseName}.png`, blob: blankBlob });
    zipEntries.push({ name: `sol-${baseName}.png`, blob: solutionBlob });
  }

  if (lastPuzzle) {
    setCurrentPuzzle(lastPuzzle);
    renderGrid(false, true);
    updateDifficultyScore(lastPuzzle);
  }
  statusMessage.textContent = 'Création du fichier ZIP...';
  await waitForPaint();
  const zipBlob = await createZipBlob(zipEntries);
  downloadBlob(zipBlob, buildBatchZipFileName(preset, count));
  statusMessage.textContent = `${count} grille${count > 1 ? 's' : ''} générée${count > 1 ? 's' : ''} avec solutions dans un ZIP.`;
  setControlsDisabled(false);
}

function buildPuzzleFileBaseName(preset, puzzle, index, padLength) {
  const suffix = String(index).padStart(padLength, '0');
  if (preset.mini4 || preset.mini6) {
    return `${preset.fileLabel}-${formatDifficultyScoreForFile(puzzle)}-${suffix}`;
  }
  return `${preset.fileRank}-${preset.fileLabel}-${suffix}`;
}

function formatDifficultyScoreForFile(puzzle) {
  const score = getPuzzleResolutionScore(puzzle) || 0;
  return String(score).padStart(2, '0');
}

function buildBatchZipFileName(preset, count) {
  const suffix = String(count).padStart(2, '0');
  if (preset.mini4 || preset.mini6) {
    return `${preset.fileLabel}-${suffix}grilles.zip`;
  }
  return `${getBatchArchiveRank(preset)}-${preset.fileLabel}-${suffix}grilles.zip`;
}

function getBatchArchiveRank(preset) {
  if (preset.targetLevel === 'facile') {
    return preset.fileRank;
  }
  return preset.fileRank;
}

function exportPNG(showSolution) {
  if (!currentGrid) {
    statusMessage.textContent = 'Aucune grille à exporter. Générer d’abord une grille.';
    return;
  }
  const preset = difficultyPresets[currentDifficulty];
  const puzzle = {
    grid: currentGrid,
    solution: currentSolution,
    clues: currentClues,
    evaluatedDifficulty: currentEvaluatedDifficulty,
    width: currentGrid[0].length,
    height: currentGrid.length,
  };
  const filename = `${showSolution ? 'sol-' : ''}${buildPuzzleFileBaseName(preset, puzzle, 0, 2)}.png`;
  downloadPuzzlePNG(puzzle, showSolution, filename).then(() => {
    statusMessage.textContent = showSolution ? 'Solution exportée en PNG HD.' : 'Grille vierge exportée en PNG HD.';
  }).catch(() => {
    statusMessage.textContent = 'L’export a échoué. Réessayez.';
  });
}

function downloadPuzzlePNG(puzzle, showSolution, filename) {
  const blobPromise = renderPuzzleToBlob(puzzle, showSolution);
  return blobPromise.then((blob) => {
    if (!blob) {
      throw new Error('PNG export failed');
    }
    downloadBlob(blob, filename);
  });
}

function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function renderPuzzleToBlob(puzzle, showSolution) {
  const savedState = {
    grid: currentGrid,
    solution: currentSolution,
    clues: currentClues,
    player: playerGrid,
    noBulbs: noBulbCells,
    invalidBulbs: invalidBulbCells,
    invalidNumbers: invalidNumberedCells,
    completed: puzzleCompleted,
  };
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = puzzle.width * cellSize * exportScale;
  exportCanvas.height = puzzle.height * cellSize * exportScale;
  const exportCtx = exportCanvas.getContext('2d');
  currentGrid = puzzle.grid;
  currentSolution = puzzle.solution;
  currentClues = puzzle.clues;
  playerGrid = null;
  noBulbCells = new Set();
  invalidBulbCells = new Set();
  invalidNumberedCells = new Set();
  puzzleCompleted = false;
  drawOnContext(exportCtx, cellSize * exportScale, showSolution);
  currentGrid = savedState.grid;
  currentSolution = savedState.solution;
  currentClues = savedState.clues;
  playerGrid = savedState.player;
  noBulbCells = savedState.noBulbs;
  invalidBulbCells = savedState.invalidBulbs;
  invalidNumberedCells = savedState.invalidNumbers;
  puzzleCompleted = savedState.completed;
  return new Promise((resolve) => exportCanvas.toBlob(resolve, 'image/png'));
}

async function createZipBlob(entries) {
  const fileParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const data = new Uint8Array(await entry.blob.arrayBuffer());
    const nameBytes = encodeAscii(entry.name);
    const crc = crc32(data);
    const localHeader = createZipLocalHeader(nameBytes, data.length, crc);
    fileParts.push(localHeader, data);
    centralParts.push(createZipCentralHeader(nameBytes, data.length, crc, offset));
    offset += localHeader.length + data.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const centralOffset = offset;
  const endRecord = createZipEndRecord(entries.length, centralSize, centralOffset);
  return new Blob([...fileParts, ...centralParts, endRecord], { type: 'application/zip' });
}

function encodeAscii(value) {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function createZipLocalHeader(nameBytes, dataLength, crc) {
  const header = new Uint8Array(30 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, 0, true);
  setZipDateTime(view, 10);
  view.setUint32(14, crc, true);
  view.setUint32(18, dataLength, true);
  view.setUint32(22, dataLength, true);
  view.setUint16(26, nameBytes.length, true);
  header.set(nameBytes, 30);
  return header;
}

function createZipCentralHeader(nameBytes, dataLength, crc, offset) {
  const header = new Uint8Array(46 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  setZipDateTime(view, 12);
  view.setUint32(16, crc, true);
  view.setUint32(20, dataLength, true);
  view.setUint32(24, dataLength, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint32(42, offset, true);
  header.set(nameBytes, 46);
  return header;
}

function createZipEndRecord(entryCount, centralSize, centralOffset) {
  const record = new Uint8Array(22);
  const view = new DataView(record.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, entryCount, true);
  view.setUint16(10, entryCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  return record;
}

function setZipDateTime(view, offset) {
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | Math.floor(now.getSeconds() / 2);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  view.setUint16(offset, dosTime, true);
  view.setUint16(offset + 2, dosDate, true);
}

function crc32(data) {
  let crc = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ data[index]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const crc32Table = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function handleCanvasClick(event) {
  if (!currentGrid) {
    return;
  }
  if (event.button !== 0 && event.button !== 2) {
    return;
  }
  event.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width / cellSize);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height / cellSize);
  if (x < 0 || y < 0 || y >= currentGrid.length || x >= currentGrid[0].length) {
    return;
  }
  if (currentGrid[y][x] !== 0) {
    return;
  }
  const key = cellKey(x, y);
  if (playerGrid[y][x]) {
    playerGrid[y][x] = false;
  } else if (noBulbCells.has(key)) {
    noBulbCells.delete(key);
  } else if (event.button === 0) {
    playerGrid[y][x] = true;
  } else {
    noBulbCells.add(key);
  }
  validatePlayerGrid();
  renderGrid(false, true);
}

function validatePlayerGrid() {
  invalidBulbCells = new Set();
  invalidNumberedCells = new Set();
  if (!playerGrid) {
    return;
  }
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  noBulbCells = new Set(Array.from(noBulbCells).filter((key) => {
    const [x, y] = key.split(',').map(Number);
    return inCurrentGridBounds(x, y) && currentGrid[y][x] === 0 && !playerGrid[y][x];
  }));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!playerGrid[y][x]) {
        continue;
      }
      for (const { dx, dy } of directions) {
        let nx = x + dx;
        let ny = y + dy;
        while (nx >= 0 && ny >= 0 && nx < cols && ny < rows && currentGrid[ny][nx] === 0) {
          if (playerGrid[ny][nx]) {
            invalidBulbCells.add(cellKey(x, y));
            invalidBulbCells.add(cellKey(nx, ny));
          }
          nx += dx;
          ny += dy;
        }
      }
    }
  }

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (currentGrid[y][x] !== 1 || currentClues[y][x] === null) {
        continue;
      }
      const clue = currentClues[y][x];
      let bulbCount = 0;
      const adjacent = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
      for (const [nx, ny] of adjacent) {
        if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && playerGrid[ny][nx]) {
          bulbCount += 1;
        }
      }
      if (bulbCount > clue) {
        invalidNumberedCells.add(cellKey(x, y));
        for (const [nx, ny] of adjacent) {
          if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && playerGrid[ny][nx]) {
            invalidBulbCells.add(cellKey(nx, ny));
          }
        }
      }
    }
  }
  const solved = isPuzzleSolved();
  if (invalidBulbCells.size > 0 || invalidNumberedCells.size > 0) {
    statusMessage.textContent = 'Attention : conflit détecté ! Les erreurs sont surlignées en rouge.';
  } else if (solved) {
    statusMessage.textContent = 'Bravo, la grille est résolue !';
    if (!puzzleCompleted) {
      puzzleCompleted = true;
      startCompletionCelebration();
    }
  } else {
    statusMessage.textContent = 'Aucune erreur détectée pour l’instant. Continue.';
  }
}

function startCompletionCelebration() {
  if (celebrationUntil > performance.now()) {
    return;
  }
  celebrationUntil = performance.now() + celebrationDuration;
  animateCompletionCelebration();
}

function animateCompletionCelebration() {
  if (celebrationAnimating) {
    return;
  }
  celebrationAnimating = true;
  function tick() {
    renderGrid(false, true);
    if (performance.now() < celebrationUntil) {
      requestAnimationFrame(tick);
      return;
    }
    celebrationAnimating = false;
    renderGrid(false, true);
  }
  requestAnimationFrame(tick);
}

function isPuzzleSolved() {
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (currentGrid[y][x] === 0 && !isCellLitByBulbs(x, y, playerGrid)) {
        return false;
      }
      if (currentGrid[y][x] === 1 && currentClues[y][x] !== null) {
        const adjacent = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
        const bulbCount = adjacent.filter(([nx, ny]) => inCurrentGridBounds(nx, ny) && playerGrid[ny][nx]).length;
        if (bulbCount !== currentClues[y][x]) {
          return false;
        }
      }
    }
  }
  return true;
}

function getNeighbors(x, y, width, height) {
  const positions = [];
  if (x > 0) positions.push([x - 1, y]);
  if (x + 1 < width) positions.push([x + 1, y]);
  if (y > 0) positions.push([x, y - 1]);
  if (y + 1 < height) positions.push([x, y + 1]);
  return positions;
}

function verifyUniqueSolution(grid, clues, knownSolution) {
  const logicSolution = logicSolveAkari(grid, clues);
  if (!logicSolution || !areSolutionsEqual(logicSolution, knownSolution)) {
    return false;
  }
  return countAkariSolutions(grid, clues, 2, 1500) === 1;
}

function evaluatePuzzleDifficulty(grid, clues) {
  const stats = {};
  const logicSolution = logicSolveAkari(grid, clues, stats);
  if (!logicSolution) {
    return null;
  }
  const height = grid.length;
  const width = grid[0].length;
  const area = width * height;
  const visibleClues = countVisibleClues(clues);
  const histogram = getClueHistogram(clues);
  const nonSquarePenalty = Math.abs(width - height) * 1.5;
  const logicWeight = stats.iterations * 2
    + stats.singleSourceBulbs * 1.6
    + stats.clueBulbs * 1.2
    + stats.clueCrosses * 0.65
    + stats.forcedCrosses * 0.8
    + stats.indirectBulbs * 14
    + stats.indirectCrosses * 10;
  const sparseClueWeight = Math.max(0, area * 0.18 - visibleClues) * 5;
  const score = area + nonSquarePenalty + logicWeight + sparseClueWeight;
  let level = 'expert';
  if (score < 68) {
    level = 'decouverte';
  } else if (score < 88) {
    level = 'facile';
  } else if (score < 145) {
    level = 'intermediaire';
  } else if (score < 215) {
    level = 'difficile';
  } else if (score < 235) {
    level = 'expert';
  } else if (score < 330) {
    level = 'niveau6';
  } else if (score < 430) {
    level = 'niveau7';
  } else {
    level = 'niveau8';
  }
  return {
    level,
    label: difficultyPresets[level].label,
    score,
    stats,
    histogram,
  };
}

function countAkariSolutions(grid, clues, maxSolutions = 2, timeBudget = 1500) {
  const height = grid.length;
  const width = grid[0].length;
  const startTime = performance.now();
  let solutionCount = 0;

  const state = Array.from({ length: height }, (_, y) => Array.from({ length: width }, (_, x) => (grid[y][x] === 1 ? 'black' : 'unknown')));

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  function isWhite(x, y) {
    return inBounds(x, y) && grid[y][x] === 0;
  }

  function neighbors(x, y) {
    return [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].filter(([nx, ny]) => inBounds(nx, ny));
  }

  function lineOfSight(x, y) {
    const cells = [];
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && grid[ny][nx] === 0) {
        cells.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
    }
    return cells;
  }

  function isLit(board, x, y) {
    if (board[y][x] === 'bulb') {
      return true;
    }
    return lineOfSight(x, y).some(([nx, ny]) => board[ny][nx] === 'bulb');
  }

  function canBeBulb(board, x, y) {
    if (!isWhite(x, y) || board[y][x] !== 'unknown') {
      return false;
    }
    if (lineOfSight(x, y).some(([nx, ny]) => board[ny][nx] === 'bulb')) {
      return false;
    }
    const adjacentClues = neighbors(x, y).filter(([nx, ny]) => grid[ny][nx] === 1 && clues[ny][nx] !== null);
    return adjacentClues.every(([nx, ny]) => {
      const adjacentBulbs = neighbors(nx, ny).filter(([ax, ay]) => board[ay][ax] === 'bulb').length;
      return adjacentBulbs < clues[ny][nx];
    });
  }

  function placeBulb(board, x, y) {
    if (!canBeBulb(board, x, y)) {
      return false;
    }
    board[y][x] = 'bulb';
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (board[ny][nx] === 'bulb') {
        return false;
      }
      if (board[ny][nx] === 'unknown') {
        board[ny][nx] = 'no-bulb';
      }
    }
    return true;
  }

  function forbidBulb(board, x, y) {
    if (!isWhite(x, y)) {
      return true;
    }
    if (board[y][x] === 'bulb') {
      return false;
    }
    if (board[y][x] === 'unknown') {
      board[y][x] = 'no-bulb';
    }
    return true;
  }

  function possibleSources(board, x, y) {
    const sources = [];
    if (canBeBulb(board, x, y)) {
      sources.push([x, y]);
    }
    for (const [nx, ny] of lineOfSight(x, y)) {
      if (canBeBulb(board, nx, ny)) {
        sources.push([nx, ny]);
      }
    }
    return sources;
  }

  function propagate(board) {
    let changed = true;
    while (changed) {
      changed = false;

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (grid[y][x] !== 1 || clues[y][x] === null) {
            continue;
          }
          const clue = clues[y][x];
          const adjacent = neighbors(x, y).filter(([nx, ny]) => isWhite(nx, ny));
          const bulbCount = adjacent.filter(([nx, ny]) => board[ny][nx] === 'bulb').length;
          const candidates = adjacent.filter(([nx, ny]) => canBeBulb(board, nx, ny));
          if (bulbCount > clue || bulbCount + candidates.length < clue) {
            return false;
          }
          if (bulbCount === clue) {
            for (const [nx, ny] of adjacent) {
              if (board[ny][nx] === 'unknown') {
                if (!forbidBulb(board, nx, ny)) {
                  return false;
                }
                changed = true;
              }
            }
          } else if (bulbCount + candidates.length === clue) {
            for (const [nx, ny] of candidates) {
              if (!placeBulb(board, nx, ny)) {
                return false;
              }
              changed = true;
            }
          }
        }
      }

      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          if (!isWhite(x, y) || isLit(board, x, y)) {
            continue;
          }
          const sources = possibleSources(board, x, y);
          if (sources.length === 0) {
            return false;
          }
          if (sources.length === 1) {
            const [bx, by] = sources[0];
            if (!placeBulb(board, bx, by)) {
              return false;
            }
            changed = true;
          }
        }
      }
    }
    return true;
  }

  function isCompleteSolution(board) {
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (isWhite(x, y) && !isLit(board, x, y)) {
          return false;
        }
        if (grid[y][x] === 1 && clues[y][x] !== null) {
          const bulbCount = neighbors(x, y).filter(([nx, ny]) => board[ny][nx] === 'bulb').length;
          if (bulbCount !== clues[y][x]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function chooseBranch(board) {
    let bestCell = null;
    let bestSources = null;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (!isWhite(x, y) || isLit(board, x, y)) {
          continue;
        }
        const sources = possibleSources(board, x, y);
        if (!bestSources || sources.length < bestSources.length) {
          bestCell = [x, y];
          bestSources = sources;
        }
      }
    }
    if (bestSources) {
      return bestSources.map(([x, y]) => ({ x, y, value: 'bulb' }));
    }

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (canBeBulb(board, x, y)) {
          return [
            { x, y, value: 'no-bulb' },
            { x, y, value: 'bulb' },
          ];
        }
      }
    }
    return bestCell;
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function search(board) {
    if (solutionCount >= maxSolutions || performance.now() - startTime > timeBudget) {
      return;
    }
    if (!propagate(board)) {
      return;
    }
    const branchOptions = chooseBranch(board);
    if (!branchOptions) {
      if (isCompleteSolution(board)) {
        solutionCount += 1;
      }
      return;
    }
    for (const option of branchOptions) {
      const nextBoard = cloneBoard(board);
      const applied = option.value === 'bulb' ? placeBulb(nextBoard, option.x, option.y) : forbidBulb(nextBoard, option.x, option.y);
      if (applied) {
        search(nextBoard);
      }
      if (solutionCount >= maxSolutions) {
        return;
      }
    }
  }

  search(state);
  return solutionCount;
}

function giveHint() {
  if (!currentGrid || !playerGrid) {
    statusMessage.textContent = 'Aucune grille en cours. Générez d\'abord une grille.';
    return;
  }
  const step = findNextLogicalStep();
  if (!step) {
    statusMessage.textContent = 'Impossible de trouver un pas logique. La grille n\'est peut-être pas résoluble logiquement.';
    return;
  }
  const { x, y, type } = step;
  if (type === 'bulb') {
    noBulbCells.delete(cellKey(x, y));
    playerGrid[y][x] = true;
    validatePlayerGrid();
    renderGrid(false, true);
    statusMessage.textContent = `Indice : placer une ampoule à (${x + 1}, ${y + 1}).`;
  } else if (type === 'no-bulb') {
    playerGrid[y][x] = false;
    noBulbCells.add(cellKey(x, y));
    validatePlayerGrid();
    renderGrid(false, true);
    statusMessage.textContent = `Indice : aucune ampoule à (${x + 1}, ${y + 1}).`;
  }
}

function findNextLogicalStep() {
  if (!currentGrid || !currentClues) {
    return null;
  }
  const height = currentGrid.length;
  const width = currentGrid[0].length;
  const state = Array.from({ length: height }, () => Array.from({ length: width }, () => 'unknown'));

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (currentGrid[y][x] === 1) {
        state[y][x] = 'black';
      } else if (playerGrid[y][x]) {
        state[y][x] = 'bulb';
      } else if (noBulbCells.has(cellKey(x, y))) {
        state[y][x] = 'no-bulb';
      }
    }
  }

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  function isLit(x, y) {
    if (state[y][x] === 'bulb') {
      return true;
    }
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && currentGrid[ny][nx] === 0) {
        if (state[ny][nx] === 'bulb') {
          return true;
        }
        nx += dx;
        ny += dy;
      }
    }
    return false;
  }

  function canBeBulb(x, y) {
    if (currentGrid[y][x] !== 0 || state[y][x] === 'bulb' || state[y][x] === 'no-bulb') {
      return false;
    }
    for (const { dx, dy } of directions) {
      let nx = x + dx;
      let ny = y + dy;
      while (inBounds(nx, ny) && currentGrid[ny][nx] === 0) {
        if (state[ny][nx] === 'bulb') {
          return false;
        }
        nx += dx;
        ny += dy;
      }
    }
    return true;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (currentGrid[y][x] !== 0 || state[y][x] !== 'unknown') {
        continue;
      }
      if (!isLit(x, y) && !canBeBulb(x, y)) {
        return { x, y, type: 'no-bulb' };
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (currentGrid[y][x] !== 0 || isLit(x, y)) {
        continue;
      }
      const candidates = [];
      if (canBeBulb(x, y)) {
        candidates.push([x, y]);
      }
      for (const { dx, dy } of directions) {
        let nx = x + dx;
        let ny = y + dy;
        while (inBounds(nx, ny) && currentGrid[ny][nx] === 0) {
          if (canBeBulb(nx, ny)) {
            candidates.push([nx, ny]);
          }
          nx += dx;
          ny += dy;
        }
      }
      if (candidates.length === 1) {
        const [cx, cy] = candidates[0];
        return { x: cx, y: cy, type: 'bulb' };
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (currentGrid[y][x] !== 1 || currentClues[y][x] === null) {
        continue;
      }
      const clue = currentClues[y][x];
      const adjacent = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
      const bulbCount = adjacent.filter(([nx, ny]) => inBounds(nx, ny) && state[ny][nx] === 'bulb').length;
      const unknownCells = adjacent.filter(([nx, ny]) => inBounds(nx, ny) && currentGrid[ny][nx] === 0 && state[ny][nx] === 'unknown');
      if (bulbCount === clue && unknownCells.length > 0) {
        const [cx, cy] = unknownCells[0];
        return { x: cx, y: cy, type: 'no-bulb' };
      }
      if (bulbCount + unknownCells.length === clue && unknownCells.length > 0) {
        const [cx, cy] = unknownCells[0];
        return { x: cx, y: cy, type: 'bulb' };
      }
    }
  }

  return null;
}

window.addEventListener('DOMContentLoaded', init);
