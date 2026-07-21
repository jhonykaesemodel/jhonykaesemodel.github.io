export const story=[
 {title:'A neuron listens.',body:'Thousands of neighbors meet its branching dendrites. Their messages do not simply pass through.',note:'One neuron is a participant in a network—not a container for one thought.'},
 {title:'Small signals add.',body:'Some inputs lift the membrane toward a threshold. Others pull it away. Old influence leaks away.',note:'This is integration across space and time.'},
 {title:'A threshold is crossed.',body:'Enough excitation arriving close together triggers a new event: an action potential.',note:'Spike size is not proportional to how far the threshold was crossed.'},
 {title:'The pulse regenerates.',body:'The signal is rebuilt along the axon instead of fading like current in a passive wire.',note:'Myelin helps action potentials travel rapidly over long axons.'},
 {title:'One ending becomes another beginning.',body:'At a synapse, the arriving pulse changes the probability that the next neuron will fire.',note:'A thought belongs to coordinated activity across vast, changing networks.'},
]
export type Membrane={v:number;spiked:boolean}
export const REST=-70,THRESHOLD=-50,RESET=-68
export function input(m:Membrane,amount:number):Membrane{const v=m.v+amount;return v>=THRESHOLD?{v:RESET,spiked:true}:{v,spiked:false}}
export function leak(m:Membrane,dt=.1,tau=1):Membrane{return{v:REST+(m.v-REST)*Math.exp(-dt/tau),spiked:false}}
export function potentialY(v:number){return 80-(v+80)*1.35}
