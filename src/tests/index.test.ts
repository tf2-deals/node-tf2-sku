import SKU, { Item } from '../index';

test('Mann Co. Supply Crate Key from object', () => {
  expect(SKU.fromObject({ defindex: 5021, quality: 6 })).toEqual('5021;6');
});

test('Mann Co. Supply Crate Key from string', () => {
  const item: Item = SKU.loadDefaults({ defindex: 5021, quality: 6 });

  expect(SKU.fromString('5021;6')).toEqual(item);
});
