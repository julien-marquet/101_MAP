import Cookies from "universal-cookie";

export function storeCookie(name, content) {
    const cookies = new Cookies();
    cookies.set(name, content, { path: "/" });
}

export function retrieveCookie(name) {
    const cookies = new Cookies();
    return (cookies.get(name));
}

export function removeCookie(name) {
    const cookies = new Cookies();
    cookies.remove(name);	
}