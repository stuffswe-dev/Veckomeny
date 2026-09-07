
const COLORS = {
  cream: '#FBF8F3',
  ink: '#2B2620',
  inkSoft: '#6B6255',
  forest: '#3F5D48',
  forestDark: '#2C4234',
  rust: '#B5533C',
  border: '#E4DCC9',
  sage: '#E7EBE1',
  plannedBg: '#DCEAD9',
  progressBg: '#F7E9D0',
  progressText: '#8A6A22',
  lockedBg: '#EFE3C7',
  fridayTint: '#FBE4D8',
  fridayAccent: '#D9643A',
};

// ---------- Tabell 1: Familj (grunddata, kan bytas ut med egna bilder i appen) ----------
const DEFAULT_FAMILY = [
  { name: 'Ebba', avatar: '👱‍♀️' },
  { name: 'Ruth', avatar: '👱‍♀️' },
  { name: 'Mamma', avatar: '👩' },
  { name: 'Pappa', avatar: '👨' },
];

// ---------- Tabell 2: Kategori ----------
const CATEGORIES = [
  { name: 'Kött', icon: '🥩', tint: '#F7E4DC', accent: '#B5533C' },
  { name: 'Fisk', icon: '🐟', tint: '#DCEEF2', accent: '#2E6E7E' },
  { name: 'Fågel & Veg', icon: '🥦', tint: '#E3EEDC', accent: '#4C7A3B' },
  { name: 'Barnfavoriter', icon: '🍕', tint: '#FCEFD1', accent: '#C9974B' },
];

function categoryOf(name) {
  return CATEGORIES.find((c) => c.name === name) || CATEGORIES[0];
}

// ---------- Klistermärken ----------
const BADGES = [
  { id: 'first-week', emoji: '🏅', name: 'Första veckan klar', desc: 'Lås din första kompletta vecka', check: (s) => s.lockCount >= 1 },
  { id: 'routine', emoji: '🗓️', name: 'Rutinmästare', desc: 'Lås 4 veckor totalt', check: (s) => s.lockCount >= 4 },
  { id: 'collector', emoji: '⭐', name: 'Samlare', desc: 'Markera 5 favoriträtter', check: (s) => s.favoritesCount >= 5 },
  { id: 'taster', emoji: '🍽️', name: 'Smakprovare', desc: 'Testa 5 olika rätter', check: (s) => s.triedCount >= 5 },
  { id: 'explorer', emoji: '🌍', name: 'Matutforskaren', desc: 'Testa 15 olika rätter', check: (s) => s.triedCount >= 15 },
  { id: 'friday', emoji: '🎉', name: 'Fredagsfirare', desc: 'Välj en fredagsmys-rätt på en fredag', check: (s) => s.fridayCount >= 1 },
  { id: 'family', emoji: '🧑‍🍳', name: 'Hela familjen lagar', desc: 'Låt alla i familjen välja minst en rätt var', check: (s) => s.chosenPersons.length >= s.familyLength },
];

// ---------- Tabell 3: Maträttsbibliotek ----------
// Baserat på riktiga recept (ICA.se m.fl.), anpassade för barn 6 och 9 år:
// kryddstyrkan är sänkt eller borttagen (mild curry/taco, ingen chili/sambal,
// nedtonad senap) och mängderna avser ca 4 portioner (2 vuxna + 2 barn).
const LIBRARY = [
  { id: 1, category: 'Kött', name: 'Köttbullar', image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/imagevaultfiles/id_223439/cf_259/klassiska_kottbullar.jpg', sourceUrl: 'https://www.ica.se/recept/klassiska-kottbullar-712807/' },
  { id: 2, category: 'Kött', name: 'Lasagne', image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/imagevaultfiles/id_223426/cf_259/klassisk_lasagne.jpg', sourceUrl: 'https://www.ica.se/recept/klassisk-lasagne-679675/' },
  { id: 3, category: 'Kött', name: 'Tacos', friday: true, image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/imagevaultfiles/id_166979/cf_259/tacos.jpg', sourceUrl: 'https://www.ica.se/recept/tacos-722416/' },
  { id: 4, category: 'Kött', name: 'Ugnskorv med mos', image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/p28zdwsotyviydhtnzpg.jpg', sourceUrl: 'https://www.ica.se/recept/ugnsbakad-falukorv-med-bostongurka-och-tomat-720168/' },
  { id: 5, category: 'Kött', name: 'Spaghetti köttfärssås', image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/hchsnpxo3gkm8zyzxp5j.jpg', sourceUrl: 'https://www.ica.se/recept/spaghetti-och-kottfarssas-712805/' },
  { id: 6, category: 'Kött', name: 'Hamburgare', friday: true, image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/mzzkxqtcxz5ja3q55lvv.jpg', sourceUrl: 'https://www.ica.se/recept/hamburgare-712808/' },
  { id: 7, category: 'Fisk', name: 'Laxpasta', image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/imagevaultfiles/id_230457/cf_259/kramig_laxpasta_med_grona_artor.jpg', sourceUrl: 'https://www.ica.se/recept/kramig-laxpasta-med-grona-artor-727972/' },
  { id: 8, category: 'Fisk', name: 'Fiskgratäng', image: 'https://assets.icanet.se/e_sharpen:80,q_auto,dpr_1.25,w_1200,h_1200,c_lfill/imagevaultfiles/id_238600/cf_259/fiskgratang_med_dill.jpg', sourceUrl: 'https://www.ica.se/recept/fiskgratang-med-dill-722240/' },
  { id: 9, category: 'Fisk', name: 'Fiskpinnar med mos', image: '🐟', sourceUrl: 'https://www.ica.se/recept/fiskpinnar-med-mos-och-varm-bonsallad-417416/' },
  { id: 10, category: 'Fisk', name: 'Fiskbullar i currysås', image: '🍛', sourceUrl: 'https://fridasrecept.blogg.se/2009/september/fiskbullar-i-currysas.html' },
  { id: 11, category: 'Fågel & Veg', name: 'Kycklinggryta', image: '🍗', sourceUrl: 'https://www.ica.se/recept/kycklinggryta-med-curry-och-kokosmjolk-728156/' },
  { id: 12, category: 'Fågel & Veg', name: 'Kycklingnuggets', friday: true, image: '🍗', sourceUrl: 'https://www.ica.se/recept/kycklingnuggets-med-tzatziki-720351/' },
  { id: 13, category: 'Fågel & Veg', name: 'Ugnsbakad kyckling', image: '🍗', sourceUrl: 'https://www.ica.se/recept/ugnsstekt-kyckling-med-klyftpotatis-717111/' },
  { id: 14, category: 'Fågel & Veg', name: 'Vegetarisk wok', image: '🥦', sourceUrl: 'https://www.ica.se/recept/wok-med-glasnudlar-och-kal-726415/' },
  { id: 15, category: 'Fågel & Veg', name: 'Broccolisoppa', soup: true, image: '🥣', sourceUrl: 'https://www.ica.se/recept/busenkel-broccolisoppa-712859/' },
  { id: 16, category: 'Barnfavoriter', name: 'Pizza', friday: true, image: '🍕', sourceUrl: 'https://www.ica.se/recept/pizza-pronto-713384/' },
  { id: 17, category: 'Barnfavoriter', name: 'Pannkakor', image: '🥞', sourceUrl: 'https://www.ica.se/recept/pannkakor-med-hallon-715087/' },
  { id: 18, category: 'Barnfavoriter', name: 'Makaroner med korv', image: '🍝', sourceUrl: 'https://www.ica.se/recept/falukorv-med-stuvade-makaroner-725260/' },
  { id: 19, category: 'Barnfavoriter', name: 'Wraps med kyckling', image: '🌯', sourceUrl: 'https://www.ica.se/recept/wrap-med-rokt-kyckling-och-tacofarskost-719230/' },
  { id: 20, category: 'Barnfavoriter', name: 'Nudlar med grönsaker', image: '🍜', sourceUrl: 'https://www.ica.se/recept/wok-med-glasnudlar-och-kal-726415/' },
  { id: 21, category: 'Kött', name: 'Pyttipanna', image: '🍳', sourceUrl: 'https://www.ica.se/recept/pytt-i-panna-med-bacon-och-majs-727568/' },
  { id: 22, category: 'Kött', name: 'Köttfärslimpa', image: '🍖', sourceUrl: 'https://www.ica.se/recept/kottfarslimpa-med-graddsas-723129/' },
  { id: 23, category: 'Kött', name: 'Kalops', image: '🍲', sourceUrl: 'https://www.ica.se/recept/klassisk-kalops-632631/' },
  { id: 24, category: 'Kött', name: 'Biff Stroganoff', image: '🥩', sourceUrl: 'https://www.viktvaktarna.se/se/recept/biff-stroganoff/5626eab43800b00b34e0636b' },
  { id: 25, category: 'Kött', name: 'Kroppkakor', image: '🥟', sourceUrl: 'https://www.ica.se/recept/kroppkakor-av-kokt-potatis-3693/' },
  { id: 26, category: 'Kött', name: 'Ärtsoppa med fläsk', soup: true, image: '🥣', sourceUrl: 'https://www.ica.se/recept/artsoppa-med-flask-729052/' },
  { id: 27, category: 'Fisk', name: 'Janssons frestelse', image: '🥘', sourceUrl: 'https://www.ica.se/recept/klassisk-janssons-frestelse-724714/' },
  { id: 28, category: 'Fisk', name: 'Fish and chips', friday: true, image: '🍟', sourceUrl: 'https://www.ica.se/recept/fishn-chips-715945/' },
  { id: 29, category: 'Fisk', name: 'Tonfiskpasta', image: '🐟', sourceUrl: 'https://www.ica.se/recept/tonfiskpasta-med-citron-och-basilika-725257/' },
  { id: 30, category: 'Fisk', name: 'Ugnsbakad lax med potatis', image: '🐟', sourceUrl: 'https://www.ica.se/recept/ugnsbakad-lax-med-dillsas-722491/' },
  { id: 31, category: 'Fisk', name: 'Fisksoppa', soup: true, image: '🥣', sourceUrl: 'https://www.ica.se/recept/kramig-fisksoppa-med-potatis-335611/' },
  { id: 32, category: 'Fågel & Veg', name: 'Flygande Jacob', image: '🍌', sourceUrl: 'https://ingmar.app/blogg/flygande-jacob-och-olika-satt-att-variera-den/' },
  { id: 33, category: 'Fågel & Veg', name: 'Kycklingfrikadeller', image: '🍗', sourceUrl: 'https://www.ica.se/recept/kycklingfrikadeller-i-tomatsas-715564/' },
  { id: 34, category: 'Fågel & Veg', name: 'Kycklingschnitzel', image: '🍗', sourceUrl: 'https://www.ica.se/recept/kycklingschnitzel-med-varm-paprika-och-tomatsallad-1142/' },
  { id: 35, category: 'Fågel & Veg', name: 'Grönsakslasagne', image: '🍝', sourceUrl: 'https://www.ica.se/recept/gronsakslasagne-714072/' },
  { id: 36, category: 'Barnfavoriter', name: 'Stuvade makaroner med stekt falukorv', image: '🌭', sourceUrl: 'https://www.bakoglass.se/recept/stuvade-makaroner-med-stekt-falukorv' },
  { id: 37, category: 'Barnfavoriter', name: 'Pasta Carbonara', image: '🍝', sourceUrl: 'https://www.mathem.se/se/recipes/1443-mari-bergman-barnens-pasta-carbonara/' },
  { id: 38, category: 'Barnfavoriter', name: 'Tomatsoppa med grillad ostmacka', soup: true, image: '🍅', sourceUrl: 'https://www.ica.se/recept/enkel-tomatsoppa-722050/' },
  { id: 39, category: 'Barnfavoriter', name: 'Ugnspannkaka med bacon', image: '🥞', sourceUrl: 'https://www.ica.se/recept/ugnspannkaka-med-bacon-och-morotter-723141/' },
  { id: 40, category: 'Barnfavoriter', name: 'Raggmunk med fläsk', image: '🥞', sourceUrl: 'https://www.ica.se/recept/raggmunk-med-flask-721803/' },
];

// ---------- Tabell 5: Ingredienser (keyed på Maträtt_ID), ca 4 portioner ----------
const INGREDIENTS = {
  1: [{ item: 'Blandfärs', amount: '500 g' }, { item: 'Gul lök', amount: '0,5 st' }, { item: 'Ströbröd', amount: '0,5 dl' }, { item: 'Vispgrädde', amount: '0,5 dl' }, { item: 'Mjölk', amount: '0,5 dl' }, { item: 'Ägg', amount: '1 st' }, { item: 'Potatis (till mos)', amount: '800 g' }, { item: 'Lingonsylt', amount: '2 msk' }],
  2: [{ item: 'Nötfärs', amount: '500 g' }, { item: 'Gul lök', amount: '2 st' }, { item: 'Krossade tomater', amount: '1 burk (390 g)' }, { item: 'Lasagneplattor', amount: '9 st' }, { item: 'Mjölk', amount: '10 dl' }, { item: 'Riven ost', amount: '2 dl' }, { item: 'Smör', amount: '90 g' }, { item: 'Vetemjöl', amount: '6 msk' }],
  3: [{ item: 'Nötfärs', amount: '500 g' }, { item: 'Tomat', amount: '2 st' }, { item: 'Gurka', amount: '1 st' }, { item: 'Rödlök', amount: '1 st' }, { item: 'Majskorn', amount: '340 g' }, { item: 'Isbergssallad', amount: '0,25 st' }, { item: 'Mild tacokrydda', amount: '1 påse (28 g)' }, { item: 'Tacoskal', amount: '12 st' }, { item: 'Riven ost', amount: '2 dl' }, { item: 'Mild salsasås', amount: '2 dl' }, { item: 'Gräddfil', amount: '2 dl' }],
  4: [{ item: 'Falukorv', amount: '550 g' }, { item: 'Potatis', amount: '900 g' }, { item: 'Mjölk', amount: '2 dl' }, { item: 'Riven ost', amount: '1 dl' }, { item: 'Ketchup', amount: '2 msk' }],
  5: [{ item: 'Nötfärs', amount: '500 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Morötter', amount: '2 st' }, { item: 'Krossade tomater', amount: '500 g' }, { item: 'Spaghetti', amount: '400 g' }, { item: 'Riven parmesan', amount: '1 dl' }],
  6: [{ item: 'Nötfärs', amount: '600 g' }, { item: 'Hamburgerbröd', amount: '4 st' }, { item: 'Ost', amount: '8 skivor' }, { item: 'Tomat', amount: '2 st' }, { item: 'Rödlök', amount: '1 st' }, { item: 'Sallad', amount: 'några blad' }],
  7: [{ item: 'Laxfilé', amount: '500 g' }, { item: 'Matlagningsgrädde', amount: '2,5 dl' }, { item: 'Mjölk', amount: '1,5 dl' }, { item: 'Pasta', amount: '400 g' }, { item: 'Gröna ärtor', amount: '250 g' }],
  8: [{ item: 'Vit fisk', amount: '600 g' }, { item: 'Potatis', amount: '900 g' }, { item: 'Vispgrädde', amount: '1,5 dl' }, { item: 'Mjölk', amount: '2 dl' }, { item: 'Riven ost', amount: '1,5 dl' }],
  9: [{ item: 'Fiskpinnar', amount: '16 st' }, { item: 'Potatis', amount: '900 g' }, { item: 'Mjölk', amount: '1 dl' }, { item: 'Smör', amount: '1 msk' }],
  10: [{ item: 'Fiskbullar (i lag)', amount: '1 burk (ca 800 g)' }, { item: 'Mjölk', amount: '2 dl' }, { item: 'Mild currypulver', amount: '1 tsk' }, { item: 'Ris', amount: '4 port' }],
  11: [{ item: 'Kycklinglårfilé', amount: '600 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Kokosmjölk', amount: '400 ml' }, { item: 'Mild curry', amount: '1 tsk' }, { item: 'Majskorn', amount: '425 g' }, { item: 'Ris', amount: '4 port' }],
  12: [{ item: 'Kycklingfilé', amount: '4 st' }, { item: 'Vetemjöl', amount: '1 dl' }, { item: 'Ägg', amount: '1 st' }, { item: 'Ströbröd', amount: '1 dl' }, { item: 'Ris', amount: '4 port' }],
  13: [{ item: 'Kycklingklubbor/lår', amount: '8 st' }, { item: 'Potatis', amount: '900 g' }, { item: 'Soja', amount: '2 msk' }, { item: 'Honung', amount: '1 msk' }, { item: 'Vitlöksklyfta', amount: '1 st' }],
  14: [{ item: 'Tofu', amount: '300 g' }, { item: 'Nudlar', amount: '300 g' }, { item: 'Broccoli', amount: '1 st' }, { item: 'Morötter', amount: '2 st' }, { item: 'Soja', amount: '2 msk' }],
  15: [{ item: 'Broccoli', amount: '250 g' }, { item: 'Potatis', amount: '300 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Grönsaksbuljong', amount: '9 dl' }, { item: 'Matlagningsgrädde', amount: '2,5 dl' }],
  16: [{ item: 'Pizzadeg med tomatsås (färdig)', amount: '4 st' }, { item: 'Mozzarella', amount: '2 st (125 g)' }, { item: 'Riven ost', amount: '2 dl' }, { item: 'Skinka', amount: '100 g' }],
  17: [{ item: 'Vetemjöl', amount: '2,5 dl' }, { item: 'Mjölk', amount: '6 dl' }, { item: 'Ägg', amount: '3 st' }, { item: 'Smör', amount: '2 msk' }, { item: 'Sylt', amount: 'till servering' }],
  18: [{ item: 'Makaroner', amount: '400 g' }, { item: 'Falukorv', amount: '1 st' }, { item: 'Mjölk', amount: '1 l' }, { item: 'Ketchup', amount: 'till servering' }],
  19: [{ item: 'Tortillabröd', amount: '4 st' }, { item: 'Rökt kyckling', amount: '120 g' }, { item: 'Färskost', amount: '200 g' }, { item: 'Majskorn', amount: '1 dl' }, { item: 'Tomat', amount: '2 st' }],
  20: [{ item: 'Nudlar', amount: '400 g' }, { item: 'Broccoli', amount: '1 st' }, { item: 'Spetskål', amount: '300 g' }, { item: 'Soja', amount: '2 msk' }],
  21: [{ item: 'Potatis (tärnad)', amount: '800 g' }, { item: 'Falukorv', amount: '300 g' }, { item: 'Bacon', amount: '140 g' }, { item: 'Ägg', amount: '4 st' }, { item: 'Inlagda rödbetor', amount: '1 burk (370 g)' }],
  22: [{ item: 'Blandfärs', amount: '500 g' }, { item: 'Ströbröd', amount: '0,5 dl' }, { item: 'Mjölk', amount: '1 dl' }, { item: 'Ägg', amount: '1 st' }, { item: 'Potatis', amount: '900 g' }, { item: 'Matlagningsgrädde', amount: '2,5 dl' }],
  23: [{ item: 'Nötkött (högrev)', amount: '800 g' }, { item: 'Morötter', amount: '4 st' }, { item: 'Gul lök', amount: '2 st' }, { item: 'Potatis', amount: '900 g' }, { item: 'Inlagda rödbetor', amount: '1 burk' }],
  24: [{ item: 'Lövbiff eller rostbiff', amount: '500 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Tomatpuré', amount: '2 msk' }, { item: 'Crème fraiche', amount: '2 dl' }, { item: 'Ris', amount: '4 port' }],
  25: [{ item: 'Potatis', amount: '1 kg' }, { item: 'Vetemjöl', amount: '2,5 dl' }, { item: 'Ägg', amount: '1 st' }, { item: 'Rimmat fläsk', amount: '150 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Lingonsylt', amount: '2 msk' }],
  26: [{ item: 'Gula ärtor (torkade)', amount: '5 dl' }, { item: 'Rimmat fläsklägg', amount: '900 g' }, { item: 'Gul lök', amount: '1 st' }],
  27: [{ item: 'Potatis', amount: '1 kg' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Ansjovisfiléer', amount: '1 burk (100 g)' }, { item: 'Vispgrädde', amount: '2 dl' }, { item: 'Mjölk', amount: '1 dl' }],
  28: [{ item: 'Vit fisk', amount: '600 g' }, { item: 'Ägg', amount: '1 st' }, { item: 'Panko eller ströbröd', amount: '2 dl' }, { item: 'Potatis', amount: '900 g' }, { item: 'Matyoghurt', amount: '2 dl' }],
  29: [{ item: 'Tonfisk (burk)', amount: '2 st (370 g)' }, { item: 'Broccoli', amount: '250 g' }, { item: 'Pasta', amount: '400 g' }, { item: 'Vispgrädde', amount: '3 dl' }],
  30: [{ item: 'Potatis', amount: '900 g' }, { item: 'Laxfiléer', amount: '4 st (500 g)' }, { item: 'Matlagningsgrädde', amount: '3 dl' }, { item: 'Färsk dill', amount: 'en ask' }, { item: 'Citron', amount: '1 st' }],
  31: [{ item: 'Potatis', amount: '600 g' }, { item: 'Morötter', amount: '2 st' }, { item: 'Vispgrädde', amount: '1 dl' }, { item: 'Vit fisk', amount: '500 g' }, { item: 'Fiskbuljongtärningar', amount: '2 st' }],
  32: [{ item: 'Kycklingfilé', amount: '600 g' }, { item: 'Bacon', amount: '140 g' }, { item: 'Bananer', amount: '2 st' }, { item: 'Vispgrädde', amount: '2,5 dl' }, { item: 'Ketchup', amount: '1 dl' }, { item: 'Ris', amount: '4 port' }],
  33: [{ item: 'Kycklingfärs', amount: '500 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Ströbröd', amount: '1 dl' }, { item: 'Krossade tomater', amount: '390 g' }, { item: 'Pasta', amount: '400 g' }, { item: 'Riven ost', amount: '1 dl' }],
  34: [{ item: 'Kycklingfiléer', amount: '4 st' }, { item: 'Vetemjöl', amount: '1 dl' }, { item: 'Ägg', amount: '1 st' }, { item: 'Ströbröd', amount: '1 dl' }, { item: 'Potatis', amount: '900 g' }],
  35: [{ item: 'Lasagneplattor', amount: '200 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Krossade tomater', amount: '500 g' }, { item: 'Zucchini', amount: '1 st (300 g)' }, { item: 'Crème fraiche', amount: '4 dl' }, { item: 'Riven ost', amount: '1 dl' }],
  36: [{ item: 'Falukorv', amount: '500 g' }, { item: 'Makaroner', amount: '4 dl' }, { item: 'Mjölk', amount: '7 dl' }, { item: 'Vetemjöl', amount: '2 msk' }, { item: 'Smör', amount: '25 g' }],
  37: [{ item: 'Pasta (spaghetti)', amount: '400 g' }, { item: 'Bacon', amount: '140 g' }, { item: 'Gul lök', amount: '1 st' }, { item: 'Äggulor', amount: '4 st' }, { item: 'Grädde', amount: '1 dl' }, { item: 'Riven ost', amount: '1 dl' }],
  38: [{ item: 'Gul lök', amount: '1 st' }, { item: 'Krossade tomater', amount: '2 burkar (800 g)' }, { item: 'Grönsaksbuljong', amount: '5 dl' }, { item: 'Bröd', amount: '8 skivor' }, { item: 'Ost', amount: '8 skivor' }],
  39: [{ item: 'Bacon', amount: '350 g' }, { item: 'Ägg', amount: '4 st' }, { item: 'Mjölk', amount: '8 dl' }, { item: 'Vetemjöl', amount: '4 dl' }, { item: 'Morötter', amount: '4 st' }, { item: 'Lingonsylt', amount: '1,5 dl' }],
  40: [{ item: 'Potatis', amount: '1 kg' }, { item: 'Vetemjöl', amount: '2 dl' }, { item: 'Mjölk', amount: '4 dl' }, { item: 'Ägg', amount: '2 st' }, { item: 'Rimmat sidfläsk', amount: '300 g' }, { item: 'Lingonsylt', amount: '2 msk' }],
};

const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag'];
const WEEK_LABELS = ['Denna vecka', 'Nästa vecka', 'Om 2 veckor'];
const EMOJI_FALLBACKS = ['🍽️', '😋', '🍲', '🥗', '🍰', '🧁'];

function emptyMenu() {
  return DAYS.reduce((acc, d) => ({ ...acc, [d]: { dishId: null, person: null } }), {});
}

// ---------- Tabell 4: Veckomeny (dummy-data för innevarande vecka) ----------
const INITIAL_MENU = {
  Måndag: { dishId: 1, person: 'Ebba' },
  Tisdag: { dishId: 16, person: 'Ruth' },
  Onsdag: { dishId: 11, person: 'Mamma' },
  Torsdag: { dishId: null, person: null },
  Fredag: { dishId: 3, person: 'Pappa' },
};

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function parseAmount(str) {
  const match = String(str).trim().match(/^([\d.,]+)\s*(.*)$/);
  if (!match) return { value: null, unit: str };
  const value = parseFloat(match[1].replace(',', '.'));
  if (Number.isNaN(value)) return { value: null, unit: str };
  return { value, unit: match[2].trim() };
}

function formatNumber(n) {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100).replace('.', ',');
}

function DishThumb({ image, boxSize, textSize }) {
  const isPhoto = typeof image === 'string' && (image.startsWith('data:') || image.startsWith('http'));
  if (isPhoto) return <img src={image} alt="" className={`${boxSize} rounded-xl object-cover flex-shrink-0`} />;
  return <span className={`${textSize} leading-none flex-shrink-0`}>{image}</span>;
}

// Visar en familjemedlems bild: riktigt foto (data-URL/http) eller en emoji
function PersonThumb({ avatar, boxSize, textSize }) {
  const isPhoto = typeof avatar === 'string' && (avatar.startsWith('data:') || avatar.startsWith('http'));
  if (isPhoto) return <img src={avatar} alt="" className={`${boxSize} rounded-full object-cover flex-shrink-0`} />;
  return <span className={`${textSize} leading-none flex-shrink-0`}>{avatar}</span>;
}

// Ett engångsregn av konfetti, avfyras genom att montera denna komponent med en ny key
function ConfettiBurst() {
  const colors = ['#C9974B', '#B5533C', '#3F5D48', '#2E6E7E', '#D9643A', '#4C7A3B'];
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        dx: (Math.random() - 0.5) * 160,
        rot: Math.random() * 720 - 360,
        duration: 1.1 + Math.random() * 0.8,
        delay: Math.random() * 0.15,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 6,
      })),
    []
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-16px',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            '--dx': `${p.dx}px`,
            '--rot': `${p.rot}deg`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

function MealPlanner() {
  const [view, setView] = useState('meny');
  const [activeCategory, setActiveCategory] = useState('Alla');
  const [sheet, setSheet] = useState(null);
  const [sheetCategory, setSheetCategory] = useState('Alla');

  const [customDishes, setCustomDishes] = useState([]);
  const [customIngredients, setCustomIngredients] = useState({});
  const [storageReady, setStorageReady] = useState(false);

  const [addDishOpen, setAddDishOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftCategory, setDraftCategory] = useState(null);
  const [draftImage, setDraftImage] = useState(null);
  const [draftImageUrl, setDraftImageUrl] = useState('');
  const [draftIngredientsText, setDraftIngredientsText] = useState('');
  const [draftFriday, setDraftFriday] = useState(false);
  const [draftSoup, setDraftSoup] = useState(false);
  const fileInputRef = useRef(null);

  const [family, setFamily] = useState(DEFAULT_FAMILY);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [editingFamilyIndex, setEditingFamilyIndex] = useState(null);
  const [familyUrlDraft, setFamilyUrlDraft] = useState('');
  const familyFileInputRef = useRef(null);

  const [favorites, setFavorites] = useState([]);
  const [servings, setServings] = useState(4);
  const [todayMode, setTodayMode] = useState(false);

  const [confettiBurst, setConfettiBurst] = useState(0);
  const triggerConfetti = () => setConfettiBurst((n) => n + 1);

  const [boxOpening, setBoxOpening] = useState(false);

  const [triedDishIds, setTriedDishIds] = useState([]);
  const [chosenPersons, setChosenPersons] = useState([]);
  const [lockCount, setLockCount] = useState(0);
  const [fridayCount, setFridayCount] = useState(0);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [newBadgeBanner, setNewBadgeBanner] = useState(null);
  const prevBadgeCountRef = useRef(null);
  const skipAchievementsSaveRef = useRef(false);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    // Räknar om vilken vecka som är "denna vecka" med jämna mellanrum, så en
    // skärm som står påslagen i köket dygnet runt ändå hänger med när en ny
    // vecka börjar (annars fastnar den på veckan appen råkade starta i).
    const id = setInterval(() => setNow(new Date()), 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const weeks = useMemo(() => {
    return [0, 1, 2].map((offset) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offset * 7);
      return { offset, weekNumber: getISOWeek(d), key: `${d.getFullYear()}-${getISOWeek(d)}`, label: WEEK_LABELS[offset] };
    });
  }, [now]);

  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);
  const [weeklyMenus, setWeeklyMenus] = useState(() => {
    const initial = {};
    weeks.forEach((w, i) => { initial[w.key] = i === 0 ? INITIAL_MENU : emptyMenu(); });
    return initial;
  });
  const [lockedWeeks, setLockedWeeks] = useState({});
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    if (window.jspdf) { setPdfReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.onload = () => setPdfReady(true);
    script.onerror = () => setPdfReady(false);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    (async () => {
      if (!window.storage) { setStorageReady(true); return; }
      try {
        const dishesRes = await window.storage.get('custom-dishes', false);
        if (dishesRes) {
          const parsed = JSON.parse(dishesRes.value);
          setCustomDishes(parsed.dishes || []);
          setCustomIngredients(parsed.ingredients || {});
        }
      } catch (e) { /* inget sparat än */ }
      try {
        const stateRes = await window.storage.get('planner-state', false);
        if (stateRes) {
          const parsed = JSON.parse(stateRes.value);
          if (parsed.weeklyMenus) setWeeklyMenus((prev) => ({ ...prev, ...parsed.weeklyMenus }));
          if (parsed.lockedWeeks) setLockedWeeks(parsed.lockedWeeks);
        }
      } catch (e) { /* inget sparat än */ }
      try {
        const familyRes = await window.storage.get('family-members', false);
        if (familyRes) setFamily(JSON.parse(familyRes.value));
      } catch (e) { /* inget sparat än */ }
      try {
        const favRes = await window.storage.get('favorites', false);
        if (favRes) setFavorites(JSON.parse(favRes.value));
      } catch (e) { /* inget sparat än */ }
      try {
        const servRes = await window.storage.get('servings', false);
        if (servRes) setServings(JSON.parse(servRes.value));
      } catch (e) { /* inget sparat än */ }
      try {
        const achRes = await window.storage.get('achievements', false);
        if (achRes) {
          const parsed = JSON.parse(achRes.value);
          setTriedDishIds(parsed.triedDishIds || []);
          setChosenPersons(parsed.chosenPersons || []);
          setLockCount(parsed.lockCount || 0);
          setFridayCount(parsed.fridayCount || 0);
        }
      } catch (e) { /* inget sparat än */ }
      setStorageReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!window.storage || !window.storage.subscribe) return;
    const unsub = window.storage.subscribe('achievements', (raw) => {
      if (raw === undefined || raw === null) return;
      try {
        const parsed = JSON.parse(raw);
        skipAchievementsSaveRef.current = true;
        setTriedDishIds(parsed.triedDishIds || []);
        setChosenPersons(parsed.chosenPersons || []);
        setLockCount(parsed.lockCount || 0);
        setFridayCount(parsed.fridayCount || 0);
      } catch (e) { /* ogiltig data, ignorera */ }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!storageReady || !window.storage) return;
    window.storage.set('custom-dishes', JSON.stringify({ dishes: customDishes, ingredients: customIngredients }), false).catch(() => {});
  }, [customDishes, customIngredients, storageReady]);

  useEffect(() => {
    if (!storageReady || !window.storage) return;
    // Behåll bara aktiva veckor + förra veckan (för "lagades förra veckan"), så lagringen inte växer för evigt
    const keepKeys = new Set(weeks.map((w) => w.key));
    const lw = new Date();
    lw.setDate(lw.getDate() - 7);
    keepKeys.add(`${lw.getFullYear()}-${getISOWeek(lw)}`);
    const prunedMenus = {};
    Object.keys(weeklyMenus).forEach((k) => { if (keepKeys.has(k)) prunedMenus[k] = weeklyMenus[k]; });
    window.storage.set('planner-state', JSON.stringify({ weeklyMenus: prunedMenus, lockedWeeks }), false).catch(() => {});
  }, [weeklyMenus, lockedWeeks, storageReady]);

  useEffect(() => {
    if (!storageReady || !window.storage) return;
    window.storage.set('family-members', JSON.stringify(family), false).catch(() => {});
  }, [family, storageReady]);

  useEffect(() => {
    if (!storageReady || !window.storage) return;
    window.storage.set('favorites', JSON.stringify(favorites), false).catch(() => {});
  }, [favorites, storageReady]);

  useEffect(() => {
    if (!storageReady || !window.storage) return;
    window.storage.set('servings', JSON.stringify(servings), false).catch(() => {});
  }, [servings, storageReady]);

  useEffect(() => {
    if (!storageReady || !window.storage) return;
    if (skipAchievementsSaveRef.current) { skipAchievementsSaveRef.current = false; return; }
    window.storage.set('achievements', JSON.stringify({ triedDishIds, chosenPersons, lockCount, fridayCount }), false).catch(() => {});
  }, [triedDishIds, chosenPersons, lockCount, fridayCount, storageReady]);

  const combinedLibrary = useMemo(() => [...LIBRARY, ...customDishes], [customDishes]);

  const currentWeekKey = weeks[selectedWeekIdx].key;
  const currentMenu = weeklyMenus[currentWeekKey] || emptyMenu();
  const isLocked = !!lockedWeeks[currentWeekKey];

  const getDish = (id) => combinedLibrary.find((d) => d.id === Number(id));
  const getPerson = (name) => family.find((f) => f.name === name);
  const getIngredientsFor = (id) => INGREDIENTS[id] || customIngredients[id] || [];

  const weekFilledCount = (key) => DAYS.filter((d) => weeklyMenus[key]?.[d]?.dishId).length;
  const weekHasFish = (key) => DAYS.some((d) => {
    const entry = weeklyMenus[key]?.[d];
    if (!entry || !entry.dishId) return false;
    const dish = getDish(entry.dishId);
    return !!(dish && dish.category === 'Fisk');
  });
  const weekHasSoup = (key) => DAYS.some((d) => {
    const entry = weeklyMenus[key]?.[d];
    if (!entry || !entry.dishId) return false;
    const dish = getDish(entry.dishId);
    return !!(dish && dish.soup);
  });
  const toggleLock = (key) => {
    const willLock = !lockedWeeks[key];
    setLockedWeeks((prev) => ({ ...prev, [key]: willLock }));
    if (willLock) setLockCount((c) => c + 1);
  };

  // Hittar vilken dag (om någon, förutom excludeDay) som redan har den här rätten denna vecka
  const dayUsingDish = (dishId, excludeDay) => {
    if (!dishId) return null;
    for (const day of DAYS) {
      if (day === excludeDay) continue;
      if (currentMenu[day]?.dishId === Number(dishId)) return day;
    }
    return null;
  };

  const isFavorite = (dishId) => favorites.includes(Number(dishId));
  const toggleFavorite = (dishId, e) => {
    if (e) e.stopPropagation();
    const id = Number(dishId);
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const lastWeekKey = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return `${d.getFullYear()}-${getISOWeek(d)}`;
  }, [now]);
  const wasUsedLastWeek = (dishId) => DAYS.some((d) => weeklyMenus[lastWeekKey]?.[d]?.dishId === Number(dishId));

  // En rätt är valbar för en viss dag om den inte redan används en annan dag denna
  // vecka, och om den är fredagsmys-märkt bara på just fredagar.
  const isEligibleForDay = (dish, day) => {
    if (dayUsingDish(dish.id, day)) return false;
    if (dish.friday && day !== 'Fredag') return false;
    return true;
  };

  const pickRandomFromSheetLibrary = () => {
    const eligible = sheetLibrary.filter((d) => isEligibleForDay(d, sheet.day));
    if (eligible.length === 0) return;
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    chooseDish(pick.id);
  };

  const quickRandomForDay = (day, e) => {
    if (e) e.stopPropagation();
    if (isLocked) return;
    const eligible = combinedLibrary.filter((d) => isEligibleForDay(d, day));
    if (eligible.length === 0) return;
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    setSheetCategory('Alla');
    setSheet({ day, dishId: pick.id, step: 'person' });
  };

  const openFromLibrary = (dish) => {
    if (isLocked) return;
    setSheet({ day: null, dishId: dish.id, step: 'day' });
  };

  const openFromDay = (day) => {
    if (isLocked) return;
    setSheetCategory(day === 'Fredag' ? 'Fredagsmys' : 'Alla');
    setSheet({ day, dishId: currentMenu[day]?.dishId ?? null, step: 'dish' });
  };

  const closeSheet = () => setSheet(null);
  const chooseDay = (day) => setSheet((prev) => ({ ...prev, day, step: 'person' }));
  const chooseDish = (dishId) => setSheet((prev) => ({ ...prev, dishId, step: 'person' }));

  const commitPerson = (personName) => {
    if (dayUsingDish(sheet.dishId, sheet.day)) { setSheet(null); return; }
    const dish = getDish(sheet.dishId);
    if (dish && dish.friday && sheet.day !== 'Fredag') { setSheet(null); return; }
    const dishIdNum = Number(sheet.dishId);
    setWeeklyMenus((prev) => ({
      ...prev,
      [currentWeekKey]: { ...prev[currentWeekKey], [sheet.day]: { dishId: sheet.dishId, person: personName } },
    }));
    setTriedDishIds((prev) => (prev.includes(dishIdNum) ? prev : [...prev, dishIdNum]));
    setChosenPersons((prev) => (prev.includes(personName) ? prev : [...prev, personName]));
    if (dish && dish.friday && sheet.day === 'Fredag') setFridayCount((c) => c + 1);
    triggerConfetti();
    setSheet(null);
  };

  const removeDay = (day, e) => {
    e.stopPropagation();
    if (isLocked) return;
    setWeeklyMenus((prev) => ({ ...prev, [currentWeekKey]: { ...prev[currentWeekKey], [day]: { dishId: null, person: null } } }));
  };

  const openAddDish = () => {
    setDraftName(''); setDraftCategory(null); setDraftImage(null); setDraftImageUrl(''); setDraftIngredientsText(''); setDraftFriday(false); setDraftSoup(false);
    setAddDishOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraftImage(reader.result);
    reader.readAsDataURL(file);
  };

  const useDraftImageUrl = () => {
    const url = draftImageUrl.trim();
    if (!url) return;
    setDraftImage(url);
    setDraftImageUrl('');
  };

  const saveNewDish = () => {
    if (!draftName.trim() || !draftCategory) return;
    const id = Date.now();
    const ingredients = draftIngredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [item, ...rest] = line.split(',');
        return { item: (item || '').trim(), amount: rest.join(',').trim() || '–' };
      });
    setCustomDishes((prev) => [...prev, { id, category: draftCategory, name: draftName.trim(), image: draftImage || '🍽️', friday: draftFriday, soup: draftSoup }]);
    if (ingredients.length) setCustomIngredients((prev) => ({ ...prev, [id]: ingredients }));
    setAddDishOpen(false);
  };

  const openEditFamilyPhoto = (index) => {
    setEditingFamilyIndex(index);
    if (familyFileInputRef.current) familyFileInputRef.current.click();
  };

  const handleFamilyPhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || editingFamilyIndex === null) return;
    const index = editingFamilyIndex;
    const reader = new FileReader();
    reader.onload = () => {
      setFamily((prev) => prev.map((f, i) => (i === index ? { ...f, avatar: reader.result } : f)));
      setEditingFamilyIndex(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const useFamilyImageUrl = (index) => {
    const url = familyUrlDraft.trim();
    if (!url) return;
    setFamily((prev) => prev.map((f, i) => (i === index ? { ...f, avatar: url } : f)));
    setFamilyUrlDraft('');
    setEditingFamilyIndex(null);
  };

  const resetFamilyPhoto = (index) => {
    const original = DEFAULT_FAMILY.find((f) => f.name === family[index]?.name);
    setFamily((prev) => prev.map((f, i) => (i === index ? { ...f, avatar: original ? original.avatar : '🙂' } : f)));
  };

  const shoppingList = useMemo(() => {
    const map = {};
    const scale = servings / 4;
    DAYS.forEach((day) => {
      const entry = currentMenu[day];
      if (!entry || !entry.dishId) return;
      const ings = getIngredientsFor(entry.dishId);
      ings.forEach((ing) => {
        const parsed = parseAmount(ing.amount);
        const key = `${ing.item}__${parsed.unit}`;
        if (!map[key]) map[key] = { item: ing.item, unit: parsed.unit, total: 0, parts: [], numeric: parsed.value !== null };
        if (parsed.value !== null) map[key].total += parsed.value * scale;
        else map[key].parts.push(ing.amount);
      });
    });
    return Object.values(map)
      .map((e) => ({ item: e.item, amount: e.numeric ? `${formatNumber(e.total)} ${e.unit}`.trim() : e.parts.join(' + ') }))
      .sort((a, b) => a.item.localeCompare(b.item, 'sv'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMenu, customIngredients, servings]);

  const buildShoppingText = () => {
    const week = weeks[selectedWeekIdx];
    const lines = [];
    lines.push(`INKÖPSLISTA – Vecka ${week.weekNumber}`);
    lines.push(`(beräknat för ${servings} portioner)`);
    lines.push('='.repeat(28));
    lines.push('');
    lines.push('Menyn denna vecka:');
    DAYS.forEach((day) => {
      const entry = currentMenu[day];
      const dish = entry && entry.dishId ? getDish(entry.dishId) : null;
      const personSuffix = entry && entry.person ? ` (${entry.person})` : '';
      lines.push(`${day}: ${dish ? dish.name : '–'}${personSuffix}`);
    });
    lines.push('');
    lines.push('Att handla:');
    if (shoppingList.length === 0) lines.push('(inget att handla ännu)');
    shoppingList.forEach((row) => lines.push(`[ ] ${row.item} – ${row.amount}`));
    return lines.join('\n');
  };

  const downloadShoppingList = () => {
    const week = weeks[selectedWeekIdx];
    const text = buildShoppingText();
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inkopslista-vecka-${week.weekNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { /* nedladdning stöds inte i denna miljö */ }
  };

  const [copyStatus, setCopyStatus] = useState('');
  const copyShoppingText = () => {
    const text = buildShoppingText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => { setCopyStatus('Kopierat!'); setTimeout(() => setCopyStatus(''), 2000); })
        .catch(() => { setCopyStatus('Markera texten nedan manuellt'); setTimeout(() => setCopyStatus(''), 3000); });
    } else {
      setCopyStatus('Markera texten nedan manuellt');
      setTimeout(() => setCopyStatus(''), 3000);
    }
  };

  const printShoppingList = () => {
    window.print();
  };

  const downloadPdf = () => {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      printShoppingList();
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const week = weeks[selectedWeekIdx];
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;

    // Färger hämtade från appens egen palett
    const forest = [63, 93, 72];
    const forestDark = [44, 66, 52];
    const ink = [43, 38, 32];
    const inkSoft = [107, 98, 85];
    const rust = [181, 83, 60];
    const rowShade = [247, 244, 237];
    const border = [228, 220, 201];

    const addFooter = () => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...inkSoft);
      doc.text('Veckans meny', margin, 289);
      doc.text(`Sida ${doc.internal.getNumberOfPages()}`, pageWidth - margin, 289, { align: 'right' });
    };

    // ---- Header ----
    doc.setFillColor(...forest);
    doc.rect(0, 0, pageWidth, 34, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('Veckans meny', margin, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Vecka ${week.weekNumber} · ${week.label} · ${servings} portioner`, margin, 25);

    let y = 46;

    // ---- Meny ----
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...forestDark);
    doc.text('Menyn denna vecka', margin, y);
    y += 3;
    doc.setDrawColor(...forest);
    doc.setLineWidth(0.6);
    doc.line(margin, y, margin + 38, y);
    y += 8;

    DAYS.forEach((day, i) => {
      const entry = currentMenu[day];
      const dish = entry && entry.dishId ? getDish(entry.dishId) : null;
      const rowH = 8.5;
      if (i % 2 === 0) {
        doc.setFillColor(...rowShade);
        doc.rect(margin, y - 6, contentWidth, rowH, 'F');
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...ink);
      doc.text(day, margin + 3, y);
      doc.setFont('helvetica', 'normal');
      doc.text(dish ? dish.name : '– Ingen rätt vald', margin + 32, y);
      if (entry && entry.person) {
        doc.setFontSize(9.5);
        doc.setTextColor(...inkSoft);
        doc.text(entry.person, pageWidth - margin - 3, y, { align: 'right' });
      }
      y += rowH;
    });

    y += 6;

    // ---- Inköpslista ----
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...forestDark);
    doc.text('Inköpslista', margin, y);
    y += 3;
    doc.setDrawColor(...forest);
    doc.line(margin, y, margin + 30, y);
    y += 9;

    if (shoppingList.length === 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(...inkSoft);
      doc.text('Inget att handla ännu.', margin, y);
    } else {
      shoppingList.forEach((row, i) => {
        if (y > 272) {
          addFooter();
          doc.addPage();
          y = 24;
        }
        const rowH = 8.5;
        if (i % 2 === 0) {
          doc.setFillColor(...rowShade);
          doc.rect(margin, y - 6, contentWidth, rowH, 'F');
        }
        doc.setDrawColor(...border);
        doc.setLineWidth(0.4);
        doc.roundedRect(margin + 2, y - 4.2, 4, 4, 0.7, 0.7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(...ink);
        doc.text(row.item, margin + 10, y);
        doc.setTextColor(...rust);
        doc.setFont('helvetica', 'bold');
        doc.text(row.amount, pageWidth - margin - 3, y, { align: 'right' });
        y += rowH;
      });
    }

    addFooter();
    doc.save(`inkopslista-vecka-${week.weekNumber}.pdf`);
  };

  const filterByPill = (list, pill) => {
    if (pill === 'Alla') return list;
    if (pill === 'Fredagsmys') return list.filter((d) => d.friday);
    if (pill === 'Soppor') return list.filter((d) => d.soup);
    if (pill === 'Favoriter') return list.filter((d) => isFavorite(d.id));
    return list.filter((d) => d.category === pill);
  };
  const filteredLibrary = filterByPill(combinedLibrary, activeCategory);
  const sheetLibrary = filterByPill(combinedLibrary, sheetCategory);
  const selectedFilled = weekFilledCount(currentWeekKey);

  const badgeStats = {
    lockCount,
    favoritesCount: favorites.length,
    triedCount: triedDishIds.length,
    fridayCount,
    chosenPersons,
    familyLength: family.length,
  };
  const unlockedBadges = BADGES.filter((b) => b.check(badgeStats));

  useEffect(() => {
    if (!storageReady) return;
    const count = unlockedBadges.length;
    if (prevBadgeCountRef.current === null) {
      prevBadgeCountRef.current = count;
      return;
    }
    if (count > prevBadgeCountRef.current) {
      const newest = unlockedBadges[unlockedBadges.length - 1];
      setNewBadgeBanner(newest);
      triggerConfetti();
      setTimeout(() => setNewBadgeBanner(null), 3500);
    }
    prevBadgeCountRef.current = count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedBadges.length, storageReady]);

  return (
    <div className="min-h-screen flex justify-center" style={{ backgroundColor: COLORS.cream }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Work Sans', sans-serif; }
        @keyframes confettiFall {
          0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), 100vh) rotate(var(--rot)); opacity: 0; }
        }
        @keyframes giftBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(-6deg); }
        }
        .gift-idle { display: inline-block; animation: giftBounce 2.4s ease-in-out infinite; }
        @keyframes giftOpen {
          0% { transform: scale(1) rotate(0deg); }
          30% { transform: scale(1.3) rotate(-12deg); }
          60% { transform: scale(0.85) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .gift-opening { animation: giftOpen 0.48s ease-in-out; }
        @keyframes badgePop {
          0% { transform: translateX(-50%) translateY(-12px); opacity: 0; }
          15% { transform: translateX(-50%) translateY(0); opacity: 1; }
          85% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(-12px); opacity: 0; }
        }
        .print-area { display: none; }
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { display: block; position: absolute; top: 0; left: 0; width: 100%; padding: 24px; }
        }
      `}</style>

      <div className="w-full max-w-md flex flex-col min-h-screen font-body relative" style={{ color: COLORS.ink }}>
        {confettiBurst > 0 && <ConfettiBurst key={confettiBurst} />}
        {newBadgeBanner && (
          <div
            className="fixed top-4 left-1/2 z-50 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg"
            style={{ backgroundColor: COLORS.forestDark, animation: 'badgePop 3.5s ease-in-out forwards' }}
          >
            <span className="text-xl">{newBadgeBanner.emoji}</span>
            <span className="text-sm font-semibold" style={{ color: '#fff' }}>Nytt klistermärke: {newBadgeBanner.name}!</span>
          </div>
        )}
        <header className="px-5 pt-6 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.forest }}>
              <ChefHat size={20} color={COLORS.cream} />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-xl leading-none" style={{ color: COLORS.forestDark }}>Veckans meny</h1>
              <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>Tryck på en rätt för att välja</p>
            </div>
            <button
              onClick={() => setTodayMode(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: COLORS.sage }}
            >
              <Maximize2 size={16} color={COLORS.forestDark} />
            </button>
            <button
              onClick={() => setBadgesOpen(true)}
              className="relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: COLORS.sage }}
            >
              <Award size={16} color={COLORS.forestDark} />
              {unlockedBadges.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: '#C9974B', color: '#fff', fontSize: '9px', lineHeight: '16px' }}
                >
                  {unlockedBadges.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setFamilyOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: COLORS.sage }}
            >
              <Users size={16} color={COLORS.forestDark} />
            </button>
          </div>

          <div className="flex gap-2 mb-2">
            {weeks.map((w, i) => {
              const filled = weekFilledCount(w.key);
              const locked = !!lockedWeeks[w.key];
              const active = i === selectedWeekIdx;
              let badgeBg = COLORS.sage, badgeColor = COLORS.inkSoft, badgeText = 'Ej planerad';
              if (locked) { badgeBg = COLORS.lockedBg; badgeColor = COLORS.progressText; badgeText = 'Låst'; }
              else if (filled === 5 && weekHasFish(w.key) && weekHasSoup(w.key)) { badgeBg = COLORS.plannedBg; badgeColor = COLORS.forestDark; badgeText = 'Planerad'; }
              else if (filled > 0) { badgeBg = COLORS.progressBg; badgeColor = COLORS.progressText; badgeText = `${filled}/5 dagar`; }
              return (
                <button
                  key={w.key}
                  onClick={() => setSelectedWeekIdx(i)}
                  className="flex-1 rounded-2xl px-2 py-2.5 flex flex-col items-center gap-1 border transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: active ? COLORS.forest : '#fff', borderColor: active ? COLORS.forest : COLORS.border }}
                >
                  <span className="text-xs font-semibold" style={{ color: active ? COLORS.cream : COLORS.ink }}>{w.label}</span>
                  <span className="text-xs" style={{ color: active ? '#D9E3DA' : COLORS.inkSoft }}>Vecka {w.weekNumber}</span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.18)' : badgeBg, color: active ? COLORS.cream : badgeColor }}
                  >
                    {locked && <Lock size={11} />}
                    {!locked && badgeText === 'Planerad' && <Check size={11} />}
                    {badgeText}
                  </span>
                </button>
              );
            })}
          </div>

          {(() => {
            const selectedHasFish = weekHasFish(currentWeekKey);
            const selectedHasSoup = weekHasSoup(currentWeekKey);
            const selectedMeetsReq = selectedFilled === 5 && selectedHasFish && selectedHasSoup;
            const missing = [!selectedHasFish && 'fisk', !selectedHasSoup && 'soppa'].filter(Boolean).join(' och ');
            let statusText;
            if (isLocked) statusText = '🔒 Veckan är låst';
            else if (selectedFilled < 5) statusText = `${selectedFilled} av 5 dagar planerade`;
            else if (selectedMeetsReq) statusText = '✓ Hela veckan är planerad';
            else statusText = `Nästan klar – saknar ${missing}`;

            return (
              <>
                <div className="flex gap-2 mb-2">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: selectedHasFish ? COLORS.plannedBg : COLORS.sage, color: selectedHasFish ? COLORS.forestDark : COLORS.inkSoft }}
                  >
                    {selectedHasFish ? '✓' : '○'} Fisk
                  </span>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: selectedHasSoup ? COLORS.plannedBg : COLORS.sage, color: selectedHasSoup ? COLORS.forestDark : COLORS.inkSoft }}
                  >
                    {selectedHasSoup ? '✓' : '○'} Soppa
                  </span>
                </div>

                <div className="rounded-xl px-3 py-2 space-y-2" style={{ backgroundColor: isLocked ? COLORS.lockedBg : selectedMeetsReq ? COLORS.plannedBg : COLORS.sage }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: isLocked ? COLORS.progressText : selectedMeetsReq ? COLORS.forestDark : COLORS.inkSoft }}>
                      {statusText}
                    </span>
                    {selectedMeetsReq && !isLocked && (
                      <button onClick={() => toggleLock(currentWeekKey)} className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.forestDark, color: '#fff' }}>
                        Lås veckan
                      </button>
                    )}
                  </div>
                  {isLocked && (
                    <div className="space-y-2">
                <div className="flex gap-2">
                  <button onClick={() => toggleLock(currentWeekKey)} className="flex-1 text-xs font-semibold py-2 rounded-full" style={{ backgroundColor: '#fff', color: COLORS.progressText }}>
                    Lås upp
                  </button>
                  <button onClick={downloadPdf} className="flex-1 text-xs font-semibold py-2 rounded-full flex items-center justify-center gap-1" style={{ backgroundColor: COLORS.forestDark, color: '#fff' }}>
                    <FileDown size={13} /> Ladda ner PDF
                  </button>
                </div>
                <button onClick={downloadShoppingList} className="w-full text-xs font-medium py-1.5 rounded-full underline" style={{ color: COLORS.progressText, backgroundColor: 'transparent' }}>
                  eller ladda ner som textfil
                </button>
              </div>
            )}
          </div>
              </>
            );
          })()}
        </header>

        <main className="flex-1 px-5 pb-8">
          {view === 'meny' && (
            <div className="space-y-3">
              {DAYS.map((day) => {
                const entry = currentMenu[day] || {};
                const dish = entry.dishId ? getDish(entry.dishId) : null;
                const person = entry.person ? getPerson(entry.person) : null;
                const cat = dish ? categoryOf(dish.category) : null;
                return (
                  <button
                    key={day}
                    onClick={() => openFromDay(day)}
                    disabled={isLocked}
                    className="w-full text-left rounded-2xl p-4 border transition-transform active:scale-[0.98] disabled:active:scale-100"
                    style={{ backgroundColor: dish ? cat.tint : '#fff', borderColor: COLORS.border, opacity: isLocked ? 0.65 : 1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-display text-lg" style={{ color: COLORS.forestDark }}>{day}</h2>
                      {dish && (
                        <div className="flex items-center gap-2">
                          {person && (
                            <span className="flex items-center gap-1 rounded-full pl-1 pr-2 py-0.5" style={{ backgroundColor: '#fff' }}>
                              <PersonThumb avatar={person.avatar} boxSize="w-5 h-5" textSize="text-base" />
                              <span className="text-xs font-medium">{person.name}</span>
                            </span>
                          )}
                          {!isLocked && (
                            <span onClick={(e) => removeDay(day, e)} className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fff' }}>
                              <X size={14} color={COLORS.rust} />
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {dish ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <DishThumb image={dish.image} boxSize="w-16 h-16" textSize="text-4xl" />
                          <div>
                            <p className="text-base font-semibold">{dish.name}</p>
                            <p className="text-xs" style={{ color: COLORS.inkSoft }}>{dish.category}</p>
                          </div>
                        </div>
                        {dish.sourceUrl && (
                          <span
                            onClick={(e) => { e.stopPropagation(); window.open(dish.sourceUrl, '_blank'); }}
                            className="text-xs flex items-center gap-1 flex-shrink-0"
                            style={{ color: COLORS.forestDark }}
                          >
                            Recept <ExternalLink size={12} />
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 rounded-xl py-3 px-3 border-2 border-dashed" style={{ borderColor: COLORS.border, color: COLORS.inkSoft }}>
                        <span className="flex items-center gap-2">
                          <Plus size={18} />
                          <span className="text-sm font-medium">Lägg till rätt</span>
                        </span>
                        {!isLocked && (
                          <span
                            onClick={(e) => quickRandomForDay(day, e)}
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: COLORS.sage }}
                          >
                            <span className="gift-idle" style={{ fontSize: '15px' }}>🎁</span>
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {view === 'bibliotek' && (
            <div>
              {isLocked && (
                <div className="text-xs rounded-xl px-3 py-2 mb-3" style={{ backgroundColor: COLORS.lockedBg, color: COLORS.progressText }}>
                  Lås upp veckan för att lägga till fler rätter.
                </div>
              )}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
                <button
                  onClick={() => setActiveCategory('Alla')}
                  className="text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0"
                  style={activeCategory === 'Alla' ? { backgroundColor: COLORS.forest, color: COLORS.cream } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                >
                  Alla
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setActiveCategory(c.name)}
                    className="text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
                    style={activeCategory === c.name ? { backgroundColor: c.accent, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                  >
                    <span className="text-base">{c.icon}</span>{c.name}
                  </button>
                ))}
                <button
                  onClick={() => setActiveCategory('Fredagsmys')}
                  className="text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
                  style={activeCategory === 'Fredagsmys' ? { backgroundColor: COLORS.fridayAccent, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                >
                  <span className="text-base">🎉</span>Fredagsmys
                </button>
                <button
                  onClick={() => setActiveCategory('Soppor')}
                  className="text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
                  style={activeCategory === 'Soppor' ? { backgroundColor: COLORS.forest, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                >
                  <span className="text-base">🥣</span>Soppor
                </button>
                <button
                  onClick={() => setActiveCategory('Favoriter')}
                  className="text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
                  style={activeCategory === 'Favoriter' ? { backgroundColor: '#C9974B', color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                >
                  <Star size={14} />Favoriter
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={openAddDish}
                  disabled={isLocked}
                  className="rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 border-2 border-dashed transition-transform active:scale-95"
                  style={{ borderColor: COLORS.border, color: COLORS.inkSoft, opacity: isLocked ? 0.6 : 1, minHeight: '148px' }}
                >
                  <Plus size={28} />
                  <p className="text-sm font-semibold">Ny rätt</p>
                </button>
                {filteredLibrary.map((dish) => {
                  const cat = categoryOf(dish.category);
                  const fav = isFavorite(dish.id);
                  return (
                    <button
                      key={dish.id}
                      onClick={() => openFromLibrary(dish)}
                      disabled={isLocked}
                      className="relative rounded-2xl p-4 flex flex-col items-center text-center gap-1 transition-transform active:scale-95"
                      style={{ backgroundColor: cat.tint, opacity: isLocked ? 0.6 : 1 }}
                    >
                      <span
                        onClick={(e) => toggleFavorite(dish.id, e)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
                      >
                        <Star size={14} color="#C9974B" fill={fav ? '#C9974B' : 'none'} />
                      </span>
                      <DishThumb image={dish.image} boxSize="w-16 h-16" textSize="text-4xl" />
                      <p className="text-sm font-semibold mt-1">{dish.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full mt-1" style={{ backgroundColor: '#fff', color: cat.accent }}>
                        {dish.category}
                      </span>
                      {wasUsedLastWeek(dish.id) && (
                        <span className="text-xs" style={{ color: COLORS.progressText }}>↩ Lagades förra veckan</span>
                      )}
                      {dish.sourceUrl && (
                        <span
                          onClick={(e) => { e.stopPropagation(); window.open(dish.sourceUrl, '_blank'); }}
                          className="text-xs flex items-center gap-1 mt-1"
                          style={{ color: cat.accent }}
                        >
                          Recept <ExternalLink size={11} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'lista' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg" style={{ color: COLORS.forestDark }}>
                  Inköpslista · Vecka {weeks[selectedWeekIdx].weekNumber}
                </h2>
                <div className="flex items-center gap-2 rounded-full px-1 py-1" style={{ backgroundColor: COLORS.sage }}>
                  <button
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: '#fff', color: COLORS.forestDark }}
                  >
                    –
                  </button>
                  <span className="text-xs font-semibold w-14 text-center" style={{ color: COLORS.ink }}>{servings} port.</span>
                  <button
                    onClick={() => setServings((s) => Math.min(20, s + 1))}
                    className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor: '#fff', color: COLORS.forestDark }}
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xs mb-3" style={{ color: COLORS.inkSoft }}>Recepten är beräknade för 4 portioner i grunden – mängderna ovan är omräknade till {servings}.</p>
              {shoppingList.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center gap-3">
                  <ShoppingCart size={32} color={COLORS.inkSoft} />
                  <p className="text-sm" style={{ color: COLORS.inkSoft }}>
                    Din inköpslista är tom.<br />Välj rätter i veckomenyn för att fylla den.
                  </p>
                </div>
              ) : (
                <>
                  <ul className="space-y-2 mb-4">
                    {shoppingList.map((row) => (
                      <li key={row.item} className="flex items-center justify-between rounded-xl px-4 py-3 border" style={{ backgroundColor: '#fff', borderColor: COLORS.border }}>
                        <div className="flex items-center gap-2">
                          <Check size={16} color={COLORS.forest} />
                          <span className="text-sm">{row.item}</span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: COLORS.rust }}>{row.amount}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={downloadPdf}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 rounded-full mb-2"
                    style={{ backgroundColor: COLORS.forestDark, color: '#fff' }}
                  >
                    <FileDown size={16} /> Ladda ner PDF
                  </button>
                  <button
                    onClick={downloadShoppingList}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium py-3 rounded-full mb-4"
                    style={{ backgroundColor: COLORS.sage, color: COLORS.ink }}
                  >
                    <FileDown size={16} /> Ladda ner som textfil
                  </button>

                  <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#fff', borderColor: COLORS.border }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold" style={{ color: COLORS.forestDark }}>Fungerar inget av knapparna ovan?</p>
                      <button
                        onClick={copyShoppingText}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}
                      >
                        Kopiera text
                      </button>
                    </div>
                    <p className="text-xs mb-2" style={{ color: COLORS.inkSoft }}>
                      {copyStatus || 'Tryck i rutan, markera allt och kopiera manuellt — funkar oavsett enhet.'}
                    </p>
                    <textarea
                      readOnly
                      value={buildShoppingText()}
                      rows={10}
                      onFocus={(e) => e.target.select()}
                      className="w-full text-xs rounded-xl p-3 border"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream, color: COLORS.ink, fontFamily: 'monospace' }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </main>

        <nav className="sticky bottom-0 w-full grid grid-cols-3 border-t" style={{ backgroundColor: '#fff', borderColor: COLORS.border }}>
          {[
            { key: 'meny', label: 'Meny', Icon: CalendarDays },
            { key: 'bibliotek', label: 'Bibliotek', Icon: BookOpen },
            { key: 'lista', label: 'Lista', Icon: ShoppingCart },
          ].map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setView(key)} className="flex flex-col items-center gap-1 py-3" style={{ color: view === key ? COLORS.forest : COLORS.inkSoft }}>
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {sheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(43,38,32,0.45)' }}>
            <div className="w-full max-w-md rounded-t-3xl p-5 overflow-y-auto" style={{ backgroundColor: COLORS.cream, maxHeight: '82vh' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {sheet.dishId && <DishThumb image={getDish(sheet.dishId).image} boxSize="w-10 h-10" textSize="text-2xl" />}
                  <div>
                    <p className="font-display text-lg leading-none" style={{ color: COLORS.forestDark }}>
                      {sheet.step === 'day' && 'Vilken dag?'}
                      {sheet.step === 'dish' && (sheet.day ? sheet.day : 'Välj rätt')}
                      {sheet.step === 'person' && 'Vem är det som vill ha den?'}
                    </p>
                    {sheet.step === 'person' && (
                      <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>
                        {getDish(sheet.dishId)?.name} · {sheet.day}
                      </p>
                    )}
                  </div>
                </div>
                <button onClick={closeSheet} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.sage }}>
                  <X size={16} color={COLORS.ink} />
                </button>
              </div>

              {sheet.step === 'day' && (() => {
                const dishConflictDay = dayUsingDish(sheet.dishId, null);
                const chosenDish = getDish(sheet.dishId);
                const fridayOnly = !!(chosenDish && chosenDish.friday);
                return (
                  <div>
                    {dishConflictDay && (
                      <div className="text-xs rounded-xl px-3 py-2 mb-3" style={{ backgroundColor: COLORS.lockedBg, color: COLORS.progressText }}>
                        Den här rätten är redan vald till {dishConflictDay} denna vecka. En rätt kan bara användas en gång per vecka.
                      </div>
                    )}
                    {fridayOnly && (
                      <div className="text-xs rounded-xl px-3 py-2 mb-3 flex items-center gap-1.5" style={{ backgroundColor: COLORS.fridayTint, color: COLORS.fridayAccent }}>
                        <span>🎉</span> Den här rätten är fredagsmys och kan bara läggas på en fredag.
                      </div>
                    )}
                    <div className="space-y-2">
                      {DAYS.map((day) => {
                        const existingDish = currentMenu[day]?.dishId ? getDish(currentMenu[day].dishId) : null;
                        const blocked = (dishConflictDay && day !== dishConflictDay) || (fridayOnly && day !== 'Fredag');
                        return (
                          <button
                            key={day}
                            onClick={() => !blocked && chooseDay(day)}
                            disabled={blocked}
                            className="w-full flex items-center justify-between rounded-2xl px-4 py-4 border transition-transform active:scale-[0.98] disabled:active:scale-100"
                            style={{ backgroundColor: '#fff', borderColor: COLORS.border, opacity: blocked ? 0.45 : 1 }}
                          >
                            <span className="font-display text-base" style={{ color: COLORS.forestDark }}>{day}</span>
                            {existingDish ? (
                              <span className="text-xs flex items-center gap-1.5" style={{ color: COLORS.inkSoft }}>
                                <DishThumb image={existingDish.image} boxSize="w-6 h-6" textSize="text-sm" />
                                {existingDish.name}
                              </span>
                            ) : (
                              <span className="text-xs" style={{ color: COLORS.inkSoft }}>Ledig</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {sheet.step === 'dish' && (() => {
                const eligibleForRandom = sheetLibrary.filter((d) => isEligibleForDay(d, sheet.day));
                return (
                <div>
                  <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
                    <button
                      onClick={() => setSheetCategory('Alla')}
                      className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0"
                      style={sheetCategory === 'Alla' ? { backgroundColor: COLORS.forest, color: COLORS.cream } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                    >
                      Alla
                    </button>
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSheetCategory(c.name)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                        style={sheetCategory === c.name ? { backgroundColor: c.accent, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                      >
                        <span>{c.icon}</span>{c.name}
                      </button>
                    ))}
                    {sheet.day === 'Fredag' && (
                      <button
                        onClick={() => setSheetCategory('Fredagsmys')}
                        className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                        style={sheetCategory === 'Fredagsmys' ? { backgroundColor: COLORS.fridayAccent, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                      >
                        <span>🎉</span>Fredagsmys
                      </button>
                    )}
                    <button
                      onClick={() => setSheetCategory('Soppor')}
                      className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                      style={sheetCategory === 'Soppor' ? { backgroundColor: COLORS.forest, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                    >
                      <span>🥣</span>Soppor
                    </button>
                    <button
                      onClick={() => setSheetCategory('Favoriter')}
                      className="text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-1"
                      style={sheetCategory === 'Favoriter' ? { backgroundColor: '#C9974B', color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                    >
                      <Star size={12} />Favoriter
                    </button>
                  </div>
                  {sheet.day !== 'Fredag' && (
                    <div className="text-xs rounded-xl px-3 py-2 mb-3 flex items-center gap-1.5" style={{ backgroundColor: COLORS.fridayTint, color: COLORS.fridayAccent }}>
                      <span>🎉</span> Fredagsmys-rätter är nedtonade – de kan bara läggas på fredagar.
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (eligibleForRandom.length === 0 || boxOpening) return;
                      setBoxOpening(true);
                      setTimeout(() => {
                        pickRandomFromSheetLibrary();
                        setBoxOpening(false);
                      }, 480);
                    }}
                    disabled={eligibleForRandom.length === 0 || boxOpening}
                    className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-full mb-1 disabled:opacity-40 ${boxOpening ? 'gift-opening' : ''}`}
                    style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}
                  >
                    <span className={eligibleForRandom.length > 0 && !boxOpening ? 'gift-idle' : ''}>🎁</span> Mysterielåda
                  </button>
                  {eligibleForRandom.length === 0 && (
                    <p className="text-xs mb-3" style={{ color: COLORS.inkSoft }}>
                      Inget att slumpa bland med det här filtret just nu.
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3" style={{ marginTop: eligibleForRandom.length === 0 ? 0 : '0.75rem' }}>
                    {sheetLibrary.map((dish) => {
                      const usedDay = dayUsingDish(dish.id, sheet.day);
                      const fridayBlocked = dish.friday && sheet.day !== 'Fredag';
                      const disabled = !!usedDay || fridayBlocked;
                      const fav = isFavorite(dish.id);
                      return (
                        <button
                          key={dish.id}
                          onClick={() => !disabled && chooseDish(dish.id)}
                          disabled={disabled}
                          className="relative rounded-2xl p-3 flex flex-col items-center text-center gap-1 transition-transform active:scale-95 disabled:active:scale-100"
                          style={{ backgroundColor: categoryOf(dish.category).tint, opacity: disabled ? 0.45 : 1 }}
                        >
                          <span
                            onClick={(e) => toggleFavorite(dish.id, e)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
                          >
                            <Star size={12} color="#C9974B" fill={fav ? '#C9974B' : 'none'} />
                          </span>
                          <DishThumb image={dish.image} boxSize="w-14 h-14" textSize="text-3xl" />
                          <p className="text-sm font-semibold mt-1">{dish.name}</p>
                          {usedDay && (
                            <span className="text-xs" style={{ color: COLORS.inkSoft }}>Vald till {usedDay}</span>
                          )}
                          {!usedDay && fridayBlocked && (
                            <span className="text-xs" style={{ color: COLORS.fridayAccent }}>🎉 Endast fredagar</span>
                          )}
                          {!usedDay && !fridayBlocked && wasUsedLastWeek(dish.id) && (
                            <span className="text-xs" style={{ color: COLORS.progressText }}>↩ Förra veckan</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                );
              })()}

              {sheet.step === 'person' && (
                <div className="grid grid-cols-2 gap-3">
                  {family.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => commitPerson(f.name)}
                      className="flex flex-col items-center gap-2 rounded-2xl py-5 border transition-transform active:scale-95"
                      style={{ backgroundColor: '#fff', borderColor: COLORS.border }}
                    >
                      <PersonThumb avatar={f.avatar} boxSize="w-14 h-14" textSize="text-4xl" />
                      <span className="text-sm font-medium">{f.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {addDishOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(43,38,32,0.45)' }}>
            <div className="w-full max-w-md rounded-t-3xl p-5 overflow-y-auto" style={{ backgroundColor: COLORS.cream, maxHeight: '88vh' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="font-display text-lg" style={{ color: COLORS.forestDark }}>Ny rätt</p>
                <button onClick={() => setAddDishOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.sage }}>
                  <X size={16} color={COLORS.ink} />
                </button>
              </div>

              <div className="flex flex-col items-center mb-4">
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center mb-2 overflow-hidden" style={{ backgroundColor: '#fff', border: `1px solid ${COLORS.border}` }}>
                  {draftImage ? (
                    draftImage.startsWith('data:') || draftImage.startsWith('http') ? (
                      <img src={draftImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">{draftImage}</span>
                    )
                  ) : (
                    <ImageIcon size={28} color={COLORS.inkSoft} />
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full"
                  style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}
                >
                  <Camera size={16} /> Ta eller välj bild
                </button>
                <div className="flex gap-2 mt-3">
                  {EMOJI_FALLBACKS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setDraftImage(emoji)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: draftImage === emoji ? COLORS.sage : '#fff', border: `1px solid ${COLORS.border}` }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-3 w-full">
                  <input
                    value={draftImageUrl}
                    onChange={(e) => setDraftImageUrl(e.target.value)}
                    placeholder="Fungerar inte knappen? Klistra in en bildlänk (https://...)"
                    className="flex-1 text-xs rounded-full px-3 py-2 border"
                    style={{ borderColor: COLORS.border, backgroundColor: '#fff' }}
                  />
                  <button
                    onClick={useDraftImageUrl}
                    className="text-xs font-semibold px-3 py-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS.forestDark, color: '#fff' }}
                  >
                    OK
                  </button>
                </div>
              </div>

              <label className="text-xs block mb-1" style={{ color: COLORS.inkSoft }}>Namn på rätten</label>
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="T.ex. Mormors köttbullar"
                className="w-full text-sm rounded-xl px-3 py-3 border mb-4"
                style={{ borderColor: COLORS.border, backgroundColor: '#fff' }}
              />

              <label className="text-xs block mb-1" style={{ color: COLORS.inkSoft }}>Kategori</label>
              <div className="flex gap-2 flex-wrap mb-4">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setDraftCategory(c.name)}
                    className="text-sm font-medium px-3 py-2 rounded-full flex items-center gap-1.5"
                    style={draftCategory === c.name ? { backgroundColor: c.accent, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
                  >
                    <span>{c.icon}</span>{c.name}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setDraftFriday((v) => !v)}
                className="w-full text-sm font-medium px-3 py-2.5 rounded-xl flex items-center gap-2 mb-2"
                style={draftFriday ? { backgroundColor: COLORS.fridayAccent, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
              >
                <span className="text-base">🎉</span>
                {draftFriday ? 'Markerad som fredagsmys' : 'Markera som fredagsmys?'}
              </button>

              <button
                onClick={() => setDraftSoup((v) => !v)}
                className="w-full text-sm font-medium px-3 py-2.5 rounded-xl flex items-center gap-2 mb-4"
                style={draftSoup ? { backgroundColor: COLORS.forest, color: '#fff' } : { backgroundColor: COLORS.sage, color: COLORS.ink }}
              >
                <span className="text-base">🥣</span>
                {draftSoup ? 'Markerad som soppa' : 'Markera som soppa?'}
              </button>

              <label className="text-xs block mb-1" style={{ color: COLORS.inkSoft }}>Ingredienser (valfritt, en per rad: vara, mängd)</label>
              <textarea
                value={draftIngredientsText}
                onChange={(e) => setDraftIngredientsText(e.target.value)}
                placeholder={'Pasta, 400 g\nLök, 1 st'}
                rows={3}
                className="w-full text-sm rounded-xl px-3 py-3 border mb-5"
                style={{ borderColor: COLORS.border, backgroundColor: '#fff' }}
              />

              <button
                onClick={saveNewDish}
                disabled={!draftName.trim() || !draftCategory}
                className="w-full text-sm font-semibold py-3 rounded-full disabled:opacity-40"
                style={{ backgroundColor: COLORS.forestDark, color: '#fff' }}
              >
                Spara rätt
              </button>
            </div>
          </div>
        )}

        {familyOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(43,38,32,0.45)' }}>
            <div className="w-full max-w-md rounded-t-3xl p-5 overflow-y-auto" style={{ backgroundColor: COLORS.cream, maxHeight: '82vh' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="font-display text-lg" style={{ color: COLORS.forestDark }}>Familjen</p>
                <button onClick={() => setFamilyOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.sage }}>
                  <X size={16} color={COLORS.ink} />
                </button>
              </div>

              <input ref={familyFileInputRef} type="file" accept="image/*" onChange={handleFamilyPhotoChange} className="hidden" />

              <div className="space-y-3">
                {family.map((f, i) => {
                  const isPhoto = f.avatar.startsWith('data:') || f.avatar.startsWith('http');
                  return (
                    <div key={f.name} className="rounded-2xl p-3 border" style={{ backgroundColor: '#fff', borderColor: COLORS.border }}>
                      <div className="flex items-center gap-3">
                        <PersonThumb avatar={f.avatar} boxSize="w-14 h-14" textSize="text-4xl" />
                        <p className="text-sm font-semibold flex-1">{f.name}</p>
                        <button
                          onClick={() => { setEditingFamilyIndex(editingFamilyIndex === i ? null : i); setFamilyUrlDraft(''); }}
                          className="text-xs font-medium px-3 py-2 rounded-full flex items-center gap-1 flex-shrink-0"
                          style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}
                        >
                          <Camera size={13} /> Byt bild
                        </button>
                        {isPhoto && (
                          <button
                            onClick={() => resetFamilyPhoto(i)}
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: COLORS.sage }}
                          >
                            <X size={14} color={COLORS.ink} />
                          </button>
                        )}
                      </div>
                      {editingFamilyIndex === i && (
                        <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: COLORS.border }}>
                          <button
                            onClick={() => openEditFamilyPhoto(i)}
                            className="w-full text-xs font-medium py-2 rounded-full"
                            style={{ backgroundColor: COLORS.sage, color: COLORS.ink }}
                          >
                            Välj bild från enheten
                          </button>
                          <div className="flex gap-2">
                            <input
                              value={familyUrlDraft}
                              onChange={(e) => setFamilyUrlDraft(e.target.value)}
                              placeholder="Eller klistra in bildlänk (https://...)"
                              className="flex-1 text-xs rounded-full px-3 py-2 border"
                              style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                            />
                            <button
                              onClick={() => useFamilyImageUrl(i)}
                              className="text-xs font-semibold px-3 py-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: COLORS.forestDark, color: '#fff' }}
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs mt-4" style={{ color: COLORS.inkSoft }}>
                Bilderna sparas på den här enheten. Om filväljaren inte öppnar sig, klistra in en bildlänk istället. Krysset tar bort en egen bild och återställer standardikonen.
              </p>
            </div>
          </div>
        )}

        {badgesOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: 'rgba(43,38,32,0.45)' }}>
            <div className="w-full max-w-md rounded-t-3xl p-5 overflow-y-auto" style={{ backgroundColor: COLORS.cream, maxHeight: '82vh' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-display text-lg" style={{ color: COLORS.forestDark }}>Klistermärken</p>
                <button onClick={() => setBadgesOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.sage }}>
                  <X size={16} color={COLORS.ink} />
                </button>
              </div>
              <p className="text-xs mb-4" style={{ color: COLORS.inkSoft }}>{unlockedBadges.length} av {BADGES.length} upplåsta</p>
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((b) => {
                  const unlocked = b.check(badgeStats);
                  return (
                    <div
                      key={b.id}
                      className="rounded-2xl p-4 flex flex-col items-center text-center gap-1 border"
                      style={{ backgroundColor: unlocked ? '#FCEFD1' : '#fff', borderColor: COLORS.border, opacity: unlocked ? 1 : 0.55 }}
                    >
                      <span className="text-4xl" style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>{b.emoji}</span>
                      <p className="text-sm font-semibold mt-1">{b.name}</p>
                      <p className="text-xs" style={{ color: COLORS.inkSoft }}>{b.desc}</p>
                      {unlocked && <span className="text-xs font-semibold mt-1" style={{ color: '#C9974B' }}>✓ Upplåst</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Idag-läge: stillsam helskärmsvy för köksskärmen som visar dagens rätt stort */}
        {todayMode && (() => {
          const jsWeekday = new Date().getDay(); // 0 Sön .. 6 Lör
          const todayDayName = jsWeekday >= 1 && jsWeekday <= 5 ? DAYS[jsWeekday - 1] : null;
          const thisWeekKey = weeks[0].key;
          const entry = todayDayName ? weeklyMenus[thisWeekKey]?.[todayDayName] : null;
          const dish = entry && entry.dishId ? getDish(entry.dishId) : null;
          const person = entry && entry.person ? getPerson(entry.person) : null;
          const dateLabel = new Date().toLocaleDateString('sv-SE', { weekday: undefined, day: 'numeric', month: 'long' });
          return (
            <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: COLORS.forestDark }}>
              <button
                onClick={() => setTodayMode(false)}
                className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <X size={20} color="#fff" />
              </button>
              {todayDayName && dish ? (
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>{todayDayName} · {dateLabel}</p>
                  <DishThumb image={dish.image} boxSize="w-56 h-56" textSize="text-9xl" />
                  <h1 className="font-display text-3xl mt-6" style={{ color: '#fff' }}>{dish.name}</h1>
                  {person && (
                    <div className="flex items-center gap-2 mt-5 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}>
                      <PersonThumb avatar={person.avatar} boxSize="w-8 h-8" textSize="text-xl" />
                      <span className="text-sm" style={{ color: '#fff' }}>{person.name} valde den här</span>
                    </div>
                  )}
                </div>
              ) : todayDayName ? (
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                  <span className="text-6xl mb-4">🍽️</span>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>{todayDayName} · {dateLabel}</p>
                  <p className="font-display text-2xl" style={{ color: '#fff' }}>Ingen rätt vald ännu</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
                  <span className="text-6xl mb-4">🎉</span>
                  <p className="font-display text-2xl" style={{ color: '#fff' }}>Helg! Ingen middag inplanerad</p>
                </div>
              )}
            </div>
          );
        })()}

        {/* Skrivarvänlig version av inköpslistan, visas bara vid utskrift/Spara som PDF */}
        <div className="print-area" style={{ color: '#000', backgroundColor: '#fff' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
            Veckans meny — Vecka {weeks[selectedWeekIdx].weekNumber}
          </h1>
          <p style={{ fontSize: '12px', marginBottom: '16px' }}>{weeks[selectedWeekIdx].label} · beräknat för {servings} portioner</p>

          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Meny</h2>
          <ul style={{ marginBottom: '20px', paddingLeft: '18px' }}>
            {DAYS.map((day) => {
              const entry = currentMenu[day];
              const dish = entry && entry.dishId ? getDish(entry.dishId) : null;
              return (
                <li key={day} style={{ fontSize: '13px', marginBottom: '2px' }}>
                  {day}: {dish ? dish.name : '–'}{entry && entry.person ? ` (${entry.person})` : ''}
                </li>
              );
            })}
          </ul>

          <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Inköpslista</h2>
          {shoppingList.length === 0 ? (
            <p style={{ fontSize: '13px' }}>Inget att handla ännu.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {shoppingList.map((row) => (
                <li key={row.item} style={{ fontSize: '13px', marginBottom: '4px' }}>
                  ☐ {row.item} — {row.amount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
