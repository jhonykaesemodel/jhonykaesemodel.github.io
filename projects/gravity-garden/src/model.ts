export type Body={x:number;y:number;vx:number;vy:number}
export const story=[
 {title:'Let it go.',body:'With no sideways motion, gravity draws the small world straight inward.',note:'Gravity has not switched on. It was there all along.'},
 {title:'Now throw it sideways.',body:'While gravity bends the path down, sideways motion keeps carrying the world beyond the surface.',note:'An orbit is continuous free fall.'},
 {title:'One throw. Three futures.',body:'Too slow collides. A balanced throw closes into an orbit. Fast enough never returns.',note:'The outcome comes from position and velocity together.'},
 {title:'Closer means faster.',body:'Near the central body, the same inverse-square attraction bends the path more strongly.',note:'Bound orbits sweep equal areas in equal times.'},
 {title:'Gravity never lets go.',body:'Even far away, attraction weakens with distance squared; it does not end at an invisible border.',note:'The field shown is visual amplification, not material fabric.'},
]
export function acceleration(b:Body,mu=1){const r2=b.x*b.x+b.y*b.y,r=Math.sqrt(r2),f=-mu/(r2*r);return{x:f*b.x,y:f*b.y}}
export function stepBody(b:Body,dt=.004,mu=1):Body{const a=acceleration(b,mu);const vx=b.vx+a.x*dt,vy=b.vy+a.y*dt;return{x:b.x+vx*dt,y:b.y+vy*dt,vx,vy}}
export function energy(b:Body,mu=1){return .5*(b.vx*b.vx+b.vy*b.vy)-mu/Math.hypot(b.x,b.y)}
export function classify(b:Body,planetRadius=.22,mu=1){if(Math.hypot(b.x,b.y)<=planetRadius)return'collision';return energy(b,mu)>=0?'escape':'bound'}
export function trace(speed:number,mu=1,count=2200){let b:Body={x:1,y:0,vx:0,vy:speed};const points:Body[]=[b];for(let i=0;i<count;i++){b=stepBody(b,.004,mu);points.push(b);if(Math.hypot(b.x,b.y)<.22||Math.hypot(b.x,b.y)>3.2)break}return points}
