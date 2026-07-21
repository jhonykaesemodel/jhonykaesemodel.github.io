export type Reservoir='air'|'leaf'|'body'|'soil'|'ocean'|'deep'|'rock'
export const reservoirs:Record<Reservoir,{label:string;time:string;x:number;y:number}>={air:{label:'atmosphere',time:'years',x:50,y:14},leaf:{label:'living plant',time:'days → decades',x:25,y:38},body:{label:'animal',time:'hours → years',x:17,y:65},soil:{label:'soil',time:'years → centuries',x:42,y:75},ocean:{label:'surface ocean',time:'months → decades',x:76,y:39},deep:{label:'deep ocean',time:'centuries',x:77,y:70},rock:{label:'rock & fossil carbon',time:'millions of years',x:52,y:94}}
export const routes:Record<Reservoir,{to:Reservoir;verb:string}[]>={air:[{to:'leaf',verb:'photosynthesis'},{to:'ocean',verb:'dissolve'}],leaf:[{to:'air',verb:'respiration'},{to:'body',verb:'be eaten'},{to:'soil',verb:'die & decompose'}],body:[{to:'air',verb:'respiration'},{to:'soil',verb:'waste & decay'}],soil:[{to:'air',verb:'decomposition'},{to:'rock',verb:'burial'}],ocean:[{to:'air',verb:'outgas'},{to:'deep',verb:'mix & sink'}],deep:[{to:'ocean',verb:'upwell'},{to:'rock',verb:'sediment'}],rock:[{to:'air',verb:'combustion'},{to:'air',verb:'volcanism'}]}
export const story=[
 {title:'Carbon has no home.',body:'The same atom can be gas above a city, sugar inside a leaf, or carbonate beneath an ocean.',note:'Matter moves; the identity of the carbon atom persists.'},
 {title:'A leaf borrows from air.',body:'Photosynthesis draws carbon dioxide into living chemistry using energy from sunlight.',note:'Carbon becomes part of sugars and new tissue.'},
 {title:'Life passes it onward.',body:'Respiration, eating, waste, and decay continually exchange carbon among organisms, soil, and air.',note:'The fast carbon cycle is a branching web, not a tidy circle.'},
 {title:'The ocean inhales and exhales.',body:'Carbon dioxide dissolves, reacts, returns to air, or travels into deep water for centuries.',note:'Ocean uptake depends on chemistry, biology, circulation, and temperature.'},
 {title:'Some paths are almost still.',body:'Weathering, sediment, rock, subduction, and volcanism move carbon over geological time.',note:'Slow storage can last millions of years.'},
 {title:'We opened a fast door.',body:'Burning fossil fuels moves ancient carbon into the active atmosphere in moments.',note:'A slow-cycle reservoir is being transferred into the fast cycle.'},
]
export function destinations(r:Reservoir){return routes[r].map(x=>x.to)}
export function move(r:Reservoir,to:Reservoir){if(!destinations(r).includes(to))throw Error('invalid carbon route');return to}
