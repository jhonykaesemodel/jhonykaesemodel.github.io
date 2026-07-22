export const C=299792458

export function gamma(beta:number){
 const speed=Math.abs(beta)
 if(speed>=1)return Infinity
 return 1/Math.sqrt(1-speed*speed)
}

export function properTime(coordinateTime:number,beta:number){return coordinateTime/gamma(beta)}
export function movingClockRate(beta:number){return 1/gamma(beta)}
export function lightPathFactor(beta:number){return gamma(beta)}
export function reunionDifference(coordinateTime:number,beta:number){return coordinateTime-properTime(coordinateTime,beta)}
export function lorentzTime(t:number,xLightSeconds:number,beta:number){return gamma(beta)*(t-beta*xLightSeconds)}
export function simultaneityOffset(distanceLightSeconds:number,beta:number){return-gamma(beta)*beta*distanceLightSeconds}

export type StoryScene={
 title:string
 body:string
 note:string
 beta:number
 perspective:'ship'|'earth'
 compare:boolean
}

export const story:StoryScene[]=[
 {title:'Begin together.',body:'Earth and the ship carry identical light clocks. At departure they are side by side, and both read zero.',note:'A light clock is a thought experiment: one tick is a pulse traveling to a mirror and back.',beta:0,perspective:'earth',compare:true},
 {title:'Ride beside the clock.',body:'Inside the ship, the pulse goes straight up and down. Your heartbeat, thoughts, and clock all feel completely normal.',note:'Every observer at rest beside a good clock measures one ordinary local second per second.',beta:.72,perspective:'ship',compare:false},
 {title:'Now watch from Earth.',body:'While the light rises, the ship moves sideways. From Earth, that same pulse must follow a longer diagonal path to catch the mirror.',note:'Changing viewpoint changes the measured distance between the pulse’s departure and arrival.',beta:.72,perspective:'earth',compare:true},
 {title:'Light cannot make up the distance.',body:'Both observers measure light at the same speed. A longer path at the same speed must take more Earth time, so Earth counts fewer ticks on the moving clock.',note:'At 0.80 c, the diagonal light path—and each moving tick—takes 1.667 times as much Earth time.',beta:.8,perspective:'earth',compare:true},
 {title:'The ship is not broken.',body:'Beside the ship clock, its pulse still travels the short vertical path. The disagreement is about how separated events are timed—not a slow mechanism or visual delay.',note:'For uniform relative motion, each inertial observer judges the other’s moving clock to tick slowly.',beta:.8,perspective:'ship',compare:false},
 {title:'Reunite and compare.',body:'Send the ship out and bring it back. At the same final place and moment, the clocks can be compared directly: the traveling path contains less elapsed time.',note:'The laboratory idealizes the journey as equal constant-speed legs with an instantaneous turnaround.',beta:.8,perspective:'earth',compare:true},
]
