// ---------- Fristående ersättningar för Claude-specifika beroenden ----------
// Ikonerna (lucide-react) ersätts med emoji så appen inte behöver något ikonbibliotek.
function IconBase({ emoji, size = 20 }) {
  return React.createElement('span', { style: { fontSize: size, lineHeight: 1, display: 'inline-block' } }, emoji);
}
const ChefHat = (p) => React.createElement(IconBase, { emoji: '\u{1F468}\u200D\u{1F373}', ...p });
const CalendarDays = (p) => React.createElement(IconBase, { emoji: '\u{1F4C5}', ...p });
const BookOpen = (p) => React.createElement(IconBase, { emoji: '\u{1F4D6}', ...p });
const ShoppingCart = (p) => React.createElement(IconBase, { emoji: '\u{1F6D2}', ...p });
const Check = (p) => React.createElement(IconBase, { emoji: '\u2713', ...p });
const X = (p) => React.createElement(IconBase, { emoji: '\u2715', ...p });
const Plus = (p) => React.createElement(IconBase, { emoji: '\uFF0B', ...p });
const Lock = (p) => React.createElement(IconBase, { emoji: '\u{1F512}', ...p });
const Camera = (p) => React.createElement(IconBase, { emoji: '\u{1F4F7}', ...p });
const ImageIcon = (p) => React.createElement(IconBase, { emoji: '\u{1F5BC}\uFE0F', ...p });
const FileDown = (p) => React.createElement(IconBase, { emoji: '\u2B07\uFE0F', ...p });
const ExternalLink = (p) => React.createElement(IconBase, { emoji: '\u2197', ...p });
const Users = (p) => React.createElement(IconBase, { emoji: '\u{1F46A}', ...p });
// Star behöver visa fylld/ofylld skillnad (favorit-markering), så den hanteras separat från IconBase.
const Star = ({ size = 20, fill }) => React.createElement(IconBase, { emoji: fill && fill !== 'none' ? '\u2B50' : '\u2606', size });
const Maximize2 = (p) => React.createElement(IconBase, { emoji: '\u{1F5A5}\uFE0F', ...p });
const Award = (p) => React.createElement(IconBase, { emoji: '\u{1F3C5}', ...p });
const Pencil = (p) => React.createElement(IconBase, { emoji: '\u270F\uFE0F', ...p });

// ============================================================================
// DELA MELLAN KÖKSSKÄRM OCH TELEFONER (Firebase Realtime Database)
// ============================================================================
// Fyll i din egen Firebase-konfiguration här (se instruktionerna du fick).
// Så länge apiKey/databaseURL står tomma sparas allt bara lokalt på varje
// enhet för sig (fungerar fint, men synkas då inte mellan skärmen och telefoner).
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyA2GLfPQ1NbTlBtHWxoBbRqikDSL4usy64",
  authDomain: "veckomeny-yttervagen.firebaseapp.com",
  databaseURL: "https://veckomeny-yttervagen-default-rtdb.firebaseio.com",
  projectId: "veckomeny-yttervagen",
  storageBucket: "veckomeny-yttervagen.firebasestorage.app",
  messagingSenderId: "969039213607",
  appId: "1:969039213607:web:1277e05c2bae9bf85a8a02",
};

const firebaseConfigured = !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.databaseURL);
let db = null;
if (firebaseConfigured && window.firebase) {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.database();
  } catch (e) {
    console.error('Firebase kunde inte startas:', e);
    db = null;
  }
}
window.firebaseSyncEnabled = !!db;

function storageKeyPath(key) {
  return 'veckomeny/' + String(key).replace(/[.#$\[\]]/g, '_');
}

window.storage = {
  get: async (key) => {
    if (db) {
      const snap = await db.ref(storageKeyPath(key)).once('value');
      const val = snap.val();
      if (val === null || val === undefined) throw new Error('not-found');
      return { key, value: val, shared: true };
    }
    const v = localStorage.getItem('veckomeny:' + key);
    if (v === null) throw new Error('not-found');
    return { key, value: v, shared: false };
  },
  set: async (key, value) => {
    if (db) {
      await db.ref(storageKeyPath(key)).set(value);
      return { key, value, shared: true };
    }
    localStorage.setItem('veckomeny:' + key, value);
    return { key, value, shared: false };
  },
  delete: async (key) => {
    if (db) {
      await db.ref(storageKeyPath(key)).remove();
      return { key, deleted: true, shared: true };
    }
    localStorage.removeItem('veckomeny:' + key);
    return { key, deleted: true, shared: false };
  },
  // Endast tillgänglig när Firebase är konfigurerat: lyssnar på ändringar som
  // görs från en annan enhet (t.ex. någons telefon) och meddelar direkt.
  subscribe: db
    ? (key, callback) => {
        const ref = db.ref(storageKeyPath(key));
        const handler = (snap) => callback(snap.val());
        ref.on('value', handler);
        return () => ref.off('value', handler);
      }
    : null,
};

const { useState, useMemo, useEffect, useRef } = React;
