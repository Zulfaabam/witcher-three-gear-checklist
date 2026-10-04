import test from 'node:test';
import assert from 'node:assert/strict';
import { allIds, sets, idsForSet, parseProgress } from './data.js';

test('catalog IDs stay distinct across every school, tier, and extra', () => {
  assert.equal(new Set(allIds).size, allIds.length);
  assert.equal(sets.filter(s => s.category === 'witcher').length, 7);
  assert.equal(idsForSet(sets.find(s => s.id === 'viper')).length, 8);
  assert.equal(idsForSet(sets.find(s => s.id === 'forgotten-wolven')).length, 18);
  assert.equal(idsForSet(sets.find(s => s.id === 'feline')).length, 31);
});

test('saved progress accepts only known checked items', () => {
  const id = allIds[0];
  assert.deepEqual(parseProgress(JSON.stringify({[id]:true, unknown:true, [allIds[1]]:'true'})), {[id]:true});
  assert.deepEqual(parseProgress(null), {});
  assert.throws(() => parseProgress('{'));
  assert.throws(() => parseProgress('[]'));
  assert.throws(() => parseProgress('null'));
});
