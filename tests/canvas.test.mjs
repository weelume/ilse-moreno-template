import {test} from 'node:test'
import assert from 'node:assert/strict'
import {constrain,zoomAroundCenter,languagePath} from '../src/features/site-templates/catalog/ilse-moreno/canvas-model.ts'
const bounds={left:64,top:64,right:1680,bottom:1210}
test('极端拖拽仍保留可见作品',()=>{for(const z of [.5,1,2])for(const x of [-1e6,1e6]){const p=constrain({x,y:x},z,1248,760,bounds);assert.ok(p.x+bounds.right*z>=416);assert.ok(p.x+bounds.left*z<=832);assert.ok(p.y+bounds.bottom*z>=760/3)}})
test('画布小于视口时中心一致',()=>{const p=constrain({x:999,y:999},.5,1248,760,bounds);assert.equal(p.x+bounds.left*.5,(1248-(1680-64)*.5)/2);assert.equal(p.y+bounds.top*.5,(760-(1210-64)*.5)/2)})
test('中心缩放往返不漂移',()=>{const p={x:-180,y:-70},q=zoomAroundCenter(p,1,2,834,760);assert.deepEqual(zoomAroundCenter(q,2,1,834,760),p)})
test('中英切换保留案例查询和锚点',()=>{const base='/templates/ilse-moreno/site',path=base+'/work/waymark';assert.equal(languagePath(path,base,'zh','?from=test','#detail'),base+'/en/work/waymark?from=test#detail');assert.equal(languagePath(base+'/en/work/waymark',base+'/en','en','?from=test','#detail'),path+'?from=test#detail');assert.equal(languagePath('/en','/en','en','',''),'/')})
