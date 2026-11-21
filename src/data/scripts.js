import SCRIPTS from './scripts.json';

export const SCRIPTS_DATA = SCRIPTS;

export function getScripts() {
  return SCRIPTS_DATA;
}

export function getScriptById(id) {
  return SCRIPTS_DATA.find(s => s.id === id);
}

export function getScriptTitles() {
  return SCRIPTS_DATA.map(s => ({ id: s.id, title: s.title }));
}