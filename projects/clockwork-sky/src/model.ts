export type Mode='day'|'seasons'|'phases'|'eclipses'|'tides'
export type Vec3=[number,number,number]
export const SUN_POSITION:Vec3=[-4.5,0,0]
export const EARTH_POSITION:Vec3=[1,0,0]
export const MOON_ORBIT_RADIUS=2.05
export const SEASON_ORBIT_RADIUS=4.3
export const modes:[Mode,string,string][]=[['day','Day & night','Spin beneath a fixed direction of light.'],['seasons','Seasons','Carry one tilted axis around the Sun.'],['phases','Moon phases','Change the angle we see between sunlight and Moon.'],['eclipses','Eclipses','Find the rare crossing where three bodies align.'],['tides','Tides','Watch two gravitational gradients combine.']]
export const moonPosition=(angle:number,height=0,earth:Vec3=EARTH_POSITION):Vec3=>[earth[0]-Math.cos(angle)*MOON_ORBIT_RADIUS,earth[1]+height*2,earth[2]+Math.sin(angle)*MOON_ORBIT_RADIUS]
export const seasonEarthPosition=(angle:number):Vec3=>[-Math.sin(angle)*SEASON_ORBIT_RADIUS,0,-Math.cos(angle)*SEASON_ORBIT_RADIUS]
export const northernTiltTowardSun=(angle:number)=>Math.sin(23.4*Math.PI/180)*Math.sin(angle)
export const phaseName=(angle:number)=>{const i=Math.round((((angle%(Math.PI*2))+Math.PI*2)%(Math.PI*2))/(Math.PI/4))%8;return['new moon','waxing crescent','first quarter','waxing gibbous','full moon','waning gibbous','third quarter','waning crescent'][i]}
export const seasonName=(angle:number,hemisphere:'north'|'south'='north')=>{const names=['March equinox','June solstice','September equinox','December solstice'];const i=Math.round((((angle%(Math.PI*2))+Math.PI*2)%(Math.PI*2))/(Math.PI/2))%4;return hemisphere==='north'?names[i]:[names[2],names[3],names[0],names[1]][i]}
export const eclipseType=(moonAngle:number,nodeOffset:number)=>{const alignment=Math.min(Math.abs(Math.sin(moonAngle)),1);if(alignment>.08||Math.abs(nodeOffset)>.13)return'no eclipse';return Math.cos(moonAngle)>0?'solar eclipse possible':'lunar eclipse possible'}
export const eclipseOrder=(moonAngle:number):['Sun','Moon','Earth']|['Sun','Earth','Moon']=>Math.cos(moonAngle)>=0?['Sun','Moon','Earth']:['Sun','Earth','Moon']
export const tideKind=(moonAngle:number)=>Math.abs(Math.cos(moonAngle))>.72?'spring tide':'neap tide'
export const story=[
 {mode:'day' as Mode,title:'Night is a place in shadow.',body:'Earth turns eastward beneath sunlight. Sunrise and sunset are a moving boundary, not the Sun circling us.',note:'One rotation takes about 23.9 hours relative to distant stars.'},
 {mode:'seasons' as Mode,title:'Tilt, carried around a star.',body:'Earth’s axis keeps nearly the same direction as the planet orbits. Each hemisphere alternately leans toward more direct light and longer days.',note:'Seasons are driven mainly by Earth’s 23.4° tilt—not changing distance from the Sun.'},
 {mode:'phases' as Mode,title:'Half the Moon is always lit.',body:'The phase changes because our viewing angle changes as the Moon orbits Earth. The dark part is not Earth’s shadow.',note:'A synodic cycle from new Moon to new Moon lasts about 29.5 days.'},
 {mode:'eclipses' as Mode,title:'The Moon moves between Sun and Earth.',body:'That new-Moon order can cast the Moon’s narrow shadow onto Earth. At full Moon the order reverses, and Earth can cast its much wider shadow onto the Moon.',note:'The Moon’s orbit is tilted about 5°, so most new and full moons pass above or below the shadow.'},
 {mode:'tides' as Mode,title:'Gravity differs across a world.',body:'The Moon and Sun each pull unevenly across Earth. Their two idealized gradients align at new and full Moon, then cross near quarter Moon.',note:'Real tides are shaped by coastlines, ocean depth, rotation, and local resonance.'},
]
