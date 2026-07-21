export type Mode = 'blind-spot' | 'fovea' | 'context' | 'change'

export const modes: Array<{ id: Mode; name: string; question: string }> = [
  { id: 'blind-spot', name: 'The missing place', question: 'Where does sight contain no signal?' },
  { id: 'fovea', name: 'The sharp center', question: 'How little is actually detailed?' },
  { id: 'context', name: 'The interpreted color', question: 'Does a color belong to an object?' },
  { id: 'change', name: 'The edited world', question: 'What survives a disruption?' },
]

export const story: Array<{ mode: Mode; title: string; body: string; note: string }> = [
  { mode: 'fovea', title: 'Seeing feels complete.', body: 'A stable, detailed world seems to arrive all at once. Move the focus across this scene.', note: 'Only a small central region is sampled with highest acuity. Your eyes move several times each second.' },
  { mode: 'blind-spot', title: 'Every eye has a hole in its image.', body: 'Close your left eye. Fix your right eye on the cross. Move closer or farther until the amber point disappears.', note: 'The optic nerve leaves the retina here. There are no photoreceptors in that patch.' },
  { mode: 'blind-spot', title: 'But you never see a hole.', body: 'The missing point is not replaced by blackness. Nearby pattern and the other eye support a continuous experience.', note: 'What is absent from awareness can still be absent from the retinal signal.' },
  { mode: 'context', title: 'Color is a relationship.', body: 'The two center tiles have exactly the same browser color. Their surroundings make them feel unequal.', note: 'Vision estimates surfaces under illumination; it does not report wavelengths without context.' },
  { mode: 'change', title: 'Attention is part of seeing.', body: 'Two scenes alternate with a blank interruption. Find the element that changes.', note: 'Large changes can escape awareness when motion transients are interrupted and attention is elsewhere.' },
  { mode: 'fovea', title: 'Perception is a useful construction.', body: 'The brain is not painting over a defective camera. It is maintaining the actionable world you need now.', note: 'The miracle is not that perception can fail. It is how much stability it creates from limited, moving samples.' },
]
