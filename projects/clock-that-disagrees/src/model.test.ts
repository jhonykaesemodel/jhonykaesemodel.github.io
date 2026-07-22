import{describe,expect,it}from'vitest'
import{gamma,lightPathFactor,lorentzTime,movingClockRate,properTime,reunionDifference,simultaneityOffset}from'./model'

describe('special relativity model',()=>{
 it('returns unit factors at rest',()=>{expect(gamma(0)).toBe(1);expect(lightPathFactor(0)).toBe(1);expect(movingClockRate(0)).toBe(1)})
 it('makes the Earth-frame light path and tick duration longer by gamma',()=>{expect(gamma(.8)).toBeCloseTo(5/3);expect(lightPathFactor(.8)).toBeCloseTo(5/3)})
 it('makes the moving clock accumulate the inverse gamma',()=>{expect(movingClockRate(.8)).toBeCloseTo(.6);expect(properTime(10,.8)).toBeCloseTo(6);expect(reunionDifference(10,.8)).toBeCloseTo(4)})
 it('is symmetric in speed direction',()=>{expect(gamma(-.8)).toBeCloseTo(gamma(.8));expect(properTime(10,-.8)).toBeCloseTo(6)})
 it('transforms time and simultaneity consistently',()=>{expect(lorentzTime(0,1,.5)).toBeCloseTo(-.57735,4);expect(simultaneityOffset(1,.5)).toBeCloseTo(-.57735,4)})
})
