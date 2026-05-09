const canvas = document.getElementById('akariCanvas');
const ctx = canvas.getContext('2d');
const difficultySelect = document.getElementById('difficultySelect');
const difficultyInfo = document.getElementById('difficultyInfo');
const difficultyScore = document.getElementById('difficultyScore');
const difficultyDetails = document.getElementById('difficultyDetails');
const logicalScoreValue = document.getElementById('logicalScoreValue');
const perceivedScoreValue = document.getElementById('perceivedScoreValue');
const finalScoreValue = document.getElementById('finalScoreValue');
const difficultyLevelValue = document.getElementById('difficultyLevelValue');
const difficultySizeValue = document.getElementById('difficultySizeValue');
const blackCellCountValue = document.getElementById('blackCellCountValue');
const whiteCellCountValue = document.getElementById('whiteCellCountValue');
const clueCountValue = document.getElementById('clueCountValue');
const solveStepCountValue = document.getElementById('solveStepCountValue');
const resolverToggle = document.getElementById('resolverToggle');
const generatorPanel = document.getElementById('generatorPanel');
const resolverPanel = document.getElementById('resolverPanel');
const customSizeControls = document.getElementById('customSizeControls');
const customWidthInput = document.getElementById('customWidthInput');
const customHeightInput = document.getElementById('customHeightInput');
const batchCountInput = document.getElementById('batchCountInput');
const batchSizeFilterInput = document.getElementById('batchSizeFilterInput');
const batchSortSelect = document.getElementById('batchSortSelect');
const resolverWidthInput = document.getElementById('resolverWidthInput');
const resolverHeightInput = document.getElementById('resolverHeightInput');
const applyResolverSizeButton = document.getElementById('applyResolverSizeButton');
const resolverToolButtons = Array.from(document.querySelectorAll('.resolver-tool-button'));
const generateButton = document.getElementById('generateButton');
const batchGenerateButton = document.getElementById('batchGenerateButton');
let cancelGenerationButton = document.getElementById('cancelGenerationButton');
const generatorButtonRow = document.getElementById('generatorButtonRow');
const resolverActionRow = document.getElementById('resolverActionRow');
const solveResolverButton = document.getElementById('solveResolverButton');
const printButton = document.getElementById('printButton');
const hintButton = document.getElementById('hintButton');
const exportBlankButton = document.getElementById('exportBlankButton');
const exportSolutionButton = document.getElementById('exportSolutionButton');
const exportCompletedButton = document.getElementById('exportCompletedButton');
const helperText = document.getElementById('helperText');
const statusMessage = document.getElementById('statusMessage');

const difficultyPresets = {
  mini4: { label: '4x4', fileLabel: '4x4', fileRank: 9, sizes: [4], count: 12, density: 0.31, targetLevel: 'mini4', mini4: true, blackCells: 5, minSolutionBulbs: 3, maxSolutionBulbs: 5, minClueTypes: 2, maxZeroClues: 3, maxHighClues: 2, maxFourClues: 1, maxIndirectSteps: 1, minMiniScore: 22, maxMiniScore: 42 },
  mini6: { label: '6x6', fileLabel: '6x6', fileRank: 10, sizes: [6], count: 24, density: 0.32, targetLevel: 'mini6', mini6: true, minBlackCells: 10, maxBlackCells: 13, minVisibleClues: 9, maxVisibleClues: 12, minSolutionBulbs: 6, maxSolutionBulbs: 11, minClueTypes: 3, maxZeroClues: 5, maxHighClues: 5, maxFourClues: 1, maxIndirectSteps: 3, maxLogicIterations: 8 },
  mini8: { label: '8x8', fileLabel: '8x8', fileRank: 11, sizes: [8], count: 48, density: 0.30, targetLevel: 'mini8', mini8: true, minBlackCells: 15, maxBlackCells: 20, minVisibleClues: 12, maxVisibleClues: 18, minSolutionBulbs: 12, maxSolutionBulbs: 19, minClueTypes: 3, maxZeroClues: 7, maxHighClues: 8, maxFourClues: 3, maxIndirectSteps: 6, maxLogicIterations: 11 },
  mini10: { label: '10x10', fileLabel: '10x10', fileRank: 12, sizes: [10], count: 60, density: 0.24, targetLevel: 'mini10', mini10: true, sizeOnly: true, scoreNamed: true, maxAttempts: 170, solveBudget: 2600, minBlackCells: 18, maxBlackCells: 27, minVisibleClues: 16, maxVisibleClues: 28, minSolutionBulbs: 19, maxSolutionBulbs: 28, minClueTypes: 4, maxZeroClues: 10, maxHighClues: 12, maxFourClues: 4, minIndirectSteps: 1, maxIndirectSteps: 10, maxLogicIterations: 16, highClueSeeds: 2, minHighClues: 2 },
  mini20: { label: '20x20', fileLabel: '20x20', fileRank: 13, sizes: [20], count: 60, density: 0.24, targetLevel: 'niveau8', mini20: true, sizeOnly: true, scoreNamed: true, maxAttempts: 180, solveBudget: 6000, minClueTypes: 4, minHighClues: 4, maxZeroClues: 40, minIndirectSteps: 2, highClueSeeds: 5 },
  decouverte: { label: 'Apprenti', fileLabel: 'Apprenti', fileRank: 1, sizes: [7], count: 30, density: 0.30, targetLevel: 'decouverte', minClueTypes: 2 },
  facile: { label: 'Novice', fileLabel: 'Novice', fileRank: 2, sizes: [7], count: 40, density: 0.22, targetLevel: 'facile', clueKeepRate: 0.55, maxVisibleClues: 8, minClueTypes: 3 },
  intermediaire: { label: 'InitiÃ©', fileLabel: 'Initie', fileRank: 3, sizes: [8, 10], count: 50, density: 0.24, targetLevel: 'intermediaire', minClueTypes: 3, minHighClues: 1, highClueSeeds: 1 },
  difficile: { label: 'Disciple', fileLabel: 'Disciple', fileRank: 4, sizes: [10, 12], count: 50, density: 0.24, targetLevel: 'difficile', minClueTypes: 4, minHighClues: 2, highClueSeeds: 2 },
  expert: { label: 'StratÃ¨ge', fileLabel: 'Stratege', fileRank: 5, sizes: [12, 15], count: 30, density: 0.24, targetLevel: 'expert', minClueTypes: 4, minHighClues: 3, highClueSeeds: 3 },
  niveau6: { label: 'Sensei', fileLabel: 'Sensei', fileRank: 6, sizes: [12], count: 20, density: 0.23, targetLevel: 'niveau6', gameLevel: true, minClueTypes: 4, minHighClues: 2, minIndirectSteps: 1, minHardnessScore: 30, maxZeroClues: 12, maxEasyClueRatio: 0.74, highClueSeeds: 2 },
  niveau7: { label: 'MaÃ®tre', fileLabel: 'Maitre', fileRank: 7, sizes: [13, 14], count: 20, density: 0.24, targetLevel: 'niveau7', gameLevel: true, minClueTypes: 4, minHighClues: 2, minIndirectSteps: 1, minHardnessScore: 36, maxZeroClues: 12, maxEasyClueRatio: 0.72, highClueSeeds: 3 },
  niveau8: { label: 'Grand MaÃ®tre', fileLabel: 'GrandMaitre', fileRank: 8, sizes: [15], count: 20, density: 0.25, targetLevel: 'niveau8', gameLevel: true, minClueTypes: 4, minHighClues: 2, minIndirectSteps: 1, minHardnessScore: 42, maxZeroClues: 12, maxEasyClueRatio: 0.70, highClueSeeds: 4 },
  personnalise: { label: 'PersonnalisÃ©', fileLabel: 'Personnalise', fileRank: 0, count: 1, density: 0.24, custom: true },
};

const DIFFICULTY_WEIGHTS = {
  final: {
    logical: 0.7,
    perceived: 0.3,
  },
  logical: {
    depth: 0.30,
    constraints: 0.20,
    propagation: 0.25,
    ambiguity: 0.20,
    clueDensity: 0.05,
  },
  perceived: {
    size: 0.40,
    whiteCells: 0.20,
    openSpaces: 0.20,
    fragmentation: 0.10,
    visualDensity: 0.10,
  },
  sizeScale: [
    { size: 4, score: 5 },
    { size: 6, score: 20 },
    { size: 8, score: 40 },
    { size: 10, score: 60 },
    { size: 12, score: 75 },
    { size: 14, score: 85 },
    { size: 16, score: 92 },
    { size: 18, score: 100 },
    { size: 20, score: 100 },
  ],
  levels: [
    { max: 20, label: 'Tres facile' },
    { max: 40, label: 'Facile' },
    { max: 60, label: 'Moyen' },
    { max: 80, label: 'Difficile' },
    { max: 100, label: 'Expert' },
  ],
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
let appMode = 'generator';
let puzzleCompleted = false;
let completionOverlayDismissed = false;
let celebrationUntil = 0;
let celebrationAnimating = false;
let resolverTool = 'black';
let generationCancelled = false;
const cellSize = 64;
const celebrationDuration = 4200;
const EXPORT_DPI = 300;
const MM_PER_INCH = 25.4;
const PIXELS_PER_METER_AT_300_DPI = Math.round(EXPORT_DPI / MM_PER_INCH * 1000);
const SUPPORTED_EXPORT_SIZES = [4, 6, 8, 10, 12, 14, 16, 18, 20];
const PUZZLE_EXPORT_CONFIG = {
  4: { mm: 80 },
  6: { mm: 80 },
  8: { mm: 125 },
  10: { mm: 145 },
  12: { mm: 160 },
  14: { mm: 175 },
  16: { mm: 185 },
  18: { mm: 195 },
  20: { mm: 205 },
};
const SOLUTION_EXPORT_CONFIG = {
  4: { mm: 40, perPage: 6 },
  6: { mm: 45, perPage: 6 },
  8: { mm: 55, perPage: 4 },
  10: { mm: 60, perPage: 4 },
  12: { mm: 65, perPage: 4 },
  14: { mm: 70, perPage: 4 },
  16: { mm: 75, perPage: 4 },
  18: { mm: 80, perPage: 4 },
  20: { mm: 85, perPage: 4 },
};
const EXPORT_STYLE_CONFIG = {
  background: '#ffffff',
  lightGray: '#b5b5b5',
  gridLineColor: '#000000',
  clueCellColor: '#000000',
  clueTextColor: '#ffffff',
  crossColor: '#000000',
  invalidColor: '#000000',
  paddingRatio: {
    puzzle: 0.055,
    solution: 0.08,
    completed: 0.055,
  },
  gridLineRatio: {
    screen: 0.012,
    puzzle: 0.04,
    solution: 0.048,
    completed: 0.04,
  },
  clueFontRatio: {
    screen: 0.45,
    puzzle: 0.5,
    solution: 0.52,
    completed: 0.5,
  },
  blackInsetRatio: {
    screen: 0.03,
    puzzle: 0.04,
    solution: 0.05,
    completed: 0.04,
  },
  bulbRadiusRatio: {
    puzzle: 0.26,
    solution: 0.31,
    completed: 0.26,
    screen: 0.26,
  },
  crossPaddingRatio: {
    screen: 0.33,
    puzzle: 0.3,
    solution: 0.28,
    completed: 0.3,
  },
  crossStrokeRatio: {
    screen: 0.045,
    puzzle: 0.06,
    solution: 0.07,
    completed: 0.06,
  },
  invalidBulbStrokeRatio: {
    screen: 0.05,
    puzzle: 0.06,
    solution: 0.07,
    completed: 0.06,
  },
  minPaddingPx: 10,
  minGridLinePx: 1,
  minExportGridLinePx: 2,
  minCrossStrokePx: 2,
  minExportCrossStrokePx: 3,
  minClueFontPx: 14,
};
const directions = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

function init() {
  configureBatchKdpUI();
  updateModeUI();
  updateDifficultyInfo();
  attachEvents();
  generatePuzzle();
}

function attachEvents() {
  resolverToggle.addEventListener('change', handleResolverToggle);
  difficultySelect.addEventListener('change', () => {
    currentDifficulty = difficultySelect.value;
    updateDifficultyInfo();
  });

  customWidthInput.addEventListener('input', updateDifficultyInfo);
  customHeightInput.addEventListener('input', updateDifficultyInfo);
  batchCountInput.addEventListener('input', updateBatchButtonLabel);
  resolverWidthInput.addEventListener('input', updateDifficultyInfo);
  resolverHeightInput.addEventListener('input', updateDifficultyInfo);
  applyResolverSizeButton.addEventListener('click', () => applyResolverSize());
  solveResolverButton.addEventListener('click', solveResolverPuzzle);
  printButton.addEventListener('click', printCurrentGrid);
  resolverToolButtons.forEach((button) => {
    button.addEventListener('click', () => setResolverTool(button.dataset.tool));
  });

  canvas.addEventListener('mousedown', handleCanvasClick);
  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  hintButton.addEventListener('click', giveHint);
  generateButton.addEventListener('click', () => generatePuzzle());
  batchGenerateButton.addEventListener('click', () => generateBatchFiles());
  cancelGenerationButton?.addEventListener('click', cancelCurrentGeneration);
  exportBlankButton.addEventListener('click', () => exportPNG(false));
  exportSolutionButton.addEventListener('click', () => exportPNG(true));
  exportCompletedButton.addEventListener('click', exportCompletedPNG);
}

function configureBatchKdpUI() {
  const headerTitle = document.querySelector('header h1');
  const headerDescription = document.querySelector('header p');
  const difficultyLabel = document.querySelector('label[for="difficultySelect"]');
  const batchCountLabel = document.querySelector('label[for="batchCountInput"]');
  const resolverSizeLabel = document.querySelector('label[for="resolverWidthInput"]');
  const exportHelper = document.querySelector('.export-helper');
  const completedButton = document.getElementById('exportCompletedButton');
  const generatorStatus = document.getElementById('statusMessage');
  const hintLabel = document.getElementById('hintButton');
  const solveLabel = document.getElementById('solveResolverButton');

  if (headerTitle) {
    headerTitle.textContent = 'Générateur de grilles Akari';
  }
  if (headerDescription) {
    headerDescription.textContent = 'Génère une grille Light Up / Akari prête à être résolue par logique, comme un démineur, puis exporte la version vierge ou la version solution en PNG HD.';
  }
  if (difficultyLabel) {
    difficultyLabel.textContent = 'Niveau de difficulté';
  }
  if (batchCountLabel) {
    batchCountLabel.textContent = 'Nombre de grilles à générer';
  }
  if (resolverSizeLabel) {
    resolverSizeLabel.textContent = 'Taille de la grille';
  }
  if (hintLabel) {
    hintLabel.textContent = 'Indice (pas à pas)';
  }
  if (solveLabel) {
    solveLabel.textContent = 'Résoudre';
  }
  if (completedButton) {
    completedButton.textContent = 'Exporter état courant N&B';
  }

  if (!cancelGenerationButton && generatorButtonRow) {
    cancelGenerationButton = document.createElement('button');
    cancelGenerationButton.id = 'cancelGenerationButton';
    cancelGenerationButton.className = 'danger';
    cancelGenerationButton.hidden = true;
    cancelGenerationButton.textContent = 'Annuler';
    generatorButtonRow.insertBefore(cancelGenerationButton, hintButton);
  }

  batchSizeFilterInput?.closest('.control-row')?.setAttribute('hidden', '');
  batchSortSelect?.closest('.control-row')?.setAttribute('hidden', '');
  if (exportHelper) {
    exportHelper.textContent = 'Export KDP : la taille est déduite du niveau choisi. Le lot ZIP contient les grilles et leurs solutions, déjà dimensionnées pour InDesign.';
  }
  if (generatorStatus) {
    generatorStatus.textContent = 'Cliquez sur « Générer une grille » pour commencer.';
  }
}

function setCancelGenerationVisible(visible) {
  if (!cancelGenerationButton) {
    return;
  }
  cancelGenerationButton.hidden = !visible;
  cancelGenerationButton.disabled = !visible;
}

function cancelCurrentGeneration() {
  generationCancelled = true;
  generationId += 1;
  if (cancelGenerationButton) {
    cancelGenerationButton.disabled = true;
  }
  statusMessage.textContent = 'Annulation en cours...';
}

function isGenerationCancelled(activeGeneration) {
  return generationCancelled || activeGeneration !== generationId;
}

function updateDifficultyInfo() {
  if (isResolverMode()) {
    const width = clampInteger(resolverWidthInput.value, 4, 20, 8);
    const height = clampInteger(resolverHeightInput.value, 4, 20, 8);
    difficultyInfo.textContent = `Mode resolver : ${width}x${height} - saisie manuelle des cases noires et indices`;
    difficultyScore.textContent = currentSolution
      ? 'Score de difficulté : grille manuelle résolue'
      : 'Score de difficulté : grille manuelle';
    resetDifficultyDetails();
    return;
  }
  const preset = difficultyPresets[currentDifficulty];
  customSizeControls.hidden = !preset.custom;
  updateBatchButtonLabel();
  updateDifficultyScore(null);
  resetDifficultyDetails();
  if (preset.custom) {
    const { width, height } = getCustomDimensions();
    difficultyInfo.textContent = `Format : ${width}x${height} - difficulté évaluée après génération`;
    return;
  }
  if (preset.mini4) {
    difficultyInfo.textContent = 'Format : 4x4 - 5 indices numérotés - minimum 3 à 5 ampoules - analyse logique directe/indirecte';
    return;
  }
  if (preset.mini6) {
    difficultyInfo.textContent = 'Format : 6x6 - 9 à 12 indices visibles - minimum 6 à 11 ampoules - analyse logique directe/indirecte';
    return;
  }
  if (preset.mini8) {
    difficultyInfo.textContent = 'Format : 8x8 - 12 à 18 indices visibles - minimum 12 à 19 ampoules - analyse logique directe/indirecte';
    return;
  }
  if (preset.mini10) {
    difficultyInfo.textContent = 'Format : 10x10 - grille KDP intermédiaire - solution unique validée par solveur - analyse logique pondérée';
    return;
  }
  if (preset.mini20) {
    difficultyInfo.textContent = 'Format : 20x20 - grand plateau logique - solution unique validée par solveur - génération renforcée';
    return;
  }
  const formattedSizes = preset.sizes.length > 1 ? preset.sizes.map((size) => `${size}x${size}`).join(' / ') : `${preset.sizes[0]}x${preset.sizes[0]}`;
  difficultyInfo.textContent = `Formats : ${formattedSizes} - niveau validé par le solveur - ${preset.count} grilles recommandées`;
}

function isResolverMode() {
  return appMode === 'resolver';
}

function updateModeUI() {
  const resolver = isResolverMode();
  generatorPanel.hidden = resolver;
  generatorButtonRow.hidden = resolver;
  resolverPanel.hidden = !resolver;
  resolverActionRow.hidden = !resolver;
  helperText.textContent = resolver
    ? 'Cliquez pour poser l’outil sélectionné. Un clic sur la même case l’efface. Clic droit : effacer la case.'
    : 'Clic gauche : poser une ampoule. Clic droit : poser une croix. Un clic sur une case déjà marquée l’efface.';
  updateResolverToolButtons();
}

function handleResolverToggle() {
  appMode = resolverToggle.checked ? 'resolver' : 'generator';
  updateModeUI();
  updateDifficultyInfo();
  if (isResolverMode()) {
    applyResolverSize(true);
    statusMessage.textContent = 'Mode resolver activé. Saisis la taille, pose les cases noires, puis clique sur « Résoudre ».';
    return;
  }
  statusMessage.textContent = 'Retour au mode génération.';
  generatePuzzle();
}

function getCustomDimensions() {
  return {
    width: clampInteger(customWidthInput.value, 5, 20, 10),
    height: clampInteger(customHeightInput.value, 5, 20, 10),
  };
}

function getResolverDimensions() {
  return {
    width: clampInteger(resolverWidthInput.value, 4, 20, 8),
    height: clampInteger(resolverHeightInput.value, 4, 20, 8),
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

function mmToPixels(mm) {
  return Math.round((mm / MM_PER_INCH) * EXPORT_DPI);
}

function getClosestSupportedExportSize(size) {
  return SUPPORTED_EXPORT_SIZES.reduce((closest, candidate) => {
    return Math.abs(candidate - size) < Math.abs(closest - size) ? candidate : closest;
  }, SUPPORTED_EXPORT_SIZES[0]);
}

function getExportSizeKey(width, height) {
  return getClosestSupportedExportSize(Math.max(width, height));
}

function parseBatchSizeFilter() {
  const rawValue = (batchSizeFilterInput.value || '').trim();
  if (!rawValue) {
    return getDefaultBatchSizes();
  }

  const parsed = rawValue
    .split(/[^0-9]+/)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isInteger(value) && SUPPORTED_EXPORT_SIZES.includes(value));

  if (parsed.length === 0) {
    return getDefaultBatchSizes();
  }

  return Array.from(new Set(parsed)).sort((a, b) => a - b);
}

function getDefaultBatchSizes() {
  if (isResolverMode()) {
    const { width, height } = getResolverDimensions();
    return [getExportSizeKey(width, height)];
  }

  const preset = difficultyPresets[currentDifficulty];
  if (preset.custom) {
    const { width, height } = getCustomDimensions();
    return [getExportSizeKey(width, height)];
  }

  if (Array.isArray(preset.sizes) && preset.sizes.length > 0) {
    return Array.from(new Set(preset.sizes.map((size) => getClosestSupportedExportSize(size)))).sort((a, b) => a - b);
  }

  return [4];
}

function getBatchSortMode() {
  return batchSortSelect.value || 'difficulty-desc';
}

function getExportConfigForSize(size, variant) {
  const resolvedSize = getClosestSupportedExportSize(size);
  const configMap = variant === 'solution' ? SOLUTION_EXPORT_CONFIG : PUZZLE_EXPORT_CONFIG;
  return { size: resolvedSize, ...configMap[resolvedSize] };
}

function getBatchGenerationPreset(size) {
  if (size === 4) {
    return difficultyPresets.mini4;
  }
  if (size === 6) {
    return difficultyPresets.mini6;
  }
  if (size === 8) {
    return difficultyPresets.mini8;
  }
  if (size === 10) {
    return difficultyPresets.mini10;
  }
  if (size === 20) {
    return difficultyPresets.mini20;
  }

  return {
    label: `${size}x${size}`,
    fileLabel: `${size}x${size}`,
    fileRank: size,
    sizes: [size],
    count: 1,
    density: size >= 16 ? 0.24 : 0.25,
    targetLevel: `export-${size}`,
    sizeOnly: true,
    scoreNamed: true,
    solveBudget: Math.max(900, size * size * 22),
    maxAttempts: Math.max(120, size * 9),
    minClueTypes: size >= 12 ? 4 : 3,
    minHighClues: size >= 12 ? 2 : size >= 10 ? 1 : 0,
    maxZeroClues: Math.max(4, Math.round(size * 2.1)),
    minIndirectSteps: size >= 12 ? 1 : 0,
    highClueSeeds: size >= 14 ? 2 : size >= 10 ? 1 : 0,
  };
}

function buildBatchPlan() {
  const countPerSize = getBatchCount();
  return parseBatchSizeFilter().map((size) => ({
    size,
    count: countPerSize,
    preset: getBatchGenerationPreset(size),
  }));
}

function createEmptyPlayerGrid(width, height) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => false));
}

function resetPuzzleState(width, height) {
  playerGrid = createEmptyPlayerGrid(width, height);
  noBulbCells = new Set();
  invalidBulbCells = new Set();
  invalidNumberedCells = new Set();
  puzzleCompleted = false;
  completionOverlayDismissed = false;
  celebrationUntil = 0;
}

function setResolverTool(tool) {
  resolverTool = tool;
  updateResolverToolButtons();
}

function updateResolverToolButtons() {
  resolverToolButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tool === resolverTool);
  });
}

function applyResolverSize(silent = false) {
  const { width, height } = getResolverDimensions();
  currentGrid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
  currentClues = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
  currentSolution = null;
  currentEvaluatedDifficulty = null;
  resetPuzzleState(width, height);
  renderGrid(false, false);
  updateDifficultyInfo();
  if (!silent) {
    statusMessage.textContent = `Grille resolver ${width}Ã—${height} prÃªte Ã  Ãªtre saisie.`;
  }
}

function clearResolverSolutionState() {
  currentSolution = null;
  currentEvaluatedDifficulty = null;
  if (currentGrid) {
    resetPuzzleState(currentGrid[0].length, currentGrid.length);
  }
}

function setResolverCell(x, y, tool) {
  const nextClue = tool === 'black' ? null : Number(tool);
  const isSameValue = currentGrid[y][x] === 1 && currentClues[y][x] === nextClue;
  if (isSameValue) {
    currentGrid[y][x] = 0;
    currentClues[y][x] = null;
    return;
  }
  currentGrid[y][x] = 1;
  currentClues[y][x] = nextClue;
}

function clearResolverCell(x, y) {
  currentGrid[y][x] = 0;
  currentClues[y][x] = null;
}

function updateBatchButtonLabel() {
  const count = getBatchCount();
  batchGenerateButton.textContent = `GÃ©nÃ©rer ${count} grille${count > 1 ? 's' : ''} + solution${count > 1 ? 's' : ''}`;
}

function updateBatchButtonLabel() {
  const count = getBatchCount();
  const sizes = parseBatchSizeFilter();
  const sizeLabel = sizes.length === 1
    ? `${sizes[0]}x${sizes[0]}`
    : `${sizes.length} tailles`;
  batchGenerateButton.textContent = `Generer ${count} lot${count > 1 ? 's' : ''} par taille (${sizeLabel})`;
}

async function generatePuzzle(options = {}) {
  const statusPrefix = options.statusPrefix || '';
  const withPrefix = (message) => statusPrefix ? `${statusPrefix} ${message}` : message;
  const activeGeneration = generationId + 1;
  generationId = activeGeneration;
  generationCancelled = false;
  setControlsDisabled(true);
  setCancelGenerationVisible(true);
  statusMessage.textContent = withPrefix('Génération en cours...');
  updateDifficultyScore(null);
  let failureCount = 0;

  try {
    const preset = difficultyPresets[currentDifficulty];
    while (!isGenerationCancelled(activeGeneration)) {
      await waitForPaint();
      if (isGenerationCancelled(activeGeneration)) {
        break;
      }

      const puzzle = await generatePuzzleData(preset, activeGeneration);
      if (isGenerationCancelled(activeGeneration)) {
        break;
      }

      if (puzzle) {
        setCurrentPuzzle(puzzle);
        renderGrid(false, true);
        updateDifficultyScore(puzzle);
        statusMessage.textContent = withPrefix(formatGenerationSuccessMessage(preset, puzzle));
        return;
      }

      failureCount += 1;
      clearCurrentPuzzle();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      statusMessage.textContent = withPrefix(`Échec ${failureCount} : impossible de générer une grille logique pour ces critères. Nouvelle tentative...`);
    }

    statusMessage.textContent = failureCount > 0
      ? `Génération annulée après ${failureCount} échec${failureCount > 1 ? 's' : ''}.`
      : 'Génération annulée.';
  } finally {
    setCancelGenerationVisible(false);
    setControlsDisabled(false);
  }
}

async function generatePuzzleData(preset, activeGeneration = generationId) {
  if (preset.mini4) {
    return generateMini4PuzzleData(preset, activeGeneration);
  }
  if (preset.mini6) {
    return generateMini6PuzzleData(preset, activeGeneration);
  }
  if (preset.mini8) {
    return generateMini8PuzzleData(preset, activeGeneration);
  }
  const needsMoreAttempts = preset.clueKeepRate || preset.gameLevel || preset.targetLevel === 'decouverte';
  const maxAttempts = preset.maxAttempts || (preset.custom ? 80 : preset.gameLevel ? 45 : needsMoreAttempts ? 220 : 120);
  const solveBudget = preset.solveBudget || 500;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (isGenerationCancelled(activeGeneration)) {
      return null;
    }
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

async function generateMini4PuzzleData(preset, activeGeneration = generationId) {
  const targetMinimum = pickMini4TargetMinimum(preset);
  const maxAttempts = 1600;
  let fallbackCandidate = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (isGenerationCancelled(activeGeneration)) {
      return null;
    }
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
    label = 'serrÃ©e';
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
    return `Grille gÃ©nÃ©rÃ©e (4x4 - ${puzzle.width}Ã—${puzzle.height}), rÃ©soluble par logique.`;
  }
  const indirectText = analysis.indirectSteps === 0
    ? 'aucun coup indirect'
    : `${analysis.indirectSteps} coup${analysis.indirectSteps > 1 ? 's' : ''} indirect${analysis.indirectSteps > 1 ? 's' : ''}`;
  const score = getPuzzleResolutionScore(puzzle);
  return `Grille gÃ©nÃ©rÃ©e (4x4 - minimum ${analysis.minimumBulbs} ampoules, difficultÃ© ${score}/100). Analyse ${analysis.label} : ${indirectText}, ${analysis.directSteps} dÃ©duction${analysis.directSteps > 1 ? 's' : ''} directe${analysis.directSteps > 1 ? 's' : ''}.`;
}

function countBlackCells(grid) {
  return grid.reduce((sum, row) => sum + row.filter((value) => value === 1).length, 0);
}

function countWhiteCells(grid) {
  return grid.reduce((sum, row) => sum + row.filter((value) => value === 0).length, 0);
}

function countSolutionBulbs(solution) {
  return solution.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
}

function getIndirectStepCount(stats = {}) {
  return (stats.indirectBulbs || 0) + (stats.indirectCrosses || 0);
}

function clampDifficultyScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function weightedDifficultyScore(weightMap, scoreMap) {
  return Object.entries(weightMap).reduce((sum, [key, weight]) => sum + ((scoreMap[key] || 0) * weight), 0);
}

function computeGuidedPuzzleDiscount(metrics) {
  const {
    width,
    height,
    clueDensity,
    constraintCoverage,
    averageCandidateWidth,
    indirectSteps,
    assumptionSteps,
    highClues,
    zeroClues,
  } = metrics;

  const sizeFactor = Math.max(0, Math.min(1, (Math.max(width, height) - 6) / 6));
  const densityFactor = Math.max(0, Math.min(1, (clueDensity - 0.68) / 0.32));
  const coverageFactor = Math.max(0, Math.min(1, (constraintCoverage - 0.42) / 0.4));
  const ambiguityRelief = Math.max(0, Math.min(1, (2.5 - averageCandidateWidth) / 1.5));
  const directnessFactor = indirectSteps === 0 && assumptionSteps === 0
    ? 1
    : Math.max(0, 1 - ((indirectSteps + assumptionSteps) / 4));
  const clueSupportFactor = Math.max(0, Math.min(1, (highClues + zeroClues) / 10));

  return clampDifficultyScore(
    22
    * sizeFactor
    * directnessFactor
    * (
      densityFactor * 0.35
      + coverageFactor * 0.35
      + ambiguityRelief * 0.2
      + clueSupportFactor * 0.1
    ),
  );
}

function average(numbers) {
  if (!numbers.length) {
    return 0;
  }
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function interpolateRangeScore(value, minValue, maxValue) {
  if (maxValue <= minValue) {
    return clampDifficultyScore(value >= maxValue ? 100 : 0);
  }
  const normalized = ((value - minValue) / (maxValue - minValue)) * 100;
  return clampDifficultyScore(normalized);
}

function interpolateSizeScore(width, height) {
  const referenceSize = Math.sqrt(width * height);
  const table = DIFFICULTY_WEIGHTS.sizeScale;
  if (referenceSize <= table[0].size) {
    return table[0].score;
  }
  for (let index = 1; index < table.length; index += 1) {
    const previous = table[index - 1];
    const current = table[index];
    if (referenceSize <= current.size) {
      const ratio = (referenceSize - previous.size) / (current.size - previous.size);
      return clampDifficultyScore(previous.score + (current.score - previous.score) * ratio);
    }
  }
  return table[table.length - 1].score;
}

function getDifficultyBandLabel(score) {
  for (const band of DIFFICULTY_WEIGHTS.levels) {
    if (score <= band.max) {
      return band.label;
    }
  }
  return DIFFICULTY_WEIGHTS.levels[DIFFICULTY_WEIGHTS.levels.length - 1].label;
}

function resetDifficultyDetails() {
  if (!difficultyDetails) {
    return;
  }
  difficultyDetails.hidden = true;
  logicalScoreValue.textContent = '--/100';
  perceivedScoreValue.textContent = '--/100';
  finalScoreValue.textContent = '--/100';
  difficultyLevelValue.textContent = '--';
  difficultySizeValue.textContent = '--';
  blackCellCountValue.textContent = '--';
  whiteCellCountValue.textContent = '--';
  clueCountValue.textContent = '--';
  solveStepCountValue.textContent = '--';
}

function renderDifficultyDetails(puzzle) {
  if (!difficultyDetails) {
    return;
  }
  const evaluation = puzzle?.evaluatedDifficulty;
  if (!evaluation) {
    resetDifficultyDetails();
    return;
  }
  difficultyDetails.hidden = false;
  logicalScoreValue.textContent = `${evaluation.logicalScore}/100`;
  perceivedScoreValue.textContent = `${evaluation.perceivedScore}/100`;
  finalScoreValue.textContent = `${evaluation.finalScore}/100`;
  difficultyLevelValue.textContent = evaluation.displayLevel;
  difficultySizeValue.textContent = evaluation.sizeLabel;
  blackCellCountValue.textContent = String(evaluation.blackCells);
  whiteCellCountValue.textContent = String(evaluation.whiteCells);
  clueCountValue.textContent = String(evaluation.clueCount);
  solveStepCountValue.textContent = String(evaluation.resolutionSteps);
}

function normalizeResolutionScore(relativeScore, low, high) {
  const normalized = ((relativeScore - low) / (high - low)) * 99 + 1;
  return Math.min(100, Math.max(1, Math.round(normalized)));
}

function getPuzzleResolutionScore(puzzle) {
  return puzzle?.evaluatedDifficulty?.finalScore || puzzle?.evaluatedDifficulty?.resolutionScore || null;
}

function formatGenerationSuccessMessage(puzzle) {
  const sizeLabel = `${puzzle.width}x${puzzle.height}`;
  const score = getPuzzleResolutionScore(puzzle);
  if (score) {
    return `Grille générée (${sizeLabel}, difficulté ${score}/100).`;
  }
  return `Grille générée (${sizeLabel}).`;
}

function updateDifficultyScore(puzzle) {
  if (!difficultyScore) {
    return;
  }
  const score = getPuzzleResolutionScore(puzzle);
  difficultyScore.textContent = score
    ? `Score de difficultÃ© : ${score}/100`
    : 'Score de difficultÃ© : --/100';
  if (puzzle?.evaluatedDifficulty) {
    renderDifficultyDetails(puzzle);
  } else {
    resetDifficultyDetails();
  }
}

async function generateMini6PuzzleData(preset, activeGeneration = generationId) {
  const targetMinimum = pickMini6TargetMinimum();
  const maxAttempts = 900;
  let fallbackCandidate = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (isGenerationCancelled(activeGeneration)) {
      return null;
    }
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
    label = 'serrÃ©e';
  } else if (minimumBulbs >= 9 || mediumClues >= 3 || indirectSteps === 1) {
    label = 'tactique';
  }

  return {
    label,
    relativeScore,
    minimumBulbs,
    indirectSteps,
    directSteps,
    blackCells,
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
    return `Grille gÃ©nÃ©rÃ©e (6x6 - ${puzzle.width}Ã—${puzzle.height}), rÃ©soluble par logique.`;
  }
  const indirectText = analysis.indirectSteps === 0
    ? 'aucun coup indirect'
    : `${analysis.indirectSteps} coup${analysis.indirectSteps > 1 ? 's' : ''} indirect${analysis.indirectSteps > 1 ? 's' : ''}`;
  const score = getPuzzleResolutionScore(puzzle);
  return `Grille gÃ©nÃ©rÃ©e (6x6 - minimum ${analysis.minimumBulbs} ampoules, difficultÃ© ${score}/100). Analyse ${analysis.label} : ${analysis.visibleClues} indices visibles, ${indirectText}.`;
}

async function generateMini8PuzzleData(preset, activeGeneration = generationId) {
  const targetMinimum = pickMini8TargetMinimum();
  const maxAttempts = 1200;
  let fallbackCandidate = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    if (isGenerationCancelled(activeGeneration)) {
      return null;
    }
    const blackCells = pickMini8BlackCellCount(preset, targetMinimum);
    const grid = createMini8Grid(blackCells);
    let solution = solveAkari(grid, 1200);
    if (!solution) {
      if (attempt % 16 === 0) {
        await waitForPaint();
      }
      continue;
    }

    solution = enhanceMini8SolutionClues(grid, solution, targetMinimum);
    const minimumBulbs = countSolutionBulbs(solution);
    if (minimumBulbs < preset.minSolutionBulbs || minimumBulbs > preset.maxSolutionBulbs) {
      if (attempt % 16 === 0) {
        await waitForPaint();
      }
      continue;
    }

    const fullClues = buildClues(grid, solution);
    const targetVisible = pickMini8TargetVisible(preset, blackCells, targetMinimum);
    const clues = reduceMini8CluesPreservingLogic(grid, solution, fullClues, preset, targetVisible);
    const candidate = evaluateMini8Candidate(grid, solution, clues, preset);
    if (!candidate) {
      if (attempt % 16 === 0) {
        await waitForPaint();
      }
      continue;
    }

    if (candidate.evaluatedDifficulty.minimumBulbs === targetMinimum) {
      return candidate;
    }

    if (!fallbackCandidate || isBetterMini8Fallback(candidate, fallbackCandidate, targetMinimum)) {
      fallbackCandidate = candidate;
    }

    if (attempt % 16 === 0) {
      await waitForPaint();
    }
  }

  return fallbackCandidate;
}

function pickMini8TargetMinimum() {
  const roll = Math.random();
  if (roll < 0.06) {
    return 12;
  }
  if (roll < 0.18) {
    return 13;
  }
  if (roll < 0.38) {
    return 14;
  }
  if (roll < 0.62) {
    return 15;
  }
  if (roll < 0.82) {
    return 16;
  }
  if (roll < 0.94) {
    return 17;
  }
  if (roll < 0.99) {
    return 18;
  }
  return 19;
}

function pickMini8BlackCellCount(preset, targetMinimum) {
  const options = targetMinimum <= 13
    ? [15, 16, 17, 18]
    : targetMinimum >= 18
      ? [17, 18, 19, 20]
      : [15, 16, 17, 18, 19, 20];
  return options[Math.floor(Math.random() * options.length)];
}

function pickMini8TargetVisible(preset, blackCells, targetMinimum) {
  const hiddenLimit = targetMinimum >= 17 ? 5 : 4;
  const hiddenClues = Math.random() < 0.84 ? Math.floor(Math.random() * hiddenLimit) : 0;
  return Math.max(preset.minVisibleClues, Math.min(preset.maxVisibleClues, blackCells - hiddenClues));
}

function createMini8Grid(blackCells) {
  const size = 8;
  let fallbackGrid = null;

  for (let shapeAttempt = 0; shapeAttempt < 120; shapeAttempt += 1) {
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
    if (isMini8ShapeAllowed(grid, blackCells)) {
      return grid;
    }
  }

  return fallbackGrid;
}

function isMini8ShapeAllowed(grid, blackCells) {
  if (countBlackCells(grid) !== blackCells) {
    return false;
  }
  for (let y = 0; y < grid.length; y += 1) {
    const blackInRow = grid[y].filter((value) => value === 1).length;
    if (blackInRow > 5) {
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
    if (blackInColumn > 5) {
      return false;
    }
  }
  return !hasSolidBlackBlock(grid);
}

function hasSolidBlackBlock(grid) {
  for (let y = 0; y < grid.length - 1; y += 1) {
    for (let x = 0; x < grid[0].length - 1; x += 1) {
      if (grid[y][x] === 1 && grid[y][x + 1] === 1 && grid[y + 1][x] === 1 && grid[y + 1][x + 1] === 1) {
        return true;
      }
    }
  }
  return false;
}

function enhanceMini8SolutionClues(grid, solution, targetMinimum) {
  const enhanced = solution.map((row) => row.slice());
  const blackCells = collectInteriorBlackCells(grid);
  const boostLimit = targetMinimum >= 18 ? 10 : targetMinimum >= 16 ? 8 : targetMinimum >= 14 ? 5 : 3;
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

function reduceMini8CluesPreservingLogic(grid, solution, fullClues, preset, targetVisible) {
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

function evaluateMini8Candidate(grid, solution, clues, preset) {
  const blackCells = countBlackCells(grid);
  const visibleClues = countVisibleClues(clues);
  const minimumBulbs = countSolutionBulbs(solution);

  if (blackCells < preset.minBlackCells || blackCells > preset.maxBlackCells) {
    return null;
  }
  if (visibleClues < preset.minVisibleClues || visibleClues > preset.maxVisibleClues) {
    return null;
  }
  if (minimumBulbs < preset.minSolutionBulbs || minimumBulbs > preset.maxSolutionBulbs) {
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
  if (histogram[2] + highClues < 3) {
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

  const mini8Analysis = analyzeMini8Difficulty(evaluatedDifficulty, minimumBulbs, blackCells, visibleClues);
  const resolutionScore = normalizeResolutionScore(mini8Analysis.relativeScore, 80, 210);
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
      mini8Analysis,
    },
    width: 8,
    height: 8,
  };
}

function analyzeMini8Difficulty(evaluation, minimumBulbs, blackCells, visibleClues) {
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
  const relativeScore = minimumBulbs * 7
    + indirectSteps * 13
    + mediumClues * 2
    + highClues * 5
    + blankBlackCells * 3
    + Math.max(0, (stats.iterations || 1) - 1) * 4
    + (stats.singleSourceBulbs || 0) * 0.8
    + Math.max(0, visibleClues - 14) * 2;

  let label = 'directe';
  if (indirectSteps >= 3) {
    label = 'indirecte';
  } else if (minimumBulbs >= 18 || highClues >= 5) {
    label = 'serree';
  } else if (minimumBulbs >= 15 || mediumClues >= 4 || indirectSteps >= 1) {
    label = 'tactique';
  }

  return {
    label,
    relativeScore,
    minimumBulbs,
    indirectSteps,
    directSteps,
    blackCells,
    visibleClues,
    blankBlackCells,
    mediumClues,
    highClues,
  };
}

function isBetterMini8Fallback(candidate, currentBest, targetMinimum) {
  const candidateMinimum = candidate.evaluatedDifficulty.minimumBulbs;
  const currentMinimum = currentBest.evaluatedDifficulty.minimumBulbs;
  const candidateDistance = Math.abs(candidateMinimum - targetMinimum);
  const currentDistance = Math.abs(currentMinimum - targetMinimum);
  if (candidateDistance !== currentDistance) {
    return candidateDistance < currentDistance;
  }
  return candidate.evaluatedDifficulty.mini8Analysis.relativeScore > currentBest.evaluatedDifficulty.mini8Analysis.relativeScore;
}

function formatMini8GenerationStatus(puzzle) {
  const analysis = puzzle.evaluatedDifficulty.mini8Analysis;
  if (!analysis) {
    return `Grille gÃ©nÃ©rÃ©e (8x8 - ${puzzle.width}Ã—${puzzle.height}), rÃ©soluble par logique.`;
  }
  const indirectText = analysis.indirectSteps === 0
    ? 'aucun coup indirect'
    : `${analysis.indirectSteps} coup${analysis.indirectSteps > 1 ? 's' : ''} indirect${analysis.indirectSteps > 1 ? 's' : ''}`;
  const score = getPuzzleResolutionScore(puzzle);
  return `Grille gÃ©nÃ©rÃ©e (8x8 - minimum ${analysis.minimumBulbs} ampoules, difficultÃ© ${score}/100). Analyse ${analysis.label} : ${analysis.visibleClues} indices visibles, ${analysis.blankBlackCells} case${analysis.blankBlackCells > 1 ? 's' : ''} muette${analysis.blankBlackCells > 1 ? 's' : ''}, ${indirectText}.`;
}

function setCurrentPuzzle(puzzle) {
  currentGrid = puzzle.grid;
  currentSolution = puzzle.solution;
  currentClues = puzzle.clues;
  currentEvaluatedDifficulty = puzzle.evaluatedDifficulty;
  resetPuzzleState(puzzle.width, puzzle.height);
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
  completionOverlayDismissed = false;
  celebrationUntil = 0;
}

function setControlsDisabled(disabled) {
  generateButton.disabled = disabled;
  batchGenerateButton.disabled = disabled;
  hintButton.disabled = disabled;
  batchSizeFilterInput.disabled = disabled;
  batchSortSelect.disabled = disabled;
  applyResolverSizeButton.disabled = disabled;
  solveResolverButton.disabled = disabled;
  printButton.disabled = disabled;
  resolverToolButtons.forEach((button) => {
    button.disabled = disabled;
  });
  exportBlankButton.disabled = disabled;
  exportSolutionButton.disabled = disabled;
  exportCompletedButton.disabled = disabled;
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
    if (!preset.custom && !preset.gameLevel && !preset.sizeOnly && evaluatedDifficulty.level !== preset.targetLevel) {
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

function logicSolveAkari(grid, clues, stats = null, solveTrace = null) {
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
    stats.maxPropagationDepth = 0;
    stats.maxCandidateWidth = 0;
    stats.candidateWidthTotal = 0;
    stats.candidateWidthSamples = 0;
    stats.remainingPossibilitiesTotal = 0;
    stats.remainingPossibilitiesSamples = 0;
    stats.maxRemainingPossibilities = 0;
    stats.maxPropagationWaveLength = 0;
  }
  const trace = Array.isArray(solveTrace) ? solveTrace : null;
  let propagationDepth = 0;
  let waveIndex = 0;
  let currentWaveLength = 0;

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

  function countRemainingPossibilities() {
    let count = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (grid[y][x] === 0 && state[y][x] === 'unknown') {
          count += 1;
        }
      }
    }
    return count;
  }

  function collectCurrentCandidateWidths() {
    const widths = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (grid[y][x] !== 0 || isLit(x, y)) {
          continue;
        }
        widths.push(possibleBulbSourcesForCell(x, y).length);
      }
    }
    return widths;
  }

  function sampleSolverState() {
    if (!stats) {
      return;
    }
    const remaining = countRemainingPossibilities();
    stats.remainingPossibilitiesTotal += remaining;
    stats.remainingPossibilitiesSamples += 1;
    stats.maxRemainingPossibilities = Math.max(stats.maxRemainingPossibilities, remaining);
    const candidateWidths = collectCurrentCandidateWidths();
    for (const widthValue of candidateWidths) {
      stats.candidateWidthTotal += widthValue;
      stats.candidateWidthSamples += 1;
      stats.maxCandidateWidth = Math.max(stats.maxCandidateWidth, widthValue);
    }
  }

  function recordSolveStep(ruleType, cells, details = {}) {
    if (!trace) {
      return;
    }
    const safeCells = cells.map(([x, y]) => [x, y]);
    trace.push({
      ruleType,
      cells: safeCells,
      removedCandidates: details.removedCandidates || 0,
      bulbsPlaced: details.bulbsPlaced || 0,
      crossesPlaced: details.crossesPlaced || 0,
      propagationDepth,
      possibilitiesRemaining: countRemainingPossibilities(),
      candidateWidth: details.candidateWidth ?? safeCells.length,
      wave: waveIndex,
      assumption: details.assumption || null,
    });
    currentWaveLength += 1;
    if (stats) {
      stats.maxPropagationWaveLength = Math.max(stats.maxPropagationWaveLength, currentWaveLength);
    }
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
          recordSolveStep('indirect-cross', [[x, y]], {
            crossesPlaced: 1,
            removedCandidates: 1,
            candidateWidth: possibleBulbSourcesForCell(x, y).length,
            assumption: 'bulb',
          });
          return true;
        }
        if (assumptionContradicts(x, y, 'no-bulb')) {
          if (!setBulb(x, y)) {
            return null;
          }
          if (stats) {
            stats.indirectBulbs += 1;
          }
          recordSolveStep('indirect-bulb', [[x, y]], {
            bulbsPlaced: 1,
            candidateWidth: possibleBulbSourcesForCell(x, y).length,
            assumption: 'no-bulb',
          });
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
      const changedCells = [];
      for (const [nx, ny] of unknownCells) {
        if (!setNoBulb(nx, ny)) {
          return false;
        }
        if (stats) {
          stats.clueCrosses += 1;
        }
        changedCells.push([nx, ny]);
      }
      if (changedCells.length > 0) {
        recordSolveStep('clue-cross', changedCells, {
          crossesPlaced: changedCells.length,
          removedCandidates: changedCells.length,
          candidateWidth: unknownCells.length,
        });
      }
    }
    if (bulbCount + unknownCells.length === clue) {
      const changedCells = [];
      for (const [nx, ny] of unknownCells) {
        if (!setBulb(nx, ny)) {
          return false;
        }
        if (stats) {
          stats.clueBulbs += 1;
        }
        changedCells.push([nx, ny]);
      }
      if (changedCells.length > 0) {
        recordSolveStep('clue-bulb', changedCells, {
          bulbsPlaced: changedCells.length,
          candidateWidth: unknownCells.length,
        });
      }
    }
    return true;
  }

  function propagate() {
    let changed = false;
    propagationDepth += 1;
    waveIndex += 1;
    currentWaveLength = 0;
    if (stats) {
      stats.iterations += 1;
      stats.maxPropagationDepth = Math.max(stats.maxPropagationDepth, propagationDepth);
    }
    sampleSolverState();
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
          recordSolveStep('forced-cross', [[x, y]], {
            crossesPlaced: 1,
            removedCandidates: 1,
          });
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
            recordSolveStep('single-source-bulb', [[bx, by]], {
              bulbsPlaced: 1,
              candidateWidth: sources.length,
            });
            changed = true;
          }
        }
      }
    }

    sampleSolverState();
    return changed;
  }

  let progress = true;
  while (progress) {
    progress = propagate();
    if (progress === null) {
      return null;
    }
    if (!progress) {
      propagationDepth += 1;
      waveIndex += 1;
      currentWaveLength = 0;
      if (stats) {
        stats.maxPropagationDepth = Math.max(stats.maxPropagationDepth, propagationDepth);
      }
      sampleSolverState();
      progress = applyIndirectStep();
      if (progress === null) {
        return null;
      }
      sampleSolverState();
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

function drawOnContext(renderCtx, size, showSolution, showPlayer, options = {}) {
  const monochrome = options.monochrome === true;
  const hideCompletionOverlay = options.hideCompletionOverlay === true;
  const exportMode = options.exportMode === true;
  const gridStrokeWidth = exportMode
    ? monochrome ? Math.max(3, size * 0.03) : Math.max(2.5, size * 0.024)
    : monochrome ? Math.max(1, size * 0.012) : 1;
  const blackInset = exportMode ? Math.max(3, size * 0.04) : 2;
  const rows = currentGrid.length;
  const cols = currentGrid[0].length;
  renderCtx.clearRect(0, 0, cols * size, rows * size);
  renderCtx.fillStyle = monochrome ? '#ffffff' : '#f8fafc';
  renderCtx.fillRect(0, 0, cols * size, rows * size);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = x * size;
      const py = y * size;
      const isWhiteCell = currentGrid[y][x] === 0;
      const isLit = showPlayer && playerGrid && isWhiteCell && isCellLitByBulbs(x, y, playerGrid);
      renderCtx.fillStyle = isLit
        ? monochrome ? '#b3b3b3' : '#fef3c7'
        : '#ffffff';
      renderCtx.fillRect(px, py, size, size);
      renderCtx.strokeStyle = monochrome ? '#111827' : '#d1d5db';
      renderCtx.lineWidth = gridStrokeWidth;
      renderCtx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);

      if (currentGrid[y][x] === 1) {
        const clue = currentClues[y][x];
        renderCtx.fillStyle = monochrome ? '#000000' : invalidNumberedCells.has(`${x},${y}`) ? '#b91c1c' : '#111827';
        renderCtx.fillRect(px + blackInset, py + blackInset, size - blackInset * 2, size - blackInset * 2);
        if (clue !== null) {
          renderCtx.fillStyle = monochrome ? '#ffffff' : invalidNumberedCells.has(`${x},${y}`) ? '#fee2e2' : '#f8fafc';
          renderCtx.font = `bold ${Math.floor(size * (exportMode ? 0.5 : 0.45))}px Inter, system-ui, sans-serif`;
          renderCtx.textAlign = 'center';
          renderCtx.textBaseline = 'middle';
          renderCtx.fillText(clue.toString(), px + size / 2, py + size / 2 + 1);
        }
      }
    }
  }

  if (showSolution && currentSolution) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (currentSolution[y][x]) {
          drawBulb(renderCtx, x, y, size, false, monochrome, exportMode);
        }
      }
    }
  }

  if (showPlayer && playerGrid) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (playerGrid[y][x]) {
          const invalid = invalidBulbCells.has(cellKey(x, y));
          drawBulb(renderCtx, x, y, size, invalid, monochrome, exportMode);
        } else if (noBulbCells.has(cellKey(x, y))) {
          drawNoBulbMarker(renderCtx, x, y, size, monochrome, exportMode);
        }
      }
    }
  }

  if (showPlayer && playerGrid && puzzleCompleted && !completionOverlayDismissed && !hideCompletionOverlay) {
    drawCompletionOverlay(renderCtx, cols * size, rows * size, size);
  }
}

function drawBulb(renderCtx, x, y, size, invalid = false, monochrome = false, exportMode = false) {
  const px = x * size;
  const py = y * size;
  const centerX = px + size / 2;
  const centerY = py + size / 2;
  const radius = size * 0.26;

  if (monochrome) {
    renderCtx.fillStyle = '#000000';
    renderCtx.beginPath();
    renderCtx.arc(centerX, centerY - radius * 0.12, radius, 0, Math.PI * 2);
    renderCtx.fill();

    renderCtx.fillRect(centerX - radius * 0.18, centerY - radius * 0.1, radius * 0.36, radius * 0.7);

    renderCtx.beginPath();
    renderCtx.moveTo(centerX - radius * 0.28, centerY + radius * 0.35);
    renderCtx.lineTo(centerX + radius * 0.28, centerY + radius * 0.35);
    renderCtx.lineTo(centerX + radius * 0.1, centerY + radius * 0.6);
    renderCtx.lineTo(centerX - radius * 0.1, centerY + radius * 0.6);
    renderCtx.closePath();
    renderCtx.fill();
    return;
  }

  renderCtx.fillStyle = invalid ? '#fecaca' : '#fde68a';
  renderCtx.beginPath();
  renderCtx.arc(centerX, centerY - radius * 0.12, radius, 0, Math.PI * 2);
  renderCtx.fill();

  renderCtx.fillStyle = '#f59e0b';
  renderCtx.fillRect(centerX - radius * 0.18, centerY - radius * 0.1, radius * 0.36, radius * 0.7);

  if (invalid) {
    renderCtx.strokeStyle = '#b91c1c';
    renderCtx.lineWidth = exportMode ? Math.max(3, size * 0.06) : Math.max(2, size * 0.05);
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

function drawNoBulbMarker(renderCtx, x, y, size, monochrome = false, exportMode = false) {
  const px = x * size;
  const py = y * size;
  const padding = size * 0.33;

  renderCtx.strokeStyle = monochrome ? '#000000' : '#64748b';
  renderCtx.lineWidth = exportMode ? Math.max(3, size * 0.06) : Math.max(2, size * 0.045);
  renderCtx.lineCap = 'round';
  renderCtx.beginPath();
  renderCtx.moveTo(px + padding, py + padding);
  renderCtx.lineTo(px + size - padding, py + size - padding);
  renderCtx.moveTo(px + size - padding, py + padding);
  renderCtx.lineTo(px + padding, py + size - padding);
  renderCtx.stroke();
  renderCtx.lineCap = 'butt';
}

function roundToInt(value, minimum = 1) {
  return Math.max(minimum, Math.round(value));
}

function alignStrokeCoordinate(value, lineWidth) {
  return Math.round(value) + (lineWidth % 2 === 1 ? 0.5 : 0);
}

function isCellLitByBulbsOnGrid(grid, bulbs, x, y) {
  if (!grid || !bulbs || !grid[y] || grid[y][x] !== 0) {
    return false;
  }
  if (bulbs[y][x]) {
    return true;
  }

  const height = grid.length;
  const width = grid[0].length;
  for (const { dx, dy } of directions) {
    let nx = x + dx;
    let ny = y + dy;
    while (nx >= 0 && ny >= 0 && ny < height && nx < width && grid[ny][nx] === 0) {
      if (bulbs[ny][nx]) {
        return true;
      }
      nx += dx;
      ny += dy;
    }
  }
  return false;
}

function buildExportLayout(board, variant) {
  const config = getExportConfigForSize(Math.max(board.width, board.height), variant);
  const canvasSize = mmToPixels(config.mm);
  const paddingRatio = EXPORT_STYLE_CONFIG.paddingRatio[variant] || EXPORT_STYLE_CONFIG.paddingRatio.puzzle;
  const padding = roundToInt(canvasSize * paddingRatio, EXPORT_STYLE_CONFIG.minPaddingPx);
  const availableSize = Math.max(1, canvasSize - padding * 2);
  const cellPx = Math.max(1, Math.floor(availableSize / Math.max(board.width, board.height)));
  const gridWidth = board.width * cellPx;
  const gridHeight = board.height * cellPx;
  const originX = Math.floor((canvasSize - gridWidth) / 2);
  const originY = Math.floor((canvasSize - gridHeight) / 2);

  return {
    variant,
    sizeKey: config.size,
    canvasWidth: canvasSize,
    canvasHeight: canvasSize,
    cellPx,
    originX,
    originY,
    gridWidth,
    gridHeight,
    gridLineWidth: roundToInt(
      cellPx * (EXPORT_STYLE_CONFIG.gridLineRatio[variant] || EXPORT_STYLE_CONFIG.gridLineRatio.puzzle),
      EXPORT_STYLE_CONFIG.minExportGridLinePx,
    ),
    blackInset: roundToInt(
      cellPx * (EXPORT_STYLE_CONFIG.blackInsetRatio[variant] || EXPORT_STYLE_CONFIG.blackInsetRatio.puzzle),
      2,
    ),
    clueFontPx: roundToInt(
      cellPx * (EXPORT_STYLE_CONFIG.clueFontRatio[variant] || EXPORT_STYLE_CONFIG.clueFontRatio.puzzle),
      EXPORT_STYLE_CONFIG.minClueFontPx,
    ),
    crossPadding: roundToInt(
      cellPx * (EXPORT_STYLE_CONFIG.crossPaddingRatio[variant] || EXPORT_STYLE_CONFIG.crossPaddingRatio.puzzle),
      2,
    ),
    crossStrokeWidth: roundToInt(
      cellPx * (EXPORT_STYLE_CONFIG.crossStrokeRatio[variant] || EXPORT_STYLE_CONFIG.crossStrokeRatio.puzzle),
      EXPORT_STYLE_CONFIG.minExportCrossStrokePx,
    ),
    invalidBulbStrokeWidth: roundToInt(
      cellPx * (EXPORT_STYLE_CONFIG.invalidBulbStrokeRatio[variant] || EXPORT_STYLE_CONFIG.invalidBulbStrokeRatio.puzzle),
      EXPORT_STYLE_CONFIG.minExportCrossStrokePx,
    ),
    bulbRadius: cellPx * (EXPORT_STYLE_CONFIG.bulbRadiusRatio[variant] || EXPORT_STYLE_CONFIG.bulbRadiusRatio.puzzle),
  };
}

function drawExportGridLines(renderCtx, layout, rows, cols) {
  renderCtx.save();
  renderCtx.strokeStyle = EXPORT_STYLE_CONFIG.gridLineColor;
  renderCtx.lineWidth = layout.gridLineWidth;
  renderCtx.beginPath();

  for (let column = 0; column <= cols; column += 1) {
    const x = alignStrokeCoordinate(layout.originX + column * layout.cellPx, layout.gridLineWidth);
    renderCtx.moveTo(x, layout.originY);
    renderCtx.lineTo(x, layout.originY + layout.gridHeight);
  }

  for (let row = 0; row <= rows; row += 1) {
    const y = alignStrokeCoordinate(layout.originY + row * layout.cellPx, layout.gridLineWidth);
    renderCtx.moveTo(layout.originX, y);
    renderCtx.lineTo(layout.originX + layout.gridWidth, y);
  }

  renderCtx.stroke();
  renderCtx.restore();
}

function drawExportBulb(renderCtx, layout, x, y, invalid = false) {
  const px = layout.originX + x * layout.cellPx;
  const py = layout.originY + y * layout.cellPx;
  const centerX = px + layout.cellPx / 2;
  const centerY = py + layout.cellPx / 2;
  const radius = layout.bulbRadius;

  if (layout.variant === 'solution') {
    renderCtx.fillStyle = '#000000';
    renderCtx.beginPath();
    renderCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    renderCtx.fill();

    if (!invalid) {
      return;
    }

    renderCtx.strokeStyle = EXPORT_STYLE_CONFIG.invalidColor;
    renderCtx.lineWidth = layout.invalidBulbStrokeWidth;
    renderCtx.beginPath();
    renderCtx.arc(centerX, centerY, radius + layout.invalidBulbStrokeWidth, 0, Math.PI * 2);
    renderCtx.stroke();
    return;
  }

  renderCtx.fillStyle = '#000000';
  renderCtx.beginPath();
  renderCtx.arc(centerX, centerY - radius * 0.12, radius, 0, Math.PI * 2);
  renderCtx.fill();

  renderCtx.fillRect(centerX - radius * 0.18, centerY - radius * 0.1, radius * 0.36, radius * 0.7);

  renderCtx.beginPath();
  renderCtx.moveTo(centerX - radius * 0.28, centerY + radius * 0.35);
  renderCtx.lineTo(centerX + radius * 0.28, centerY + radius * 0.35);
  renderCtx.lineTo(centerX + radius * 0.1, centerY + radius * 0.6);
  renderCtx.lineTo(centerX - radius * 0.1, centerY + radius * 0.6);
  renderCtx.closePath();
  renderCtx.fill();

  if (!invalid) {
    return;
  }

  renderCtx.strokeStyle = EXPORT_STYLE_CONFIG.invalidColor;
  renderCtx.lineWidth = layout.invalidBulbStrokeWidth;
  renderCtx.beginPath();
  renderCtx.arc(centerX, centerY - radius * 0.12, radius + layout.invalidBulbStrokeWidth, 0, Math.PI * 2);
  renderCtx.stroke();
}

function drawExportNoBulbMarker(renderCtx, layout, x, y) {
  const px = layout.originX + x * layout.cellPx;
  const py = layout.originY + y * layout.cellPx;

  renderCtx.save();
  renderCtx.strokeStyle = EXPORT_STYLE_CONFIG.crossColor;
  renderCtx.lineWidth = layout.crossStrokeWidth;
  renderCtx.lineCap = 'round';
  renderCtx.beginPath();
  renderCtx.moveTo(px + layout.crossPadding, py + layout.crossPadding);
  renderCtx.lineTo(px + layout.cellPx - layout.crossPadding, py + layout.cellPx - layout.crossPadding);
  renderCtx.moveTo(px + layout.cellPx - layout.crossPadding, py + layout.crossPadding);
  renderCtx.lineTo(px + layout.crossPadding, py + layout.cellPx - layout.crossPadding);
  renderCtx.stroke();
  renderCtx.restore();
}

function renderExportBoard(renderCtx, board, options = {}) {
  const variant = options.variant || 'puzzle';
  const showSolution = options.showSolution === true;
  const showPlayer = options.showPlayer === true;
  const layout = buildExportLayout(board, variant);
  const rows = board.grid.length;
  const cols = board.grid[0].length;

  renderCtx.imageSmoothingEnabled = false;
  renderCtx.clearRect(0, 0, layout.canvasWidth, layout.canvasHeight);
  renderCtx.fillStyle = EXPORT_STYLE_CONFIG.background;
  renderCtx.fillRect(0, 0, layout.canvasWidth, layout.canvasHeight);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = layout.originX + x * layout.cellPx;
      const py = layout.originY + y * layout.cellPx;
      const isWhiteCell = board.grid[y][x] === 0;
      const isLit = showPlayer && board.playerGrid && isCellLitByBulbsOnGrid(board.grid, board.playerGrid, x, y);
      renderCtx.fillStyle = isWhiteCell && isLit ? EXPORT_STYLE_CONFIG.lightGray : EXPORT_STYLE_CONFIG.background;
      renderCtx.fillRect(px, py, layout.cellPx, layout.cellPx);

      if (board.grid[y][x] !== 1) {
        continue;
      }

      const clue = board.clues[y][x];
      renderCtx.fillStyle = EXPORT_STYLE_CONFIG.clueCellColor;
      renderCtx.fillRect(
        px + layout.blackInset,
        py + layout.blackInset,
        layout.cellPx - layout.blackInset * 2,
        layout.cellPx - layout.blackInset * 2,
      );

      if (clue === null) {
        continue;
      }

      renderCtx.fillStyle = EXPORT_STYLE_CONFIG.clueTextColor;
      renderCtx.font = `bold ${layout.clueFontPx}px Arial, Helvetica, sans-serif`;
      renderCtx.textAlign = 'center';
      renderCtx.textBaseline = 'middle';
      renderCtx.fillText(String(clue), px + layout.cellPx / 2, py + layout.cellPx / 2 + 1);
    }
  }

  drawExportGridLines(renderCtx, layout, rows, cols);

  if (showSolution && board.solution) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (board.solution[y][x]) {
          drawExportBulb(renderCtx, layout, x, y, false);
        }
      }
    }
  }

  if (showPlayer && board.playerGrid) {
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < cols; x += 1) {
        if (board.playerGrid[y][x]) {
          drawExportBulb(renderCtx, layout, x, y, board.invalidBulbCells.has(cellKey(x, y)));
        } else if (board.noBulbCells.has(cellKey(x, y))) {
          drawExportNoBulbMarker(renderCtx, layout, x, y);
        }
      }
    }
  }

  return layout;
}

function getCompletionOverlayRect(width, height, size) {
  const centerX = width / 2;
  const centerY = height / 2;
  const panelWidth = Math.min(width * 0.82, size * 4.4);
  const panelHeight = Math.min(height * 0.26, size * 1.35);
  return {
    x: centerX - panelWidth / 2,
    y: centerY - panelHeight / 2,
    width: panelWidth,
    height: panelHeight,
    centerX,
    centerY,
  };
}

function drawCompletionOverlay(renderCtx, width, height, size) {
  const remaining = Math.max(0, celebrationUntil - performance.now());
  const confettiActive = remaining > 0;
  const progress = confettiActive ? 1 - remaining / celebrationDuration : 1;
  const rect = getCompletionOverlayRect(width, height, size);
  const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#a855f7'];

  renderCtx.save();
  renderCtx.globalAlpha = 0.9;
  renderCtx.fillStyle = '#0f172a';
  renderCtx.beginPath();
  renderCtx.roundRect(rect.x, rect.y, rect.width, rect.height, Math.max(8, size * 0.16));
  renderCtx.fill();

  renderCtx.globalAlpha = 1;
  renderCtx.fillStyle = '#f8fafc';
  renderCtx.font = `bold ${Math.max(24, Math.floor(size * 0.48))}px Inter, system-ui, sans-serif`;
  renderCtx.textAlign = 'center';
  renderCtx.textBaseline = 'middle';
  renderCtx.fillText('Well done', rect.centerX, rect.centerY + size * 0.02);

  if (!confettiActive) {
    renderCtx.restore();
    return;
  }

  for (let i = 0; i < 34; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const lane = Math.floor(i / 2);
    const angle = (-0.95 + (lane % 17) * 0.12) * side;
    const distance = size * (0.55 + (lane % 5) * 0.15 + progress * 1.35);
    const x = rect.centerX + Math.cos(angle) * distance * side;
    const y = rect.centerY - rect.height * 0.35 + Math.sin(angle) * distance + progress * size * 0.55;
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
  let lastPuzzle = null;
  const generatedRecords = [];
  setControlsDisabled(true);

  for (let index = 1; index <= count; index += 1) {
    statusMessage.textContent = `GÃ©nÃ©ration ${index}/${count}...`;
    await waitForPaint();
    if (activeGeneration !== generationId) {
      setControlsDisabled(false);
      return;
    }
    const puzzle = await generatePuzzleData(preset);
    if (!puzzle) {
      statusMessage.textContent = `La gÃ©nÃ©ration ${index}/${count} a Ã©chouÃ©. Les fichiers dÃ©jÃ  crÃ©Ã©s ont Ã©tÃ© tÃ©lÃ©chargÃ©s.`;
      setControlsDisabled(false);
      return;
    }
    lastPuzzle = puzzle;
    const blankBlob = await renderPuzzleToBlob(puzzle, false);
    const solutionBlob = await renderPuzzleToBlob(puzzle, true);
    if (!blankBlob || !solutionBlob) {
      statusMessage.textContent = `L'export PNG a Ã©chouÃ© Ã  la gÃ©nÃ©ration ${index}/${count}.`;
      setControlsDisabled(false);
      return;
    }
    generatedRecords.push({
      puzzle,
      blankBlob,
      solutionBlob,
    });
  }

  const zipEntries = buildBatchZipEntries(generatedRecords);

  if (lastPuzzle) {
    setCurrentPuzzle(lastPuzzle);
    renderGrid(false, true);
    updateDifficultyScore(lastPuzzle);
  }
  statusMessage.textContent = 'Création du fichier ZIP...';
  await waitForPaint();
  const zipBlob = await createZipBlob(zipEntries);
  downloadBlob(zipBlob, buildBatchZipFileName(preset, count));
  statusMessage.textContent = `${count} grille${count > 1 ? 's' : ''} gÃ©nÃ©rÃ©e${count > 1 ? 's' : ''} avec solutions dans un ZIP.`;
  setControlsDisabled(false);
}

function buildBatchZipEntries(records) {
  const groupedRecords = new Map();
  for (const record of records) {
    const stem = buildDifficultyFileStem(record.puzzle);
    if (!groupedRecords.has(stem)) {
      groupedRecords.set(stem, []);
    }
    groupedRecords.get(stem).push(record);
  }

  const zipEntries = [];
  for (const [stem, recordGroup] of groupedRecords.entries()) {
    recordGroup.forEach((record, index) => {
      const duplicateSuffix = recordGroup.length > 1 ? getAlphabeticalBatchSuffix(index) : '';
      const fileStem = `${stem}${duplicateSuffix}`;
      zipEntries.push({ name: `${fileStem}.png`, blob: record.blankBlob });
      zipEntries.push({ name: `sol-${fileStem}.png`, blob: record.solutionBlob });
    });
  }
  return zipEntries;
}

function getAlphabeticalBatchSuffix(index) {
  let value = index;
  let suffix = '';
  do {
    suffix = String.fromCharCode(97 + (value % 26)) + suffix;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);
  return suffix;
}

function buildPuzzleFileBaseName(preset, puzzle) {
  if (preset.mini4 || preset.mini6 || preset.mini8 || preset.scoreNamed || preset.custom) {
    return buildDifficultyFileStem(puzzle);
  }
  return buildDifficultyFileStem(puzzle);
}

function getPuzzleSizeLabel(puzzle) {
  return `${puzzle.width}x${puzzle.height}`;
}

function buildDifficultyFileStem(puzzle) {
  const sizeLabel = getPuzzleSizeLabel(puzzle);
  const score = getPuzzleResolutionScore(puzzle);
  if (score === null || score === undefined) {
    return sizeLabel;
  }
  return `${sizeLabel}-${formatDifficultyScoreForFile(puzzle)}`;
}

function formatDifficultyScoreForFile(puzzle) {
  const score = getPuzzleResolutionScore(puzzle) || 0;
  return String(score);
}

function buildBatchZipFileName(preset, count) {
  const label = getBatchFileLabel(preset);
  return `${label}-${count} grilles.zip`;
}

function getBatchFileLabel(preset) {
  if (preset.custom) {
    const { width, height } = getCustomDimensions();
    return `${width}x${height}`;
  }
  if (Array.isArray(preset.sizes) && preset.sizes.length === 1) {
    return `${preset.sizes[0]}x${preset.sizes[0]}`;
  }
  return preset.fileLabel;
}

function getBatchArchiveRank(preset) {
  if (preset.targetLevel === 'facile') {
    return preset.fileRank;
  }
  return preset.fileRank;
}

function exportPNG(showSolution) {
  if (!currentGrid) {
    statusMessage.textContent = 'Aucune grille Ã  exporter. GÃ©nÃ©rer dâ€™abord une grille.';
    return;
  }
  if (showSolution && !currentSolution) {
    statusMessage.textContent = isResolverMode()
      ? 'Aucune solution Ã  exporter. RÃ©sous dâ€™abord la grille saisie.'
      : 'Aucune solution Ã  exporter.';
    return;
  }
  const puzzle = buildCurrentPuzzleSnapshot();
  const filename = `${showSolution ? 'sol-' : ''}${buildExportBaseName(puzzle)}.png`;
  downloadPuzzlePNG(puzzle, showSolution, filename).then(() => {
    statusMessage.textContent = showSolution ? 'Solution exportÃ©e en PNG HD.' : 'Grille vierge exportÃ©e en PNG HD.';
  }).catch(() => {
    statusMessage.textContent = 'Lâ€™export a Ã©chouÃ©. RÃ©essayez.';
  });
}

function exportCompletedPNG() {
  if (!currentGrid || !playerGrid) {
    statusMessage.textContent = 'Aucune grille Ã  exporter. GÃ©nÃ©rer dâ€™abord une grille.';
    return;
  }
  validatePlayerGrid();
  const puzzle = buildCurrentPuzzleSnapshot();
  const filename = `${puzzleCompleted ? 'completee' : 'etat'}-${buildExportBaseName(puzzle)}-nb.png`;
  renderCompletedPuzzleToBlob().then((blob) => {
    if (!blob) {
      throw new Error('PNG export failed');
    }
    downloadBlob(blob, filename);
    statusMessage.textContent = puzzleCompleted
      ? 'Grille complÃ©tÃ©e N&B exportÃ©e en PNG HD.'
      : 'Ã‰tat courant N&B exportÃ© en PNG HD.';
  }).catch(() => {
    statusMessage.textContent = 'Lâ€™export a Ã©chouÃ©. RÃ©essayez.';
  });
}

function buildCurrentPuzzleSnapshot() {
  return {
    grid: currentGrid,
    solution: currentSolution,
    clues: currentClues,
    evaluatedDifficulty: currentEvaluatedDifficulty,
    width: currentGrid[0].length,
    height: currentGrid.length,
  };
}

function buildExportBaseName(puzzle) {
  if (isResolverMode()) {
    return `resolver-${buildDifficultyFileStem(puzzle)}`;
  }
  const preset = difficultyPresets[currentDifficulty];
  return buildPuzzleFileBaseName(preset, puzzle);
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
    overlayDismissed: completionOverlayDismissed,
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
  completionOverlayDismissed = false;
  drawOnContext(exportCtx, cellSize * exportScale, showSolution, false, {
    exportMode: true,
  });
  currentGrid = savedState.grid;
  currentSolution = savedState.solution;
  currentClues = savedState.clues;
  playerGrid = savedState.player;
  noBulbCells = savedState.noBulbs;
  invalidBulbCells = savedState.invalidBulbs;
  invalidNumberedCells = savedState.invalidNumbers;
  puzzleCompleted = savedState.completed;
  completionOverlayDismissed = savedState.overlayDismissed;
  return new Promise((resolve) => exportCanvas.toBlob(resolve, 'image/png'));
}

function renderCompletedPuzzleToBlob() {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = currentGrid[0].length * cellSize * exportScale;
  exportCanvas.height = currentGrid.length * cellSize * exportScale;
  const exportCtx = exportCanvas.getContext('2d');
  drawOnContext(exportCtx, cellSize * exportScale, false, true, {
    monochrome: true,
    hideCompletionOverlay: true,
    exportMode: true,
  });
  return new Promise((resolve) => exportCanvas.toBlob(resolve, 'image/png'));
}

async function generateBatchFiles() {
  const activeGeneration = generationId + 1;
  generationId = activeGeneration;
  const batchPlan = buildBatchPlan();
  const totalCount = batchPlan.reduce((sum, entry) => sum + entry.count, 0);
  let lastPuzzle = null;
  let generatedTotal = 0;
  const generatedRecords = [];
  setControlsDisabled(true);

  for (const planEntry of batchPlan) {
    for (let index = 1; index <= planEntry.count; index += 1) {
      generatedTotal += 1;
      statusMessage.textContent = `Generation ${generatedTotal}/${totalCount} (${planEntry.size}x${planEntry.size})...`;
      await waitForPaint();
      if (activeGeneration !== generationId) {
        setControlsDisabled(false);
        return;
      }

      const puzzle = await generatePuzzleData(planEntry.preset);
      if (!puzzle) {
        statusMessage.textContent = `La generation ${generatedTotal}/${totalCount} a echoue pour ${planEntry.size}x${planEntry.size}.`;
        setControlsDisabled(false);
        return;
      }

      lastPuzzle = puzzle;
      const blankBlob = await renderPuzzleToBlob(puzzle, false);
      const solutionBlob = await renderPuzzleToBlob(puzzle, true);
      if (!blankBlob || !solutionBlob) {
        statusMessage.textContent = `L export PNG a echoue a la generation ${generatedTotal}/${totalCount}.`;
        setControlsDisabled(false);
        return;
      }

      generatedRecords.push({
        puzzle,
        blankBlob,
        solutionBlob,
        exportIndex: index,
      });
    }
  }

  const zipEntries = buildBatchZipEntries(generatedRecords, getBatchSortMode());

  if (lastPuzzle) {
    setCurrentPuzzle(lastPuzzle);
    renderGrid(false, true);
    updateDifficultyScore(lastPuzzle);
  }

  statusMessage.textContent = 'Creation du fichier ZIP...';
  await waitForPaint();
  const zipBlob = await createZipBlob(zipEntries);
  downloadBlob(zipBlob, buildBatchZipFileName(batchPlan));
  statusMessage.textContent = `${generatedRecords.length} grille${generatedRecords.length > 1 ? 's' : ''} exportee${generatedRecords.length > 1 ? 's' : ''} avec solutions dans un ZIP.`;
  setControlsDisabled(false);
}

function sortBatchRecords(records, sortMode = 'difficulty-desc') {
  const sortedRecords = records.slice();
  sortedRecords.sort((recordA, recordB) => {
    const sizeDiff = recordA.puzzle.width - recordB.puzzle.width;
    const scoreA = getPuzzleResolutionScore(recordA.puzzle) || 0;
    const scoreB = getPuzzleResolutionScore(recordB.puzzle) || 0;
    if (sortMode === 'difficulty-asc') {
      return scoreA - scoreB || sizeDiff || recordA.exportIndex - recordB.exportIndex;
    }
    if (sortMode === 'size-asc') {
      return sizeDiff || scoreB - scoreA || recordA.exportIndex - recordB.exportIndex;
    }
    return scoreB - scoreA || sizeDiff || recordA.exportIndex - recordB.exportIndex;
  });
  return sortedRecords;
}

function buildBatchZipEntries(records, sortMode = 'difficulty-desc') {
  const zipEntries = [];
  for (const record of sortBatchRecords(records, sortMode)) {
    const fileBaseName = buildKdpFileBaseName(record.puzzle, record.exportIndex);
    zipEntries.push({ name: `${fileBaseName}.png`, blob: record.blankBlob });
    zipEntries.push({ name: `${fileBaseName}_solution.png`, blob: record.solutionBlob });
  }
  return zipEntries;
}

function buildBatchZipFileName(batchPlan) {
  const label = batchPlan.map((entry) => `${entry.size}x${entry.size}`).join('_');
  return `akari_batch_${label}.zip`;
}

function buildKdpFileBaseName(puzzle, index = 1) {
  const difficultyScore = getPuzzleResolutionScore(puzzle);
  const scoreSegment = difficultyScore === null || difficultyScore === undefined
    ? 'na'
    : String(Math.round(difficultyScore)).padStart(2, '0');
  return `akari_${puzzle.width}x${puzzle.height}_${scoreSegment}_${String(index).padStart(3, '0')}`;
}

function exportPNG(showSolution) {
  if (!currentGrid) {
    statusMessage.textContent = 'Aucune grille a exporter. Generez d abord une grille.';
    return;
  }
  if (showSolution && !currentSolution) {
    statusMessage.textContent = isResolverMode()
      ? 'Aucune solution a exporter. Resous d abord la grille saisie.'
      : 'Aucune solution a exporter.';
    return;
  }

  const puzzle = buildCurrentPuzzleSnapshot();
  const filename = `${buildKdpFileBaseName(puzzle, 1)}${showSolution ? '_solution' : ''}.png`;
  downloadPuzzlePNG(puzzle, showSolution, filename).then(() => {
    statusMessage.textContent = showSolution ? 'Solution exportee en PNG KDP.' : 'Grille vierge exportee en PNG KDP.';
  }).catch(() => {
    statusMessage.textContent = 'L export a echoue. Reessayez.';
  });
}

function exportCompletedPNG() {
  if (!currentGrid || !playerGrid) {
    statusMessage.textContent = 'Aucune grille a exporter. Generez d abord une grille.';
    return;
  }

  validatePlayerGrid();
  const puzzle = buildCurrentPuzzleSnapshot();
  const filename = `${buildKdpFileBaseName(puzzle, 1)}_${puzzleCompleted ? 'completed' : 'state'}.png`;
  renderCompletedPuzzleToBlob(puzzle).then((blob) => {
    if (!blob) {
      throw new Error('PNG export failed');
    }
    downloadBlob(blob, filename);
    statusMessage.textContent = puzzleCompleted
      ? 'Grille completee N&B exportee en PNG KDP.'
      : 'Etat courant N&B exporte en PNG KDP.';
  }).catch(() => {
    statusMessage.textContent = 'L export a echoue. Reessayez.';
  });
}

function buildExportBoardSnapshot(puzzle, options = {}) {
  return {
    grid: puzzle.grid,
    solution: puzzle.solution,
    clues: puzzle.clues,
    width: puzzle.width,
    height: puzzle.height,
    playerGrid: options.playerGrid || null,
    noBulbCells: options.noBulbCells || new Set(),
    invalidBulbCells: options.invalidBulbCells || new Set(),
  };
}

function renderCanvasToPngBlob(exportCanvas) {
  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('PNG export failed'));
        return;
      }
      try {
        resolve(await patchPngDpiMetadata(blob, EXPORT_DPI));
      } catch (error) {
        reject(error);
      }
    }, 'image/png');
  });
}

async function patchPngDpiMetadata(blob, dpi) {
  const sourceBytes = new Uint8Array(await blob.arrayBuffer());
  const pngSignatureLength = 8;
  const targetPixelsPerMeter = Math.round(dpi / 0.0254);
  const outputParts = [sourceBytes.slice(0, pngSignatureLength)];
  let offset = pngSignatureLength;
  let inserted = false;

  while (offset < sourceBytes.length) {
    const length = readUint32BigEndian(sourceBytes, offset);
    const chunkStart = offset;
    const typeStart = offset + 4;
    const dataStart = offset + 8;
    const chunkEnd = dataStart + length + 4;
    const type = String.fromCharCode(
      sourceBytes[typeStart],
      sourceBytes[typeStart + 1],
      sourceBytes[typeStart + 2],
      sourceBytes[typeStart + 3],
    );

    if (type === 'pHYs') {
      outputParts.push(createPhysChunk(targetPixelsPerMeter));
      inserted = true;
    } else {
      outputParts.push(sourceBytes.slice(chunkStart, chunkEnd));
      if (type === 'IHDR' && !inserted) {
        outputParts.push(createPhysChunk(targetPixelsPerMeter));
        inserted = true;
      }
    }

    offset = chunkEnd;
  }

  return new Blob(outputParts, { type: 'image/png' });
}

function readUint32BigEndian(bytes, offset) {
  return ((bytes[offset] << 24) >>> 0)
    + ((bytes[offset + 1] << 16) >>> 0)
    + ((bytes[offset + 2] << 8) >>> 0)
    + (bytes[offset + 3] >>> 0);
}

function writeUint32BigEndian(bytes, offset, value) {
  bytes[offset] = (value >>> 24) & 0xff;
  bytes[offset + 1] = (value >>> 16) & 0xff;
  bytes[offset + 2] = (value >>> 8) & 0xff;
  bytes[offset + 3] = value & 0xff;
}

function createPhysChunk(pixelsPerMeter) {
  const chunk = new Uint8Array(21);
  writeUint32BigEndian(chunk, 0, 9);
  chunk.set([112, 72, 89, 115], 4);
  writeUint32BigEndian(chunk, 8, pixelsPerMeter);
  writeUint32BigEndian(chunk, 12, pixelsPerMeter);
  chunk[16] = 1;
  writeUint32BigEndian(chunk, 17, crc32(chunk.slice(4, 17)));
  return chunk;
}

function renderPuzzleToBlob(puzzle, showSolution) {
  const board = buildExportBoardSnapshot(puzzle);
  const variant = showSolution ? 'solution' : 'puzzle';
  const layout = buildExportLayout(board, variant);
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = layout.canvasWidth;
  exportCanvas.height = layout.canvasHeight;
  const exportCtx = exportCanvas.getContext('2d');
  renderExportBoard(exportCtx, board, { variant, showSolution });
  return renderCanvasToPngBlob(exportCanvas);
}

function renderCompletedPuzzleToBlob(puzzle = buildCurrentPuzzleSnapshot()) {
  const board = buildExportBoardSnapshot(puzzle, {
    playerGrid,
    noBulbCells,
    invalidBulbCells,
  });
  const layout = buildExportLayout(board, 'completed');
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = layout.canvasWidth;
  exportCanvas.height = layout.canvasHeight;
  const exportCtx = exportCanvas.getContext('2d');
  renderExportBoard(exportCtx, board, {
    variant: 'completed',
    showPlayer: true,
  });
  return renderCanvasToPngBlob(exportCanvas);
}

async function printCurrentGrid() {
  if (!currentGrid) {
    statusMessage.textContent = 'Aucune grille Ã  imprimer.';
    return;
  }
  const puzzle = buildCurrentPuzzleSnapshot();
  const blob = isResolverMode() && currentSolution
    ? await renderCompletedPuzzleToBlob()
    : await renderPuzzleToBlob(puzzle, false);
  if (!blob) {
    statusMessage.textContent = 'Lâ€™impression a Ã©chouÃ©.';
    return;
  }
  const url = URL.createObjectURL(blob);
  const printWindow = window.open('', '_blank', 'noopener');
  if (!printWindow) {
    URL.revokeObjectURL(url);
    statusMessage.textContent = 'Impossible dâ€™ouvrir la fenÃªtre dâ€™impression.';
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <title>Impression Akari</title>
      <style>
        body { margin: 0; display: grid; place-items: center; min-height: 100vh; background: #ffffff; }
        img { max-width: 96vw; max-height: 96vh; }
        @media print { body { padding: 0; } img { max-width: 100%; max-height: 100%; } }
      </style>
    </head>
    <body><img src="${url}" alt="Grille Akari Ã  imprimer" /></body>
    </html>
  `);
  printWindow.document.close();
  const image = printWindow.document.querySelector('img');
  image.addEventListener('load', () => {
    printWindow.focus();
    printWindow.print();
    URL.revokeObjectURL(url);
  }, { once: true });
  statusMessage.textContent = 'FenÃªtre dâ€™impression ouverte.';
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
  const canvasX = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const canvasY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  if (dismissCompletionOverlayAt(canvasX, canvasY)) {
    return;
  }
  const x = Math.floor(canvasX / cellSize);
  const y = Math.floor(canvasY / cellSize);
  if (x < 0 || y < 0 || y >= currentGrid.length || x >= currentGrid[0].length) {
    return;
  }
  if (isResolverMode()) {
    handleResolverCanvasClick(x, y, event.button);
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

function handleResolverCanvasClick(x, y, button) {
  clearResolverSolutionState();
  if (button === 2) {
    clearResolverCell(x, y);
  } else {
    setResolverCell(x, y, resolverTool);
  }
  renderGrid(false, false);
  statusMessage.textContent = 'Grille mise Ã  jour. Clique sur Â« RÃ©soudre Â» pour tester la solution.';
}

function dismissCompletionOverlayAt(x, y) {
  if (!puzzleCompleted || completionOverlayDismissed) {
    return false;
  }
  const rect = getCompletionOverlayRect(canvas.width, canvas.height, cellSize);
  const insideOverlay = x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  if (!insideOverlay) {
    return false;
  }
  completionOverlayDismissed = true;
  celebrationUntil = 0;
  statusMessage.textContent = 'Grille rÃ©solue.';
  renderGrid(false, true);
  return true;
}

function switchToGeneratorMode() {
  appMode = 'generator';
  resolverToggle.checked = false;
  updateModeUI();
}

async function solveResolverPuzzle() {
  if (!currentGrid || !currentClues || !isResolverMode()) {
    statusMessage.textContent = 'Passe en mode resolver pour saisir une grille.';
    return;
  }
  clearResolverSolutionState();
  const analysis = analyzeAkariSolutions(currentGrid, currentClues, 2, 2500);
  const resolverPuzzle = buildCurrentPuzzleSnapshot();
  if (analysis.count === 0) {
    switchToGeneratorMode();
    updateDifficultyInfo();
    await generatePuzzle({ statusPrefix: 'Erreur : cette grille nâ€™est pas rÃ©solvable.' });
    return;
  }
  if (analysis.count > 1 || !analysis.solution) {
    switchToGeneratorMode();
    updateDifficultyInfo();
    await generatePuzzle({ statusPrefix: 'Erreur : cette grille nâ€™a pas de solution unique.' });
    return;
  }
  resolverPuzzle.solution = analysis.solution;
  resolverPuzzle.evaluatedDifficulty = evaluatePuzzleDifficulty(
    resolverPuzzle.grid,
    resolverPuzzle.clues,
    resolverPuzzle.solution,
  );
  switchToGeneratorMode();
  setCurrentPuzzle(resolverPuzzle);
  renderGrid(false, true);
  difficultyInfo.textContent = `Grille perso : ${resolverPuzzle.width}Ã—${resolverPuzzle.height} Â· solution unique confirmÃ©e`;
  updateDifficultyScore(resolverPuzzle);
  statusMessage.textContent = 'Grille perso importÃ©e en mode normal.';
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
    puzzleCompleted = false;
    completionOverlayDismissed = false;
    celebrationUntil = 0;
    statusMessage.textContent = 'Attention : conflit dÃ©tectÃ© ! Les erreurs sont surlignÃ©es en rouge.';
  } else if (solved) {
    statusMessage.textContent = 'Bravo, la grille est rÃ©solue !';
    if (!puzzleCompleted) {
      puzzleCompleted = true;
      completionOverlayDismissed = false;
      startCompletionCelebration();
    }
  } else {
    puzzleCompleted = false;
    completionOverlayDismissed = false;
    celebrationUntil = 0;
    statusMessage.textContent = 'Aucune erreur dÃ©tectÃ©e pour lâ€™instant. Continue.';
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

function countWhiteComponents(grid) {
  const height = grid.length;
  const width = grid[0].length;
  const visited = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  let componentCount = 0;

  function inBounds(x, y) {
    return x >= 0 && y >= 0 && x < width && y < height;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] !== 0 || visited[y][x]) {
        continue;
      }
      componentCount += 1;
      const stack = [[x, y]];
      visited[y][x] = true;
      while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        for (const { dx, dy } of directions) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (!inBounds(nx, ny) || grid[ny][nx] !== 0 || visited[ny][nx]) {
            continue;
          }
          visited[ny][nx] = true;
          stack.push([nx, ny]);
        }
      }
    }
  }

  return componentCount;
}

function averageOpenSpan(grid) {
  const height = grid.length;
  const width = grid[0].length;
  const spans = [];

  function countDirection(x, y, dx, dy) {
    let steps = 0;
    let nx = x + dx;
    let ny = y + dy;
    while (nx >= 0 && ny >= 0 && nx < width && ny < height && grid[ny][nx] === 0) {
      steps += 1;
      nx += dx;
      ny += dy;
    }
    return steps;
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] !== 0) {
        continue;
      }
      const span = 1
        + countDirection(x, y, 1, 0)
        + countDirection(x, y, -1, 0)
        + countDirection(x, y, 0, 1)
        + countDirection(x, y, 0, -1);
      spans.push(span);
    }
  }

  return average(spans);
}

function getConstraintCoverage(grid, clues) {
  const height = grid.length;
  const width = grid[0].length;
  let constrainedWhiteCells = 0;
  let whiteCells = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (grid[y][x] !== 0) {
        continue;
      }
      whiteCells += 1;
      const adjacentNumbered = directions.some(({ dx, dy }) => {
        const nx = x + dx;
        const ny = y + dy;
        return nx >= 0
          && ny >= 0
          && nx < width
          && ny < height
          && grid[ny][nx] === 1
          && clues[ny][nx] !== null;
      });
      if (adjacentNumbered) {
        constrainedWhiteCells += 1;
      }
    }
  }

  return whiteCells === 0 ? 0 : constrainedWhiteCells / whiteCells;
}

function getAverageTraceCandidateWidth(solveTrace) {
  if (!Array.isArray(solveTrace) || solveTrace.length === 0) {
    return 0;
  }
  const widths = solveTrace
    .map((entry) => entry.candidateWidth)
    .filter((value) => typeof value === 'number' && value > 0);
  return average(widths);
}

function getMaxTraceWaveLength(solveTrace) {
  if (!Array.isArray(solveTrace) || solveTrace.length === 0) {
    return 0;
  }
  const waveLengths = new Map();
  for (const entry of solveTrace) {
    const current = waveLengths.get(entry.wave) || 0;
    waveLengths.set(entry.wave, current + 1);
  }
  return Math.max(...waveLengths.values());
}

function getLegacyGeneratorLevel(score) {
  if (score < 25) {
    return 'decouverte';
  }
  if (score < 40) {
    return 'facile';
  }
  if (score < 55) {
    return 'intermediaire';
  }
  if (score < 70) {
    return 'difficile';
  }
  if (score < 82) {
    return 'expert';
  }
  if (score < 90) {
    return 'niveau6';
  }
  if (score < 96) {
    return 'niveau7';
  }
  return 'niveau8';
}

function evaluateAkariDifficulty(grid, solution, clues, solveTrace = null) {
  const stats = {};
  const trace = Array.isArray(solveTrace) ? solveTrace : [];
  const logicSolution = logicSolveAkari(grid, clues, stats, trace);
  if (!logicSolution) {
    return null;
  }

  const height = grid.length;
  const width = grid[0].length;
  const area = width * height;
  const blackCells = countBlackCells(grid);
  const whiteCells = countWhiteCells(grid);
  const clueCount = countVisibleClues(clues);
  const histogram = getClueHistogram(clues);
  const highClues = histogram[3] + histogram[4];
  const zeroClues = histogram[0];
  const clueDensity = blackCells === 0 ? 0 : clueCount / blackCells;
  const whiteRatio = area === 0 ? 0 : whiteCells / area;
  const blackRatio = area === 0 ? 0 : blackCells / area;
  const componentCount = countWhiteComponents(grid);
  const openSpan = averageOpenSpan(grid);
  const traceStepCount = trace.length;
  const indirectSteps = getIndirectStepCount(stats);
  const assumptionSteps = trace.filter((entry) => entry.assumption).length;
  const averageCandidateWidth = getAverageTraceCandidateWidth(trace)
    || (stats.candidateWidthSamples ? stats.candidateWidthTotal / stats.candidateWidthSamples : 0);
  const averageRemainingPossibilities = stats.remainingPossibilitiesSamples
    ? stats.remainingPossibilitiesTotal / stats.remainingPossibilitiesSamples
    : whiteCells;
  const maxWaveLength = getMaxTraceWaveLength(trace) || stats.maxPropagationWaveLength || 0;
  const constraintCoverage = getConstraintCoverage(grid, clues);
  const traceDensity = whiteCells === 0 ? 0 : traceStepCount / whiteCells;
  const iterationDensity = whiteCells === 0 ? 0 : (stats.iterations || 0) / whiteCells;

  const logicalDepthScore = clampDifficultyScore(
    (indirectSteps * 18)
    + (assumptionSteps * 28)
    + (stats.maxPropagationDepth * 5)
    + (iterationDensity * 35),
  );
  const logicalConstraintScore = clampDifficultyScore(
    (1 - constraintCoverage) * 70
    + (highClues === 0 ? 18 : Math.max(0, 16 - highClues * 2))
    + Math.max(0, zeroClues - highClues) * 1.5,
  );
  const logicalPropagationScore = clampDifficultyScore(
    (traceDensity * 55)
    + (maxWaveLength * 7)
    + (stats.singleSourceBulbs * 0.7)
    + (stats.clueBulbs * 0.18)
    + (stats.clueCrosses * 0.12),
  );
  const logicalAmbiguityScore = clampDifficultyScore(
    (Math.max(0, averageCandidateWidth - 1) * 18)
    + ((averageRemainingPossibilities / Math.max(1, whiteCells)) * 18)
    + (indirectSteps * 12),
  );
  const logicalClueDensityScore = clampDifficultyScore(
    Math.max(0, 100 - (clueDensity * 22 + constraintCoverage * 35)),
  );

  const rawLogicalScore = clampDifficultyScore(weightedDifficultyScore(DIFFICULTY_WEIGHTS.logical, {
    depth: logicalDepthScore,
    constraints: logicalConstraintScore,
    propagation: logicalPropagationScore,
    ambiguity: logicalAmbiguityScore,
    clueDensity: logicalClueDensityScore,
  }));
  const guidedPuzzleDiscount = computeGuidedPuzzleDiscount({
    width,
    height,
    clueDensity,
    constraintCoverage,
    averageCandidateWidth,
    indirectSteps,
    assumptionSteps,
    highClues,
    zeroClues,
  });
  const logicalScore = clampDifficultyScore(rawLogicalScore - guidedPuzzleDiscount);

  const sizeScore = interpolateSizeScore(width, height);
  const whiteCellScore = interpolateRangeScore(whiteCells, 6, 320);
  const openSpaceScore = clampDifficultyScore((openSpan - 3) * 10);
  const fragmentationScore = clampDifficultyScore(
    componentCount <= 1 ? 100 : Math.max(0, 100 - ((componentCount - 1) * 14)),
  );
  const visualDensityScore = clampDifficultyScore(
    (clueDensity * 28) + (blackRatio * 120) + (whiteRatio * 18),
  );

  const perceivedScore = clampDifficultyScore(weightedDifficultyScore(DIFFICULTY_WEIGHTS.perceived, {
    size: sizeScore,
    whiteCells: whiteCellScore,
    openSpaces: openSpaceScore,
    fragmentation: fragmentationScore,
    visualDensity: visualDensityScore,
  }));

  const finalScore = clampDifficultyScore(weightedDifficultyScore(DIFFICULTY_WEIGHTS.final, {
    logical: logicalScore,
    perceived: perceivedScore,
  }));
  const displayLevel = getDifficultyBandLabel(finalScore);
  const legacyLevel = getLegacyGeneratorLevel(finalScore);

  return {
    level: legacyLevel,
    label: difficultyPresets[legacyLevel].label,
    displayLevel,
    logicalScore,
    perceivedScore,
    finalScore,
    resolutionScore: finalScore,
    sizeLabel: `${width}x${height}`,
    blackCells,
    whiteCells,
    clueCount,
    resolutionSteps: traceStepCount,
    stats,
    histogram,
    solveTrace: trace,
    metrics: {
      area,
      clueDensity,
      whiteRatio,
      blackRatio,
      componentCount,
      openSpan,
      averageCandidateWidth,
      averageRemainingPossibilities,
      maxWaveLength,
      constraintCoverage,
    },
  };
}

function evaluatePuzzleDifficulty(grid, clues, solution = null) {
  return evaluateAkariDifficulty(grid, solution, clues);
}

function boardToSolution(board, width, height) {
  const solution = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (board[y][x] === 'bulb') {
        solution[y][x] = true;
      }
    }
  }
  return solution;
}

function analyzeAkariSolutions(grid, clues, maxSolutions = 2, timeBudget = 1500) {
  const height = grid.length;
  const width = grid[0].length;
  const startTime = performance.now();
  let solutionCount = 0;
  let firstSolution = null;

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
        if (!firstSolution) {
          firstSolution = boardToSolution(board, width, height);
        }
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
  return { count: solutionCount, solution: firstSolution };
}

function countAkariSolutions(grid, clues, maxSolutions = 2, timeBudget = 1500) {
  return analyzeAkariSolutions(grid, clues, maxSolutions, timeBudget).count;
}

function giveHint() {
  if (isResolverMode()) {
    statusMessage.textContent = 'Le mode resolver sert Ã  saisir et tester une grille. Utilise Â« RÃ©soudre Â» pour lancer le solveur.';
    return;
  }
  if (!currentGrid || !playerGrid) {
    statusMessage.textContent = 'Aucune grille en cours. GÃ©nÃ©rez d\'abord une grille.';
    return;
  }
  const step = findNextLogicalStep();
  if (!step) {
    statusMessage.textContent = 'Impossible de trouver un pas logique. La grille n\'est peut-Ãªtre pas rÃ©soluble logiquement.';
    return;
  }
  const { x, y, type } = step;
  if (type === 'bulb') {
    noBulbCells.delete(cellKey(x, y));
    playerGrid[y][x] = true;
    validatePlayerGrid();
    renderGrid(false, true);
    statusMessage.textContent = `Indice : placer une ampoule Ã  (${x + 1}, ${y + 1}).`;
  } else if (type === 'no-bulb') {
    playerGrid[y][x] = false;
    noBulbCells.add(cellKey(x, y));
    validatePlayerGrid();
    renderGrid(false, true);
    statusMessage.textContent = `Indice : aucune ampoule Ã  (${x + 1}, ${y + 1}).`;
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

function updateBatchButtonLabel() {
  const count = getBatchCount();
  const preset = difficultyPresets[currentDifficulty];
  const label = preset?.fileLabel || preset?.label || 'grilles';
  batchGenerateButton.textContent = `Générer ${count} grille${count > 1 ? 's' : ''} ${label} + solution${count > 1 ? 's' : ''}`;
}

function buildBatchPlan() {
  const preset = difficultyPresets[currentDifficulty];
  const { width } = getCandidateDimensions(preset);
  return [{
    size: width,
    count: getBatchCount(),
    preset,
  }];
}

function setControlsDisabled(disabled) {
  generateButton.disabled = disabled;
  batchGenerateButton.disabled = disabled;
  hintButton.disabled = disabled;
  if (batchSizeFilterInput) {
    batchSizeFilterInput.disabled = disabled;
  }
  if (batchSortSelect) {
    batchSortSelect.disabled = disabled;
  }
  applyResolverSizeButton.disabled = disabled;
  solveResolverButton.disabled = disabled;
  printButton.disabled = disabled;
  resolverToolButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

async function generateBatchFiles() {
  const activeGeneration = generationId + 1;
  generationId = activeGeneration;
  generationCancelled = false;
  const batchPlan = buildBatchPlan();
  const planEntry = batchPlan[0];
  const totalCount = planEntry.count;
  let lastPuzzle = null;
  const generatedRecords = [];
  setControlsDisabled(true);
  setCancelGenerationVisible(true);

  try {
    for (let index = 1; index <= totalCount; index += 1) {
      let failureCount = 0;
      let puzzle = null;

      while (!puzzle && !isGenerationCancelled(activeGeneration)) {
        statusMessage.textContent = failureCount === 0
          ? `Génération ${index}/${totalCount} (${planEntry.size}x${planEntry.size})...`
          : `Échec ${failureCount} pour la grille ${index}/${totalCount}. Nouvelle tentative...`;
        await waitForPaint();
        if (isGenerationCancelled(activeGeneration)) {
          break;
        }
        puzzle = await generatePuzzleData(planEntry.preset, activeGeneration);
        if (!puzzle) {
          failureCount += 1;
        }
      }

      if (isGenerationCancelled(activeGeneration)) {
        statusMessage.textContent = generatedRecords.length > 0
          ? `Batch annulé après ${generatedRecords.length} grille${generatedRecords.length > 1 ? 's' : ''} validée${generatedRecords.length > 1 ? 's' : ''}.`
          : 'Batch annulé.';
        return;
      }

      lastPuzzle = puzzle;
      const blankBlob = await renderPuzzleToBlob(puzzle, false);
      const solutionBlob = await renderPuzzleToBlob(puzzle, true);
      if (!blankBlob || !solutionBlob) {
        statusMessage.textContent = `L'export PNG a échoué à la génération ${index}/${totalCount}.`;
        return;
      }

      generatedRecords.push({
        puzzle,
        blankBlob,
        solutionBlob,
        exportIndex: index,
      });
    }

    const zipEntries = buildBatchZipEntries(generatedRecords);

    if (lastPuzzle) {
      setCurrentPuzzle(lastPuzzle);
      renderGrid(false, true);
      updateDifficultyScore(lastPuzzle);
    }

    statusMessage.textContent = 'Création du fichier ZIP...';
    await waitForPaint();
    const zipBlob = await createZipBlob(zipEntries);
    downloadBlob(zipBlob, buildBatchZipFileName(planEntry.preset, totalCount));
    statusMessage.textContent = `${generatedRecords.length} grille${generatedRecords.length > 1 ? 's' : ''} exportée${generatedRecords.length > 1 ? 's' : ''} avec solutions dans un ZIP.`;
  } finally {
    setCancelGenerationVisible(false);
    setControlsDisabled(false);
  }
}

function buildBatchZipEntries(records) {
  const zipEntries = [];
  for (const record of records) {
    const fileBaseName = buildKdpFileBaseName(record.puzzle, record.exportIndex);
    zipEntries.push({ name: `${fileBaseName}.png`, blob: record.blankBlob });
    zipEntries.push({ name: `${fileBaseName}_solution.png`, blob: record.solutionBlob });
  }
  return zipEntries;
}

function buildBatchZipFileName(preset, count) {
  const label = getBatchFileLabel(preset);
  return `${label} - ${count} grille${count > 1 ? 's' : ''}.zip`;
}

function applyResolverSize(silent = false) {
  const { width, height } = getResolverDimensions();
  currentGrid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
  currentClues = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
  currentSolution = null;
  currentEvaluatedDifficulty = null;
  resetPuzzleState(width, height);
  renderGrid(false, false);
  updateDifficultyInfo();
  if (!silent) {
    statusMessage.textContent = `Grille resolver ${width}x${height} prête à être saisie.`;
  }
}

function updateBatchButtonLabel() {
  const count = getBatchCount();
  batchGenerateButton.textContent = `Générer ${count} grille${count > 1 ? 's' : ''} + solution${count > 1 ? 's' : ''}`;
}

function formatGenerationSuccessMessage(puzzle) {
  const score = getPuzzleResolutionScore(puzzle);
  const sizeLabel = `${puzzle.width}x${puzzle.height}`;
  return score
    ? `Grille générée (${sizeLabel}, difficulté ${score}/100).`
    : `Grille générée (${sizeLabel}).`;
}

function updateDifficultyScore(puzzle) {
  if (!difficultyScore) {
    return;
  }
  const score = getPuzzleResolutionScore(puzzle);
  difficultyScore.textContent = score
    ? `Score de difficulté : ${score}/100`
    : 'Score de difficulté : --/100';
  if (puzzle?.evaluatedDifficulty) {
    renderDifficultyDetails(puzzle);
  } else {
    resetDifficultyDetails();
  }
}

function exportPNG(showSolution) {
  if (!currentGrid) {
    statusMessage.textContent = 'Aucune grille à exporter. Générer d’abord une grille.';
    return;
  }
  if (showSolution && !currentSolution) {
    statusMessage.textContent = isResolverMode()
      ? 'Aucune solution à exporter. Résous d’abord la grille saisie.'
      : 'Aucune solution à exporter.';
    return;
  }
  const puzzle = buildCurrentPuzzleSnapshot();
  const filename = `${showSolution ? 'sol-' : ''}${buildExportBaseName(puzzle)}.png`;
  downloadPuzzlePNG(puzzle, showSolution, filename).then(() => {
    statusMessage.textContent = showSolution
      ? 'Solution exportée en PNG HD.'
      : 'Grille vierge exportée en PNG HD.';
  }).catch(() => {
    statusMessage.textContent = 'L’export a échoué. Réessayez.';
  });
}

function exportCompletedPNG() {
  if (!currentGrid || !playerGrid) {
    statusMessage.textContent = 'Aucune grille à exporter. Générer d’abord une grille.';
    return;
  }
  validatePlayerGrid();
  const puzzle = buildCurrentPuzzleSnapshot();
  const filename = `${puzzleCompleted ? 'completee' : 'etat'}-${buildExportBaseName(puzzle)}-nb.png`;
  renderCompletedPuzzleToBlob().then((blob) => {
    if (!blob) {
      throw new Error('PNG export failed');
    }
    downloadBlob(blob, filename);
    statusMessage.textContent = puzzleCompleted
      ? 'Grille complétée N&B exportée en PNG HD.'
      : 'État courant N&B exporté en PNG HD.';
  }).catch(() => {
    statusMessage.textContent = 'L’export a échoué. Réessayez.';
  });
}

async function generatePuzzle(options = {}) {
  const statusPrefix = options.statusPrefix || '';
  const withPrefix = (message) => statusPrefix ? `${statusPrefix} ${message}` : message;
  const activeGeneration = generationId + 1;
  generationId = activeGeneration;
  generationCancelled = false;
  setControlsDisabled(true);
  setCancelGenerationVisible(true);
  statusMessage.textContent = withPrefix('Génération en cours...');
  updateDifficultyScore(null);
  let failureCount = 0;

  try {
    const preset = difficultyPresets[currentDifficulty];
    while (!isGenerationCancelled(activeGeneration)) {
      await waitForPaint();
      if (isGenerationCancelled(activeGeneration)) {
        break;
      }

      const puzzle = await generatePuzzleData(preset, activeGeneration);
      if (isGenerationCancelled(activeGeneration)) {
        break;
      }

      if (puzzle) {
        setCurrentPuzzle(puzzle);
        renderGrid(false, true);
        updateDifficultyScore(puzzle);
        statusMessage.textContent = withPrefix(formatGenerationSuccessMessage(puzzle));
        return;
      }

      failureCount += 1;
      clearCurrentPuzzle();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      statusMessage.textContent = withPrefix(
        `Échec ${failureCount} : impossible de générer une grille logique pour ces critères. Nouvelle tentative...`
      );
    }

    statusMessage.textContent = failureCount > 0
      ? `Génération annulée après ${failureCount} échec${failureCount > 1 ? 's' : ''}.`
      : 'Génération annulée.';
  } finally {
    setCancelGenerationVisible(false);
    setControlsDisabled(false);
  }
}

async function generateBatchFiles() {
  const activeGeneration = generationId + 1;
  generationId = activeGeneration;
  generationCancelled = false;
  const batchPlan = buildBatchPlan();
  const planEntry = batchPlan[0];
  const totalCount = planEntry.count;
  let lastPuzzle = null;
  const generatedRecords = [];
  setControlsDisabled(true);
  setCancelGenerationVisible(true);

  try {
    for (let index = 1; index <= totalCount; index += 1) {
      let failureCount = 0;
      let puzzle = null;

      while (!puzzle && !isGenerationCancelled(activeGeneration)) {
        statusMessage.textContent = failureCount === 0
          ? `Génération ${index}/${totalCount} (${planEntry.size}x${planEntry.size})...`
          : `Échec ${failureCount} pour la grille ${index}/${totalCount}. Nouvelle tentative...`;
        await waitForPaint();
        if (isGenerationCancelled(activeGeneration)) {
          break;
        }
        puzzle = await generatePuzzleData(planEntry.preset, activeGeneration);
        if (!puzzle) {
          failureCount += 1;
        }
      }

      if (isGenerationCancelled(activeGeneration)) {
        statusMessage.textContent = generatedRecords.length > 0
          ? `Batch annulé après ${generatedRecords.length} grille${generatedRecords.length > 1 ? 's' : ''} validée${generatedRecords.length > 1 ? 's' : ''}.`
          : 'Batch annulé.';
        return;
      }

      lastPuzzle = puzzle;
      const blankBlob = await renderPuzzleToBlob(puzzle, false);
      const solutionBlob = await renderPuzzleToBlob(puzzle, true);
      if (!blankBlob || !solutionBlob) {
        statusMessage.textContent = `L'export PNG a échoué à la génération ${index}/${totalCount}.`;
        return;
      }

      generatedRecords.push({
        puzzle,
        blankBlob,
        solutionBlob,
        exportIndex: index,
      });
    }

    const zipEntries = buildBatchZipEntries(generatedRecords);

    if (lastPuzzle) {
      setCurrentPuzzle(lastPuzzle);
      renderGrid(false, true);
      updateDifficultyScore(lastPuzzle);
    }

    statusMessage.textContent = 'Création du fichier ZIP...';
    await waitForPaint();
    const zipBlob = await createZipBlob(zipEntries);
    downloadBlob(zipBlob, buildBatchZipFileName(planEntry.preset, totalCount));
    statusMessage.textContent = `${generatedRecords.length} grille${generatedRecords.length > 1 ? 's' : ''} exportée${generatedRecords.length > 1 ? 's' : ''} avec solutions dans un ZIP.`;
  } finally {
    setCancelGenerationVisible(false);
    setControlsDisabled(false);
  }
}

window.addEventListener('DOMContentLoaded', init);






