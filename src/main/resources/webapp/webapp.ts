const thymeleaf = __non_webpack_require__('/lib/thymeleaf');
const view = resolve('../template/main.html');

export function get() {
    log.info('Hello from transpiled Typescript server-side code');
    return {
        body: thymeleaf.render(view, {})
    }
}
