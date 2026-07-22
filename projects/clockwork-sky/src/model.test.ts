import{describe,expect,it}from'vitest';import{EARTH_POSITION,SUN_POSITION,eclipseOrder,eclipseType,moonPosition,northernTiltTowardSun,phaseName,seasonEarthPosition,seasonName,tideKind}from'./model';
describe('orbital relationships',()=>{
 it('places new Moon between the Sun and Earth',()=>{const moon=moonPosition(0);expect(phaseName(0)).toBe('new moon');expect(moon[0]).toBeGreaterThan(SUN_POSITION[0]);expect(moon[0]).toBeLessThan(EARTH_POSITION[0]);expect(eclipseOrder(0)).toEqual(['Sun','Moon','Earth']);expect(eclipseType(0,0)).toContain('solar')});
 it('places full Moon beyond Earth, inside Earth shadow when aligned',()=>{const moon=moonPosition(Math.PI);expect(phaseName(Math.PI)).toBe('full moon');expect(moon[0]).toBeGreaterThan(EARTH_POSITION[0]);expect(eclipseOrder(Math.PI)).toEqual(['Sun','Earth','Moon']);expect(eclipseType(Math.PI,0)).toContain('lunar')});
 it('requires both phase alignment and a small cross-track offset',()=>{expect(eclipseType(Math.PI/2,0)).toBe('no eclipse');expect(eclipseType(0,.3)).toBe('no eclipse')});
 it('starts at an equinox and tilts north toward the Sun in June',()=>{expect(seasonEarthPosition(0)[0]).toBeCloseTo(0);expect(seasonName(0)).toBe('March equinox');expect(seasonName(Math.PI/2)).toBe('June solstice');expect(northernTiltTowardSun(0)).toBeCloseTo(0);expect(northernTiltTowardSun(Math.PI/2)).toBeGreaterThan(0)});
 it('distinguishes aligned spring tides from right-angle neap tides',()=>{expect(tideKind(0)).toBe('spring tide');expect(tideKind(Math.PI/2)).toBe('neap tide')})
})
