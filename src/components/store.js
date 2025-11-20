import { proxy } from 'valtio'

const state = proxy({
  intro: true,
  colors: ['#a79393',  '#836c6c', '#695858'],
  decals: [''],
  color: '#a79393',
  decal: 'three2'
})

export { state }
