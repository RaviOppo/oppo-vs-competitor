import fs from 'fs';
import path from 'path';

const OPPO_FILE = path.join(process.cwd(), 'src/data/oppo.json');
const COMPETITORS_FILE = path.join(process.cwd(), 'src/data/competitors.json');

function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

export function getOppoPhonesSync() {
  return readJson(OPPO_FILE);
}

export function getCompetitorPhonesSync() {
  return readJson(COMPETITORS_FILE);
}

export function saveOppoPhones(phones) {
  writeJson(OPPO_FILE, phones);
}

export function saveCompetitorPhones(phones) {
  writeJson(COMPETITORS_FILE, phones);
}