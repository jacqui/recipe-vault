import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

// ─── INITIAL RECIPE DATA ─────────────────────────────────────────────────────
const INITIAL_RECIPES = [
  {
    id: "r1",
    title: "Roasted Beetroot, Lentil & Goat Cheese Salad",
    tag: "Salad", time: "45 min", serves: 4,
    medDiet: true,
    medNote: "Olive oil dressing, legumes, and leafy greens — core Mediterranean pillars.",
    whyMakeIt: "Earthy, sweet roasted beetroot over peppery lentils with creamy goat cheese. Nitrates in beetroot measurably support cardiovascular function. The lemon and vinegar acidity helps you absorb more plant iron from the lentils. This is genuinely medicine as food.",
    nutrients: ["Iron", "Folate", "Vitamin C", "Nitrates", "Plant Protein"],
    ingredients: [
      "4 medium beetroots, peeled and cut into wedges",
      "1 cup Puy (French) lentils",
      "120g goat cheese, crumbled",
      "80g walnuts, toasted",
      "1 large handful rocket",
      "1 handful fresh flat-leaf parsley",
      "3 tbsp extra virgin olive oil",
      "2 tbsp red wine vinegar",
      "1 tsp honey or maple syrup",
      "1 tsp Dijon mustard",
      "Salt and pepper",
      "Zest of 1 lemon",
    ],
    steps: [
      "Preheat oven to 200°C. Toss beetroot wedges in olive oil, salt and pepper. Roast 35–40 min until tender and caramelised.",
      "Rinse lentils. Cover with cold water by 5cm, bring to a boil, reduce to simmer. Cook 20–25 min until just tender. Drain and season warm with salt, pepper, a splash of vinegar.",
      "Whisk together 3 tbsp olive oil, 2 tbsp red wine vinegar, honey, Dijon, lemon zest, salt and pepper.",
      "Toss warm lentils with half the dressing. Layer onto a platter with rocket, then beetroot, goat cheese and walnuts.",
      "Drizzle remaining dressing. Finish with parsley. Serve warm or room temperature.",
    ],
    notes: "Leftovers keep 2 days — store dressing separately. Great for weekday lunches.",
  },
  {
    id: "r2",
    title: "Roasted Cauliflower & Chickpea Tray Bake with Tahini",
    tag: "Vegan", time: "40 min", serves: 4,
    medDiet: true,
    medNote: "Legumes, olive oil, and plant-forward — quintessentially Mediterranean.",
    whyMakeIt: "One tray, maximum flavour. Chickpeas get crispy, cauliflower caramelises deeply, and tahini dressing ties it together with calcium and healthy fats. Pat chickpeas very dry before roasting — moisture is the enemy of crispiness.",
    nutrients: ["Calcium", "Fibre", "Plant Protein", "Healthy Fats", "B vitamins"],
    ingredients: [
      "1 large cauliflower, cut into florets",
      "2 cans chickpeas, drained and patted very dry",
      "3 tbsp olive oil",
      "2 tsp smoked paprika",
      "1 tsp cumin",
      "1 tsp ground coriander",
      "Salt and pepper",
      "3 tbsp tahini",
      "2 tbsp lemon juice",
      "1 clove garlic, grated",
      "2–4 tbsp cold water (to thin dressing)",
      "Handful fresh coriander or parsley",
      "Pomegranate seeds (optional)",
      "Flatbread or couscous to serve",
    ],
    steps: [
      "Preheat oven to 220°C. Toss cauliflower and chickpeas on a large tray with olive oil and spices. Spread in a single layer.",
      "Roast 30–35 min, tossing once, until cauliflower is golden and chickpeas are crispy.",
      "Whisk tahini, lemon juice, garlic and water into a pourable dressing. Season with salt.",
      "Pile onto a platter. Drizzle tahini dressing generously.",
      "Scatter fresh herbs and pomegranate seeds. Serve with flatbread or grains.",
    ],
    notes: "Reheats beautifully. Great for lunchboxes. Add a soft-boiled egg for more protein.",
  },
  {
    id: "r3",
    title: "Warm Kale, Broccolini & Edamame Salad with Sesame",
    tag: "Salad", time: "25 min", serves: 4,
    medDiet: false,
    medNote: "Asian-inspired dressing sits outside the Mediterranean framework, but the vegetables are outstanding.",
    whyMakeIt: "Three of the most nutrient-dense vegetables on one plate. Massaging the kale is not optional — it transforms it from tough to silky. This salad improves overnight and is perfect for meal prep.",
    nutrients: ["Vitamin K", "Vitamin C", "Folate", "Plant Protein", "Omega-3 ALA"],
    ingredients: [
      "1 large bunch curly kale, stems removed",
      "2 bunches broccolini",
      "1½ cups frozen edamame, thawed",
      "3 tbsp sesame seeds, toasted",
      "2 tbsp soy sauce or tamari",
      "2 tbsp rice wine vinegar",
      "1 tbsp sesame oil",
      "1 tbsp honey or maple syrup",
      "1 tsp fresh ginger, grated",
      "1 clove garlic, grated",
      "1 tsp chilli flakes (optional)",
      "2 tbsp olive oil (for massaging kale)",
    ],
    steps: [
      "Tear kale into pieces. Add pinch of salt and 2 tbsp olive oil. Massage firmly 2–3 minutes until softened and darkened.",
      "Blanch broccolini 2–3 minutes until just tender and bright green. Rinse under cold water.",
      "Whisk soy, rice vinegar, sesame oil, honey, ginger and garlic into a dressing.",
      "Combine kale, broccolini and edamame. Pour dressing over and toss well.",
      "Top with toasted sesame seeds and chilli flakes.",
    ],
    notes: "Massaged kale holds up beautifully — better after a few hours. Add avocado or soft-boiled egg to make it a full meal.",
  },
  {
    id: "r4",
    title: "Niçoise-Style Salad",
    tag: "Salad", time: "30 min", serves: 4,
    medDiet: true,
    medNote: "A French Mediterranean classic. Fish, olive oil, eggs, olives — every element belongs.",
    whyMakeIt: "A genuinely complete meal in a bowl. One of the most nutritionally complete salads you can make — protein, omega-3s, iron, vitamins A and C all in one plate. Use the best tuna you can afford.",
    nutrients: ["Omega-3", "Vitamin D", "Iron", "Vitamin C", "Complete Protein"],
    ingredients: [
      "4 eggs",
      "300g green beans, trimmed",
      "400g good-quality tuna in olive oil (2 cans)",
      "200g cherry tomatoes, halved",
      "1 cup Kalamata olives",
      "4 baby potatoes, boiled and halved (optional)",
      "1 tin anchovies (optional, traditional)",
      "1 head butter lettuce or cos",
      "3 tbsp extra virgin olive oil",
      "1½ tbsp red wine vinegar",
      "1 tsp Dijon mustard",
      "1 small shallot, finely minced",
      "Salt and pepper",
    ],
    steps: [
      "Bring water to a boil. Cook eggs exactly 7 minutes for jammy yolks. Transfer to ice water, then peel and halve.",
      "Blanch green beans in same water for 3 minutes. Rinse under cold water.",
      "Whisk olive oil, vinegar, mustard, shallot, salt and pepper into dressing.",
      "Arrange lettuce on platter. Group beans, tomatoes, olives, potatoes and tuna in distinct clusters.",
      "Add halved eggs and anchovies. Drizzle dressing just before serving.",
    ],
    notes: "Store dressing separately for leftovers. Don't skip the anchovies if you eat them — they add extraordinary depth and omega-3s.",
  },
  {
    id: "r5",
    title: "Warm Sweet Potato, Black Bean & Pepita Salad",
    tag: "Vegan", time: "40 min", serves: 4,
    medDiet: false,
    medNote: "Latin American flavours — outside Mediterranean tradition but nutritionally outstanding, especially pepitas for zinc.",
    whyMakeIt: "Pepitas are the highest plant source of zinc. Black beans have antioxidant levels comparable to berries. The warmth of the sweet potato slightly wilts the other elements in the best way.",
    nutrients: ["Zinc", "Magnesium", "Vitamin A", "Fibre", "Antioxidants"],
    ingredients: [
      "2 large sweet potatoes, cut into 2cm cubes",
      "2 cans black beans, drained and rinsed",
      "½ cup pepitas (pumpkin seeds), toasted",
      "1 red onion, thinly sliced",
      "1 large handful coriander",
      "1 avocado, sliced",
      "2 tbsp olive oil",
      "1 tsp cumin",
      "1 tsp smoked paprika",
      "Juice of 2 limes",
      "1 tbsp olive oil (dressing)",
      "1 tsp honey or maple syrup",
      "Salt and pepper",
    ],
    steps: [
      "Preheat oven to 210°C. Toss sweet potato with olive oil, cumin, paprika, salt and pepper. Roast 25–30 min until caramelised.",
      "Soak red onion slices in cold water for 10 min to mellow the bite. Drain.",
      "Toast pepitas in a dry pan 2–3 min until they start to pop.",
      "Whisk lime juice, olive oil, honey, pinch cumin and salt into dressing.",
      "Combine warm sweet potato and black beans. Toss with dressing. Top with onion, avocado, coriander and pepitas.",
    ],
    notes: "Serve warm. Black beans are one of the most underrated superfoods — high fibre, antioxidants, folate.",
  },
  {
    id: "r6",
    title: "Slow-Cooked Chicken with White Beans & Cavolo Nero",
    tag: "Slow Cook", time: "3–4 hrs", serves: 6,
    medDiet: true,
    medNote: "Tuscan in origin — olive oil, legumes, dark leafy greens, lean poultry. Deeply Mediterranean.",
    whyMakeIt: "Cavolo nero is one of the most vitamin-dense greens on earth and turns silky after slow cooking. Chicken thighs have more iron and zinc than breast. This is significantly better the next day — make a double batch.",
    nutrients: ["Iron", "Zinc", "Calcium", "Vitamin K", "Vitamin C"],
    ingredients: [
      "6 chicken thighs, bone-in skin-on",
      "2 cans cannellini beans, drained",
      "1 large bunch cavolo nero, stems removed",
      "1 can diced tomatoes",
      "1 cup chicken stock",
      "6 cloves garlic, smashed",
      "1 onion, diced",
      "2 sprigs rosemary",
      "3 sprigs thyme",
      "2 tbsp olive oil",
      "Zest and juice of 1 lemon",
      "Salt and pepper",
      "Crusty bread to serve",
    ],
    steps: [
      "Season chicken generously. Heat olive oil in a Dutch oven over medium-high. Sear skin-side down 6–7 min until deeply golden. Flip 2 min. Remove.",
      "Soften onion and garlic in same pot 5 min. Add tomatoes, stock, rosemary and thyme.",
      "Nestle chicken back in skin-side up. Cover and cook on lowest heat 2.5–3 hours until falling off the bone.",
      "Add cannellini beans and cavolo nero in last 30 min. Stir through, replace lid, continue until greens are silky.",
      "Finish with lemon zest and juice. Serve in deep bowls with crusty bread.",
    ],
    notes: "The liquid becomes a deeply flavoured broth. Freezes perfectly for up to 3 months.",
  },
  {
    id: "r7",
    title: "Moroccan Chicken with Chickpeas & Preserved Lemon",
    tag: "Slow Cook", time: "2.5 hrs", serves: 5,
    medDiet: true,
    medNote: "North African cooking is part of the broader Mediterranean tradition. Spices, olive oil, legumes and lean poultry are hallmarks.",
    whyMakeIt: "Turmeric, cumin and coriander are anti-inflammatory. Turmeric absorbs best with black pepper and fat, both present here. Preserved lemons last months in the fridge and transform dishes.",
    nutrients: ["Anti-inflammatory", "Iron", "Folate", "Fibre", "Vitamin C"],
    ingredients: [
      "6 chicken thighs, bone-in",
      "2 cans chickpeas, drained",
      "1 preserved lemon, flesh removed, rind finely sliced",
      "1 can diced tomatoes",
      "1 cup chicken stock",
      "1 large onion, diced",
      "4 cloves garlic, minced",
      "2 tsp ground cumin",
      "2 tsp ground coriander",
      "1½ tsp turmeric",
      "1 tsp cinnamon",
      "1 tsp smoked paprika",
      "½ tsp chilli flakes",
      "2 tbsp olive oil",
      "Large handful green olives",
      "Flat-leaf parsley and mint to serve",
      "Couscous to serve",
    ],
    steps: [
      "Season chicken with salt, pepper and half the spices. Brown on both sides 4–5 min per side. Set aside.",
      "Soften onion 5 min. Add garlic and remaining spices, cook 1–2 min until fragrant.",
      "Add tomatoes, stock, preserved lemon rind and olives. Return chicken. Bring to a simmer.",
      "Cover and cook on lowest heat 1.5–2 hours until chicken is very tender. Add chickpeas last 30 min.",
      "Serve over couscous with generous fresh parsley and mint.",
    ],
    notes: "Find preserved lemons at delis or Middle Eastern grocers. The flavour is irreplaceable.",
  },
  {
    id: "r8",
    title: "Miso-Glazed Salmon",
    tag: "Fish", time: "20 min", serves: 4,
    medDiet: true,
    medNote: "Oily fish is central to the Mediterranean diet. The miso is Japanese but good fish simply prepared is universal.",
    whyMakeIt: "Salmon is the gold standard for omega-3s (EPA and DHA), genuinely heart-protective and hard to get elsewhere. Vitamin D in salmon is one of the few reliable food sources — especially valuable in Melbourne winters.",
    nutrients: ["Omega-3 EPA/DHA", "Vitamin D", "B12", "Selenium", "Iodine"],
    ingredients: [
      "4 salmon fillets, skin on",
      "3 tbsp white miso paste",
      "2 tbsp mirin",
      "1 tbsp soy sauce",
      "1 tbsp rice wine vinegar",
      "1 tsp honey or maple syrup",
      "1 tsp sesame oil",
      "1 tsp fresh ginger, grated",
      "Sesame seeds and spring onion to serve",
      "Steamed rice and pak choy to serve",
    ],
    steps: [
      "Mix miso, mirin, soy, vinegar, honey, sesame oil and ginger into a smooth marinade.",
      "Pat salmon dry. Coat flesh side with marinade. Marinate at least 15 min, up to 24 hrs.",
      "Preheat grill/broiler to high. Line tray with foil. Place salmon skin-side down. Grill 8–10 min until glaze caramelises. Watch closely.",
      "Steam pak choy with soy and sesame oil. Cook rice.",
      "Serve salmon over rice. Scatter with sesame seeds and thinly sliced spring onion.",
    ],
    notes: "Don't marinade longer than 24 hrs — miso starts to cure the fish. The skin goes beautifully crispy under the grill.",
  },
  {
    id: "r9",
    title: "Slow-Cooked Lamb & Lentil Stew",
    tag: "Slow Cook", time: "3.5 hrs", serves: 6,
    medDiet: true,
    medNote: "Lamb is central to Greek, Turkish and Middle Eastern Mediterranean cooking. Paired with lentils, this is a traditional and highly nutritious combination.",
    whyMakeIt: "Lamb is high in B12, zinc, and highly bioavailable haem iron. Paired with lentils this is one of the most nutritionally complete meals you can make. Brown in batches and don't rush the slow cook.",
    nutrients: ["B12", "Zinc", "Bioavailable Iron", "Folate", "Selenium"],
    ingredients: [
      "800g lamb shoulder, cut into 4cm pieces",
      "1½ cups brown or green lentils",
      "1 can diced tomatoes",
      "1½ cups lamb or chicken stock",
      "1 large onion, diced",
      "4 cloves garlic, minced",
      "2 carrots, diced",
      "2 celery stalks, diced",
      "2 tsp cumin",
      "1 tsp coriander",
      "1 tsp smoked paprika",
      "½ tsp cinnamon",
      "2 bay leaves",
      "2 tbsp olive oil",
      "Juice of 1 lemon",
      "Large handful flat-leaf parsley",
      "Greek yoghurt to serve",
    ],
    steps: [
      "Pat lamb dry, season generously. Brown in batches over high heat — don't crowd. Set aside.",
      "Reduce heat. Soften onion, carrot and celery 6–8 min. Add garlic and spices, cook 1–2 min.",
      "Return lamb. Add tomatoes, stock and bay leaves. Bring to boil, reduce to lowest heat. Cover and cook 2 hours.",
      "Rinse lentils and add to pot. Stir. Add splash more stock if needed. Cover and cook 45–60 min until lentils soft and lamb falling apart.",
      "Remove bay leaves. Squeeze lemon through. Serve topped with parsley and Greek yoghurt.",
    ],
    notes: "Better the next day. Freezes beautifully for 3 months. The yoghurt balances the richness perfectly.",
  },
  {
    id: "r10",
    title: "Farro with Roasted Vegetables & White Beans",
    tag: "Vegetarian", time: "50 min", serves: 4,
    medDiet: true,
    medNote: "Farro is an ancient Italian grain. Roasted vegetables, legumes, olive oil, herbs — this could be a meal from Tuscany.",
    whyMakeIt: "Farro has more protein, fibre and magnesium than almost any modern grain and a nutty chewiness that's genuinely satisfying. It holds its texture overnight — ideal for meal prep.",
    nutrients: ["Magnesium", "Fibre", "Plant Protein", "Iron", "B vitamins"],
    ingredients: [
      "1½ cups farro (semi-pearled)",
      "1 can cannellini beans, drained",
      "1 zucchini, diced",
      "1 red capsicum, diced",
      "1 eggplant, cubed",
      "200g cherry tomatoes",
      "1 red onion, cut into wedges",
      "4 cloves garlic, whole in skin",
      "100g parmesan or feta, crumbled",
      "Large handful fresh basil",
      "4 tbsp extra virgin olive oil",
      "2 tbsp red wine vinegar",
      "1 tsp dried oregano",
      "Salt and pepper",
    ],
    steps: [
      "Preheat oven to 210°C. Spread vegetables on large tray. Tuck garlic in. Drizzle with olive oil, oregano, salt and pepper. Roast 30–35 min until caramelised.",
      "Rinse farro. Cook in well-salted boiling water 25–30 min until tender but still chewy. Drain.",
      "Squeeze roasted garlic from skins and mash into 2 tbsp olive oil and vinegar to make dressing.",
      "Combine warm farro with vegetables and cannellini beans. Pour dressing through and toss.",
      "Top with crumbled cheese and torn basil. Serve warm or room temperature.",
    ],
    notes: "Keeps 3 days. Add fresh herbs before serving. Spelt or barley work if you can't find farro.",
  },
  {
    id: "r11",
    title: "Black Bean Tacos",
    tag: "Vegan", time: "25 min", serves: 4,
    medDiet: false,
    medNote: "Mexican-inspired and outside Mediterranean tradition, but black beans have extraordinary antioxidant content that earns a place in any healthy repertoire.",
    whyMakeIt: "Black beans have antioxidant levels comparable to berries. Purple cabbage anthocyanins are potent antioxidants. Corn tortillas are gluten-free with more complex flavour than flour. Don't skip charring them.",
    nutrients: ["Antioxidants", "Fibre", "Folate", "Magnesium", "Plant Protein"],
    ingredients: [
      "2 cans black beans, drained",
      "8–12 small corn or flour tortillas",
      "2 avocados",
      "1 cup purple cabbage, shredded",
      "1 cup cherry tomatoes, halved",
      "1 jalapeño, finely sliced",
      "Juice of 1 lime",
      "Fresh coriander",
      "1 tsp cumin",
      "1 tsp smoked paprika",
      "½ tsp garlic powder",
      "2 tbsp olive oil",
      "Salt",
      "Greek yoghurt or sour cream to serve",
      "Hot sauce to serve",
    ],
    steps: [
      "Heat olive oil over medium-high. Add black beans with cumin, paprika and garlic powder. Season with salt. Cook 4–5 min until slightly crispy.",
      "Mash avocados with lime juice, salt and coriander into guacamole.",
      "Toss cabbage with lime juice and a pinch of salt.",
      "Warm tortillas directly over gas flame or dry pan until charred in spots.",
      "Spread guacamole on tortilla. Pile on beans, cabbage, tomatoes, jalapeño and coriander. Finish with yoghurt and hot sauce.",
    ],
    notes: "Fast and great for kids. Store components separately for leftovers — assemble fresh.",
  },
  {
    id: "r12",
    title: "Edamame Orzotto",
    tag: "Vegetarian", time: "35 min", serves: 4,
    medDiet: true,
    medNote: "Orzo is a pasta — deeply Italian. Finished with olive oil and parmesan, this is a modern Mediterranean dish.",
    whyMakeIt: "Orzotto uses orzo cooked risotto-style, giving all the creaminess of risotto with a fraction of the effort. Edamame is exceptionally high in folate and plant protein. The starchy pasta water creates a silky sauce without cream.",
    nutrients: ["Folate", "Plant Protein", "Magnesium", "Fibre", "Vitamin K"],
    ingredients: [
      "300g orzo pasta",
      "2 cups frozen edamame, thawed",
      "1L vegetable stock, kept warm",
      "1 small onion, finely diced",
      "3 cloves garlic, minced",
      "125ml dry white wine",
      "60g parmesan, finely grated",
      "2 tbsp extra virgin olive oil",
      "Zest and juice of 1 lemon",
      "Large handful fresh mint or basil",
      "Salt and pepper",
    ],
    steps: [
      "Heat olive oil in a wide pan over medium. Soften onion 5 min. Add garlic and cook 1 min.",
      "Add orzo and stir 1–2 min to toast slightly. Pour in wine and stir until absorbed.",
      "Add warm stock one ladle at a time, stirring frequently, adding more as each is absorbed. Continue 15–18 min until orzo is al dente and creamy.",
      "Stir edamame through in the last 3 min to warm through.",
      "Remove from heat. Stir in parmesan, lemon zest and juice. Season generously. Fold through fresh herbs. Serve immediately.",
    ],
    notes: "Orzotto sets quickly — serve immediately. To reheat, add a splash of water or stock over gentle heat.",
  },
];

const TAG_COLORS = {
  "Salad":       { bg: "#c0392b", light: "#fdf0ef" },
  "Vegan":       { bg: "#27ae60", light: "#eefaf3" },
  "Slow Cook":   { bg: "#8e44ad", light: "#f5eefa" },
  "Fish":        { bg: "#2980b9", light: "#eaf4fb" },
  "Vegetarian":  { bg: "#d35400", light: "#fef3ed" },
};

// ─── SUPABASE HELPERS ────────────────────────────────────────────────────────
async function dbLoadRecipes() {
  const { data, error } = await supabase.from("recipes").select("*").order("created_at");
  if (error) { console.error("Load recipes error:", error); return null; }
  return data.map(row => row.data);
}

async function dbSaveRecipe(recipe) {
  const { error } = await supabase.from("recipes").upsert({ id: recipe.id, data: recipe }, { onConflict: "id" });
  if (error) console.error("Save recipe error:", error);
}

async function dbDeleteRecipe(id) {
  const { error } = await supabase.from("recipes").delete().eq("id", id);
  if (error) console.error("Delete recipe error:", error);
}

async function dbLoadUserdata() {
  const { data, error } = await supabase.from("userdata").select("*");
  if (error) { console.error("Load userdata error:", error); return null; }
  const result = {};
  data.forEach(row => { result[row.key] = row.value; });
  return result;
}

async function dbSaveUserdata(key, value) {
  const { error } = await supabase.from("userdata").upsert({ key, value }, { onConflict: "key" });
  if (error) console.error("Save userdata error:", error);
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const StarIcon = ({ filled, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#f39c12" : "none"} stroke={filled ? "#f39c12" : "#aaa"} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const PrintIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);
const ShoppingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const LeafIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2C7 5 5 7 5 7"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (pw === import.meta.env.VITE_APP_PASSWORD) {
      sessionStorage.setItem("rv_auth", "1");
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#1a1a18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{
        textAlign: "center", padding: "48px 40px",
        background: "#faf8f4", maxWidth: "360px", width: "100%",
        animation: shake ? "shake 0.4s ease" : "none",
      }}>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }`}</style>
        <p style={{ color: "#aaa", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "sans-serif", margin: "0 0 12px" }}>
          Heart-Healthy · Mediterranean
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: "normal", fontStyle: "italic", color: "#1a1a18", margin: "0 0 32px" }}>
          Recipe Vault
        </h1>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="Password"
          autoFocus
          style={{
            width: "100%", padding: "12px 14px", border: `1px solid ${error ? "#c0392b" : "#ddd"}`,
            borderRadius: "2px", fontFamily: "'Georgia', serif", fontSize: "16px",
            background: "#fff", boxSizing: "border-box", outline: "none",
            marginBottom: "8px",
          }}
        />
        {error && <p style={{ color: "#c0392b", fontSize: "12px", fontFamily: "sans-serif", margin: "0 0 12px" }}>Incorrect password</p>}
        <button onClick={attempt} style={{
          width: "100%", background: "#1a1a18", color: "#fff", border: "none",
          padding: "13px", cursor: "pointer", fontFamily: "sans-serif",
          fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase",
          marginTop: error ? "0" : "12px",
        }}>
          Enter
        </button>
      </div>
    </div>
  );
}

// ─── PRINT VIEW ──────────────────────────────────────────────────────────────
function PrintView({ recipe, onClose }) {
  const tc = TAG_COLORS[recipe.tag] || { bg: "#555" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "4px", maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", padding: "40px", fontFamily: "'Georgia', serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <span style={{ background: tc.bg, color: "#fff", fontSize: "10px", fontFamily: "sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "2px" }}>{recipe.tag}</span>
            <h1 style={{ fontSize: "26px", fontWeight: "normal", fontStyle: "italic", margin: "10px 0 4px", color: "#111" }}>{recipe.title}</h1>
            <p style={{ margin: 0, color: "#666", fontSize: "13px", fontFamily: "sans-serif" }}>{recipe.time} · Serves {recipe.serves}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}><CloseIcon /></button>
        </div>
        <p style={{ fontSize: "14px", lineHeight: 1.8, color: "#444", borderLeft: `3px solid ${tc.bg}`, paddingLeft: "14px", margin: "0 0 24px", fontStyle: "italic" }}>{recipe.whyMakeIt}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          <div>
            <h3 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", color: "#888", margin: "0 0 12px" }}>Ingredients</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ padding: "6px 0", borderBottom: "1px solid #eee", fontSize: "13px", color: "#333", display: "flex", gap: "8px" }}>
                  <span style={{ color: tc.bg }}>—</span>{ing}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", color: "#888", margin: "0 0 12px" }}>Method</h3>
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {recipe.steps.map((step, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #eee", fontSize: "13px", color: "#333", display: "flex", gap: "10px", lineHeight: 1.6 }}>
                  <span style={{ color: tc.bg, fontFamily: "sans-serif", fontWeight: "700", fontSize: "11px", flexShrink: 0, marginTop: "3px" }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
        {recipe.notes && (
          <div style={{ marginTop: "20px", background: "#f9f6f0", borderLeft: `3px solid ${tc.bg}`, padding: "12px 16px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "sans-serif", color: "#888", display: "block", marginBottom: "4px" }}>Notes</span>
            <p style={{ margin: 0, fontSize: "13px", color: "#444", lineHeight: 1.6 }}>{recipe.notes}</p>
          </div>
        )}
        <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button onClick={() => window.print()} style={{ background: "#1a1a18", color: "#fff", border: "none", padding: "10px 20px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", borderRadius: "2px" }}>Print this recipe</button>
        </div>
      </div>
    </div>
  );
}

// ─── SHOPPING LIST MODAL ──────────────────────────────────────────────────────
function ShoppingModal({ recipes, onClose }) {
  const [selected, setSelected] = useState({});
  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const chosen = recipes.filter(r => selected[r.id]);

  const copyList = () => {
    const text = chosen.map(r => `## ${r.title}\n` + r.ingredients.map(i => `• ${i}`).join("\n")).join("\n\n");
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#faf8f4", borderRadius: "4px", maxWidth: "700px", width: "100%", maxHeight: "90vh", overflowY: "auto", fontFamily: "'Georgia', serif" }}>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "normal", fontStyle: "italic" }}>Shopping List Generator</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}><CloseIcon /></button>
        </div>
        <div style={{ padding: "20px 28px 28px" }}>
          <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#666", fontFamily: "sans-serif" }}>Select the recipes you're cooking this week:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
            {recipes.map(r => {
              const tc = TAG_COLORS[r.tag] || { bg: "#555" };
              return (
                <div key={r.id} onClick={() => toggle(r.id)} style={{ padding: "10px 14px", borderRadius: "3px", cursor: "pointer", border: `2px solid ${selected[r.id] ? tc.bg : "#ddd"}`, background: selected[r.id] ? tc.bg + "15" : "#fff", transition: "all 0.15s" }}>
                  <div style={{ fontSize: "13px", color: "#222", fontStyle: "italic", marginBottom: "2px" }}>{r.title}</div>
                  <div style={{ fontSize: "11px", color: "#888", fontFamily: "sans-serif" }}>{r.time} · serves {r.serves}</div>
                </div>
              );
            })}
          </div>
          {chosen.length > 0 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "13px", fontFamily: "sans-serif", color: "#333", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {chosen.length} recipe{chosen.length > 1 ? "s" : ""} selected
                </h3>
                <button onClick={copyList} style={{ background: "#1a1a18", color: "#fff", border: "none", padding: "7px 14px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px", borderRadius: "2px" }}>Copy list</button>
              </div>
              {chosen.map(r => {
                const tc = TAG_COLORS[r.tag] || { bg: "#555" };
                return (
                  <div key={r.id} style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: tc.bg, flexShrink: 0 }} />
                      <span style={{ fontSize: "14px", fontStyle: "italic", color: "#222" }}>{r.title}</span>
                    </div>
                    <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                      {r.ingredients.map((ing, i) => (
                        <li key={i} style={{ fontSize: "13px", color: "#444", padding: "3px 0", lineHeight: 1.5 }}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "32px", color: "#aaa", fontFamily: "sans-serif", fontSize: "13px" }}>
              Select recipes above to generate your shopping list
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── RECIPE FORM (add + edit) ────────────────────────────────────────────────
function RecipeForm({ initial, onSave, onClose }) {
  const blank = { title: "", tag: "Vegetarian", time: "", serves: 4, medDiet: false, medNote: "", whyMakeIt: "", nutrients: "", ingredients: "", steps: "", notes: "" };
  const toForm = (r) => r ? {
    ...r,
    nutrients: Array.isArray(r.nutrients) ? r.nutrients.join(", ") : r.nutrients || "",
    ingredients: Array.isArray(r.ingredients) ? r.ingredients.join("\n") : r.ingredients || "",
    steps: Array.isArray(r.steps) ? r.steps.join("\n") : r.steps || "",
  } : blank;

  const [form, setForm] = useState(toForm(initial));
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim() || !form.ingredients.trim() || !form.steps.trim()) return;
    onSave({
      id: initial?.id || ("r" + Date.now()),
      title: form.title,
      tag: form.tag,
      time: form.time || "30 min",
      serves: parseInt(form.serves) || 4,
      medDiet: form.medDiet,
      medNote: form.medNote,
      whyMakeIt: form.whyMakeIt,
      nutrients: form.nutrients.split(",").map(s => s.trim()).filter(Boolean),
      ingredients: form.ingredients.split("\n").map(s => s.trim()).filter(Boolean),
      steps: form.steps.split("\n").map(s => s.trim()).filter(Boolean),
      notes: form.notes,
    });
  };

  const fieldStyle = { width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: "2px", fontFamily: "'Georgia', serif", fontSize: "14px", background: "#fff", boxSizing: "border-box", color: "#666" };
  const labelStyle = { fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "sans-serif", color: "#888", display: "block", marginBottom: "4px" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#faf8f4", borderRadius: "4px", maxWidth: "680px", width: "100%", maxHeight: "90vh", overflowY: "auto", fontFamily: "'Georgia', serif" }}>
        <div style={{ padding: "28px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "normal", fontStyle: "italic" }}>{initial ? "Edit Recipe" : "Add New Recipe"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666" }}><CloseIcon /></button>
        </div>
        <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>Recipe Title *</label>
            <input value={form.title} onChange={e => update("title", e.target.value)} style={fieldStyle} placeholder="e.g. Greek Lemon Chicken" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.tag} onChange={e => update("tag", e.target.value)} style={fieldStyle}>
                {Object.keys(TAG_COLORS).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input value={form.time} onChange={e => update("time", e.target.value)} style={fieldStyle} placeholder="35 min" />
            </div>
            <div>
              <label style={labelStyle}>Serves</label>
              <input type="number" value={form.serves} onChange={e => update("serves", e.target.value)} style={fieldStyle} min="1" max="20" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Why Make This?</label>
            <textarea value={form.whyMakeIt} onChange={e => update("whyMakeIt", e.target.value)} style={{ ...fieldStyle, minHeight: "80px", resize: "vertical" }} placeholder="Nutritional rationale, what makes this recipe worth having..." />
          </div>
          <div>
            <label style={labelStyle}>Key Nutrients (comma-separated)</label>
            <input value={form.nutrients} onChange={e => update("nutrients", e.target.value)} style={fieldStyle} placeholder="Iron, Folate, Omega-3, Vitamin C" />
          </div>
          <div>
            <label style={labelStyle}>Ingredients * (one per line)</label>
            <textarea value={form.ingredients} onChange={e => update("ingredients", e.target.value)} style={{ ...fieldStyle, minHeight: "140px", resize: "vertical" }} placeholder={"2 cups brown lentils\n1 onion, diced\n3 cloves garlic, minced"} />
          </div>
          <div>
            <label style={labelStyle}>Method * (one step per line)</label>
            <textarea value={form.steps} onChange={e => update("steps", e.target.value)} style={{ ...fieldStyle, minHeight: "140px", resize: "vertical" }} placeholder={"Heat olive oil over medium heat.\nAdd onion and cook 5 min until softened."} />
          </div>
          <div>
            <label style={labelStyle}>Notes & Tips</label>
            <textarea value={form.notes} onChange={e => update("notes", e.target.value)} style={{ ...fieldStyle, minHeight: "60px", resize: "vertical" }} placeholder="Storage, substitutions, make-ahead tips..." />
          </div>
          <div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginBottom: "8px" }}>
              <input type="checkbox" checked={form.medDiet} onChange={e => update("medDiet", e.target.checked)} />
              <span>Mediterranean Diet aligned</span>
            </label>
            {form.medDiet && (
              <input value={form.medNote} onChange={e => update("medNote", e.target.value)} style={fieldStyle} placeholder="Explain the Mediterranean connection..." />
            )}
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ background: "none", border: "1px solid #ddd", padding: "10px 20px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", borderRadius: "2px", color: "#555" }}>Cancel</button>
            <button onClick={handleSave} style={{ background: "#1a1a18", color: "#fff", border: "none", padding: "10px 24px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "13px", borderRadius: "2px" }}>
              {initial ? "Save Changes" : "Add Recipe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RECIPE DETAIL ────────────────────────────────────────────────────────────
function RecipeDetail({ recipe, userdata, onToggleFav, onVote, onBack, onPrint, onEdit, onDelete }) {
  const tc = TAG_COLORS[recipe.tag] || { bg: "#555", light: "#f5f5f5" };
  const fav = userdata.favourites?.includes(recipe.id);
  const vote = userdata.votes?.[recipe.id] || 0;
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Georgia', serif" }}>
      <div style={{ background: "#1a1a18", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 10, flexWrap: "wrap" }}>
        <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "6px 14px", borderRadius: "2px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px", letterSpacing: "0.05em" }}>← Back</button>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", flex: 1 }}>Recipe Vault</span>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={() => onEdit(recipe)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "6px 12px", borderRadius: "2px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "sans-serif", fontSize: "12px" }}>
            <EditIcon /> Edit
          </button>
          <button onClick={() => onPrint(recipe)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "6px 12px", borderRadius: "2px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "sans-serif", fontSize: "12px" }}>
            <PrintIcon /> Print
          </button>
          <button onClick={() => onToggleFav(recipe.id)} style={{ background: fav ? "#c0392b" : "rgba(255,255,255,0.08)", border: `1px solid ${fav ? "#c0392b" : "rgba(255,255,255,0.15)"}`, color: "#fff", padding: "6px 12px", borderRadius: "2px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "sans-serif", fontSize: "12px" }}>
            <HeartIcon filled={fav} size={14} /> {fav ? "Saved" : "Save"}
          </button>
          {!confirmDelete
            ? <button onClick={() => setConfirmDelete(true)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#e74c3c", padding: "6px 12px", borderRadius: "2px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "sans-serif", fontSize: "12px" }}><TrashIcon /> Delete</button>
            : <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <span style={{ color: "#e74c3c", fontSize: "12px", fontFamily: "sans-serif" }}>Sure?</span>
                <button onClick={onDelete} style={{ background: "#e74c3c", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "2px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px" }}>Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "6px 10px", borderRadius: "2px", cursor: "pointer", fontFamily: "sans-serif", fontSize: "12px" }}>Cancel</button>
              </div>
          }
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ background: tc.bg, color: "#fff", fontSize: "10px", fontFamily: "sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "2px" }}>{recipe.tag}</span>
          {recipe.medDiet && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#27ae60", fontSize: "12px", fontFamily: "sans-serif", background: "#eefaf3", padding: "3px 10px", borderRadius: "20px", border: "1px solid #b7e8c8" }}>
              <LeafIcon /> Mediterranean Diet
            </span>
          )}
          <span style={{ color: "#999", fontFamily: "sans-serif", fontSize: "13px", marginLeft: "auto" }}>{recipe.time} · Serves {recipe.serves}</span>
        </div>

        <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: "normal", fontStyle: "italic", color: "#1a1a18", lineHeight: 1.2, margin: "0 0 12px" }}>{recipe.title}</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "24px" }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => onVote(recipe.id, n)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
              <StarIcon filled={n <= vote} size={18} />
            </button>
          ))}
          <span style={{ fontSize: "12px", color: "#aaa", fontFamily: "sans-serif", marginLeft: "4px" }}>{vote > 0 ? `${vote}/5` : "Rate this recipe"}</span>
        </div>

        <div style={{ borderLeft: `3px solid ${tc.bg}`, paddingLeft: "16px", margin: "0 0 28px" }}>
          <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#444", margin: "0 0 10px", fontStyle: "italic" }}>{recipe.whyMakeIt}</p>
          {recipe.medDiet && recipe.medNote && (
            <p style={{ fontSize: "13px", color: "#27ae60", margin: 0, fontFamily: "sans-serif", display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <span style={{ flexShrink: 0, marginTop: "1px" }}><LeafIcon /></span>{recipe.medNote}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "36px" }}>
          {(recipe.nutrients || []).map(n => (
            <span key={n} style={{ background: tc.light || "#f5f5f5", border: `1px solid ${tc.bg}30`, color: "#555", fontSize: "12px", fontFamily: "sans-serif", padding: "4px 12px", borderRadius: "20px" }}>✦ {n}</span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "40px" }}>
          <div>
            <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", color: "#888", margin: "0 0 14px", fontWeight: "600" }}>Ingredients</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={i} style={{ padding: "8px 0", borderBottom: "1px solid #ede9e0", fontSize: "14px", color: "#333", display: "flex", gap: "10px", lineHeight: 1.5 }}>
                  <span style={{ color: tc.bg, flexShrink: 0 }}>—</span>{ing}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", color: "#888", margin: "0 0 14px", fontWeight: "600" }}>Method</h2>
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {(recipe.steps || []).map((step, i) => (
                <li key={i} style={{ padding: "10px 0", borderBottom: "1px solid #ede9e0", fontSize: "14px", color: "#333", display: "flex", gap: "12px", lineHeight: 1.7 }}>
                  <span style={{ color: tc.bg, fontFamily: "sans-serif", fontWeight: "700", fontSize: "12px", flexShrink: 0, marginTop: "3px", minWidth: "16px" }}>{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {recipe.notes && (
          <div style={{ marginTop: "28px", background: "#f0ece4", borderLeft: `3px solid ${tc.bg}`, padding: "16px 20px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", color: "#888", display: "block", marginBottom: "6px", fontWeight: "600" }}>Notes</span>
            <p style={{ margin: 0, fontSize: "14px", color: "#444", lineHeight: 1.7 }}>{recipe.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function RecipeVault() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("rv_auth") === "1");
  const [recipes, setRecipes] = useState([]);
  const [userdata, setUserdata] = useState({ favourites: [], votes: {} });
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [printRecipe, setPrintRecipe] = useState(null);
  const [showShopping, setShowShopping] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);  // null = closed, false = new, recipe = editing
  const [showAdd, setShowAdd] = useState(false);

  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [filterMed, setFilterMed] = useState(false);
  const [filterFav, setFilterFav] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Load data on mount
  useEffect(() => {
    if (!authed) return;
    (async () => {
      const [dbRecipes, dbUserdata] = await Promise.all([dbLoadRecipes(), dbLoadUserdata()]);

      if (dbRecipes && dbRecipes.length > 0) {
        setRecipes(dbRecipes);
      } else {
        // First run — seed with initial recipes
        setRecipes(INITIAL_RECIPES);
        await Promise.all(INITIAL_RECIPES.map(r => dbSaveRecipe(r)));
      }

      if (dbUserdata) {
        setUserdata({
          favourites: dbUserdata.favourites || [],
          votes: dbUserdata.votes || {},
        });
      }

      setLoaded(true);
    })();
  }, [authed]);

  const saveRecipe = useCallback(async (recipe) => {
    setSaving(true);
    setRecipes(rs => {
      const exists = rs.find(r => r.id === recipe.id);
      return exists ? rs.map(r => r.id === recipe.id ? recipe : r) : [...rs, recipe];
    });
    if (selected?.id === recipe.id) setSelected(recipe);
    await dbSaveRecipe(recipe);
    setSaving(false);
    setEditRecipe(null);
    setShowAdd(false);
  }, [selected]);

  const deleteRecipe = useCallback(async (id) => {
    setSaving(true);
    setRecipes(rs => rs.filter(r => r.id !== id));
    await dbDeleteRecipe(id);
    setSaving(false);
    setView("grid");
    setSelected(null);
  }, []);

  const toggleFav = useCallback(async (id) => {
    setUserdata(u => {
      const favs = u.favourites || [];
      const next = { ...u, favourites: favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id] };
      dbSaveUserdata("favourites", next.favourites);
      return next;
    });
  }, []);

  const setVote = useCallback(async (id, score) => {
    setUserdata(u => {
      const next = { ...u, votes: { ...(u.votes || {}), [id]: score } };
      dbSaveUserdata("votes", next.votes);
      return next;
    });
  }, []);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;
  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#1a1a18", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", color: "rgba(255,255,255,0.4)", fontSize: "16px", fontStyle: "italic" }}>
      Loading your recipe vault…
    </div>
  );

  const tags = ["All", ...Object.keys(TAG_COLORS)];
  const filtered = recipes.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) ||
      (r.nutrients || []).some(n => n.toLowerCase().includes(q)) ||
      (r.ingredients || []).some(i => i.toLowerCase().includes(q)) ||
      (r.whyMakeIt || "").toLowerCase().includes(q) ||
      r.tag.toLowerCase().includes(q);
    const matchTag = filterTag === "All" || r.tag === filterTag;
    const matchMed = !filterMed || r.medDiet;
    const matchFav = !filterFav || (userdata.favourites || []).includes(r.id);
    return matchSearch && matchTag && matchMed && matchFav;
  }).sort((a, b) => {
    if (sortBy === "az") return a.title.localeCompare(b.title);
    if (sortBy === "rating") return ((userdata.votes?.[b.id] || 0) - (userdata.votes?.[a.id] || 0));
    if (sortBy === "time") return (parseInt(a.time) || 999) - (parseInt(b.time) || 999);
    return 0;
  });

  if (view === "detail" && selected) {
    return (
      <>
        <RecipeDetail
          recipe={selected}
          userdata={userdata}
          onToggleFav={toggleFav}
          onVote={setVote}
          onBack={() => { setView("grid"); setSelected(null); }}
          onPrint={setPrintRecipe}
          onEdit={(r) => setEditRecipe(r)}
          onDelete={() => deleteRecipe(selected.id)}
        />
        {printRecipe && <PrintView recipe={printRecipe} onClose={() => setPrintRecipe(null)} />}
        {editRecipe && <RecipeForm initial={editRecipe} onSave={saveRecipe} onClose={() => setEditRecipe(null)} />}
      </>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f4", fontFamily: "'Georgia', serif" }}>

      {/* Header */}
      <div style={{ background: "#1a1a18", padding: "40px 24px 36px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "sans-serif", margin: "0 0 10px" }}>
          Heart-Healthy · Mediterranean · Nutrient-Dense
        </p>
        <h1 style={{ color: "#fff", fontSize: "clamp(28px, 6vw, 48px)", fontWeight: "normal", fontStyle: "italic", margin: "0 0 6px", lineHeight: 1.1 }}>
          Recipe Vault
        </h1>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", fontFamily: "sans-serif", margin: "12px 0 0" }}>
          {recipes.length} recipes · {(userdata.favourites || []).length} favourites
          {saving && <span style={{ marginLeft: "12px", color: "rgba(255,255,255,0.25)" }}>saving…</span>}
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
          <button onClick={() => setShowShopping(true)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "9px 18px", borderRadius: "2px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "sans-serif", fontSize: "12px", letterSpacing: "0.06em" }}>
            <ShoppingIcon /> Shopping List
          </button>
          <button onClick={() => setShowAdd(true)} style={{ background: "#fff", border: "none", color: "#1a1a18", padding: "9px 18px", borderRadius: "2px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "sans-serif", fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em" }}>
            <PlusIcon /> Add Recipe
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ background: "#fff", borderBottom: "1px solid #ede9e0", padding: "16px 20px", position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }}><SearchIcon /></span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ingredient, nutrient…"
            style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #ddd", borderRadius: "2px", fontFamily: "'Georgia', serif", fontSize: "14px", background: "#faf8f4", boxSizing: "border-box", outline: "none" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "18px" }}>×</button>}
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
          {tags.map(tag => (
            <button key={tag} onClick={() => setFilterTag(tag)} style={{ background: filterTag === tag ? "#1a1a18" : "transparent", color: filterTag === tag ? "#fff" : "#666", border: `1px solid ${filterTag === tag ? "#1a1a18" : "#ddd"}`, padding: "5px 12px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "sans-serif", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{tag}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
            <button onClick={() => setFilterMed(f => !f)} style={{ background: filterMed ? "#27ae60" : "transparent", color: filterMed ? "#fff" : "#666", border: `1px solid ${filterMed ? "#27ae60" : "#ddd"}`, padding: "5px 10px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: "5px" }}><LeafIcon /> Med Diet</button>
            <button onClick={() => setFilterFav(f => !f)} style={{ background: filterFav ? "#c0392b" : "transparent", color: filterFav ? "#fff" : "#666", border: `1px solid ${filterFav ? "#c0392b" : "#ddd"}`, padding: "5px 10px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: "5px" }}><HeartIcon filled={filterFav} size={12} /> Saved</button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ border: "1px solid #ddd", background: "#fff", padding: "5px 8px", fontSize: "11px", fontFamily: "sans-serif", borderRadius: "2px", color: "#666", cursor: "pointer" }}>
              <option value="default">Sort: Default</option>
              <option value="az">A–Z</option>
              <option value="rating">Top Rated</option>
              <option value="time">Quickest</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px 20px 0", color: "#aaa", fontSize: "12px", fontFamily: "sans-serif" }}>
        {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}{search && ` matching "${search}"`}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", color: "#aaa", fontStyle: "italic", fontSize: "16px" }}>
          No recipes found.{" "}
          <button onClick={() => { setSearch(""); setFilterTag("All"); setFilterMed(false); setFilterFav(false); }} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontFamily: "'Georgia', serif", fontSize: "16px", fontStyle: "italic" }}>Clear filters</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1px", background: "#ede9e0", margin: "12px 0 0", padding: "1px" }}>
          {filtered.map(r => {
            const tc = TAG_COLORS[r.tag] || { bg: "#555", light: "#f5f5f5" };
            const fav = (userdata.favourites || []).includes(r.id);
            const vote = userdata.votes?.[r.id] || 0;
            return (
              <div key={r.id} onClick={() => { setSelected(r); setView("detail"); }} style={{ background: "#fff", padding: "24px 20px", cursor: "pointer", transition: "background 0.12s", position: "relative" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f1ea"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                {fav && <span style={{ position: "absolute", top: "14px", right: "14px", color: "#c0392b" }}><HeartIcon filled size={15} /></span>}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                  <span style={{ background: tc.bg, color: "#fff", fontSize: "9px", fontFamily: "sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", padding: "3px 8px", borderRadius: "2px" }}>{r.tag}</span>
                  {r.medDiet && <span style={{ color: "#27ae60", fontSize: "11px", fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: "3px" }}><LeafIcon /></span>}
                  <span style={{ color: "#bbb", fontSize: "11px", fontFamily: "sans-serif", marginLeft: "auto" }}>{r.time}</span>
                </div>
                <h2 style={{ fontSize: "17px", fontWeight: "normal", fontStyle: "italic", color: "#1a1a18", margin: "0 0 8px", lineHeight: 1.3 }}>{r.title}</h2>
                <p style={{ fontSize: "13px", color: "#666", margin: "0 0 12px", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.whyMakeIt}</p>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "10px" }}>
                  {(r.nutrients || []).slice(0, 3).map(n => (
                    <span key={n} style={{ background: "#f0ece4", color: "#888", fontSize: "10px", fontFamily: "sans-serif", padding: "2px 7px", borderRadius: "20px" }}>{n}</span>
                  ))}
                </div>
                {vote > 0 && <div style={{ display: "flex", gap: "2px" }}>{[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= vote} size={12} />)}</div>}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ padding: "28px", textAlign: "center", color: "#ccc", fontSize: "12px", fontFamily: "sans-serif", letterSpacing: "0.05em" }}>
        Recipes saved to Supabase · Tap any card to view, edit, or delete
      </div>

      {showShopping && <ShoppingModal recipes={recipes} onClose={() => setShowShopping(false)} />}
      {showAdd && <RecipeForm initial={null} onSave={saveRecipe} onClose={() => setShowAdd(false)} />}
      {printRecipe && <PrintView recipe={printRecipe} onClose={() => setPrintRecipe(null)} />}
    </div>
  );
}