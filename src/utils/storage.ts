const localStorageDelegateFactory = function () {
  const fakeLocalStorage = {
    getItem () { return null },
    setItem () {}, // eslint-disable-line @typescript-eslint/no-empty-function
    removeItem () {}, // eslint-disable-line @typescript-eslint/no-empty-function
    clear () {} // eslint-disable-line @typescript-eslint/no-empty-function
  }

  const isSupported = function () {
    try {
      window.localStorage.setItem('localStorage', 1)
      window.localStorage.removeItem('localStorage')
      return true
    } catch (e) {
      return false
    }
  }

  if (isSupported()) { return window.localStorage } else { return fakeLocalStorage }
}

const localStorageDelegate = localStorageDelegateFactory()

export const localStorageGetItem = (key: string) => localStorageDelegate.getItem(key)
export const localStorageSetItem = (key: string, value) => localStorageDelegate.setItem(key, value)
export const localStorageRemoveItem = (key: string) => localStorageDelegate.removeItem(key)
window.localStorageSetItem = localStorageSetItem 

window.addEventListener('storage', function (e) {
  console.log('storage event', e)
})