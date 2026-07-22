export const C=299792458
export function gamma(beta:number){if(Math.abs(beta)>=1)return Infinity;return 1/Math.sqrt(1-beta*beta)}
export function properTime(coordinateTime:number,beta:number){return coordinateTime/gamma(beta)}
export function lorentzTime(t:number,xLightSeconds:number,beta:number){return gamma(beta)*(t-beta*xLightSeconds)}
export function simultaneityOffset(distanceLightSeconds:number,beta:number){return-gamma(beta)*beta*distanceLightSeconds}
export const story=[
 {title:'Build a clock from light.',body:'A pulse bounces between two mirrors. One round trip is one tick. Light crosses the same distance each time.',note:'In vacuum, every inertial observer measures the same speed of light.'},
 {title:'Let the clock pass you.',body:'From your frame, the mirrors move sideways while the light travels. The pulse follows a longer diagonal path.',note:'The vertical mirror spacing is unchanged in this setup.'},
 {title:'Light does not hurry.',body:'The path is longer, but light still has the same speed. More of your time must pass between ticks of the moving clock.',note:'The factor is γ = 1 / √(1 − v²/c²).'},
 {title:'The disagreement is mutual.',body:'A traveler gliding past says your clock is moving—and judges your ticks slower by the same factor.',note:'There is no absolute rest frame. Comparing separated events also requires a rule for simultaneity.'},
 {title:'A journey can break the symmetry.',body:'If one traveler turns around to reunite, the paths through spacetime differ. Their clocks can show different elapsed times when compared side by side.',note:'The laboratory models constant-speed legs, not the turnaround itself.'},
 {title:'This is not only a thought experiment.',body:'Atomic clocks at different speeds and heights accumulate measurable differences. Satellite navigation corrects for relativity.',note:'Gravity changes clock rates too; that requires general relativity.'},
]
