import test from 'ava';
var fn = function () { return 'foo'; };
test('fn returns foo', function (t) {
    t.is(fn(), 'foo');
});
test('test', function (e) {
    e.true(true);
});
