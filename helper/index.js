export class CurrentUser {
    _currentUser = null;

    static get() {
        return CurrentUser._currentUser;
    }

    static set(a) {
        CurrentUser._currentUser = a;
    }
}