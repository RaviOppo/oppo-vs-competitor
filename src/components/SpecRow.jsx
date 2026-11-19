'use client';

import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';
import { SPEC_FIELDS } from '../types/phone';

const winIcons = {
  oppo: <CheckCircle className="w-4 h-4 text-green-500" />,
  competitor: <CheckCircle className="w-4 h-4 text-red-500" />,
  tie: <MinusCircle className="w-4 h-4 text-amber-500" />,
  null: null,
};

const winLabels = {
  oppo: <span className="text-xs px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded-full font-medium">OPPO Unggul</span>,
  competitor: <span className="text-xs px-1.5 py-0.5 bg-red-500/10 text-red-500 rounded-full font-medium">Kompetitor Unggul</span>,
  tie: <span className="text-xs px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded-full font-medium">Serupa</span>,
  null: null,
};

function simpleCompare(fieldKey, oppoVal, compVal) {
  if (!oppoVal || oppoVal === '-' || !compVal || compVal === '-') return null;

  // Color OS (OPPO) always wins on OS field
  if (fieldKey === 'os') {
    const oppoOS = oppoVal.toLowerCase();
    if (oppoOS.includes('coloros') || oppoOS.includes('color os')) {
      return 'oppo';
    }
  }

  const field = SPEC_FIELDS.find(f => f.key === fieldKey);

  // Extract numbers for comparison
  const extractNumbers = (str) => {
    const matches = str.match(/[\d.]+/g);
    return matches ? matches.map(Number) : [];
  };

  const oppoNums = extractNumbers(oppoVal);
  const compNums = extractNumbers(compVal);

  if (oppoNums.length === 0 && compNums.length === 0) return null;

  // For harga, lower is better
  if (fieldKey === 'harga') {
    const oppoMin = Math.min(...oppoNums);
    const compMin = Math.min(...compNums);
    if (oppoMin < compMin) return 'oppo';
    if (compMin < oppoMin) return 'competitor';
    return 'tie';
  }

  // For battery, extract mAh and W
  if (fieldKey === 'baterai') {
    const oppoMAh = oppoNums.find(n => n >= 1000) || 0;
    const compMAh = compNums.find(n => n >= 1000) || 0;
    const oppoWatt = oppoNums.find(n => n < 1000 && n > 10) || 0;
    const compWatt = compNums.find(n => n < 1000 && n > 10) || 0;

    if (oppoMAh !== compMAh) return oppoMAh > compMAh ? 'oppo' : 'competitor';
    if (oppoWatt !== compWatt) return oppoWatt > compWatt ? 'oppo' : 'competitor';
    return 'tie';
  }

  // For RAM/ROM, compare highest RAM then ROM
  if (fieldKey === 'ramRom') {
    const oppoRAM = Math.max(...oppoNums.filter(n => n <= 24)) || 0;
    const compRAM = Math.max(...compNums.filter(n => n <= 24)) || 0;
    if (oppoRAM !== compRAM) return oppoRAM > compRAM ? 'oppo' : 'competitor';

    const oppoROM = Math.max(...oppoNums.filter(n => n > 24)) || 0;
    const compROM = Math.max(...compNums.filter(n => n > 24)) || 0;
    if (oppoROM !== compROM) return oppoROM > compROM ? 'oppo' : 'competitor';
    return 'tie';
  }

  // For camera MP, compare highest MP
  if (fieldKey === 'rearCamera' || fieldKey === 'selfieCamera') {
    const oppoMax = Math.max(...oppoNums) || 0;
    const compMax = Math.max(...compNums) || 0;
    if (oppoMax !== compMax) return oppoMax > compMax ? 'oppo' : 'competitor';
    return 'tie';
  }

  // For screen refresh rate
  if (fieldKey === 'layar') {
    const oppoHz = oppoNums.find(n => n >= 60 && n <= 144) || 0;
    const compHz = compNums.find(n => n >= 60 && n <= 144) || 0;
    if (oppoHz !== compHz) return oppoHz > compHz ? 'oppo' : 'competitor';
    return 'tie';
  }

  // For chipset - rough comparison by known tiers (simplified)
  if (fieldKey === 'chipset') {
    const tierOrder = [
      'unisoc t7225', 'unisoc t7250', 'helio g81', 'helio g99', 'helio g100', 'helio g200',
      'dimensity 6360', 'dimensity 7100', 'dimensity 7300', 'dimensity 7360', 'dimensity 7400', 'dimensity 7400 turbo', 'dimensity 8400', 'dimensity 8400 ultimate',
      'snapdragon 685', 'snapdragon 6 gen 3', 'snapdragon 7 gen 4', 'snapdragon 7 gen',
      'exynos 1680', 'exynos 2400',
      'mtk 9500', 'qs 6 gen 5',
    ];
    const oppoLower = oppoVal.toLowerCase();
    const compLower = compVal.toLowerCase();
    const oppoIdx = tierOrder.findIndex(t => oppoLower.includes(t));
    const compIdx = tierOrder.findIndex(t => compLower.includes(t));
    if (oppoIdx >= 0 && compIdx >= 0) {
      if (oppoIdx > compIdx) return 'oppo';
      if (compIdx > oppoIdx) return 'competitor';
      return 'tie';
    }
  }

  // Default: longer string might mean more features (very rough)
  if (oppoVal.length !== compVal.length) {
    return oppoVal.length > compVal.length ? 'oppo' : 'competitor';
  }

  return 'tie';
}

export default function SpecRow({ label, oppoValue, competitorValue, isWinner }) {
  const winner = isWinner ?? simpleCompare(
    SPEC_FIELDS.find(f => f.label === label)?.key || '',
    oppoValue,
    competitorValue
  );

  const rowClass = winner === 'oppo' ? 'winner-oppo' : winner === 'competitor' ? 'winner-competitor' : '';
  const oppoClass = winner === 'oppo' ? 'win' : winner === 'competitor' ? 'lose' : '';
  const compClass = winner === 'competitor' ? 'win' : winner === 'oppo' ? 'lose' : '';

  return (
    <tr className={`spec-row ${rowClass}`}>
      <th className="px-4 py-3 text-left font-medium text-foreground w-36 shrink-0">
        {label}
        {winLabels[winner]}
      </th>
      <td className={`px-4 py-3 spec-value ${oppoClass}`}>
        <div className="flex items-center gap-2">
          {winIcons[winner] && winner === 'oppo' && winIcons.oppo}
          <span>{oppoValue || '-'}</span>
        </div>
      </td>
      <td className={`px-4 py-3 spec-value ${compClass}`}>
        <div className="flex items-center gap-2">
          {winIcons[winner] && winner === 'competitor' && winIcons.competitor}
          <span>{competitorValue || '-'}</span>
        </div>
      </td>
    </tr>
  );
}