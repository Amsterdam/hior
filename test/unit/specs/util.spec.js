import { filteredText } from '@/services/util'

describe('util', () => {
  it('highlights text fragments in text', () => {
    expect(filteredText('abc', 'b')).toEqual('a<span class="filterText">b</span>c')
    expect(filteredText('abc', 'bc')).toEqual('a<span class="filterText">bc</span>')
    expect(filteredText('abc', 'abc')).toEqual('<span class="filterText">abc</span>')
    expect(filteredText('abc abc', 'b')).toEqual('a<span class="filterText">b</span>c a<span class="filterText">b</span>c')
    expect(filteredText('abc', 'd')).toEqual('abc')
    expect(filteredText('', '')).toEqual('')
    expect(filteredText('', 'x')).toEqual('')
  })
})
