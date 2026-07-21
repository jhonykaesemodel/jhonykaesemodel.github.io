export type Layer='world'|'camera'|'lidar'|'detect'|'track'|'forecast'
export const layers:Layer[]=['world','camera','lidar','detect','track','forecast']
export type Evidence={base:number;occlusion:number;rain:number;sensor:number}
export function confidence(e:Evidence){return Math.max(0,Math.min(1,e.base*(1-.55*e.occlusion)*(1-.35*e.rain)*(e.sensor?.8:1)))}
export function visible(score:number,threshold:number){return score>=threshold}
export function forecast(x:number,v:number,seconds:number){return x+v*seconds}
export const story=[
 {title:'A machine begins with measurements.',body:'A camera records an array of brightness and color. Lidar returns sparse distances. Neither sensor delivers “a pedestrian.”',note:'Sensors are selective, noisy views of one physical scene.'},
 {title:'Representation changes the evidence.',body:'Pixels form an image plane. Laser returns become points in three-dimensional space.',note:'Resolution, calibration, timing, and viewpoint shape what can be inferred.'},
 {title:'A model proposes objects.',body:'Patterns in measurements support hypotheses: vehicle, cyclist, pedestrian—with locations and confidence.',note:'A box is an inference, not a fact painted onto the world.'},
 {title:'Time gives identity.',body:'Across frames, detections are associated into tracks. Motion helps separate a persistent actor from momentary noise.',note:'Association can fail during occlusion or crowded interactions.'},
 {title:'Action needs possible futures.',body:'Recent motion and scene context support several plausible paths, each uncertain.',note:'Forecasts are distributions over futures, not knowledge of intention.'},
 {title:'Knowing uncertainty is part of seeing.',body:'Rain, glare, distance, occlusion, and sensor loss should change confidence—and therefore behavior.',note:'This teaching scene is not the architecture of any deployed vehicle.'},
]
