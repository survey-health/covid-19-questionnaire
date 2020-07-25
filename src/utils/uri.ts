export const absoluteUrl = (path : string) : URL => {
    return new URL(
        path,
        `${window.location.protocol}//${window.location.hostname}${
            window.location.port ? `:${window.location.port}` : ''
        }`
    );
};
