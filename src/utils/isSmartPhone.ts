export function isSmartPhone() {
    return !!navigator.userAgent.match(/iPhone|Android.+Mobile/)
}
