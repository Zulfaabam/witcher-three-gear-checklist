import test from 'node:test';
import assert from 'node:assert/strict';
import { allIds, sets, idsForSet, parseProgress } from './data.ts';

test('catalog IDs stay distinct across every school, tier, and extra', () => {
  assert.equal(new Set(allIds).size, allIds.length);
  assert.equal(sets.filter(s => s.category === 'witcher').length, 7);
  for (const [id, expected] of [['viper', 8], ['forgotten-wolven', 18], ['feline', 31]] as const) {
    const set = sets.find(set => set.id === id);
    assert.ok(set, `Missing catalog set: ${id}`);
    assert.equal(idsForSet(set).length, expected);
  }
});

test('saved progress accepts only known checked items', () => {
  const id = allIds[0];
  assert.deepEqual(parseProgress(JSON.stringify({[id]:true, unknown:true, [allIds[1]]:'true'})), {[id]:true});
  assert.deepEqual(parseProgress(null), {});
  assert.throws(() => parseProgress('{'));
  assert.throws(() => parseProgress('[]'));
  assert.throws(() => parseProgress('null'));
});
