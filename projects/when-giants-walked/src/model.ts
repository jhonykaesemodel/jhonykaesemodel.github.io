export type Period = "Triassic" | "Jurassic" | "Cretaceous" | "After";
export type Creature = {
  name: string;
  from: number;
  to: number;
  period: Period;
  place: string;
  kind: "runner" | "giant" | "armored" | "hunter" | "bird";
};
export const creatures: Creature[] = [
  {
    name: "Coelophysis",
    from: 228,
    to: 201,
    period: "Triassic",
    place: "North America",
    kind: "runner",
  },
  {
    name: "Plateosaurus",
    from: 214,
    to: 204,
    period: "Triassic",
    place: "Europe",
    kind: "giant",
  },
  {
    name: "Stegosaurus",
    from: 155,
    to: 150,
    period: "Jurassic",
    place: "North America",
    kind: "armored",
  },
  {
    name: "Brachiosaurus",
    from: 154,
    to: 150,
    period: "Jurassic",
    place: "North America",
    kind: "giant",
  },
  {
    name: "Allosaurus",
    from: 155,
    to: 145,
    period: "Jurassic",
    place: "North America",
    kind: "hunter",
  },
  {
    name: "Archaeopteryx",
    from: 150,
    to: 148,
    period: "Jurassic",
    place: "Europe",
    kind: "bird",
  },
  {
    name: "Spinosaurus",
    from: 100,
    to: 94,
    period: "Cretaceous",
    place: "North Africa",
    kind: "hunter",
  },
  {
    name: "Velociraptor",
    from: 75,
    to: 71,
    period: "Cretaceous",
    place: "Asia",
    kind: "runner",
  },
  {
    name: "Tyrannosaurus",
    from: 68,
    to: 66,
    period: "Cretaceous",
    place: "North America",
    kind: "hunter",
  },
  {
    name: "Triceratops",
    from: 68,
    to: 66,
    period: "Cretaceous",
    place: "North America",
    kind: "armored",
  },
];
export const periodAt = (age: number): Period =>
  age > 201
    ? "Triassic"
    : age > 145
      ? "Jurassic"
      : age >= 66
        ? "Cretaceous"
        : "After";
export const aliveAt = (age: number) =>
  creatures.filter((c) => age <= c.from && age >= c.to);
export const overlapped = (a: Creature, b: Creature) =>
  Math.max(a.to, b.to) <= Math.min(a.from, b.from);
export const gapBetween = (a: Creature, b: Creature) =>
  overlapped(a, b) ? 0 : Math.max(a.to, b.to) - Math.min(a.from, b.from);
export const story = [
  {
    age: 235,
    title: "The world was one vast neighborhood.",
    body: "Early dinosaurs appeared in the Triassic while Pangaea joined most land into one supercontinent.",
    note: "Dinosaurs were only one branch among many reptiles; mammals also appeared in the Triassic.",
  },
  {
    age: 152,
    title: "Giants inherited a splitting world.",
    body: "By the Jurassic, Pangaea was breaking apart. Sauropods, stegosaurs, predators, and early birds inhabited changing continents.",
    note: "“Jurassic” describes more than 50 million years—not one frozen ecosystem.",
  },
  {
    age: 97,
    title: "Oceans opened. Flowers spread.",
    body: "During the Cretaceous, separated continents and inland seas reshaped habitats while flowering plants rapidly diversified.",
    note: "Tyrannosaurus did not yet exist when Spinosaurus lived.",
  },
  {
    age: 67,
    title: "Famous does not mean together.",
    body: "Tyrannosaurus and Triceratops overlapped near the very end. Stegosaurus had vanished around 80 million years earlier.",
    note: "The gap between Stegosaurus and T. rex exceeds the time from T. rex to you.",
  },
  {
    age: 66,
    title: "A boundary written in rock.",
    body: "An asteroid impact drove rapid environmental change. Every non-avian dinosaur lineage disappeared.",
    note: "Birds are living dinosaurs; the dinosaur story did not entirely end.",
  },
  {
    age: 0.0003,
    title: "Humans enter in the final breath.",
    body: "Homo sapiens occupy a hairline at the end of this scale. Dinosaurs had already lived across roughly 165 million years.",
    note: "Deep time feels empty only because our intuition evolved for days and lifetimes.",
  },
];
