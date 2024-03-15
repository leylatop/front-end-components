import localforage from 'localforage'

// localforage：优先使用 IndexedDB 存储数据 => 浏览器不支持则使用 WebSQL => 浏览器再不支持则使用 localStorage
export default class Saver {
  constructor (id) {
    this.id = id
  }
  async getSaved () {
    const json = await localforage.getItem(this.id) ?? undefined

    try {
      this.json = JSON.parse(json)
    } catch (e) {
      localforage.setItem(this.id, null)
      this.json = {}
    }
    const res = this.json || {}
    return res
  }

  // 发布订阅——store 更新会触发更新存储
  startSaving (store, key) {
    return store.subscribe(() => {
      const state = store.getState()
      const values = state[key]
      this.json[key] = values
      localforage.setItem(this.id, JSON.stringify(this.json))
    })
  }
}
