export class CurrentUser {
    _currentUser = null;

    static get() {
        return CurrentUser._currentUser;
    }

    static set(a) {
        CurrentUser._currentUser = a;
    }
}

export function format24HourMin(date) {
    if (!(date instanceof Date)) {
        return '––';
    } else {
        return pad2(date.getHours()) + ':' + pad2(date.getMinutes());
    }
}

function pad2(x) { return x < 10 ? '0' + x : x; }