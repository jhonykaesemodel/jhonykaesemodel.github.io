export function coinTrials(n:number,random=Math.random){let heads=0;const sequence:boolean[]=[];for(let i=0;i<n;i++){const h=random()<.5;if(h)heads++;if(i<120)sequence.push(h)}return{heads,tails:n-heads,sequence}}
export function binomialProbability(n:number,k:number,p=.5){let c=1;for(let i=1;i<=k;i++)c=c*(n-k+i)/i;return c*p**k*(1-p)**(n-k)}
export function birthdayCollision(n:number,days=365){if(n>days)return 1;let unique=1;for(let i=0;i<n;i++)unique*=((days-i)/days);return 1-unique}
export function posterior(prevalence:number,sensitivity:number,specificity:number){const tp=prevalence*sensitivity,fp=(1-prevalence)*(1-specificity);return tp/(tp+fp)}
export const story=[
 {title:'Predict the next event.',body:'Heads or tails? Probability can describe your uncertainty, but it does not whisper the result in advance.',note:'For this model, each fair toss is independent with probability ½.'},
 {title:'Random does not mean alternating.',body:'Short sequences naturally contain streaks, clumps, and suspicious-looking patches.',note:'A streak does not make the opposite result “due.”'},
 {title:'Ask a crowd instead.',body:'Run many independent tosses. The fraction of heads tends to settle near one half, even while every next toss stays uncertain.',note:'Long-run stability and single-event unpredictability coexist.'},
 {title:'Intuition forgets combinations.',body:'In a room, every person can match every other person. Birthday collisions become likely sooner than most people guess.',note:'With 23 people, a shared birthday has probability about 50.7% under the simple model.'},
 {title:'Evidence begins with a base rate.',body:'Even a good test can produce many false alarms when the condition is rare.',note:'The probability of a condition after a result is not the same as test sensitivity.'},
]
